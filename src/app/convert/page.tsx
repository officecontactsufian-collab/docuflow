"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Loader2, Download, FileType, FileText, Image as ImageIcon, FileCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ConvertPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [targetFormat, setTargetFormat] = React.useState<'word' | 'image' | 'excel' | null>(null);
  const { toast } = useToast();

  const handleConvert = (format: 'word' | 'image' | 'excel') => {
    if (!selectedFile) return;
    setTargetFormat(format);
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      toast({
        title: "Conversion complete",
        description: `Your PDF was converted to ${format.toUpperCase()} successfully.`,
      });
    }, 2000);
  };

  const formats = [
    { id: 'word', name: 'Word', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'image', name: 'Image (JPG)', icon: ImageIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'excel', name: 'Excel', icon: FileCode, color: 'text-green-600', bg: 'bg-green-50' },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <RefreshCcw className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Convert PDF</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Convert your PDF documents into high-quality editable files or images.
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
                <div className="space-y-6">
                  <h3 className="text-center font-semibold text-lg">Select output format</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {formats.map((f) => (
                      <Card key={f.id} className="cursor-pointer hover:border-primary transition-all hover:shadow-md" onClick={() => handleConvert(f.id)}>
                        <CardHeader className="text-center space-y-4">
                          <div className={`w-16 h-16 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mx-auto`}>
                            <f.icon className="h-8 w-8" />
                          </div>
                          <CardTitle>{f.name}</CardTitle>
                          <CardDescription>Convert to {f.name}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative">
                    <RefreshCcw className="h-16 w-16 text-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileType className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-semibold">Converting your PDF...</p>
                    <p className="text-muted-foreground">Converting to {targetFormat?.toUpperCase()} format</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <div className="p-8 bg-white border rounded-2xl shadow-xl space-y-6">
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
                  <Download className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-headline">Ready for download!</h2>
                  <p className="text-muted-foreground mt-2">{selectedFile?.name.replace('.pdf', `.${targetFormat === 'word' ? 'docx' : targetFormat === 'excel' ? 'xlsx' : 'jpg'}`)}</p>
                </div>
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
                  Download Converted File
                </Button>
              </div>
              <Button variant="ghost" onClick={() => { setIsDone(false); setSelectedFile(null); }}>
                Convert another file
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}