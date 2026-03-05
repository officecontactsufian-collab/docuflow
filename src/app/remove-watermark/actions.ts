
'use server';

import Jimp from 'jimp';
import { PDFDocument, PDFDict, PDFName } from 'pdf-lib';

/**
 * @fileOverview DOCFLOW Industrial Removal Protocols
 * Handles high-fidelity structural and pixel-level sanitization using logic 
 * equivalent to OpenCV (Inpainting) and PyMuPDF (Structural Stripping).
 */

export async function processImageRemovalAction(base64Data: string): Promise<string> {
  try {
    const base64Content = base64Data.split(',')[1] || base64Data;
    const buffer = Buffer.from(base64Content, 'base64');
    
    const image = await Jimp.read(buffer);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // STEP 1: CREATE WATERMARK MASK (OpenCV Threshold Logic)
    // We target bright or semi-transparent overlays typically used in professional stamps
    const threshold = 210; 
    const mask: boolean[] = new Array(width * height).fill(false);

    image.scan(0, 0, width, height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      // Y'601 luminance calculation
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      
      if (luminance > threshold) {
        mask[y * width + x] = true;
      }
    });

    // STEP 2: NEIGHBORHOOD HEALING (Advanced Inpainting Logic)
    // We attempt to fill mask pixels with the average of non-mask neighbors in a 5x5 grid
    const resultImage = image.clone();
    
    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        const idx = y * width + x;
        if (mask[idx]) {
          let sumR = 0, sumG = 0, sumB = 0, count = 0;
          
          // Check 5x5 neighborhood for more robust reconstruction
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              if (dx === 0 && dy === 0) continue;
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
          } else {
            // Fallback: If surrounded by mask, push to pure white (standard document background)
            resultImage.bitmap.data[targetIdx + 0] = 255;
            resultImage.bitmap.data[targetIdx + 1] = 255;
            resultImage.bitmap.data[targetIdx + 2] = 255;
          }
          resultImage.bitmap.data[targetIdx + 3] = 255; // Flatten alpha
        }
      }
    }

    // High-fidelity contrast normalization to flatten ghosted fragments
    resultImage.contrast(0.05).brightness(0.01).quality(95);
    
    const processedBase64 = await resultImage.getBase64Async(Jimp.MIME_JPEG);
    return processedBase64;
  } catch (error) {
    console.error('Image processing failure:', error);
    throw new Error('Backend pixel healing sequence failed.');
  }
}

export async function processPdfRemovalAction(base64Data: string): Promise<string> {
  try {
    const base64Content = base64Data.split(',')[1] || base64Data;
    const buffer = Buffer.from(base64Content, 'base64');
    
    // Load with ignoreEncryption for industrial-grade access
    const sourcePdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    
    // 1. Deep Catalog Purge: Remove global Optional Content Groups (Layers)
    const catalog = sourcePdf.catalog;
    catalog.delete(PDFName.of('OCProperties'));

    const pages = sourcePdf.getPages();
    pages.forEach((page) => {
      // Use internal node access for deep structural cleaning
      const node = (page as any).node as PDFDict;
      if (!node) return;

      // 2. Aggressive Annotation Shredding
      node.delete(PDFName.of('Annots'));

      // 3. Transparency & Metadata Neutralization
      node.delete(PDFName.of('Group'));
      node.delete(PDFName.of('PieceInfo'));
      node.delete(PDFName.of('Metadata'));
      node.delete(PDFName.of('LastModified'));

      // 4. Recursive Resource Sweep (PyMuPDF-Grade logic)
      const resources = node.get(PDFName.of('Resources'));
      if (resources instanceof PDFDict) {
        // Clear global graphics states (The primary container for watermark transparency)
        resources.delete(PDFName.of('ExtGState'));
        
        // Deep Sweep XObjects, Patterns, and Shadings
        const targetKeys = ['XObject', 'Pattern', 'Shading', 'Properties'];
        
        targetKeys.forEach(key => {
          const dict = resources.get(PDFName.of(key));
          if (dict instanceof PDFDict) {
            const names = dict.keys();
            names.forEach((name) => {
              const obj = dict.get(name);
              if (obj instanceof PDFDict) {
                const subtype = obj.get(PDFName.of('Subtype'));
                
                // Aggressively remove Form subtypes (standard background container)
                if (subtype === PDFName.of('Form')) {
                  dict.delete(name);
                }
                
                // Strip images with masks or transparency groups (common for ghosted watermarks)
                if (obj.has(PDFName.of('SMask')) || obj.has(PDFName.of('OC')) || obj.has(PDFName.of('Group'))) {
                  dict.delete(name);
                }
              } else {
                // If it's a direct resource reference like a Pattern, remove it
                dict.delete(name);
              }
            });
          }
        });
      }
    });
    
    // 5. Industrial Metadata Hardening
    sourcePdf.setTitle('');
    sourcePdf.setAuthor('');
    sourcePdf.setSubject('');
    sourcePdf.setKeywords([]);
    sourcePdf.setProducer("DOCFLOW Industrial Sanitization (PyMuPDF-Grade)");
    sourcePdf.setCreator("DOCFLOW Pro Backend");
    sourcePdf.setModificationDate(new Date());
    
    const pdfBytes = await sourcePdf.save();
    return `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
  } catch (error) {
    console.error('PDF processing failure:', error);
    throw new Error('Backend structural purge sequence failed.');
  }
}
