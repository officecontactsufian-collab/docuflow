"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Signature, 
  Download, 
  Loader2, 
  CheckCircle2, 
  UserCheck, 
  ImageIcon, 
  FileText, 
  PenTool, 
  Type, 
  Upload,
  Eraser,
  LayoutGrid,
  Settings2,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';
import { cn } from '@/lib/utils';

type SignatureMode = 'draw' | 'type' | 'upload';
type Position = "bottom-right" | "bottom-left" | "bottom-center" | "top-right" | "top-left" | "top-center" | "center";

export default function SignPage() {
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  const [totalPages, setTotalPages] = React.useState(0);
  const [targetPage, setTargetPage] = React.useState(1);
  const [position, setPosition] = React.useState<Position>("bottom-right");
  
  const [mode, setMode] = React.useState<SignatureMode>('draw');
  const [typedName, setTypedName] = React.useState("");
  const [selectedFont, setSelectedFont] = React.useState("'Dancing Script', cursive");
  
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const { toast } = useToast();

  const fonts = [
    { name: "Elegant Script", value: "'Dancing Script', cursive" },
    { name: "Casual Flow", value: "'Pacifico', cursive" },
    { name: "Modern Caveat", value: "'Caveat', cursive" },
  ];

  const handleFileSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setTotalPages(pdf.getPageCount());
      setTargetPage(pdf.getPageCount()); // Default to last page
      setPdfFile(file);
    } catch (e) {
      toast({ variant: "destructive", title: "Invalid PDF" });
    }
  };

  // Canvas Drawing Logic
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#251F4A'; // Accent color

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const getSignatureImage = async (): Promise<Uint8Array | null> => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (mode === 'draw' && canvasRef.current) {
      ctx.drawImage(canvasRef.current, 0, 0, canvas.width, canvas.height);
    } else if (mode === 'type') {
      ctx.fillStyle = '#251F4A';
      ctx.font = `70px ${selectedFont}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName || "Signature", canvas.width / 2, canvas.height / 2);
    } else {
      // Logic for upload already handled in previous iteration or could be unified
      return null;
    }

    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
    return new Uint8Array(await blob.arrayBuffer());
  };

  const handleDeploy = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);

    try {
      const sigBytes = await getSignatureImage();
      if (!sigBytes) throw new Error("Signature asset generation failure.");

      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const sigImg = await pdfDoc.embedPng(sigBytes);

      const pages = pdfDoc.getPages();
      const pageIdx = Math.min(Math.max(0, targetPage - 1), pages.length - 1);
      const page = pages[pageIdx];
      const { width, height } = page.getSize();
      const mediaBox = page.getMediaBox();

      const sigWidth = 150;
      const sigHeight = (sigImg.height / sigImg.width) * sigWidth;
      const margin = 50;

      let x = mediaBox.x + width - sigWidth - margin;
      let y = mediaBox.y + margin;

      switch (position) {
        case "bottom-left": x = mediaBox.x + margin; break;
        case "bottom-center": x = mediaBox.x + (width / 2) - (sigWidth / 2); break;
        case "top-left": x = mediaBox.x + margin; y = mediaBox.y + height - sigHeight - margin; break;
        case "top-center": x = mediaBox.x + (width / 2) - (sigWidth / 2); y = mediaBox.y + height - sigHeight - margin; break;
        case "top-right": x = mediaBox.x + width - sigWidth - margin; y = mediaBox.y + height - sigHeight - margin; break;
        case "center": x = mediaBox.x + (width / 2) - (sigWidth / 2); y = mediaBox.y + (height / 2) - (sigHeight / 2); break;
      }

      page.drawImage(sigImg, { x, y, width: sigWidth, height: sigHeight });

      const finalBytes = await pdfDoc.save();
      setDownloadUrl(URL.createObjectURL(new Blob([finalBytes], { type: 'application/pdf' })));
      setIsDone(true);
      toast({ title: "Protocol Success", description: "Digital signature embedded successfully." });
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Sequence Failed", description: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setPdfFile(null);
    setIsDone(false);
    setTypedName("");
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
              <Signature className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Electronic Identity Engine</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              Professional Digital Signatures. Create, synthesize, and precisely place your identity across industrial document streams.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
              {!pdfFile ? (
                <FileDropzone 
                  onFilesSelected={handleFileSelected} 
                  maxFiles={1} 
                  isLoading={isProcessing} 
                />
              ) : (
                <div className="grid lg:grid-cols-12 gap-12">
                  {/* Left: Preview */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        <LayoutGrid className="h-3.5 w-3.5" />
                        Industrial Reference Asset
                      </h3>
                      <span className="text-[10px] font-bold text-primary uppercase truncate max-w-[200px]">{pdfFile.name}</span>
                    </div>
                    <PDFPreview file={pdfFile} className="h-[750px]" />
                  </div>

                  {/* Right: Signature Creation & Placement */}
                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                              <PenTool className="h-5 w-5" />
                           </div>
                           <div className="flex flex-col">
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Identity Suite</CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Signature Creation & Staging</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                          <TabsList className="grid grid-cols-2 h-12 bg-muted/30 p-1 rounded-xl mb-6">
                            <TabsTrigger value="draw" className="rounded-lg font-black text-[9px] uppercase tracking-widest gap-2">
                              <PenTool className="h-3 w-3" /> Draw
                            </TabsTrigger>
                            <TabsTrigger value="type" className="rounded-lg font-black text-[9px] uppercase tracking-widest gap-2">
                              <Type className="h-3 w-3" /> Type
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="draw" className="space-y-4">
                            <div className="relative bg-muted/10 rounded-2xl border-2 border-dashed border-accent/10 overflow-hidden">
                              <canvas 
                                ref={canvasRef}
                                width={600}
                                height={200}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className="w-full h-[150px] cursor-crosshair touch-none"
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={clearCanvas}
                                className="absolute bottom-2 right-2 h-8 w-8 bg-white/80 backdrop-blur shadow-sm rounded-lg text-destructive hover:bg-destructive hover:text-white transition-all"
                              >
                                <Eraser className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-[8px] font-black uppercase text-center text-accent/30 tracking-widest">Ink Surface: High-Fidelity Capture</p>
                          </TabsContent>

                          <TabsContent value="type" className="space-y-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Legal Name</Label>
                                <Input 
                                  value={typedName} 
                                  onChange={(e) => setTypedName(e.target.value)}
                                  placeholder="Full Identity Name..." 
                                  className="h-12 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent italic"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Style Synthesis</Label>
                                <div className="grid grid-cols-1 gap-2">
                                  {fonts.map((f) => (
                                    <button
                                      key={f.value}
                                      onClick={() => setSelectedFont(f.value)}
                                      className={cn(
                                        "p-4 rounded-xl border text-xl text-center transition-all",
                                        selectedFont === f.value 
                                          ? "border-primary bg-primary/5 ring-1 ring-primary shadow-lg" 
                                          : "bg-white border-accent/5 hover:border-primary/20"
                                      )}
                                      style={{ fontFamily: f.value }}
                                    >
                                      {typedName || "Signature Style"}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="space-y-6 pt-6 border-t border-accent/5">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                                  <Layers className="h-3 w-3" /> Target Page
                                </Label>
                                <div className="flex items-center gap-2">
                                   <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-10 w-10 rounded-lg"
                                    onClick={() => setTargetPage(prev => Math.max(1, prev - 1))}
                                   >
                                      <ChevronLeft className="h-4 w-4" />
                                   </Button>
                                   <div className="flex-1 h-10 bg-muted/20 rounded-lg flex items-center justify-center font-black text-xs text-accent">
                                      {targetPage} / {totalPages}
                                   </div>
                                   <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-10 w-10 rounded-lg"
                                    onClick={() => setTargetPage(prev => Math.min(totalPages, prev + 1))}
                                   >
                                      <ChevronRight className="h-4 w-4" />
                                   </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                                  <Settings2 className="h-3 w-3" /> Placement
                                </Label>
                                <Select value={position} onValueChange={(v: any) => setPosition(v)}>
                                  <SelectTrigger className="h-10 rounded-lg bg-white border-accent/10 font-bold uppercase text-[9px] tracking-widest">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl border-accent/10">
                                    {["top-left", "top-center", "top-right", "center", "bottom-left", "bottom-center", "bottom-right"].map(pos => (
                                      <SelectItem key={pos} value={pos} className="text-[10px] font-bold uppercase">{pos.replace('-', ' ')}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                           </div>

                           <Button 
                            onClick={handleDeploy} 
                            disabled={isProcessing || (mode === 'type' && !typedName)}
                            className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                            Execute Signature
                          </Button>
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
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Identity Embedded!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Your digital signature has been permanently synthesized into the asset.</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `signed_${pdfFile?.name || 'asset.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Signed Asset
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                Sign Another Asset
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
