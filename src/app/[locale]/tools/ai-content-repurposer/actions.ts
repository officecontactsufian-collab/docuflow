'use server';

import { repurposeContent, ContentRepurposerInput, ContentRepurposerOutput } from '@/ai/flows/content-repurposer-flow';

/**
 * @fileOverview AI Content Repurposer Server Action (Localized)
 */

export async function executeRepurposerAction(input: ContentRepurposerInput): Promise<ContentRepurposerOutput> {
  try {
    return await repurposeContent(input);
  } catch (error: any) {
    console.error('Repurposer Failure:', error);
    throw new Error('The content repurposing sequence failed.');
  }
}
