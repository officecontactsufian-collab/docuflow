"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  CheckCircle2, 
  Activity,
  Zap,
  MessageSquare,
  Languages,
  Mail,
  RefreshCcw,
  ShieldCheck,
  Cpu,
  BrainCircuit,
  BookOpen,
  Briefcase,
  PenLine,
  FileBadge,
  Send,
  User,
  Bot,
  Paperclip,
  X,
  FileText,
  Copy,
  LayoutDashboard,
  Clock,
  Sparkles,
  Share2,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { executeAIStudioAction } from './actions';
import { useUser, useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { cn } from '@/lib/utils';
import mammoth from 'mammoth';
import { signInAnonymously } from 'firebase/auth';
import { collection, query, where, getDocs, Timestamp, limit, serverTimestamp, doc } from 'firebase/firestore';
import { ShareDialog } from '@/components/share-dialog';
import { useTranslation } from '@/lib/i18n-context';

type AIStudioTool = 'PARAPHRASE' | 'SUMMARIZE' | 'EMAIL' | 'TRANSLATE' | 'CHAT' | 'GRAMMAR' | 'ESSAY' | 'RESUME' | 'COVER_LETTER';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tool?: AIStudioTool;
  timestamp: Date;
  fileName?: string;
  shareSlug?: string;
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

export default function AIStudioPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [activeTool, setActiveTool] = React.useState<AIStudioTool>('PARAPHRASE');
  const [inputText, setInputText] = React.useState('');
  const [targetLanguage, setTargetLanguage] = React.useState('English');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState<string | null>(null);
  
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const TOOLS: ToolConfig[] = [
    { id: 'PARAPHRASE', label: t('tools.paraphraser.title'), description: t('tools.paraphraser.desc'), icon: RefreshCcw, color: 'text-blue-600', placeholder: 'Enter text to re-engineer...' },
    { id: 'SUMMARIZE', label: t('tools.summarizer.title'), description: t('tools.summarizer.desc'), icon: Activity, color: 'text-orange-600', placeholder: 'Enter content or attach document...' },
    { id: 'GRAMMAR', label: t('tools.grammar.title'), description: t('tools.grammar.desc'), icon: CheckCircle2, color: 'text-green-600', placeholder: 'Enter text to check...' },
    { id: 'ESSAY', label: t('tools.essay.title'), description: t('tools.essay.desc'), icon: BookOpen, color: 'text-indigo-600', placeholder: 'Describe essay topic...' },
    { id: 'RESUME', label: t('tools.resume.title'), description: t('tools.resume.desc'), icon: Briefcase, color: 'text-emerald-600', placeholder: 'List experience and skills...' },
    { id: 'COVER_LETTER', label: t('tools.cover_letter.title'), description: t('tools.cover_letter.desc'), icon: FileBadge, color: 'text-cyan-600', placeholder: 'Describe job and background...' },
    { id: 'EMAIL', label: t('tools.email.title'), description: t('tools.email.desc'), icon: Mail, color: 'text-purple-600', placeholder: 'Describe email context...' },
    { id: 'TRANSLATE', label: t('tools.translator.title'), description: t('tools.translator.desc'), icon: Languages, color: 'text-green-600', placeholder: 'Text to translate...' },
    { id: 'CHAT', label: t('tools.doc_intel.title'), description: t('tools.doc_intel.desc'), icon: MessageSquare, color: 'text-primary', placeholder: 'Ask about the document...', requiresFile: true },
  ];

  const CATEGORIES = [
    { id: 'writing', label: t('nav.ai_writing'), tools: ['PARAPHRASE', 'SUMMARIZE', 'GRAMMAR', 'ESSAY'], icon: PenLine },
    { id: 'career', label: t('nav.ai_discovery'), tools: ['RESUME', 'COVER_LETTER', 'EMAIL'], icon: Briefcase },
    { id: 'productivity', label: t('nav.ai_productivity'), tools: ['TRANSLATE', 'CHAT'], icon: Zap },
  ];

  const LANGUAGES = ["English", "French", "Spanish", "German", "Japanese", "Chinese", "Arabic", "Portuguese", "Russian", "Italian"];

  const activeConfig = TOOLS.find(t => t.id === activeTool)!;

  React.useEffect(() => {
    if (!isUserLoading && !user && auth) {
      signInAnonymously(auth).catch(console.error);
    }
  }, [user, isUserLoading, auth]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const generateRequestHash = async (data: any) => {
    const msgBuffer = new TextEncoder().encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  const handleShare = async (message: Message) => {
    if (!user || !firestore || isSharing) return;
    setIsSharing(message.id);

    try {
      const toolLabel = TOOLS.find(t => t.id === message.tool)?.label || "Result";
      const slugBase = slugify(toolLabel);
      const uniqueSuffix = Math.random().toString(36).substring(2, 8);
      const shareSlug = `${slugBase}-${uniqueSuffix}`;

      const publicRef = doc(firestore, 'public_ai_results', shareSlug);
      await setDocumentNonBlocking(publicRef, {
        creatorId: user.uid,
        toolName: toolLabel,
        generatedContent: message.content,
        shareSlug: shareSlug,
        createdAt: serverTimestamp(),
        isPubliclyShareable: true
      }, { merge: true });

      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, shareSlug } : msg
      ));

      toast({ title: t('common.success'), description: "Protocol transmission link generated successfully." });
    } catch (e: any) {
      toast({ variant: "destructive", title: t('common.failure'), description: e.message });
    } finally {
      setIsSharing(null);
    }
  };

  const getShareUrl = (slug: string) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/share/${slug}`;
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
    toast({ title: t('common.copy'), description: "Content moved to local clipboard buffer." });
  };

  return (
    <div className="flex h-screen flex-col bg-[#F9FAFB]">
      <Navbar />
      
      <main className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-accent/5 bg-white hidden lg:flex flex-col">
          <div className="p-6 border-b border-accent/5">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 mb-4 flex items-center gap-2">
              <LayoutDashboard className="h-3 w-3" /> {t('ui.ai_studio.registry')}
            </h2>
            <div className="p-5 bg-accent text-white rounded-[2rem] shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-black uppercase text-primary">{t('ui.ai_studio.identity_access')}</p>
                    <ShieldCheck className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-2xl font-black italic">PRO FREE</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-full" />
                  </div>
                  <p className="mt-2 text-[8px] font-bold text-white/40 uppercase tracking-widest">{t('ui.ai_studio.unlimited_access')}</p>
               </div>
               <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-3">
                <div className="flex items-center gap-2 px-3 text-[9px] font-black uppercase tracking-[0.3em] text-accent/30">
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
                          "flex items-center gap-4 p-3 rounded-2xl transition-all text-left group",
                          isActive ? "bg-accent text-white shadow-xl translate-x-1" : "hover:bg-muted/50 text-accent/60"
                        )}
                      >
                        <div className={cn("p-2 rounded-xl shadow-sm transition-transform group-hover:scale-110", isActive ? "bg-white/10" : "bg-white border border-accent/5", !isActive && tool.color)}>
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
             <Button variant="ghost" onClick={() => setMessages([])} className="w-full justify-start h-12 rounded-xl text-[9px] font-black uppercase tracking-widest text-accent/40 hover:text-destructive hover:bg-destructive/5 transition-all">
                <Trash2 className="mr-3 h-4 w-4" /> {t('ui.ai_studio.purge_session')}
             </Button>
          </div>
        </aside>

        <section className="flex-1 flex flex-col relative bg-white lg:bg-transparent">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
                <div className="w-24 h-24 bg-accent text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl brand-glow relative z-10">
                  <BrainCircuit className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-[10px] font-black uppercase tracking-[0.3em]">
                  <Sparkles className="h-3 w-3" /> {t('ui.ai_studio.intelligence_active')}
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-accent uppercase italic leading-[0.9]">
                  {t('ui.ai_studio.protocol_synthesis').split(' ')[0]} <br />
                  <span className="not-italic text-primary">{t('ui.ai_studio.protocol_synthesis').split(' ')[1]}</span>
                </h1>
                <p className="text-accent/40 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-lg mx-auto">
                  {t('ui.ai_studio.zero_retention_note')}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                 {['PARAPHRASE', 'SUMMARIZE', 'RESUME', 'ESSAY'].map(tid => {
                   const t = TOOLS.find(x => x.id === tid)!;
                   return (
                     <button key={tid} onClick={() => setActiveTool(tid as any)} className="p-6 rounded-[2rem] border border-accent/5 bg-white shadow-sm hover:border-primary/40 hover:shadow-2xl transition-all text-left group">
                        <div className={cn("p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform", t.color, "bg-muted/30")}>
                          <t.icon className="h-5 w-5" />
                        </div>
                        <p className="text-[11px] font-black uppercase italic text-accent mb-1">{t.label}</p>
                        <p className="text-[8px] font-bold text-accent/30 uppercase tracking-tight">{t.description}</p>
                     </button>
                   );
                 })}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-12">
              <div className="max-w-4xl mx-auto space-y-12 pb-40">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn("flex max-w-[90%] gap-6", msg.role === 'user' && "flex-row-reverse")}>
                      <div className={cn(
                        "h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center shadow-xl border border-white/10 transition-transform hover:scale-110",
                        msg.role === 'user' ? "bg-accent text-primary" : "bg-primary text-white"
                      )}>
                        {msg.role === 'user' ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                      </div>
                      <div className="space-y-4 flex-1 min-w-0">
                        <div className={cn(
                          "p-8 rounded-[2.5rem] shadow-2xl text-sm font-medium leading-relaxed border transition-all",
                          msg.role === 'user' 
                            ? "bg-accent text-white border-white/5 rounded-tr-none" 
                            : "bg-white border-accent/5 text-accent/80 rounded-tl-none"
                        )}>
                          {msg.fileName && (
                            <div className="mb-6 flex items-center gap-3 p-3 bg-black/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                               <div className="p-2 bg-white/10 rounded-lg"><FileText className="h-4 w-4" /></div>
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase italic">{msg.fileName}</span>
                                  <span className="text-[8px] font-bold opacity-40 uppercase">CONTEXTUAL ASSET</span>
                               </div>
                            </div>
                          )}
                          <div className="whitespace-pre-wrap selection:bg-primary/30">{msg.content}</div>
                        </div>
                        <div className={cn("flex items-center gap-4 px-4", msg.role === 'user' && "flex-row-reverse")}>
                           <div className="flex items-center gap-2 text-[9px] font-black uppercase text-accent/20 tracking-widest italic">
                              <Clock className="h-3 w-3" /> {msg.timestamp.toLocaleTimeString()}
                           </div>
                           {msg.role === 'assistant' && (
                             <div className="flex gap-2">
                               <button 
                                onClick={() => copyToClipboard(msg.content)} 
                                className="p-2 rounded-xl bg-muted/30 text-accent/20 hover:text-primary hover:bg-primary/5 transition-all"
                                title={t('common.copy')}
                               >
                                 <Copy className="h-3.5 w-3.5" />
                               </button>
                               
                               <ShareDialog 
                                url={msg.shareSlug ? getShareUrl(msg.shareSlug) : undefined}
                                title={msg.shareSlug ? t('common.success') : t('common.share')}
                                description={t('ui.ai_studio.stream_analysis')}
                                trigger={
                                  <button 
                                    onClick={() => !msg.shareSlug && handleShare(msg)}
                                    className="p-2 rounded-xl bg-muted/30 text-accent/20 hover:text-primary hover:bg-primary/5 transition-all"
                                    title={t('common.share')}
                                  >
                                    {isSharing === msg.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
                                  </button>
                                }
                               />
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex gap-8 animate-in fade-in duration-500">
                    <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl animate-pulse">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                    <div className="p-8 bg-white border border-accent/5 rounded-[2.5rem] rounded-tl-none shadow-2xl flex flex-col gap-4 min-w-[300px]">
                       <div className="flex items-center gap-4">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                            <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-accent/20 italic">{t('ui.ai_studio.executing')}</span>
                       </div>
                       <div className="space-y-2">
                          <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                             <div className="h-full bg-primary/20 animate-infinite-scroll w-1/3" />
                          </div>
                          <p className="text-[8px] font-bold text-accent/10 uppercase tracking-widest">{t('ui.ai_studio.stream_analysis')}</p>
                       </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}

          <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB] to-transparent">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-accent/10 p-3 focus-within:ring-4 ring-primary/10 transition-all duration-500">
                <div className="flex flex-col gap-3">
                  {selectedFile && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-[1.5rem] border border-accent/5 animate-in slide-in-from-bottom-2 duration-500 mx-2 mt-1">
                       <div className="p-2.5 bg-white rounded-xl text-primary shadow-lg border border-accent/5">
                          <FileText className="h-5 w-5" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase text-accent truncate">{selectedFile.name}</p>
                          <p className="text-[8px] font-bold text-accent/30 uppercase tracking-widest">{t('ui.ai_studio.asset_staged')} • {(selectedFile.size / 1024).toFixed(0)} KB</p>
                       </div>
                       <button onClick={() => setSelectedFile(null)} className="p-2 hover:bg-destructive/10 rounded-xl text-destructive transition-all">
                          <X className="h-4 w-4" />
                       </button>
                    </div>
                  )}
                  
                  <div className="flex items-end gap-3 px-2 pb-1">
                    <button 
                      onClick={() => document.getElementById('file-trigger')?.click()}
                      className="p-4 rounded-2xl hover:bg-muted/50 transition-all text-accent/40 hover:text-primary group relative overflow-hidden"
                      title={t('ui.ai_studio.attach_asset')}
                    >
                      <Paperclip className="h-6 w-6 relative z-10" />
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                      className="min-h-[64px] max-h-60 border-none shadow-none focus-visible:ring-0 bg-transparent resize-none py-5 font-medium text-accent scrollbar-hide text-base"
                    />

                    <div className="flex items-center gap-3 mb-1.5 mr-1">
                      {activeTool === 'TRANSLATE' && (
                        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                          <SelectTrigger className="h-12 w-36 rounded-2xl border-accent/5 bg-muted/20 text-[10px] font-black uppercase tracking-[0.2em] shadow-inner">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-accent/10 shadow-2xl">
                            {LANGUAGES.map(l => (
                              <SelectItem key={l} value={l} className="text-[10px] font-black uppercase tracking-widest py-3">
                                {l}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <Button 
                        onClick={handleDeploy} 
                        disabled={isProcessing || (!inputText.trim() && !selectedFile)}
                        className="h-14 w-14 rounded-2xl bg-accent text-white shadow-2xl shadow-accent/30 hover:scale-105 active:scale-95 transition-all group overflow-hidden relative"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-6 w-6 animate-spin relative z-10" />
                        ) : (
                          <Send className="h-6 w-6 fill-primary text-primary relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-12 mt-6 opacity-30 grayscale hover:opacity-100 transition-all duration-1000 cursor-default">
                 <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] italic transition-colors hover:text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" /> {t('ui.ai_studio.secure_tunnel')}
                 </div>
                 <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] italic text-primary">
                    <Activity className="h-3.5 w-3.5 animate-pulse" /> {t('ui.ai_studio.executing')}
                 </div>
                 <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] italic transition-colors hover:text-primary">
                    <Cpu className="h-3.5 w-3.5" /> {t('ui.ai_studio.local_synthesis')}
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
