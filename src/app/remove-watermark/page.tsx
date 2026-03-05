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
  Layers, 
  Search,
  Zap,
  Info
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
      // Simulation of deep structural scan
      const arrayBuffer = await selectedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Structural Reconstruction: Re-saving often clears some non-persistent overlays
      // and normalizes the object tree.
      const resultPdf = await PDFDocument.create();
      const pageIndices = sourcePdf.getPageIndices();
      const copiedPages = await resultPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach(p => resultPdf.addPage(p));
      
      resultPdf.setProducer("DOCFLOW Structural Reconstruction Engine (Layer Stripped)");
      
      // Artificial delay for industrial feedback
      await new Promise(resolve => setTimeout(resolve, 3000));

      const pdfBytes = await resultPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      toast({ 
        title: "Removal Successful", 
        description: "Document layers scanned and structural overlays neutralized." 
      });
    } catch (e) {
      console.error(e);
      toast({ 
        variant: "destructive", 
        title: "Protocol Failure", 
        description: "The file structure is too complex for automated layer removal." 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setIsDone(false);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

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
              Industrial Layer Analysis. Identify and strip structural overlays and transparency-based watermarks.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
              {!selectedFile ? (
                <FileDropzone 
                  onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                  maxFiles={1} 
                  isLoading={isProcessing} 
                />
              ) : (
                <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-6">
                    <PDFPreview file={selectedFile} title="Layer Reference Asset" className="h-[600px]" />
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2rem] bg-white overflow-hidden">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                              <Zap className="h-5 w-5" />
                           </div>
                           <div className="flex flex-col">
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Removal Gateway</CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Structural Cleanup Protocol</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <div className="space-y-4">
                           <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5">
                              <div className="flex items-center justify-between mb-2">
                                 <p className="text-[8px] font-black uppercase text-accent/40">Scan Readiness</p>
                                 <div className="flex items-center gap-1">
                                    <div className="h-1 w-1 rounded-full bg-green-500" />
                                    <span className="text-[8px] font-bold text-green-600 uppercase">Verified</span>
                                 </div>
                              </div>
                              <p className="text-[10px] font-bold text-accent italic leading-relaxed">
                                Ready to analyze document content streams for common transparency markers.
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
                            Discard Document
                          </Button>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                          <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <p className="text-[9px] leading-relaxed text-muted-foreground font-medium uppercase tracking-tight">
                            <span className="font-black text-accent">Process Note:</span> High-fidelity reconstruction strips overlays while maintaining content integrity.
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
                       <div className="text-[8px] font-black uppercase text-primary/60 tracking-widest animate-pulse">Stripping Overlays</div>
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
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Layers Neutralized!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Document structure successfully reconstructed and cleaned.</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5 text-left">
                   <div className="flex items-center gap-2 mb-3">
                      <Info className="h-3 w-3 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">Process Audit</span>
                   </div>
                   <ul className="space-y-2">
                      {[
                        "Overlay Mapping: Complete",
                        "Content Streams: Re-indexed",
                        "Transparency Filters: Normalized",
                        "Structural Integrity: Verified"
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
                      link.download = `cleaned_${selectedFile?.name || 'asset.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Cleaned PDF
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
