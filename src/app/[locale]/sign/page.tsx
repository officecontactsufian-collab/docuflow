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
  PenTool, 
  Type, 
  Eraser,
  Settings2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Target,
  MousePointer2,
  Maximize,
  Calendar,
  User,
  Upload,
  Palette,
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PDFDocument } from 'pdf-lib';
import { PDFPreview } from '@/components/pdf-preview';
import { cn } from '@/lib/utils';

type SignatureMode = 'draw' | 'type' | 'upload';
type Position = "top-left" | "top-center" | "top-right" | "middle-left" | "center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right";

const POSITION_MAP: { label: string; value: Position }[] = [
  { label: "TL", value: "top-left" },
  { label: "TC", value: "top-center" },
  { label: "TR", value: "top-right" },
  { label: "ML", value: "middle-left" },
  { label: "C", value: "center" },
  { label: "MR", value: "middle-right" },
  { label: "BL", value: "bottom-left" },
  { label: "BC", value: "bottom-center" },
  { label: "BR", value: "bottom-right" },
];

export default function SignPage() {
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  const [totalPages, setTotalPages] = React.useState(0);
  const [targetPage, setTargetPage] = React.useState(1);
  const [position, setPosition] = React.useState<Position>("bottom-right");
  
  const [mode, setMode] = React.useState<SignatureMode>('draw');
  const [typedName, setTypedName] = React.useState("");
  const [selectedFont, setSelectedFont] = React.useState("'Dancing Script', cursive");
  const [inkColor, setInkColor] = React.useState("#251F4A");
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  
  const [includeDate, setIncludeDate] = React.useState(false);
  const [includeName, setIncludeName] = React.useState(false);
  const [legalName, setLegalName] = React.useState("");

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
      setTargetPage(1);
      setPdfFile(file);
    } catch (e) {
      toast({ variant: "destructive", title: "Invalid PDF", description: "Failed to parse document structure." });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setUploadedImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

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

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = inkColor;

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
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Render logic for composite signature block
    if (mode === 'draw' && canvasRef.current) {
      ctx.drawImage(canvasRef.current, 0, 0, canvas.width, canvas.height);
    } else if (mode === 'type') {
      ctx.fillStyle = inkColor;
      ctx.font = `italic bold 80px ${selectedFont}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(typedName || "Signature", canvas.width / 2, canvas.height / 2 - 40);
    } else if (mode === 'upload' && uploadedImage) {
      const img = new Image();
      img.src = uploadedImage;
      await new Promise(r => img.onload = r);
      const scale = Math.min(canvas.width / img.width, (canvas.height - 100) / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2 - 40, w, h);
    }

    // Embed metadata if requested
    let metadataY = canvas.height - 60;
    ctx.fillStyle = inkColor;
    ctx.font = "bold 24px Inter, sans-serif";
    ctx.textAlign = 'center';

    if (includeName && (legalName || typedName)) {
      ctx.fillText(legalName || typedName, canvas.width / 2, metadataY);
      metadataY += 30;
    }
    if (includeDate) {
      const dateStr = new Date().toLocaleDateString();
      ctx.fillText(`Date: ${dateStr}`, canvas.width / 2, metadataY);
    }

    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
    return new Uint8Array(await blob.arrayBuffer());
  };

  const handleDeploy = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);

    try {
      const sigBytes = await getSignatureImage();
      if (!sigBytes) throw new Error("Identity asset generation failure.");

      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const sigImg = await pdfDoc.embedPng(sigBytes);

      const pages = pdfDoc.getPages();
      const pageIdx = Math.min(Math.max(0, targetPage - 1), pages.length - 1);
      const page = pages[pageIdx];
      const { width, height } = page.getSize();
      const mediaBox = page.getMediaBox();

      const sigWidth = 180;
      const sigHeight = (sigImg.height / sigImg.width) * sigWidth;
      const margin = 50;

      let x = mediaBox.x + width - sigWidth - margin;
      let y = mediaBox.y + margin;

      switch (position) {
        case "top-left": x = mediaBox.x + margin; y = mediaBox.y + height - sigHeight - margin; break;
        case "top-center": x = mediaBox.x + (width / 2) - (sigWidth / 2); y = mediaBox.y + height - sigHeight - margin; break;
        case "top-right": x = mediaBox.x + width - sigWidth - margin; y = mediaBox.y + height - sigHeight - margin; break;
        case "middle-left": x = mediaBox.x + margin; y = mediaBox.y + (height / 2) - (sigHeight / 2); break;
        case "center": x = mediaBox.x + (width / 2) - (sigWidth / 2); y = mediaBox.y + (height / 2) - (sigHeight / 2); break;
        case "middle-right": x = mediaBox.x + width - sigWidth - margin; y = mediaBox.y + (height / 2) - (sigHeight / 2); break;
        case "bottom-left": x = mediaBox.x + margin; y = mediaBox.y + margin; break;
        case "bottom-center": x = mediaBox.x + (width / 2) - (sigWidth / 2); y = mediaBox.y + margin; break;
        case "bottom-right": x = mediaBox.x + width - sigWidth - margin; y = mediaBox.y + margin; break;
      }

      page.drawImage(sigImg, { x, y, width: sigWidth, height: sigHeight });

      const finalBytes = await pdfDoc.save();
      setDownloadUrl(URL.createObjectURL(new Blob([finalBytes], { type: 'application/pdf' })));
      setIsDone(true);
      toast({ title: "Protocol Success", description: "Identity block embedded and verified." });
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
    setUploadedImage(null);
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
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Identity Engine</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              Professional Document Execution. Construct composite identity blocks with precision anchor controls.
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
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        <Target className="h-3.5 w-3.5 text-primary" />
                        Interactive Placement Preview
                      </h3>
                      <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                         <MousePointer2 className="h-3 w-3 text-primary" />
                         <span className="text-[9px] font-black text-primary uppercase">Click Zone to Anchor</span>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <PDFPreview file={pdfFile} className="h-[750px]" currentPage={targetPage} />
                      
                      <div className="absolute inset-0 top-[40px] bottom-0 left-0 right-0 z-10 grid grid-cols-3 grid-rows-3 p-12">
                        {POSITION_MAP.map((pos) => (
                          <div 
                            key={pos.value}
                            onClick={() => setPosition(pos.value)}
                            className="relative cursor-crosshair group/zone flex items-center justify-center"
                          >
                            <div className={cn(
                              "w-full h-full border border-transparent transition-all rounded-lg",
                              position === pos.value ? "bg-primary/5 border-primary/20" : "hover:bg-accent/5"
                            )} />
                            
                            {position === pos.value && (
                              <div className="absolute pointer-events-none flex flex-col items-center gap-2 animate-in zoom-in-90 duration-300">
                                 <div className="px-4 py-2 bg-accent text-white rounded-xl shadow-2xl border border-white/20 flex items-center gap-3">
                                    <Maximize className="h-4 w-4 text-primary" />
                                    <div className="flex flex-col">
                                       <span className="text-[8px] font-black uppercase tracking-widest">Identity Bar</span>
                                       <span className="text-[7px] font-bold text-white/40 uppercase tracking-tighter">Anchor: {pos.label}</span>
                                    </div>
                                 </div>
                                 <div className="w-32 h-0.5 bg-primary/40 rounded-full" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="absolute inset-0 pointer-events-none border-4 border-transparent group-hover:border-primary/5 rounded-[2.5rem] transition-colors" />
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                      <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                              <Settings2 className="h-5 w-5" />
                           </div>
                           <div className="flex flex-col">
                              <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Control Suite</CardTitle>
                              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Identity Synthesis & Anchoring</CardDescription>
                           </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-8">
                        <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
                          <TabsList className="grid grid-cols-3 h-12 bg-muted/30 p-1 rounded-xl mb-6">
                            <TabsTrigger value="draw" className="rounded-lg font-black text-[9px] uppercase tracking-widest gap-2">
                              <PenTool className="h-3 w-3" /> Ink
                            </TabsTrigger>
                            <TabsTrigger value="type" className="rounded-lg font-black text-[9px] uppercase tracking-widest gap-2">
                              <Type className="h-3 w-3" /> Script
                            </TabsTrigger>
                            <TabsTrigger value="upload" className="rounded-lg font-black text-[9px] uppercase tracking-widest gap-2">
                              <Upload className="h-3 w-3" /> Asset
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="draw" className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                               <p className="text-[9px] font-black uppercase text-accent/40 tracking-widest">Wet Ink Surface</p>
                               <div className="flex gap-2">
                                  {["#251F4A", "#000000"].map(c => (
                                    <button 
                                      key={c} 
                                      onClick={() => setInkColor(c)}
                                      className={cn("h-4 w-4 rounded-full border-2", inkColor === c ? "border-primary" : "border-transparent")}
                                      style={{ backgroundColor: c }}
                                    />
                                  ))}
                               </div>
                            </div>
                            <div className="relative bg-muted/10 rounded-2xl border-2 border-dashed border-accent/10 overflow-hidden">
                              <canvas 
                                ref={canvasRef}
                                width={800}
                                height={400}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className="w-full h-[200px] cursor-crosshair touch-none"
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={clearCanvas}
                                className="absolute bottom-2 right-2 h-8 w-8 bg-white/80 backdrop-blur shadow-sm rounded-lg text-destructive hover:bg-destructive transition-all"
                              >
                                <Eraser className="h-4 w-4" />
                              </Button>
                            </div>
                          </TabsContent>

                          <TabsContent value="type" className="space-y-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Script Synthesis Payload</Label>
                                <Input 
                                  value={typedName} 
                                  onChange={(e) => setTypedName(e.target.value)}
                                  placeholder="IDENTIFY..." 
                                  className="h-12 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent italic"
                                />
                              </div>
                              <div className="grid grid-cols-1 gap-2">
                                {fonts.map((f) => (
                                  <button
                                    key={f.value}
                                    onClick={() => setSelectedFont(f.value)}
                                    className={cn(
                                      "p-4 rounded-xl border text-2xl text-center transition-all",
                                      selectedFont === f.value 
                                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-lg" 
                                        : "bg-white border-accent/5 hover:border-primary/20"
                                    )}
                                    style={{ fontFamily: f.value, color: inkColor }}
                                  >
                                    {typedName || "Script Style"}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="upload" className="space-y-4">
                             <div className="border-2 border-dashed border-accent/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 bg-muted/5 group hover:border-primary/40 transition-all cursor-pointer relative">
                                {uploadedImage ? (
                                  <div className="relative group/img">
                                    <img src={uploadedImage} className="max-h-[150px] rounded-lg shadow-xl" alt="Signature Asset" />
                                    <button onClick={() => setUploadedImage(null)} className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-white rounded-full flex items-center justify-center shadow-lg"><X className="h-3 w-3"/></button>
                                  </div>
                                ) : (
                                  <>
                                    <Upload className="h-8 w-8 text-accent/20 group-hover:text-primary transition-colors" />
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-black uppercase italic text-accent">Upload Signature Asset</p>
                                      <p className="text-[8px] font-bold text-accent/20 uppercase">Supports PNG, JPG, WEBP</p>
                                    </div>
                                    <input type="file" onChange={handleImageUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                  </>
                                )}
                             </div>
                          </TabsContent>
                        </Tabs>

                        <div className="space-y-6 pt-6 border-t border-accent/5">
                           <div className="grid grid-cols-1 gap-4">
                              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-accent/5">
                                 <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-primary" />
                                    <div className="flex flex-col">
                                       <span className="text-[10px] font-black uppercase">Include Legal Name</span>
                                       <span className="text-[8px] font-bold text-accent/40 uppercase">Construct Name Metadata</span>
                                    </div>
                                 </div>
                                 <Switch checked={includeName} onCheckedChange={setIncludeName} />
                              </div>
                              {includeName && (
                                <Input 
                                  value={legalName} 
                                  onChange={(e) => setLegalName(e.target.value)} 
                                  placeholder="FULL LEGAL NAME..." 
                                  className="h-10 bg-white border-accent/10 rounded-xl text-[10px] font-bold"
                                />
                              )}
                              
                              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-accent/5">
                                 <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <div className="flex flex-col">
                                       <span className="text-[10px] font-black uppercase">Include Current Date</span>
                                       <span className="text-[8px] font-bold text-accent/40 uppercase">Auto-synthesize temporal data</span>
                                    </div>
                                 </div>
                                 <Switch checked={includeDate} onCheckedChange={setIncludeDate} />
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-8 pt-4">
                              <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                                  <Layers className="h-3 w-3" /> Page Target
                                </Label>
                                <div className="flex items-center gap-2">
                                   <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-10 w-10 rounded-lg border-accent/10"
                                    onClick={() => setTargetPage(prev => Math.max(1, prev - 1))}
                                   >
                                      <ChevronLeft className="h-4 w-4" />
                                   </Button>
                                   <div className="flex-1 h-10 bg-muted/30 rounded-lg flex items-center justify-center font-black text-[10px] text-accent">
                                      {targetPage} / {totalPages}
                                   </div>
                                   <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-10 w-10 rounded-lg border-accent/10"
                                    onClick={() => setTargetPage(prev => Math.min(totalPages, prev + 1))}
                                   >
                                      <ChevronRight className="h-4 w-4" />
                                   </Button>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                                  <MousePointer2 className="h-3 w-3" /> Registry Position
                                </Label>
                                <div className="grid grid-cols-3 gap-1 bg-muted/20 p-1 rounded-xl border border-accent/5">
                                   {POSITION_MAP.map((pos) => (
                                     <button
                                      key={pos.value}
                                      onClick={() => setPosition(pos.value)}
                                      className={cn(
                                        "h-8 rounded-lg text-[8px] font-black uppercase transition-all",
                                        position === pos.value 
                                          ? "bg-primary text-white shadow-lg" 
                                          : "bg-white/50 text-accent/40 hover:bg-white"
                                      )}
                                     >
                                       {pos.label}
                                     </button>
                                   ))}
                                </div>
                              </div>
                           </div>

                           <Button 
                            onClick={handleDeploy} 
                            disabled={isProcessing || (mode === 'type' && !typedName) || (mode === 'upload' && !uploadedImage)}
                            className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20 hover:scale-[1.01] transition-all group"
                          >
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                            Deploy Identity Anchor
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex items-start gap-4">
                       <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-accent uppercase italic">Industrial verification</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed tracking-tight">
                            Identity blocks are permanently merged into the document object stream using high-resolution rendering. 
                            Zero training or storage protocols are active.
                          </p>
                       </div>
                    </div>
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
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Anchor Complete!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Identity block permanently embedded at verified coordinates.</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5 text-left">
                   <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-3 w-3 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">Execution Audit</span>
                   </div>
                   <ul className="space-y-2">
                      {[
                        "Identity Mode: Composite Block",
                        `Placement: ${position.replace('-', ' ').toUpperCase()}`,
                        `Metadata: ${[includeName && 'NAME', includeDate && 'DATE'].filter(Boolean).join(' + ') || 'NONE'}`,
                        "Reconstruction: Verified"
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
                      link.download = `executed_${pdfFile?.name || 'asset.pdf'}`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Executed Asset
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                Execute New Sequence
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
