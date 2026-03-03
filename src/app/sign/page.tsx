"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Signature, Download, Loader2, CheckCircle2, UserCheck, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';

export default function SignPage() {
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  const [signatureImage, setSignatureImage] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!pdfFile || !signatureImage) return;
    setIsProcessing(true);

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const sigBytes = await signatureImage.arrayBuffer();
      
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const sigImg = signatureImage.type === 'image/png' 
        ? await pdfDoc.embedPng(sigBytes) 
        : await pdfDoc.embedJpg(sigBytes);

      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width, height } = lastPage.getSize();

      // Default positioning: Bottom right
      const sigWidth = 150;
      const sigHeight = (sigImg.height / sigImg.width) * sigWidth;
      
      lastPage.drawImage(sigImg, {
        x: width - sigWidth - 50,
        y: 50,
        width: sigWidth,
        height: sigHeight,
      });

      const finalBytes = await pdfDoc.save();
      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      toast({
        title: "Document Signed",
        description: "Your electronic signature has been applied to the final page.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Signing Failed",
        description: "Ensure you are using standard PDF and image (PNG/JPG) formats.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Signature className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Digital Signature</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Securely apply your electronic signature to any PDF document.
            </p>
          </div>

          {!isDone ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2"><FileText className="h-4 w-4" /> Step 1: Upload PDF</h3>
                <FileDropzone 
                  onFilesSelected={(f) => setPdfFile(f[0] || null)} 
                  maxFiles={1} 
                  className="p-8"
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Step 2: Signature Image</h3>
                <FileDropzone 
                  onFilesSelected={(f) => setSignatureImage(f[0] || null)} 
                  maxFiles={1} 
                  accept=".png,.jpg,.jpeg"
                  className="p-8"
                />
              </div>
              
              {pdfFile && signatureImage && (
                <div className="md:col-span-2 flex justify-center pt-8">
                  <Button size="lg" onClick={handleProcess} disabled={isProcessing} className="min-w-[300px]">
                    {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                    Place Signature & Finalize
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center animate-in zoom-in">
              <Card className="p-12 border-2 border-primary/10 shadow-2xl">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold font-headline mb-4">Signed & Ready!</h2>
                <Button size="lg" onClick={() => {
                  if (downloadUrl) {
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `signed_${pdfFile?.name || 'document.pdf'}`;
                    document.body.appendChild(link);
                    link.click();
                  }
                }} className="w-full bg-accent hover:bg-accent/90">
                  Download Signed PDF
                </Button>
              </Card>
              <Button variant="ghost" className="mt-6" onClick={() => {setIsDone(false); setPdfFile(null); setSignatureImage(null);}}>
                Sign another document
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import { FileText } from 'lucide-react';
