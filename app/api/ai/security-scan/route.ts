import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { scanSecurityIssues } from "@/lib/ai-advanced";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dependencies, codeSnippets } = await request.json();

    const scanResults = await scanSecurityIssues(
      dependencies || [],
      codeSnippets || []
    );

    return NextResponse.json(scanResults);
  } catch (error) {
    console.error("Error in security scan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
