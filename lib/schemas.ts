import { z } from "zod";

// Story-related types
export const AuthorStyleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  examplePhrases: z.array(z.string()),
});

export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const StoryConfigSchema = z.object({
  authorStyle: AuthorStyleSchema,
  location: LocationSchema,
  userPrompt: z.string().min(1).max(1000),
  targetAge: z.enum(["3-5", "6-8", "9-12"]),
});

export const StoryChoiceSchema = z.object({
  text: z.string(),
});

export const StoryChapterSchema = z.object({
  title: z.string(),
  content: z.string(),
  choices: z.array(StoryChoiceSchema),
  isConclusion: z.boolean(),
});

export const StoryStateSchema = z.object({
  id: z.string(),
  config: StoryConfigSchema,
  chapters: z.array(StoryChapterSchema),
  isComplete: z.boolean(),
  userChoices: z.array(z.string()), // Just choice text
});

// AI SDK structured output schemas
export const ChapterGenerationSchema = z.object({
  title: z.string().describe("The title of the chapter"),
  content: z.string().describe("The main story content for this chapter"),
  isConclusion: z
    .boolean()
    .describe("Whether this chapter concludes the story"),
});

export const ChoiceGenerationSchema = z.object({
  choices: z
    .array(
      z.object({
        text: z.string().describe("The choice text presented to the user"),
      })
    )
    .min(2)
    .max(4)
    .describe("Story choices for the user to select from"),
});

export const SafetyValidationSchema = z.object({
  isAppropriate: z
    .boolean()
    .describe("Whether the content is appropriate for children"),
  reason: z
    .string()
    .describe("Brief explanation of why the content is or is not appropriate"),
});

// Type exports
export type AuthorStyle = z.infer<typeof AuthorStyleSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type StoryConfig = z.infer<typeof StoryConfigSchema>;
export type StoryChoice = z.infer<typeof StoryChoiceSchema>;
export type StoryChapter = z.infer<typeof StoryChapterSchema>;
export type StoryState = z.infer<typeof StoryStateSchema>;
export type ChapterGeneration = z.infer<typeof ChapterGenerationSchema>;
export type ChoiceGeneration = z.infer<typeof ChoiceGenerationSchema>;
export type SafetyValidation = z.infer<typeof SafetyValidationSchema>;

// AI SDK data part types for streaming
export interface StoryProgressData {
  step: "generating" | "validating" | "creating_choices" | "complete";
  currentTask: string;
}

export interface StoryChapterData {
  title: string;
  content: string;
  choices: StoryChoice[];
  isConclusion: boolean;
}

export interface StoryChoicesData {
  choices: StoryChoice[];
}

export interface SafetyCheckData {
  isAppropriate: boolean;
  reason: string;
}

export interface TokenUsageData {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: string;
  timestamp: number;
}

export interface ToolCallData {
  toolCallId: string;
  toolName: string;
  input: unknown;
  output?: unknown;
  error?: string;
  duration?: number;
  timestamp: number;
}

export interface ModelResponseData {
  model: string;
  modelId: string;
  finishReason: string;
  usage: TokenUsageData;
  timestamp: number;
}

export interface ProcessingMetricsData {
  totalDuration: number;
  stepDurations: Record<string, number>;
  memoryUsage?: number;
  errorCount: number;
  warnings: string[];
}

export interface ModelConfig {
  generation: "gemini-2.5-flash";
  safety: "gemini-2.5-flash";
  choices: "gemini-2.5-flash";
}
