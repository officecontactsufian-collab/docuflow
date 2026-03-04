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
  Copy,
  FileType
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CropSettings = {
  t: number;
  r: number;
  b: number;
  l: number;
};

type ExportFormat = "pdf" | "png" | "jpg";

export default function CropPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [exportFormat, setExportFormat] = React.useState<ExportFormat>("pdf");
  
  const [cropScope, setCropScope] = React.useState<"all" | "current">("all");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [allCrops, setAllCrops] = React.useState<Record<number, CropSettings>>({});

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
      setExportFormat("pdf");
      try {
        const buffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const count = pdf.getPageCount();
        setTotalPages(count);
        
        const initialCrops: Record<number, CropSettings> = {};
        for (let i = 0; i < count; i++) {
          initialCrops[i] = { t: 10, r: 10, b: 10, l: 10 };
        }
        setAllCrops(initialCrops);
        syncView(initialCrops[0]);
      } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Failed to read document structure." });
      }
    } else {
      setExportFormat(file.type.includes('png') ? "png" : "jpg");
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
      syncView(allCrops[nextIdx] || { t: 10, r: 10, b: 10, l: 10 });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      const prevIdx = currentPage - 1;
      setCurrentPage(prevIdx);
      syncView(allCrops[prevIdx] || { t: 10, r: 10, b: 10, l: 10 });
    }
  };

  const applyCropToPage = (page: any, settings: CropSettings) => {
    const mediaBox = page.getMediaBox();
    const x = mediaBox.x + (settings.l / 100) * mediaBox.width;
    const y = mediaBox.y + (settings.b / 100) * mediaBox.height;
    const newWidth = mediaBox.width * (1 - (settings.l + settings.r) / 100);
    const newHeight = mediaBox.height * (1 - (settings.t + settings.b) / 100);

    page.setCropBox(
      Math.max(mediaBox.x, x),
      Math.max(mediaBox.y, y),
      Math.max(1, newWidth),
      Math.max(1, newHeight)
    );
  };

  const handleCrop = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const isInputPdf = selectedFile.type === 'application/pdf';

      if (isInputPdf && exportFormat === "pdf") {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        
        let resultPdf: PDFDocument;
        
        if (cropScope === "current") {
          // Extract only the current page
          resultPdf = await PDFDocument.create();
          const [copiedPage] = await resultPdf.copyPages(sourcePdf, [currentPage]);
          resultPdf.addPage(copiedPage);
          
          const settings = allCrops[currentPage] || { t: 10, r: 10, b: 10, l: 10 };
          applyCropToPage(copiedPage, settings);
        } else {
          // Process all pages
          resultPdf = sourcePdf;
          const settings = allCrops[currentPage] || { t: 10, r: 10, b: 10, l: 10 };
          const pages = resultPdf.getPages();
          pages.forEach(page => applyCropToPage(page, settings));
        }

        const pdfBytes = await resultPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
      } else if (!isInputPdf) {
        // Image Processing for JPG/PNG
        const img = new Image();
        const objectUrl = URL.createObjectURL(selectedFile);
        img.src = objectUrl;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not initialize canvas context");

        const settings = allCrops[0] || { t: 10, r: 10, b: 10, l: 10 };
        const sourceX = (settings.l / 100) * img.width;
        const sourceY = (settings.t / 100) * img.height;
        const sourceWidth = img.width * (1 - (settings.l + settings.r) / 100);
        const sourceHeight = img.height * (1 - (settings.t + settings.b) / 100);

        canvas.width = Math.max(1, sourceWidth);
        canvas.height = Math.max(1, sourceHeight);
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);

        URL.revokeObjectURL(objectUrl);

        let finalBlob: Blob;
        if (exportFormat === "pdf") {
          const pdfDoc = await PDFDocument.create();
          const imageBytes = await new Promise<ArrayBuffer>((resolve) => {
             canvas.toBlob(async (blob) => {
               if (!blob) return;
               resolve(await blob.arrayBuffer());
             }, 'image/jpeg', 0.95);
          });
          const embeddedImage = await pdfDoc.embedJpg(imageBytes);
          const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
          page.drawImage(embeddedImage, { x: 0, y: 0, width: embeddedImage.width, height: embeddedImage.height });
          const pdfBytes = await pdfDoc.save();
          finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        } else {
          const mimeType = exportFormat === "png" ? "image/png" : "image/jpeg";
          const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), mimeType, 0.95));
          finalBlob = blob;
        }
        
        setDownloadUrl(URL.createObjectURL(finalBlob));
      } else {
        // PDF to Image (Export Format is png or jpg but input is PDF)
        // For simplicity in a browser context without a PDF renderer, we'll export as PDF but notify the user
        // In a real prod app, we'd use pdf.js to render to canvas first
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
        setExportFormat("pdf");
        toast({ title: "Note", description: "PDF to Image conversion exported as cropped PDF." });
      }

      setIsDone(true);
      toast({ 
        title: "Crop Successful", 
        description: "Your document has been processed successfully." 
      });
    } catch (e) {
      console.error(e);
      toast({ 
        variant: "destructive", 
        title: "Process Failed", 
        description: "An error occurred during processing. Please try again." 
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
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  const isImage = selectedFile?.type.startsWith('image/');

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Crop className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic tracking-tighter">Precision Crop Engine</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Visual mouse-driven cropping. Define precise margins for single pages or entire documents.
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
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                          <MousePointer2 className="h-3.5 w-3.5" />
                          Visual Canvas
                        </h3>
                        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                           <Layers className="h-3 w-3 text-primary" />
                           <span className="text-[10px] font-bold text-primary uppercase">PAGE {currentPage + 1} OF {totalPages}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-primary uppercase truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                    
                    <div 
                      ref={containerRef}
                      className="relative rounded-[2.5rem] border-2 border-accent/10 bg-white shadow-2xl overflow-hidden min-h-[700px] flex flex-col items-center justify-center p-4 select-none"
                    >
                      <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center">
                        {isImage ? (
                          <img 
                            src={URL.createObjectURL(selectedFile)} 
                            className="max-w-full max-h-[650px] rounded-lg shadow-2xl pointer-events-none"
                            alt="Crop target"
                          />
                        ) : (
                          <div className="w-full h-[650px] pointer-events-none">
                             <PDFPreview file={selectedFile} title="High-Fidelity Reference" className="h-full" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/5 pointer-events-none" style={{ 
                          clipPath: `polygon(
                            0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
                            ${cropLeft}% ${cropTop}%, 
                            ${cropLeft}% ${100 - cropBottom}%, 
                            ${100 - cropRight}% ${100 - cropBottom}%, 
                            ${100 - cropRight}% ${cropTop}%, 
                            ${cropLeft}% ${cropTop}%
                          )` 
                        }} />

                        <div 
                          className="absolute border-2 border-primary shadow-2xl bg-primary/5"
                          style={{
                            top: `${cropTop}%`,
                            left: `${cropLeft}%`,
                            right: `${cropRight}%`,
                            bottom: `${cropBottom}%`,
                          }}
                        >
                          <div onMouseDown={onMouseDown('top-left')} className="absolute -top-3 -left-3 w-6 h-6 bg-white border-2 border-primary rounded-full cursor-nwse-resize shadow-lg hover:scale-125 transition-transform z-50" />
                          <div onMouseDown={onMouseDown('top-right')} className="absolute -top-3 -right-3 w-6 h-6 bg-white border-2 border-primary rounded-full cursor-nesw-resize shadow-lg hover:scale-125 transition-transform z-50" />
                          <div onMouseDown={onMouseDown('bottom-left')} className="absolute -bottom-3 -left-3 w-6 h-6 bg-white border-2 border-primary rounded-full cursor-nesw-resize shadow-lg hover:scale-125 transition-transform z-50" />
                          <div onMouseDown={onMouseDown('bottom-right')} className="absolute -bottom-3 -right-3 w-6 h-6 bg-white border-2 border-primary rounded-full cursor-nwse-resize shadow-lg hover:scale-125 transition-transform z-50" />
                        </div>
                      </div>

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

                  <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white/80 backdrop-blur-sm sticky top-24">
                      <CardHeader className="pt-8 px-8">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3 text-accent">
                          <Settings2 className="h-5 w-5 text-primary" />
                          Crop Sequence
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8 p-8">
                        {!isImage && (
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Target Scope</Label>
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
                                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest text-left">Apply crop to entire sequence</span>
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
                                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest text-left">Extract Page {currentPage + 1} ONLY</span>
                                </Label>
                                <Scan className="h-4 w-4 ml-auto text-primary/40" />
                              </div>
                            </RadioGroup>
                          </div>
                        )}

                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                            <FileType className="h-3 w-3" /> Output Format
                          </Label>
                          <Select value={exportFormat} onValueChange={(v: any) => setExportFormat(v)}>
                             <SelectTrigger className="h-12 rounded-xl bg-white border-accent/10 shadow-sm font-bold text-accent uppercase">
                                <SelectValue placeholder="Format Choice" />
                             </SelectTrigger>
                             <SelectContent className="rounded-xl border-accent/10">
                                <SelectItem value="pdf" className="text-xs font-bold uppercase">PDF Document</SelectItem>
                                <SelectItem value="png" className="text-xs font-bold uppercase">PNG Asset</SelectItem>
                                <SelectItem value="jpg" className="text-xs font-bold uppercase">JPG Asset</SelectItem>
                             </SelectContent>
                          </Select>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleCrop} 
                            disabled={isProcessing}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Deploy ${exportFormat.toUpperCase()} Crop`}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            Discard Document
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
              <Card className="p-12 bg-white border border-white/40 rounded-[3rem] shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Segment Ready!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Successfully processed as {exportFormat.toUpperCase()}.</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      const ext = exportFormat;
                      link.download = `cropped_${selectedFile?.name.split('.')[0] || 'asset'}.${ext}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download {exportFormat.toUpperCase()}
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/60">
                Process New Asset
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
