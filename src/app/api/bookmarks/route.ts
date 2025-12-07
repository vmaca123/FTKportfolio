import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Bookmark from "@/models/Bookmark";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const bookmarks = await Bookmark.find({ userId: session.user.email }).sort({ createdAt: -1 });
  return NextResponse.json(bookmarks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await dbConnect();

  const bookmark = await Bookmark.create({
    userId: session.user.email,
    ...body
  });

  return NextResponse.json(bookmark);
}
