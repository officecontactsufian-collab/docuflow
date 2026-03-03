'use server';
/**
 * @fileOverview A Genkit flow for summarizing the content of a PDF document.
 *
 * - summarizePdfContent - A function that summarizes the content of a PDF document.
 * - SummarizePdfContentInput - The input type for the summarizePdfContent function.
 * - SummarizePdfContentOutput - The return type for the summarizePdfContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePdfContentInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The content of the PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizePdfContentInput = z.infer<typeof SummarizePdfContentInputSchema>;

const SummarizePdfContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the PDF document.'),
});
export type SummarizePdfContentOutput = z.infer<typeof SummarizePdfContentOutputSchema>;

const summarizePdfContentPrompt = ai.definePrompt({
  name: 'summarizePdfContentPrompt',
  input: {schema: SummarizePdfContentInputSchema},
  output: {schema: SummarizePdfContentOutputSchema},
  prompt: `You are a helpful assistant that summarizes PDF documents.

Please provide a concise summary of the main content of the following PDF document.

PDF Content: {{media url=pdfDataUri}}`,
});

const summarizePdfContentFlow = ai.defineFlow(
  {
    name: 'summarizePdfContentFlow',
    inputSchema: SummarizePdfContentInputSchema,
    outputSchema: SummarizePdfContentOutputSchema,
  },
  async input => {
    const {output} = await summarizePdfContentPrompt(input);
    return output!;
  }
);

export async function summarizePdfContent(input: SummarizePdfContentInput): Promise<SummarizePdfContentOutput> {
  return summarizePdfContentFlow(input);
}
