"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { Hash, Loader2, Download, CheckCircle2, LayoutGrid, Settings2, ShieldCheck, ListOrdered } from 'lucide-react';
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
      const pageCount = pages.length;

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        // Use MediaBox to handle non-zero origins
        const mediaBox = page.getMediaBox();
        
        const text = `Page ${i + startNumber}`;
        const fontSize = 12;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        
        let x = mediaBox.x + (width / 2 - textWidth / 2);
        let y = mediaBox.y + 30; // 30 points from bottom

        if (position === "bottom-left") x = mediaBox.x + 50;
        if (position === "bottom-right") x = mediaBox.x + width - textWidth - 50;
        if (position === "top-center") y = mediaBox.y + height - 50;
        if (position === "top-left") { x = mediaBox.x + 50; y = mediaBox.y + height - 50; }
        if (position === "top-right") { x = mediaBox.x + width - textWidth - 50; y = mediaBox.y + height - 50; }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font: font,
          color: rgb(0.2, 0.2, 0.2), // Darker for better visibility
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      toast({ 
        title: "Numbers Applied", 
        description: `Successfully added counters to ${pageCount} pages.` 
      });
    } catch (e) {
      console.error(e);
      toast({ 
        variant: "destructive", 
        title: "Process Failed", 
        description: "Failed to apply page numbers. The file may be protected or corrupted." 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setIsDone(false);
    setStartNumber(1);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-2">
              <Hash className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic tracking-tighter">Page Number Engine</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Automatically add sequential counters to your documents. Professional placement with industrial accuracy.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              {!selectedFile ? (
                <FileDropzone 
                  onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                  maxFiles={1} 
                  isLoading={isProcessing} 
                />
              ) : (
                <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Live Preview
                      </h3>
                      <span className="text-[10px] font-bold text-primary uppercase truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                    <PDFPreview file={selectedFile} className="h-[700px]" />
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white/80 backdrop-blur-sm sticky top-24">
                      <CardHeader className="pt-8 px-8">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3 text-accent">
                          <Settings2 className="h-5 w-5 text-primary" />
                          Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8 p-8">
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                            Placement Logic
                          </Label>
                          <Select value={position} onValueChange={setPosition}>
                             <SelectTrigger className="h-12 rounded-xl bg-white border-accent/10 shadow-sm font-bold text-accent uppercase text-[10px] tracking-wider">
                                <SelectValue placeholder="Position" />
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
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                            <ListOrdered className="h-3 w-3" /> Start Number
                          </Label>
                          <Input 
                            type="number" 
                            min={0} 
                            value={startNumber} 
                            onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                            className="h-12 rounded-xl bg-white border-accent/10 font-bold"
                          />
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleApply} 
                            disabled={isProcessing}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Deploy Counters"}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            Discard Document
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-start gap-3 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                      <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-wider text-accent">Automated indexing</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          Sequential counters are applied permanently to the document structure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8">
              <Card className="p-12 bg-white border border-white/40 rounded-[3rem] shadow-2xl space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Sequence Applied!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Your document has been indexed and verified.</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `numbered_${selectedFile?.name || 'document.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Numbered PDF
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/60">
                Process New Asset
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
