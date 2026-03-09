"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Hash, Loader2, Download, CheckCircle2, Settings2, ShieldCheck, ListOrdered } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function NumbersPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [position, setPosition] = React.useState("bottom-center");
  const [startNumber, setStartNumber] = React.useState(1);
  const { toast } = useToast();

  const handleApply = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const mediaBox = page.getMediaBox();
        const text = `Page ${i + startNumber}`;
        const fontSize = 12;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        
        let x = mediaBox.x + (width / 2 - textWidth / 2);
        let y = mediaBox.y + 30;

        if (position === "bottom-left") x = mediaBox.x + 50;
        if (position === "bottom-right") x = mediaBox.x + width - textWidth - 50;
        if (position === "top-center") y = mediaBox.y + height - 50;
        if (position === "top-left") { x = mediaBox.x + 50; y = mediaBox.y + height - 50; }
        if (position === "top-right") { x = mediaBox.x + width - textWidth - 50; y = mediaBox.y + height - 50; }

        page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
      });

      const pdfBytes = await pdfDoc.save();
      setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setIsDone(true);
      toast({ title: "Numbers Applied" });
    } catch (e) {
      toast({ variant: "destructive", title: "Process Failed" });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setIsDone(false);
    setDownloadUrl(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Hash className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic">Page Number Engine</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Automatically add sequential counters to your documents.</p>
          </div>

          {!isDone ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              {!selectedFile ? (
                <FileDropzone onFilesSelected={(files) => setSelectedFile(files[0] || null)} maxFiles={1} isLoading={isProcessing} />
              ) : (
                <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-8 space-y-6">
                    <PDFPreview file={selectedFile} className="h-[700px]" />
                  </div>
                  <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white/80 p-8">
                      <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-xl font-black uppercase italic text-accent">Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-8">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Position</Label>
                          <Select value={position} onValueChange={setPosition}>
                             <SelectTrigger className="h-12 rounded-xl bg-white border-accent/10 font-bold text-accent uppercase text-[10px] tracking-wider">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent className="rounded-xl border-accent/10">
                                <SelectItem value="bottom-center" className="text-xs font-bold uppercase">Bottom Center</SelectItem>
                                <SelectItem value="bottom-left" className="text-xs font-bold uppercase">Bottom Left</SelectItem>
                                <SelectItem value="bottom-right" className="text-xs font-bold uppercase">Bottom Right</SelectItem>
                                <SelectItem value="top-center" className="text-xs font-bold uppercase">Top Center</SelectItem>
                                <SelectItem value="top-left" className="text-xs font-bold uppercase">Top Left</SelectItem>
                                <SelectItem value="top-right" className="text-xs font-bold uppercase">Top Right</SelectItem>
                             </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Start Number</Label>
                          <Input type="number" min={0} value={startNumber} onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)} className="h-12 rounded-xl bg-white border-accent/10 font-bold" />
                        </div>
                        <Button onClick={handleApply} disabled={isProcessing} className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl">
                          {isProcessing ? <Loader2 className="animate-spin" /> : "Deploy Counters"}
                        </Button>
                        <Button variant="ghost" onClick={() => setSelectedFile(null)} className="w-full text-[10px] font-bold uppercase tracking-widest text-accent/40">Discard Document</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in slide-in-from-bottom-8">
              <Card className="p-12 bg-white border border-white/40 rounded-[3rem] shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Sequence Applied!</h2>
                <Button size="lg" onClick={() => { if (downloadUrl) { const link = document.createElement('a'); link.href = downloadUrl; link.download = `numbered_${selectedFile?.name || 'document.pdf'}`; link.click(); } }} className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest">
                  <Download className="mr-2 h-4 w-4" /> Download Numbered PDF
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/60">Process New Asset</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
