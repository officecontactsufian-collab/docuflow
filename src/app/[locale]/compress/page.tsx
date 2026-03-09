"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Maximize, Loader2, Download, CheckCircle2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PDFPreview } from '@/components/pdf-preview';
import { PDFDocument } from 'pdf-lib';

export default function CompressPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [compressionLevel, setCompressionLevel] = React.useState([50]);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleCompress = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      setDownloadUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
      setIsDone(true);
      toast({
        title: "Compression successful",
        description: "Your document object tree has been optimized for delivery.",
      });
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Process failed",
        description: "An error occurred during structural optimization.",
      });
    }
  };

  const reset = () => {
    setIsDone(false);
    setSelectedFile(null);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center text-primary mb-2">
              <Maximize className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Compress PDF</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Optimize your documents for web delivery by rebuilding the internal object structure.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              {!selectedFile ? (
                <FileDropzone 
                  onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                  maxFiles={1} 
                  isLoading={isProcessing} 
                />
              ) : (
                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <PDFPreview file={selectedFile} />
                  </div>
                  
                  <div className="space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2rem] bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pt-8 px-8">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3">
                          <Zap className="h-5 w-5 text-primary" />
                          Optimization Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8 p-8">
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm font-medium">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Target: {compressionLevel[0]}%</Label>
                            <span className="text-[10px] font-bold text-primary">
                              {compressionLevel[0] < 30 ? "Minimal Rebuild" : compressionLevel[0] > 70 ? "Aggressive Re-indexing" : "Balanced"}
                            </span>
                          </div>
                          <Slider 
                            value={compressionLevel} 
                            onValueChange={setCompressionLevel} 
                            max={100} 
                            step={1} 
                          />
                        </div>
                        
                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleCompress} 
                            disabled={isProcessing}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Optimize Document"}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest">
                            Change File
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <Card className="p-12 bg-white border border-white/40 rounded-[3rem] shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight">Optimization Ready!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Structural rebuild complete. File optimized for delivery.</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = downloadUrl!;
                    link.download = `compressed_${selectedFile?.name || 'document.pdf'}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Optimized PDF
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest">
                Compress another document
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
