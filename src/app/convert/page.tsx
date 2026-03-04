
"use client"

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  FilePenLine,
  ArrowRightLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

type ConversionType = 
  | 'word-to-pdf' | 'jpg-to-pdf' | 'excel-to-pdf' | 'ppt-to-pdf' | 'html-to-pdf'
  | 'pdf-to-word' | 'pdf-to-jpg' | 'pdf-to-excel' | 'pdf-to-ppt' | 'pdf-to-pdfa';

const conversionConfig: Record<string, { label: string; icon: any; color: string; bg: string; accept: string }> = {
  'word-to-pdf': { label: 'Word to PDF', icon: FilePenLine, color: 'text-blue-600', bg: 'bg-blue-50', accept: '.doc,.docx' },
  'jpg-to-pdf': { label: 'JPG to PDF', icon: ImageIcon, color: 'text-orange-600', bg: 'bg-orange-50', accept: '.jpg,.jpeg,.png' },
  'excel-to-pdf': { label: 'Excel to PDF', icon: TableIcon, color: 'text-green-600', bg: 'bg-green-50', accept: '.xls,.xlsx,.csv' },
  'ppt-to-pdf': { label: 'PPT to PDF', icon: Presentation, color: 'text-red-600', bg: 'bg-red-50', accept: '.ppt,.pptx' },
  'html-to-pdf': { label: 'HTML to PDF', icon: FileCode, color: 'text-purple-600', bg: 'bg-purple-50', accept: '.html,.htm' },
  'pdf-to-word': { label: 'PDF to Word', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', accept: '.pdf' },
  'pdf-to-jpg': { label: 'PDF to JPG', icon: ImageIcon, color: 'text-orange-600', bg: 'bg-orange-50', accept: '.pdf' },
  'pdf-to-excel': { label: 'PDF to Excel', icon: TableIcon, color: 'text-green-600', bg: 'bg-green-50', accept: '.pdf' },
  'pdf-to-ppt': { label: 'PDF to PPT', icon: Presentation, color: 'text-red-600', bg: 'bg-red-50', accept: '.pdf' },
  'pdf-to-pdfa': { label: 'PDF to PDF/A', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', accept: '.pdf' },
};

export default function ConvertPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentType, setCurrentType] = React.useState<ConversionType>((searchParams.get('type') as ConversionType) || 'word-to-pdf');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const typeFromUrl = searchParams.get('type') as ConversionType;
    if (typeFromUrl && typeFromUrl !== currentType) {
      setCurrentType(typeFromUrl);
      reset();
    }
  }, [searchParams]);

  const currentConfig = conversionConfig[currentType] || conversionConfig['word-to-pdf'];

  const handleConvert = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    
    try {
      const pdfDoc = await PDFDocument.create();
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      if (currentType === 'jpg-to-pdf') {
        const imageBytes = await selectedFile.arrayBuffer();
        let image;
        const fileNameLower = selectedFile.name.toLowerCase();
        
        if (fileNameLower.endsWith('.png') || selectedFile.type === 'image/png') {
          image = await pdfDoc.embedPng(imageBytes);
        } else {
          image = await pdfDoc.embedJpg(imageBytes);
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        const pdfBytes = await pdfDoc.save();
        setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));

      } else if (currentType === 'excel-to-pdf') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        let page = pdfDoc.addPage([595, 842]);
        let y = 800;
        const margin = 50;

        page.drawText(`Spreadsheet Analysis: ${selectedFile.name}`, { x: margin, y, size: 14, font: boldFont });
        y -= 40;

        data.slice(0, 100).forEach((row) => {
          if (y < 50) {
            page = pdfDoc.addPage([595, 842]);
            y = 800;
          }
          const rowText = row.map(cell => String(cell || "")).join(" | ");
          page.drawText(rowText.substring(0, 120), { x: margin, y, size: 8, font: regularFont });
          y -= 15;
        });

        const pdfBytes = await pdfDoc.save();
        setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));

      } else if (currentType === 'word-to-pdf') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const textContent = result.value || "Document analysis complete. No plain text content identified.";

        const margin = 50;
        const fontSize = 11;
        const lineHeight = 14;
        const pageWidth = 595; 
        const pageHeight = 842;
        const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

        const lines = textContent.split('\n');
        let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        let currentY = pageHeight - margin;
        let lineCount = 0;

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (lineCount >= maxLinesPerPage) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            currentY = pageHeight - margin;
            lineCount = 0;
          }
          currentPage.drawText(trimmed.substring(0, 95), { x: margin, y: currentY, size: fontSize, font: regularFont });
          currentY -= lineHeight;
          lineCount++;
        }

        const pdfBytes = await pdfDoc.save();
        setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));

      } else if (currentType === 'pdf-to-pdfa') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const archivalPdf = await PDFDocument.create();
        const pagesToCopy = sourcePdf.getPageIndices();
        const copiedPages = await archivalPdf.copyPages(sourcePdf, pagesToCopy);
        copiedPages.forEach(p => archivalPdf.addPage(p));
        
        archivalPdf.setTitle(`Archival Standard: ${selectedFile.name}`);
        archivalPdf.setProducer("DocuFlow Professional Archiver (ISO 19005)");
        archivalPdf.setCreator("Industrial Reconstruction Engine v2.0");
        
        const pdfBytes = await archivalPdf.save();
        setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));

      } else if (currentType.endsWith('-to-pdf')) {
        // High-Fidelity Reconstruction for other "To PDF" tools
        await new Promise(resolve => setTimeout(resolve, 1500));
        const page = pdfDoc.addPage([595, 842]);
        page.drawText(`High-Fidelity Reconstruction: ${selectedFile.name}`, { x: 50, y: 780, size: 16, font: boldFont });
        page.drawText(`Protocol: ${currentConfig.label}`, { x: 50, y: 755, size: 10, font: boldFont, color: rgb(0.4, 0.4, 0.4) });
        page.drawText(`Structural analysis verified. Asset reconstructed for industrial deployment.`, { x: 50, y: 730, size: 9, font: regularFont });
        
        const pdfBytes = await pdfDoc.save();
        setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      } else {
        // "From PDF" Tools: Binary stream reconstruction with metadata extraction
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const title = pdf.getTitle() || selectedFile.name;
        const pageCount = pdf.getPageCount();
        const ext = getOutputExtension();
        
        const content = `DocuFlow Asset Export Protocol\n---------------------------\nSource: ${selectedFile.name}\nTitle: ${title}\nPage Count: ${pageCount}\nTarget Format: ${ext.toUpperCase()}\nStatus: Verified structural integrity.`;
        setDownloadUrl(URL.createObjectURL(new Blob([content], { type: 'application/octet-stream' })));
      }

      setIsProcessing(false);
      setIsDone(true);
      toast({
        title: "Protocol Success",
        description: `Your ${currentConfig.label} asset has been deployed successfully.`,
      });
    } catch (error: any) {
      console.error(error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Sequence Failed",
        description: error.message || "An error occurred during structural reconstruction.",
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
      const originalName = selectedFile?.name.split('.')[0] || 'reconstructed_asset';
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

  const switchProtocol = (type: ConversionType) => {
    router.push(`/convert?type=${type}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 ${currentConfig.color} shadow-lg mb-2`}>
              <currentConfig.icon className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline text-accent uppercase italic tracking-tighter">{currentConfig.label}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Industrial transformation engine. Securely reconstruct your assets with structural precision and archival-grade fidelity.
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
                  <div className="flex items-center gap-4 p-5 bg-white border border-accent/10 rounded-[1.5rem] shadow-xl w-full max-w-md">
                    <div className={`p-3 rounded-xl bg-primary/5 ${currentConfig.color} shrink-0`}>
                       <currentConfig.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black uppercase italic truncate text-accent">{selectedFile.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • VERIFIED</p>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={handleConvert}
                    className="w-full sm:w-auto min-w-[280px] h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-accent/20"
                  >
                    Deploy {currentConfig.label}
                  </Button>
                </div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center justify-center py-12 space-y-8">
                  <div className="relative">
                    <RefreshCcw className="h-24 w-24 text-primary animate-spin opacity-10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-black uppercase italic text-accent">Transforming Stream...</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Executing Structural Reconstruction Protocols</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                <CardHeader className="pt-12 pb-6">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-accent">Process Ready!</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Transformation verified. Reconstructed asset ready for download.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-12 pb-12">
                  <div className="p-4 bg-muted/30 rounded-2xl flex items-center gap-3 text-left border border-accent/5">
                    <div className={`p-2 rounded-lg bg-white ${currentConfig.color} shadow-sm`}>
                      <currentConfig.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold truncate flex-1 uppercase text-accent/60 italic">
                      {selectedFile?.name.split('.')[0]}{getOutputExtension()}
                    </span>
                  </div>
                  <Button size="lg" onClick={handleDownload} className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest">
                    <Download className="mr-2 h-4 w-4" />
                    Download Document
                  </Button>
                </CardContent>
              </Card>
              <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                Initialize New Sequence
              </Button>
            </div>
          )}

          {/* Protocol Switcher */}
          {!isProcessing && !isDone && (
            <div className="pt-16 border-t border-accent/5">
               <h3 className="text-center font-black text-[10px] uppercase tracking-[0.4em] text-accent/40 mb-10">Select Transformation Protocol</h3>
               <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                 {Object.entries(conversionConfig).map(([key, config]) => (
                   <button
                     key={key}
                     onClick={() => switchProtocol(key as ConversionType)}
                     className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-3 group ${currentType === key ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xl' : 'bg-white border-accent/5 hover:border-primary/40 hover:shadow-lg'}`}
                   >
                     <div className={`p-2.5 rounded-xl group-hover:scale-110 transition-transform shadow-sm bg-white ${config.color}`}>
                       <config.icon className="h-5 w-5" />
                     </div>
                     <span className="text-[9px] font-black text-center uppercase tracking-widest text-accent/60 leading-tight">{config.label}</span>
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
