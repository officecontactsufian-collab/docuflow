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
  RefreshCcw, 
  FileText,
  Plus,
  Play,
  AlertCircle,
  Upload,
  X,
  CameraOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

export default function ScanToPdfPage() {
  const [isCameraActive, setIsCameraActive] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [capturedImages, setCapturedImages] = React.useState<string[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasCameraPermission(true);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setIsCameraActive(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable the camera option in your browser settings or use the direct upload fallback.',
      });
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
    setCapturedImages(prev => [...prev, dataUrl]);
    toast({ title: "Page Captured", description: `Asset ${capturedImages.length + 1} staged for PDF conversion.` });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setCapturedImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      toast({ title: "Assets Imported", description: `${files.length} images added to the compilation stream.` });
    }
  };

  const removeCapture = (idx: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== idx));
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
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsDone(true);
      stopCamera();
      toast({ title: "Protocol Success", description: `Compiled ${capturedImages.length} pages into industrial PDF.` });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Sequence Failed" });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setCapturedImages([]);
    setIsDone(false);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setHasCameraPermission(null);
  };

  React.useEffect(() => {
    return () => stopCamera();
  }, []);

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
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              Direct Hardware-to-PDF Tunnel. High-fidelity page capture with local structural fallback for manual uploads.
            </p>
          </div>

          {!isDone ? (
            <div className="grid lg:grid-cols-12 gap-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="lg:col-span-7 space-y-6">
                <div className="relative rounded-[3rem] border-4 border-accent/10 bg-black overflow-hidden shadow-2xl aspect-video md:aspect-[4/3] flex items-center justify-center group">
                  <video ref={videoRef} className={cn("w-full h-full object-cover", !isCameraActive && "hidden")} autoPlay muted playsInline />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {!isCameraActive && (
                    <div className="flex flex-col items-center gap-6 p-12 text-center">
                      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                        <CameraOff className="h-12 w-12" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black uppercase italic text-white/80">Hardware Standby</h3>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Secure tunnel ready for initialization</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          onClick={startCamera} 
                          className="h-12 px-8 rounded-xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-xl"
                        >
                          <Zap className="mr-2 h-4 w-4 fill-white" /> Initialize Camera
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          className="h-12 px-8 rounded-xl border-white/20 text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Upload Instead
                        </Button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileUpload} 
                          accept="image/*" 
                          multiple 
                          className="hidden" 
                        />
                      </div>
                    </div>
                  )}

                  {isCameraActive && (
                    <>
                      <div className="absolute top-6 left-6 z-10">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={stopCamera}
                          className="rounded-full px-4 h-8 text-[9px] font-black uppercase tracking-widest shadow-xl"
                        >
                          <X className="mr-1.5 h-3 w-3" /> Terminate Stream
                        </Button>
                      </div>
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                        <Button 
                          onClick={captureFrame} 
                          className="h-20 w-20 rounded-full bg-white text-accent hover:scale-110 active:scale-95 transition-all shadow-2xl border-8 border-accent/20"
                        >
                          <Zap className="h-8 w-8 fill-primary text-primary" />
                        </Button>
                      </div>
                    </>
                  )}

                  {hasCameraPermission === false && !isCameraActive && (
                    <div className="absolute inset-0 bg-accent/95 backdrop-blur-md flex items-center justify-center p-8 text-center z-20">
                      <div className="max-w-sm space-y-6">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                          <AlertCircle className="h-10 w-10 text-destructive" />
                        </div>
                        <Alert variant="destructive" className="bg-white border-none rounded-[2rem] p-8 shadow-2xl text-left">
                          <AlertTitle className="text-2xl font-black uppercase italic tracking-tighter text-destructive">Hardware Blocked</AlertTitle>
                          <AlertDescription className="text-[11px] font-bold uppercase tracking-widest mt-4 leading-relaxed text-muted-foreground">
                            Camera permission was denied. Use the <span className="text-destructive">Upload Instead</span> button or enable the camera option in your settings.
                          </AlertDescription>
                        </Alert>
                        <div className="flex justify-center gap-4">
                          <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-xl px-8 font-black uppercase text-[10px] tracking-widest" onClick={() => window.location.reload()}>
                            Retry
                          </Button>
                          <Button onClick={() => fileInputRef.current?.click()} className="bg-white text-accent rounded-xl px-8 font-black uppercase text-[10px] tracking-widest shadow-xl">
                            Upload Assets
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden flex flex-col h-full min-h-[500px]">
                  <div className="p-8 border-b border-accent/5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter text-accent">Staged Assets</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{capturedImages.length} Pages Indexed</p>
                    </div>
                    {capturedImages.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => setCapturedImages([])} className="text-[9px] font-black uppercase text-destructive hover:bg-destructive/5 px-3 rounded-full">
                        Clear Registry
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
                    {capturedImages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-20 py-20">
                        <Camera className="h-12 w-12" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Registry Standby...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {capturedImages.map((img, i) => (
                          <div key={i} className="relative group rounded-2xl overflow-hidden border border-accent/5 shadow-lg aspect-[3/4]">
                            <img src={img} className="w-full h-full object-cover" alt={`Capture ${i}`} />
                            <div className="absolute inset-0 bg-accent/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button variant="destructive" size="icon" onClick={() => removeCapture(i)} className="h-8 w-8 rounded-xl shadow-xl">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="absolute top-2 left-2 bg-accent text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                              Page {i + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-8 bg-muted/30 mt-auto flex flex-col gap-4">
                    <Button 
                      onClick={handleDeploy} 
                      disabled={capturedImages.length === 0 || isProcessing}
                      className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                    >
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4 fill-primary text-primary" />}
                      Compile PDF Stream
                    </Button>
                    <p className="text-[8px] text-center font-bold text-accent/40 uppercase tracking-widest italic">
                      Zero-retention local compilation
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in slide-in-from-bottom-8 duration-700">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden p-12 space-y-8">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Scan Compiled!</h2>
                  <p className="text-muted-foreground text-sm font-medium">Your assets have been serialized into a verified PDF container.</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-2xl border border-accent/5 text-left">
                   <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-3 w-3 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">Asset Integrity Verified</span>
                   </div>
                   <p className="text-[10px] font-bold text-accent/40 uppercase tracking-tight italic">
                     {capturedImages.length} Pages • High-Fidelity Reconstruction
                   </p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (downloadUrl) {
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `DOCFLOW_Scan_${new Date().getTime()}.pdf`;
                      link.click();
                    }
                  }} 
                  className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Scanned PDF
                </Button>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                Restart Protocol Sequence
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
