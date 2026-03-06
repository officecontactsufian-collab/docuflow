"use client"

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Files, 
  Activity, 
  ShieldCheck, 
  Search,
  Download,
  Database,
  Loader2,
  Trash2,
  LogOut,
  Clock,
  ExternalLink,
  ShieldAlert,
  Server,
  Zap,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { doc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';

const OperationalChart = dynamic(
  () => import('@/components/dashboard/operational-chart'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-accent/5 rounded-2xl animate-pulse" />
  }
);

const MASTER_ADMIN_EMAIL = 'office.contact.sufian@gmail.com';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    if (!isUserLoading) {
      if (!user || user.email !== MASTER_ADMIN_EMAIL) {
        router.push('/');
      }
    }
  }, [user, isUserLoading, router]);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore || user?.email !== MASTER_ADMIN_EMAIL) return null;
    return collection(firestore, 'users');
  }, [firestore, user]);

  const { data: allUsers, isLoading: isUsersLoading } = useCollection(usersQuery);

  const filteredUsers = React.useMemo(() => {
    if (!allUsers) return [];
    return allUsers.filter(u => 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleDeleteUser = (userId: string) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', userId);
    deleteDocumentNonBlocking(userRef);
    toast({ title: "Protocol Executed", description: "User record removal initiated." });
  };

  const handleExportReport = async () => {
    if (!allUsers) return;
    try {
      const pdfDoc = await PDFDocument.create();
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const page = pdfDoc.addPage([595, 842]);
      const { height } = page.getSize();
      
      page.drawText("DOCFLOW SYSTEM INTELLIGENCE", { x: 50, y: height - 50, size: 20, font: boldFont, color: rgb(0.14, 0.12, 0.29) });
      page.drawText(`SECURITY CLEARANCE: MASTER ADMIN | ${new Date().toLocaleString()}`, { x: 50, y: height - 75, size: 8 });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DOCFLOW_Intelligence_Report_${Date.now()}.pdf`;
      link.click();
      toast({ title: "Report Exported", description: "System telemetry archived successfully." });
    } catch (e) {
      toast({ variant: "destructive", title: "Export Error" });
    }
  };

  if (isUserLoading || !user || user.email !== MASTER_ADMIN_EMAIL) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40 italic">Authenticating Administrative Tunnel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA]">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Command Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-accent/5 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-1">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest">
                  <ShieldCheck className="h-3 w-3" /> Master Clearance
                </Badge>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">System Online</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic leading-none">System Intelligence</h1>
              <p className="text-[10px] font-bold text-accent/40 uppercase tracking-widest italic flex items-center gap-2">
                <Clock className="h-3 w-3" /> Real-time Command Dashboard • Session active for: {user.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleExportReport} variant="outline" className="rounded-xl border-accent/10 bg-white hover:bg-muted/50 font-black text-[10px] uppercase h-12 px-6 tracking-widest transition-all">
                <Download className="mr-2 h-4 w-4" /> Archive Intelligence
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="rounded-xl shadow-xl shadow-destructive/20 font-black text-[10px] uppercase h-12 px-6 tracking-widest transition-all hover:scale-[1.02]">
                <LogOut className="mr-2 h-4 w-4" /> Terminate Access
              </Button>
            </div>
          </div>

          {/* Core Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Identity Registry", val: allUsers?.length || "0", delta: "Active Units", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Processing Load", val: "849,201", delta: "+12.4% (24h)", icon: Zap, color: "text-primary", bg: "bg-primary/5" },
              { label: "Protocol Uptime", val: "99.9%", delta: "Industrial Standard", icon: Activity, color: "text-green-600", bg: "bg-green-50" },
              { label: "Gateway Nodes", val: "Active", delta: "Global Lattice", icon: Globe, color: "text-purple-600", bg: "bg-purple-50" },
            ].map((stat) => (
              <Card key={stat.label} className="border-none shadow-xl rounded-[2.5rem] bg-white group hover:-translate-y-1 transition-all duration-500 overflow-hidden relative">
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none", stat.bg)} />
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={cn("p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 duration-500", stat.bg, stat.color)}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-accent/20 italic">DOCFLOW v2.5</div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 mb-1">{stat.label}</p>
                  <h3 className="text-4xl font-black text-accent italic tracking-tighter mb-2">{stat.val}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase text-accent/60 bg-muted/50 px-2 py-0.5 rounded-full">{stat.delta}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Throughput Chart */}
            <Card className="lg:col-span-8 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
              <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black uppercase italic text-accent tracking-tighter">Operational Throughput</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic flex items-center gap-2">
                    <Server className="h-3 w-3 text-primary" /> Document Transformation Stream (7-Day Metric)
                  </CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full border-accent/5 px-4 font-black uppercase text-[8px] tracking-widest">Live Telemetry</Badge>
              </CardHeader>
              <CardContent className="p-10 pt-8 h-[450px]">
                <OperationalChart />
              </CardContent>
            </Card>

            {/* Audit Registry Sidebar */}
            <Card className="lg:col-span-4 border-none shadow-2xl rounded-[3rem] bg-accent text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                <ShieldAlert className="w-48 h-48" />
              </div>
              <CardHeader className="p-10 pb-6 relative z-10">
                <CardTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                  <Database className="h-6 w-6 text-primary" /> Audit Registry
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Real-time Interface Logs</CardDescription>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-6 relative z-10">
                {[
                  { user: "j.doe@apple.com", op: "PDF Merge Sequence", time: "2m ago", status: "Verified" },
                  { user: "system.protocol", op: "Security Buffering", time: "14m ago", status: "Success" },
                  { user: "dev@google.com", op: "AI Synthesis", time: "32m ago", status: "Cached" },
                  { user: "mark@tesla.com", op: "Identity Synthesis", time: "1h ago", status: "Signed" },
                  { user: "admin@docflow", op: "Intelligence Archival", time: "3h ago", status: "Archive" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between group/item p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                    <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase italic text-white/90 group-hover/item:text-primary transition-colors">{log.user}</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{log.op}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-primary uppercase italic">{log.status}</p>
                      <span className="text-[8px] font-bold text-white/20 uppercase">{log.time}</span>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full h-12 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[9px] tracking-[0.3em] mt-4">
                  View Expanded Logs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* User Intelligence Database */}
          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="p-10 border-b border-accent/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-black uppercase italic text-accent tracking-tighter">User Intelligence</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic flex items-center gap-2">
                    <Users className="h-3 w-3 text-primary" /> Platform Identity Registry
                  </CardDescription>
                </div>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/30 group-focus-within:text-primary transition-colors" />
                  <Input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="FILTER REGISTRY..." 
                    className="h-12 pl-12 w-full md:w-[320px] rounded-2xl bg-muted/30 border-accent/5 text-[10px] font-black tracking-[0.2em] focus:ring-primary/20" 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 border-b border-accent/5">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 italic">Account Identity</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 italic">Registration Registry</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 italic">Clearance</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 italic text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-accent/5">
                    {isUsersLoading ? (
                      <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 mx-auto text-primary/20" /></td></tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan={4} className="p-20 text-center font-black text-accent/10 uppercase text-[12px] tracking-[0.4em] italic py-32">No matching identities found in registry.</td></tr>
                    ) : filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-primary/5 transition-colors group relative">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center font-black text-xs">
                              {u.email?.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-black text-accent uppercase text-sm italic leading-none">{u.email}</p>
                              <p className="text-[9px] font-bold text-accent/30 uppercase tracking-tighter">UID: {u.id.substring(0, 12)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-[10px] font-bold text-accent/60 uppercase tracking-tight italic">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "Archival Entry"}
                          </p>
                        </td>
                        <td className="px-10 py-8">
                          <Badge className="bg-green-50 text-green-600 border-green-100 hover:bg-green-50 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest">
                            Authorized Unit
                          </Badge>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl text-accent/20 hover:text-accent hover:bg-white transition-all shadow-sm"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteUser(u.id)}
                              className="h-10 w-10 rounded-xl text-accent/20 hover:text-destructive hover:bg-destructive/5 transition-all shadow-sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
      </main>
    </div>
  );
}
