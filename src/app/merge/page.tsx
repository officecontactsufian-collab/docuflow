"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Merge, Loader2, Download, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';

export default function MergePage() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [previewFile, setPreviewFile] = React.useState<File | null>(null);
  const { toast } = useToast();

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        variant: "destructive",
        title: "Minimum 2 files required",
        description: "Please select at least two PDF documents to merge.",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        
        const currentProgress = Math.round(10 + ((i + 1) / files.length) * 80);
        setProgress(currentProgress);
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      setProgress(100);
      setIsProcessing(false);
      setIsDone(true);
      
      toast({
        title: "Files merged successfully!",
        description: "Your new PDF is ready for download.",
      });
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Merge failed",
        description: "An error occurred while merging your PDF files.",
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (previewFile === files[index]) setPreviewFile(null);
  };

  const reset = () => {
    setIsDone(false);
    setFiles([]);
    setProgress(0);
    setPreviewFile(null);
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
              <Merge className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Merge PDF Files</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Combine multiple PDF documents into a single, unified file. Staging area allows for review and reordering.
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
                <div className="grid lg:grid-cols-3 gap-8 pt-8">
                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-accent/60 px-2">Staged Assets ({files.length})</h3>
                    <div className="space-y-2 max-h-[500px] overflow-auto pr-2">
                      {files.map((file, idx) => (
                        <div 
                          key={`${file.name}-${idx}`}
                          onClick={() => setPreviewFile(file)}
                          className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${previewFile === file ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20' : 'bg-white border-white/40 hover:border-primary/20'}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-muted/20 rounded-lg group-hover:text-primary transition-colors">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-bold truncate max-w-[120px] uppercase italic">{file.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(idx);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 space-y-4">
                      {isProcessing && (
                        <div className="space-y-2">
                          <Progress value={progress} className="h-1.5" />
                          <p className="text-[10px] text-center font-bold text-primary uppercase tracking-widest">Compiling documents...</p>
                        </div>
                      )}
                      <Button 
                        size="lg" 
                        onClick={handleMerge}
                        disabled={isProcessing || files.length < 2}
                        className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                      >
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Merge className="mr-2 h-4 w-4" />}
                        Merge Sequences
                      </Button>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    {previewFile ? (
                      <PDFPreview file={previewFile} title={`Preview: ${previewFile.name}`} />
                    ) : (
                      <div className="h-full min-h-[400px] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground bg-muted/5 gap-4">
                        <FileText className="h-12 w-12 opacity-10" />
                        <p className="text-xs font-bold uppercase tracking-widest opacity-40">Select a document to preview</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <div className="p-12 bg-white border border-white/40 rounded-[3rem] shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <Download className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight">Ready to download!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Your combined document is ready for delivery.</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = downloadUrl!;
                    link.download = 'merged_document.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  Download Merged PDF
                </Button>
              </div>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest">
                Merge more files
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
