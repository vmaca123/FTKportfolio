import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import PortfolioRepo from "@/models/PortfolioRepo";
import { NextResponse } from "next/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || '').split(',').map(e => e.trim());

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  
  console.log("DELETE Debug:");
  console.log("Session User:", session?.user);
  console.log("Allowed Admins:", ADMIN_EMAILS);

  if (!session || !session.user || !session.user.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ 
      error: `Unauthorized. Logged in as: ${session?.user?.email || 'None'}, Expected one of: ${ADMIN_EMAILS.join(', ')}` 
    }, { status: 403 });
  }

  const { id } = params;
  
  await dbConnect();
  await PortfolioRepo.findByIdAndUpdate(id, { isVisible: false });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  
  if (!session || !session.user || !session.user.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ 
      error: `Unauthorized. Logged in as: ${session?.user?.email || 'None'}, Expected one of: ${ADMIN_EMAILS.join(', ')}` 
    }, { status: 403 });
  }

  const { id } = params;
  const body = await req.json().catch(() => ({})); // Handle empty body for restore calls if any
  
  await dbConnect();

  // If body has specific fields, update them. Otherwise default to restore behavior (isVisible: true)
  // But actually, the restore button might send { isVisible: true } or nothing.
  // Let's assume if body is empty, it's a restore.
  // Or better, just update with whatever is in body.
  
  const updateData: any = {};
  if (Object.keys(body).length > 0) {
      if (body.isVisible !== undefined) updateData.isVisible = body.isVisible;
      if (body.longDescription !== undefined) updateData.longDescription = body.longDescription;
      if (body.features !== undefined) updateData.features = body.features;
      if (body.teamInfo !== undefined) updateData.teamInfo = body.teamInfo;
  } else {
      // Fallback for old restore calls if they didn't send body
      updateData.isVisible = true;
  }

  await PortfolioRepo.findByIdAndUpdate(id, updateData);

  return NextResponse.json({ success: true });
}
