"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, FileText, Download, Info, ShieldCheck, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<{
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
    pageCount: number;
    keywords?: string[];
    isEncrypted: boolean;
  } | null>(null);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFile(files[0] || null);
    setResult(null);
  };

  const handleInspect = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      setResult({
        title: pdfDoc.getTitle() || "Untitled",
        author: pdfDoc.getAuthor() || "Unknown",
        subject: pdfDoc.getSubject() || "None",
        creator: pdfDoc.getCreator() || "Unknown",
        producer: pdfDoc.getProducer() || "Unknown",
        creationDate: pdfDoc.getCreationDate(),
        modificationDate: pdfDoc.getModificationDate(),
        pageCount: pdfDoc.getPageCount(),
        keywords: pdfDoc.getKeywords()?.split(' ').filter(k => k) || [],
        isEncrypted: pdfDoc.isEncrypted,
      });
      
      toast({
        title: "Inspection complete",
        description: "Document structure and metadata extracted successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Inspection failed",
        description: "Could not read document metadata. The file might be corrupted or heavily protected.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Search className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic tracking-tighter">Document Inspector</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Extract metadata, security properties, and structural information directly from your PDF files.
            </p>
          </div>

          {!result ? (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
              {!selectedFile ? (
                <FileDropzone 
                  onFilesSelected={handleFilesSelected} 
                  maxFiles={1} 
                  isLoading={isLoading} 
                />
              ) : (
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                  <div className="lg:col-span-7">
                    <PDFPreview file={selectedFile} title="Inspection Target" />
                  </div>
                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/5 rounded-xl text-primary">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black uppercase italic truncate text-accent">{selectedFile.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Local Staging Ready</p>
                          </div>
                        </div>
                        <Button 
                          size="lg" 
                          onClick={handleInspect}
                          disabled={isLoading}
                          className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-accent/20"
                        >
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Info className="mr-2 h-4 w-4" />}
                          Begin Inspection
                        </Button>
                        <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                          Change Document
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-accent uppercase italic">{selectedFile?.name}</h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Local Structural Analysis</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl border-accent/10 font-bold uppercase text-[10px] tracking-widest" onClick={() => setResult(null)}>Inspect New Document</Button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="p-8 border-b border-accent/5">
                    <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-accent">
                      <Info className="h-5 w-5 text-primary" />
                      General Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4">
                    <div className="grid grid-cols-2 gap-8 text-sm">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-accent/40 mb-1">Title</p>
                        <p className="font-bold text-accent">{result.title}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-accent/40 mb-1">Author</p>
                        <p className="font-bold text-accent">{result.author}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-accent/40 mb-1">Subject</p>
                        <p className="font-bold text-accent">{result.subject}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-accent/40 mb-1">Page Count</p>
                        <p className="font-bold text-accent">{result.pageCount} Pages</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-accent/40 mb-1">Producer</p>
                        <p className="font-bold text-accent">{result.producer}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-accent/40 mb-1">Creator</p>
                        <p className="font-bold text-accent">{result.creator}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="p-8 border-b border-accent/5">
                    <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-accent">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent/60">Encryption</span>
                      <Badge variant={result.isEncrypted ? "destructive" : "secondary"} className="rounded-lg px-2 text-[9px] uppercase">
                        {result.isEncrypted ? "Protected" : "None"}
                      </Badge>
                    </div>
                    <div className="pt-6 border-t border-accent/5 space-y-4">
                       <p className="text-[10px] text-accent/40 uppercase font-black tracking-widest">Temporal Registry</p>
                       <div className="space-y-3">
                          <div className="flex items-center justify-between">
                             <span className="text-[9px] font-bold text-accent/60 uppercase">Created</span>
                             <span className="text-[9px] font-black text-accent">{result.creationDate?.toLocaleDateString() || "N/A"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-[9px] font-bold text-accent/60 uppercase">Modified</span>
                             <span className="text-[9px] font-black text-accent">{result.modificationDate?.toLocaleDateString() || "N/A"}</span>
                          </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-accent/5">
                  <CardTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-accent">
                    <Tag className="h-5 w-5 text-primary" />
                    Embedded Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex flex-wrap gap-2">
                  {result.keywords && result.keywords.length > 0 ? (
                    result.keywords.map((kw, i) => (
                      <Badge key={i} variant="outline" className="px-4 py-1.5 rounded-xl border-accent/10 font-bold text-accent uppercase text-[9px] tracking-widest">{kw}</Badge>
                    ))
                  ) : (
                    <p className="text-[10px] font-bold text-accent/30 uppercase tracking-widest italic">No keywords found in document metadata.</p>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-center pt-8">
                <Button size="lg" className="h-16 px-12 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-accent/20">
                  <Download className="mr-2 h-4 w-4" />
                  Export Structural Metadata
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
