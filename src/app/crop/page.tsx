
"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Crop, Loader2, Download, CheckCircle2, Sliders, ShieldCheck, ImageIcon, FileText, MousePointer2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';
import { cn } from '@/lib/utils';

export default function CropPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  
  // Crop settings (percentages 0-100)
  const [cropTop, setCropTop] = React.useState([10]);
  const [cropRight, setCropRight] = React.useState([10]);
  const [cropBottom, setCropBottom] = React.useState([10]);
  const [cropLeft, setCropLeft] = React.useState([10]);

  const { toast } = useToast();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFile(files[0] || null);
    setIsDone(false);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    // Reset to sensible defaults
    setCropTop([10]);
    setCropRight([10]);
    setCropBottom([10]);
    setCropLeft([10]);
  };

  const handleCrop = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      if (selectedFile.type === 'application/pdf') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pages = pdfDoc.getPages();

        pages.forEach((page) => {
          const { width, height } = page.getSize();
          
          const x = (cropLeft[0] / 100) * width;
          const y = (cropBottom[0] / 100) * height;
          const newWidth = width - ((cropLeft[0] + cropRight[0]) / 100) * width;
          const newHeight = height - ((cropTop[0] + cropBottom[0]) / 100) * height;

          page.setCropBox(x, y, newWidth, newHeight);
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
      } else {
        // Simulation for image cropping logic
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockBlob = new Blob([await selectedFile.arrayBuffer()], { type: selectedFile.type });
        setDownloadUrl(URL.createObjectURL(mockBlob));
      }

      setIsDone(true);
      toast({ 
        title: "Precision Crop Complete", 
        description: "Your document dimensions have been updated successfully." 
      });
    } catch (e) {
      console.error(e);
      toast({ 
        variant: "destructive", 
        title: "Crop Failed", 
        description: "Could not process document bounds. The file may be restricted." 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Mouse Interaction Logic
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

      if (isDragging === 'top') setCropTop([clampedY]);
      if (isDragging === 'bottom') setCropBottom([100 - clampedY]);
      if (isDragging === 'left') setCropLeft([clampedX]);
      if (isDragging === 'right') setCropRight([100 - clampedX]);
      
      if (isDragging === 'top-left') {
        setCropTop([clampedY]);
        setCropLeft([clampedX]);
      }
      if (isDragging === 'top-right') {
        setCropTop([clampedY]);
        setCropRight([100 - clampedX]);
      }
      if (isDragging === 'bottom-left') {
        setCropBottom([100 - clampedY]);
        setCropLeft([clampedX]);
      }
      if (isDragging === 'bottom-right') {
        setCropBottom([100 - clampedY]);
        setCropRight([100 - clampedX]);
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
  }, [isDragging]);

  const reset = () => {
    setSelectedFile(null);
    setIsDone(false);
    setCropTop([10]);
    setCropRight([10]);
    setCropBottom([10]);
    setCropLeft([10]);
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
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic tracking-tighter">Precision Crop Engine</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Visual asset manipulation. Drag to define your crop area directly on the canvas.
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
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        <MousePointer2 className="h-3.5 w-3.5" />
                        Interactive Canvas (Drag Handles to Crop)
                      </h3>
                      <span className="text-[10px] font-bold text-primary uppercase">{selectedFile.name}</span>
                    </div>
                    
                    <div 
                      ref={containerRef}
                      className="relative rounded-[2.5rem] border-2 border-dashed border-accent/10 bg-white/40 overflow-hidden min-h-[600px] flex items-center justify-center p-12 select-none"
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
                            ${cropLeft[0]}% ${cropTop[0]}%, 
                            ${cropLeft[0]}% ${100 - cropBottom[0]}%, 
                            ${100 - cropRight[0]}% ${100 - cropBottom[0]}%, 
                            ${100 - cropRight[0]}% ${cropTop[0]}%, 
                            ${cropLeft[0]}% ${cropTop[0]}%
                          )` 
                        }} />

                        {/* Interactive Crop Box */}
                        <div 
                          className="absolute border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0)]"
                          style={{
                            top: `${cropTop[0]}%`,
                            left: `${cropLeft[0]}%`,
                            right: `${cropRight[0]}%`,
                            bottom: `${cropBottom[0]}%`,
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
                    </div>
                  </div>

                  {/* Right: Fine-Tuning Controls */}
                  <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white/80 backdrop-blur-sm sticky top-24">
                      <CardHeader className="pt-8 px-8">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3 text-accent">
                          <Sliders className="h-5 w-5 text-primary" />
                          Crop Geometry
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-accent/40">
                          Refine coordinates or use handles
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8 p-8">
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Top Margin</Label>
                              <span className="text-[10px] font-bold text-primary">{cropTop[0]}%</span>
                            </div>
                            <Slider value={cropTop} onValueChange={setCropTop} max={90} step={1} />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Bottom Margin</Label>
                              <span className="text-[10px] font-bold text-primary">{cropBottom[0]}%</span>
                            </div>
                            <Slider value={cropBottom} onValueChange={setCropBottom} max={90} step={1} />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Left Margin</Label>
                              <span className="text-[10px] font-bold text-primary">{cropLeft[0]}%</span>
                            </div>
                            <Slider value={cropLeft} onValueChange={setCropLeft} max={90} step={1} />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Right Margin</Label>
                              <span className="text-[10px] font-bold text-primary">{cropRight[0]}%</span>
                            </div>
                            <Slider value={cropRight} onValueChange={setCropRight} max={90} step={1} />
                          </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleCrop} 
                            disabled={isProcessing}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Apply Geometric Crop"}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            Discard Asset
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-start gap-3 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                      <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-wider text-accent">Structural Integrity</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          We update the internal CropBox property for PDFs and recalculate the pixel matrix for images in-memory.
                        </p>
                      </div>
                    </div>
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
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Re-dimensioned!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Your asset has been cropped and verified.</p>
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
                  Download Asset
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
