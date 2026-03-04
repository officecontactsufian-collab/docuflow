"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Scissors, Loader2, Download, Layers, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';

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
            pages.add(i - 1);
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
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center text-primary mb-2">
              <Scissors className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Split PDF Document</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Extract specific pages or ranges from your PDF securely in your browser.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95">
              {!selectedFile ? (
                <FileDropzone 
                  onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                  maxFiles={1} 
                  isLoading={isProcessing} 
                />
              ) : (
                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <PDFPreview file={selectedFile} title="Source Document" />
                  </div>
                  
                  <div className="space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2rem] bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pt-8 px-8">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3">
                          <Layers className="h-5 w-5 text-primary" />
                          Split Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 p-8">
                        <div className="space-y-3">
                          <Label htmlFor="range" className="text-[10px] font-black uppercase tracking-widest text-accent/60">Selected Page Range</Label>
                          <Input 
                            id="range" 
                            placeholder="e.g. 1-3, 5, 8-10" 
                            value={splitRange}
                            onChange={(e) => setSplitRange(e.target.value)}
                            className="h-12 rounded-xl bg-muted/20 border-accent/10 focus:ring-primary"
                          />
                          <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                            <AlertCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                            <p className="text-[10px] leading-relaxed text-muted-foreground">
                              Specify individual pages separated by commas, or ranges using hyphens. All selected pages will be combined into a new file.
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            size="lg"
                            onClick={handleSplit}
                            disabled={isProcessing}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scissors className="mr-2 h-4 w-4" />}
                            Execute Split
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest">
                            Change File
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <div className="p-12 bg-white border border-white/40 rounded-[3rem] shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <Download className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight">Pages Extracted!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Your new PDF is ready with range: {splitRange}</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = downloadUrl!;
                    link.download = `split_${selectedFile?.name || 'document.pdf'}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  Download Result
                </Button>
              </div>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest">
                Split another file
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
