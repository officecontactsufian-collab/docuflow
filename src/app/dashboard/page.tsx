
"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, limit, doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { 
  Loader2, 
  User, 
  Activity, 
  Clock, 
  ShieldCheck, 
  LogOut, 
  Zap, 
  LayoutDashboard,
  BrainCircuit,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [profile, setProfile] = React.useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = React.useState(true);

  // usageLogs registry
  const logsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'usageLogs'), orderBy('requestTimestamp', 'desc'), limit(20));
  }, [firestore, user]);
  const { data: logs, isLoading: isLogsLoading } = useCollection(logsQuery);

  React.useEffect(() => {
    if (!isUserLoading) {
      if (!user || user.isAnonymous) {
        router.push('/login');
      } else {
        ensureProfile();
      }
    }
  }, [user, isUserLoading, router]);

  const ensureProfile = async () => {
    if (!user || !firestore) return;
    try {
      const userRef = doc(firestore, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        const newProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Anonymous Professional',
          createdAt: serverTimestamp(),
          usageCount: 0
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Session Terminated", description: "You have been securely logged out." });
      router.push('/');
    } catch (e) {
      toast({ variant: "destructive", title: "Protocol Error", description: "Failed to end session." });
    }
  };

  if (isUserLoading || isProfileLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40 italic">Retrieving Professional Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-accent/5 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-[2rem] bg-accent text-white flex items-center justify-center shadow-xl border-4 border-primary/10">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover rounded-[1.8rem]" />
                ) : (
                  <User className="h-10 w-10 text-primary" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black tracking-tighter text-accent uppercase italic leading-none">{profile?.displayName}</h1>
                  <Badge className="bg-primary/5 text-primary border-primary/10 rounded-lg px-2 text-[8px] font-black uppercase tracking-widest">Pro Unit</Badge>
                </div>
                <p className="text-[10px] font-bold text-accent/40 uppercase tracking-widest italic">{user.email} • UNIT ID: {user.uid.substring(0, 12)}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="destructive" className="rounded-xl shadow-xl shadow-destructive/20 font-black text-[10px] uppercase h-12 px-8 tracking-widest transition-all hover:scale-[1.02]">
              <LogOut className="mr-2 h-4 w-4" /> End Session
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-accent text-white overflow-hidden relative">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Operational Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Protocol Throughput</p>
                    <div className="text-5xl font-black italic tracking-tighter">{logs?.length || 0}</div>
                    <p className="text-[8px] font-bold text-white/40 uppercase">Total transformations executed</p>
                  </div>
                  <div className="h-px w-full bg-white/5" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[8px] font-black uppercase text-white/20 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase">Active</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-white/20 mb-1">Clearance</p>
                      <span className="text-[9px] font-black uppercase text-primary">Lvl 1 Standard</span>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                  <Zap className="h-40 w-40 text-primary" />
                </div>
              </Card>

              <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent italic">Zero-Retention Buffer</span>
                </div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed">
                  Historical registries store metadata only. Document binary streams are purged immediately upon session termination.
                </p>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white h-full overflow-hidden">
                <CardHeader className="p-10 border-b border-accent/5 flex flex-row items-center justify-between bg-muted/5">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent flex items-center gap-3">
                      <Activity className="h-5 w-5 text-primary" /> Sequence Audit
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">Registry of recent transformations</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-accent/10 text-accent font-black text-[8px] uppercase px-3 rounded-full">Protocol Stream</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-muted/30 border-b border-accent/5">
                        <tr>
                          <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-accent/40">Timestamp</th>
                          <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-accent/40">Protocol</th>
                          <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-accent/40">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/5">
                        {isLogsLoading ? (
                          <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 mx-auto text-primary/20" /></td></tr>
                        ) : !logs || logs.length === 0 ? (
                          <tr><td colSpan={3} className="p-20 text-center text-accent/20 font-black uppercase tracking-widest italic">No sequence data archived in your registry.</td></tr>
                        ) : logs.map((log) => (
                          <tr key={log.id} className="hover:bg-primary/5 transition-colors">
                            <td className="px-10 py-6">
                              <p className="text-[10px] font-bold text-accent italic">
                                {log.requestTimestamp instanceof Timestamp ? log.requestTimestamp.toDate().toLocaleString() : 'Syncing...'}
                              </p>
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-lg"><FileText className="h-3.5 w-3.5 text-primary" /></div>
                                <span className="text-[10px] font-black uppercase text-accent">{log.toolUsed || 'Unknown Protocol'}</span>
                              </div>
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                <span className="text-[9px] font-black uppercase text-accent/60 tracking-tighter">Verified</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
