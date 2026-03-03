"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Eraser, Loader2, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';

export default function SanitizePage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleSanitize = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Clear all metadata
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      toast({ title: "Document Sanitized", description: "All hidden metadata has been stripped." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Could not sanitize document." });
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
              <Eraser className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Sanitize PDF</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Remove hidden metadata, author information, and tracking tags for maximum privacy.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8">
              <FileDropzone onFilesSelected={(files) => setSelectedFile(files[0] || null)} maxFiles={1} isLoading={isProcessing} />
              {selectedFile && !isProcessing && (
                <div className="max-w-lg mx-auto">
                  <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                        <ShieldCheck className="h-5 w-5" />
                        Privacy Action
                      </CardTitle>
                      <CardDescription>
                        This will permanently remove the Author, Producer, and Keywords from the file structure.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="destructive" onClick={handleSanitize} className="w-full">
                        Strip Metadata & Sanitize
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in zoom-in">
              <Card className="p-12 border-2 border-green-500/20 shadow-2xl">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold font-headline mb-4">Document Sanitized</h2>
                <Button size="lg" onClick={() => {
                  if (downloadUrl) {
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `sanitized_${selectedFile?.name || 'document.pdf'}`;
                    document.body.appendChild(link);
                    link.click();
                  }
                }} className="w-full bg-accent hover:bg-accent/90">
                  Download Private PDF
                </Button>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
