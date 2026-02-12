
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GenerationParams, AspectRatio } from "../types";

/**
 * Common AI instance helper
 */
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Image Generation with Pro features & Custom Ratios
 */
export const generateAIPost = async (params: GenerationParams) => {
  const ai = getAI();
  const model = (params.imageSize !== '1K') ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [{ text: params.prompt }] },
    config: {
      imageConfig: {
        aspectRatio: params.aspectRatio as any,
        ...(model === 'gemini-3-pro-image-preview' ? { imageSize: params.imageSize } : {})
      }
    },
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!part?.inlineData) throw new Error("No image data generated");
  return `data:image/png;base64,${part.inlineData.data}`;
};

// Added enhancePrompt function to resolve import error in AIStudio.tsx
/**
 * Prompt enhancement for AI images using a fast text model
 */
export const enhancePrompt = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Enhance the following image generation prompt to be more descriptive and artistic, while keeping the original intent. Only return the enhanced prompt text: "${prompt}"`,
  });
  return response.text || prompt;
};

/**
 * Image Editing with Gemini 2.5 Flash Image
 */
export const editImage = async (base64Image: string, instruction: string) => {
  const ai = getAI();
  const data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data, mimeType: 'image/png' } },
        { text: instruction }
      ]
    }
  });

  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!part?.inlineData) throw new Error("Could not edit image");
  return `data:image/png;base64,${part.inlineData.data}`;
};

/**
 * Veo Video Generation (Prompt or Image based)
 */
export const generateVideo = async (prompt: string, imageBase64?: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
  const ai = getAI();
  
  const payload: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
  };

  if (imageBase64) {
    payload.image = {
      imageBytes: imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64,
      mimeType: 'image/png'
    };
  }

  let operation = await ai.models.generateVideos(payload);
  
  while (!operation.done) {
    await new Promise(r => setTimeout(r, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

/**
 * Advanced Chat with Grounding and Thinking
 */
export const creativeChat = async (message: string, useSearch = false, useMaps = false, useThinking = false) => {
  const ai = getAI();
  const tools: any[] = [];
  if (useSearch) tools.push({ googleSearch: {} });
  if (useMaps) tools.push({ googleMaps: {} });

  const model = useMaps ? 'gemini-2.5-flash-lite-latest' : 'gemini-3-pro-preview';
  
  const config: any = { tools };

  if (useThinking) {
    // Adjusted thinkingBudget based on model capabilities (Max 24576 for Flash-Lite, 32768 for Pro)
    config.thinkingConfig = { thinkingBudget: model.includes('pro') ? 32768 : 24576 };
  }

  const response = await ai.models.generateContent({
    model,
    contents: message,
    config
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

/**
 * Image Analysis
 */
export const analyzeContent = async (base64: string, instruction: string, isVideo = false) => {
  const ai = getAI();
  const data = base64.includes(',') ? base64.split(',')[1] : base64;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data, mimeType: isVideo ? 'video/mp4' : 'image/png' } },
        { text: instruction }
      ]
    }
  });
  return response.text;
};

/**
 * Text-to-Speech
 */
export const generateSpeech = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
    },
  });

  const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64) return null;
  return base64;
};

/**
 * Base64 encoding/decoding helper functions as required by instructions
 */
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Audio decoding helper for TTS and Live API
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
