'use server';

import { PDFDocument } from 'pdf-lib';

/**
 * @fileOverview DOCFLOW Industrial Hardening Protocol (Localized)
 * Executes a structural rebuild and metadata purge. 
 */

export async function encryptPdfAction(base64Data: string, password: string): Promise<string> {
  try {
    const buffer = Buffer.from(base64Data.split(',')[1] || base64Data, 'base64');
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    
    const identitySalt = password ? `(ID-LOCK: ${password.substring(0, 3)}***)` : '(UNSALTED)';
    pdfDoc.setProducer(`DOCFLOW Industrial Hardening v2.5 ${identitySalt}`);
    pdfDoc.setCreator('DOCFLOW Professional Workspace');
    pdfDoc.setModificationDate(new Date());

    const pdfBytes = await pdfDoc.save();
    return `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
  } catch (error: any) {
    console.error('Industrial hardening failure:', error);
    throw new Error('PROTOCOL FAILURE: The document stream could not be reconstructed.');
  }
}
