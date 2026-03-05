'use server';
/**
 * @fileOverview An AI agent that isolates the subject of an image for background removal.
 *
 * - removeBackgroundAI - A function that handles the AI subject isolation process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RemoveBackgroundAIInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export async function removeBackgroundAI(input: { imageDataUri: string }): Promise<string> {
  const { media } = await ai.generate({
    model: 'googleai/gemini-2.5-flash-image',
    prompt: [
      { media: { url: input.imageDataUri } },
      { text: "Carefully identify the main subject in this image. Remove the existing background entirely and replace it with a solid, pure bright green color (hex #00FF00). Do not alter the subject itself. Return the result as a high-quality image of the subject on a pure green screen for industrial keying." },
    ],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  if (!media || !media.url) {
    throw new Error('AI engine failed to isolate the subject.');
  }

  return media.url;
}
