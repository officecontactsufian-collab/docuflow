"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Hash, Loader2, Download, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default function NumbersPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleApply = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pageCount = pages.length;

      pages.forEach((page, i) => {
        const { width } = page.getSize();
        const text = `Page ${i + 1} of ${pageCount}`;
        const fontSize = 10;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: 20,
          size: fontSize,
          font: font,
          color: rgb(0.4, 0.4, 0.4),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      toast({ title: "Success", description: "Page numbers added to footer." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Failed to add page numbers." });
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
              <Hash className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Page Numbers</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Automatically add page counters to your documents for better organization.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8">
              <FileDropzone onFilesSelected={(files) => setSelectedFile(files[0] || null)} maxFiles={1} isLoading={isProcessing} />
              {selectedFile && !isProcessing && (
                <div className="flex justify-center">
                  <Button size="lg" onClick={handleApply} className="min-w-[240px]">
                    Add Page Numbers
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center">
              <Card className="p-12 border-2 border-primary/10 shadow-2xl">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold font-headline mb-4">Numbers Added!</h2>
                <Button size="lg" onClick={() => {
                  if (downloadUrl) {
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `numbered_${selectedFile?.name || 'document.pdf'}`;
                    document.body.appendChild(link);
                    link.click();
                  }
                }} className="w-full bg-accent hover:bg-accent/90">
                  Download PDF
                </Button>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
