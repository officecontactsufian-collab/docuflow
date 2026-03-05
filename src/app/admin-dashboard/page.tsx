
"use client"

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Files, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  Search,
  Download,
  Database,
  Plus,
  Loader2,
  Trash2,
  UserPlus,
  LogOut,
  Settings2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { doc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';

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

  // Security Guard: Strict identity validation
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
      
      page.drawText("DOCUFLOW SYSTEM INTELLIGENCE", { x: 50, y: height - 50, size: 20, font: boldFont, color: rgb(0.14, 0.12, 0.29) });
      page.drawText(`SECURITY CLEARANCE: MASTER ADMIN | ${new Date().toLocaleString()}`, { x: 50, y: height - 75, size: 8 });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DocuFlow_Intelligence_Report.pdf`;
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
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="section-label">
                <ShieldCheck className="h-3 w-3 text-primary" />
                <span>Verified Master Admin: {user.email}</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic tracking-tighter">System Intelligence</h1>
              <p className="text-muted-foreground font-medium">Real-time Command Dashboard</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleExportReport} variant="outline" className="rounded-xl border-accent/10 bg-white shadow-sm font-bold text-[10px] uppercase h-11 px-6 tracking-widest">
                <Download className="mr-2 h-3.5 w-3.5" /> Archive Report
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="rounded-xl shadow-xl font-bold text-[10px] uppercase h-11 px-6 tracking-widest">
                <LogOut className="mr-2 h-3.5 w-3.5" /> Terminate Session
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Users", val: allUsers?.length || "0", delta: "Live", icon: Users, up: true },
              { label: "Total Assets", val: "849,201", delta: "+24%", icon: Files, up: true },
              { label: "System Health", val: "99.9%", delta: "Stable", icon: Activity, up: true },
              { label: "Gateway Status", val: "Active", delta: "Secure", icon: Database, up: true },
            ].map((stat) => (
              <Card key={stat.label} className="border-none shadow-xl rounded-[2rem] bg-white group hover:scale-[1.02] transition-all">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover:scale-110 transition-transform">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${stat.up ? 'text-green-600' : 'text-primary'}`}>
                      {stat.delta}
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent/40 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-accent italic tracking-tighter">{stat.val}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-10 pb-0">
                <CardTitle className="text-xl font-black uppercase italic text-accent tracking-tighter">Operational Throughput</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">Document Transformation Stream</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-8 h-[400px]">
                <OperationalChart />
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-accent text-white overflow-hidden">
              <CardHeader className="p-10">
                <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Audit Registry</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-white/40">Recent Interactions</CardDescription>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-6">
                {[
                  { user: "j.doe@apple.com", op: "PDF Merge", time: "2m ago" },
                  { user: "system.protocol", op: "Security Sweep", time: "14m ago" },
                  { user: "dev@google.com", op: "Excel Export", time: "32m ago" },
                  { user: "mark@tesla.com", op: "AES Unlock", time: "1h ago" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black uppercase italic text-white/80">{log.user}</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{log.op}</p>
                    </div>
                    <span className="text-[9px] font-bold text-white/20">{log.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="p-10 border-b border-accent/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-black uppercase italic text-accent tracking-tighter">User Intelligence</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">Platform Identity Database</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-accent/30" />
                  <Input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="FILTER REGISTRY..." 
                    className="h-10 pl-10 w-[240px] rounded-xl bg-muted/20 border-accent/5 text-[10px] font-bold tracking-widest" 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 border-b border-accent/5">
                    <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-accent/40">Account Identity</th>
                    <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-accent/40">Status</th>
                    <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-accent/40 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isUsersLoading ? (
                    <tr><td colSpan={3} className="p-20 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto opacity-10" /></td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan={3} className="p-20 text-center font-bold text-accent/20 uppercase text-[10px] tracking-widest italic">No matching identities found.</td></tr>
                  ) : filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-accent/5 hover:bg-primary/5 transition-colors group">
                      <td className="px-10 py-6 font-bold text-accent uppercase text-xs italic">{u.email}</td>
                      <td className="px-10 py-6">
                        <span className="text-[9px] font-black px-2 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 uppercase tracking-widest">Active Protocol</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteUser(u.id)}
                          className="h-8 w-8 text-accent/20 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
