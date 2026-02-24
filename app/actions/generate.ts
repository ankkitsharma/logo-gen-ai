'use server';

import { GoogleGenAI } from '@google/genai';
import { 
  createSession, 
  sessionExists, 
  addPromptToHistory, 
  getPromptHistory, 
  addGeneratedLogo 
} from '@/lib/queries';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateLogo(formData: FormData) {
  try {
    let sessionId = formData.get('sessionId') as string | null;
    const prompt = formData.get('prompt') as string;
    const style = formData.get('style') as string;
    const color = formData.get('color') as string;
    const industry = formData.get('industry') as string;

    if (!prompt) {
      return { error: 'Prompt is required' };
    }

    if (!sessionId || !sessionExists(sessionId)) {
      sessionId = randomUUID();
      createSession(sessionId);
    }

    const presets = { style, color, industry };
    addPromptToHistory(sessionId, prompt, presets);

    const history = getPromptHistory(sessionId);

    const historyText = history.map((h, i) => {
      const p = JSON.parse(h.applied_presets || '{}');
      return `Interaction ${i + 1}:\n- User Prompt: ${h.prompt_text}\n- Style: ${p.style || 'None'}\n- Color: ${p.color || 'None'}\n- Industry: ${p.industry || 'None'}`;
    }).join('\n\n');

    const metaPrompt = `
You are an expert logo design assistant. We need to generate a highly detailed prompt for an image generation model to create a minimalist, professional PNG logo.
The user has been progressively refining the logo. Here is their interaction history:

${historyText}

Based on this history, output a SINGLE coherent instruction for the image generator containing all the visual elements.
It should be suitable for a high-quality logo (minimalist, flat design, white background, no text if possible or clear typography, well structured).
Return ONLY the text of the prompt and nothing else. Do not use quotes or markdown.`;

    // 1. Refine the prompt using gemini-2.5-flash
    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: metaPrompt,
    });

    const optimizedPrompt = textResponse.text?.trim() || prompt;

    // 2. Generate Image using Imagen 4
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: optimizedPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      }
    });

    const base64Image = imageResponse.generatedImages?.[0]?.image?.imageBytes;
    if (!base64Image) {
      return { error: 'Failed to generate image from AI.' };
    }

    // 3. Save Image
    const filename = `${sessionId}-${Date.now()}.png`;
    const filepath = path.join(process.cwd(), 'public/logos', filename);
    fs.writeFileSync(filepath, Buffer.from(base64Image, 'base64'));

    const publicUrl = `/logos/${filename}`;
    
    addGeneratedLogo(sessionId, publicUrl, {
      finalPrompt: optimizedPrompt,
      ...presets
    });

    return { 
      success: true, 
      logoUrl: publicUrl, 
      sessionId,
      optimizedPrompt
    };
  } catch (error: any) {
    console.error('Error generating logo:', error);
    return { error: error.message || 'An unexpected error occurred' };
  }
}

export async function loadSessionHistory(sessionId: string) {
  try {
    const history = getPromptHistory(sessionId);
    return { success: true, history };
  } catch (error) {
    return { error: 'Failed to load session history' };
  }
}
