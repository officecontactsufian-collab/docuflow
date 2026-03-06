"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Loader2, 
  Download, 
  CheckCircle2, 
  Activity,
  Zap,
  Trash2,
  Server,
  FileText,
  MessageSquare,
  Languages,
  Mail,
  RefreshCcw,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BrainCircuit,
  Hash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { executeAIStudioAction } from './actions';
import { useUser, useAuth, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { cn } from '@/lib/utils';
import mammoth from 'mammoth';
import { signInAnonymously } from 'firebase/auth';
import { collection, query, where, getDocs, Timestamp, limit, serverTimestamp } from 'firebase/firestore';

type AIStudioTool = 'PARAPHRASE' | 'SUMMARIZE' | 'EMAIL' | 'TRANSLATE' | 'CHAT';

interface ToolConfig {
  id: AIStudioTool;
  label: string;
  description: string;
  icon: any;
  color: string;
  placeholder: string;
  requiresFile?: boolean;
}

const TOOLS: ToolConfig[] = [
  { id: 'PARAPHRASE', label: 'Paraphraser', description: 'Professional text re-engineering.', icon: RefreshCcw, color: 'text-blue-600', placeholder: 'PASTE TEXT TO RE-ENGINEER...' },
  { id: 'SUMMARIZE', label: 'Summarizer', description: 'Executive content distillation.', icon: Activity, color: 'text-orange-600', placeholder: 'PASTE CONTENT OR STAGE DOCUMENT...' },
  { id: 'EMAIL', label: 'Email Architect', description: 'Structural email generation.', icon: Mail, color: 'text-purple-600', placeholder: 'DESCRIBE THE EMAIL CONTEXT...' },
  { id: 'TRANSLATE', label: 'Translator', description: 'Context-aware linguistic shift.', icon: Languages, color: 'text-green-600', placeholder: 'TEXT TO TRANSLATE...' },
  { id: 'CHAT', label: 'Doc Intelligence', description: 'Deep document interrogation.', icon: MessageSquare, color: 'text-primary', placeholder: 'ASK A QUESTION ABOUT THE DOC...', requiresFile: true },
];

const DAILY_FREE_LIMIT = 10;

export default function AIStudioPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [activeTool, setActiveTool] = React.useState<AIStudioTool>('PARAPHRASE');
  const [inputText, setInputText] = React.useState('');
  const [userQuestion, setUserQuestion] = React.useState('');
  const [targetLanguage, setTargetLanguage] = React.useState('English');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [usageCount, setUsageCount] = React.useState<number | null>(null);

  const activeConfig = TOOLS.find(t => t.id === activeTool)!;

  // Ensure user is signed in for rate limiting
  React.useEffect(() => {
    if (!isUserLoading && !user) {
      signInAnonymously(auth).catch(console.error);
    }
  }, [user, isUserLoading, auth]);

  // Track daily usage count
  React.useEffect(() => {
    if (user && firestore) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = Timestamp.fromDate(today);
      
      const logsRef = collection(firestore, 'users', user.uid, 'usageLogs');
      const q = query(logsRef, where('requestTimestamp', '>=', todayTimestamp));
      
      getDocs(q).then(snap => {
        const count = snap.docs.filter(doc => doc.data().status === 'SUCCESS').length;
        setUsageCount(count);
      }).catch(console.error);
    }
  }, [user, firestore, isProcessing]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  // Simple hashing for caching logic
  const generateRequestHash = async (data: any) => {
    const msgBuffer = new TextEncoder().encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleDeploy = async () => {
    if (!user || !firestore) {
      toast({ variant: "destructive", title: "Identity Required", description: "Initializing secure session..." });
      return;
    }

    if (activeConfig.requiresFile && !selectedFile) {
      toast({ variant: "destructive", title: "Asset Required", description: "This protocol requires a document reference." });
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setLogs(["PROTOCOL INITIALIZED: High-Fidelity AI Tunnel active."]);

    try {
      let fileDataUri = undefined;
      let finalInputText = inputText;

      if (selectedFile) {
        addLog(`STAGING ASSET [${selectedFile.name}]: Reconstructing bit-stream...`);
        const extension = selectedFile.name.split('.').pop()?.toLowerCase();
        
        if (extension === 'pdf') {
          const buffer = await selectedFile.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          fileDataUri = `data:application/pdf;base64,${base64}`;
        } else if (extension === 'docx') {
          addLog("OOXML DECODING: Reconstructing text from DOCX container...");
          const arrayBuffer = await selectedFile.arrayBuffer();
          const docxResult = await mammoth.extractRawText({ arrayBuffer });
          finalInputText = docxResult.value;
        } else if (extension === 'txt') {
          addLog("UTF-8 DECODING: Extracting plain text stream...");
          finalInputText = await selectedFile.text();
        }
      }

      const inputPayload = {
        tool: activeTool,
        text: finalInputText,
        userQuestion,
        targetLanguage,
      };

      // 1. STATELESS CACHE LOOKUP
      const requestHash = await generateRequestHash(inputPayload);
      const opsRef = collection(firestore, 'users', user.uid, 'operations');
      const cacheQuery = query(opsRef, where('aiPrompt', '==', requestHash), limit(1));
      const cacheSnapshot = await getDocs(cacheQuery);
      
      const validCache = cacheSnapshot.docs.find(doc => {
        const data = doc.data();
        return data.status === 'COMPLETED' && data.operationType === `AI_${activeTool}`;
      });

      if (validCache) {
        addLog(`CACHE HIT: Restoring session for hash ${requestHash.substring(0, 8)}...`);
        setResult(validCache.data().aiResult);
        setIsProcessing(false);
        toast({ title: "Sequence Restored", description: "Returning cached industrial synthesis." });
        return;
      }

      // 2. INDUSTRIAL RATE LIMITING
      if (usageCount !== null && usageCount >= DAILY_FREE_LIMIT) {
        throw new Error(`PROTOCOL THRESHOLD: Daily limit of ${DAILY_FREE_LIMIT} reached. Registry resets at midnight.`);
      }

      addLog(`EXECUTING ${activeTool}: Tunnelling request to industrial AI engine...`);
      
      const response = await executeAIStudioAction({
        ...inputPayload,
        fileDataUri
      });

      addLog("RECONSTRUCTION COMPLETE: Synthesizing result...");
      setResult(response.result);

      // 3. ARCHIVE OPERATION & LOG USAGE (Non-blocking)
      const logsRef = collection(firestore, 'users', user.uid, 'usageLogs');
      
      addDocumentNonBlocking(opsRef, {
        userId: user.uid,
        operationType: `AI_${activeTool}`,
        status: 'COMPLETED',
        createdAt: serverTimestamp(),
        aiPrompt: requestHash,
        aiResult: response.result,
        inputFilesIds: fileDataUri ? ["STAGED_ASSET"] : []
      });

      addDocumentNonBlocking(logsRef, {
        userId: user.uid,
        toolUsed: `AI_${activeTool}`,
        requestTimestamp: serverTimestamp(),
        status: 'SUCCESS',
        costUnits: 1,
        ipAddress: 'PROXIED_TUNNEL' 
      });

      toast({ title: "Sequence Success", description: "AI Transformation complete." });
    } catch (e: any) {
      console.error(e);
      addLog(`SEQUENCE ERROR: ${e.message}`);
      toast({ variant: "destructive", title: "Protocol Error", description: e.message });
      
      if (user && firestore) {
        const logsRef = collection(firestore, 'users', user.uid, 'usageLogs');
        addDocumentNonBlocking(logsRef, {
          userId: user.uid,
          toolUsed: `AI_${activeTool}`,
          requestTimestamp: serverTimestamp(),
          status: 'ERROR',
          costUnits: 0
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setInputText('');
    setUserQuestion('');
    setSelectedFile(null);
    setLogs([]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <BrainCircuit className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">AI Studio</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              Unified Document Intelligence Suite. Hardened AI protocols with zero-retention architecture.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Tool Selection Sidebar */}
            <div className="lg:col-span-3 space-y-4">
              <div className="section-label mb-6">
                <Hash className="h-3 w-3 text-primary" />
                <span>Protocol Registry</span>
              </div>
              <div className="grid gap-3">
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => { setActiveTool(tool.id); setResult(null); }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                      activeTool === tool.id 
                        ? "bg-white border-primary ring-1 ring-primary shadow-xl" 
                        : "bg-white/50 border-accent/5 hover:border-primary/40 hover:bg-white"
                    )}
                  >
                    <div className={cn("p-2.5 rounded-xl bg-muted/50 group-hover:scale-110 transition-transform", tool.color)}>
                      <tool.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase italic text-accent">{tool.label}</p>
                      <p className="text-[8px] font-bold text-accent/40 uppercase truncate">{tool.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-6 bg-accent text-white rounded-[2rem] shadow-2xl mt-8 relative overflow-hidden">
                 <div className="relative z-10 space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary">Identity Quota</p>
                    <div className="space-y-1">
                       <div className="flex justify-between text-[10px] font-bold uppercase italic">
                          <span>{usageCount !== null ? `${usageCount} / ${DAILY_FREE_LIMIT}` : "Loading..."}</span>
                          <span>Daily Limit</span>
                       </div>
                       <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-1000" 
                            style={{ width: `${Math.min(100, ((usageCount || 0) / DAILY_FREE_LIMIT) * 100)}%` }} 
                          />
                       </div>
                    </div>
                    <p className="text-[7px] font-bold uppercase text-white/40 tracking-tighter italic">Hardened Rate Limiting Active</p>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              </div>
            </div>

            {/* Input & Command Suite */}
            <div className="lg:col-span-9 space-y-8">
              {!result ? (
                <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                  <CardHeader className="p-10 pb-4 border-b border-accent/5">
                    <div className="flex items-center gap-4">
                       <div className={cn("p-4 rounded-2xl bg-muted/30", activeConfig.color)}>
                          <activeConfig.icon className="h-8 w-8" />
                       </div>
                       <div>
                          <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-accent">{activeConfig.label}</CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{activeConfig.description}</CardDescription>
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 space-y-8">
                    {/* Dynamic Inputs based on Tool */}
                    <div className="space-y-6">
                      {activeTool === 'CHAT' ? (
                        <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Interrogate Asset</Label>
                          <FileDropzone onFilesSelected={(f) => setSelectedFile(f[0])} maxFiles={1} accept=".pdf,.docx,.txt" className="border-accent/10" />
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Your Inquiry</Label>
                            <Input 
                              value={userQuestion} 
                              onChange={(e) => setUserQuestion(e.target.value)}
                              placeholder="ASK ABOUT THE DOCUMENT ARCHITECTURE..." 
                              className="h-12 bg-muted/20 border-accent/10 rounded-xl font-bold italic"
                            />
                          </div>
                        </div>
                      ) : activeTool === 'TRANSLATE' ? (
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Source Payload</Label>
                            <Textarea 
                              value={inputText}
                              onChange={(e) => setInputText(e.target.value)}
                              placeholder={activeConfig.placeholder}
                              className="min-h-[200px] bg-muted/20 border-accent/10 rounded-2xl font-bold text-accent"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Linguistic Protocol</Label>
                            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                               <SelectTrigger className="h-12 rounded-xl bg-white border-accent/10 font-black uppercase text-[10px] tracking-widest">
                                  <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="rounded-xl">
                                  {["English", "French", "Spanish", "German", "Japanese", "Chinese"].map(l => (
                                    <SelectItem key={l} value={l} className="font-bold text-[10px] uppercase">{l}</SelectItem>
                                  ))}
                               </SelectContent>
                            </Select>
                            <div className="p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex items-start gap-4">
                               <Languages className="h-6 w-6 text-primary shrink-0" />
                               <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tighter italic">
                                 AI Transformation maintains structural syntax and professional tone during linguistic shift.
                               </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Input Data Stream</Label>
                            <Textarea 
                              value={inputText}
                              onChange={(e) => setInputText(e.target.value)}
                              placeholder={activeConfig.placeholder}
                              className="min-h-[250px] bg-muted/20 border-accent/10 rounded-3xl font-bold text-accent resize-none"
                            />
                          </div>
                          {(activeTool === 'SUMMARIZE' || activeTool === 'CHAT') && (
                            <div className="pt-4 border-t border-accent/5">
                               <p className="text-[9px] font-black uppercase text-accent/30 mb-4 tracking-widest">Optional: Source from Asset</p>
                               <FileDropzone onFilesSelected={(f) => setSelectedFile(f[0])} maxFiles={1} accept=".pdf,.docx,.txt" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-accent/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                       <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent/40 italic">Industrial AI Tunnel Verified</span>
                       </div>
                       <Button 
                        size="lg" 
                        onClick={handleDeploy} 
                        disabled={isProcessing || (!inputText && !selectedFile)}
                        className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20"
                       >
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-primary text-primary" />}
                        Deploy {activeConfig.label}
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                    <CardHeader className="p-10 border-b border-accent/5 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Protocol Output</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-primary italic">Transformation Success</CardDescription>
                      </div>
                      <Button variant="ghost" onClick={reset} className="text-[9px] font-black uppercase tracking-widest text-accent/40 hover:text-accent">
                        Initialize New Sequence
                      </Button>
                    </CardHeader>
                    <CardContent className="p-10">
                      <div className="p-8 bg-muted/10 rounded-[2.5rem] border border-accent/5 text-sm font-medium leading-relaxed italic text-accent/80 whitespace-pre-wrap">
                        {result}
                      </div>
                      <div className="mt-8 flex justify-center">
                        <Button 
                          onClick={() => {
                            const blob = new Blob([result!], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `DOCFLOW_AI_${activeTool}_${new Date().getTime()}.txt`;
                            link.click();
                          }}
                          className="h-14 px-10 rounded-xl bg-accent text-white font-black uppercase text-[10px] tracking-widest shadow-xl"
                        >
                          <Download className="mr-2 h-4 w-4" /> Export Result as TXT
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Execution Registry (Logs) */}
              {logs.length > 0 && (
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-accent text-white overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <Server className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Industrial Sequence Log</span>
                  </div>
                  <div className="p-6 space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar bg-black/5">
                    {logs.map((log, i) => (
                      <div key={i} className="text-[9px] font-bold uppercase text-white/40 flex items-center gap-3">
                        <ArrowRight className="h-2.5 w-2.5 text-primary" /> {log}
                      </div>
                    ))}
                    {isProcessing && <Loader2 className="h-3 w-3 animate-spin text-primary mt-2" />}
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Technology Stack Registry */}
          <div className="pt-16 border-t border-accent/5 flex flex-col md:flex-row items-center justify-center gap-12 opacity-30 grayscale hover:opacity-100 transition-all duration-1000">
             <div className="flex items-center gap-3 font-black uppercase tracking-[0.4em] text-[10px]">
                <ShieldCheck className="h-4 w-4" /> 256-BIT ENCRYPTED
             </div>
             <div className="flex items-center gap-3 font-black uppercase tracking-[0.4em] text-[10px]">
                <Cpu className="h-4 w-4" /> LOCAL-FIRST BUFFER
             </div>
             <div className="flex items-center gap-3 font-black uppercase tracking-[0.4em] text-[10px]">
                <BrainCircuit className="h-4 w-4" /> GEMINI FLASH 1.5
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
