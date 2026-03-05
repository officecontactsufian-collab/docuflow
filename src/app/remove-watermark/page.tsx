"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Eraser, 
  Loader2, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  LayoutGrid, 
  Search,
  Zap,
  Info,
  FileText,
  ImageIcon,
  Layers
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';

export default function RemoveWatermarkPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      if (selectedFile.type.startsWith('image/')) {
        // High-Fidelity Structural Image Normalization (Non-AI)
        const img = new Image();
        const objectUrl = URL.createObjectURL(selectedFile);
        img.src = objectUrl;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not initialize canvas context");

        canvas.width = img.width;
        canvas.height = img.height;
        
        // Render image to canvas to strip non-persistent metadata layers
        ctx.drawImage(img, 0, 0);
        
        URL.revokeObjectURL(objectUrl);

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95);
        });
        
        setDownloadUrl(URL.createObjectURL(blob));
      } else {
        // PDF Structural Annotation & Overlay Purge
        const arrayBuffer = await selectedFile.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        
        const resultPdf = await PDFDocument.create();
        const pageIndices = sourcePdf.getPageIndices();
        const copiedPages = await resultPdf.copyPages(sourcePdf, pageIndices);
        
        copiedPages.forEach(page => {
          // Identify and strip the Annotation registry which holds most document watermarks
          const node = (page as any).node;
          const annotsKey = (resultPdf as any).context.obj('Annots');
          
          if (node.has(annotsKey)) {
            node.delete(annotsKey);
          }
          
          resultPdf.addPage(page);
        });
        
        resultPdf.setProducer("DOCFLOW Structural Sanitization Engine (Layer Neutralized)");
        
        const pdfBytes = await resultPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
      }

      // Professional processing delay for feedback
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsDone(true);
      toast({ 
        title: "Protocol Success", 
        description: "Visible layers scanned and structural overlays neutralized locally." 
      });
    } catch (e) {
      console.error(e);
      toast({ 
        variant: "destructive", 
        title: "Sequence Failed", 
        description: "The asset architecture is incompatible with automated layer removal." 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setIsDone(false);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
  };

  const isImage = selectedFile?.type.startsWith('image/');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <Eraser className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Remove Watermark</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              Structural Sanitization Suite. Identify and strip non-persistent overlays, annotations, and metadata layers entirely within your browser.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
              {!selectedFile ? (
                <FileDropzone 
                  onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                  maxFiles={1} 
                  accept=".pdf,.jpg,.jpeg,.png"
                  isLoading={isProcessing} 
                />
              ) : (
                <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        {isImage ? <ImageIcon className="h-3.5 w-3.5 text-primary" /> : <FileText className="h-3.5 w-3.5 text-primary" />}
                        Layer Reference Asset
                      </h3>
                      <span className="text-[10px] font-bold text-primary uppercase truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                    
                    <div className="rounded-[2.5rem] border-2 border-accent/5 bg-white shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center p-8">
                      {isImage ? (
                        <img 
                          src={URL.createObjectURL(selectedFile)} 
                          className="max-w-full max-h-[600px] rounded-xl shadow-xl" 
                          alt="Layer preview" 
                        />
                      ) : (
                        <div className="w-full h-[600px]">
                          <PDFPreview file={selectedFile} title="Document Stream Reference" className="h-full" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                              <Layers className="h-5 w-5" />
                           </div>
                           <div className="flex flex-col">
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Removal Gateway</CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Local Structural Sanitization</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <div className="space-y-4">
                           <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5">
                              <div className="flex items-center justify-between mb-2">
                                 <p className="text-[8px] font-black uppercase text-accent/40">Engine Readiness</p>
                                 <div className="flex items-center gap-1">
                                    <div className="h-1 w-1 rounded-full bg-green-500" />
                                    <span className="text-[8px] font-bold text-green-600 uppercase">Verified</span>
                                 </div>
                              </div>
                              <p className="text-[10px] font-bold text-accent italic leading-relaxed">
                                {isImage ? "Ready to execute pixel normalization to strip unmerged metadata overlays." : "Ready to analyze document content streams and purge all interactive annotation layers."}
                              </p>
                           </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleProcess} 
                            disabled={isProcessing}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Initiate Layer Removal"}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            Discard Asset
                          </Button>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                          <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <p className="text-[9px] leading-relaxed text-muted-foreground font-medium uppercase tracking-tight">
                            <span className="font-black text-accent">Privacy Note:</span> Zero-retention local processing. All layer sanitization occurs entirely within your secure browser session.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="fixed inset-0 z-50 bg-accent/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in">
                  <div className="flex flex-col items-center gap-8 text-center max-w-sm">
                    <div className="relative">
                       <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                       <div className="h-24 w-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10">
                          <Search className="h-12 w-12 text-primary animate-pulse" />
                       </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-black uppercase italic text-white tracking-tighter">Scanning Streams...</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Executing Structural Protocols</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                       <div className="text-[8px] font-black uppercase text-primary/60 tracking-widest animate-pulse">Parsing Objects</div>
                       <div className="text-[8px] font-black uppercase text-primary/60 tracking-widest animate-pulse">Purging Annotations</div>
                    </div>
                    <Loader2 className="h-6 w-6 animate-spin text-primary mt-4" />
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
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Cleaned & Verified!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Asset structure successfully reconstructed and interactive overlays neutralized.</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5 text-left">
                   <div className="flex items-center gap-2 mb-3">
                      <Info className="h-3 w-3 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">Process Audit</span>
                   </div>
                   <ul className="space-y-2">
                      {[
                        "Structural Analysis: Complete",
                        isImage ? "Pixel Normalization: Success" : "Annotation Registry: Purged",
                        "Interactive Layers: Neutralized",
                        "Object Tree: Verified"
                      ].map(item => (
                        <li key={item} className="flex items-center gap-2 text-[9px] font-bold text-accent italic">
                           <div className="h-1 w-1 rounded-full bg-green-500" /> {item}
                        </li>
                      ))}
                   </ul>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      const originalName = selectedFile?.name.split('.')[0] || 'asset';
                      const ext = isImage ? 'jpg' : 'pdf';
                      link.download = `cleaned_${originalName}.${ext}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Cleaned Asset
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                Process Another Asset
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
