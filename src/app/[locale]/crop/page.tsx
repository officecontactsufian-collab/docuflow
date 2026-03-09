
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
  Maximize,
  FileType,
  AlertCircle,
  RefreshCcw,
  Copy,
  Scan
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
        throw new Error("Unsupported Protocol.");
      }

      setSelectedFile(file);
      setIsDone(false);
      setCurrentPage(0);
      setDownloadUrl(null);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Registry Error", description: e.message });
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

  const handleCrop = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const isInputPdf = selectedFile.type === 'application/pdf';
      const arrayBuffer = await selectedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      const pages = sourcePdf.getPages();
      pages.forEach((page, i) => {
        const [copiedPage] = newPdf.copyPages(sourcePdf, [i]);
        const settings = cropScope === 'all' ? (allCrops[currentPage] || { t: 10, r: 10, b: 10, l: 10 }) : (allCrops[i] || { t: 10, r: 10, b: 10, l: 10 });
        
        const mediaBox = copiedPage.getMediaBox();
        const leftOffset = (settings.l / 100) * mediaBox.width;
        const rightOffset = (settings.r / 100) * mediaBox.width;
        const topOffset = (settings.t / 100) * mediaBox.height;
        const bottomOffset = (settings.b / 100) * mediaBox.height;

        copiedPage.setCropBox(
          mediaBox.x + leftOffset,
          mediaBox.y + bottomOffset,
          mediaBox.width - leftOffset - rightOffset,
          mediaBox.height - topOffset - bottomOffset
        );
        newPdf.addPage(copiedPage);
      });

      const pdfBytes = await newPdf.save();
      setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setIsDone(true);
      toast({ title: "Protocol Success", description: "Segment extracted and verified." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sequence Failed" });
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

      if (isDragging === 'top') { setCropTop(clampedY); updateCurrentCrop({ t: clampedY }); }
      else if (isDragging === 'bottom') { setCropBottom(100 - clampedY); updateCurrentCrop({ b: 100 - clampedY }); }
      else if (isDragging === 'left') { setCropLeft(clampedX); updateCurrentCrop({ l: clampedX }); }
      else if (isDragging === 'right') { setCropRight(100 - clampedX); updateCurrentCrop({ r: 100 - clampedX }); }
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
  }, [isDragging]);

  const reset = () => {
    setSelectedFile(null);
    setIsDone(false);
    setDownloadUrl(null);
  };

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
              Visual coordinate mapping for industrial document extraction.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
              {!selectedFile ? (
                <FileDropzone onFilesSelected={handleFilesSelected} maxFiles={1} accept=".pdf,.jpg,.jpeg,.png" isLoading={isProcessing} />
              ) : (
                <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-8 space-y-6">
                    <div className="relative rounded-[3rem] border-4 border-accent/10 bg-white shadow-2xl overflow-hidden min-h-[600px] flex items-center justify-center p-8 select-none">
                      <div ref={contentRef} className="relative inline-block">
                        <PDFPreview file={selectedFile} title="Reference Workspace" className="h-[600px]" currentPage={currentPage + 1} />
                        <div className="absolute inset-0 bg-black/40 pointer-events-none" style={{ 
                          clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${cropLeft}% ${cropTop}%, ${cropLeft}% ${100 - cropBottom}%, ${100 - cropRight}% ${100 - cropBottom}%, ${100 - cropRight}% ${cropTop}%, ${cropLeft}% ${cropTop}%)` 
                        }} />
                        <div className="absolute border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.1)] bg-primary/5" style={{ top: `${cropTop}%`, left: `${cropLeft}%`, right: `${cropRight}%`, bottom: `${cropBottom}%` }}>
                          <div onMouseDown={onMouseDown('top')} className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-primary rounded-full cursor-ns-resize" />
                          <div onMouseDown={onMouseDown('bottom')} className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-primary rounded-full cursor-ns-resize" />
                          <div onMouseDown={onMouseDown('left')} className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-12 bg-primary rounded-full cursor-ew-resize" />
                          <div onMouseDown={onMouseDown('right')} className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-12 bg-primary rounded-full cursor-ew-resize" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-8">
                      <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-xl font-black uppercase italic text-accent">Command Suite</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-8">
                        <Button onClick={handleCrop} disabled={isProcessing} className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl">
                          {isProcessing ? <Loader2 className="animate-spin" /> : <Maximize className="mr-2 h-4 w-4" />}
                          Deploy extraction
                        </Button>
                        <Button variant="ghost" onClick={() => setSelectedFile(null)} className="w-full text-[10px] font-bold uppercase tracking-widest text-accent/40">Discard Document</Button>
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
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Segment ready!</h2>
                <Button size="lg" onClick={() => { if (downloadUrl) { const link = document.createElement('a'); link.href = downloadUrl; link.download = `DOCFLOW_Crop_${new Date().getTime()}.pdf`; link.click(); } }} className="w-full h-16 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest">
                  <Download className="mr-2 h-4 w-4" /> Download isolated asset
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">Initialize new sequence</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
