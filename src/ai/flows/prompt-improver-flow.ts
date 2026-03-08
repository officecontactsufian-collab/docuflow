'use server';
/**
 * @fileOverview AI Prompt Improver Flow
 * Transforms simple user prompts into high-quality, optimized prompts for LLMs and image generators.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PromptImproverInputSchema = z.object({
  userPrompt: z.string().describe('The simple prompt to be improved.'),
  targetTool: z.enum(['GENERAL', 'IMAGE_GEN', 'CODE_ASSISTANT', 'CREATIVE_WRITING']).default('GENERAL'),
});

export type PromptImproverInput = z.infer<typeof PromptImproverInputSchema>;

const PromptImproverOutputSchema = z.object({
  improvedPrompt: z.string().describe('The enhanced, structured prompt.'),
  explanation: z.string().describe('Short explanation of why these changes were made.'),
});

export type PromptImproverOutput = z.infer<typeof PromptImproverOutputSchema>;

const prompt = ai.definePrompt({
  name: 'promptImproverPrompt',
  input: { schema: PromptImproverInputSchema },
  output: { schema: PromptImproverOutputSchema },
  prompt: `You are an expert Prompt Engineer. Your task is to take a simple user prompt and transform it into a professional, high-fidelity optimized prompt.

Context: Target Tool Type is {{{targetTool}}}.
Simple Prompt: {{{userPrompt}}}

Instructions:
1. Expand the prompt to include context, persona, specific constraints, and desired output format.
2. If it's for IMAGE_GEN, focus on lighting, style, medium, and technical specs.
3. If it's for CODE_ASSISTANT, focus on language specs, performance requirements, and error handling.
4. Provide the improved prompt and a brief explanation of the improvements.`,
});

export async function improvePrompt(input: PromptImproverInput): Promise<PromptImproverOutput> {
  const { output } = await prompt(input);
  if (!output) throw new Error("PROMPT_SYNTHESIS_FAILURE");
  return output;
}
