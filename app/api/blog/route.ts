import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts, getAllPosts, createPost, getPostStats } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Stats endpoint for dashboard
    if (searchParams.get("stats") === "true") {
      const stats = await getPostStats();
      return NextResponse.json({ stats });
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const category = searchParams.get("category") || undefined;
    const admin = searchParams.get("admin") === "true";
    const search = searchParams.get("search") || undefined;

    if (admin) {
      const result = await getAllPosts(page, limit, search);
      return NextResponse.json(result);
    }

    const result = await getPublishedPosts(page, limit, category);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /blog GET]", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const post = await createPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("[API /blog POST]", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
