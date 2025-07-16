
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the deployment environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getTenderInsight = async (description: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("AI insights are currently unavailable. API key is missing.");
  }
  
  const prompt = `Based on the following tender description from Namibia, provide a brief summary of key requirements for a potential bidder. Focus on deliverables, critical qualifications, and important deadlines. Format the output as clean markdown bullet points.

Tender Description:
---
${description}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching tender insight from Gemini:", error);
    return "Could not generate AI insight at this time. Please try again later.";
  }
};
