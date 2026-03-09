'use server';

import { synthesizeBrain, PersonalBrainInput, PersonalBrainOutput } from '@/ai/flows/personal-brain-flow';

/**
 * @fileOverview AI Personal Brain Server Action (Localized)
 */

export async function executeBrainSynthesisAction(input: PersonalBrainInput): Promise<PersonalBrainOutput> {
  try {
    return await synthesizeBrain(input);
  } catch (error: any) {
    console.error('Brain Synthesis Failure:', error);
    throw new Error('The personal knowledge synthesis failed.');
  }
}
