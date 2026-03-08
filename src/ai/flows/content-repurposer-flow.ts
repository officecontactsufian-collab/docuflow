'use server';
/**
 * @fileOverview AI Content Repurposer Flow
 * Converts long content into multiple viral social media formats.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ContentRepurposerInputSchema = z.object({
  content: z.string().describe('The source content (article, transcript, etc.)'),
});

export type ContentRepurposerInput = z.infer<typeof ContentRepurposerInputSchema>;

const ContentRepurposerOutputSchema = z.object({
  tweetThread: z.array(z.string()).describe('A thread of 3-5 tweets.'),
  linkedInPost: z.string().describe('A professional LinkedIn post.'),
  tiktokScript: z.string().describe('A short, engaging hook and script for TikTok.'),
  shortSummary: z.string().describe('A one-paragraph summary.'),
});

export type ContentRepurposerOutput = z.infer<typeof ContentRepurposerOutputSchema>;

const prompt = ai.definePrompt({
  name: 'contentRepurposerPrompt',
  input: { schema: ContentRepurposerInputSchema },
  output: { schema: ContentRepurposerOutputSchema },
  prompt: `You are a viral content strategist. Repurpose the provided source content into multiple high-engagement formats.

Source Content: {{{content}}}

Formats Required:
1. A Twitter (X) thread (3-5 tweets) with a strong hook.
2. A professional yet engaging LinkedIn post with emojis and spacing.
3. A TikTok script focus on a fast-paced hook.
4. A concise summary for quick reading.`,
});

export async function repurposeContent(input: ContentRepurposerInput): Promise<ContentRepurposerOutput> {
  const { output } = await prompt(input);
  if (!output) throw new Error("REPURPOSE_SYNTHESIS_FAILURE");
  return output;
}
