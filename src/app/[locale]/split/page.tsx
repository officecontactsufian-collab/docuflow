
"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Scissors, Loader2, Download, Layers, AlertCircle, CheckSquare, Square, CheckCircle2, LayoutGrid } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n-context';

export default function SplitPage() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [totalPages, setTotalPages] = React.useState(0);
  const [selectedPageIndices, setSelectedPageIndices] = React.useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [splitRange, setSplitRange] = React.useState("");
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelected = async (files: File[]) => {
    const file = files[0] || null;
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const count = sourcePdf.getPageCount();
      
      setTotalPages(count);
      setSelectedFile(file);
      setIsDone(false);
      setSelectedPageIndices(new Set([0]));
      setSplitRange("1");
    } catch (e) {
      toast({ variant: "destructive", title: "Invalid PDF", description: "Could not read the document structure." });
    }
  };

  const togglePage = (index: number) => {
    const next = new Set(selectedPageIndices);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelectedPageIndices(next);
    updateRangeString(next);
  };

  const selectAll = () => {
    const all = new Set(Array.from({ length: totalPages }, (_, i) => i));
    setSelectedPageIndices(all);
    updateRangeString(all);
  };

  const clearSelection = () => {
    const none = new Set<number>();
    setSelectedPageIndices(none);
    setSplitRange("");
  };

  const updateRangeString = (indices: Set<number>) => {
    const sorted = Array.from(indices).sort((a, b) => a - b);
    if (sorted.length === 0) {
      setSplitRange("");
      return;
    }
    
    const ranges: string[] = [];
    let start = sorted[0];
    let end = start;

    for (let i = 1; i <= sorted.length; i++) {
      if (i < sorted.length && sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push(start === end ? `${start + 1}` : `${start + 1}-${end + 1}`);
        if (i < sorted.length) {
          start = sorted[i];
          end = start;
        }
      }
    }
    setSplitRange(ranges.join(', '));
  };

  const handleSplit = async () => {
    if (!selectedFile || selectedPageIndices.size === 0) {
      toast({ variant: "destructive", title: "Selection Required", description: "Please select at least one page to extract." });
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      const newPdf = await PDFDocument.create();
      const pageIndicesToExtract = Array.from(selectedPageIndices).sort((a, b) => a - b);
      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndicesToExtract);
      copiedPages.forEach(page => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setIsProcessing(false);
      setIsDone(true);
      toast({
        title: t('common.success'),
        description: `Extracted ${pageIndicesToExtract.length} pages into a new document.`,
      });
    } catch (error: any) {
      console.error("Split error:", error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: t('common.failure'),
        description: error.message || "An error occurred during extraction.",
      });
    }
  };

  const reset = () => {
    setIsDone(false);
    setSelectedFile(null);
    setSelectedPageIndices(new Set());
    setTotalPages(0);
    setSplitRange("");
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center text-primary mb-2">
              <Scissors className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic tracking-tighter">{t('tools.split.title')}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('tools.split.desc')}
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
              {!selectedFile ? (
                <FileDropzone 
                  onFilesSelected={handleFileSelected} 
                  maxFiles={1} 
                  isLoading={isProcessing} 
                />
              ) : (
                <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60 flex items-center gap-2">
                        <LayoutGrid className="h-3 w-3" />
                        Visual Page Map ({totalPages} Pages)
                      </h3>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={selectAll} className="text-[9px] font-black uppercase tracking-widest hover:text-primary">
                          Select All
                        </Button>
                        <Button variant="ghost" size="sm" onClick={clearSelection} className="text-[9px] font-black uppercase tracking-widest hover:text-destructive">
                          Deselect All
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 p-6 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-white/40 max-h-[600px] overflow-y-auto custom-scrollbar">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <div 
                          key={i}
                          onClick={() => togglePage(i)}
                          className={cn(
                            "relative aspect-[3/4] cursor-pointer rounded-xl border-2 transition-all group flex flex-col items-center justify-center",
                            selectedPageIndices.has(i) 
                              ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                              : "border-transparent bg-white hover:border-primary/20 hover:scale-105"
                          )}
                        >
                          {selectedPageIndices.has(i) ? (
                            <CheckSquare className="h-6 w-6 text-primary mb-2" />
                          ) : (
                            <Square className="h-6 w-6 text-accent/10 mb-2 group-hover:text-primary/20" />
                          )}
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            selectedPageIndices.has(i) ? "text-primary" : "text-accent/40"
                          )}>
                            Page {i + 1}
                          </span>
                          {selectedPageIndices.has(i) && (
                            <div className="absolute -top-2 -right-2 bg-primary text-white text-[8px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-lg">
                              {Array.from(selectedPageIndices).sort((a,b) => a-b).indexOf(i) + 1}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <PDFPreview file={selectedFile} title="Source Document Reference" />
                  </div>
                  
                  <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white/80 backdrop-blur-sm sticky top-24">
                      <CardHeader className="pt-8 px-8">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3 text-accent">
                          <Layers className="h-5 w-5 text-primary" />
                          Extraction Logic
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 p-8">
                        <div className="space-y-3">
                          <Label htmlFor="range" className="text-[10px] font-black uppercase tracking-widest text-accent/60">Selected Scope</Label>
                          <Input 
                            id="range" 
                            readOnly
                            placeholder="Select pages from the map..." 
                            value={splitRange}
                            className="h-12 rounded-xl bg-muted/20 border-accent/10 font-bold text-accent"
                          />
                          <div className="flex items-start gap-2 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                              Select pages visually on the left map. The engine will extract and compile them in numerical order into a new professional asset.
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            size="lg"
                            onClick={handleSplit}
                            disabled={isProcessing || selectedPageIndices.size === 0}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scissors className="mr-2 h-4 w-4" />}
                            Extract {selectedPageIndices.size} Pages
                          </Button>
                          <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            {t('common.discard')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="p-12 bg-white border border-white/40 rounded-[3rem] shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Segment Deployed!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Successfully extracted {selectedPageIndices.size} pages into a unified asset.</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `extracted_${selectedFile?.name || 'document.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  {t('common.download')}
                </Button>
              </div>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/60">
                Process another file
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
