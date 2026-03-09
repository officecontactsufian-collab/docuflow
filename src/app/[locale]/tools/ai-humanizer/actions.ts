'use server';

import { humanizeText, HumanizerInput, HumanizerOutput } from '@/ai/flows/humanizer-flow';

/**
 * @fileOverview AI Humanizer Server Action (Localized)
 */

export async function executeHumanizerAction(input: HumanizerInput): Promise<HumanizerOutput> {
  try {
    return await humanizeText(input);
  } catch (error: any) {
    console.error('Humanizer Failure:', error);
    throw new Error('The linguistic synthesis sequence failed.');
  }
}
