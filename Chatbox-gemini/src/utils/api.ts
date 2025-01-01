import axios from "axios";
import { config, AppConfig } from "./config";

interface GeminiApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface GeminiConfig {
  model: string;
  filters: boolean;
  temperature?: number;
  maxTokens?: number;
}

export interface GeminiResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export class GeminiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  retryCount = 0
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retryCount >= config.RETRY_CONFIG.maxRetries) {
      throw error;
    }

    if (error?.response?.status === 429) {
      const delay = Math.min(
        config.RETRY_CONFIG.initialDelay * Math.pow(2, retryCount),
        config.RETRY_CONFIG.maxDelay
      );
      console.warn(`Rate limit exceeded, retrying in ${delay}ms...`);
      await sleep(delay);
      return retryWithExponentialBackoff(operation, retryCount + 1);
    }

    if (error?.response?.status >= 500) {
      const delay = Math.min(
        config.RETRY_CONFIG.initialDelay * Math.pow(2, retryCount),
        config.RETRY_CONFIG.maxDelay
      );
      console.warn(`Server error, retrying in ${delay}ms...`);
      await sleep(delay);
      return retryWithExponentialBackoff(operation, retryCount + 1);
    }

    throw error;
  }
}

export async function fetchGeminiResponse(
  prompt: string,
  userConfig: Partial<GeminiConfig> = {}
): Promise<GeminiResponse> {
  if (!config.API_KEY) {
    throw new GeminiError("API key not configured", 401);
  }

  const { 
    model = "gemini-pro", 
    filters = true, 
    temperature = 0.7, 
    maxTokens = 2048 
  } = userConfig;

  const makeRequest = async () => {
    const headers = {
      "Content-Type": "application/json",
      "x-goog-api-key": config.API_KEY,
    };

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
      safetySettings: filters ? [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_VIOLENCE",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ] : [],
    };

    try {
      const response = await axios.post<GeminiApiResponse>(
        config.API_ENDPOINT,
        payload,
        { 
          headers,
          timeout: 30000 // 30 second timeout
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return {
          text: response.data.candidates[0].content.parts[0].text,
          usage: response.data.usage,
        };
      } else {
        throw new GeminiError("Invalid response structure from Gemini API", 500);
      }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new GeminiError("Request timeout. Please try again.", 408);
      }

      if (error?.response?.status) {
        switch (error.response.status) {
          case 401:
            throw new GeminiError("Gemini API authentication failed. Please check your API key.", 401);
          case 429:
            throw new GeminiError("Gemini API rate limit exceeded. Please try again later.", 429);
          case 500:
            throw new GeminiError("Gemini API server error. Please try again later.", 500);
          default:
            throw new GeminiError(
              `Gemini API error: ${error.response.data?.error?.message || error.response.status}`,
              error.response.status
            );
        }
      }
      
      throw new GeminiError(
        "Error: Unable to fetch response from Gemini API. " + error.message
      );
    }
  };

  return retryWithExponentialBackoff(makeRequest);
}
