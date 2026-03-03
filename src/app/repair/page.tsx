"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Wrench, Loader2, Download, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';

export default function RepairPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleRepair = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      // Load with ignoreEncryption to handle structural issues in protected files
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Re-saving forces a full structural rebuild and re-indexing of objects
      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      toast({ title: "Repair Complete", description: "Document structure has been rebuilt successfully." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Repair Failed", description: "This file is too corrupted for automated repair." });
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
              <Wrench className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Repair & Rebuild</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Fix broken file structures, re-index PDF objects, and restore cross-reference tables for improved compatibility.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8">
              <FileDropzone onFilesSelected={(files) => setSelectedFile(files[0] || null)} maxFiles={1} isLoading={isProcessing} />
              {selectedFile && !isProcessing && (
                <div className="max-w-lg mx-auto">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary" />
                        Structural Recovery
                      </CardTitle>
                      <CardDescription>
                        DocuFlow will attempt to reconstruct the internal object tree and cross-reference table.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={handleRepair} className="w-full h-12">
                        Initiate Repair Sequence
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
              {isProcessing && (
                <div className="flex flex-col items-center py-12 gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="font-semibold">Reconstructing object tree...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in zoom-in">
              <Card className="p-12 border-2 border-green-500/20 shadow-2xl">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold font-headline mb-4">File Recovered</h2>
                <Button size="lg" onClick={() => {
                  if (downloadUrl) {
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `repaired_${selectedFile?.name || 'document.pdf'}`;
                    document.body.appendChild(link);
                    link.click();
                  }
                }} className="w-full bg-accent hover:bg-accent/90">
                  Download Repaired PDF
                </Button>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
