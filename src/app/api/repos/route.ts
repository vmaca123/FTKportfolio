import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import PortfolioRepo from "@/models/PortfolioRepo";
import { NextResponse } from "next/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || '').split(',').map(e => e.trim());
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'vmaca123';

export async function GET(req: Request) {
  await dbConnect();
  const session = await auth();
  const isAdmin = !!(session?.user?.email && ADMIN_EMAILS.includes(session.user.email));

  // Auto-sync from GitHub on every request to ensure fresh data
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    if (res.ok) {
      const githubRepos = await res.json();
      console.log("GitHub Repos Fetched:", githubRepos.length);
      if (githubRepos.length > 0) {
          console.log("Sample Repo Size:", githubRepos[0].name, githubRepos[0].size);
      }

      const operations = githubRepos.map((repo: any) => ({
        updateOne: {
          filter: { githubId: repo.id },
          update: {
            $set: {
              name: repo.name,
              description: repo.description,
              url: repo.html_url,
              homepage: repo.homepage,
              language: repo.language,
              stars: repo.stargazers_count,
              size: repo.size,
              updatedAt: repo.updated_at,
            }
          },
          upsert: true
        }
      }));
      
      if (operations.length > 0) {
        await PortfolioRepo.bulkWrite(operations);
      }
    }
  } catch (error) {
    console.error("Auto-sync failed:", error);
  }

  // Return updated list
  const repos = await PortfolioRepo.find({}).sort({ updatedAt: -1 });
  return NextResponse.json({ repos, isAdmin });
}

export async function POST(req: Request) {
  const session = await auth();
  
  // Check Admin
  if (!session || !session.user || !session.user.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized: Admin only" }, { status: 403 });
  }

  try {
    // Fetch from GitHub
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error('Failed to fetch from GitHub');
    
    const githubRepos = await res.json();
    
    await dbConnect();
    
    let addedCount = 0;
    
    for (const repo of githubRepos) {
      // Update existing or insert new
      const result = await PortfolioRepo.findOneAndUpdate(
        { githubId: repo.id },
        {
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stars: repo.stargazers_count,
          size: repo.size,
          updatedAt: repo.updated_at,
          // We don't overwrite isVisible if it exists, but here we are just syncing data
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (result) addedCount++;
    }

    return NextResponse.json({ success: true, message: `Synced ${addedCount} repositories.` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
