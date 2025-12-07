import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import PortfolioRepo from "@/models/PortfolioRepo";
import AuditLog from "@/models/AuditLog";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  await dbConnect();

  // Search Repos
  const repoResults = await PortfolioRepo.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { longDescription: { $regex: query, $options: 'i' } },
      { features: { $regex: query, $options: 'i' } },
      { teamInfo: { $regex: query, $options: 'i' } },
      { language: { $regex: query, $options: 'i' } }
    ]
  }).select('name description language stars dateModified');

  // Search Logs
  const logResults = await AuditLog.find({
    $or: [
      { action: { $regex: query, $options: 'i' } },
      { details: { $regex: query, $options: 'i' } },
      { userId: { $regex: query, $options: 'i' } }
    ]
  }).sort({ timestamp: -1 }).limit(20);

  return NextResponse.json({
    repos: repoResults,
    logs: logResults
  });
}
