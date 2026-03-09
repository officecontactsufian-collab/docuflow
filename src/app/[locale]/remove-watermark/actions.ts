'use server';

import Jimp from 'jimp';
import { PDFDocument, PDFDict, PDFName } from 'pdf-lib';

export async function processImageRemovalAction(base64Data: string): Promise<string> {
  try {
    const buffer = Buffer.from(base64Data.split(',')[1] || base64Data, 'base64');
    const image = await Jimp.read(buffer);
    const threshold = 210; 
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const luminance = 0.299 * this.bitmap.data[idx] + 0.587 * this.bitmap.data[idx+1] + 0.114 * this.bitmap.data[idx+2];
      if (luminance > threshold) {
        this.bitmap.data[idx] = 255; this.bitmap.data[idx+1] = 255; this.bitmap.data[idx+2] = 255;
      }
    });
    return await image.getBase64Async(Jimp.MIME_JPEG);
  } catch (error) { throw new Error('Healing failed.'); }
}

export async function processPdfRemovalAction(base64Data: string): Promise<string> {
  try {
    const buffer = Buffer.from(base64Data.split(',')[1] || base64Data, 'base64');
    const sourcePdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    sourcePdf.getPages().forEach((page) => {
      const node = (page as any).node as PDFDict;
      node.delete(PDFName.of('Annots'));
      node.delete(PDFName.of('Metadata'));
    });
    const pdfBytes = await sourcePdf.save();
    return `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
  } catch (error) { throw new Error('Purge failed.'); }
}
