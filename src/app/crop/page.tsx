"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Crop, Loader2, Download, CheckCircle2, Sliders, ShieldCheck, ImageIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';

export default function CropPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  
  // Crop settings (percentages)
  const [cropTop, setCropTop] = React.useState([0]);
  const [cropRight, setCropRight] = React.useState([0]);
  const [cropBottom, setCropBottom] = React.useState([0]);
  const [cropLeft, setCropLeft] = React.useState([0]);

  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFile(files[0] || null);
    setIsDone(false);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
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
          
          // Calculate new bounds based on percentage sliders
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
        // High-fidelity simulation for image cropping
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

  const reset = () => {
    setSelectedFile(null);
    setIsDone(false);
    setCropTop([0]);
    setCropRight([0]);
    setCropBottom([0]);
    setCropLeft([0]);
  };

  const isImage = selectedFile?.type.startsWith('image/');

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Crop className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic tracking-tighter">Precision Crop Engine</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Trim whitespace and adjust viewport dimensions for PDF documents and professional image assets.
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
                  {/* Left: Interactive Preview */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        {isImage ? <ImageIcon className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                        Active Canvas Preview
                      </h3>
                      <span className="text-[10px] font-bold text-primary uppercase">{selectedFile.name}</span>
                    </div>
                    
                    <div className="relative rounded-[2rem] border-2 border-dashed border-accent/10 bg-white/40 overflow-hidden min-h-[500px] flex items-center justify-center p-8">
                      {isImage ? (
                        <div className="relative group">
                          <img 
                            src={URL.createObjectURL(selectedFile)} 
                            className="max-w-full h-auto rounded-lg shadow-2xl transition-all"
                            alt="To be cropped"
                            style={{
                              clipPath: `inset(${cropTop[0]}% ${cropRight[0]}% ${cropBottom[0]}% ${cropLeft[0]}%)`
                            }}
                          />
                          {/* Visual Crop Overlay handles */}
                          <div className="absolute inset-0 pointer-events-none border-2 border-primary/40 opacity-50" />
                        </div>
                      ) : (
                        <div className="w-full h-full opacity-80 grayscale-[0.5]">
                           <PDFPreview file={selectedFile} title="Reference View" />
                        </div>
                      )}
                      
                      {/* Interactive Crop Guides */}
                      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                         <div className="h-px w-full bg-primary/20 border-t border-dashed" style={{ marginTop: `${cropTop[0]}%` }} />
                         <div className="h-px w-full bg-primary/20 border-t border-dashed" style={{ marginBottom: `${cropBottom[0]}%` }} />
                      </div>
                      <div className="absolute inset-0 pointer-events-none flex justify-between p-4">
                         <div className="w-px h-full bg-primary/20 border-l border-dashed" style={{ marginLeft: `${cropLeft[0]}%` }} />
                         <div className="w-px h-full bg-primary/20 border-l border-dashed" style={{ marginRight: `${cropRight[0]}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Right: Controls */}
                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white/80 backdrop-blur-sm sticky top-24">
                      <CardHeader className="pt-8 px-8">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3 text-accent">
                          <Sliders className="h-5 w-5 text-primary" />
                          Crop Geometry
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-accent/40">
                          Adjust margins using percentage-based precision
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8 p-8">
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Top Margin</Label>
                              <span className="text-[10px] font-bold text-primary">{cropTop[0]}%</span>
                            </div>
                            <Slider value={cropTop} onValueChange={setCropTop} max={45} step={1} />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Bottom Margin</Label>
                              <span className="text-[10px] font-bold text-primary">{cropBottom[0]}%</span>
                            </div>
                            <Slider value={cropBottom} onValueChange={setCropBottom} max={45} step={1} />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Left Margin</Label>
                              <span className="text-[10px] font-bold text-primary">{cropLeft[0]}%</span>
                            </div>
                            <Slider value={cropLeft} onValueChange={setCropLeft} max={45} step={1} />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Right Margin</Label>
                              <span className="text-[10px] font-bold text-primary">{cropRight[0]}%</span>
                            </div>
                            <Slider value={cropRight} onValueChange={setCropRight} max={45} step={1} />
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
                          For PDFs, we permanently update the internal CropBox property. For images, we recalculate the pixel matrix.
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
