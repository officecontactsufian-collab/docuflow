'use server';

import Jimp from 'jimp';
import { PDFDocument, PDFDict, PDFName } from 'pdf-lib';
import { removeWatermarkFromImage } from '@/ai/flows/remove-watermark-image-flow';

/**
 * @fileOverview AI Watermark Removal Server Action (Localized)
 */

export async function processImageRemovalAction(base64Data: string): Promise<string> {
  try {
    // Phase 1: AI Analysis and Healing
    const result = await removeWatermarkFromImage({ imageDataUri: base64Data });
    return result.cleanedImageDataUri;
  } catch (error) {
    console.error('AI Image processing failure:', error);
    throw new Error('AI backend pixel healing sequence failed.');
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
