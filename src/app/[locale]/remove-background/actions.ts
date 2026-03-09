'use server';

import Jimp from 'jimp';
import { removeBackgroundAI } from '@/ai/flows/remove-background-flow';

export async function processBackgroundRemovalAction(base64Data: string): Promise<string> {
  try {
    const greenScreenUri = await removeBackgroundAI({ imageDataUri: base64Data });
    const base64Content = greenScreenUri.split(',')[1] || greenScreenUri;
    const buffer = Buffer.from(base64Content, 'base64');
    const image = await Jimp.read(buffer);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const tolerance = 80; 

    image.scan(0, 0, width, height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const distance = Math.sqrt(Math.pow(r - 0, 2) + Math.pow(g - 255, 2) + Math.pow(b - 0, 2));
      if (distance < tolerance) this.bitmap.data[idx + 3] = 0; 
    });

    image.contrast(0.05);
    return await image.getBase64Async(Jimp.MIME_PNG);
  } catch (error: any) {
    throw new Error('Industrial isolation sequence failed.');
  }
}
