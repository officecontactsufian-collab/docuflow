import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-pdf-content-flow.ts';
import '@/ai/flows/extract-key-information-from-pdf.ts';
import '@/ai/flows/remove-watermark-image-flow.ts';
import '@/ai/flows/ai-studio-flow.ts';
import '@/ai/flows/prompt-improver-flow.ts';
import '@/ai/flows/humanizer-flow.ts';
import '@/ai/flows/content-repurposer-flow.ts';
import '@/ai/flows/niche-finder-flow.ts';
import '@/ai/flows/decision-helper-flow.ts';
import '@/ai/flows/personal-brain-flow.ts';
import '@/ai/flows/life-simulator-flow.ts';
import '@/ai/flows/skill-generator-flow.ts';
import '@/ai/flows/reality-check-flow.ts';
import '@/ai/flows/remove-background-flow.ts';
