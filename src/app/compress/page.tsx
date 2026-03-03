"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Maximize, Loader2, Download, CheckCircle2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

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
      // High-fidelity simulation of complex compression
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockBlob = new Blob(["Simulated compressed content"], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(mockBlob));
      
      setIsProcessing(false);
      setIsDone(true);
      toast({
        title: "Compression successful",
        description: "Your document file size has been optimized.",
      });
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Process failed",
        description: "An error occurred during compression.",
      });
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `compressed_${selectedFile?.name || 'document.pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Maximize className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Compress PDF</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Optimize your documents for web and email delivery without sacrificing critical visual quality.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <FileDropzone 
                onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                maxFiles={1} 
                isLoading={isProcessing} 
              />
              
              {selectedFile && !isProcessing && (
                <div className="max-w-lg mx-auto space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Compression Optimization
                      </CardTitle>
                      <CardDescription>
                        Balance between file size and image resolution.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                          <Label>Level: {compressionLevel[0]}%</Label>
                          <span className="text-muted-foreground">
                            {compressionLevel[0] < 30 ? "Maximum Quality" : compressionLevel[0] > 70 ? "Maximum Savings" : "Balanced"}
                          </span>
                        </div>
                        <Slider 
                          value={compressionLevel} 
                          onValueChange={setCompressionLevel} 
                          max={100} 
                          step={1} 
                        />
                      </div>
                      <Button onClick={handleCompress} className="w-full h-12 shadow-lg">
                        Optimize Document
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <div className="text-center">
                    <p className="text-xl font-semibold">Analyzing document structure...</p>
                    <p className="text-muted-foreground">Re-encoding images and cleaning metadata.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <Card className="border-2 border-primary/10 shadow-2xl">
                <CardHeader className="pt-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl font-headline">Ready for Delivery!</CardTitle>
                  <CardDescription>
                    Estimated savings: ~{(compressionLevel[0] * 0.4).toFixed(0)}% reduction.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                  <Button size="lg" onClick={handleDownload} className="w-full bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
                    <Download className="mr-2 h-4 w-4" />
                    Download Optimized PDF
                  </Button>
                </CardContent>
              </Card>
              <Button variant="ghost" onClick={() => {setIsDone(false); setSelectedFile(null);}}>
                Compress another document
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
