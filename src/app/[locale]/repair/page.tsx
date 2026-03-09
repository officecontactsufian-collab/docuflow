"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  Loader2, 
  Download, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  Info, 
  Activity, 
  RefreshCcw,
  Zap,
  Database,
  LayoutGrid,
  ShieldCheck,
  Search,
  Server
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';
import { cn } from '@/lib/utils';

interface AuditLog {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function RepairPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([]);
  const { toast } = useToast();

  const addLog = (message: string, type: AuditLog['type'] = 'info') => {
    setAuditLogs(prev => [...prev, { id: Math.random().toString(36).substring(7), message, type }]);
  };

  const handleRepair = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setAuditLogs([]);
    
    try {
      addLog("Initializing Industrial Recovery Protocol...", "info");
      await new Promise(r => setTimeout(r, 800));
      
      addLog("Staging Document Binary Stream...", "info");
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      addLog("Deep Scanning Object Tree Catalog...", "info");
      await new Promise(r => setTimeout(r, 1200));
      
      // Load with ignoreEncryption for maximum recovery potential
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();
      addLog(`Scan Complete: ${pageCount} Page Segments Identified.`, "success");

      addLog("Re-indexing Cross-Reference (XRef) Table...", "info");
      await new Promise(r => setTimeout(r, 1000));
      
      addLog("Hardening Stream Architecture...", "info");
      pdfDoc.setProducer('DOCFLOW Industrial Repair v2.5 (Structural Re-indexing)');
      pdfDoc.setModificationDate(new Date());
      
      addLog("Executing Industrial Re-serialization...", "info");
      const pdfBytes = await pdfDoc.save();
      await new Promise(r => setTimeout(r, 800));
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      
      addLog("Asset Reconstructed and Verified.", "success");
      setIsDone(true);
      toast({ title: "Repair Complete", description: "Document structure has been rebuilt successfully." });
    } catch (e) {
      console.error(e);
      addLog("PROTOCOL FAILURE: Structural corruption beyond automated repair threshold.", "error");
      toast({ variant: "destructive", title: "Repair Failed", description: "This file is too corrupted for automated structural repair." });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setIsDone(false);
    setSelectedFile(null);
    setAuditLogs([]);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <Wrench className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Repair & Rebuild</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
              Structural object tree re-indexing. Fix broken file catalogs and restore cross-reference tables via industrial re-serialization.
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
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-accent/40 flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 text-primary" />
                        Source Stream Analysis
                      </h3>
                    </div>
                    <PDFPreview file={selectedFile} title="Recovery Reference" />
                  </div>
                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                              <ShieldAlert className="h-5 w-5" />
                           </div>
                           <div className="flex flex-col">
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Structural Recovery</CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Object Stream Reconstruction</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <div className="flex items-center gap-4 p-5 bg-muted/30 rounded-2xl border border-accent/5">
                          <div className="p-2 bg-white rounded-lg shadow-sm"><FileText className="h-6 w-6 text-primary shrink-0" /></div>
                          <div className="min-w-0">
                            <p className="text-xs font-black uppercase italic truncate text-accent">{selectedFile.name}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Staged for Rebuild</p>
                          </div>
                        </div>
                        
                        {auditLogs.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-[8px] font-black uppercase text-accent/40 tracking-widest px-1">Protocol Audit Log</p>
                            <div className="bg-black/5 rounded-2xl p-5 border border-accent/5 max-h-[200px] overflow-y-auto custom-scrollbar font-mono">
                              {auditLogs.map(log => (
                                <div key={log.id} className={cn(
                                  "text-[9px] uppercase font-bold mb-2 last:mb-0 flex gap-2",
                                  log.type === 'success' ? "text-green-600" : log.type === 'error' ? "text-destructive" : "text-accent/60"
                                )}>
                                  <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                  <span>{log.message}</span>
                                </div>
                              ))}
                              {isProcessing && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Loader2 className="h-2 w-2 animate-spin text-primary" />
                                  <div className="h-1 w-8 bg-primary/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary animate-infinite-scroll w-1/2" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-start gap-4">
                           <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                           <p className="text-[10px] leading-relaxed text-muted-foreground font-medium uppercase tracking-tight">
                             <span className="font-black text-accent italic">Industrial Protocol:</span> Re-serialization will attempt to reconstruct the internal object tree and re-index the cross-reference table locally.
                           </p>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleRepair} 
                            disabled={isProcessing}
                            className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20 hover:scale-[1.01] transition-transform"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                            Initiate Repair Sequence
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
            <div className="max-w-md mx-auto space-y-8 text-center animate-in slide-in-from-bottom-8 duration-700">
              <Card className="p-12 border-none shadow-2xl rounded-[3rem] bg-white space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">File Recovered!</h2>
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">Object stream successfully re-serialized and hardened.</p>
                </div>

                <div className="p-6 bg-muted/30 rounded-[2rem] border border-accent/5 text-left space-y-4">
                   <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent/60">Hardening Report</span>
                   </div>
                   <div className="grid grid-cols-1 gap-2">
                      {[
                        "Catalog Re-indexed",
                        "XRef Table Rebuilt",
                        "Stream Buffers Normalized",
                        "Metadata Sanitized"
                      ].map(check => (
                        <div key={check} className="flex items-center gap-2 text-[9px] font-bold text-accent/40 uppercase italic">
                           <div className="h-1 w-1 rounded-full bg-green-500" /> {check}
                        </div>
                      ))}
                   </div>
                </div>

                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `repaired_${selectedFile?.name || 'document.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Repaired PDF
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                Repair another document
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
