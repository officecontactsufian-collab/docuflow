"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { FileDropzone } from '@/components/file-dropzone';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Download, 
  CheckCircle2, 
  Activity,
  Zap,
  Server,
  MessageSquare,
  Languages,
  Mail,
  RefreshCcw,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BrainCircuit,
  BookOpen,
  Briefcase,
  PenLine,
  FileBadge,
  ChevronRight,
  Send,
  User,
  Bot,
  Paperclip,
  Trash2,
  Settings2,
  X,
  FileText,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
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

type AIStudioTool = 'PARAPHRASE' | 'SUMMARIZE' | 'EMAIL' | 'TRANSLATE' | 'CHAT' | 'GRAMMAR' | 'ESSAY' | 'RESUME' | 'COVER_LETTER';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tool?: AIStudioTool;
  timestamp: Date;
  fileName?: string;
}

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
  { id: 'PARAPHRASE', label: 'Paraphraser', description: 'Re-engineer text.', icon: RefreshCcw, color: 'text-blue-600', placeholder: 'Enter text to re-engineer...' },
  { id: 'SUMMARIZE', label: 'Summarizer', description: 'Content distillation.', icon: Activity, color: 'text-orange-600', placeholder: 'Enter content or attach document...' },
  { id: 'GRAMMAR', label: 'Grammar', description: 'Industrial proofing.', icon: CheckCircle2, color: 'text-green-600', placeholder: 'Enter text to check...' },
  { id: 'ESSAY', label: 'Essay Writer', description: 'Academic synthesis.', icon: BookOpen, color: 'text-indigo-600', placeholder: 'Describe essay topic...' },
  { id: 'RESUME', label: 'Resume', description: 'Profile engineering.', icon: Briefcase, color: 'text-emerald-600', placeholder: 'List experience and skills...' },
  { id: 'COVER_LETTER', label: 'Cover Letter', description: 'Intro architect.', icon: FileBadge, color: 'text-cyan-600', placeholder: 'Describe job and background...' },
  { id: 'EMAIL', label: 'Email', description: 'Corporate drafts.', icon: Mail, color: 'text-purple-600', placeholder: 'Describe email context...' },
  { id: 'TRANSLATE', label: 'Translator', description: 'Linguistic shift.', icon: Languages, color: 'text-green-600', placeholder: 'Text to translate...' },
  { id: 'CHAT', label: 'Doc Intel', description: 'Asset interrogation.', icon: MessageSquare, color: 'text-primary', placeholder: 'Ask about the document...', requiresFile: true },
];

const CATEGORIES = [
  { id: 'writing', label: 'Writing Suite', tools: ['PARAPHRASE', 'SUMMARIZE', 'GRAMMAR', 'ESSAY'], icon: PenLine },
  { id: 'career', label: 'Identity Tools', tools: ['RESUME', 'COVER_LETTER', 'EMAIL'], icon: Briefcase },
  { id: 'productivity', label: 'Productivity', tools: ['TRANSLATE', 'CHAT'], icon: Zap },
];

const LANGUAGES = ["English", "French", "Spanish", "German", "Japanese", "Chinese", "Arabic", "Portuguese", "Russian", "Italian"];

const DAILY_FREE_LIMIT = 10;

export default function AIStudioPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [activeTool, setActiveTool] = React.useState<AIStudioTool>('PARAPHRASE');
  const [inputText, setInputText] = React.useState('');
  const [targetLanguage, setTargetLanguage] = React.useState('English');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [usageCount, setUsageCount] = React.useState<number | null>(null);
  
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const activeConfig = TOOLS.find(t => t.id === activeTool)!;

  React.useEffect(() => {
    if (!isUserLoading && !user && auth) {
      signInAnonymously(auth).catch(console.error);
    }
  }, [user, isUserLoading, auth]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  React.useEffect(() => {
    if (user && firestore) {
      const fetchUsage = async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const q = query(
          collection(firestore, 'users', user.uid, 'usageLogs'),
          where('requestTimestamp', '>=', Timestamp.fromDate(today))
        );
        const snap = await getDocs(q);
        setUsageCount(snap.docs.filter(doc => doc.data().status === 'SUCCESS').length);
      };
      fetchUsage().catch(console.error);
    }
  }, [user, firestore, isProcessing]);

  const generateRequestHash = async (data: any) => {
    const msgBuffer = new TextEncoder().encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleDeploy = async () => {
    if (!user || !firestore) return;
    if (!inputText.trim() && !selectedFile) return;
    if (activeConfig.requiresFile && !selectedFile) {
      toast({ variant: "destructive", title: "Asset Required", description: "This protocol requires a document reference." });
      return;
    }

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: inputText,
      tool: activeTool,
      timestamp: new Date(),
      fileName: selectedFile?.name
    };

    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);
    setInputText('');

    try {
      let fileDataUri: string | undefined = undefined;
      let finalInputText = inputText;

      if (selectedFile) {
        const ext = selectedFile.name.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') {
          fileDataUri = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(selectedFile);
          });
        } else if (ext === 'docx') {
          const res = await mammoth.extractRawText({ arrayBuffer: await selectedFile.arrayBuffer() });
          finalInputText = `${inputText}\n\n[DOCUMENT CONTENT]:\n${res.value}`;
        } else if (ext === 'txt') {
          finalInputText = `${inputText}\n\n[DOCUMENT CONTENT]:\n${await selectedFile.text()}`;
        }
      }

      const inputPayload = {
        tool: activeTool,
        text: finalInputText,
        userQuestion: activeTool === 'CHAT' ? inputText : undefined,
        targetLanguage,
      };

      const requestHash = await generateRequestHash(inputPayload);
      const opsRef = collection(firestore, 'users', user.uid, 'operations');
      const cacheQuery = query(opsRef, where('aiPrompt', '==', requestHash), limit(1));
      const cacheSnapshot = await getDocs(cacheQuery);
      
      let result = '';
      const validCache = cacheSnapshot.docs.find(doc => doc.data().status === 'COMPLETED');

      if (validCache) {
        result = validCache.data().aiResult;
      } else {
        if (usageCount !== null && usageCount >= DAILY_FREE_LIMIT) {
          throw new Error(`Daily limit reached (${DAILY_FREE_LIMIT}). Registry resets at midnight.`);
        }
        const response = await executeAIStudioAction({ ...inputPayload, fileDataUri });
        result = response.result;

        addDocumentNonBlocking(opsRef, {
          userId: user.uid,
          operationType: `AI_${activeTool}`,
          status: 'COMPLETED',
          createdAt: serverTimestamp(),
          aiPrompt: requestHash,
          aiResult: result,
          inputFilesIds: fileDataUri ? ["STAGED_ASSET"] : []
        });

        const logData = { userId: user.uid, toolUsed: `AI_${activeTool}`, requestTimestamp: serverTimestamp(), status: 'SUCCESS', costUnits: 1 };
        addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'usageLogs'), logData);
        addDocumentNonBlocking(collection(firestore, 'usageLogs'), logData);
      }

      const assistantMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: result,
        tool: activeTool,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setSelectedFile(null);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Protocol Error", description: e.message });
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `ERROR: ${e.message}`, timestamp: new Date() }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied", description: "Content moved to local clipboard buffer." });
  };

  return (
    <div className="flex h-screen flex-col bg-[#F9FAFB]">
      <Navbar />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar: Specialized Agents */}
        <aside className="w-72 border-r border-accent/5 bg-white hidden lg:flex flex-col">
          <div className="p-6 border-b border-accent/5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 mb-4">Protocol Selection</h2>
            <div className="p-4 bg-accent text-white rounded-2xl shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase text-primary mb-1">Identity Quota</p>
                  <div className="flex justify-between text-[10px] font-bold italic mb-1">
                    <span>{usageCount ?? 0} / {DAILY_FREE_LIMIT}</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${((usageCount || 0) / DAILY_FREE_LIMIT) * 100}%` }} />
                  </div>
               </div>
               <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary/20 rounded-full blur-xl" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-center gap-2 px-2 text-[9px] font-black uppercase tracking-widest text-accent/30">
                  <cat.icon className="h-3 w-3" /> {cat.label}
                </div>
                <div className="grid gap-1">
                  {cat.tools.map((toolId) => {
                    const tool = TOOLS.find(t => t.id === toolId)!;
                    const isActive = activeTool === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={cn(
                          "flex items-center gap-3 p-2.5 rounded-xl transition-all text-left group",
                          isActive ? "bg-accent text-white shadow-lg" : "hover:bg-muted/50 text-accent/60"
                        )}
                      >
                        <div className={cn("p-1.5 rounded-lg", isActive ? "bg-white/10" : "bg-muted/50", !isActive && tool.color)}>
                          <tool.icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase italic leading-none">{tool.label}</p>
                        </div>
                        {isActive && <ChevronRight className="ml-auto h-3 w-3 text-primary animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-accent/5">
             <Button variant="ghost" onClick={() => setMessages([])} className="w-full justify-start text-[9px] font-black uppercase tracking-widest text-accent/40 hover:text-destructive">
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Clear Session
             </Button>
          </div>
        </aside>

        {/* Main Chat Area */}
        <section className="flex-1 flex flex-col relative bg-white lg:bg-transparent">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-accent text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl brand-glow animate-in zoom-in duration-700">
                <BrainCircuit className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">DOCFLOW Intelligence</h1>
                <p className="text-accent/40 font-bold uppercase tracking-widest text-xs leading-relaxed">
                  Industrial-grade generative protocols for mission-critical documents. 
                  Zero-retention architecture active.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                 {['PARAPHRASE', 'SUMMARIZE', 'CHAT', 'ESSAY'].map(tid => {
                   const t = TOOLS.find(x => x.id === tid)!;
                   return (
                     <button key={tid} onClick={() => setActiveTool(tid as any)} className="p-4 rounded-2xl border border-accent/5 bg-white shadow-sm hover:border-primary/40 hover:shadow-xl transition-all text-left group">
                        <t.icon className={cn("h-5 w-5 mb-2", t.color)} />
                        <p className="text-[10px] font-black uppercase italic text-accent">{t.label}</p>
                        <p className="text-[8px] font-bold text-accent/30 uppercase">{t.description}</p>
                     </button>
                   );
                 })}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
              <div className="max-w-4xl mx-auto space-y-10 pb-32">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn("flex max-w-[85%] gap-4", msg.role === 'user' && "flex-row-reverse")}>
                      <div className={cn("h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-lg", msg.role === 'user' ? "bg-accent text-primary" : "bg-primary text-white")}>
                        {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </div>
                      <div className="space-y-3">
                        <div className={cn(
                          "p-6 rounded-[2rem] shadow-sm text-sm font-medium leading-relaxed",
                          msg.role === 'user' ? "bg-accent text-white rounded-tr-none" : "bg-white border border-accent/5 text-accent/80 rounded-tl-none"
                        )}>
                          {msg.fileName && (
                            <div className="mb-4 flex items-center gap-2 p-2 bg-white/10 rounded-lg border border-white/10">
                               <FileText className="h-3 w-3" />
                               <span className="text-[10px] font-black uppercase italic">{msg.fileName}</span>
                            </div>
                          )}
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                        <div className={cn("flex items-center gap-3 px-2", msg.role === 'user' && "flex-row-reverse")}>
                           <span className="text-[8px] font-black uppercase text-accent/20 tracking-widest">{msg.timestamp.toLocaleTimeString()}</span>
                           {msg.role === 'assistant' && (
                             <button onClick={() => copyToClipboard(msg.content)} className="p-1 hover:text-primary transition-colors">
                               <Copy className="h-3 w-3" />
                             </button>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex gap-6 animate-in fade-in duration-300">
                    <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg animate-pulse">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                    <div className="p-6 bg-white border border-accent/5 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-3">
                       <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-accent/20 italic">Executing Protocol...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}

          {/* Bottom Chat Bar */}
          <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB] to-transparent">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-accent/10 p-2 focus-within:ring-2 ring-primary/20 transition-all">
                <div className="flex flex-col gap-2">
                  {selectedFile && (
                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-2xl border border-accent/5 animate-in slide-in-from-bottom-2">
                       <div className="p-2 bg-white rounded-lg text-primary shadow-sm"><FileText className="h-4 w-4" /></div>
                       <span className="text-[10px] font-black uppercase text-accent truncate max-w-[200px]">{selectedFile.name}</span>
                       <button onClick={() => setSelectedFile(null)} className="ml-auto p-1.5 hover:bg-destructive/10 rounded-full text-destructive transition-colors">
                          <X className="h-3 w-3" />
                       </button>
                    </div>
                  )}
                  
                  <div className="flex items-end gap-2">
                    <button 
                      onClick={() => document.getElementById('file-trigger')?.click()}
                      className="p-3 mb-1 rounded-2xl hover:bg-muted transition-colors text-accent/40 hover:text-primary group"
                    >
                      <Paperclip className="h-5 w-5" />
                      <input id="file-trigger" type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                    </button>
                    
                    <Textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleDeploy();
                        }
                      }}
                      placeholder={activeConfig.placeholder}
                      className="min-h-[56px] max-h-40 border-none shadow-none focus-visible:ring-0 bg-transparent resize-none py-4 font-medium text-accent scrollbar-hide"
                    />

                    <div className="flex items-center gap-2 mb-1 mr-1">
                      {activeTool === 'TRANSLATE' && (
                        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                          <SelectTrigger className="h-10 w-28 rounded-xl border-accent/5 bg-muted/20 text-[9px] font-black uppercase tracking-widest">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {LANGUAGES.map(l => <SelectItem key={l} value={l} className="text-[9px] font-black uppercase">{l}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                      <Button 
                        onClick={handleDeploy} 
                        disabled={isProcessing || (!inputText.trim() && !selectedFile)}
                        className="h-12 w-12 rounded-2xl bg-accent text-white shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 fill-primary text-primary" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-8 mt-4 opacity-20 grayscale hover:opacity-100 transition-opacity duration-700">
                 <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] italic">
                    <ShieldCheck className="h-3 w-3" /> Secure Tunnel
                 </div>
                 <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] italic text-primary">
                    <Activity className="h-3 w-3" /> Active Protocol: {activeConfig.label}
                 </div>
                 <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] italic">
                    <Cpu className="h-3 w-3" /> Local Buffer
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
