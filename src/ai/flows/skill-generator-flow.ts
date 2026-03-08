'use server';
/**
 * @fileOverview AI Skill Generator Flow
 * Suggests skills and creates a structured 30-day learning protocol.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SkillGeneratorInputSchema = z.object({
  interests: z.string().describe('User interests or career goals.'),
});

export type SkillGeneratorInput = z.infer<typeof SkillGeneratorInputSchema>;

const SkillGeneratorOutputSchema = z.object({
  skillName: z.string().describe('The name of the suggested skill.'),
  rationale: z.string().describe('Why this skill is valuable for the user.'),
  curriculum: z.array(z.object({
    week: z.number(),
    topic: z.string(),
    dailyPlan: z.string(),
    exercise: z.string(),
  })).describe('A structured 4-week learning protocol.'),
});

export type SkillGeneratorOutput = z.infer<typeof SkillGeneratorOutputSchema>;

const prompt = ai.definePrompt({
  name: 'skillGeneratorPrompt',
  input: { schema: SkillGeneratorInputSchema },
  output: { schema: SkillGeneratorOutputSchema },
  prompt: `You are an expert learning architect. Based on the user's interests, suggest a high-impact skill they can learn in 30 days.

Interests: {{{interests}}}

Provide a detailed 4-week curriculum with daily plans and exercises to ensure mastery.`,
});

export async function generateSkillProtocol(input: SkillGeneratorInput): Promise<SkillGeneratorOutput> {
  const { output } = await prompt(input);
  if (!output) throw new Error("CURRICULUM_SYNTHESIS_FAILURE");
  return output;
}
