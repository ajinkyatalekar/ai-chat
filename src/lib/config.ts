export const AI_CONFIG = {
  CONTEXT_WINDOW: 128000,

  SUMMARIZATION_THRESHOLD: 128000 / 5,
  DEFAULT_MODEL: "openai/gpt-4o",
} as const;