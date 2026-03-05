'use server';
/**
 * @fileOverview An AI agent that removes watermarks from images.
 *
 * - removeWatermarkFromImage - A function that handles the watermark removal process using Gemini Vision.
 * - RemoveWatermarkInput - The input type for the removeWatermarkFromImage function.
 * - RemoveWatermarkOutput - The return type for the removeWatermarkFromImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RemoveWatermarkInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RemoveWatermarkInput = z.infer<typeof RemoveWatermarkInputSchema>;

const RemoveWatermarkOutputSchema = z.object({
  cleanedImageDataUri: z.string().describe('The cleaned image as a data URI.'),
});
export type RemoveWatermarkOutput = z.infer<typeof RemoveWatermarkOutputSchema>;

export async function removeWatermarkFromImage(
  input: RemoveWatermarkInput
): Promise<RemoveWatermarkOutput> {
  return removeWatermarkFromImageFlow(input);
}

const removeWatermarkFromImageFlow = ai.defineFlow(
  {
    name: 'removeWatermarkFromImageFlow',
    inputSchema: RemoveWatermarkInputSchema,
    outputSchema: RemoveWatermarkOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image',
      prompt: [
        { media: { url: input.imageDataUri } },
        { text: "Carefully analyze this image and remove any watermarks, logos, or text overlays that appear to be added on top of the original content. Use inpainting techniques to restore the background naturally. The output must be the original image but completely clean of watermarks." },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('AI engine failed to reconstruct the image stream.');
    }

    return {
      cleanedImageDataUri: media.url,
    };
  }
);
