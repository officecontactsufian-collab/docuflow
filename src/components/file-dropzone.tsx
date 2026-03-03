"use client"

import * as React from 'react';
import { Upload, FileText, X, CheckCircle2, ImageIcon, FileCode, FileSpreadsheet, FileArchive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  isLoading?: boolean;
  className?: string;
}

export function FileDropzone({ onFilesSelected, accept = ".pdf", maxFiles = 10, isLoading, className }: FileDropzoneProps) {
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
    // Simple filter based on accept string extensions if provided
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
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group",
          isDragging 
            ? "border-accent bg-accent/5 scale-[1.01]" 
            : "border-border hover:border-primary/50 hover:bg-primary/5",
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
        
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
            isDragging ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
          )}>
            <Upload className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold font-headline">Select files to upload</h3>
            <p className="text-sm text-muted-foreground">Accepts: {accept.replace(/\./g, '').toUpperCase()}</p>
          </div>
          <Button type="button" size="lg" className="mt-2 shadow-md">
            Choose Files
          </Button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Selected Files ({selectedFiles.length})</h4>
            <Button variant="ghost" size="sm" onClick={() => {setSelectedFiles([]); onFilesSelected([]);}} className="text-xs">
              Clear All
            </Button>
          </div>
          <div className="grid gap-3">
            {selectedFiles.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center justify-between p-4 bg-card border rounded-xl shadow-sm group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-md">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
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
