'use server';
/**
 * @fileOverview AI Niche Finder Flow
 * Generates profitable niche ideas based on user interests.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NicheFinderInputSchema = z.object({
  interests: z.string().describe('User interests, keywords, or industries.'),
});

export type NicheFinderInput = z.infer<typeof NicheFinderInputSchema>;

const NicheFinderOutputSchema = z.object({
  niches: z.array(z.object({
    title: z.string().describe('The name of the niche.'),
    explanation: z.string().describe('Why this niche is profitable or interesting.'),
    useCases: z.array(z.string()).describe('Potential business or content ideas within this niche.'),
    difficulty: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Estimated competition level.'),
  })).describe('A list of 3-5 niche ideas.'),
});

export type NicheFinderOutput = z.infer<typeof NicheFinderOutputSchema>;

const prompt = ai.definePrompt({
  name: 'nicheFinderPrompt',
  input: { schema: NicheFinderInputSchema },
  output: { schema: NicheFinderOutputSchema },
  prompt: `You are an expert market analyst and entrepreneur. 
Based on the following interests or keywords, identify 3-5 profitable and specific niche ideas.

Interests: {{{interests}}}

For each niche, provide:
1. A clear title.
2. A detailed explanation of the market opportunity.
3. Specific use cases or business models.
4. An estimated difficulty level based on current competition.`,
});

export async function findNiches(input: NicheFinderInput): Promise<NicheFinderOutput> {
  const { output } = await prompt(input);
  if (!output) throw new Error("NICHE_SYNTHESIS_FAILURE");
  return output;
}
