'use server';

import Jimp from 'jimp';

/**
 * @fileOverview DOCFLOW Industrial Background Removal
 * Handles backend pixel-level sanitization using chroma-keying logic.
 */

export async function processBackgroundRemovalAction(base64Data: string): Promise<string> {
  try {
    const base64Content = base64Data.split(',')[1] || base64Data;
    const buffer = Buffer.from(base64Content, 'base64');
    
    const image = await Jimp.read(buffer);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // STEP 1: SAMPLE BACKGROUND COLOR (Top-Left Pixel Heuristic)
    const bgR = image.bitmap.data[0];
    const bgG = image.bitmap.data[1];
    const bgB = image.bitmap.data[2];

    // STEP 2: CHROMA-KEYING WITH TOLERANCE
    const tolerance = 40; 

    image.scan(0, 0, width, height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      const distance = Math.sqrt(
        Math.pow(r - bgR, 2) + 
        Math.pow(g - bgG, 2) + 
        Math.pow(b - bgB, 2)
      );

      if (distance < tolerance) {
        this.bitmap.data[idx + 3] = 0; // Set Alpha to 0 (Transparent)
      }
    });

    // High-fidelity edge smoothing
    image.blur(1).contrast(0.1);
    
    const processedBase64 = await image.getBase64Async(Jimp.MIME_PNG);
    return processedBase64;
  } catch (error) {
    console.error('Background removal failure:', error);
    throw new Error('Backend pixel isolation sequence failed.');
  }
}
