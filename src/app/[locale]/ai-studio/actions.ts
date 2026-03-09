'use server';

import { runAIStudioProtocol, AIStudioInput, AIStudioOutput } from '@/ai/flows/ai-studio-flow';

export async function executeAIStudioAction(input: AIStudioInput): Promise<AIStudioOutput> {
  try {
    const response = await runAIStudioProtocol(input);

    if (!response || !response.result) {
      throw new Error("STREAM SYNTHESIS FAILURE: The AI engine returned an empty buffer.");
    }

    return response;
  } catch (error: any) {
    console.error('Industrial Protocol Failure:', error);
    throw new Error(error.message || 'The industrial AI sequence failed to establish a stable stream.');
  }
}
