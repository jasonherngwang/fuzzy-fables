import { AuthorStyle, Location } from "./schemas";

// Famous children's authors with distinctive characteristics
export const AUTHOR_STYLES: AuthorStyle[] = [
  {
    id: "dr-seuss",
    name: "Dr. Seuss",
    description:
      "Whimsical rhymes, made-up words, and fantastical creatures in colorful worlds",
    examplePhrases: [
      "In a world where the trees are purple and the sky is green",
      "The Sneetches with stars upon thars",
      "Oh, the places you'll go with your imagination",
    ],
  },
  {
    id: "shel-silverstein",
    name: "Shel Silverstein",
    description:
      "Playful poetry with gentle humor, simple illustrations, and life lessons",
    examplePhrases: [
      "Where the sidewalk ends and the wild things begin",
      "A light in the attic, a dream in the pocket",
      "The giving tree that loved a little boy",
    ],
  },
  {
    id: "l-frank-baum",
    name: "L. Frank Baum",
    description:
      "Classic fantasy adventures with magical lands, talking animals, and brave heroes",
    examplePhrases: [
      "Somewhere over the rainbow, dreams really do come true",
      "There's no place like home, but adventure calls",
      "The yellow brick road leads to wonderful places",
    ],
  },
  {
    id: "roald-dahl",
    name: "Roald Dahl",
    description:
      "Quirky characters, dark humor, and unexpected twists with heartwarming endings",
    examplePhrases: [
      "In a world where chocolate rivers flow and giants are friendly",
      "Matilda's magic powers and Miss Honey's kindness",
      "The BFG who catches dreams and spreads them around",
    ],
  },
  {
    id: "beatrix-potter",
    name: "Beatrix Potter",
    description:
      "Gentle animal stories with detailed nature descriptions and cozy adventures",
    examplePhrases: [
      "In the peaceful English countryside where rabbits wear waistcoats",
      "Peter Rabbit's garden adventures and family lessons",
      "The cozy burrow where love and kindness always win",
    ],
  },
];

export const LOCATIONS: Location[] = [
  {
    id: "magical-forest",
    name: "Enchanted Forest",
    description:
      "A mystical woodland filled with talking trees, friendly animals, and hidden magical creatures",
  },
  {
    id: "candy-mountain",
    name: "Candy Mountain",
    description:
      "A sweet paradise where everything is made of candy, from chocolate rivers to lollipop trees",
  },
  {
    id: "underwater-city",
    name: "Underwater City",
    description:
      "A beautiful underwater kingdom with coral castles, friendly sea creatures, and pearl palaces",
  },
  {
    id: "cloud-castle",
    name: "Cloud Castle",
    description:
      "A floating castle in the sky where clouds are soft as pillows and rainbows are bridges",
  },
  {
    id: "dinosaur-valley",
    name: "Dinosaur Valley",
    description:
      "A prehistoric land where friendly dinosaurs roam and ancient secrets are waiting to be discovered",
  },
];

// Default story prompts for different age groups
export const DEFAULT_STORY_PROMPTS = {
  "3-5": [
    "A little animal who learns to share",
    "A magical toy that comes to life",
    "A friendly monster who's not scary at all",
    "A lost pet who finds their way home",
    "A rainbow that grants wishes",
  ],
  "6-8": [
    "A brave knight who saves the day with kindness",
    "A magical school where everyone learns something special",
    "A time-traveling adventure to meet historical heroes",
    "A detective who solves mysteries with friendship",
    "A space explorer who discovers new planets",
  ],
  "9-12": [
    "A young wizard who learns that magic comes from within",
    "A group of friends who save their town from a misunderstanding",
    "A character who discovers they have a special power",
    "An adventure that teaches the importance of teamwork",
    "A story about overcoming fears and finding courage",
  ],
};

export const SAFETY_RULES = {
  positiveThemes: [
    "friendship and cooperation",
    "kindness and empathy",
    "courage and perseverance",
    "creativity and imagination",
    "learning and growth",
    "family and community",
    "respect for nature",
    "problem-solving",
    "self-acceptance",
    "helping others",
  ],

  sensitiveTopics: [
    "violence or conflict",
    "scary or frightening content",
    "sad or traumatic events",
    "dangerous situations",
    "inappropriate language",
    "stereotypes or bias",
    "commercial content",
    "political themes",
  ],

  // Age-appropriate content guidelines
  ageGuidelines: {
    "3-5": {
      maxComplexity: "simple",
      maxLength: "very short",
      themes: [
        "basic emotions",
        "simple problem-solving",
        "family and friends",
      ],
      avoid: ["conflict", "scary elements", "complex emotions"],
    },
    "6-8": {
      maxComplexity: "moderate",
      maxLength: "short to medium",
      themes: ["friendship", "school", "adventure", "learning"],
      avoid: ["serious conflict", "frightening content", "adult themes"],
    },
    "9-12": {
      maxComplexity: "moderate to complex",
      maxLength: "medium to long",
      themes: ["personal growth", "teamwork", "problem-solving", "adventure"],
      avoid: [
        "violence",
        "romance",
        "adult situations",
        "inappropriate content",
      ],
    },
  },
};

export const STORY_CONFIG = {
  minChapters: 1,
  maxChapters: 10,
  defaultChapters: 3,

  maxChapterLength: 500, // words
  minChapterLength: 100, // words
  maxChoicesPerChapter: 4,
  minChoicesPerChapter: 2,

  // Generation params
  defaultTargetAge: "3-5",
  defaultAuthorStyle: "dr-seuss",
  defaultLocation: "magical-forest",

  // Safety
  safetyValidationRequired: true,
  contentFilteringEnabled: true,

  // Performance
  maxGenerationTime: 30000, // 30 seconds
  streamingEnabled: true,
  diagnosticMode: false, // Set to true for development
};

export const MODEL_CONFIG = {
  generation: "gemini-2.5-flash" as const,
  safety: "gemini-2.5-flash" as const,
  choices: "gemini-2.5-flash" as const,

  // Model parameters
  temperature: 0.8, // Creative but controlled
  maxTokens: 1000,
  topP: 0.9,
  topK: 40,

  // Safety settings
  safetySettings: {
    harassment: "BLOCK_MEDIUM_AND_ABOVE",
    hateSpeech: "BLOCK_MEDIUM_AND_ABOVE",
    sexuallyExplicit: "BLOCK_MEDIUM_AND_ABOVE",
    dangerousContent: "BLOCK_MEDIUM_AND_ABOVE",
  },
};

// Helper functions
export function getAuthorStyleById(id: string): AuthorStyle | undefined {
  return AUTHOR_STYLES.find((style) => style.id === id);
}

export function getLocationById(id: string): Location | undefined {
  return LOCATIONS.find((location) => location.id === id);
}

export function getDefaultPromptForAge(age: string): string {
  const prompts =
    DEFAULT_STORY_PROMPTS[age as keyof typeof DEFAULT_STORY_PROMPTS];
  if (!prompts || prompts.length === 0) {
    return "A wonderful adventure that teaches an important lesson";
  }
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export function getRandomAuthorStyle(): AuthorStyle {
  return AUTHOR_STYLES[Math.floor(Math.random() * AUTHOR_STYLES.length)];
}

export function getRandomLocation(): Location {
  return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

export function validateAgeGroup(age: string): boolean {
  return age in DEFAULT_STORY_PROMPTS;
}

export function getAgeGroupGuidelines(age: string) {
  return SAFETY_RULES.ageGuidelines[
    age as keyof typeof SAFETY_RULES.ageGuidelines
  ];
}
