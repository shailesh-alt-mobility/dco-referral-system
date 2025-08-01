import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = "https://referral.alt-mobility.com";

export async function requestHandler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/");
  const url = `${BACKEND_BASE}/${path}`;
  const method = req.method;
  const headers = { ...Object.fromEntries(req.headers.entries()) };
  delete headers.host;

  const fetchOptions: RequestInit = {
    method,
    headers,
    body: ["GET", "HEAD"].includes(method) ? undefined : await req.text(),
  };

  const response = await fetch(url, fetchOptions);

  const resHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  const data = await response.arrayBuffer();
  return new NextResponse(data, {
    status: response.status,
    headers: resHeaders,
  });
}

export const GET = requestHandler;
export const POST = requestHandler;
export const PUT = requestHandler;
export const PATCH = requestHandler;
export const DELETE = requestHandler;
export const OPTIONS = async () =>
  NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
    }
  );