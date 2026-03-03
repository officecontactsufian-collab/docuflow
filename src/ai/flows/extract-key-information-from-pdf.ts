'use server';
/**
 * @fileOverview An AI agent that extracts key information from a PDF document.
 *
 * - extractKeyInformationFromPdf - A function that handles the key information extraction process.
 * - ExtractKeyInformationFromPdfInput - The input type for the extractKeyInformationFromPdf function.
 * - ExtractKeyInformationFromPdfOutput - The return type for the extractKeyInformationFromPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractKeyInformationFromPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractKeyInformationFromPdfInput = z.infer<typeof ExtractKeyInformationFromPdfInputSchema>;

const ExtractKeyInformationFromPdfOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the document.'),
  keyInformation: z
    .object({
      dates: z.array(z.string()).describe('A list of important dates found in the document.'),
      names: z.array(z.string()).describe('A list of important names (people, organizations) found in the document.'),
      figures: z
        .array(z.string())
        .describe('A list of critical numerical figures or values found in the document.'),
      keywords: z.array(z.string()).describe('A list of important keywords or topics.'),
      other: z.array(z.string()).describe('Any other significant pieces of information not covered by other categories.'),
    })
    .describe('Key information points extracted from the document.'),
});
export type ExtractKeyInformationFromPdfOutput = z.infer<typeof ExtractKeyInformationFromPdfOutputSchema>;

export async function extractKeyInformationFromPdf(
  input: ExtractKeyInformationFromPdfInput
): Promise<ExtractKeyInformationFromPdfOutput> {
  return extractKeyInformationFromPdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractKeyInformationFromPdfPrompt',
  input: { schema: ExtractKeyInformationFromPdfInputSchema },
  output: { schema: ExtractKeyInformationFromPdfOutputSchema },
  prompt: `You are an expert assistant for analyzing PDF documents.
Your task is to carefully read the provided PDF content and extract key information points as structured JSON.

Extract the following:
- A brief summary of the document.
- Important dates.
- Important names (people, organizations).
- Critical numerical figures or values.
- Important keywords or topics.
- Any other significant pieces of information.

PDF Content: {{media url=pdfDataUri}}`,
});

const extractKeyInformationFromPdfFlow = ai.defineFlow(
  {
    name: 'extractKeyInformationFromPdfFlow',
    inputSchema: ExtractKeyInformationFromPdfInputSchema,
    outputSchema: ExtractKeyInformationFromPdfOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
