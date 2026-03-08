'use server';

import { improvePrompt, PromptImproverInput, PromptImproverOutput } from '@/ai/flows/prompt-improver-flow';

export async function executePromptImprovementAction(input: PromptImproverInput): Promise<PromptImproverOutput> {
  try {
    return await improvePrompt(input);
  } catch (error: any) {
    console.error('Prompt Improvement Failure:', error);
    throw new Error('The prompt optimization sequence failed.');
  }
}
