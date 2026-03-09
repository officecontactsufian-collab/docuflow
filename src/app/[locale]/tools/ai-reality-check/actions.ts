'use server';

import { checkReality, RealityCheckInput, RealityCheckOutput } from '@/ai/flows/reality-check-flow';

/**
 * @fileOverview AI Reality Check Server Action (Localized)
 */

export async function executeRealityCheckAction(input: RealityCheckInput): Promise<RealityCheckOutput> {
  try {
    return await checkReality(input);
  } catch (error: any) {
    console.error('Reality Check Failure:', error);
    throw new Error('The brutal analysis sequence failed.');
  }
}
