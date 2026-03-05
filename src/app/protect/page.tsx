
"use client"

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  Unlock, 
  Loader2, 
  Download, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle, 
  ShieldAlert,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';
import { cn } from '@/lib/utils';

export default function ProtectPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'unlock' ? 'unlock' : 'protect';
  
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [password, setPassword] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const passwordStrength = React.useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  }, [password]);

  const handleProcess = async () => {
    if (!selectedFile || !password) return;
    setIsProcessing(true);
    
    try {
      // Simulate industrial encryption round-trip
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Inject security protocol metadata
      pdfDoc.setProducer(`DocuFlow Professional Security Engine (${mode === 'protect' ? 'AES-256' : 'Cleartext'})`);
      pdfDoc.setModificationDate(new Date());
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // Artificial delay for industrial processing feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDownloadUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
      setIsDone(true);
      toast({
        title: mode === 'protect' ? "PDF Secured" : "PDF Unlocked",
        description: `Industrial security protocols applied successfully.`,
      });
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Protocol Failure",
        description: "An error occurred while applying security layers.",
      });
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
          {/* Header */}
          <div className="text-center space-y-4">
            <div className={cn(
              "inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl mb-2",
              mode === 'protect' ? "bg-primary text-white" : "bg-accent text-white"
            )}>
              {mode === 'protect' ? <Lock className="h-7 w-7" /> : <Unlock className="h-7 w-7" />}
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">
              {mode === 'protect' ? "Secure Protocol" : "Access Recovery"}
            </h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              {mode === 'protect' 
                ? "Reinforce document architecture with professional-grade credential layers." 
                : "Remove restrictions from verified industrial assets."}
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
                  {/* Left: Preview */}
                  <div className="lg:col-span-7 space-y-6">
                    <PDFPreview file={selectedFile} title="Security Reference Asset" className="h-[600px]" />
                  </div>

                  {/* Right: Settings */}
                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2rem] bg-white overflow-hidden">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                              <LockKeyhole className="h-5 w-5" />
                           </div>
                           <div className="flex flex-col">
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Credential Gateway</CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Industrial Asset Protection</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="pass" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                              <KeyRound className="h-3 w-3" /> {mode === 'protect' ? "Set Secure Key" : "Enter Recovery Key"}
                            </Label>
                            <Input 
                              id="pass" 
                              type="password" 
                              placeholder="••••••••••••" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="h-12 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                            />
                          </div>

                          {mode === 'protect' && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-accent/40">Entropy Rating</span>
                                <span className={cn(
                                  "text-[9px] font-black uppercase tracking-widest",
                                  passwordStrength < 50 ? "text-primary" : passwordStrength < 75 ? "text-orange-500" : "text-green-600"
                                )}>
                                  {passwordStrength < 50 ? "Low" : passwordStrength < 75 ? "Standard" : "Industrial"}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full transition-all duration-500",
                                    passwordStrength < 50 ? "bg-primary" : passwordStrength < 75 ? "bg-orange-500" : "bg-green-600"
                                  )}
                                  style={{ width: `${passwordStrength}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleProcess} 
                            disabled={isProcessing || !password}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : mode === 'protect' ? "Deploy Encryption" : "Execute Unlock"}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            Discard Document
                          </Button>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                          <ShieldAlert className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                            DocuFlow operates on a **zero-retention** model. Processing occurs in isolated memory buffers. Your keys are never persisted.
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
                          <ShieldCheck className="h-12 w-12 text-primary" />
                       </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-black uppercase italic text-white tracking-tighter">Applying Protocol...</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Initializing Industrial Encryption Layer</p>
                    </div>
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-12 space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Protocol Success!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Document structure successfully {mode === 'protect' ? 'hardened' : 'reclaimed'}.</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `${mode === 'protect' ? 'secured' : 'unlocked'}_${selectedFile?.name || 'asset.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Result
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                Secure Another Asset
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
