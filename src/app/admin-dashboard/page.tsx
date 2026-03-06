
"use client"

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/navbar';
import { 
  useUser, 
  useFirestore, 
  useCollection, 
  useMemoFirebase, 
  deleteDocumentNonBlocking, 
  useAuth,
  addDocumentNonBlocking,
  setDocumentNonBlocking,
  useDoc
} from '@/firebase';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  Search,
  Database,
  Loader2,
  Trash2,
  LogOut,
  Clock,
  ShieldAlert,
  Zap,
  Globe,
  Settings2,
  Plus,
  Lock,
  Eye,
  ShieldX
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { doc, collection, serverTimestamp, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
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

  // Identities Registry
  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !user || user.email !== MASTER_ADMIN_EMAIL) return null;
    return collection(firestore, 'users');
  }, [firestore, user]);
  const { data: allUsers, isLoading: isUsersLoading } = useCollection(usersQuery);

  // Global Audit Registry
  const logsQuery = useMemoFirebase(() => {
    if (!firestore || !user || user.email !== MASTER_ADMIN_EMAIL) return null;
    // Querying the global usageLogs collection
    return query(collection(firestore, 'usageLogs'), orderBy('requestTimestamp', 'desc'), limit(50));
  }, [firestore, user]);
  const { data: allLogs, isLoading: isLogsLoading } = useCollection(logsQuery);

  // System Configuration
  const configRef = useMemoFirebase(() => {
    if (!firestore || !user || user.email !== MASTER_ADMIN_EMAIL) return null;
    return doc(firestore, 'system', 'config');
  }, [firestore, user]);
  const { data: sysConfig } = useDoc(configRef);

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
    toast({ title: "Identity Terminated", description: "User record removal initiated from lattice." });
  };

  const handleDeleteLog = (logId: string) => {
    if (!firestore) return;
    const logRef = doc(firestore, 'usageLogs', logId);
    deleteDocumentNonBlocking(logRef);
    toast({ title: "Registry Entry Purged", description: "Audit log successfully shredded." });
  };

  const handleAddManualLog = () => {
    if (!firestore || !user) return;
    const logsRef = collection(firestore, 'usageLogs');
    addDocumentNonBlocking(logsRef, {
      userId: "SYSTEM_OVERRIDE",
      toolUsed: "ADMIN_MANUAL_LOG",
      requestTimestamp: serverTimestamp(),
      status: "SUCCESS",
      costUnits: 0,
      ipAddress: "MASTER_CONSOLE"
    });
    toast({ title: "Registry Updated", description: "Manual audit entry injected." });
  };

  const handleToggleConfig = (key: string, val: boolean) => {
    if (!firestore || !configRef) return;
    setDocumentNonBlocking(configRef, {
      [key]: val,
      lastUpdated: serverTimestamp()
    }, { merge: true });
    toast({ title: "Protocol Shifted", description: `System parameter [${key}] updated successfully.` });
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
          {/* Command Header */}
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
                <Clock className="h-3 w-3" /> COMMAND CONSOLE ACTIVE • {user.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleAddManualLog} variant="outline" className="rounded-xl border-accent/10 bg-white hover:bg-muted/50 font-black text-[10px] uppercase h-12 px-6 tracking-widest transition-all">
                <Plus className="mr-2 h-4 w-4" /> Inject Log
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="rounded-xl shadow-xl shadow-destructive/20 font-black text-[10px] uppercase h-12 px-6 tracking-widest transition-all hover:scale-[1.02]">
                <LogOut className="mr-2 h-4 w-4" /> Terminate Access
              </Button>
            </div>
          </div>

          <Tabs defaultValue="lattice" className="space-y-8">
            <TabsList className="bg-white/50 border border-accent/5 p-1.5 rounded-[1.5rem] h-14 w-full sm:w-auto grid grid-cols-3 gap-2 backdrop-blur-xl shadow-inner">
              <TabsTrigger value="lattice" className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-accent data-[state=active]:text-white">
                <Users className="h-3.5 w-3.5" /> Identity Lattice
              </TabsTrigger>
              <TabsTrigger value="audit" className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-accent data-[state=active]:text-white">
                <Database className="h-3.5 w-3.5" /> Protocol Audit
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-accent data-[state=active]:text-white">
                <ShieldAlert className="h-3.5 w-3.5" /> Security Protocols
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lattice" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[
                  { label: "Identity Registry", val: allUsers?.length || "0", delta: "Active Units", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Processing Load", val: "849,201", delta: "+12.4% (24h)", icon: Zap, color: "text-primary", bg: "bg-primary/5" },
                  { label: "Protocol Uptime", val: "99.9%", delta: "Industrial Standard", icon: Activity, color: "text-green-600", bg: "bg-green-50" },
                  { label: "Gateway Nodes", val: "Active", delta: "Global Lattice", icon: Globe, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((stat) => (
                  <Card key={stat.label} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden relative group">
                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className={cn("p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-accent/20 italic">DOCFLOW v2.5</div>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 mb-1">{stat.label}</p>
                      <h3 className="text-4xl font-black text-accent italic tracking-tighter mb-2">{stat.val}</h3>
                      <span className="text-[9px] font-bold uppercase text-accent/60 bg-muted/50 px-2 py-0.5 rounded-full">{stat.delta}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                    <CardHeader className="p-10 border-b border-accent/5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                          <CardTitle className="text-2xl font-black uppercase italic text-accent tracking-tighter">Identity Lattice</CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">Platform Unit Registry</CardDescription>
                        </div>
                        <div className="relative group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/30" />
                          <Input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="FILTER IDENTITIES..." 
                            className="h-12 pl-12 w-full md:w-[320px] rounded-2xl bg-muted/30 border-accent/5 text-[10px] font-black tracking-[0.2em]" 
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-muted/30 border-b border-accent/5">
                            <tr>
                              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40">Identity Handle</th>
                              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40">Synthesis Date</th>
                              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40">Status</th>
                              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-accent/5">
                            {isUsersLoading ? (
                              <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 mx-auto text-primary/20" /></td></tr>
                            ) : filteredUsers.length === 0 ? (
                              <tr><td colSpan={4} className="p-20 text-center text-accent/20 font-black uppercase tracking-widest italic">No identities found in lattice.</td></tr>
                            ) : filteredUsers.map((u) => (
                              <tr key={u.id} className="hover:bg-primary/5 transition-colors">
                                <td className="px-10 py-8">
                                  <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center font-black text-xs">
                                      {u.email?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="space-y-0.5">
                                      <p className="font-black text-accent uppercase text-sm italic leading-none">{u.email}</p>
                                      <p className="text-[9px] font-bold text-accent/30 uppercase tracking-tighter">UID: {u.id.substring(0, 12)}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-10 py-8">
                                  <p className="text-[10px] font-bold text-accent/60 uppercase">
                                    {u.createdAt instanceof Timestamp ? u.createdAt.toDate().toLocaleString() : u.createdAt || "Archival Entry"}
                                  </p>
                                </td>
                                <td className="px-10 py-8"><Badge className="bg-green-50 text-green-600 rounded-lg px-2 text-[9px] uppercase">Active Unit</Badge></td>
                                <td className="px-10 py-8 text-right">
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(u.id)} className="h-10 w-10 rounded-xl text-accent/20 hover:text-destructive hover:bg-destructive/5 transition-all">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-4">
                  <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden h-full">
                    <CardHeader className="p-10 pb-4">
                      <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-accent">Operational Flow</CardTitle>
                      <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Temporal Throughput Analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 h-[400px]">
                      <OperationalChart />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="space-y-8">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                <CardHeader className="p-10 border-b border-accent/5 flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black uppercase italic text-accent tracking-tighter">Protocol Audit</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">Global Sequence Registry</CardDescription>
                  </div>
                  <Badge variant="outline" className="rounded-full border-accent/5 px-4 font-black uppercase text-[8px]">Live Feed</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-muted/30 border-b border-accent/5">
                        <tr>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40">Timestamp</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40">Protocol</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40">Status</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-accent/40 text-right">Registry Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/5">
                        {isLogsLoading ? (
                          <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 mx-auto text-primary/20" /></td></tr>
                        ) : allLogs?.length === 0 ? (
                          <tr><td colSpan={4} className="p-20 text-center text-accent/20 font-black uppercase tracking-widest italic">No sequence data archived.</td></tr>
                        ) : allLogs?.map((log) => (
                          <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-10 py-6">
                              <p className="text-[10px] font-bold text-accent italic">{log.requestTimestamp?.toDate().toLocaleString() || "Syncing..."}</p>
                            </td>
                            <td className="px-10 py-6">
                              <Badge variant="outline" className="border-accent/10 text-accent font-black text-[8px] uppercase px-2">{log.toolUsed}</Badge>
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-2">
                                <div className={cn("h-1.5 w-1.5 rounded-full", log.status === 'SUCCESS' ? "bg-green-500" : "bg-red-500")} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{log.status}</span>
                              </div>
                            </td>
                            <td className="px-10 py-6 text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteLog(log.id)} className="h-8 w-8 rounded-lg text-accent/20 hover:text-destructive transition-all">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-2xl rounded-[3rem] bg-accent text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <ShieldAlert className="w-48 h-48" />
                  </div>
                  <CardHeader className="p-10 pb-6 relative z-10">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                      <Settings2 className="h-6 w-6 text-primary" /> Global Protocol Config
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-white/40 italic">Control core system behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 pt-0 space-y-10 relative z-10">
                    {[
                      { label: "Maintenance Protocol", key: "maintenanceMode", desc: "Freeze all public transformation tunnels." },
                      { label: "Strict Rate Limiting", key: "strictRateLimiting", desc: "Apply aggressive temporal thresholds to usage." },
                      { label: "Anonymization Hardening", key: "anonymizationHardening", desc: "Enforce deep metadata erasure across all ops." }
                    ].map((config) => (
                      <div key={config.key} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 group hover:border-primary/40 transition-all">
                        <div className="space-y-1">
                          <h4 className="text-sm font-black uppercase italic tracking-widest">{config.label}</h4>
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-tight">{config.desc}</p>
                        </div>
                        <Switch 
                          checked={sysConfig?.[config.key] || false}
                          onCheckedChange={(v) => handleToggleConfig(config.key, v)}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                  <CardHeader className="p-10 pb-6">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-accent flex items-center gap-3">
                      <Lock className="h-6 w-6 text-primary" /> Hardware Locks
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">Encrypted System Parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 pt-0 space-y-8">
                    <div className="p-8 bg-muted/30 rounded-[2.5rem] border border-accent/5 space-y-6">
                       <div className="flex items-center gap-4 text-accent/40">
                          <Eye className="h-5 w-5" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Administrative Override Level: 0</p>
                       </div>
                       <div className="h-px w-full bg-accent/5" />
                       <div className="space-y-4">
                          <p className="text-[11px] font-bold text-accent/60 uppercase leading-relaxed italic">
                            System rules are enforced via Firestore Security Logic and local buffer encryption. 
                            These toggles shift the operational parameters stored in the /system registry.
                          </p>
                          <Button variant="outline" className="w-full h-14 rounded-2xl border-accent/10 font-black uppercase tracking-widest text-[10px]">
                            <ShieldX className="mr-2 h-4 w-4" /> Reset System Rules
                          </Button>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
