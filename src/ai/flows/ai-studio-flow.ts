'use server';
/**
 * @fileOverview DOCFLOW AI Studio Unified Flow
 * Provides a single entry point for five specialized AI protocols:
 * - PARAPHRASE: Professional text re-engineering.
 * - SUMMARIZE: High-fidelity content distillation.
 * - EMAIL: Structural email architecture.
 * - TRANSLATE: Context-aware linguistic transformation.
 * - CHAT: Deep document interrogation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIStudioInputSchema = z.object({
  tool: z.enum(['PARAPHRASE', 'SUMMARIZE', 'EMAIL', 'TRANSLATE', 'CHAT']),
  text: z.string().optional().describe('Input text for rephrasing, translating, or summarizing.'),
  fileDataUri: z.string().optional().describe("A document as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'."),
  targetLanguage: z.string().optional().describe('Target language for translation.'),
  userQuestion: z.string().optional().describe('The user question for the Chat with Document tool.'),
});

export type AIStudioInput = z.infer<typeof AIStudioInputSchema>;

const AIStudioOutputSchema = z.object({
  result: z.string().describe('The generated AI response.'),
});

export type AIStudioOutput = z.infer<typeof AIStudioOutputSchema>;

export async function runAIStudioProtocol(input: AIStudioInput): Promise<AIStudioOutput> {
  return aiStudioFlow(input);
}

const aiStudioFlow = ai.defineFlow(
  {
    name: 'aiStudioFlow',
    inputSchema: AIStudioInputSchema,
    outputSchema: AIStudioOutputSchema,
  },
  async (input) => {
    const { tool, text, fileDataUri, targetLanguage, userQuestion } = input;

    let systemInstructions = '';
    let promptParts: any[] = [];

    switch (tool) {
      case 'PARAPHRASE':
        systemInstructions = 'You are an industrial writing assistant. Rephrase the following text to make it more professional, concise, and impactful while strictly maintaining the original meaning.';
        promptParts.push({ text: `TEXT TO RE-ENGINEER: ${text}` });
        break;
      case 'SUMMARIZE':
        systemInstructions = 'You are a high-fidelity summarizer. Provide a professional executive summary of the provided content. Use bullet points for key insights.';
        if (fileDataUri) promptParts.push({ media: { url: fileDataUri, contentType: 'application/pdf' } });
        if (text) promptParts.push({ text: `CONTENT: ${text}` });
        break;
      case 'EMAIL':
        systemInstructions = 'You are an expert email architect. Draft a clear, professional, and effective email based on the user instructions. Maintain a tone suitable for corporate environments.';
        promptParts.push({ text: `INSTRUCTIONS: ${text}` });
        break;
      case 'TRANSLATE':
        systemInstructions = `You are an industrial-grade translator. Translate the following text into ${targetLanguage || 'English'}. Maintain the tone, technical accuracy, and context.`;
        promptParts.push({ text: `SOURCE TEXT: ${text}` });
        break;
      case 'CHAT':
        systemInstructions = 'You are a document intelligence assistant. Answer user questions based EXCLUSIVELY on the provided document. If the information is not present, state that the document does not contain that information.';
        if (fileDataUri) promptParts.push({ media: { url: fileDataUri, contentType: 'application/pdf' } });
        promptParts.push({ text: `USER QUESTION: ${userQuestion}` });
        break;
    }

    const { text: result } = await ai.generate({
      system: systemInstructions,
      prompt: promptParts,
    });

    return {
      result: result || 'IDENTITY ANALYSIS FAILURE: Response stream could not be established.',
    };
  }
);
