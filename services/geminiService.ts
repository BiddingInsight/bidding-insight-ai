import { GoogleGenAI, Type } from "@google/genai";
import { Tender } from '../types';
import { ActSectionContent } from './procurementActData';

// Assume process.env.API_KEY is configured in the deployment environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const withTimeout = <T>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, ms);

    promise
      .then(value => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(reason => {
        clearTimeout(timer);
        reject(reason);
      });
  });
};

const API_TIMEOUT_MS = 25000; // 25 seconds

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
    const promise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    const response = await withTimeout(promise, API_TIMEOUT_MS, "The request for an AI insight timed out. Please try again.");
    return response.text;
  } catch (error) {
    console.error("Error fetching tender insight from Gemini:", error);
    if (error instanceof Error) {
        return error.message;
    }
    return "Could not generate AI insight at this time. Please try again later.";
  }
};

export const getTenderInsightsFromQuery = async (query: string, tenders: Tender[], procurementAct: ActSectionContent[]): Promise<{ summary: string; relevantTenderIds: string[] }> => {
  if (!API_KEY) {
    return Promise.resolve({ summary: "AI search is currently unavailable. API key is missing.", relevantTenderIds: [] });
  }

  const tenderContext = JSON.stringify(tenders.map(t => ({
      id: t.id,
      title: t.title,
      entity: t.entity,
      status: t.status,
      closingDate: t.closingDate,
      region: t.region,
      industry: t.industry,
  })));
  
  const actContext = JSON.stringify(procurementAct);

  const prompt = `
    You are a procurement expert assistant for a Namibian tender platform.
    Your knowledge is strictly limited to the provided list of tenders and the content of the Public Procurement Act.
    Do not answer questions about news or any other topic. If the user asks about something else, politely decline by saying you can only answer questions about tenders and the procurement act.

    Analyze the following user query and the provided data.
    1. If the query is about tenders, answer based ONLY on the provided Tenders List. Your summary should be helpful and directly answer the user's question. Also, identify the IDs of the tenders that are most relevant to the user's query.
    2. If the query is about the Procurement Act, answer based ONLY on the provided Act Content. Your summary should explain the relevant part of the act. Do not list any tender IDs.

    If no tenders or act sections match the query, say so clearly and return an empty array of IDs.

    User Query: "${query}"

    Tenders List (JSON format):
    ---
    ${tenderContext}
    ---

    Procurement Act Content (JSON format):
    ---
    ${actContext}
    ---
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "A natural language summary answering the user's query based on the provided tenders or procurement act."
      },
      relevantTenderIds: {
        type: Type.ARRAY,
        description: "An array of tender IDs relevant to the query. This should be empty if the query is about the procurement act.",
        items: { type: Type.STRING }
      }
    },
    required: ["summary", "relevantTenderIds"]
  };

  try {
    const promise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 0 },
      }
    });

    const response = await withTimeout(
        promise, 
        API_TIMEOUT_MS, 
        "The AI search request timed out. This can happen with complex queries. Please try simplifying your question or try again later."
    );

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error fetching AI search result from Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "I'm sorry, I couldn't process that request. Please try rephrasing your question.";
    return {
      summary: errorMessage,
      relevantTenderIds: []
    };
  }
};