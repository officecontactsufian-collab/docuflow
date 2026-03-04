"use client"

import * as React from 'react';
import { Upload, FileText, X, CheckCircle2, ImageIcon, FileCode, FileSpreadsheet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  isLoading?: boolean;
  className?: string;
  isHero?: boolean;
}

export function FileDropzone({ onFilesSelected, accept = ".pdf", maxFiles = 10, isLoading, className, isHero }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const acceptedFiles = files.filter(file => {
      if (accept === "*") return true;
      const exts = accept.split(',').map(s => s.trim().toLowerCase());
      return exts.some(ext => file.name.toLowerCase().endsWith(ext) || file.type.includes(ext.replace('.', '')));
    });

    if (acceptedFiles.length > 0) {
      const newFiles = [...selectedFiles, ...acceptedFiles].slice(0, maxFiles);
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = [...selectedFiles, ...files].slice(0, maxFiles);
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return <ImageIcon className="h-5 w-5" />;
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet className="h-5 w-5" />;
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="h-5 w-5" />;
    if (['html', 'htm', 'js', 'ts'].includes(ext || '')) return <FileCode className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative rounded-[2.5rem] transition-all cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed",
          isHero ? "p-16 min-h-[400px]" : "p-12",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-accent/10 bg-white/40 hover:border-primary/40 hover:bg-white/60 shadow-2xl",
          isLoading && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept={accept}
          multiple={maxFiles > 1}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-6 text-center">
          <div className={cn(
            "w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-2xl",
            isDragging ? "bg-primary text-white" : "bg-accent text-primary"
          )}>
            {isDragging ? <Plus className="h-12 w-12" /> : <Upload className="h-10 w-10" />}
          </div>
          <div className="space-y-3">
            <h3 className={cn("font-black tracking-tight uppercase italic text-accent", isHero ? "text-4xl" : "text-2xl")}>
              {isDragging ? "Drop to Process" : "Select Documents"}
            </h3>
            <p className="text-accent/60 font-bold uppercase tracking-widest text-xs">
              {isHero ? "Encrypted • Private • High-Fidelity" : `Accepts: ${accept.replace(/\./g, '').toUpperCase()}`}
            </p>
          </div>
          <Button type="button" size="lg" className="h-14 px-10 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all">
            Choose Files
          </Button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-12 space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between px-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/50">Staged for Processing ({selectedFiles.length})</h4>
            <Button variant="ghost" size="sm" onClick={() => {setSelectedFiles([]); onFilesSelected([]);}} className="text-[10px] font-black uppercase tracking-widest hover:text-destructive">
              Discard All
            </Button>
          </div>
          <div className="grid gap-3">
            {selectedFiles.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center justify-between p-5 bg-white/80 border border-white/40 rounded-3xl shadow-xl group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 text-primary rounded-2xl shadow-sm">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-accent truncate max-w-[250px] sm:max-w-lg uppercase italic">{file.name}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent/40">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="h-10 w-10 rounded-xl text-accent/40 hover:text-destructive transition-all"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}