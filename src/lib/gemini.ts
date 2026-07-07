import { GoogleGenerativeAI, Schema, Type } from '@google/generative-ai';

// Replace with your actual Gemini API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";

const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeSymptoms = async (symptoms: string) => {
  // Use gemini-1.5-flash as specified in PRD for speed and cost-effectiveness
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          triage_level: {
            type: Type.STRING,
            description: "Triage priority: 'High', 'Medium', or 'Low'",
            enum: ["High", "Medium", "Low"]
          },
          extracted_symptoms: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of key medical entities extracted (e.g. 'chest pain', 'fever', '45yo')"
          },
          reasoning: {
            type: Type.STRING,
            description: "A short 1-2 sentence explanation for the assigned priority."
          }
        },
        required: ["triage_level", "extracted_symptoms", "reasoning"]
      }
    }
  });

  const prompt = `
    You are a highly trained medical triage assistant operating in a rural Primary Health Centre (PHC).
    Analyze the following patient symptoms. Extract the key medical entities (symptoms, age, vitals if present) 
    and assign a triage priority based on the severity.
    - High: Life-threatening, severe pain, breathing issues, severe bleeding.
    - Medium: Moderate pain, high fever without severe complications, mild fractures.
    - Low: Mild fever, cold, minor cuts, general consultation.
    
    Patient Symptoms: "${symptoms}"
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process symptoms with AI. Please check your API key and connection.");
  }
};
