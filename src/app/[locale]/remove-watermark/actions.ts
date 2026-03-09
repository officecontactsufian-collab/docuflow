'use server';

import Jimp from 'jimp';
import { PDFDocument, PDFDict, PDFName } from 'pdf-lib';

/**
 * @fileOverview AI Watermark Removal Server Action (Localized)
 */

export async function processImageRemovalAction(base64Data: string): Promise<string> {
  try {
    const base64Content = base64Data.split(',')[1] || base64Data;
    const buffer = Buffer.from(base64Content, 'base64');
    const image = await Jimp.read(buffer);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    const threshold = 210; 
    const mask: boolean[] = new Array(width * height).fill(false);

    image.scan(0, 0, width, height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      if (luminance > threshold) mask[y * width + x] = true;
    });

    const resultImage = image.clone();
    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        const idx = y * width + x;
        if (mask[idx]) {
          let sumR = 0, sumG = 0, sumB = 0, count = 0;
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const nIdx = (y + dy) * width + (x + dx);
              if (!mask[nIdx]) {
                const pixelIdx = nIdx * 4;
                sumR += image.bitmap.data[pixelIdx + 0];
                sumG += image.bitmap.data[pixelIdx + 1];
                sumB += image.bitmap.data[pixelIdx + 2];
                count++;
              }
            }
          }
          const targetIdx = idx * 4;
          if (count > 0) {
            resultImage.bitmap.data[targetIdx + 0] = sumR / count;
            resultImage.bitmap.data[targetIdx + 1] = sumG / count;
            resultImage.bitmap.data[targetIdx + 2] = sumB / count;
          }
        }
      }
    }

    resultImage.contrast(0.05);
    return await resultImage.getBase64Async(Jimp.MIME_JPEG);
  } catch (error) {
    throw new Error('Backend pixel healing failed.');
  }
}

export async function processPdfRemovalAction(base64Data: string): Promise<string> {
  try {
    const base64Content = base64Data.split(',')[1] || base64Data;
    const buffer = Buffer.from(base64Content, 'base64');
    const sourcePdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    
    sourcePdf.getPages().forEach((page) => {
      const node = (page as any).node as PDFDict;
      node.delete(PDFName.of('Annots'));
      node.delete(PDFName.of('Metadata'));
    });
    
    sourcePdf.setProducer("DOCFLOW Industrial Sanitization");
    const pdfBytes = await sourcePdf.save();
    return `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
  } catch (error) {
    throw new Error('Backend structural purge failed.');
  }
}
