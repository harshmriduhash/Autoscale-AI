import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { analyzeCostsAndOptimize } from "@/lib/ai-advanced";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { usage, functions } = await request.json();

    const analysis = await analyzeCostsAndOptimize(
      usage || {
        functionInvocations: 0,
        memoryGB: 0,
        executionTime: 0,
        storageGB: 0,
      },
      functions || []
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in FinOps analysis:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
