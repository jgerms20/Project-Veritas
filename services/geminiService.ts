
import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult, BiasCategory, VoiceType, NewsItem, BiasIndexEntry, TopStory } from "../types";

const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    throw new Error("API Key not found. Please ensure process.env.API_KEY is set.");
  }
  return key;
};

const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

const biasAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER },
    summary: { type: Type.STRING },
    dimensions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          slug: { 
            type: Type.STRING, 
            enum: [BiasCategory.OPINION, BiasCategory.EMOTIONAL, BiasCategory.CERTAINTY, BiasCategory.FRAMING, 'QUOTE_HANDLING'] 
          },
          score: { type: Type.NUMBER },
          description: { type: Type.STRING },
        },
        required: ["name", "slug", "score", "description"],
      },
    },
    highlights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          category: { 
            type: Type.STRING,
            enum: [BiasCategory.OPINION, BiasCategory.EMOTIONAL, BiasCategory.CERTAINTY, BiasCategory.FRAMING]
          },
          voice: {
            type: Type.STRING,
            enum: [VoiceType.NARRATOR, VoiceType.QUOTE]
          },
          explanation: { type: Type.STRING },
        },
        required: ["text", "category", "voice", "explanation"],
      },
    },
    rewrittenText: { type: Type.STRING, description: "Neutralized version of the text" }
  },
  required: ["overallScore", "summary", "dimensions", "highlights"],
};

// Robust JSON Cleaner
const cleanAndParseJSON = (text: string) => {
  try {
    // 1. Remove markdown code blocks
    let clean = text.replace(/```json\n?|```/g, '').trim();
    
    // 2. Aggressively find the JSON array or object if conversational text surrounds it
    const arrayMatch = clean.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }
    
    const objectMatch = clean.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }

    // 3. Fallback to direct parse
    return JSON.parse(clean);
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    return null;
  }
};

// Retry Wrapper for 429 Errors
const callWithRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit = error?.status === 429 || error?.code === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
      if (isRateLimit && i < retries - 1) {
        console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay * Math.pow(2, i))); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
};

export const analyzeTextForBias = async (text: string): Promise<AnalysisResult> => {
  return callWithRetry(async () => {
    const ai = getAI();
    const model = "gemini-2.5-flash"; 
    const isUrl = /^(http|https):\/\/[^ "]+$/.test(text.trim());
    let contentToSend = text;

    if (isUrl) {
      contentToSend = `URL provided: ${text}. Simulate reading this article. Analyze its typical content.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: contentToSend }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: biasAnalysisSchema,
        temperature: 0.1,
      },
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text) as AnalysisResult;
  });
};

// 1. Live Media Monitor (Expanded General News)
export const fetchMediaNews = async (): Promise<NewsItem[]> => {
  return callWithRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 16 trending news headlines happening RIGHT NOW.
      Strictly follow this distribution:
      - 50% Politics, World Events, and Press Freedom
      - 50% Entertainment, Pop Culture, and Viral Trends
      
      For each, determine if the sentiment is 'positive' (uplifting/progress), 'negative' (conflict/tragedy), or 'neutral' (informational).
      
      OUTPUT FORMAT:
      Strictly return a RAW JSON array. No markdown, no "Here is the json".
      [{"title": "...", "source": "AP", "url": "https://...", "snippet": "...", "sentiment": "neutral"}]`,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    if (!response.text) return [];
    const parsed = cleanAndParseJSON(response.text);
    return Array.isArray(parsed) ? parsed : [];
  });
};

// 2. Unbias / Neutralize Text
export const neutralizeText = async (text: string): Promise<string> => {
  return callWithRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rewrite the following text to be purely factual, neutral, and devoid of emotional loading or opinionated framing. Preserve the core facts but remove the spin. Text: "${text}"`,
    });
    return response.text || "Could not generate neutral text.";
  });
};

// 3. Dynamic Entity Search for Index
export const searchEntityForIndex = async (name: string): Promise<BiasIndexEntry> => {
  return callWithRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the media outlet, podcast, or show named "${name}". 
      Use Google Search to find its general reputation for bias and its official website URL.
      Estimate a bias score (0-100) based on public consensus and media watchdogs (like AdFontes or AllSides).
      
      OUTPUT FORMAT:
      Strictly return a RAW JSON object. No markdown.
      {
        "id": "generated-id",
        "name": "${name}",
        "type": "Outlet/Podcast/Show",
        "avgScore": 45.5,
        "label": "Moderate Bias",
        "analyzedCount": 0,
        "description": "Short description of their bias leaning",
        "url": "https://official-website.com"
      }`,
      config: {
        tools: [{googleSearch: {}}],
      }
    });

    if (!response.text) throw new Error("Could not analyze entity");
    const parsed = cleanAndParseJSON(response.text);
    if (!parsed) throw new Error("Failed to parse analysis result");
    return parsed;
  });
};

// 4. Fetch Global Top Stories (Multi-source)
export const fetchGlobalTopStories = async (): Promise<TopStory[]> => {
  return callWithRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the top 15 trending news stories happening TODAY.
      
      MANDATORY SOURCES TO SEARCH (Prioritize these):
      - Perplexity Discover (Trending topics)
      - Finviz (Top financial news)
      - CNN
      - Fox News
      - Bloomberg
      - Reuters
      - Wall Street Journal
      
      INSTRUCTIONS:
      1. Get the most popular/viral stories across these sources.
      2. The 'url' MUST be a direct, valid link to the article. If a direct link to the specific story is not found, use the search result link or the outlet's category page. DO NOT fabricate broken links.
      3. Analyze the headline/summary for linguistic framing to estimate 'biasScore'.
      
      OUTPUT FORMAT:
      Strictly return a RAW JSON array. No markdown.
      [
        {
          "headline": "...",
          "summary": "...",
          "source": "Source Name",
          "url": "https://...",
          "biasScore": 45.5,
          "biasLabel": "Label",
          "timestamp": "Today"
        }
      ]`,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    if (!response.text) return [];
    const parsed = cleanAndParseJSON(response.text);
    return Array.isArray(parsed) ? parsed : [];
  });
};


// --- NEW TOOLS ---

export const deepThinkAnalysis = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 1024 }, 
    },
  });
  return response.text || "No analysis generated.";
};

export const chatWithPro = async (history: any[], message: string): Promise<string> => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: history,
  });
  const response = await chat.sendMessage({ message });
  return response.text || "";
};

export const fastCheck = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text || "";
};

export const queryWithSearch = async (prompt: string): Promise<{text: string; chunks: any[]}> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return {
    text: response.text || "",
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const queryWithMaps = async (prompt: string): Promise<{text: string; chunks: any[]}> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
    },
  });
  return {
    text: response.text || "",
    chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateImagePro = async (prompt: string, size: string = "1K", aspectRatio: string = "16:9"): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: aspectRatio,
      outputMimeType: 'image/jpeg'
    }
  });
  const base64 = response.generatedImages?.[0]?.image?.imageBytes;
  if (!base64) throw new Error("Image generation failed");
  return `data:image/jpeg;base64,${base64}`;
};

export const generateVideoFromImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: base64Image,
      mimeType: 'image/jpeg', 
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!uri) throw new Error("Video generation failed");
  return `${uri}&key=${getApiKey()}`;
};

export const editImageWithPrompt = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image', 
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg',
          },
        },
        { text: prompt },
      ],
    },
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return ""; 
};

export const analyzeImagePro = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg',
          },
        },
        { text: prompt },
      ],
    },
  });
  return response.text || "";
};

export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");
  return base64Audio;
};
