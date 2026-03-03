"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { RotateCw, Loader2, Download, Trash2, ArrowUpDown, LayoutGrid } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';

export default function OrganizePage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<number[]>([]);
  const [rotations, setRotations] = React.useState<Record<number, number>>({});
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    
    setSelectedFile(file);
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const count = pdf.getPageCount();
      setPages(Array.from({ length: count }, (_, i) => i));
    } catch (e) {
      toast({ variant: "destructive", title: "Load failed", description: "Could not read PDF structure." });
    }
  };

  const rotatePage = (index: number) => {
    setRotations(prev => ({
      ...prev,
      [index]: ((prev[index] || 0) + 90) % 360
    }));
  };

  const removePage = (index: number) => {
    setPages(prev => prev.filter(p => p !== index));
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();

      for (const index of pages) {
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [index]);
        const rotation = rotations[index] || 0;
        copiedPage.setRotation({ type: 'degrees', angle: rotation });
        newPdf.addPage(copiedPage);
      }

      const bytes = await newPdf.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      toast({ title: "Organization Complete", description: "Your changes have been applied." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to process document." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `organized_${selectedFile?.name || 'document.pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <RotateCw className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Organize PDF Pages</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Visual page management. Delete, rotate, and reorder pages with professional precision.
            </p>
          </div>

          {!selectedFile ? (
            <FileDropzone onFilesSelected={handleFileSelected} maxFiles={1} />
          ) : !isDone ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border shadow-sm sticky top-20 z-40">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-primary/10 rounded-lg"><LayoutGrid className="h-5 w-5 text-primary" /></div>
                   <span className="font-bold">{pages.length} Pages Selected</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedFile(null)}>Reset</Button>
                  <Button onClick={handleProcess} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCw className="mr-2 h-4 w-4" />}
                    Apply Changes
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {pages.map((originalIndex, visualIndex) => (
                  <Card key={originalIndex} className="group relative overflow-hidden hover:ring-2 hover:ring-primary transition-all">
                    <CardContent className="p-4 flex flex-col items-center gap-4">
                      <div 
                        className="aspect-[3/4] w-full bg-muted/50 rounded flex items-center justify-center text-muted-foreground text-xs transition-transform"
                        style={{ transform: `rotate(${rotations[originalIndex] || 0}deg)` }}
                      >
                        <span className="font-bold text-2xl">Page {originalIndex + 1}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => rotatePage(originalIndex)}>
                          <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removePage(originalIndex)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                    <div className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      #{visualIndex + 1}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <Card className="border-2 border-primary/10 shadow-2xl p-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Download className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold font-headline mb-4">Structure Updated!</h2>
                <Button size="lg" onClick={handleDownload} className="w-full h-12 shadow-lg bg-accent hover:bg-accent/90">
                  Download Organized PDF
                </Button>
              </Card>
              <Button variant="ghost" onClick={() => {setIsDone(false); setSelectedFile(null);}}>
                Start another operation
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
