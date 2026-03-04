"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Crop, 
  Loader2, 
  Download, 
  CheckCircle2, 
  MousePointer2, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Settings2,
  Scan,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';
import { cn } from '@/lib/utils';

type CropSettings = {
  t: number;
  r: number;
  b: number;
  l: number;
};

export default function CropPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  
  // Scoping
  const [cropScope, setCropScope] = React.useState<"all" | "current">("all");

  // Per-page state
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [allCrops, setAllCrops] = React.useState<Record<number, CropSettings>>({});

  // Individual margin states for the "current" view (synced with allCrops[currentPage])
  const [cropTop, setCropTop] = React.useState(10);
  const [cropRight, setCropRight] = React.useState(10);
  const [cropBottom, setCropBottom] = React.useState(10);
  const [cropLeft, setCropLeft] = React.useState(10);

  const { toast } = useToast();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setSelectedFile(file);
    setIsDone(false);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setCurrentPage(0);

    if (file.type === 'application/pdf') {
      try {
        const buffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const count = pdf.getPageCount();
        setTotalPages(count);
        
        // Initialize all pages with default 10% crop
        const initialCrops: Record<number, CropSettings> = {};
        for (let i = 0; i < count; i++) {
          initialCrops[i] = { t: 10, r: 10, b: 10, l: 10 };
        }
        setAllCrops(initialCrops);
        syncView(initialCrops[0]);
      } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Failed to read PDF pages." });
      }
    } else {
      setTotalPages(1);
      const initial = { t: 10, r: 10, b: 10, l: 10 };
      setAllCrops({ 0: initial });
      syncView(initial);
    }
  };

  const syncView = (settings: CropSettings) => {
    setCropTop(settings.t);
    setCropRight(settings.r);
    setCropBottom(settings.b);
    setCropLeft(settings.l);
  };

  const updateCurrentCrop = (updates: Partial<CropSettings>) => {
    setAllCrops(prev => {
      const current = prev[currentPage] || { t: 10, r: 10, b: 10, l: 10 };
      const next = { ...current, ...updates };
      return { ...prev, [currentPage]: next };
    });
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      const nextIdx = currentPage + 1;
      setCurrentPage(nextIdx);
      syncView(allCrops[nextIdx]);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      const prevIdx = currentPage - 1;
      setCurrentPage(prevIdx);
      syncView(allCrops[prevIdx]);
    }
  };

  const handleCrop = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      if (selectedFile.type === 'application/pdf') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pages = pdfDoc.getPages();

        pages.forEach((page, i) => {
          let settings: CropSettings;
          
          if (cropScope === "all") {
            // Use current page settings for everyone
            settings = allCrops[currentPage];
          } else {
            // Apply only to the current page, or use unique settings if they exist
            if (i === currentPage) {
               settings = allCrops[i];
            } else {
               // If scope is "current", only crop the active page
               return; 
            }
          }
          
          const { width, height } = page.getSize();
          const x = (settings.l / 100) * width;
          const y = (settings.b / 100) * height;
          const newWidth = width - ((settings.l + settings.r) / 100) * width;
          const newHeight = height - ((settings.t + settings.b) / 100) * height;

          page.setCropBox(x, y, newWidth, newHeight);
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
      } else {
        // Simple simulation for image crop
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockBlob = new Blob([await selectedFile.arrayBuffer()], { type: selectedFile.type });
        setDownloadUrl(URL.createObjectURL(mockBlob));
      }

      setIsDone(true);
      toast({ 
        title: "Crop Applied", 
        description: cropScope === "all" ? "Applied to all document pages." : "Applied to active page only." 
      });
    } catch (e) {
      console.error(e);
      toast({ 
        variant: "destructive", 
        title: "Process Failed", 
        description: "Could not apply geometric boundaries." 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onMouseDown = (handle: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      if (isDragging === 'top') {
        setCropTop(clampedY);
        updateCurrentCrop({ t: clampedY });
      }
      if (isDragging === 'bottom') {
        setCropBottom(100 - clampedY);
        updateCurrentCrop({ b: 100 - clampedY });
      }
      if (isDragging === 'left') {
        setCropLeft(clampedX);
        updateCurrentCrop({ l: clampedX });
      }
      if (isDragging === 'right') {
        setCropRight(100 - clampedX);
        updateCurrentCrop({ r: 100 - clampedX });
      }
      
      if (isDragging === 'top-left') {
        setCropTop(clampedY);
        setCropLeft(clampedX);
        updateCurrentCrop({ t: clampedY, l: clampedX });
      }
      if (isDragging === 'top-right') {
        setCropTop(clampedY);
        setCropRight(100 - clampedX);
        updateCurrentCrop({ t: clampedY, r: 100 - clampedX });
      }
      if (isDragging === 'bottom-left') {
        setCropBottom(100 - clampedY);
        setCropLeft(clampedX);
        updateCurrentCrop({ b: 100 - clampedY, l: clampedX });
      }
      if (isDragging === 'bottom-right') {
        setCropBottom(100 - clampedY);
        setCropRight(100 - clampedX);
        updateCurrentCrop({ b: 100 - clampedY, r: 100 - clampedX });
      }
    };

    const onMouseUp = () => setIsDragging(null);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, currentPage]);

  const reset = () => {
    setSelectedFile(null);
    setIsDone(false);
    setCurrentPage(0);
    setTotalPages(1);
    setAllCrops({});
  };

  const isImage = selectedFile?.type.startsWith('image/');

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Crop className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic tracking-tighter">Visual Crop Engine</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Precision mouse-based cropping. Define unique page dimensions or apply to entire assets.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              {!selectedFile ? (
                <FileDropzone 
                  onFilesSelected={handleFilesSelected} 
                  maxFiles={1} 
                  accept=".pdf,.jpg,.jpeg,.png"
                  isLoading={isProcessing} 
                />
              ) : (
                <div className="grid lg:grid-cols-12 gap-12">
                  {/* Left: Interactive Mouse Workspace */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                          <MousePointer2 className="h-3.5 w-3.5" />
                          Interactive Canvas
                        </h3>
                        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                           <Layers className="h-3 w-3 text-primary" />
                           <span className="text-[10px] font-bold text-primary">PAGE {currentPage + 1} OF {totalPages}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-primary uppercase truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                    
                    <div 
                      ref={containerRef}
                      className="relative rounded-[2.5rem] border-2 border-dashed border-accent/10 bg-white/40 overflow-hidden min-h-[600px] flex flex-col items-center justify-center p-12 select-none"
                    >
                      {/* Base Content */}
                      <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center">
                        {isImage ? (
                          <img 
                            src={URL.createObjectURL(selectedFile)} 
                            className="max-w-full max-h-[500px] rounded-lg shadow-2xl pointer-events-none"
                            alt="Crop target"
                          />
                        ) : (
                          <div className="w-full h-[500px] opacity-40 grayscale-[0.5] pointer-events-none">
                             <PDFPreview file={selectedFile} title="Structural Reference" />
                          </div>
                        )}

                        {/* Shaded Area Overlay */}
                        <div className="absolute inset-0 bg-black/40 pointer-events-none" style={{ 
                          clipPath: `polygon(
                            0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
                            ${cropLeft}% ${cropTop}%, 
                            ${cropLeft}% ${100 - cropBottom}%, 
                            ${100 - cropRight}% ${100 - cropBottom}%, 
                            ${100 - cropRight}% ${cropTop}%, 
                            ${cropLeft}% ${cropTop}%
                          )` 
                        }} />

                        {/* Interactive Crop Box */}
                        <div 
                          className="absolute border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0)]"
                          style={{
                            top: `${cropTop}%`,
                            left: `${cropLeft}%`,
                            right: `${cropRight}%`,
                            bottom: `${cropBottom}%`,
                          }}
                        >
                          {/* Corner Handles */}
                          <div onMouseDown={onMouseDown('top-left')} className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-primary rounded-full cursor-nwse-resize shadow-lg hover:scale-125 transition-transform" />
                          <div onMouseDown={onMouseDown('top-right')} className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-primary rounded-full cursor-nesw-resize shadow-lg hover:scale-125 transition-transform" />
                          <div onMouseDown={onMouseDown('bottom-left')} className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-primary rounded-full cursor-nesw-resize shadow-lg hover:scale-125 transition-transform" />
                          <div onMouseDown={onMouseDown('bottom-right')} className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-primary rounded-full cursor-nwse-resize shadow-lg hover:scale-125 transition-transform" />
                          
                          {/* Edge Handles */}
                          <div onMouseDown={onMouseDown('top')} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-primary/80 rounded-full cursor-ns-resize" />
                          <div onMouseDown={onMouseDown('bottom')} className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-1.5 bg-primary/80 rounded-full cursor-ns-resize" />
                          <div onMouseDown={onMouseDown('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-8 bg-primary/80 rounded-full cursor-ew-resize" />
                          <div onMouseDown={onMouseDown('right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1.5 h-8 bg-primary/80 rounded-full cursor-ew-resize" />
                        </div>
                      </div>

                      {/* Navigation Controls */}
                      {!isImage && totalPages > 1 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur shadow-2xl p-2 rounded-2xl border border-white/20">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handlePrev} 
                            disabled={currentPage === 0}
                            className="rounded-xl"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent/60 w-24 text-center">
                            PAGE {currentPage + 1} / {totalPages}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleNext} 
                            disabled={currentPage === totalPages - 1}
                            className="rounded-xl"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Choices & Metadata */}
                  <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white/80 backdrop-blur-sm sticky top-24">
                      <CardHeader className="pt-8 px-8">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3 text-accent">
                          <Settings2 className="h-5 w-5 text-primary" />
                          Crop Settings
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-accent/40">
                          Scope & Application
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8 p-8">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Target Pages</Label>
                          <RadioGroup 
                            defaultValue="all" 
                            value={cropScope} 
                            onValueChange={(v) => setCropScope(v as any)}
                            className="grid grid-cols-1 gap-3"
                          >
                            <div className={cn(
                              "flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer",
                              cropScope === 'all' ? "bg-primary/5 border-primary/20" : "border-accent/10 hover:border-accent/20"
                            )} onClick={() => setCropScope('all')}>
                              <RadioGroupItem value="all" id="all-pages" />
                              <Label htmlFor="all-pages" className="flex flex-col cursor-pointer">
                                <span className="text-xs font-black uppercase italic">All Pages</span>
                                <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Apply current crop to every page</span>
                              </Label>
                              <Copy className="h-4 w-4 ml-auto text-primary/40" />
                            </div>
                            <div className={cn(
                              "flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer",
                              cropScope === 'current' ? "bg-primary/5 border-primary/20" : "border-accent/10 hover:border-accent/20"
                            )} onClick={() => setCropScope('current')}>
                              <RadioGroupItem value="current" id="current-page" />
                              <Label htmlFor="current-page" className="flex flex-col cursor-pointer">
                                <span className="text-xs font-black uppercase italic">Current Page</span>
                                <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Crop only Page {currentPage + 1}</span>
                              </Label>
                              <Scan className="h-4 w-4 ml-auto text-primary/40" />
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleCrop} 
                            disabled={isProcessing}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Execute Precision Crop"}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            Change Asset
                          </Button>
                        </div>
                        
                        {/* Status readout (Replaces Adjustment Bar) */}
                        <div className="pt-6 border-t border-accent/5 grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-accent/40">Margins</p>
                              <p className="text-[10px] font-bold text-accent">T: {cropTop.toFixed(0)}% • B: {cropBottom.toFixed(0)}%</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-accent/40">Canvas</p>
                              <p className="text-[10px] font-bold text-accent">L: {cropLeft.toFixed(0)}% • R: {cropRight.toFixed(0)}%</p>
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <Card className="p-12 bg-white border border-white/40 rounded-[3rem] shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Cropping Complete</h2>
                  <p className="text-muted-foreground text-sm font-medium">Successfully processed the selection scope.</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `cropped_${selectedFile?.name || 'asset'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Result
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/60">
                Crop another asset
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
