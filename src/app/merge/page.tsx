"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Merge, Loader2, Download, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function MergePage() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isDone, setIsDone] = React.useState(false);
  const { toast } = useToast();

  const handleMerge = () => {
    if (files.length < 2) {
      toast({
        variant: "destructive",
        title: "Minimum 2 files required",
        description: "Please select at least two PDF documents to merge.",
      });
      return;
    }

    setIsProcessing(true);
    // Simulate processing
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setIsDone(true);
        toast({
          title: "Files merged successfully!",
          description: "Your new PDF is ready for download.",
        });
      }
    }, 200);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Merge className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Merge PDF Files</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Combine multiple PDF documents into a single, unified file. Drag files to reorder after uploading.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <FileDropzone 
                onFilesSelected={setFiles} 
                maxFiles={20} 
                isLoading={isProcessing} 
              />
              
              {files.length > 0 && (
                <div className="flex flex-col items-center gap-6">
                  {isProcessing && (
                    <div className="w-full max-w-md space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-center text-muted-foreground">Merging {files.length} documents...</p>
                    </div>
                  )}
                  
                  <Button 
                    size="lg" 
                    onClick={handleMerge}
                    disabled={isProcessing || files.length < 2}
                    className="w-full sm:w-auto min-w-[200px] shadow-lg"
                  >
                    {isProcessing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Merge className="mr-2 h-4 w-4" />
                    )}
                    Merge PDF
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <div className="p-8 bg-white border rounded-2xl shadow-xl space-y-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Download className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-headline">Ready to download!</h2>
                  <p className="text-muted-foreground mt-2">Combined document: {files.length} pages total</p>
                </div>
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
                  Download Merged PDF
                </Button>
              </div>
              <Button variant="ghost" onClick={() => { setIsDone(false); setFiles([]); setProgress(0); }}>
                Merge more files
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}