'use server';

import { generateSkillProtocol, SkillGeneratorInput, SkillGeneratorOutput } from '@/ai/flows/skill-generator-flow';

export async function executeSkillGenerationAction(input: SkillGeneratorInput): Promise<SkillGeneratorOutput> {
  try {
    return await generateSkillProtocol(input);
  } catch (error: any) {
    console.error('Skill Generation Failure:', error);
    throw new Error('The skill synthesis sequence failed.');
  }
}
