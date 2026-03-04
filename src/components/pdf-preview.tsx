"use client"

import * as React from 'react';
import { FileText, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFPreviewProps {
  file: File | null;
  title?: string;
}

export function PDFPreview({ file, title = "Document Preview" }: PDFPreviewProps) {
  const [url, setUrl] = React.useState<string | null>(null);
  const [showPreview, setShowPreview] = React.useState(true);

  React.useEffect(() => {
    if (file && file.type === 'application/pdf') {
      const u = URL.createObjectURL(file);
      setUrl(u);
      return () => URL.revokeObjectURL(u);
    }
    setUrl(null);
  }, [file]);

  if (!file) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          {title}
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowPreview(!showPreview)}
          className="text-[10px] font-bold uppercase tracking-widest"
        >
          {showPreview ? <EyeOff className="mr-2 h-3.5 w-3.5" /> : <Eye className="mr-2 h-3.5 w-3.5" />}
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      {showPreview && url ? (
        <div className="w-full aspect-[3/4] md:aspect-auto md:h-[600px] border rounded-[2rem] overflow-hidden bg-muted/20 shadow-inner group relative">
          <iframe 
            src={`${url}#toolbar=0&navpanes=0`} 
            className="w-full h-full border-none" 
            title="PDF Preview" 
          />
          <div className="absolute inset-0 pointer-events-none border-[12px] border-background/5 rounded-[2rem]" />
        </div>
      ) : showPreview && !url ? (
        <div className="w-full aspect-video border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground gap-3">
          <FileText className="h-10 w-10 opacity-20" />
          <p className="text-xs font-bold uppercase tracking-widest">Preview not available for this format</p>
        </div>
      ) : null}
    </div>
  );
}
