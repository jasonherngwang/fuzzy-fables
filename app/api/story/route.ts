import { NextRequest } from "next/server";
import { google } from "@ai-sdk/google";
import { streamObject, generateObject } from "ai";
import {
  StoryConfigSchema,
  ChapterGenerationSchema,
  SafetyValidationSchema,
  StoryConfig,
  AuthorStyle,
  Location,
} from "@/lib/schemas";
import {
  MODEL_CONFIG,
  getAuthorStyleById,
  getLocationById,
  getAgeGroupGuidelines,
} from "@/lib/defaults";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedRequest = StoryConfigSchema.parse(body);

    const authorStyle = getAuthorStyleById(validatedRequest.authorStyle.id);
    const location = getLocationById(validatedRequest.location.id);

    if (!authorStyle || !location) {
      return new Response(
        JSON.stringify({ error: "Invalid author style or location" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const safetyResult = await validateContentSafety(
      validatedRequest.userPrompt,
      validatedRequest.targetAge
    );

    if (!safetyResult.isAppropriate) {
      return new Response(
        JSON.stringify({
          error: "Content not appropriate for children",
          reason: safetyResult.reason,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate story chapter with streaming
    const result = streamObject({
      model: google(MODEL_CONFIG.generation),
      schema: ChapterGenerationSchema,
      messages: [
        {
          role: "system",
          content: createSystemPrompt(validatedRequest, authorStyle, location),
        },
        {
          role: "user",
          content: `Create the first chapter of a story with this prompt: "${validatedRequest.userPrompt}". Set in ${location.name}. Write in the style of ${authorStyle.name}.`,
        },
      ],
      temperature: MODEL_CONFIG.temperature,
      maxOutputTokens: MODEL_CONFIG.maxTokens,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in story generation:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to generate story",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Helper functions
function createSystemPrompt(
  request: StoryConfig,
  authorStyle: AuthorStyle,
  location: Location
): string {
  const ageGuidelines = getAgeGroupGuidelines(request.targetAge);

  return `You are a children's story generator creating age-appropriate content for ${
    request.targetAge
  } year olds.

Author Style: ${authorStyle.name} - ${authorStyle.description}
Location: ${location.name} - ${location.description}

Age Guidelines:
- Complexity: ${ageGuidelines.maxComplexity}
- Length: ${ageGuidelines.maxLength}
- Themes: ${ageGuidelines.themes.join(", ")}
- Avoid: ${ageGuidelines.avoid.join(", ")}

Story Structure:
- Create at least 5 chapters before considering the story complete
- After 5 chapters, you may end the story naturally when it feels complete
- Each chapter should advance the plot and develop characters
- End with a satisfying conclusion that teaches a positive lesson

Create the next chapter of an engaging and safe story.`;
}

async function validateContentSafety(
  prompt: string,
  targetAge: string
): Promise<{ isAppropriate: boolean; reason: string }> {
  try {
    const result = await generateObject({
      model: google(MODEL_CONFIG.safety),
      schema: SafetyValidationSchema,
      messages: [
        {
          role: "system",
          content: `You are a content safety validator for children's stories. Assess if the given prompt is appropriate for ${targetAge} year olds.`,
        },
        {
          role: "user",
          content: `Is this story prompt appropriate for ${targetAge} year olds: "${prompt}"`,
        },
      ],
      temperature: 0.1, // Low temperature for consistent safety assessment
    });

    return result.object;
  } catch (error) {
    console.error("Safety validation error:", error);
    return {
      isAppropriate: false,
      reason: "Unable to validate content safety",
    };
  }
}
