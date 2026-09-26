import { NextResponse, type NextRequest } from "next/server";

import prisma from "@/lib/database";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const triageId = Number.parseInt(id, 10);

  if (Number.isNaN(triageId)) {
    return NextResponse.json({ error: "Invalid triage id." }, { status: 400 });
  }

  const triage = await prisma.triage.findUnique({
    where: {
      id: triageId,
    },
  });

  if (!triage) {
    return NextResponse.json({ error: "Triage not found." }, { status: 404 });
  }

  const { urgency, pathway, next, consultationType } = triage;
  return NextResponse.json({
    id: triageId,
    urgency,
    pathway,
    next,
    consultationType,
  });
}
