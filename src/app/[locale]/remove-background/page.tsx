"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Download, 
  CheckCircle2, 
  ImageIcon,
  Zap,
  Trash2,
  Sparkles,
  Activity,
  Eye,
  ShieldCheck,
  Server
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { processBackgroundRemovalAction } from './actions';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

interface StagedFile {
  id: string;
  file: File;
  originalUrl: string;
  status: 'staging' | 'processing' | 'done' | 'failed';
  resultUrl?: string;
  logs: string[];
}

export default function RemoveBackgroundPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [stagedFiles, setStagedFiles] = React.useState<StagedFile[]>([]);
  const { toast } = useToast();

  const processFile = async (staged: StagedFile) => {
    updateFileStatus(staged.id, 'processing', ["Initiating AI Subject Isolation...", "Analyzing Visual Hierarchy..."]);
    try {
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(staged.file);
      });
      const resultUrl = await processBackgroundRemovalAction(base64Data);
      updateFileStatus(staged.id, 'done', ["AI Isolation Complete.", "Asset Sanitized."], resultUrl);
      if (user && firestore) {
        const log = { userId: user.uid, toolUsed: 'BG_REMOVAL', requestTimestamp: serverTimestamp(), status: 'SUCCESS' };
        addDocumentNonBlocking(collection(firestore, 'usageLogs'), log);
      }
    } catch (e) {
      updateFileStatus(staged.id, 'failed', ["Sequence Failed."]);
    }
  };

  const updateFileStatus = (id: string, status: StagedFile['status'], logEntries: string[], resultUrl?: string) => {
    setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, status, resultUrl: resultUrl || f.resultUrl, logs: [...f.logs, ...logEntries] } : f));
  };

  const handleFilesSelected = (files: File[]) => {
    const newStaged = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      originalUrl: URL.createObjectURL(file),
      status: 'staging' as const,
      logs: ["Asset Staged for AI-Assisted Isolation."]
    }));
    setStagedFiles(prev => [...prev, ...newStaged]);
    newStaged.forEach(staged => processFile(staged));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">AI Background Isolation</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">AI-assisted isolation with backend chroma-keying.</p>
          </div>
          <FileDropzone onFilesSelected={handleFilesSelected} maxFiles={10} accept="image/png,image/jpeg" />
          {stagedFiles.length > 0 && (
            <div className="grid gap-10">
              {stagedFiles.map((staged) => (
                <Card key={staged.id} className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                  <div className="p-6 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4"><ImageIcon className="h-5 w-5 text-primary" /><span className="font-black text-accent uppercase italic">{staged.file.name}</span></div>
                    <Button variant="ghost" onClick={() => setStagedFiles(prev => prev.filter(f => f.id !== staged.id))}><Trash2 className="h-5 w-5" /></Button>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-px bg-accent/5">
                    <div className="p-8 bg-white text-center"><img src={staged.originalUrl} className="max-h-[300px] mx-auto rounded-2xl" alt="" /></div>
                    <div className="p-8 bg-white text-center">
                      {staged.status === 'done' ? <img src={staged.resultUrl} className="max-h-[300px] mx-auto rounded-2xl" alt="" /> : <div className="h-[300px] flex items-center justify-center"><Loader2 className="animate-spin" /></div>}
                    </div>
                  </div>
                  {staged.status === 'done' && <div className="p-8 border-t"><Button onClick={() => { const link = document.createElement('a'); link.href = staged.resultUrl!; link.download = `isolated_${staged.file.name}`; link.click(); }} className="w-full h-14 rounded-2xl bg-accent text-white uppercase font-black tracking-widest"><Download className="mr-2 h-4 w-4" /> Download isolated PNG</Button></div>}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
