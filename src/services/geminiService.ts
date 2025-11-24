import { GoogleGenAI } from "@google/genai";

// NOTE: In a real production app, never expose API keys in client-side code unless using a proxy or specific public scopes.
// However, per the instructions, we use process.env.API_KEY.
// This key must be valid for the features to work.


const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

// System instruction to give the AI context about the BA
const SYSTEM_INSTRUCTION = `
You are an AI assistant representing a Junior Business Analyst's portfolio. 
The candidate's name is "Truong Thi Minh Tu". 
Key details:
- Recent grad in Information Technology from Hue University of Sciences.
- Career Goal: Aspiring Business Analyst aiming to become a Product Manager.
- Experience: 
  1. Korean BrSE Intern at FPT Software (Full-stack & Korean language).
  2. Secretary/Assistant VP Education at Hue Toastmasters Club.
  3. Regional Coordinator at VietHope Inc.
- Skills: SQL, Figma, UML, BPMN, Requirement Elicitation.
- Soft Skills: Strong communication, proactive mindset, leadership.

Your goal is to answer questions from recruiters or hiring managers professionally, briefly, and enthusiastically.
If asked about contact info, direct them to the contact section.
Keep answers under 50 words unless asked for detail.
`;

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  try {
    if (!apiKey) {
      return "I'm sorry, my brain (API Key) is missing! Please configure the API Key.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I apologize, I couldn't process that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server right now. Please try again later.";
  }
};