import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import AuditLog from "@/models/AuditLog";
import { NextResponse } from "next/server";
import crypto from 'crypto';

export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  // Limit to last 100 logs
  const logs = await AuditLog.find({ userId: session.user.email })
    .sort({ timestamp: -1 })
    .limit(100);
    
  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await dbConnect();

  // Fetch the last log to get the previous hash
  const lastLog = await AuditLog.findOne().sort({ timestamp: -1 });
  const prevHash = lastLog ? lastLog.hash : "GENESIS_BLOCK_HASH_START";
  
  const timestamp = new Date().toISOString();
  
  // Create hash: SHA256(prevHash + userId + action + details + timestamp)
  const dataToHash = `${prevHash}${session.user.email}${body.action}${body.details}${timestamp}`;
  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

  const log = await AuditLog.create({
    userId: session.user.email,
    ...body,
    timestamp,
    prevHash,
    hash
  });

  return NextResponse.json(log);
}
