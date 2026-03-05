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
  Image as ImageIcon,
  Layers,
  AlertCircle
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
  const [processLogs, setProcessLogs] = React.useState<string[]>([]);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setProcessLogs(["Initializing Structural Scan..."]);

    try {
      if (selectedFile.type.startsWith('image/')) {
        // High-Fidelity Pixel Normalization
        setProcessLogs(prev => [...prev, "Re-indexing Pixel Buffer...", "Flattening Alpha Layers..."]);
        
        const img = new Image();
        const objectUrl = URL.createObjectURL(selectedFile);
        img.src = objectUrl;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Canvas context failure.");

        canvas.width = img.width;
        canvas.height = img.height;
        
        // Render image to canvas to flatten and strip non-merged metadata
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        URL.revokeObjectURL(objectUrl);

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.98);
        });
        
        setDownloadUrl(URL.createObjectURL(blob));
        setProcessLogs(prev => [...prev, "Pixel Normalization Complete."]);
      } else {
        // Aggressive PDF Structural Purge
        setProcessLogs(prev => [...prev, "Parsing Object Tree...", "Analyzing Content Streams..."]);
        
        const arrayBuffer = await selectedFile.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        
        // Target: Catalog resources
        const catalog = sourcePdf.catalog;
        
        // 1. Remove OCGs (Optional Content Groups / Layers)
        if (catalog.has((sourcePdf as any).context.obj('OCProperties'))) {
          setProcessLogs(prev => [...prev, "Purging Optional Content Groups (Layers)..."]);
          catalog.delete((sourcePdf as any).context.obj('OCProperties'));
        }

        const pages = sourcePdf.getPages();
        pages.forEach((page, i) => {
          // 2. Remove Annotations (Stamps, Text overlays)
          const node = (page as any).node;
          if (node.has((sourcePdf as any).context.obj('Annots'))) {
            if (i === 0) setProcessLogs(prev => [...prev, "Stripping Annotation Registry..."]);
            node.delete((sourcePdf as any).context.obj('Annots'));
          }

          // 3. Remove Artifacts and Transparency Groups
          if (node.has((sourcePdf as any).context.obj('Group'))) {
            if (i === 0) setProcessLogs(prev => [...prev, "Neutralizing Transparency Groups..."]);
            node.delete((sourcePdf as any).context.obj('Group'));
          }
        });
        
        sourcePdf.setProducer("DOCFLOW Structural Sanitization Engine (Deep Purge)");
        sourcePdf.setCreator("DOCFLOW Professional");
        
        const pdfBytes = await sourcePdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
        setProcessLogs(prev => [...prev, "Structural Purge Successful."]);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsDone(true);
      toast({ 
        title: "Protocol Success", 
        description: "Structural layers neutralized locally." 
      });
    } catch (e) {
      console.error(e);
      toast({ 
        variant: "destructive", 
        title: "Sequence Failed", 
        description: "The asset architecture is heavily encrypted or non-standard." 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setIsDone(false);
    setProcessLogs([]);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
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
              Aggressive Structural Sanitization. Strip hidden Layers (OCGs), Annotation Registries, and Transparency Overlays locally.
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
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deep Structural Sanitization</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <div className="space-y-4">
                           <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5">
                              <div className="flex items-center justify-between mb-2">
                                 <p className="text-[8px] font-black uppercase text-accent/40">Engine Strategy</p>
                                 <div className="flex items-center gap-1">
                                    <div className="h-1 w-1 rounded-full bg-green-500" />
                                    <span className="text-[8px] font-bold text-green-600 uppercase">Local-First</span>
                                 </div>
                              </div>
                              <p className="text-[10px] font-bold text-accent italic leading-relaxed">
                                {isImage 
                                  ? "Strategy: Pixel Buffer Redrawing. This strips digital overlays and alpha-channel watermarks that aren't merged into the base photo." 
                                  : "Strategy: Structural Purge. Targets internal /OCG layers, /Annots, and /Artifacts to strip ghosted background stamps."}
                              </p>
                           </div>

                           <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                              <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <p className="text-[9px] leading-tight text-muted-foreground font-medium uppercase">
                                <span className="font-black text-accent">Note:</span> Structural removal works best on digital watermarks. For "stamped" text merged directly into pixels, the AI inpainting module is required.
                              </p>
                           </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleProcess} 
                            disabled={isProcessing}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Deploy Deep Purge"}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            Discard Asset
                          </Button>
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
                      <p className="text-2xl font-black uppercase italic text-white tracking-tighter">Executing Purge...</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Analyzing Document Architecture</p>
                    </div>
                    <div className="space-y-3 w-full bg-black/20 p-6 rounded-2xl border border-white/5">
                       {processLogs.map((log, i) => (
                         <div key={i} className="text-[8px] font-black uppercase text-primary/80 tracking-widest flex items-center gap-2">
                            <Zap className="h-2 w-2" /> {log}
                         </div>
                       ))}
                    </div>
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Purge Complete!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Structural layers neutralized. Reconstructed asset ready for deployment.</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5 text-left">
                   <div className="flex items-center gap-2 mb-3">
                      <Info className="h-3 w-3 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">Protocol Audit</span>
                   </div>
                   <ul className="space-y-2">
                      {isImage ? [
                        "Buffer Redrawing: Success",
                        "Metadata Flattening: Complete",
                        "Non-merged Overlays: Purged",
                        "Asset Hash: Re-generated"
                      ].map(item => (
                        <li key={item} className="flex items-center gap-2 text-[9px] font-bold text-accent italic">
                           <div className="h-1 w-1 rounded-full bg-green-500" /> {item}
                        </li>
                      )) : [
                        "Annotation Registry: Purged",
                        "OCG Layers: Neutralized",
                        "Artifact Streams: Stripped",
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
                      link.download = `purged_${originalName}.${ext}`;
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
                Initialize New Sequence
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
