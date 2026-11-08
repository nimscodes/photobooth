import { NextResponse } from "next/server";

/**
 * Registered HoneyBook OAuth redirect URI. The complete authorization flow is
 * activated after HoneyBook approves the API application and issues a client ID.
 * Do not reflect or log authorization query parameters; they can contain codes.
 */
export async function GET() {
  return NextResponse.json(
    { message: "HoneyBook API authorization is not active yet. Please try again after the integration is configured." },
    {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
