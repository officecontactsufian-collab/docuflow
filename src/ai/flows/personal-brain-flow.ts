'use server';
/**
 * @fileOverview AI Personal Brain Flow
 * Reconstructs raw notes and data into a structured, searchable knowledge index.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PersonalBrainInputSchema = z.object({
  content: z.string().describe('The raw notes, file content, or links to organize.'),
});

export type PersonalBrainInput = z.infer<typeof PersonalBrainInputSchema>;

const PersonalBrainOutputSchema = z.object({
  summary: z.string().describe('A high-level executive summary of the knowledge.'),
  index: z.array(z.object({
    category: z.string().describe('The knowledge domain or category.'),
    keyPoints: z.array(z.string()).describe('Critical insights in this category.'),
    actionItems: z.array(z.string()).optional().describe('Suggested next steps based on this data.'),
  })).describe('A structured index of the provided information.'),
});

export type PersonalBrainOutput = z.infer<typeof PersonalBrainOutputSchema>;

const prompt = ai.definePrompt({
  name: 'personalBrainPrompt',
  input: { schema: PersonalBrainInputSchema },
  output: { schema: PersonalBrainOutputSchema },
  prompt: `You are an advanced cognitive organizer. Process the following input stream and synthesize it into a "Digital Brain".

Input Stream: {{{content}}}

1. Provide a concise executive summary of the total knowledge payload.
2. Index the data into specific logical categories.
3. Extract key insights and actionable items for each category.`,
});

export async function synthesizeBrain(input: PersonalBrainInput): Promise<PersonalBrainOutput> {
  const { output } = await prompt(input);
  if (!output) throw new Error("BRAIN_SYNTHESIS_FAILURE");
  return output;
}
