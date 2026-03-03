"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Type, Loader2, Download, CheckCircle2, Sliders } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

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

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `watermarked_${selectedFile?.name || 'document.pdf'}`;
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
              <Type className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Watermark PDF</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Add professional text overlays to protect your documents.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8">
              <FileDropzone onFilesSelected={(files) => setSelectedFile(files[0] || null)} maxFiles={1} isLoading={isProcessing} />
              
              {selectedFile && !isProcessing && (
                <div className="max-w-md mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sliders className="h-5 w-5 text-primary" />
                        Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="text">Watermark Text</Label>
                        <Input id="text" value={text} onChange={(e) => setText(e.target.value)} />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <Label>Opacity</Label>
                          <span className="text-muted-foreground">{(opacity[0] * 100).toFixed(0)}%</span>
                        </div>
                        <Slider value={opacity} onValueChange={setOpacity} max={1} step={0.05} />
                      </div>
                      <Button onClick={handleApply} className="w-full h-12">Apply Watermark</Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in">
              <Card className="p-12 border-2 border-primary/10 shadow-2xl">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold font-headline mb-4">Watermark Applied!</h2>
                <Button size="lg" onClick={handleDownload} className="w-full bg-accent hover:bg-accent/90">
                  Download Watermarked PDF
                </Button>
              </Card>
              <Button variant="ghost" onClick={() => {setIsDone(false); setSelectedFile(null);}}>
                Start Over
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
