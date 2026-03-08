"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Target, 
  Loader2, 
  Copy, 
  Share2, 
  Zap,
  TrendingUp,
  Search,
  ArrowRight,
  Sparkles,
  Twitter,
  Linkedin,
  MessageCircle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeNicheFinderAction } from './actions';
import { useUser, useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, serverTimestamp, doc, query, limit, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function NicheFinderPage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [input, setInput] = React.useState('');
  const [result, setResult] = React.useState<any>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);
  const [shareSlug, setShareSlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user && auth) signInAnonymously(auth);
  }, [user, auth]);

  const handleDeploy = async () => {
    if (!input.trim() || !user || !firestore) return;
    setIsProcessing(true);
    setResult(null);
    setShareSlug(null);

    try {
      const logsRef = collection(firestore, 'users', user.uid, 'usageLogs');
      const q = query(logsRef, orderBy('requestTimestamp', 'desc'), limit(10));
      const snap = await getDocs(q);
      
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const logsToday = snap.docs.filter(doc => {
        const data = doc.data();
        const ts = data.requestTimestamp;
        if (!ts) return false;
        const date = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
        return date >= startOfToday;
      });

      if (logsToday.length >= 10) {
        throw new Error("DAILY_LIMIT_REACHED: 10 operations allowed per day. Please return tomorrow.");
      }

      const res = await executeNicheFinderAction({ interests: input });
      setResult(res);
      
      const logData = { userId: user.uid, toolUsed: 'AI_NICHE_FINDER', requestTimestamp: serverTimestamp(), status: 'SUCCESS' };
      addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'usageLogs'), logData);
      addDocumentNonBlocking(collection(firestore, 'usageLogs'), logData);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Protocol Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!user || !firestore || !result) return;
    setIsSharing(true);
    try {
      const slug = `niche-${Math.random().toString(36).substring(2, 8)}`;
      const formattedContent = result.niches.map((n: any) => `NICHE: ${n.title}\nDIFFICULTY: ${n.difficulty}\nWHY: ${n.explanation}\nUSE CASES: ${n.useCases.join(', ')}`).join('\n\n');
      
      const publicRef = doc(firestore, 'public_ai_results', slug);
      await setDocumentNonBlocking(publicRef, {
        creatorId: user.uid,
        toolName: 'AI Niche Finder',
        generatedContent: formattedContent,
        shareSlug: slug,
        createdAt: serverTimestamp(),
        isPubliclyShareable: true
      }, { merge: true });
      setShareSlug(slug);
    } finally {
      setIsSharing(false);
    }
  };

  const shareUrl = shareSlug ? `${window.location.origin}/share/${shareSlug}` : '';

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="section-label mx-auto">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span>Market Opportunity Protocol</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent uppercase italic">AI Niche <span className="text-primary not-italic">Finder.</span></h1>
            <p className="text-accent/60 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto leading-relaxed">
              Identify profitable market segments and business opportunities based on your core interests.
            </p>
          </div>

          <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-8 max-w-2xl mx-auto">
            <CardContent className="p-0 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-accent/40">Interests or Industry Keywords</Label>
                <div className="relative">
                  <Input 
                    placeholder="e.g. Sustainable energy, pet tech, remote work..." 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    className="h-14 pl-12 bg-muted/20 border-accent/10 rounded-2xl font-bold text-accent"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent/20" />
                </div>
              </div>
              <Button onClick={handleDeploy} disabled={isProcessing || !input.trim()} className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all hover:scale-[1.01]">
                {isProcessing ? <Loader2 className="animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                Execute niche synthesis
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40 flex items-center gap-2">
                  <Sparkles className="h-3 w-3" /> Synthesis Results
                </h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" onClick={handleShare} size="sm" className="text-[9px] font-black uppercase tracking-widest">
                      <Share2 className="h-3 w-3 mr-2" /> Viral Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-[2rem] p-8 max-w-sm">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black uppercase italic">Share Protocol</DialogTitle>
                    </DialogHeader>
                    {isSharing ? <Loader2 className="animate-spin mx-auto"/> : (
                      <div className="space-y-6 pt-6">
                        <div className="flex justify-center gap-4">
                          <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} className="h-12 w-12 rounded-xl bg-[#1DA1F2] flex items-center justify-center text-white shadow-lg"><Twitter className="h-5 w-5"/></a>
                          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} className="h-12 w-12 rounded-xl bg-[#0077B5] flex items-center justify-center text-white shadow-lg"><Linkedin className="h-5 w-5"/></a>
                          <a href={`https://wa.me/?text=${shareUrl}`} className="h-12 w-12 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-lg"><MessageCircle className="h-5 w-5"/></a>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-xl text-center"><p className="text-[9px] font-bold truncate">{shareUrl}</p></div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.niches.map((niche: any, i: number) => (
                  <Card key={i} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden group hover:border-primary/20 border-2 border-transparent transition-all">
                    <CardHeader className="p-8 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest", 
                          niche.difficulty === 'LOW' ? "bg-green-50 text-green-600" : 
                          niche.difficulty === 'MEDIUM' ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600")}>
                          {niche.difficulty} Competition
                        </div>
                        <Target className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />
                      </div>
                      <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent leading-none">{niche.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                      <p className="text-sm font-medium text-accent/60 leading-relaxed italic">"{niche.explanation}"</p>
                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase text-accent/30 tracking-widest">Potential Models</p>
                        <div className="flex flex-wrap gap-2">
                          {niche.useCases.map((uc: string, j: number) => (
                            <span key={j} className="text-[9px] font-bold bg-muted/50 px-2 py-1 rounded-lg text-accent/60 uppercase">{uc}</span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
