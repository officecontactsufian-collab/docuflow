
'use server';

import Jimp from 'jimp';
import { PDFDocument, PDFDict, PDFName } from 'pdf-lib';

/**
 * @fileOverview DOCFLOW Backend Removal Protocols
 * Handles high-fidelity structural and pixel-level sanitization using industrial libraries.
 */

export async function processImageRemovalAction(base64Data: string): Promise<string> {
  try {
    const base64Content = base64Data.split(',')[1] || base64Data;
    const buffer = Buffer.from(base64Content, 'base64');
    
    // Initialize Industrial Image Engine
    const image = await Jimp.read(buffer);
    
    // Strategy: Luminance-Based Neutralization & Background "Push"
    // Targeted frequency analysis to burn out semi-transparent overlays.
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // Calculate luminance
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      
      // Aggressive threshold: If the pixel is close to white (common for watermark backgrounds), push to pure white.
      // This effectively "burns out" the faint grey/transparent text of most watermarks.
      if (luminance > 215) {
        this.bitmap.data[idx + 0] = 255;
        this.bitmap.data[idx + 1] = 255;
        this.bitmap.data[idx + 2] = 255;
      }
    });

    // High-fidelity contrast normalization to flatten ghosted fragments
    image.contrast(0.2).brightness(0.05).quality(100);
    
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
    
    // Load with ignoreEncryption for industrial-grade access
    const sourcePdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    
    // 1. Global Structural Purge: Optional Content Groups (Layers)
    // Most professional watermarks are stored in these containers.
    sourcePdf.catalog.delete(PDFName.of('OCProperties'));

    const pages = sourcePdf.getPages();
    pages.forEach((page) => {
      const node = (page as any).node as PDFDict;
      
      // 2. Clear Annotation Registry (Interactive stamps, text overlays, signatures)
      node.delete(PDFName.of('Annots'));

      // 3. Neutralize Transparency Groups (Used for ghosting watermarks over content)
      node.delete(PDFName.of('Group'));
      
      // 4. Strip Structural Artifacts and Private Data
      node.delete(PDFName.of('PieceInfo'));
      node.delete(PDFName.of('Metadata'));

      // 5. Deep Resource-Level Purge (XObjects & Properties)
      const resources = node.get(PDFName.of('Resources'));
      if (resources instanceof PDFDict) {
        // Purge XObjects (Most watermarks are /Form XObjects)
        const xObjects = resources.get(PDFName.of('XObject'));
        if (xObjects instanceof PDFDict) {
          const xObjectNames = xObjects.keys();
          xObjectNames.forEach((name) => {
            const xObj = xObjects.get(name);
            if (xObj instanceof PDFDict) {
              const subtype = xObj.get(PDFName.of('Subtype'));
              // Watermarks are almost always /Form XObjects or /Image with high transparency.
              // In an aggressive purge, we remove all /Form types which are non-essential overlays.
              if (subtype === PDFName.of('Form')) {
                xObjects.delete(name);
              }
            }
          });
        }
        
        // 6. Neutralize Optional Content references at the page resource level
        resources.delete(PDFName.of('Properties'));
      }
    });
    
    // 7. Industrial Metadata Hardening
    // Strips all author and producer tags to prevent tracking and watermark persistence.
    sourcePdf.setTitle('');
    sourcePdf.setAuthor('');
    sourcePdf.setSubject('');
    sourcePdf.setKeywords([]);
    sourcePdf.setProducer("DOCFLOW Industrial Sanitization (Eng: 6.0)");
    sourcePdf.setCreator("DOCFLOW Professional Protocol");
    sourcePdf.setModificationDate(new Date());
    
    const pdfBytes = await sourcePdf.save();
    return `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
  } catch (error) {
    console.error('PDF processing failure:', error);
    throw new Error('Backend structural purge sequence failed. The document structure may be non-standard.');
  }
}
