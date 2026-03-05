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
  Activity,
  Image as ImageIcon,
  Zap,
  Trash2,
  Server,
  Layers,
  Eye,
  ArrowRight,
  RefreshCcw,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { processBackgroundRemovalAction } from './actions';
import { cn } from '@/lib/utils';

interface StagedFile {
  id: string;
  file: File;
  originalUrl: string;
  status: 'staging' | 'processing' | 'done' | 'failed';
  resultUrl?: string;
  logs: string[];
}

export default function RemoveBackgroundPage() {
  const [stagedFiles, setStagedFiles] = React.useState<StagedFile[]>([]);
  const { toast } = useToast();

  const processFile = async (staged: StagedFile) => {
    updateFileStatus(staged.id, 'processing', [
      "Initiating AI Subject Isolation...", 
      "Analyzing Visual Hierarchy...",
      "Synthesizing High-Contrast Green Screen..."
    ]);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(staged.file);
      });
      
      const base64Data = await base64Promise;
      
      const resultUrl = await processBackgroundRemovalAction(base64Data);
      
      updateFileStatus(staged.id, 'done', [
        "AI Subject Isolation Complete.",
        "Executing Chroma-Keying Sequence...", 
        "Executing Edge-Normalization...",
        "Asset Sanitized & Reconstructed."
      ], resultUrl);
      
      toast({
        title: "Isolation Complete",
        description: `Successfully isolated subject for ${staged.file.name}.`,
      });
    } catch (e: any) {
      console.error(e);
      let errorMsg = "Industrial isolation sequence interrupted.";
      if (e.message?.includes('Body exceeded')) {
        errorMsg = "File size exceeds 100MB processing limits.";
      }
      updateFileStatus(staged.id, 'failed', ["Sequence Failed.", errorMsg]);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: errorMsg,
      });
    }
  };

  const updateFileStatus = (id: string, status: StagedFile['status'], logEntries: string[], resultUrl?: string) => {
    setStagedFiles(prev => prev.map(f => {
      if (f.id === id) {
        return { 
          ...f, 
          status, 
          resultUrl: resultUrl || f.resultUrl, 
          logs: [...f.logs, ...logEntries] 
        };
      }
      return f;
    }));
  };

  const handleFilesSelected = (files: File[]) => {
    const newStaged = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      originalUrl: URL.createObjectURL(file),
      status: 'staging' as const,
      logs: ["Asset Staged for AI-Assisted Isolation."]
    }));
    
    setStagedFiles(prev => [...prev, ...newStaged]);
    newStaged.forEach(staged => processFile(staged));
  };

  const removeFile = (id: string) => {
    setStagedFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.originalUrl);
      return prev.filter(f => f.id !== id);
    });
  };

  React.useEffect(() => {
    return () => {
      stagedFiles.forEach(f => URL.revokeObjectURL(f.originalUrl));
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <Sparkles className="h-7 w-7 text-primary fill-primary/20" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">AI Background Isolation</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              Professional Subject Extraction. AI-assisted isolation with backend chroma-keying for high-fidelity alpha transparency.
            </p>
          </div>

          <div className="space-y-12">
            <FileDropzone 
              onFilesSelected={handleFilesSelected} 
              maxFiles={10} 
              accept="image/png,image/jpeg"
              isHero={stagedFiles.length === 0}
            />

            {stagedFiles.length > 0 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40 flex items-center gap-2">
                    <Activity className="h-3 w-3" /> Isolation Stream ({stagedFiles.length} Assets)
                  </h3>
                </div>

                <div className="grid gap-10">
                  {stagedFiles.map((staged) => (
                    <Card key={staged.id} className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden group border-2 border-transparent hover:border-primary/10 transition-all">
                      <div className="flex flex-col">
                        <div className="p-6 border-b border-accent/5 flex items-center justify-between bg-muted/5">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase italic truncate text-accent">{staged.file.name}</p>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{(staged.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {staged.status === 'processing' ? (
                              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span className="text-[9px] font-black uppercase">Isolating Subject...</span>
                              </div>
                            ) : staged.status === 'done' ? (
                              <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100">
                                <CheckCircle2 className="h-3 w-3" />
                                <span className="text-[9px] font-black uppercase">Success</span>
                              </div>
                            ) : staged.status === 'failed' ? (
                              <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1 rounded-full">
                                <span className="text-[9px] font-black uppercase">Failed</span>
                              </div>
                            ) : null}
                            <Button variant="ghost" size="icon" onClick={() => removeFile(staged.id)} className="h-10 w-10 rounded-xl text-accent/20 hover:text-destructive hover:bg-destructive/5 transition-all">
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-px bg-accent/5">
                          {/* Original Image */}
                          <div className="p-8 bg-white space-y-6">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-accent/40 flex items-center gap-2">
                                <Eye className="h-3 w-3" /> Source Asset
                              </h4>
                            </div>
                            <div className="aspect-square rounded-3xl overflow-hidden bg-muted/20 border border-accent/5 relative shadow-inner group/preview">
                              <img 
                                src={staged.originalUrl} 
                                className="w-full h-full object-contain p-4" 
                                alt="Original"
                              />
                              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/preview:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                          </div>

                          {/* Result Image */}
                          <div className="p-8 bg-white space-y-6 border-l border-accent/5">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-accent/40 flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3" /> Sanitized Result
                              </h4>
                            </div>
                            <div className={cn(
                              "aspect-square rounded-3xl overflow-hidden border border-accent/5 relative shadow-inner group/preview bg-[url('https://placehold.co/20x20/F0F0F0/E0E0E0?text=')] bg-repeat",
                              staged.status !== 'done' && "bg-none bg-muted/10"
                            )}>
                              {staged.status === 'done' ? (
                                <img 
                                  src={staged.resultUrl} 
                                  className="w-full h-full object-contain p-4 animate-in zoom-in-95 duration-500" 
                                  alt="Result"
                                />
                              ) : staged.status === 'processing' ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-xl relative z-10">
                                      <Server className="h-8 w-8 text-primary animate-pulse" />
                                    </div>
                                  </div>
                                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40 italic">AI Isolation Phase...</p>
                                </div>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                  <ImageIcon className="h-20 w-20" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="p-8 bg-muted/10 grid lg:grid-cols-2 gap-8 border-t border-accent/5">
                          <div className="space-y-3">
                            <p className="text-[8px] font-black uppercase text-accent/40 tracking-widest">Process Audit Log</p>
                            <div className="bg-black/5 p-5 rounded-3xl space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar border border-accent/5">
                              {staged.logs.map((log, i) => (
                                <div key={i} className="text-[9px] font-bold uppercase text-accent/60 flex items-center gap-3">
                                  <Zap className="h-2.5 w-2.5 text-primary" /> {log}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col justify-end gap-4">
                            {staged.status === 'done' ? (
                              <div className="space-y-4">
                                <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-start gap-4">
                                  <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                                  <div className="space-y-1">
                                    <p className="text-xs font-black text-accent uppercase tracking-wider italic">Asset Verified</p>
                                    <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">
                                      AI subject isolation complete. Chroma-keying has embedded true alpha-channel transparency.
                                    </p>
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = staged.resultUrl!;
                                    link.download = `isolated_${staged.file.name.split('.')[0]}.png`;
                                    link.click();
                                  }}
                                  className="w-full h-16 rounded-[1.5rem] bg-accent text-white font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-accent/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                                >
                                  <Download className="mr-2 h-4 w-4" /> Download Isolated PNG
                                </Button>
                              </div>
                            ) : staged.status === 'failed' ? (
                              <Button 
                                onClick={() => processFile(staged)}
                                variant="outline"
                                className="w-full h-16 rounded-[1.5rem] border-destructive/20 text-destructive font-black uppercase tracking-widest text-[11px]"
                              >
                                <RefreshCcw className="mr-2 h-4 w-4" /> Retry Protocol
                              </Button>
                            ) : (
                              <div className="flex items-center gap-3 p-6 bg-white/50 rounded-[2rem] border border-accent/5">
                                <Loader2 className="h-5 w-5 text-primary animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent/40 italic">Waiting for AI Subject Mapping...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-10 bg-accent/5 rounded-[3rem] border border-accent/10 flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto text-center md:text-left">
            <div className="p-5 bg-white rounded-3xl shadow-xl">
               <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-black uppercase tracking-widest text-accent italic flex items-center justify-center md:justify-start gap-2">
                Industrial AI Isolation Protocol <ArrowRight className="h-3 w-3 text-primary" />
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-bold uppercase tracking-tight max-w-2xl">
                DOCFLOW executes a dual-phase isolation sequence. First, Gemini 2.5 Flash maps the primary subject 
                against a high-contrast green screen. Second, the backend chroma-keying engine strips the screen 
                frequencies to deliver a clean, transparent PNG asset.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
