"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Signature, Download, Loader2, CheckCircle2, UserCheck, ImageIcon, FileText } from 'lucide-react';
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
    if (!pdfFile || !signatureImage) {
      toast({
        variant: "destructive",
        title: "Incomplete details",
        description: "Please upload both a PDF and a signature image.",
      });
      return;
    }
    
    setIsProcessing(true);

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const sigBytes = await signatureImage.arrayBuffer();
      
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      
      let sigImg;
      if (signatureImage.type === 'image/png') {
        sigImg = await pdfDoc.embedPng(sigBytes);
      } else if (signatureImage.type === 'image/jpeg' || signatureImage.type === 'image/jpg') {
        sigImg = await pdfDoc.embedJpg(sigBytes);
      } else {
        throw new Error("Unsupported signature format. Use PNG or JPG.");
      }

      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width } = lastPage.getSize();

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
    } catch (error: any) {
      console.error("Signing error:", error);
      toast({
        variant: "destructive",
        title: "Signing Failed",
        description: error.message || "Ensure you are using standard PDF and image (PNG/JPG) formats.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setPdfFile(null);
    setSignatureImage(null);
    setIsDone(false);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center text-primary mb-2">
              <Signature className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic tracking-tighter">Digital Signature</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Securely apply your electronic signature image to any PDF document.
            </p>
          </div>

          {!isDone ? (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-accent uppercase text-xs tracking-widest">
                  <FileText className="h-4 w-4 text-primary" /> 
                  Step 1: Upload PDF
                </h3>
                <FileDropzone 
                  onFilesSelected={(f) => setPdfFile(f[0] || null)} 
                  maxFiles={1} 
                  className="p-8"
                />
                {pdfFile && <p className="text-[10px] font-bold text-primary uppercase text-center">{pdfFile.name}</p>}
              </div>
              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-accent uppercase text-xs tracking-widest">
                  <ImageIcon className="h-4 w-4 text-primary" /> 
                  Step 2: Signature Image
                </h3>
                <FileDropzone 
                  onFilesSelected={(f) => setSignatureImage(f[0] || null)} 
                  maxFiles={1} 
                  accept=".png,.jpg,.jpeg"
                  className="p-8"
                />
                {signatureImage && <p className="text-[10px] font-bold text-primary uppercase text-center">{signatureImage.name}</p>}
              </div>
              
              <div className="md:col-span-2 flex justify-center pt-8">
                <Button 
                  size="lg" 
                  onClick={handleProcess} 
                  disabled={isProcessing || !pdfFile || !signatureImage} 
                  className="min-w-[300px] h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl"
                >
                  {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                  Place Signature & Finalize
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center animate-in zoom-in">
              <Card className="p-12 border-2 border-primary/10 shadow-2xl rounded-[3rem]">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-accent mb-4">Signed & Ready!</h2>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `signed_${pdfFile?.name || 'document.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Signed PDF
                </Button>
              </Card>
              <Button variant="ghost" className="mt-6 text-[10px] font-bold uppercase tracking-widest" onClick={reset}>
                Sign another document
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}