import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// The API key must be obtained exclusively from process.env.API_KEY
// Assume this variable is pre-configured, valid, and accessible
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestRoutine = async (context: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Suggest a single, short, healthy morning routine task in Japanese.
      Context: The user is looking for a task for their "${context}" list.
      Keep it under 10 characters if possible. Do not include quotes.
      Examples: "白湯を飲む", "読書する", "深呼吸".
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text?.trim() || "新しいタスク";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "瞑想する";
  }
};