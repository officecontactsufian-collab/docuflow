'use server';

import { findNiches, NicheFinderInput, NicheFinderOutput } from '@/ai/flows/niche-finder-flow';

/**
 * @fileOverview AI Niche Finder Server Action (Localized)
 */

export async function executeNicheFinderAction(input: NicheFinderInput): Promise<NicheFinderOutput> {
  try {
    return await findNiches(input);
  } catch (error: any) {
    console.error('Niche Finder Failure:', error);
    throw new Error('The niche synthesis protocol failed to initialize.');
  }
}
