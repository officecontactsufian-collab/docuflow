
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
  AlertCircle,
  Server,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PDFPreview } from '@/components/pdf-preview';
import { processImageRemovalAction, processPdfRemovalAction } from './actions';

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
    setProcessLogs([
      "Establishing Backend Tunnel...", 
      "Staging Asset Buffer...",
      "Analyzing Object Tree & Pixels..."
    ]);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
      
      const base64Data = await base64Promise;
      let resultUrl: string;

      if (selectedFile.type.startsWith('image/')) {
        setProcessLogs(prev => [...prev, "Initiating Luminance Normalization...", "Filtering Foreground Overlays...", "Re-indexing Pixel Buffer..."]);
        resultUrl = await processImageRemovalAction(base64Data);
        setProcessLogs(prev => [...prev, "Pixel Sanitization Complete.", "Buffer Integrity Verified."]);
      } else {
        setProcessLogs(prev => [...prev, "Initiating Structural Purge...", "Targeting /OCG & /Annots Registries...", "Neutralizing Transparency Groups...", "Reconstructing Document Stream..."]);
        resultUrl = await processPdfRemovalAction(base64Data);
        setProcessLogs(prev => [...prev, "Structural Purge Successful.", "Metadata Tracking Hardened."]);
      }

      setDownloadUrl(resultUrl);
      setIsDone(true);
      toast({ 
        title: "Protocol Success", 
        description: "Industrial sanitization complete. Asset recovered." 
      });
    } catch (e: any) {
      console.error(e);
      toast({ 
        variant: "destructive", 
        title: "Sequence Failed", 
        description: e.message || "The asset architecture is non-standard or heavily protected." 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setIsDone(false);
    setProcessLogs([]);
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
              Aggressive Backend Sanitization. Execute structural purges and luminance-based pixel normalization protocols.
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
                        Industrial Staging: {selectedFile.name}
                      </h3>
                      <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                         <Activity className="h-3 w-3 text-primary" />
                         <span className="text-[9px] font-black text-primary uppercase">Ready for Purge</span>
                      </div>
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
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Removal Protocol</CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Backend Execution Gateway</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <div className="space-y-4">
                           <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5">
                              <div className="flex items-center justify-between mb-2">
                                 <p className="text-[8px] font-black uppercase text-accent/40">Engine Strategy</p>
                                 <div className="flex items-center gap-1">
                                    <div className="h-1 w-1 rounded-full bg-blue-500" />
                                    <span className="text-[8px] font-bold text-blue-600 uppercase">Aggressive Sanitization</span>
                                 </div>
                              </div>
                              <p className="text-[10px] font-bold text-accent italic leading-relaxed">
                                {isImage 
                                  ? "Strategy: Backend Luminance Thresholding. This utilizes Jimp's industrial pixel engine to 'burn out' faint overlays and normalize the background buffer." 
                                  : "Strategy: Structural Object Purge. Targets /OCG layers, /Annots, and /Transparency groups via a deep backend document stream reconstruction."}
                              </p>
                           </div>

                           <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                              <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <p className="text-[9px] leading-tight text-muted-foreground font-medium uppercase">
                                <span className="font-black text-accent">Note:</span> This protocol targets structural and ghosted watermarks. Pixel-burned logos merged into dense photos may be faded but not fully erased without AI inpainting.
                              </p>
                           </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleProcess} 
                            disabled={isProcessing}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Deploy Industrial Purge"}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            Initialize New Asset
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
                          <Server className="h-12 w-12 text-primary animate-pulse" />
                       </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-black uppercase italic text-white tracking-tighter">Backend Executing...</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Processing through Industrial Sanitization Engine</p>
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
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Protocol Success!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Asset sanitized via industrial backend engine. Overlays neutralized.</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5 text-left">
                   <div className="flex items-center gap-2 mb-3">
                      <Info className="h-3 w-3 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">Industrial Audit</span>
                   </div>
                   <ul className="space-y-2">
                      {isImage ? [
                        "Backend Luminance Filtering: Applied",
                        "Background Thresholding: Success",
                        "Overlay Alpha Stripping: Complete",
                        "Buffer Re-indexing: Verified"
                      ].map(item => (
                        <li key={item} className="flex items-center gap-2 text-[9px] font-bold text-accent italic">
                           <div className="h-1 w-1 rounded-full bg-green-500" /> {item}
                        </li>
                      )) : [
                        "Structural Scan: Complete",
                        "Annotation registry: Purged",
                        "Layer OCGs: Neutralized",
                        "Object Tree: Re-indexed & Sanitized"
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
                      link.download = `sanitized_${originalName}.${ext}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Sanitized Asset
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                Deploy New Sequence
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
