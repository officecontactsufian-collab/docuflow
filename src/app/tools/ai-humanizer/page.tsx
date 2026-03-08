"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  UserCheck, 
  Loader2, 
  Copy, 
  Share2, 
  BrainCircuit,
  ShieldCheck,
  Zap,
  Twitter,
  Linkedin,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeHumanizerAction } from './actions';
import { useUser, useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, query, where, getDocs, limit, serverTimestamp, doc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

export default function AIHumanizerPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [input, setInput] = React.useState('');
  const [result, setResult] = React.useState<any>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);
  const [shareSlug, setShareSlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isUserLoading && !user && auth) {
      signInAnonymously(auth).catch(console.error);
    }
  }, [user, isUserLoading, auth]);

  const handleHumanize = async () => {
    if (!input.trim() || !user || !firestore) return;
    setIsProcessing(true);
    setResult(null);
    setShareSlug(null);

    try {
      const q = query(collection(firestore, 'usageLogs'), where('userId', '==', user.uid), limit(10));
      const snap = await getDocs(q);
      if (snap.size >= 10) throw new Error("DAILY_LIMIT_REACHED");

      const res = await executeHumanizerAction({ text: input });
      setResult(res);

      addDocumentNonBlocking(collection(firestore, 'usageLogs'), { userId: user.uid, toolUsed: 'AI_HUMANIZER', requestTimestamp: serverTimestamp() });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!user || !firestore || !result) return;
    setIsSharing(true);
    try {
      const slug = `human-${Math.random().toString(36).substring(2, 8)}`;
      await setDocumentNonBlocking(doc(firestore, 'public_ai_results', slug), {
        creatorId: user.uid,
        toolName: 'AI Humanizer',
        generatedContent: result.humanizedText,
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
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="section-label mx-auto">
              <UserCheck className="h-3 w-3 text-primary" />
              <span>Natural Linguistic Synthesis</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent uppercase italic">AI <span className="text-primary not-italic">Humanizer.</span></h1>
            <p className="text-accent/60 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto">
              Transform rigid AI-generated output into natural, engaging human writing.
            </p>
          </div>

          <div className="grid gap-8">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-8">
              <CardContent className="p-0 space-y-6">
                <Textarea 
                  placeholder="Paste AI text here..." 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] bg-muted/20 border-accent/5 rounded-2xl font-bold"
                />
                <Button onClick={handleHumanize} disabled={isProcessing || !input.trim()} className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px]">
                  {isProcessing ? <Loader2 className="animate-spin" /> : "Synthesize Human Text"}
                </Button>
              </CardContent>
            </Card>

            {result && (
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-10 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase text-accent/40 tracking-widest">Humanized Output</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(result.humanizedText)}><Copy className="h-4 w-4"/></Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleShare}><Share2 className="h-4 w-4"/></Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2rem] p-8 max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-black uppercase italic">Share Result</DialogTitle>
                        </DialogHeader>
                        {isSharing ? <Loader2 className="animate-spin mx-auto"/> : (
                          <div className="flex justify-center gap-4 pt-6">
                            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-white"><Twitter className="h-5 w-5"/></a>
                            <a href={`https://wa.me/?text=${shareUrl}`} className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-white"><MessageCircle className="h-5 w-5"/></a>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="text-lg font-medium leading-relaxed text-accent/80 whitespace-pre-wrap">
                  {result.humanizedText}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
