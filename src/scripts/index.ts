import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// ✅ FIXED: Removed `model` from generationConfig
const generationConfig = {
  temperature: 0.7,
  maxOutputTokens: 256,
};

// ✅ FIXED: Pass model name only here
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // or "gemini-pro" or whatever is valid for your API key
});

// Start chat session
export const chatSession = model.startChat({
  generationConfig,
  safetySettings,
});
