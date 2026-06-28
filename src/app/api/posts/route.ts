import { NextRequest, NextResponse } from "next/server";
import { getPosts, createPost } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import type { ApiResponse, Post } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<Post[]>>> {
  try {
    const posts = await getPosts();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Post>>> {
  try {
    await requireAuth();

    const body = await req.json();
    const { date, title, article, notes } = body;

    if (!date || !article) {
      return NextResponse.json(
        { success: false, error: "Date and article are required" },
        { status: 400 }
      );
    }

    const post = await createPost({
      date,
      title: title || "",
      article,
      notes: notes || "",
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }
    if (
      error instanceof Error &&
      error.message.includes("UNIQUE constraint failed")
    ) {
      return NextResponse.json(
        { success: false, error: "A post for this date already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}
