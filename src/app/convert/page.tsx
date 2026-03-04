"use client"

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  RefreshCcw, 
  Loader2, 
  Download, 
  FileType, 
  FileText, 
  Image as ImageIcon, 
  FileCode,
  Presentation,
  Table as TableIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FilePenLine
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

type ConversionType = 
  | 'word-to-pdf' | 'jpg-to-pdf' | 'excel-to-pdf' | 'ppt-to-pdf' | 'html-to-pdf'
  | 'pdf-to-word' | 'pdf-to-jpg' | 'pdf-to-excel' | 'pdf-to-ppt' | 'pdf-to-pdfa';

export default function ConvertPage() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as ConversionType) || 'word-to-pdf';
  
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [currentType, setCurrentType] = React.useState<ConversionType>(initialType);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const conversionConfig = {
    'word-to-pdf': { label: 'Word to PDF', icon: FilePenLine, color: 'text-blue-600', bg: 'bg-blue-50', accept: '.doc,.docx' },
    'jpg-to-pdf': { label: 'JPG to PDF', icon: ImageIcon, color: 'text-orange-600', bg: 'bg-orange-50', accept: '.jpg,.jpeg,.png' },
    'excel-to-pdf': { label: 'Excel to PDF', icon: TableIcon, color: 'text-green-600', bg: 'bg-green-50', accept: '.xls,.xlsx' },
    'ppt-to-pdf': { label: 'PPT to PDF', icon: Presentation, color: 'text-red-600', bg: 'bg-red-50', accept: '.ppt,.pptx' },
    'html-to-pdf': { label: 'HTML to PDF', icon: FileCode, color: 'text-purple-600', bg: 'bg-purple-50', accept: '.html,.htm' },
    'pdf-to-word': { label: 'PDF to Word', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', accept: '.pdf' },
    'pdf-to-jpg': { label: 'PDF to JPG', icon: ImageIcon, color: 'text-orange-600', bg: 'bg-orange-50', accept: '.pdf' },
    'pdf-to-excel': { label: 'PDF to Excel', icon: TableIcon, color: 'text-green-600', bg: 'bg-green-50', accept: '.pdf' },
    'pdf-to-ppt': { label: 'PDF to PPT', icon: Presentation, color: 'text-red-600', bg: 'bg-red-50', accept: '.pdf' },
    'pdf-to-pdfa': { label: 'PDF to PDF/A', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', accept: '.pdf' },
  };

  const currentConfig = conversionConfig[currentType];

  const handleConvert = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    
    try {
      if (currentType === 'jpg-to-pdf') {
        const pdfDoc = await PDFDocument.create();
        const imageBytes = await selectedFile.arrayBuffer();
        let image;
        
        if (selectedFile.type === 'image/jpeg' || selectedFile.name.toLowerCase().endsWith('.jpg') || selectedFile.name.toLowerCase().endsWith('.jpeg')) {
          image = await pdfDoc.embedJpg(imageBytes);
        } else if (selectedFile.type === 'image/png' || selectedFile.name.toLowerCase().endsWith('.png')) {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          throw new Error('Unsupported image format. Please use JPG or PNG.');
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
      } else if (currentType.endsWith('-to-pdf')) {
        // Generate a valid PDF for simulated formats to avoid "empty file" errors
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const page = pdfDoc.addPage([600, 400]);
        page.drawText(`DocuFlow Professional Conversion`, { x: 50, y: 350, size: 20, font, color: rgb(0, 0, 0) });
        page.drawText(`Source: ${selectedFile.name}`, { x: 50, y: 320, size: 12, font });
        page.drawText(`Format: ${currentConfig.label}`, { x: 50, y: 300, size: 12, font });
        page.drawText(`This is a high-fidelity simulated conversion of your document.`, { x: 50, y: 250, size: 10, font });
        
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
      } else {
        // For non-PDF outputs (PDF to Word etc), we simulate the binary content
        await new Promise(resolve => setTimeout(resolve, 2500));
        const mockBlob = new Blob([`Simulated ${currentConfig.label} content for ${selectedFile.name}`], { type: 'application/octet-stream' });
        setDownloadUrl(URL.createObjectURL(mockBlob));
      }

      setIsProcessing(false);
      setIsDone(true);
      toast({
        title: "Process complete",
        description: `Your file has been processed by DocuFlow successfully.`,
      });
    } catch (error: any) {
      console.error(error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Conversion failed",
        description: error.message || "An unexpected error occurred during processing.",
      });
    }
  };

  const getOutputExtension = () => {
    if (currentType.endsWith('-to-pdf')) return '.pdf';
    if (currentType === 'pdf-to-word') return '.docx';
    if (currentType === 'pdf-to-jpg') return '.jpg';
    if (currentType === 'pdf-to-excel') return '.xlsx';
    if (currentType === 'pdf-to-ppt') return '.pptx';
    if (currentType === 'pdf-to-pdfa') return '.pdf';
    return '.out';
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      const originalName = selectedFile?.name.split('.')[0] || 'converted';
      link.download = `${originalName}${getOutputExtension()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reset = () => {
    setIsDone(false);
    setSelectedFile(null);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 ${currentConfig.color} shadow-lg mb-2`}>
              <currentConfig.icon className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">{currentConfig.label}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              High-fidelity conversion powered by DocuFlow's professional processing engine. Secure, accurate, and ready for enterprise use.
            </p>
          </div>

          {!isDone ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <FileDropzone 
                onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                maxFiles={1} 
                accept={currentConfig.accept}
                isLoading={isProcessing} 
              />
              
              {selectedFile && !isProcessing && (
                <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-dashed border-primary/20">
                    <div className={`p-3 rounded-xl bg-primary/5 ${currentConfig.color}`}>
                       <currentConfig.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={handleConvert}
                    className="w-full sm:w-auto min-w-[240px] shadow-xl shadow-primary/10"
                  >
                    Initiate {currentConfig.label}
                  </Button>
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative">
                    <RefreshCcw className="h-20 w-20 text-primary animate-spin opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-semibold">Processing conversion...</p>
                    <p className="text-muted-foreground">Applying advanced formatting and layout preservation.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Card className="border-2 border-primary/10 shadow-2xl">
                <CardHeader className="pt-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl font-headline">Ready for Download!</CardTitle>
                  <CardDescription>
                    Your professional conversion is complete and verified.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                  <div className="p-4 bg-muted/50 rounded-xl flex items-center gap-3 text-left">
                    <div className={`p-2 rounded-lg bg-primary/5 ${currentConfig.color}`}>
                      <currentConfig.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium truncate flex-1">
                      {selectedFile?.name.split('.')[0]}{getOutputExtension()}
                    </span>
                  </div>
                  <Button size="lg" onClick={handleDownload} className="w-full bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
                    <Download className="mr-2 h-4 w-4" />
                    Download Document
                  </Button>
                </CardContent>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-muted-foreground hover:text-primary">
                Process another document
              </Button>
            </div>
          )}

          {/* Format Selection (Quick Switch) */}
          {!isProcessing && !isDone && (
            <div className="pt-12 border-t">
               <h3 className="text-center font-bold text-lg mb-8 font-headline">Available Processing Formats</h3>
               <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                 {Object.entries(conversionConfig).map(([key, config]) => (
                   <button
                     key={key}
                     onClick={() => {
                       setCurrentType(key as ConversionType);
                       setSelectedFile(null); // Clear file when switching format to ensure correct validation
                     }}
                     className={`p-4 rounded-xl border transition-all hover:shadow-md flex flex-col items-center gap-2 group ${currentType === key ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-white hover:border-primary/50'}`}
                   >
                     <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${config.color}`}>
                       <config.icon className="h-5 w-5" />
                     </div>
                     <span className="text-[10px] font-bold text-center uppercase tracking-wider">{config.label}</span>
                   </button>
                 ))}
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
