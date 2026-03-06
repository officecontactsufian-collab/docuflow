'use server';

import { runAIStudioProtocol, AIStudioInput, AIStudioOutput } from '@/ai/flows/ai-studio-flow';

/**
 * @fileOverview DOCFLOW AI Studio Hardened Tunnel
 * Provides a secure entry point for AI operations.
 * API Keys are protected on the server. 
 * Registry management (logging/caching) is handled by the client to satisfy security rules.
 */

export async function executeAIStudioAction(input: AIStudioInput): Promise<AIStudioOutput> {
  try {
    // Execute industrial AI sequence via Genkit
    // The Gemini key is used server-side only
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
