"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  RefreshCcw, 
  Loader2, 
  Copy, 
  Share2, 
  Zap,
  Twitter,
  Linkedin,
  MessageCircle,
  FileText,
  Video,
  Hash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeRepurposerAction } from './actions';
import { useUser, useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, query, where, getDocs, limit, serverTimestamp, doc, orderBy, Timestamp } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ContentRepurposerPage() {
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

  const handleRepurpose = async () => {
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

      const res = await executeRepurposerAction({ content: input });
      setResult(res);
      
      const logData = { userId: user.uid, toolUsed: 'AI_REPURPOSER', requestTimestamp: serverTimestamp(), status: 'SUCCESS' };
      addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'usageLogs'), logData);
      addDocumentNonBlocking(collection(firestore, 'usageLogs'), logData);
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
      const slug = `repurpose-${Math.random().toString(36).substring(2, 8)}`;
      const formattedContent = `X THREAD:\n${result.tweetThread.join('\n')}\n\nLINKEDIN POST:\n${result.linkedInPost}\n\nTIKTOK SCRIPT:\n${result.tiktokScript}\n\nSUMMARY:\n${result.shortSummary}`;
      
      await setDocumentNonBlocking(doc(firestore, 'public_ai_results', slug), {
        creatorId: user.uid,
        toolName: 'AI Content Repurposer',
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
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-accent uppercase italic">Content <span className="text-primary not-italic">Repurposer.</span></h1>
            <p className="text-accent/60 font-bold uppercase tracking-widest text-xs">Transform one asset into a viral omnichannel stream.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-8">
              <CardContent className="p-0 space-y-6">
                <Label className="text-[10px] font-black uppercase tracking-widest">Source Content</Label>
                <Textarea 
                  placeholder="Paste your article or transcript..." 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] bg-muted/20 border-accent/5 rounded-2xl font-bold"
                />
                <Button onClick={handleRepurpose} disabled={isProcessing || !input.trim()} className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl">
                  {isProcessing ? <Loader2 className="animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                  Deploy omnichannel synthesis
                </Button>
              </CardContent>
            </Card>

            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="flex items-center justify-between px-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40">Synthesis Layers</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" onClick={handleShare} size="sm" className="text-[9px] font-black uppercase text-primary">
                        <Share2 className="h-3 w-3 mr-2" /> Viral Distribution
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2rem] p-8 max-w-sm">
                      {isSharing ? <Loader2 className="animate-spin mx-auto"/> : (
                        <div className="space-y-6 pt-6 flex flex-col items-center">
                          <div className="flex gap-4">
                            <a href={`https://wa.me/?text=${shareUrl}`} className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg"><MessageCircle className="h-5 w-5"/></a>
                            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-white shadow-lg"><Twitter className="h-5 w-5"/></a>
                          </div>
                          <p className="text-[9px] font-bold truncate opacity-40">{shareUrl}</p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>

                <Tabs defaultValue="x" className="w-full space-y-6">
                  <TabsList className="bg-white/50 border border-accent/5 p-1 rounded-2xl h-14 w-full grid grid-cols-4">
                    <TabsTrigger value="x" className="rounded-xl font-black text-[9px] uppercase"><Twitter className="h-3 w-3 mr-2"/> X</TabsTrigger>
                    <TabsTrigger value="li" className="rounded-xl font-black text-[9px] uppercase"><Linkedin className="h-3 w-3 mr-2"/> LI</TabsTrigger>
                    <TabsTrigger value="tk" className="rounded-xl font-black text-[9px] uppercase"><Video className="h-3 w-3 mr-2"/> TK</TabsTrigger>
                    <TabsTrigger value="sum" className="rounded-xl font-black text-[9px] uppercase"><FileText className="h-3 w-3 mr-2"/> SUM</TabsTrigger>
                  </TabsList>

                  <TabsContent value="x">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-8 space-y-4">
                      {result.tweetThread.map((t: string, i: number) => (
                        <div key={i} className="p-4 bg-muted/20 rounded-xl border border-accent/5 text-sm font-medium">{t}</div>
                      ))}
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="li">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-8">
                      <div className="whitespace-pre-wrap text-sm font-medium">{result.linkedInPost}</div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="tk">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-8">
                      <div className="whitespace-pre-wrap text-sm font-medium">{result.tiktokScript}</div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="sum">
                    <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-8">
                      <div className="text-sm font-medium italic">{result.shortSummary}</div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[3rem] opacity-20 bg-white/50 min-h-[400px]">
                <Hash className="h-12 w-12 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-center">Awaiting Content Payload...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
