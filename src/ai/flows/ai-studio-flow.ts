'use server';
/**
 * @fileOverview DOCFLOW AI Studio Unified Flow
 * Provides a single entry point for specialized AI protocols:
 * - PARAPHRASE: Professional text re-engineering.
 * - SUMMARIZE: High-fidelity content distillation.
 * - EMAIL: Structural email architecture.
 * - TRANSLATE: Context-aware linguistic transformation.
 * - CHAT: Deep document interrogation.
 * - GRAMMAR: Industrial-grade proofing and stylistic refinement.
 * - ESSAY: Structured academic and professional draft synthesis.
 * - RESUME: High-impact professional profile engineering.
 * - COVER_LETTER: Persuasive professional introduction synthesis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIStudioInputSchema = z.object({
  tool: z.enum(['PARAPHRASE', 'SUMMARIZE', 'EMAIL', 'TRANSLATE', 'CHAT', 'GRAMMAR', 'ESSAY', 'RESUME', 'COVER_LETTER']),
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
      case 'GRAMMAR':
        systemInstructions = 'You are a professional editor and linguist. Review the provided text for grammatical errors, spelling mistakes, and stylistic inconsistencies. Provide a corrected version that maintains the original intent but adheres to high-level professional standards.';
        promptParts.push({ text: `TEXT TO PROOFREAD: ${text}` });
        break;
      case 'ESSAY':
        systemInstructions = 'You are an expert essayist and academic writer. Draft a comprehensive, well-structured essay based on the provided topic, outline, or prompt. Use an academic tone, provide logical transitions, and ensure clear thematic development.';
        promptParts.push({ text: `ESSAY ARCHITECTURE PROMPT: ${text}` });
        break;
      case 'RESUME':
        systemInstructions = 'You are a high-level career consultant. Based on the provided raw experience and background, generate a high-impact, industrial-grade resume. Focus on quantifiable achievements and strategic keywords.';
        promptParts.push({ text: `EXPERIENCE PAYLOAD: ${text}` });
        break;
      case 'COVER_LETTER':
        systemInstructions = 'You are an expert cover letter architect. Write a persuasive, professional cover letter based on the provided job description and candidate background. Focus on alignment between skills and employer needs.';
        promptParts.push({ text: `CANDIDATE AND JOB DATA: ${text}` });
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
