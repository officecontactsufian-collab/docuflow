"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Eraser, 
  Loader2, 
  Download, 
  CheckCircle2, 
  Activity,
  FileText,
  ImageIcon,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { processImageRemovalAction, processPdfRemovalAction } from './actions';

interface StagedFile {
  id: string;
  file: File;
  status: 'staging' | 'processing' | 'done' | 'failed';
  resultUrl?: string;
  logs: string[];
}

export default function RemoveWatermarkPage() {
  const [stagedFiles, setStagedFiles] = React.useState<StagedFile[]>([]);
  const { toast } = useToast();

  const processFile = async (staged: StagedFile) => {
    updateFileStatus(staged.id, 'processing', ["Initiating backend protocol..."]);
    try {
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(staged.file);
      });
      const resultUrl = staged.file.type === 'application/pdf' ? await processPdfRemovalAction(base64Data) : await processImageRemovalAction(base64Data);
      updateFileStatus(staged.id, 'done', ["Sanitization Complete."], resultUrl);
    } catch (e) {
      updateFileStatus(staged.id, 'failed', ["Sequence Failed."]);
    }
  };

  const updateFileStatus = (id: string, status: StagedFile['status'], logEntries: string[], resultUrl?: string) => {
    setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, status, resultUrl: resultUrl || f.resultUrl, logs: [...f.logs, ...logEntries] } : f));
  };

  const handleFilesSelected = (files: File[]) => {
    const newStaged = files.map(file => ({ id: Math.random().toString(36).substring(7), file, status: 'staging' as const, logs: ["Staged."] }));
    setStagedFiles(prev => [...prev, ...newStaged]);
    newStaged.forEach(staged => processFile(staged));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2"><Eraser className="h-7 w-7" /></div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Automated Watermark Removal</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">Reconstructs document streams and heals pixels.</p>
          </div>
          <FileDropzone onFilesSelected={handleFilesSelected} maxFiles={20} accept=".pdf,.jpg,.jpeg,.png" />
          <div className="grid gap-6">
            {stagedFiles.map((staged) => (
              <Card key={staged.id} className="border-none shadow-2xl rounded-[2.5rem] bg-white p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">{staged.file.type === 'application/pdf' ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}<span className="font-black text-accent uppercase italic">{staged.file.name}</span></div>
                  <Button variant="ghost" onClick={() => setStagedFiles(prev => prev.filter(f => f.id !== staged.id))}><Trash2 className="h-5 w-5" /></Button>
                </div>
                {staged.status === 'done' ? (
                  <Button onClick={() => { const link = document.createElement('a'); link.href = staged.resultUrl!; link.download = `sanitized_${staged.file.name}`; link.click(); }} className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase"><Download className="mr-2 h-4 w-4" /> Download Sanitized Asset</Button>
                ) : <div className="h-14 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
