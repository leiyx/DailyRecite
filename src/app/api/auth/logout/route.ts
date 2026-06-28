import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import type { ApiResponse } from "@/lib/types";

export async function POST(): Promise<NextResponse<ApiResponse<null>>> {
  try {
    await clearAuthCookie();
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}
