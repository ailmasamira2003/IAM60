import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Endpoint legado. Utilize /api/result para o novo fluxo.",
    },
    { status: 410 }
  );
}

