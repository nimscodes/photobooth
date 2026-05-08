import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getBlockedDates, setBlockedDates } from "@/lib/storage";

export async function GET() {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ dates: await getBlockedDates() });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { dates } = await req.json();
  if (!Array.isArray(dates))
    return NextResponse.json({ error: "dates must be an array." }, { status: 400 });
  await setBlockedDates(dates as string[]);
  return NextResponse.json({ success: true, dates });
}
