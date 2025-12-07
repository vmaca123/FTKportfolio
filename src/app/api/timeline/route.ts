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

  await dbConnect();

  // Fetch Repos (Creation/Modification events)
  const repos = await PortfolioRepo.find({}).select('name dateModified created_at');
  
  // Fetch Logs (User actions)
  const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(100);

  const timelineEvents = [];

  // Process Repos
  repos.forEach((repo: any) => {
    // Assuming dateModified is a string "YYYY-MM-DD", let's try to parse it or use current date if invalid
    // Ideally we should have real Date objects in DB.
    timelineEvents.push({
      id: `repo-${repo._id}`,
      type: 'REPO_MODIFIED',
      source: repo.name,
      timestamp: repo.dateModified, // This might need formatting if it's just a date string
      details: `Repository ${repo.name} was updated`
    });
  });

  // Process Logs
  logs.forEach((log: any) => {
    timelineEvents.push({
      id: `log-${log._id}`,
      type: 'USER_ACTION',
      source: log.userId,
      timestamp: log.timestamp,
      details: `${log.action}: ${log.details}`
    });
  });

  // Sort by timestamp descending
  timelineEvents.sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return dateB - dateA;
  });

  return NextResponse.json(timelineEvents);
}
