import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Bookmark from "@/models/Bookmark";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  await dbConnect();
  await Bookmark.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
