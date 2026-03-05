
"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Type, 
  Loader2, 
  Download, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  LayoutGrid,
  Palette,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PDFDocument, rgb, degrees, StandardFonts, RGB } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';
import { cn } from '@/lib/utils';

type Position = "center" | "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right" | "middle-left" | "middle-right";

const colorMap: Record<string, RGB> = {
  "grey": rgb(0.7, 0.7, 0.7),
  "red": rgb(0.87, 0.29, 0.42),
  "blue": rgb(0.14, 0.12, 0.29),
};

export default function WatermarkPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [text, setText] = React.useState("CONFIDENTIAL");
  const [opacity, setOpacity] = React.useState([0.3]);
  const [fontSize, setFontSize] = React.useState([60]);
  const [rotation, setRotation] = React.useState([45]);
  const [position, setPosition] = React.useState<Position>("center");
  const [color, setColor] = React.useState("grey");
  
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleApply = async () => {
    if (!selectedFile || !text) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const selectedColor = colorMap[color] || colorMap.grey;

      for (const page of pages) {
        const { width, height } = page.getSize();
        const mediaBox = page.getMediaBox();
        
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize[0]);
        const textHeight = fontSize[0]; // Approximation

        let x = mediaBox.x + width / 2;
        let y = mediaBox.y + height / 2;

        // Positioning Logic
        const margin = 50;
        
        switch (position) {
          case "top-left": x = mediaBox.x + margin; y = mediaBox.y + height - margin; break;
          case "top-center": x = mediaBox.x + width / 2; y = mediaBox.y + height - margin; break;
          case "top-right": x = mediaBox.x + width - margin; y = mediaBox.y + height - margin; break;
          case "middle-left": x = mediaBox.x + margin; y = mediaBox.y + height / 2; break;
          case "center": x = mediaBox.x + width / 2; y = mediaBox.y + height / 2; break;
          case "middle-right": x = mediaBox.x + width - margin; y = mediaBox.y + height / 2; break;
          case "bottom-left": x = mediaBox.x + margin; y = mediaBox.y + margin; break;
          case "bottom-center": x = mediaBox.x + width / 2; y = mediaBox.y + margin; break;
          case "bottom-right": x = mediaBox.x + width - margin; y = mediaBox.y + margin; break;
        }

        page.drawText(text, {
          x: position.includes('center') ? x - (textWidth / 2) : position.includes('right') ? x - textWidth : x,
          y: y,
          size: fontSize[0],
          font: helveticaFont,
          color: selectedColor,
          rotate: degrees(rotation[0]),
          opacity: opacity[0],
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      toast({ title: "Protocol Success", description: `Watermark applied to ${pages.length} pages.` });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Sequence Failed", description: "The document object tree could not be modified." });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setIsDone(false);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <Type className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Watermark Engine</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              Professional Text Overlays. Precision placement and transparency controls for industrial document protection.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
              {!selectedFile ? (
                <FileDropzone 
                  onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                  maxFiles={1} 
                  isLoading={isProcessing} 
                />
              ) : (
                <div className="grid lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Live Preview Reference
                      </h3>
                      <span className="text-[10px] font-bold text-primary uppercase truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                    <PDFPreview file={selectedFile} className="h-[750px]" />
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                              <Sliders className="h-5 w-5" />
                           </div>
                           <div className="flex flex-col">
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Configuration</CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Industrial Overlay Parameters</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="text" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                              <Type className="h-3 w-3" /> Watermark Content
                            </Label>
                            <Input 
                              id="text" 
                              value={text} 
                              onChange={(e) => setText(e.target.value.toUpperCase())}
                              className="h-12 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent uppercase"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Positioning</Label>
                              <Select value={position} onValueChange={(v: any) => setPosition(v)}>
                                <SelectTrigger className="h-12 rounded-xl bg-white border-accent/10 font-bold uppercase text-[10px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-accent/10">
                                  {["top-left", "top-center", "top-right", "middle-left", "center", "middle-right", "bottom-left", "bottom-center", "bottom-right"].map(pos => (
                                    <SelectItem key={pos} value={pos} className="text-[10px] font-bold uppercase">{pos.replace('-', ' ')}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Color Logic</Label>
                              <Select value={color} onValueChange={setColor}>
                                <SelectTrigger className="h-12 rounded-xl bg-white border-accent/10 font-bold uppercase text-[10px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-accent/10">
                                  <SelectItem value="grey" className="text-[10px] font-bold uppercase">Industrial Steel</SelectItem>
                                  <SelectItem value="red" className="text-[10px] font-bold uppercase">Alert Crimson</SelectItem>
                                  <SelectItem value="blue" className="text-[10px] font-bold uppercase">Deep Protocol</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between text-sm font-medium">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                                <Maximize2 className="h-3 w-3" /> Scale: {fontSize[0]}px
                              </Label>
                            </div>
                            <Slider value={fontSize} onValueChange={setFontSize} min={10} max={200} step={1} />
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between text-sm font-medium">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                                <RotateCcw className="h-3 w-3" /> Orientation: {rotation[0]}°
                              </Label>
                            </div>
                            <Slider value={rotation} onValueChange={setRotation} min={-180} max={180} step={1} />
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between text-sm font-medium">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                                <Palette className="h-3 w-3" /> Density: {(opacity[0] * 100).toFixed(0)}%
                              </Label>
                            </div>
                            <Slider value={opacity} onValueChange={setOpacity} max={1} step={0.01} />
                          </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                          <Button 
                            onClick={handleApply} 
                            disabled={isProcessing || !text}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Deploy Overlays"}
                          </Button>
                          <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                            Discard Document
                          </Button>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                          <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <p className="text-[9px] leading-relaxed text-muted-foreground font-medium uppercase tracking-tight">
                            <span className="font-black text-accent">Process Note:</span> Overlays are permanently embedded into the document content stream for high-visibility protection.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in slide-in-from-bottom-8 duration-700">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-12 space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Protocol Success!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Overlays applied and verified across all document pages.</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5 text-left">
                   <div className="flex items-center gap-2 mb-3">
                      <LayoutGrid className="h-3 w-3 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">Asset Audit</span>
                   </div>
                   <ul className="space-y-2">
                      {[
                        `Text Content: ${text}`,
                        `Position: ${position.replace('-', ' ').toUpperCase()}`,
                        `Opacity Level: ${(opacity[0] * 100).toFixed(0)}%`,
                        "Stream Status: Hardened"
                      ].map(item => (
                        <li key={item} className="flex items-center gap-2 text-[9px] font-bold text-accent italic">
                           <div className="h-1 w-1 rounded-full bg-green-500" /> {item}
                        </li>
                      ))}
                   </ul>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `watermarked_${selectedFile?.name || 'asset.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Protected Asset
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                Initialize New Workspace
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
