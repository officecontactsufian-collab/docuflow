
"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { RotateCw, Loader2, Download, Trash2, LayoutGrid, CheckCircle2, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';
import { cn } from '@/lib/utils';

export default function OrganizePage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<number[]>([]);
  const [rotations, setRotations] = React.useState<Record<number, number>>({});
  const [thumbnails, setThumbnails] = React.useState<Record<number, string>>({});
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    
    setIsProcessing(true);
    setSelectedFile(file);
    
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      
      const newPages = Array.from({ length: count }, (_, i) => i);
      setPages(newPages);
      
      // Generate individual page previews for visual organization
      const newThumbnails: Record<number, string> = {};
      for (let i = 0; i < count; i++) {
        const singlePagePdf = await PDFDocument.create();
        const [copiedPage] = await singlePagePdf.copyPages(pdf, [i]);
        singlePagePdf.addPage(copiedPage);
        const bytes = await singlePagePdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        newThumbnails[i] = URL.createObjectURL(blob);
      }
      setThumbnails(newThumbnails);
      
      toast({
        title: "Document Staged",
        description: `Visual map generated for ${count} pages.`,
      });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Load failed", description: "Could not read PDF structure." });
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
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

  const movePage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pages.length) return;
    const newPages = [...pages];
    const [movedItem] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, movedItem);
    setPages(newPages);
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      for (const originalIndex of pages) {
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [originalIndex]);
        const rotation = rotations[originalIndex] || 0;
        copiedPage.setRotation({ type: 'degrees', angle: rotation });
        newPdf.addPage(copiedPage);
      }

      const bytes = await newPdf.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      toast({ title: "Organization Complete", description: "Your changes have been applied permanently." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Failed to process document structure." });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    Object.values(thumbnails).forEach(url => URL.revokeObjectURL(url));
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setSelectedFile(null);
    setPages([]);
    setRotations({});
    setThumbnails({});
    setIsDone(false);
    setDownloadUrl(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <RotateCw className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic tracking-tighter">Visual Organizer</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Manage your document structure with a high-fidelity visual map. Rotate, reorder, and refine.
            </p>
          </div>

          {!selectedFile ? (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <FileDropzone 
                onFilesSelected={handleFileSelected} 
                maxFiles={1} 
                isLoading={isProcessing} 
              />
            </div>
          ) : !isDone ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Toolbar */}
              <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-5 rounded-[2rem] border border-accent/10 shadow-2xl sticky top-20 z-40">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-primary/10 rounded-xl"><LayoutGrid className="h-5 w-5 text-primary" /></div>
                   <div className="flex flex-col">
                      <span className="font-black text-xs uppercase italic text-accent">{pages.length} Pages Staged</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{selectedFile.name}</span>
                   </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={reset} className="text-[10px] font-black uppercase tracking-widest">Discard</Button>
                  <Button 
                    onClick={handleProcess} 
                    disabled={isProcessing}
                    className="h-12 px-8 rounded-xl bg-accent text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-accent/20"
                  >
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCw className="mr-2 h-4 w-4" />}
                    Apply Changes
                  </Button>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                {pages.map((originalIndex, visualIndex) => (
                  <div key={originalIndex} className="space-y-3 group">
                    <Card className={cn(
                      "relative overflow-hidden transition-all duration-300 rounded-[2rem] border-2 bg-white",
                      "hover:ring-4 hover:ring-primary/10 hover:border-primary/40 shadow-sm hover:shadow-2xl"
                    )}>
                      <div className="aspect-[3/4] w-full p-1 overflow-hidden">
                        {thumbnails[originalIndex] ? (
                          <iframe 
                            src={`${thumbnails[originalIndex]}#toolbar=0&navpanes=0&view=FitH`}
                            className="w-full h-full border-none pointer-events-none transition-transform duration-500"
                            style={{ transform: `rotate(${rotations[originalIndex] || 0}deg)` }}
                          />
                        ) : (
                          <div className="w-full h-full bg-muted/20 animate-pulse rounded-2xl flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        {/* Overlay to catch clicks and prevent iframe interaction */}
                        <div className="absolute inset-0 cursor-default" />
                      </div>
                      
                      {/* Controls Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-white/90 backdrop-blur-sm border-t border-accent/5 flex items-center justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-lg hover:bg-primary/10" 
                            onClick={() => movePage(visualIndex, visualIndex - 1)}
                            disabled={visualIndex === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-lg hover:bg-primary/10" 
                            onClick={() => movePage(visualIndex, visualIndex + 1)}
                            disabled={visualIndex === pages.length - 1}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-lg hover:bg-primary/10 text-primary" 
                            onClick={() => rotatePage(originalIndex)}
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-destructive" 
                            onClick={() => removePage(originalIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="absolute top-3 left-3 bg-accent text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                        {visualIndex + 1}
                      </div>
                    </Card>
                    <p className="text-[9px] text-center font-black uppercase tracking-[0.2em] text-accent/30 group-hover:text-primary transition-colors italic">
                      Structural Reference #{originalIndex + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Card className="p-12 bg-white border border-white/40 rounded-[3rem] shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Structure Updated!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Your changes have been embedded into a new industrial asset.</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `organized_${selectedFile?.name || 'document.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Organized PDF
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                Initialize New Workspace
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
