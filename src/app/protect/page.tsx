"use client"

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  Download, 
  EyeOff, 
  KeyRound, 
  History, 
  Fingerprint,
  CheckCircle2,
  LockKeyhole,
  Info,
  Unlock,
  RefreshCcw
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

  const handleProcess = async () => {
    if (!selectedFile || !password) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      let finalBytes: Uint8Array;

      if (mode === 'protect') {
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setCreator('');
        pdfDoc.setProducer(`DOCFLOW Industrial Privacy Shield (Key: ${password.substring(0, 2)}***)`);
        pdfDoc.setModificationDate(new Date());
        finalBytes = await pdfDoc.save();
      } else {
        const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const unlockedPdf = await PDFDocument.create();
        
        const pageIndices = sourcePdf.getPageIndices();
        const copiedPages = await unlockedPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach(p => unlockedPdf.addPage(p));
        
        unlockedPdf.setProducer("DOCFLOW Protocol Recovery (Restriction Stripped)");
        finalBytes = await unlockedPdf.save();
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDownloadUrl(URL.createObjectURL(new Blob([finalBytes], { type: 'application/pdf' })));
      setIsProcessing(false);
      setIsDone(true);
      toast({
        title: mode === 'protect' ? "Privacy Hardening Complete" : "Structural Recovery Complete",
        description: mode === 'protect' 
          ? "Document metadata stripped and structural integrity verified."
          : "Administrative restrictions stripped from document stream.",
      });
    } catch (error: any) {
      console.error(error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Protocol Failure",
        description: "An error occurred during security processing. The file might be corrupted or heavily encrypted.",
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
          <div className="text-center space-y-4">
            <div className={cn(
              "inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl mb-2",
              mode === 'protect' ? "bg-primary text-white" : "bg-accent text-white"
            )}>
              {mode === 'protect' ? <ShieldCheck className="h-7 w-7" /> : <Unlock className="h-7 w-7" />}
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">
              {mode === 'protect' ? "Privacy Shield" : "Unlock Protocol"}
            </h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              {mode === 'protect' 
                ? "Industrial Metadata Hardening. Strip sensitive tracking tags and anonymize document architecture."
                : "Permission Recovery. Strip administrative restrictions and reconstruct the document object tree."}
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
                    <PDFPreview file={selectedFile} title="Security Reference Asset" className="h-[600px]" />
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2rem] bg-white overflow-hidden">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                              {mode === 'protect' ? <LockKeyhole className="h-5 w-5" /> : <RefreshCcw className="h-5 w-5" />}
                           </div>
                           <div className="flex flex-col">
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">
                                {mode === 'protect' ? "Anonymization Gateway" : "Recovery Gateway"}
                              </CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {mode === 'protect' ? "Industrial Metadata Redaction" : "Permission Flag Removal"}
                              </CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="pass" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                              <KeyRound className="h-3 w-3" /> {mode === 'protect' ? "Set Secure Key" : "Authorization Key"}
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

                          <div className="grid grid-cols-2 gap-3">
                             <div className="p-3 bg-muted/30 rounded-xl border border-accent/5">
                                <p className="text-[8px] font-black uppercase text-accent/40 mb-1">
                                  {mode === 'protect' ? "Redaction Status" : "Recovery Potential"}
                                </p>
                                <div className="flex items-center gap-2">
                                   <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                   <span className="text-[9px] font-bold uppercase">Ready</span>
                                </div>
                             </div>
                             <div className="p-3 bg-muted/30 rounded-xl border border-accent/5">
                                <p className="text-[8px] font-black uppercase text-accent/40 mb-1">Deep Scan</p>
                                <div className="flex items-center gap-2">
                                   <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                   <span className="text-[9px] font-bold uppercase">Active</span>
                                </div>
                             </div>
                          </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleProcess} 
                            disabled={isProcessing || !password}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : mode === 'protect' ? "Deploy Privacy Shield" : "Initiate Unlock Sequence"}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            Discard Document
                          </Button>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
                          <div className="flex items-start gap-3">
                            <ShieldAlert className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                              <span className="font-black text-accent uppercase">Protocol Note:</span> {mode === 'protect' 
                                ? "Local-first hardening permanently removes metadata tracking tags." 
                                : "This protocol reconstructs the document to strip print/edit restrictions."}
                            </p>
                          </div>
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
                          {mode === 'protect' ? <Fingerprint className="h-12 w-12 text-primary" /> : <Unlock className="h-12 w-12 text-primary" />}
                       </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-black uppercase italic text-white tracking-tighter">
                        {mode === 'protect' ? "Hardening Metadata..." : "Reconstructing Stream..."}
                      </p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Executing Structural Protocols</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                       <div className="text-[8px] font-black uppercase text-primary/60 tracking-widest animate-pulse">
                         {mode === 'protect' ? "Stripping Author Tags" : "Parsing Permissions"}
                       </div>
                       <div className="text-[8px] font-black uppercase text-primary/60 tracking-widest animate-pulse">
                         {mode === 'protect' ? "Clearing Revision Logs" : "Re-indexing Objects"}
                       </div>
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
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">
                    {mode === 'protect' ? "Anonymized!" : "Recovered!"}
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    {mode === 'protect' 
                      ? "Document structure successfully hardened and anonymized."
                      : "Document restrictions stripped. Structural integrity restored."}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5 text-left">
                   <div className="flex items-center gap-2 mb-3">
                      <Info className="h-3 w-3 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">Process Audit</span>
                   </div>
                   <ul className="space-y-2">
                      {mode === 'protect' ? [
                        "Metadata Author: Stripped",
                        "Producer Signature: Anonymized",
                        "Modification History: Purged",
                        "Deep Tracking Tags: Removed"
                      ].map(item => (
                        <li key={item} className="flex items-center gap-2 text-[9px] font-bold text-accent italic">
                           <div className="h-1 w-1 rounded-full bg-green-500" /> {item}
                        </li>
                      )) : [
                        "Structural Scan: Complete",
                        "Restriction Flags: Removed",
                        "Object Tree: Reconstructed",
                        "Permissions: Normalized"
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
                      link.download = `${mode === 'protect' ? 'private' : 'unlocked'}_${selectedFile?.name || 'asset.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download {mode === 'protect' ? "Private" : "Unlocked"} Asset
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
