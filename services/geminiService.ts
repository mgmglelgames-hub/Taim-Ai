import { GoogleGenAI } from "@google/genai";

const getAi = () => {
    // We must use a new instance each time to ensure the most up-to-date API key is used.
    // This is particularly important in environments where the key might be updated dynamically.
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const runQuery = async (prompt: string, imageUrl?: string): Promise<string> => {
  try {
    const ai = getAi();

    let contents: any = prompt;

    if (imageUrl) {
        const mimeTypeMatch = imageUrl.match(/data:(.*);base64,/);
        if (!mimeTypeMatch) {
            throw new Error("Invalid image data URL.");
        }
        const mimeType = mimeTypeMatch[1];
        const base64Data = imageUrl.split(',')[1];
        
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType,
            },
        };

        contents = { parts: [{ text: prompt }, imagePart] };
    }


    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
    });
    
    const text = response.text;
    if (text) {
        return text;
    } else {
        // This case handles situations where the response is valid but contains no text (e.g., safety blocks)
        return "I'm sorry, I couldn't generate a response. The content may have been blocked.";
    }

  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the Gemini API.");
  }
};