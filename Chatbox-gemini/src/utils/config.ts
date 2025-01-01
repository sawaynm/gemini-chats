export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
}

export interface AppConfig {
  API_KEY: string;
  API_ENDPOINT: string;
  MAX_MESSAGES: number;
  DEFAULT_MODEL: string;
  SAFETY_FILTERS: boolean;
  RETRY_CONFIG: RetryConfig;
}

export const config: AppConfig = {
  API_KEY: process.env.GEMINI_API_KEY || '',
  API_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  MAX_MESSAGES: 50,
  DEFAULT_MODEL: "gemini-pro",
  SAFETY_FILTERS: true,
  RETRY_CONFIG: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 5000
  }
};