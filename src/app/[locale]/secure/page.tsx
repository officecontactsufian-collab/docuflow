"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  Loader2, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle,
  RefreshCcw,
  Fingerprint,
  X,
  ShieldAlert
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { encryptPdfAction } from './actions';
import { PDFPreview } from '@/components/pdf-preview';
import { cn } from '@/lib/utils';

export default function SecurePage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [password, setPassword] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleEncrypt = async () => {
    if (!selectedFile || !password) {
      toast({
        variant: "destructive",
        title: "Authorization Key Required",
        description: "The protocol requires a secure key to initialize the hardening sequence.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(selectedFile);
      });
      
      const base64Data = await base64Promise;
      const resultUrl = await encryptPdfAction(base64Data, password);
      
      setDownloadUrl(resultUrl);
      setIsDone(true);
      toast({
        title: "Hardening Complete",
        description: "Document architecture structurally hardened and metadata purged.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Protocol Error",
        description: e.message || "The industrial hardening sequence failed to initialize.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setIsDone(false);
    setSelectedFile(null);
    setPassword("");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Industrial Hardening</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              Structural Metadata Anonymization. Mandatory key encryption for high-fidelity document protection.
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
                    <PDFPreview file={selectedFile} title="Security Reference Asset" className="h-[650px]" />
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2rem] bg-white overflow-hidden">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                              <KeyRound className="h-5 w-5" />
                           </div>
                           <div className="flex flex-col">
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Security Gateway</CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Authorization & Identity Salt</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="pass" className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                              <Lock className="h-3 w-3 text-primary" /> Authorization Key
                            </Label>
                            <Input 
                              id="pass" 
                              type="password" 
                              placeholder="SET SECURE KEY..." 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="h-12 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                            />
                            <p className="text-[8px] font-bold text-accent/40 uppercase tracking-widest italic">
                              * This key is used as a deterministic salt for structural metadata scrambling.
                            </p>
                          </div>

                          <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-start gap-4">
                            <ShieldAlert className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <p className="text-[10px] leading-relaxed text-muted-foreground font-medium uppercase tracking-tight">
                              <span className="font-black text-accent italic">Industrial Protocol:</span> Hardening rebuilds the document object tree and permanently purges tracking tags.
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleEncrypt} 
                            disabled={isProcessing || !password}
                            className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Deploy Hardening"}
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

              {isProcessing && (
                <div className="fixed inset-0 z-50 bg-accent/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in">
                  <div className="flex flex-col items-center gap-8 text-center max-w-sm">
                    <div className="relative">
                       <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                       <div className="h-24 w-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10">
                          <Fingerprint className="h-12 w-12 text-primary" />
                       </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-black uppercase italic text-white tracking-tighter">Executing Hardening...</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Scrambling Registry & Rebuilding Tree</p>
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
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Asset Hardened!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Structure reconstructed and metadata registries purged.</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5 text-left">
                   <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-3 w-3 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">Execution Summary</span>
                   </div>
                   <p className="text-[10px] font-bold text-accent/40 uppercase tracking-tight italic">
                     Identity Salt: Embedded • Metadata: Purged • Objects: Verified
                   </p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `hardened_${selectedFile?.name || 'asset.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Hardened PDF
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                <RefreshCcw className="mr-2 h-3 w-3" /> Initialize New Sequence
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
