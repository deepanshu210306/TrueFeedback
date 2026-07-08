// src/app/api/suggest-messages/route.ts

import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function POST() {
  try {
    const prompt = `
Create a list of three open-ended and engaging questions formatted as a single string.

Each question should be separated by "||".

These questions are for an anonymous social messaging platform like Qooh.me and should be suitable for a diverse audience.

Avoid personal or sensitive topics. Focus on universal themes that encourage friendly interaction.

Example:
What's a hobby you've recently started?||
If you could have dinner with any historical figure, who would it be?||
What's a simple thing that makes you happy?

Return only the questions.
`;

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
    });

    const messages = text
      .split("||")
      .map((message) => message.trim())
      .filter(Boolean);

    return Response.json(
      {
        success: true,
        messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate messages.",
      },
      { status: 500 }
    );
  }
}