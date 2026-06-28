import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, setAuthCookie } from "@/lib/auth";
import { getUserByUsername } from "@/lib/db";
import type { ApiResponse, User } from "@/lib/types";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = getUserByUsername(username);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    await setAuthCookie(user.id);

    const { password_hash: _, ...safeUser } = user;
    return NextResponse.json({ success: true, data: safeUser });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
