import { NextRequest, NextResponse } from "next/server";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { getUserCount, getUserByUsername, createUser } from "@/lib/db";
import type { ApiResponse, User } from "@/lib/types";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<User>>> {
  try {
    // Only allow registration if no user exists
    if (getUserCount() > 0) {
      return NextResponse.json(
        { success: false, error: "Registration is closed" },
        { status: 403 }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 4 characters" },
        { status: 400 }
      );
    }

    if (getUserByUsername(username)) {
      return NextResponse.json(
        { success: false, error: "Username already exists" },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const user = createUser(username, passwordHash);

    // Auto-login after registration
    await setAuthCookie(user.id);

    return NextResponse.json(
      { success: true, data: user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
