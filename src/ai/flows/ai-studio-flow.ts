
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
  fileDataUri: z.string().optional().describe("A document as a data URI. Supported: PDF, DOCX, TXT."),
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

    // Protocol Routing & Prompt Engineering
    switch (tool) {
      case 'PARAPHRASE':
        systemInstructions = 'You are an industrial writing assistant. Rephrase the following text to make it more professional, concise, and impactful while strictly maintaining the original meaning. Use industrial and precise vocabulary.';
        promptParts.push({ text: `PAYLOAD TO RE-ENGINEER: ${text}` });
        break;
      case 'SUMMARIZE':
        systemInstructions = 'You are a high-fidelity summarizer. Provide a professional executive summary of the provided content. Use bullet points for key insights and a final "Strategic Conclusion" sentence.';
        if (fileDataUri) {
          const contentType = fileDataUri.split(';')[0].split(':')[1];
          promptParts.push({ media: { url: fileDataUri, contentType: contentType || 'application/pdf' } });
        }
        if (text) promptParts.push({ text: `CONTENT STREAM: ${text}` });
        break;
      case 'EMAIL':
        systemInstructions = 'You are an expert email architect. Draft a clear, professional, and effective email based on the user instructions. Maintain a tone suitable for corporate environments. Include a subject line and a structured body.';
        promptParts.push({ text: `ARCHITECTURAL INSTRUCTIONS: ${text}` });
        break;
      case 'TRANSLATE':
        systemInstructions = `You are an industrial-grade translator. Translate the following text into ${targetLanguage || 'English'}. Maintain the exact technical context and professional tone.`;
        promptParts.push({ text: `SOURCE PAYLOAD: ${text}` });
        break;
      case 'CHAT':
        systemInstructions = 'You are a document intelligence assistant. Answer user questions based EXCLUSIVELY on the provided document architecture. If the information is not present in the document stream, explicitly state that the source does not contain that specific data.';
        if (fileDataUri) {
          const contentType = fileDataUri.split(';')[0].split(':')[1];
          promptParts.push({ media: { url: fileDataUri, contentType: contentType || 'application/pdf' } });
        }
        promptParts.push({ text: `PROTOCOL INQUIRY: ${userQuestion}` });
        break;
    }

    const { text: result } = await ai.generate({
      system: systemInstructions,
      prompt: promptParts,
      config: {
        temperature: 0.2, // Lower temperature for high-fidelity industrial precision
      }
    });

    if (!result) {
      throw new Error("STREAM SYNTHESIS FAILURE: The AI engine returned an empty buffer.");
    }

    return {
      result: result,
    };
  }
);
