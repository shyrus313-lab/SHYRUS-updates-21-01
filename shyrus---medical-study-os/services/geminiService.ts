
import { GoogleGenAI, Type } from "@google/genai";
import { AppState, Flashcard, ChatMessage } from "../types";

// Helper to sanitize JSON response from models
const sanitizeJson = (text: string): string => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

// Helper to format chat history for context
const formatHistory = (history: ChatMessage[]) => {
  return history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');
};

export const getAdaptivePlan = async (state: AppState, energy: string, availableHours: number) => {
  try {
    if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Energy Matrix: ${energy}. Operational Window: ${availableHours} hours. Hospital Duty: ${state.isHospitalMode ? 'ENGAGED' : 'REST'}. Recent History: ${formatHistory(state.chatHistory.slice(-3))}. Propose 3 high-yield study quests from these nodes: ${state.subjects.filter(s => s.priority === 'High').map(s => s.name).join(', ')}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are SHYRUS, a tactical study OS modeled after JARVIS. Address superior as 'Sir'. Return valid JSON only.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quests: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  duration: { type: Type.NUMBER },
                  type: { type: Type.STRING, enum: ['Main', 'Side'] }
                },
                required: ["title", "subject", "duration", "type"]
              }
            },
            encouragement: { type: Type.STRING }
          },
          required: ["quests", "encouragement"]
        }
      }
    });

    const text = sanitizeJson(response.text || "{}");
    return JSON.parse(text);
  } catch (error) {
    console.error("SHYRUS Forge Error:", error);
    return null;
  }
};

export const askMedicalDoubt = async (query: string, state: AppState) => {
  try {
    if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: {
        systemInstruction: `You are SHYRUS Consultant Core. Address superior as "Sir". Tone: Refined, brilliant, proactive. Use history for context: ${formatHistory(state.chatHistory.slice(-5))}. Provide clinical evidence and [HY] facts.`,
      },
    });

    return response.text;
  } catch (error) {
    return "Sir, I'm experiencing a neural sync failure. Check your uplink connection or API key status.";
  }
};

export const askSupportCounselor = async (query: string, state: AppState) => {
  try {
    if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: {
        systemInstruction: `You are ${state.sanctuaryAssistantName}, a female AI companion like Friday. Never call user "Sir". Call him "Shabbir". Tone: Warm, empathetic, intuitive. Context: ${formatHistory(state.ventHistory.slice(-5))}.`,
      },
    });

    return response.text;
  } catch (error) {
    return "I'm here, Shabbir. There was a slight ripple in our connection, but I'm not leaving.";
  }
};

export const generateFlashcards = async (subject: string, fileName: string): Promise<Flashcard[]> => {
  try {
    if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Subject: ${subject}. File: ${fileName}. Generate 5 FMGE-targeted cards.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a medical analyst. Generate high-yield flashcards. Return JSON only.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
              mnemonic: { type: Type.STRING }
            },
            required: ["question", "answer"]
          }
        }
      }
    });

    const text = sanitizeJson(response.text || "[]");
    const cards = JSON.parse(text);
    return cards.map((c: any, i: number) => ({
      id: `fc-${Date.now()}-${i}`,
      ...c
    }));
  } catch (error) {
    console.error("Deck Gen Error:", error);
    return [];
  }
};

export const interactWithAssistant = async (query: string, state: AppState) => {
  try {
    if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const history = formatHistory(state.chatHistory.slice(-3));
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Query: ${query}. Context: ${history}`,
      config: {
        systemInstruction: "You are SHYRUS OS. Address user as 'Sir'. Identify if user wants to add a MISSION (study task) or HOSPITAL task. Return JSON only.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            action: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["ADD_QUEST", "ADD_HOSPITAL_TASK", "NONE"] },
                payload: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    duration: { type: Type.NUMBER },
                    label: { type: Type.STRING }
                  }
                }
              },
              required: ["type"]
            }
          },
          required: ["text", "action"]
        }
      }
    });

    const text = sanitizeJson(response.text || "{}");
    return JSON.parse(text);
  } catch (error) {
    console.error("Neural Link Error:", error);
    return { text: "Sir, neural sync is compromised. Ensure the API_KEY environment variable is active.", action: { type: "NONE" } };
  }
};

export const generateRapidRevisionNotes = async (subject: string, fileName: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze ${fileName} for ${subject}. Markdown revision notes.`,
      config: { systemInstruction: "You are a medical intelligence analyzer. Address superior as 'Sir'." }
    });
    return response.text || "Synthesis empty.";
  } catch (error) {
    return "Synthesis failed, Sir.";
  }
};

export const getFailSafePlan = async (state: AppState) => {
  try {
    if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Exam Date: ${state.profile.examDate}. Subjects covered: ${state.subjects.filter(s => s.coverage > 0).length}/19. Protocol: Compression.`,
      config: { systemInstruction: "You are JARVIS. Address as 'Sir'. Be efficient." }
    });
    return response.text || "Plan undefined.";
  } catch (error) {
    return "Logic failure, Sir.";
  }
};
