import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import type { ApiResponse, User } from "@/lib/types";

export async function GET(): Promise<
  NextResponse<ApiResponse<{ loggedIn: boolean; user: User | null }>>
> {
  try {
    const userId = await getAuthUserId();
    if (userId === null) {
      return NextResponse.json({
        success: true,
        data: { loggedIn: false, user: null },
      });
    }

    const user = getUserById(userId);
    return NextResponse.json({
      success: true,
      data: { loggedIn: true, user: user ?? null },
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: { loggedIn: false, user: null },
    });
  }
}
