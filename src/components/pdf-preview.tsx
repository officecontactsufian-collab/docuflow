
"use client"

import * as React from 'react';
import { FileText, Eye, EyeOff, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PDFPreviewProps {
  file: File | null;
  title?: string;
  className?: string;
  currentPage?: number;
}

/**
 * @fileOverview High-Fidelity Asset Preview Engine
 * Supports PDF page-streaming and direct Image buffer rendering.
 * Utilizes temporary Object URLs for zero-retention visual verification.
 */
export function PDFPreview({ file, title = "Document Preview", className, currentPage }: PDFPreviewProps) {
  const [url, setUrl] = React.useState<string | null>(null);
  const [showPreview, setShowPreview] = React.useState(true);

  const isPdf = file?.type === 'application/pdf';
  const isImage = file?.type.startsWith('image/');

  React.useEffect(() => {
    if (file && (isPdf || isImage)) {
      const u = URL.createObjectURL(file);
      setUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setUrl(null);
  }, [file, isPdf, isImage]);

  if (!file) return null;

  // PDF syntax for iframe deep linking: #page=N
  const iframeSrc = url && isPdf ? `${url}#toolbar=0&navpanes=0&view=FitH${currentPage ? `&page=${currentPage}` : ''}` : '';

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 flex items-center gap-2">
          {isImage ? <ImageIcon className="h-3.5 w-3.5 text-primary" /> : <FileText className="h-3.5 w-3.5 text-primary" />}
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowPreview(!showPreview)}
            className="text-[9px] font-black uppercase tracking-widest h-7"
          >
            {showPreview ? <EyeOff className="mr-1.5 h-3 w-3" /> : <Eye className="mr-1.5 h-3 w-3" />}
            {showPreview ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

      {showPreview && url ? (
        <div className="w-full aspect-[3/4] md:aspect-auto md:h-[700px] border-2 border-accent/5 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl group relative transition-all flex items-center justify-center">
          {isPdf ? (
            <iframe 
              key={currentPage} // Force re-render on page change to ensure iframe updates location
              src={iframeSrc} 
              className="w-full h-full border-none" 
              title="High-Fidelity PDF Preview" 
            />
          ) : isImage ? (
            <img 
              src={url} 
              alt="Asset Preview" 
              className="max-w-full max-h-full object-contain p-4 animate-in fade-in duration-500" 
            />
          ) : (
            <div className="flex flex-col items-center gap-3 opacity-20">
               <FileText className="h-12 w-12" />
               <p className="text-[10px] font-black uppercase tracking-widest">Preview logic pending for this format</p>
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none border-[1px] border-white/20 rounded-[2.5rem]" />
        </div>
      ) : showPreview && !url ? (
        <div className="w-full aspect-video border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground bg-muted/5 gap-3">
          <FileText className="h-10 w-10 opacity-10" />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Preview not available for this format</p>
        </div>
      ) : null}
    </div>
  );
}
