'use server';
/**
 * @fileOverview AI Humanizer Flow
 * Converts AI-generated text into natural, human-like writing while preserving the original intent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HumanizerInputSchema = z.object({
  text: z.string().describe('The AI-generated text to humanize.'),
});

export type HumanizerInput = z.infer<typeof HumanizerInputSchema>;

const HumanizerOutputSchema = z.object({
  humanizedText: z.string().describe('The human-like version of the input text.'),
});

export type HumanizerOutput = z.infer<typeof HumanizerOutputSchema>;

const prompt = ai.definePrompt({
  name: 'humanizerPrompt',
  input: { schema: HumanizerInputSchema },
  output: { schema: HumanizerOutputSchema },
  prompt: `You are a professional editor specializing in natural linguistic synthesis. 
Take the following text and rewrite it so it sounds like it was written by a human expert.

Text: {{{text}}}

Guidelines:
- Remove repetitive AI patterns and overly formal "assistant" phrasing.
- Vary sentence structure and length.
- Use natural idioms and professional yet accessible vocabulary.
- Ensure the core meaning remains exactly the same.`,
});

export async function humanizeText(input: HumanizerInput): Promise<HumanizerOutput> {
  const { output } = await prompt(input);
  if (!output) throw new Error("HUMANIZATION_STREAM_FAILURE");
  return output;
}
