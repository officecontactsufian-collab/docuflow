"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Scissors, Loader2, Download, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PDFDocument } from 'pdf-lib';

export default function SplitPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [splitRange, setSplitRange] = React.useState("1");
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const parseRange = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',').map(p => p.trim());
    
    parts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(end, maxPages); i++) {
            pages.add(i - 1); // 0-indexed for pdf-lib
          }
        }
      } else {
        const page = Number(part);
        if (!isNaN(page) && page >= 1 && page <= maxPages) {
          pages.add(page - 1);
        }
      }
    });
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const totalPages = sourcePdf.getPageCount();
      
      const pageIndicesToExtract = parseRange(splitRange, totalPages);
      
      if (pageIndicesToExtract.length === 0) {
        throw new Error("Invalid page range specified.");
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndicesToExtract);
      copiedPages.forEach(page => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setIsProcessing(false);
      setIsDone(true);
      toast({
        title: "PDF split successfully",
        description: `${pageIndicesToExtract.length} pages extracted and ready for download.`,
      });
    } catch (error: any) {
      console.error(error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Split failed",
        description: error.message || "An error occurred while splitting the PDF.",
      });
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `split_${selectedFile?.name || 'document.pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reset = () => {
    setIsDone(false);
    setSelectedFile(null);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Scissors className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Split PDF Document</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Extract specific pages or ranges from your PDF. All processing happens securely in your browser.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95">
              <FileDropzone 
                onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                maxFiles={1} 
                isLoading={isProcessing} 
              />
              
              {selectedFile && (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Layers className="h-5 w-5 text-primary" />
                          Split Options
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="range">Page Range</Label>
                          <Input 
                            id="range" 
                            placeholder="e.g. 1-3, 5, 8-10" 
                            value={splitRange}
                            onChange={(e) => setSplitRange(e.target.value)}
                          />
                          <p className="text-[10px] text-muted-foreground">Use commas for multiple pages, or hyphens for ranges.</p>
                        </div>
                        <Button 
                          onClick={handleSplit}
                          disabled={isProcessing}
                          className="w-full shadow-md"
                        >
                          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scissors className="mr-2 h-4 w-4" />}
                          Extract Pages
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="md:col-span-2">
                    <div className="border rounded-2xl bg-muted/30 aspect-[4/3] flex flex-col items-center justify-center text-muted-foreground p-8">
                      <div className="text-center space-y-4">
                        <div className="p-4 bg-white rounded-xl shadow-sm inline-block">
                           <FileDropzone className="hidden" onFilesSelected={() => {}} />
                           <p className="text-sm font-bold text-foreground">{selectedFile.name}</p>
                           <p className="text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <p className="text-sm">Enter the page numbers you want to keep. The result will be a new PDF containing only those pages.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <div className="p-8 bg-white border rounded-2xl shadow-xl space-y-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Download className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-headline">Pages extracted!</h2>
                  <p className="text-muted-foreground mt-2">New document is ready with selected range: {splitRange}</p>
                </div>
                <Button size="lg" onClick={handleDownload} className="w-full bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
                  Download Extracted PDF
                </Button>
              </div>
              <Button variant="ghost" onClick={reset}>
                Split another file
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
