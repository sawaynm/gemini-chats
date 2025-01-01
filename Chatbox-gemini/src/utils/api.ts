import axios from "axios";

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

const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

export async function fetchGeminiResponse(
  prompt: string,
  config: Partial<GeminiConfig> = {},
  attachment?: File | null
): Promise<GeminiResponse> {
  if (!API_KEY) {
    throw new GeminiError("API key not configured", 401);
  }

  const { model = "gemini-pro", filters = true, temperature = 0.7, maxTokens = 2048 } = config;

  try {
    const headers = {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    };

    const payload: any = {
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

    if (attachment) {
      const formData = new FormData();
      formData.append("file", attachment);
      formData.append("payload", JSON.stringify(payload));
      const response = await axios.post<GeminiApiResponse>(API_ENDPOINT, formData, { headers });
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return {
          text: response.data.candidates[0].content.parts[0].text,
          usage: response.data.usage,
        };
      } else {
        throw new GeminiError("Invalid response structure from Gemini API", 500);
      }
    } else {
      const response = await axios.post<GeminiApiResponse>(API_ENDPOINT, payload, { headers });
      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return {
          text: response.data.candidates[0].content.parts[0].text,
          usage: response.data.usage,
        };
      } else {
        throw new GeminiError("Invalid response structure from Gemini API", 500);
      }
    }
  } catch (error: any) {
    console.error("Error fetching Gemini response:", error);
    if (error?.response?.status) {
      switch (error.response.status) {
        case 401:
          throw new GeminiError("Gemini API authentication failed. Please check your API key.", 401);
        case 429:
          throw new GeminiError("Gemini API rate limit exceeded. Please try again later.", 429);
        case 500:
          throw new GeminiError("Gemini API server error. Please try again later.", 500);
        default:
          throw new GeminiError(`Gemini API error: ${error.response.status}`, error.response.status);
      }
    }
    throw new GeminiError("Error: Unable to fetch response from Gemini API.");
  }
}
