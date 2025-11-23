import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCT_GENERATOR_PROMPT } from "../constants";

// Initialize the client with the system environment key
// Note: In a real production app, this would likely be proxied through a backend
// or the user would enter their key. Per instructions, we assume process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface FakeProduct {
  name: string;
  description: string;
  price: string;
  warning: string;
  icon: string;
}

export const generateFakeProduct = async (): Promise<FakeProduct | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: PRODUCT_GENERATOR_PROMPT,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            price: { type: Type.STRING },
            warning: { type: Type.STRING },
            icon: { type: Type.STRING },
          },
          required: ['name', 'description', 'price', 'warning', 'icon'],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as FakeProduct;
  } catch (error) {
    console.error("Gemini fabrication failed:", error);
    return null;
  }
};
