"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Scissors, Loader2, Download, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SplitPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [splitRange, setSplitRange] = React.useState("1-5");
  const { toast } = useToast();

  const handleSplit = () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      toast({
        title: "PDF split successfully",
        description: "Extracted pages are ready for download.",
      });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Scissors className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Split PDF Document</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Extract specific pages or ranges from your PDF to create new documents.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95">
              <FileDropzone 
                onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                maxFiles={1} 
                isLoading={isProcessing} 
              />
              
              {selectedFile && (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Layers className="h-5 w-5 text-primary" />
                          Split Options
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="range">Page Range</Label>
                          <Input 
                            id="range" 
                            placeholder="e.g. 1-3, 5, 8-10" 
                            value={splitRange}
                            onChange={(e) => setSplitRange(e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={handleSplit}
                          disabled={isProcessing}
                          className="w-full shadow-md"
                        >
                          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scissors className="mr-2 h-4 w-4" />}
                          Split PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="md:col-span-2">
                    <div className="border rounded-2xl bg-muted/30 aspect-[4/3] flex items-center justify-center text-muted-foreground">
                      <div className="text-center space-y-2">
                        <FileDropzone className="hidden" onFilesSelected={() => {}} />
                        <p className="text-sm font-medium">Page Preview Not Available</p>
                        <p className="text-xs">Processing {selectedFile.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <div className="p-8 bg-white border rounded-2xl shadow-xl space-y-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Download className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-headline">Pages extracted!</h2>
                  <p className="text-muted-foreground mt-2">Range: {splitRange}</p>
                </div>
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
                  Download Split Files
                </Button>
              </div>
              <Button variant="ghost" onClick={() => { setIsDone(false); setSelectedFile(null); }}>
                Split another file
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}