import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");
  if (!lat || !lng) return NextResponse.json({ error: "Missing coords" }, { status: 400 });

  const url = `https://maps.googleapis.com/maps/api/streetview?size=800x500&location=${lat},${lng}&fov=90&pitch=10&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) return NextResponse.json({ error: "Street View unavailable" }, { status: 502 });

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
