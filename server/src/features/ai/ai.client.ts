import { GoogleGenAI } from "@google/genai";

const apikey = process.env.GOOGLE_GENAI_API_KEY;

if(!apikey) {
    throw new Error("GOOGLE_GENAI_API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({
    apiKey: apikey,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  const values = response.embeddings?.[0]?.values;

  if (!values || values.length !== 768) {
    throw new Error("Gemini did not return a 768-dimensional embedding");
  }

  return values;
}
