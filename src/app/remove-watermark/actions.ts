
'use server';

import Jimp from 'jimp';
import { PDFDocument } from 'pdf-lib';

/**
 * @fileOverview DOCFLOW Backend Removal Protocols
 * Handles high-fidelity structural and pixel-level sanitization using industrial libraries.
 */

export async function processImageRemovalAction(base64Data: string): Promise<string> {
  try {
    // Extract actual base64 content
    const base64Content = base64Data.split(',')[1] || base64Data;
    const buffer = Buffer.from(base64Content, 'base64');
    
    // Initialize Industrial Image Engine (Jimp)
    const image = await Jimp.read(buffer);
    
    // Strategy: Luminance-Based Neutralization
    // We apply a subtle contrast adjustment and brightness boost to "wash out" 
    // faint watermark overlays that are commonly applied as low-opacity grey text.
    image.contrast(0.1).brightness(0.05).quality(95);
    
    // Normalize pixels by re-encoding to a clean JPEG buffer (stripping non-merged metadata)
    const processedBase64 = await image.getBase64Async(Jimp.MIME_JPEG);
    return processedBase64;
  } catch (error) {
    console.error('Image processing failure:', error);
    throw new Error('Backend pixel normalization sequence failed.');
  }
}

export async function processPdfRemovalAction(base64Data: string): Promise<string> {
  try {
    const base64Content = base64Data.split(',')[1] || base64Data;
    const buffer = Buffer.from(base64Content, 'base64');
    
    // Load document into backend stream
    const sourcePdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    
    // Aggressive Structural Purge
    const catalog = sourcePdf.catalog;
    
    // 1. Purge OCGs (Optional Content Groups / Layers)
    // These are the most common containers for background watermarks.
    const context = (sourcePdf as any).context;
    if (catalog.has(context.obj('OCProperties'))) {
      catalog.delete(context.obj('OCProperties'));
    }

    const pages = sourcePdf.getPages();
    pages.forEach((page) => {
      const node = (page as any).node;
      
      // 2. Strip Annotation Registry (Stamps, Text overlays)
      if (node.has(context.obj('Annots'))) {
        node.delete(context.obj('Annots'));
      }

      // 3. Neutralize Transparency Groups and Artifacts
      if (node.has(context.obj('Group'))) {
        node.delete(context.obj('Group'));
      }
      
      // 4. Look for PieceInfo which sometimes stores metadata about overlays
      if (node.has(context.obj('PieceInfo'))) {
        node.delete(context.obj('PieceInfo'));
      }
    });
    
    sourcePdf.setProducer("DOCFLOW Backend Sanitization (Deep Purge)");
    sourcePdf.setCreator("DOCFLOW Professional");
    
    const pdfBytes = await sourcePdf.save();
    return `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
  } catch (error) {
    console.error('PDF processing failure:', error);
    throw new Error('Backend structural purge sequence failed.');
  }
}
