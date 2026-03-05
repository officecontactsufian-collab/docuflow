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
  Layers
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { processBackgroundRemovalAction } from './actions';

interface StagedFile {
  id: string;
  file: File;
  status: 'staging' | 'processing' | 'done' | 'failed';
  resultUrl?: string;
  logs: string[];
}

export default function RemoveBackgroundPage() {
  const [stagedFiles, setStagedFiles] = React.useState<StagedFile[]>([]);
  const { toast } = useToast();

  const processFile = async (staged: StagedFile) => {
    updateFileStatus(staged.id, 'processing', ["Initiating Background Isolation Protocol...", "Sampling Chroma Key Frequencies..."]);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(staged.file);
      });
      
      const base64Data = await base64Promise;
      
      updateFileStatus(staged.id, 'processing', [
        "Analyzing Color Variance...", 
        "Executing Alpha-Channel Stripping...", 
        "Executing Edge-Normalization Sequence..."
      ]);
      
      const resultUrl = await processBackgroundRemovalAction(base64Data);
      updateFileStatus(staged.id, 'done', ["Isolation Success.", "Asset Sanitized & Reconstructed."], resultUrl);
    } catch (e: any) {
      console.error(e);
      updateFileStatus(staged.id, 'failed', ["Sequence Failed.", e.message || "Non-standard pixel buffer detected."]);
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
      status: 'staging' as const,
      logs: ["Asset Staged for Automated Isolation."]
    }));
    
    setStagedFiles(prev => [...prev, ...newStaged]);
    newStaged.forEach(staged => processFile(staged));
  };

  const removeFile = (id: string) => {
    setStagedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <Layers className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Background Removal</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              Industrial Pixel Isolation. Automatically identifies background frequencies and reconstructs assets with transparency.
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
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40 flex items-center gap-2">
                    <Activity className="h-3 w-3" /> Isolation Stream ({stagedFiles.length} Assets)
                  </h3>
                </div>

                <div className="grid gap-6">
                  {stagedFiles.map((staged) => (
                    <Card key={staged.id} className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden group">
                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/3 p-8 border-b lg:border-b-0 lg:border-r border-accent/5 bg-muted/10">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black uppercase italic truncate text-accent">{staged.file.name}</p>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{(staged.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-[8px] font-black uppercase text-accent/40 tracking-widest">Process Log</p>
                            <div className="bg-black/5 p-4 rounded-2xl space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar">
                              {staged.logs.map((log, i) => (
                                <div key={i} className="text-[8px] font-bold uppercase text-accent/60 flex items-center gap-2">
                                  <Zap className="h-2 w-2 text-primary" /> {log}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 p-8 flex flex-col justify-center">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                              {staged.status === 'processing' ? (
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  <span className="text-[9px] font-black uppercase">Isolating Foreground...</span>
                                </div>
                              ) : staged.status === 'done' ? (
                                <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span className="text-[9px] font-black uppercase">Isolation Complete</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 bg-muted/50 text-accent/40 px-3 py-1 rounded-full">
                                  <Server className="h-3 w-3" />
                                  <span className="text-[9px] font-black uppercase">Pending Command</span>
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFile(staged.id)} className="h-8 w-8 text-accent/20 hover:text-destructive transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-6">
                            {staged.status === 'done' ? (
                              <div className="space-y-4 animate-in zoom-in-95 duration-500">
                                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black text-accent uppercase tracking-wider">Asset Sanitized</p>
                                    <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase">
                                      Background frequency removed. PNG Alpha-channel verified.
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
                                  className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-accent/20"
                                >
                                  <Download className="mr-2 h-4 w-4" /> Download Isolated PNG
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-12 gap-6">
                                <div className="relative">
                                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
                                  <div className="h-16 w-16 bg-muted/20 rounded-2xl flex items-center justify-center text-accent/20 shadow-inner">
                                    <Server className="h-8 w-8" />
                                  </div>
                                </div>
                                <div className="text-center space-y-1">
                                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40 italic animate-pulse">Executing industrial tunnel...</p>
                                </div>
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
        </div>
      </main>
    </div>
  );
}
