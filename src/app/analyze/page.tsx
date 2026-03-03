"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, FileText, Download, Calendar, Users, Hash, Tag, Info, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument } from 'pdf-lib';

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
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Search className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Document Inspector</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Extract metadata, security properties, and structural information directly from your PDF files.
            </p>
          </div>

          {!result ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <FileDropzone 
                onFilesSelected={handleFilesSelected} 
                maxFiles={1} 
                isLoading={isLoading} 
              />
              
              {selectedFile && (
                <div className="flex justify-center">
                  <Button 
                    size="lg" 
                    onClick={handleInspect}
                    disabled={isLoading}
                    className="min-w-[240px]"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Info className="mr-2 h-4 w-4" />}
                    Inspect Document
                  </Button>
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
                    <h2 className="font-bold text-lg">{selectedFile?.name}</h2>
                    <p className="text-sm text-muted-foreground">Local Structural Analysis</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setResult(null)}>Inspect New Document</Button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      General Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Title</p>
                        <p className="font-medium">{result.title}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Author</p>
                        <p className="font-medium">{result.author}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Subject</p>
                        <p className="font-medium">{result.subject}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Page Count</p>
                        <p className="font-medium">{result.pageCount} Pages</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Producer</p>
                        <p className="font-medium">{result.producer}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Creator</p>
                        <p className="font-medium">{result.creator}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Encryption</span>
                      <Badge variant={result.isEncrypted ? "destructive" : "secondary"}>
                        {result.isEncrypted ? "Protected" : "None"}
                      </Badge>
                    </div>
                    <div className="pt-4 border-t space-y-2">
                       <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Timestamps</p>
                       <div className="text-xs space-y-1">
                          <p><span className="text-muted-foreground">Created:</span> {result.creationDate?.toLocaleDateString() || "N/A"}</p>
                          <p><span className="text-muted-foreground">Modified:</span> {result.modificationDate?.toLocaleDateString() || "N/A"}</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Embedded Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.keywords && result.keywords.length > 0 ? (
                    result.keywords.map((kw, i) => (
                      <Badge key={i} variant="outline" className="px-3 py-1">{kw}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No keywords found in document metadata.</p>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 min-w-[200px]">
                  <Download className="mr-2 h-4 w-4" />
                  Export Metadata JSON
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
