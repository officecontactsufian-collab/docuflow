'use server';
/**
 * @fileOverview AI Reality Check Flow
 * Analyzes project ideas for viability and market risk.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RealityCheckInputSchema = z.object({
  projectIdea: z.string().describe('The project or business idea to analyze.'),
});

export type RealityCheckInput = z.infer<typeof RealityCheckInputSchema>;

const RealityCheckOutputSchema = z.object({
  viabilityScore: z.number().min(0).max(100).describe('Overall viability percentage.'),
  marketAnalysis: z.string().describe('Contextual overview of the target market.'),
  competitorRisk: z.string().describe('Analysis of current competition.'),
  revenuePotential: z.string().describe('Projected financial outlook.'),
  brutalHonesty: z.string().describe('A no-nonsense, realistic critique of the idea.'),
});

export type RealityCheckOutput = z.infer<typeof RealityCheckOutputSchema>;

const prompt = ai.definePrompt({
  name: 'realityCheckPrompt',
  input: { schema: RealityCheckInputSchema },
  output: { schema: RealityCheckOutputSchema },
  prompt: `You are a brutal reality check AI for entrepreneurs. Scrutinize the following project idea.

Project Idea: {{{projectIdea}}}

Provide a realistic, data-driven analysis of the market, risk, and potential. Be extremely direct and highlight the most likely points of failure.`,
});

export async function checkReality(input: RealityCheckInput): Promise<RealityCheckOutput> {
  const { output } = await prompt(input);
  if (!output) throw new Error("ANALYSIS_SYNTHESIS_FAILURE");
  return output;
}
