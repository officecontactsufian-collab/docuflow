"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Loader2, 
  Download, 
  CheckCircle2, 
  Trash2, 
  ShieldCheck, 
  Zap, 
  Upload,
  X,
  CameraOff,
  Play,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';
import { cn } from '@/lib/utils';

export default function ScanToPdfPage() {
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const [capturedImages, setCapturedImages] = React.useState<string[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setIsCameraActive(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Camera Access Denied' });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    setCapturedImages(prev => [...prev, canvasRef.current!.toDataURL('image/jpeg', 0.9)]);
  };

  const handleDeploy = async () => {
    if (capturedImages.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const imgUri of capturedImages) {
        const imgBytes = await fetch(imgUri).then(res => res.arrayBuffer());
        const embeddedImg = await pdfDoc.embedJpg(imgBytes);
        const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
        page.drawImage(embeddedImg, { x: 0, y: 0, width: embeddedImg.width, height: embeddedImg.height });
      }
      const pdfBytes = await pdfDoc.save();
      setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      setIsDone(true);
      stopCamera();
    } catch (e) {
      toast({ variant: "destructive", title: "Sequence Failed" });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setCapturedImages([]);
    setIsDone(false);
    setDownloadUrl(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <Camera className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Industrial Scanner</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">Direct Hardware-to-PDF Tunnel.</p>
          </div>

          {!isDone ? (
            <div className="grid lg:grid-cols-12 gap-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="lg:col-span-7 space-y-6">
                <div className="relative rounded-[3rem] border-4 border-accent/10 bg-black overflow-hidden shadow-2xl aspect-[4/3] flex items-center justify-center">
                  <video ref={videoRef} className={cn("w-full h-full object-cover", !isCameraActive && "hidden")} autoPlay muted playsInline />
                  <canvas ref={canvasRef} className="hidden" />
                  {!isCameraActive && (
                    <div className="flex flex-col items-center gap-6 p-12 text-center">
                      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-white/20"><CameraOff className="h-12 w-12" /></div>
                      <Button onClick={startCamera} className="h-12 px-8 rounded-xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-xl"><Zap className="mr-2 h-4 w-4" /> Initialize Camera</Button>
                    </div>
                  )}
                  {isCameraActive && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                      <Button onClick={captureFrame} className="h-20 w-20 rounded-full bg-white text-accent hover:scale-110 active:scale-95 transition-all shadow-2xl border-8 border-accent/20"><Zap className="h-8 w-8 fill-primary text-primary" /></Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden flex flex-col h-full min-h-[500px]">
                  <div className="p-8 border-b flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase italic text-accent">Staged Assets</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{capturedImages.length} Pages</p>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                      {capturedImages.map((img, i) => (
                        <div key={i} className="relative group rounded-2xl overflow-hidden aspect-[3/4]">
                          <img src={img} className="w-full h-full object-cover" alt="" />
                          <Button variant="destructive" size="icon" onClick={() => setCapturedImages(prev => prev.filter((_, j) => i !== j))} className="absolute top-2 right-2 h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 bg-muted/30 mt-auto"><Button onClick={handleDeploy} disabled={capturedImages.length === 0 || isProcessing} className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase text-[11px] shadow-2xl">{isProcessing ? <Loader2 className="animate-spin" /> : <Play className="mr-2 h-4 w-4" />} Compile PDF Stream</Button></div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in slide-in-from-bottom-8 duration-700">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-12 space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 className="h-10 w-10" /></div>
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Scan Compiled!</h2>
                <Button size="lg" onClick={() => { if (downloadUrl) { const link = document.createElement('a'); link.href = downloadUrl; link.download = `Scan_${new Date().getTime()}.pdf`; link.click(); } }} className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl text-[11px] font-black uppercase tracking-widest"><Download className="mr-2 h-4 w-4" /> Download Scanned PDF</Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Restart Sequence</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
