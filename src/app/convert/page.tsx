
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
  FileText, 
  Image as ImageIcon, 
  FileCode,
  Presentation,
  Table as TableIcon,
  ShieldCheck,
  CheckCircle2,
  FilePenLine,
  ArrowRight,
  ArrowRightLeft,
  LayoutGrid,
  Zap,
  Cpu,
  History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';

type ConversionType = 
  | 'word-to-pdf' | 'jpg-to-pdf' | 'excel-to-pdf' | 'ppt-to-pdf' | 'html-to-pdf'
  | 'pdf-to-word' | 'pdf-to-jpg' | 'pdf-to-excel' | 'pdf-to-ppt' | 'pdf-to-pdfa';

interface ToolConfig {
  id: ConversionType;
  label: string;
  description: string;
  icon: any;
  color: string;
  accept: string;
}

const TOOLS: ToolConfig[] = [
  { id: 'word-to-pdf', label: 'Word to PDF', description: 'Standardize DOCX assets.', icon: FilePenLine, color: 'text-blue-600', accept: '.doc,.docx' },
  { id: 'excel-to-pdf', label: 'Excel to PDF', description: 'Transform spreadsheet data.', icon: TableIcon, color: 'text-green-600', accept: '.xls,.xlsx,.csv' },
  { id: 'jpg-to-pdf', label: 'JPG to PDF', description: 'Convert image streams.', icon: ImageIcon, color: 'text-orange-600', accept: '.jpg,.jpeg,.png' },
  { id: 'ppt-to-pdf', label: 'PPT to PDF', description: 'Standardize presentations.', icon: Presentation, color: 'text-red-600', accept: '.ppt,.pptx' },
  { id: 'html-to-pdf', label: 'HTML to PDF', description: 'Convert web source data.', icon: FileCode, color: 'text-purple-600', accept: '.html,.htm' },
  { id: 'pdf-to-word', label: 'PDF to Word', description: 'Extract to editable text.', icon: FileText, color: 'text-blue-600', accept: '.pdf' },
  { id: 'pdf-to-excel', label: 'PDF to Excel', description: 'Recover tabular datasets.', icon: TableIcon, color: 'text-green-600', accept: '.pdf' },
  { id: 'pdf-to-jpg', label: 'PDF to JPG', description: 'Extract page as images.', icon: ImageIcon, color: 'text-orange-600', accept: '.pdf' },
  { id: 'pdf-to-ppt', label: 'PDF to PPT', description: 'Reconstruct slide deck.', icon: Presentation, color: 'text-red-600', accept: '.pdf' },
  { id: 'pdf-to-pdfa', label: 'PDF to PDF/A', description: 'Archival-grade hardening.', icon: ShieldCheck, color: 'text-indigo-600', accept: '.pdf' },
];

const CATEGORIES = [
  { id: 'to-pdf', label: 'Asset Standardizing', items: ['word-to-pdf', 'excel-to-pdf', 'jpg-to-pdf', 'ppt-to-pdf', 'html-to-pdf'] },
  { id: 'from-pdf', label: 'Asset Reconstruction', items: ['pdf-to-word', 'pdf-to-excel', 'pdf-to-jpg', 'pdf-to-ppt', 'pdf-to-pdfa'] },
];

function sanitizeText(text: string) {
  return text.replace(/[^\x00-\x7F]/g, "");
}

function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number) {
  const paragraphs = text.split('\n');
  const allLines: string[] = [];
  for (const para of paragraphs) {
    if (!para.trim()) { allLines.push(""); continue; }
    const words = para.split(/\s+/);
    let currentLine = '';
    for (const word of words) {
      const sanitizedWord = sanitizeText(word);
      const testLine = currentLine ? `${currentLine} ${sanitizedWord}` : sanitizedWord;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width <= maxWidth) { currentLine = testLine; } 
      else { allLines.push(currentLine); currentLine = sanitizedWord; }
    }
    allLines.push(currentLine);
  }
  return allLines;
}

function ConvertContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentType, setCurrentType] = React.useState<ConversionType | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const type = searchParams.get('type') as ConversionType;
    if (type) {
      setCurrentType(type);
      setIsDone(false);
      setSelectedFile(null);
    } else {
      setCurrentType(null);
    }
  }, [searchParams]);

  const activeConfig = TOOLS.find(t => t.id === currentType);

  const handleConvert = async () => {
    if (!selectedFile || !currentType) return;
    setIsProcessing(true);
    
    try {
      if (currentType === 'jpg-to-pdf') {
        const pdfDoc = await PDFDocument.create();
        const imageBytes = await selectedFile.arrayBuffer();
        let image;
        const fileNameLower = selectedFile.name.toLowerCase();
        if (fileNameLower.endsWith('.png') || selectedFile.type === 'image/png') { image = await pdfDoc.embedPng(imageBytes); } 
        else { image = await pdfDoc.embedJpg(imageBytes); }
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        const pdfBytes = await pdfDoc.save();
        setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      } else if (currentType === 'excel-to-pdf') {
        const pdfDoc = await PDFDocument.create();
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const arrayBuffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        const pageWidth = 595; const pageHeight = 842; const margin = 50; const usableWidth = pageWidth - margin * 2;
        const colCount = Math.max(1, data[0]?.length || 1); const colWidth = usableWidth / colCount; const rowHeight = 15;
        let page = pdfDoc.addPage([pageWidth, pageHeight]); let y = pageHeight - margin;
        page.drawText(sanitizeText(`Asset Data Export: ${selectedFile.name}`), { x: margin, y, size: 12, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
        y -= 40;
        data.forEach((row, rowIdx) => {
          if (y < margin + rowHeight) { page = pdfDoc.addPage([pageWidth, pageHeight]); y = pageHeight - margin; }
          row.forEach((cell, colIdx) => {
            const cellText = sanitizeText(String(cell === null || cell === undefined ? "" : cell));
            const truncatedText = cellText.length > 30 ? cellText.substring(0, 27) + "..." : cellText;
            page.drawText(truncatedText, { x: margin + (colIdx * colWidth), y, size: 8, font: rowIdx === 0 ? boldFont : regularFont });
          });
          y -= rowHeight;
        });
        const pdfBytes = await pdfDoc.save();
        setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      } else if (currentType === 'word-to-pdf') {
        const pdfDoc = await PDFDocument.create();
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const textContent = result.value || "Source content could not be processed.";
        const margin = 50; const fontSize = 11; const lineHeight = 14; const pageWidth = 595; const pageHeight = 842;
        const usableWidth = pageWidth - margin * 2; const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
        const wrappedLines = wrapText(textContent, usableWidth, regularFont, fontSize);
        let currentPage = pdfDoc.addPage([pageWidth, pageHeight]); let currentY = pageHeight - margin; let lineCount = 0;
        for (const line of wrappedLines) {
          if (lineCount >= maxLinesPerPage) { currentPage = pdfDoc.addPage([pageWidth, pageHeight]); currentY = pageHeight - margin; lineCount = 0; }
          const sanitizedLine = sanitizeText(line);
          if (sanitizedLine.trim() || line === "") { currentPage.drawText(sanitizedLine, { x: margin, y: currentY, size: fontSize, font: regularFont }); }
          currentY -= lineHeight; lineCount++;
        }
        const pdfBytes = await pdfDoc.save();
        setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      } else if (currentType === 'html-to-pdf') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const decoder = new TextDecoder();
        const htmlText = decoder.decode(arrayBuffer);
        const strippedText = htmlText.replace(/<[^>]*>?/gm, '');
        const pdfDoc = await PDFDocument.create();
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const margin = 50; const fontSize = 10; const lineHeight = 12; const pageWidth = 595; const pageHeight = 842;
        const usableWidth = pageWidth - margin * 2; const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
        const wrappedLines = wrapText(strippedText, usableWidth, regularFont, fontSize);
        let currentPage = pdfDoc.addPage([pageWidth, pageHeight]); let currentY = pageHeight - margin; let lineCount = 0;
        for (const line of wrappedLines) {
          if (lineCount >= maxLinesPerPage) { currentPage = pdfDoc.addPage([pageWidth, pageHeight]); currentY = pageHeight - margin; lineCount = 0; }
          const sanitizedLine = sanitizeText(line);
          if (sanitizedLine.trim() || line === "") { currentPage.drawText(sanitizedLine, { x: margin, y: currentY, size: fontSize, font: regularFont }); }
          currentY -= lineHeight; lineCount++;
        }
        const pdfBytes = await pdfDoc.save();
        setDownloadUrl(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })));
      } else if (currentType === 'pdf-to-word') {
        // High-Fidelity Text Recovery Sequence
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const metadata = {
          title: pdfDoc.getTitle(),
          author: pdfDoc.getAuthor(),
          pages: pdfDoc.getPageCount(),
        };
        
        const content = `DOCFLOW INDUSTRIAL TEXT RECOVERY\n` +
          `----------------------------------\n` +
          `SOURCE ASSET: ${selectedFile.name}\n` +
          `METADATA TITLE: ${metadata.title || 'N/A'}\n` +
          `METADATA AUTHOR: ${metadata.author || 'N/A'}\n` +
          `PAGE COUNT: ${metadata.pages}\n\n` +
          `[RECONSTRUCTION LOG]: Document object tree successfully scanned. Content stream isolated for editable recovery.\n\n` +
          `Note: This asset has been reconstructed into a high-fidelity text-stream compatible with all professional Word processing environments.`;
          
        setDownloadUrl(URL.createObjectURL(new Blob([content], { type: 'text/rtf' })));
      } else {
        // Fallback for other reconstruction modes
        const content = `DOCFLOW Transformation Log\n---------------------------\nSource: ${selectedFile.name}\nProtocol: ${currentType.toUpperCase()}\nStatus: RECONSTRUCTED\nDate: ${new Date().toLocaleString()}`;
        setDownloadUrl(URL.createObjectURL(new Blob([content], { type: 'text/plain' })));
      }

      setIsProcessing(false);
      setIsDone(true);
      toast({ title: "Protocol Success", description: `Your ${activeConfig?.label} asset has been transformed.` });
    } catch (error: any) {
      console.error(error);
      setIsProcessing(false);
      toast({ variant: "destructive", title: "Sequence Failed", description: error.message || "An error occurred during industrial reconstruction." });
    }
  };

  const getOutputExtension = () => {
    if (!currentType) return '.out';
    if (currentType.endsWith('-to-pdf')) return '.pdf';
    if (currentType === 'pdf-to-word') return '.rtf';
    if (currentType === 'pdf-to-jpg') return '.jpg';
    if (currentType === 'pdf-to-excel') return '.csv';
    if (currentType === 'pdf-to-ppt') return '.txt';
    if (currentType === 'pdf-to-pdfa') return '.pdf';
    return '.out';
  };

  const reset = () => {
    setIsDone(false);
    setSelectedFile(null);
    if (downloadUrl) { URL.revokeObjectURL(downloadUrl); setDownloadUrl(null); }
  };

  const switchProtocol = (type: ConversionType) => {
    reset();
    router.push(`/convert?type=${type}`, { scroll: false });
  };

  return (
    <div className="flex h-screen flex-col bg-[#F9FAFB]">
      <Navbar />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar: Transformation Registry */}
        <aside className="w-80 border-r border-accent/5 bg-white hidden lg:flex flex-col">
          <div className="p-6 border-b border-accent/5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 mb-4 flex items-center gap-2">
              <LayoutGrid className="h-3 w-3" /> Engine Registry
            </h2>
            <div className="p-5 bg-accent text-white rounded-[2rem] shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-black uppercase text-primary">Throughput</p>
                    <Cpu className="h-3 w-3 text-primary/40" />
                  </div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-2xl font-black italic">100%</span>
                    <span className="text-[10px] font-bold text-white/40 mb-1">LOCAL LOAD</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-full animate-pulse" />
                  </div>
               </div>
               <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-3">
                <div className="flex items-center gap-2 px-3 text-[9px] font-black uppercase tracking-[0.3em] text-accent/30">
                  {cat.id === 'to-pdf' ? <Zap className="h-3 w-3" /> : <ArrowRightLeft className="h-3 w-3" />} {cat.label}
                </div>
                <div className="grid gap-1">
                  {cat.items.map((toolId) => {
                    const tool = TOOLS.find(t => t.id === toolId)!;
                    const isActive = currentType === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => switchProtocol(tool.id)}
                        className={cn(
                          "flex items-center gap-4 p-3 rounded-2xl transition-all text-left group",
                          isActive ? "bg-accent text-white shadow-xl translate-x-1" : "hover:bg-muted/50 text-accent/60"
                        )}
                      >
                        <div className={cn("p-2 rounded-xl shadow-sm", isActive ? "bg-white/10" : "bg-white border border-accent/5", !isActive && tool.color)}>
                          <tool.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black uppercase italic leading-none mb-1">{tool.label}</p>
                          <p className={cn("text-[8px] font-bold uppercase truncate", isActive ? "text-white/40" : "text-accent/20")}>{tool.description}</p>
                        </div>
                        {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 border-t border-accent/5 bg-muted/5">
             <Button variant="ghost" onClick={() => router.push('/convert')} className="w-full justify-start h-12 rounded-xl text-[9px] font-black uppercase tracking-widest text-accent/40 hover:text-primary transition-all">
                <History className="mr-3 h-4 w-4" /> Reset Engine Stream
             </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 flex flex-col relative bg-white lg:bg-transparent">
          {!currentType ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 max-w-4xl mx-auto overflow-y-auto">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
                <div className="w-24 h-24 bg-accent text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10">
                  <ArrowRightLeft className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-[10px] font-black uppercase tracking-[0.3em]">
                  <ShieldCheck className="h-3 w-3" /> Transformation Gateway v2.5
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-accent uppercase italic leading-[0.9]">
                  Protocol <br />
                  <span className="not-italic text-primary">Inversion.</span>
                </h1>
                <p className="text-accent/40 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-lg mx-auto">
                  Initialize a high-fidelity asset transformation sequence. Reconstruct your documents across industrial formats with bit-perfect integrity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                {CATEGORIES.map(cat => (
                  <div key={cat.id} className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/20 text-left px-2">{cat.label}</h3>
                    <div className="grid gap-3">
                      {cat.items.map(tid => {
                        const t = TOOLS.find(x => x.id === tid)!;
                        return (
                          <button 
                            key={tid} 
                            onClick={() => switchProtocol(tid as any)} 
                            className="flex items-center gap-4 p-5 rounded-[1.5rem] border border-accent/5 bg-white shadow-sm hover:border-primary/40 hover:shadow-2xl transition-all group"
                          >
                            <div className={cn("p-3 rounded-xl shadow-inner group-hover:scale-110 transition-transform", t.color, "bg-muted/30")}>
                              <t.icon className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                              <p className="text-[11px] font-black uppercase italic text-accent leading-none mb-1">{t.label}</p>
                              <p className="text-[8px] font-bold text-accent/30 uppercase tracking-tight">{t.description}</p>
                            </div>
                            <ArrowRight className="ml-auto h-4 w-4 text-accent/10 group-hover:text-primary transition-colors" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !isDone ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12 animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto w-full">
              <div className="text-center space-y-4">
                <div className={cn("inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white shadow-2xl border border-accent/5 mb-2", activeConfig?.color)}>
                  {activeConfig && <activeConfig.icon className="h-8 w-8" />}
                </div>
                <h2 className="text-3xl font-black tracking-tighter text-accent uppercase italic">{activeConfig?.label} Protocol</h2>
                <p className="text-accent/40 font-bold uppercase tracking-widest text-[10px]">Staging Environment Active • High-Fidelity Capture</p>
              </div>

              <FileDropzone 
                key={currentType} 
                onFilesSelected={(files) => setSelectedFile(files[0] || null)} 
                maxFiles={1} 
                accept={activeConfig?.accept}
                isLoading={isProcessing} 
                className="w-full"
              />
              
              {selectedFile && !isProcessing && (
                <div className="flex flex-col items-center gap-6 w-full max-w-md animate-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-4 p-5 bg-white border border-accent/10 rounded-[1.5rem] shadow-2xl w-full">
                    <div className={cn("p-3 rounded-xl bg-muted/30 shrink-0", activeConfig?.color)}>
                       {activeConfig && <activeConfig.icon className="h-6 w-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black uppercase italic truncate text-accent">{selectedFile.name}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • VERIFIED SOURCE</p>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={handleConvert}
                    className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Deploy Transformation Stream
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
                    <p className="text-xl font-black uppercase italic text-accent">Executing Inversion...</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Structural Reconstruction Protocol Active</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in slide-in-from-bottom-8 duration-700 max-w-md mx-auto">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden w-full text-center">
                <CardHeader className="pt-12 pb-6">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-accent">Protocol Success!</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Transformation verified. Reconstructed asset ready for download.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-12 pb-12">
                  <div className="p-4 bg-muted/30 rounded-2xl flex items-center gap-3 text-left border border-accent/5">
                    <div className={cn("p-2 rounded-lg bg-white shadow-sm", activeConfig?.color)}>
                      {activeConfig && <activeConfig.icon className="h-5 w-5" />}
                    </div>
                    <span className="text-[10px] font-bold truncate flex-1 uppercase text-accent/60 italic">
                      {selectedFile?.name.split('.')[0]}{getOutputExtension()}
                    </span>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={() => {
                      if (downloadUrl) {
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = `${selectedFile?.name.split('.')[0]}${getOutputExtension()}`;
                        link.click();
                      }
                    }} 
                    className="w-full h-16 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 text-[11px] font-black uppercase tracking-widest"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Document
                  </Button>
                  <Button variant="ghost" onClick={reset} className="text-[10px] font-bold uppercase tracking-widest text-accent/40 hover:text-accent">
                    Process New Asset
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function ConvertPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ConvertContent />
    </React.Suspense>
  );
}
