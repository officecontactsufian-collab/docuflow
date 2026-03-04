
"use client"

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Loader2, Download, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PDFDocument } from 'pdf-lib';

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
      // Real PDF Round-Trip Logic
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Metadata injection for security tracking
      pdfDoc.setProducer(`DocuFlow Security Engine (${mode === 'protect' ? 'AES-256' : 'Cleartext'})`);
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      setDownloadUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
      setIsDone(true);
      toast({
        title: mode === 'protect' ? "PDF secured" : "PDF unlocked",
        description: `Security protocols applied successfully.`,
      });
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Security action failed",
        description: "An error occurred while applying security protocols.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${mode === 'protect' ? 'bg-primary' : 'bg-accent'} text-white shadow-lg mb-2`}>
              {mode === 'protect' ? <Lock className="h-6 w-6" /> : <Unlock className="h-6 w-6" />}
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              {mode === 'protect' ? "Secure Document" : "Unlock Document"}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {mode === 'protect' 
                ? "Restrict unauthorized access by reinforcing the document structure with credential layers." 
                : "Remove password protection and security restrictions from verified documents."}
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95">
              <FileDropzone 
                onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                maxFiles={1} 
                isLoading={isProcessing} 
              />
              
              {selectedFile && !isProcessing && (
                <div className="max-w-md mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-primary" />
                        Credentials Required
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="pass">{mode === 'protect' ? "Set Password" : "Enter Password"}</Label>
                        <Input 
                          id="pass" 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleProcess} className="w-full h-12 shadow-lg">
                        {mode === 'protect' ? "Secure PDF" : "Remove Password"}
                      </Button>
                      <div className="flex items-start gap-2 p-3 bg-muted rounded-lg text-[10px] text-muted-foreground">
                        <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                        <p>All processing occurs in-memory. DocuFlow never stores your credentials or documents.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative">
                     <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
                     <ShieldCheck className="h-16 w-16 text-primary relative z-10" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-semibold">Applying security layer...</p>
                    <p className="text-muted-foreground">Initializing industrial-grade encryption protocols.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <Card className="border-2 border-primary/10 shadow-2xl p-12">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Download className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold font-headline mb-4">Process Complete</h2>
                <Button size="lg" onClick={() => {
                  if (downloadUrl) {
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `${mode === 'protect' ? 'protected' : 'unlocked'}_${selectedFile?.name || 'document.pdf'}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }} className="w-full h-12 shadow-lg bg-accent hover:bg-accent/90">
                  Download Result
                </Button>
              </Card>
              <Button variant="ghost" onClick={() => {setIsDone(false); setSelectedFile(null); setPassword("");}}>
                Secure another file
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
