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
  if (prompt.trim().toLowerCase() === 'who created you') {
    return "This AI assistant was developed by Taim Mohammed Elnzamy and is powered by Google Gemini.";
  }
  
  try {
    const ai = getAi();
    const model = imageUrl ? 'gemini-3-pro-image-preview' : 'gemini-3-flash-preview';

    let contents: any = { parts: [{ text: prompt }] };

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

        contents.parts.push(imagePart);
    }


    const response = await ai.models.generateContent({
        model,
        contents,
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

export const generateChatTitle = async (userPrompt: string, botResponse: string): Promise<string> => {
  try {
    const ai = getAi();
    const prompt = `Based on the following conversation, create a very short, concise title (max 5 words). Do not use quotes or special characters.
    
    User: "${userPrompt}"
    AI: "${botResponse}"
    
    Title:`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });
    
    const title = response.text?.trim().replace(/["']/g, "") || "Chat";
    return title;
  } catch (error) {
    console.error("Title generation failed:", error);
    return "New Chat"; // Fallback title
  }
};