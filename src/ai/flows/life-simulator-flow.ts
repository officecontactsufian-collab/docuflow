'use server';
/**
 * @fileOverview AI Life Simulator Flow
 * Simulates future scenarios based on user decisions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LifeSimulatorInputSchema = z.object({
  decision: z.string().describe('The choice or path the user is considering.'),
});

export type LifeSimulatorInput = z.infer<typeof LifeSimulatorInputSchema>;

const LifeSimulatorOutputSchema = z.object({
  scenarios: z.array(z.object({
    timeframe: z.string().describe('e.g., 6 months, 1 year, 5 years.'),
    outcome: z.string().describe('Detailed potential result of this path.'),
    probability: z.string().describe('Estimated likelihood percentage.'),
  })).describe('Temporal outcome stream.'),
  summary: z.string().describe('High-level executive synthesis of the simulated path.'),
});

export type LifeSimulatorOutput = z.infer<typeof LifeSimulatorOutputSchema>;

const prompt = ai.definePrompt({
  name: 'lifeSimulatorPrompt',
  input: { schema: LifeSimulatorInputSchema },
  output: { schema: LifeSimulatorOutputSchema },
  prompt: `You are a sophisticated temporal simulation AI. Analyze the following life decision.

Decision: {{{decision}}}

Simulate the most likely outcomes across different timeframes (Short, Medium, and Long-term). Provide a strategic summary of the entire life path simulation.`,
});

export async function simulateLifePath(input: LifeSimulatorInput): Promise<LifeSimulatorOutput> {
  const { output } = await prompt(input);
  if (!output) throw new Error("SIMULATION_FAILURE");
  return output;
}
