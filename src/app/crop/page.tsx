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
  FileType,
  AlertCircle,
  RefreshCcw
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

  // Individual handle states for real-time UI tracking
  const [cropTop, setCropTop] = React.useState(10);
  const [cropRight, setCropRight] = React.useState(10);
  const [cropBottom, setCropBottom] = React.useState(10);
  const [cropLeft, setCropLeft] = React.useState(10);

  const { toast } = useToast();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      if (file.type === 'application/pdf') {
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
        setExportFormat("pdf");
      } else if (file.type.startsWith('image/')) {
        setTotalPages(1);
        const initial = { t: 10, r: 10, b: 10, l: 10 };
        setAllCrops({ 0: initial });
        syncView(initial);
        setExportFormat(file.type.includes('png') ? "png" : "jpg");
      } else {
        throw new Error("Unsupported Protocol: Asset must be PDF or Image.");
      }

      setSelectedFile(file);
      setIsDone(false);
      setCurrentPage(0);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    } catch (e: any) {
      toast({ 
        variant: "destructive", 
        title: "Registry Error", 
        description: e.message || "Failed to parse document structure." 
      });
    } finally {
      setIsProcessing(false);
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
    
    // PDF coordinates: (0,0) is bottom-left. 
    // UI: percentages from edges.
    const leftOffset = (settings.l / 100) * mediaBox.width;
    const rightOffset = (settings.r / 100) * mediaBox.width;
    const topOffset = (settings.t / 100) * mediaBox.height;
    const bottomOffset = (settings.b / 100) * mediaBox.height;

    const newX = mediaBox.x + leftOffset;
    const newY = mediaBox.y + bottomOffset;
    const newWidth = mediaBox.width - leftOffset - rightOffset;
    const newHeight = mediaBox.height - topOffset - bottomOffset;

    // Safety clamp: Ensure cropBox doesn't invert or exceed bounds
    page.setCropBox(
      Math.max(mediaBox.x, newX),
      Math.max(mediaBox.y, newY),
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
          resultPdf = await PDFDocument.create();
          const [copiedPage] = await resultPdf.copyPages(sourcePdf, [currentPage]);
          resultPdf.addPage(copiedPage);
          const settings = allCrops[currentPage] || { t: 10, r: 10, b: 10, l: 10 };
          applyCropToPage(copiedPage, settings);
        } else {
          resultPdf = sourcePdf;
          const pages = resultPdf.getPages();
          pages.forEach((page, i) => {
            // Apply current UI crop to all if scope is 'all', or individual if modified
            const settings = cropScope === 'all' ? (allCrops[currentPage] || { t: 10, r: 10, b: 10, l: 10 }) : (allCrops[i] || { t: 10, r: 10, b: 10, l: 10 });
            applyCropToPage(page, settings);
          });
        }

        const pdfBytes = await resultPdf.save();
        setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      } else if (!isInputPdf) {
        // Image Processing
        const img = new Image();
        const objectUrl = URL.createObjectURL(selectedFile);
        img.src = objectUrl;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Canvas Context Failure");

        const settings = allCrops[0] || { t: 10, r: 10, b: 10, l: 10 };
        const sourceX = (settings.l / 100) * img.width;
        const sourceY = (settings.t / 100) * img.height;
        const sourceWidth = img.width * (1 - (settings.l + settings.r) / 100);
        const sourceHeight = img.height * (1 - (settings.t + settings.b) / 100);

        canvas.width = Math.max(1, sourceWidth);
        canvas.height = Math.max(1, sourceHeight);
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(objectUrl);

        if (exportFormat === "pdf") {
          const pdfDoc = await PDFDocument.create();
          const imageBytes = await new Promise<ArrayBuffer>((res) => {
             canvas.toBlob(async (b) => res(await b!.arrayBuffer()), 'image/jpeg', 0.95);
          });
          const embeddedImage = await pdfDoc.embedJpg(imageBytes);
          const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
          page.drawImage(embeddedImage, { x: 0, y: 0, width: embeddedImage.width, height: embeddedImage.height });
          const pdfBytes = await pdfDoc.save();
          setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
        } else {
          const mimeType = exportFormat === "png" ? "image/png" : "image/jpeg";
          const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), mimeType, 0.95));
          setDownloadUrl(URL.createObjectURL(blob));
        }
      } else {
        throw new Error("Format Transformation Unsupported in Current Sequence.");
      }

      setIsDone(true);
      toast({ title: "Protocol Success", description: "Segment extracted and verified." });
    } catch (e: any) {
      console.error(e);
      toast({ 
        variant: "destructive", 
        title: "Sequence Failed", 
        description: e.message || "An error occurred during industrial extraction." 
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
      if (!isDragging || !contentRef.current) return;

      const rect = contentRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      if (isDragging === 'top') {
        const nextT = Math.min(clampedY, 100 - cropBottom - 1);
        setCropTop(nextT);
        updateCurrentCrop({ t: nextT });
      } else if (isDragging === 'bottom') {
        const nextB = Math.min(100 - clampedY, 100 - cropTop - 1);
        setCropBottom(nextB);
        updateCurrentCrop({ b: nextB });
      } else if (isDragging === 'left') {
        const nextL = Math.min(clampedX, 100 - cropRight - 1);
        setCropLeft(nextL);
        updateCurrentCrop({ l: nextL });
      } else if (isDragging === 'right') {
        const nextR = Math.min(100 - clampedX, 100 - cropLeft - 1);
        setCropRight(nextR);
        updateCurrentCrop({ r: nextR });
      } else if (isDragging === 'top-left') {
        const nextT = Math.min(clampedY, 100 - cropBottom - 1);
        const nextL = Math.min(clampedX, 100 - cropRight - 1);
        setCropTop(nextT); setCropLeft(nextL);
        updateCurrentCrop({ t: nextT, l: nextL });
      } else if (isDragging === 'top-right') {
        const nextT = Math.min(clampedY, 100 - cropBottom - 1);
        const nextR = Math.min(100 - clampedX, 100 - cropLeft - 1);
        setCropTop(nextT); setCropRight(nextR);
        updateCurrentCrop({ t: nextT, r: nextR });
      } else if (isDragging === 'bottom-left') {
        const nextB = Math.min(100 - clampedY, 100 - cropTop - 1);
        const nextL = Math.min(clampedX, 100 - cropRight - 1);
        setCropBottom(nextB); setCropLeft(nextL);
        updateCurrentCrop({ b: nextB, l: nextL });
      } else if (isDragging === 'bottom-right') {
        const nextB = Math.min(100 - clampedY, 100 - cropTop - 1);
        const nextR = Math.min(100 - clampedX, 100 - cropLeft - 1);
        setCropBottom(nextB); setCropRight(nextR);
        updateCurrentCrop({ b: nextB, r: nextR });
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
  }, [isDragging, cropTop, cropBottom, cropLeft, cropRight, currentPage]);

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
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <Crop className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Precision Crop Engine</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              Visual coordinate mapping. Define precise margins for single pages or entire industrial document sequences.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
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
                          <MousePointer2 className="h-3.5 w-3.5 text-primary" /> Visual Workspace
                        </h3>
                        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/10">
                           <Layers className="h-3 w-3 text-primary" />
                           <span className="text-[9px] font-black text-primary uppercase tracking-tighter">PAGE {currentPage + 1} / {totalPages}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-accent/40 uppercase truncate max-w-[200px] italic">{selectedFile.name}</span>
                    </div>
                    
                    <div className="relative rounded-[3rem] border-4 border-accent/10 bg-white shadow-2xl overflow-hidden min-h-[700px] flex items-center justify-center p-8 select-none">
                      {/* The reference content */}
                      <div ref={contentRef} className="relative inline-block">
                        {isImage ? (
                          <img 
                            src={URL.createObjectURL(selectedFile)} 
                            className="max-w-full max-h-[650px] shadow-2xl pointer-events-none rounded-sm"
                            alt="Crop target"
                          />
                        ) : (
                          <div className="w-[500px] h-[650px] pointer-events-none bg-muted/10">
                             <PDFPreview file={selectedFile} title="High-Fidelity reference" className="h-full" currentPage={currentPage + 1} />
                          </div>
                        )}

                        {/* Visual mask */}
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

                        {/* Handle Overlay */}
                        <div 
                          className="absolute border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.1)] bg-primary/5"
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
                          
                          <div onMouseDown={onMouseDown('top')} className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-primary rounded-full cursor-ns-resize hover:h-3 transition-all" />
                          <div onMouseDown={onMouseDown('bottom')} className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-primary rounded-full cursor-ns-resize hover:h-3 transition-all" />
                          <div onMouseDown={onMouseDown('left')} className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-12 bg-primary rounded-full cursor-ew-resize hover:w-3 transition-all" />
                          <div onMouseDown={onMouseDown('right')} className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-12 bg-primary rounded-full cursor-ew-resize hover:w-3 transition-all" />
                        </div>
                      </div>

                      {!isImage && totalPages > 1 && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-accent/90 backdrop-blur text-white shadow-2xl p-2 rounded-[1.5rem] border border-white/10">
                          <Button variant="ghost" size="icon" onClick={handlePrev} disabled={currentPage === 0} className="rounded-xl hover:bg-white/10 h-10 w-10 text-white">
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <span className="text-[10px] font-black uppercase tracking-widest w-24 text-center">
                            PAGE {currentPage + 1} / {totalPages}
                          </span>
                          <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentPage === totalPages - 1} className="rounded-xl hover:bg-white/10 h-10 w-10 text-white">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white sticky top-24">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                              <Settings2 className="h-5 w-5" />
                           </div>
                           <div className="flex flex-col">
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Command Suite</CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Extraction Protocols</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        {!isImage && (
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Registry Scope</Label>
                            <RadioGroup value={cropScope} onValueChange={(v) => setCropScope(v as any)} className="grid grid-cols-1 gap-3">
                              <div className={cn("flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer", cropScope === 'all' ? "bg-primary/5 border-primary/20 shadow-inner" : "border-accent/5 hover:bg-muted/30")} onClick={() => setCropScope('all')}>
                                <RadioGroupItem value="all" id="scope-all" />
                                <Label htmlFor="scope-all" className="flex flex-col cursor-pointer flex-1">
                                  <span className="text-[11px] font-black uppercase italic">Universal Propagation</span>
                                  <span className="text-[8px] text-accent/40 font-bold uppercase tracking-widest">Apply geometry to ENTIRE sequence</span>
                                </Label>
                                <Copy className="h-4 w-4 text-primary/40" />
                              </div>
                              <div className={cn("flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer", cropScope === 'current' ? "bg-primary/5 border-primary/20 shadow-inner" : "border-accent/5 hover:bg-muted/30")} onClick={() => setCropScope('current')}>
                                <RadioGroupItem value="current" id="scope-current" />
                                <Label htmlFor="scope-current" className="flex flex-col cursor-pointer flex-1">
                                  <span className="text-[11px] font-black uppercase italic">Segment Isolation</span>
                                  <span className="text-[8px] text-accent/40 font-bold uppercase tracking-widest">Extract Page {currentPage + 1} ONLY</span>
                                </Label>
                                <Scan className="h-4 w-4 text-primary/40" />
                              </div>
                            </RadioGroup>
                          </div>
                        )}

                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                            <FileType className="h-3 w-3" /> Target Format
                          </Label>
                          <Select value={exportFormat} onValueChange={(v: any) => setExportFormat(v)}>
                             <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-accent/10 shadow-sm font-bold text-accent uppercase text-[10px]">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent className="rounded-xl border-accent/10">
                                <SelectItem value="pdf" className="text-xs font-bold uppercase">PDF Document</SelectItem>
                                <SelectItem value="png" className="text-xs font-bold uppercase">PNG Stream</SelectItem>
                                <SelectItem value="jpg" className="text-xs font-bold uppercase">JPG Asset</SelectItem>
                             </SelectContent>
                          </Select>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleCrop} 
                            disabled={isProcessing}
                            className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scan className="mr-2 h-4 w-4" />}
                            Deploy extraction
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            Initialize new sequence
                          </Button>
                        </div>

                        <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-start gap-4">
                           <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-accent uppercase tracking-wider italic">Industrial Coordinate Logic</p>
                              <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">
                                High-fidelity extraction reconstructs the asset object stream based on visual coordinate anchors.
                              </p>
                           </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in slide-in-from-bottom-8 duration-700">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-12 space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Segment ready!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Coordinate extraction verified. Asset serialized successfully.</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `DOCFLOW_Crop_${new Date().getTime()}.${exportFormat}`;
                      link.click();
                    }
                  }} 
                  className="w-full h-16 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download isolated asset
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                <RefreshCcw className="mr-2 h-3 w-3" /> Initialize new sequence
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
