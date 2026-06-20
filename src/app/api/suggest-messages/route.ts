// app/api/test-ai/route.ts

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { text, sources, providerMetadata } = await generateText({
      model: google("gemini-2.5-flash"),
      tools: {
        google_search: google.tools.googleSearch({}),
      },
      prompt:
        "List the top 5 San Francisco news from the past week." +
        "You must include the date of each article.",
    });

    console.log(text);
    console.log(sources);

    return NextResponse.json(
      {
        text,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("AI error:", error);

    return NextResponse.json(
      {
        error: error?.message ?? "Unknown error",
      },
      { status: 500 },
    );
  }
}
