import { NextRequest, NextResponse } from "next/server";
import { requireAuth, verifyPassword, hashPassword } from "@/lib/auth";
import { getUserById, getUserPasswordHash, updateUserPassword } from "@/lib/db";
import type { ApiResponse } from "@/lib/types";

export async function PUT(
  req: NextRequest
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const userId = await requireAuth();
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Old and new passwords are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 4 characters" },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const passwordHash = await getUserPasswordHash(userId);
    if (!passwordHash || !verifyPassword(oldPassword, passwordHash)) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const newHash = hashPassword(newPassword);
    await updateUserPassword(userId, newHash);

    return NextResponse.json({ success: true, data: null });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to change password" },
      { status: 500 }
    );
  }
}
