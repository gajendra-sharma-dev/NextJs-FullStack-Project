import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    const { messages } = await req.json();

    const result = await streamText({
      model: google("gemini-1.5-flash"), // Yahan aap apna Gemini model use kar rahe hain
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.log("ai chat errro", error);
    let errorMessage = "Internal server error";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-type": "application/json" },
    });
  }
}
