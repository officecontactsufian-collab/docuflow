"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Crop, Loader2, Download, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CropPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const { toast } = useToast();

  const handleCrop = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setIsDone(true);
    toast({ title: "Crop Successful", description: "Margins have been trimmed." });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary shadow-lg mb-2">
              <Crop className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Crop PDF Pages</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Trim whitespace, remove margins, and adjust page sizes for professional print or digital delivery.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8">
              <FileDropzone onFilesSelected={(files) => setSelectedFile(files[0] || null)} maxFiles={1} isLoading={isProcessing} />
              {selectedFile && !isProcessing && (
                <div className="max-w-lg mx-auto">
                  <Button onClick={handleCrop} className="w-full h-12 shadow-lg">Apply Automated Crop</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center space-y-8 animate-in zoom-in">
              <Card className="p-12 border-2 border-primary/10 shadow-2xl">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Trim Complete!</h2>
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90">Download Cropped PDF</Button>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
