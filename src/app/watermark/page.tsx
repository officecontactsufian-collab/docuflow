"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Type, Loader2, Download, CheckCircle2, Sliders, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';

export default function WatermarkPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [text, setText] = React.useState("CONFIDENTIAL");
  const [opacity, setOpacity] = React.useState([0.3]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleApply = async () => {
    if (!selectedFile || !text) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(text, {
          x: width / 4,
          y: height / 2,
          size: 60,
          font: helveticaFont,
          color: rgb(0.7, 0.7, 0.7),
          rotate: degrees(45),
          opacity: opacity[0],
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      toast({ title: "Watermark Applied", description: "All pages have been watermarked." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Process Failed", description: "Could not apply watermark." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center text-primary mb-2">
              <Type className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Watermark PDF</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Add professional text overlays to protect and identify your documents.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8">
              {!selectedFile ? (
                <FileDropzone onFilesSelected={(files) => setSelectedFile(files[0] || null)} maxFiles={1} isLoading={isProcessing} />
              ) : (
                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <PDFPreview file={selectedFile} />
                  </div>
                  
                  <div className="space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2rem] bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pt-8 px-8">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3">
                          <Sliders className="h-5 w-5 text-primary" />
                          Watermark Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8 p-8">
                        <div className="space-y-3">
                          <Label htmlFor="text" className="text-[10px] font-black uppercase tracking-widest text-accent/60">Watermark Text</Label>
                          <Input 
                            id="text" 
                            value={text} 
                            onChange={(e) => setText(e.target.value)}
                            className="h-12 rounded-xl bg-muted/20 border-accent/10 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Opacity</Label>
                            <span className="text-[10px] font-bold text-primary">{(opacity[0] * 100).toFixed(0)}%</span>
                          </div>
                          <Slider value={opacity} onValueChange={setOpacity} max={1} step={0.05} />
                        </div>
                        
                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleApply} 
                            disabled={isProcessing}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Apply Overlays"}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest">
                            Change Document
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex items-start gap-3 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                      <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-wider text-accent">Professional Protection</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">Watermarks are applied diagonally across the object tree of every page for maximum visibility.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in">
              <Card className="p-12 bg-white border border-white/40 rounded-[3rem] shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <Download className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tight">Watermark Applied!</h2>
                <Button 
                  size="lg" 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = downloadUrl!;
                    link.download = `watermarked_${selectedFile?.name || 'document.pdf'}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  Download Result
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest">
                Start Over
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
