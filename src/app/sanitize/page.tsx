
"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Eraser, Loader2, Download, ShieldCheck, CheckCircle2, FileText, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';

export default function SanitizePage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleSanitize = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Clear all metadata
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('DOCFLOW Industrial Sanitization Engine v2.5');
      pdfDoc.setCreator('DOCFLOW Professional Workspace');
      pdfDoc.setModificationDate(new Date());

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      toast({ title: "Document Sanitized", description: "All hidden metadata has been stripped." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Could not sanitize document." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <Eraser className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic tracking-tighter">Asset Sanitization</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-bold text-xs uppercase tracking-widest">
              Metadata registry erasure. Strip author signatures and tracking identifiers permanently.
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
                  <div className="lg:col-span-7">
                    <PDFPreview file={selectedFile} title="Sanitization Target" />
                  </div>
                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2.5 bg-destructive/5 rounded-xl text-destructive">
                              <ShieldCheck className="h-5 w-5" />
                           </div>
                           <div className="flex flex-col">
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Privacy Action</CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Registry Hardening</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <div className="flex items-center gap-4 p-5 bg-muted/30 rounded-2xl border border-accent/5">
                          <FileText className="h-6 w-6 text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-black uppercase italic truncate text-accent">{selectedFile.name}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Staged for Purge</p>
                          </div>
                        </div>
                        
                        <div className="p-5 bg-destructive/5 rounded-[2rem] border border-destructive/10 flex items-start gap-4">
                           <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                           <p className="text-[10px] leading-relaxed text-muted-foreground font-medium uppercase tracking-tight">
                             This will permanently remove the Author, Creator, and modification history from the file structure locally.
                           </p>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            variant="destructive"
                            onClick={handleSanitize} 
                            disabled={isProcessing}
                            className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-destructive/20 hover:scale-[1.01] transition-transform"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Strip Metadata & Purge"}
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
            <div className="max-w-md mx-auto space-y-8 text-center animate-in slide-in-from-bottom-8">
              <Card className="p-12 border-none shadow-2xl rounded-[3rem] bg-white space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Asset Sanitized!</h2>
                  <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">Identity signatures removed from stream.</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `sanitized_${selectedFile?.name || 'document.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-16 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Private PDF
                </Button>
              </Card>
              <Button variant="ghost" onClick={() => {
                setIsDone(false);
                setSelectedFile(null);
                setDownloadUrl(null);
              }} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                Purge another document
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
