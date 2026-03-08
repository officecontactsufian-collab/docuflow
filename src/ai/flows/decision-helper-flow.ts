'use server';
/**
 * @fileOverview AI Decision Helper Flow
 * Analyzes decisions by providing pros, cons, and a strategic synthesis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DecisionHelperInputSchema = z.object({
  decision: z.string().describe('The decision the user is evaluating.'),
});

export type DecisionHelperInput = z.infer<typeof DecisionHelperInputSchema>;

const DecisionHelperOutputSchema = z.object({
  pros: z.array(z.string()).describe('List of positive outcomes or advantages.'),
  cons: z.array(z.string()).describe('List of negative outcomes or risks.'),
  synthesis: z.string().describe('A balanced professional recommendation.'),
  riskLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']).describe('Calculated risk level.'),
});

export type DecisionHelperOutput = z.infer<typeof DecisionHelperOutputSchema>;

const prompt = ai.definePrompt({
  name: 'decisionHelperPrompt',
  input: { schema: DecisionHelperInputSchema },
  output: { schema: DecisionHelperOutputSchema },
  prompt: `You are a strategic decision consultant. Analyze the following decision scenario.

Decision Payload: {{{decision}}}

Identify clear Pros and Cons. Provide a "Synthesis" which is a professional, logical recommendation based on risk-reward analysis. Categorize the overall risk level.`,
});

export async function analyzeDecision(input: DecisionHelperInput): Promise<DecisionHelperOutput> {
  const { output } = await prompt(input);
  if (!output) throw new Error("DECISION_SYNTHESIS_FAILURE");
  return output;
}
