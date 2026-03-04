"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Edit3, Loader2, Download, CheckCircle2, Type, Square, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function EditPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const { toast } = useToast();

  const handleEdit = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    // Simulation of editor loading/processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsDone(true);
    toast({ title: "Editor Ready", description: "Document loaded into interactive editor." });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary shadow-lg mb-2">
              <Edit3 className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Edit PDF Content</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Add text, shapes, and images directly to your PDF documents with our professional layout engine.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8">
              <FileDropzone onFilesSelected={(files) => setSelectedFile(files[0] || null)} maxFiles={1} isLoading={isProcessing} />
              {selectedFile && !isProcessing && (
                <div className="max-w-lg mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Initialization</CardTitle>
                      <CardDescription>Launch the interactive document editor for {selectedFile.name}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={handleEdit} className="w-full h-12">Open PDF Editor</Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-12 bg-white rounded-3xl border shadow-2xl text-center space-y-8">
               <div className="flex justify-center gap-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-4 bg-primary/5 text-primary rounded-2xl"><Type className="h-8 w-8" /></div>
                    <span className="text-xs font-bold uppercase tracking-widest">Text</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-4 bg-primary/5 text-primary rounded-2xl"><Square className="h-8 w-8" /></div>
                    <span className="text-xs font-bold uppercase tracking-widest">Shapes</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-4 bg-primary/5 text-primary rounded-2xl"><ImageIcon className="h-8 w-8" /></div>
                    <span className="text-xs font-bold uppercase tracking-widest">Images</span>
                  </div>
               </div>
               <div className="aspect-[4/3] bg-muted/20 rounded-2xl border-2 border-dashed flex items-center justify-center">
                  <p className="text-muted-foreground font-bold italic">Interactive Canvas Loaded</p>
               </div>
               <Button size="lg" className="bg-accent">Export Changes</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
