"use client"

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/navbar';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
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
  Filter,
  Download,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { doc } from 'firebase/firestore';

// Dynamically import chart to prevent chunk loading errors in Turbopack/Next.js hydration
const OperationalChart = dynamic(
  () => import('@/components/dashboard/operational-chart'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-accent/5 rounded-2xl animate-pulse">
        <Activity className="h-8 w-8 text-primary/20" />
      </div>
    )
  }
);

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  
  const adminRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: adminData, isLoading: isAdminLoading } = useDoc(adminRef);

  // Re-verify and redirect if not admin
  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
      return;
    }
    
    // Redirect if we are sure the user is not an admin
    if (user && !isUserLoading && !isAdminLoading && !adminData) {
      // Only redirect if we checked and found no admin document
      router.push('/');
    }
  }, [user, isUserLoading, adminData, isAdminLoading, router]);

  if (isUserLoading || isAdminLoading || (!adminData && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <Activity className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40 italic">Authenticating Administrative Tunnel...</p>
        </div>
      </div>
    );
  }

  if (!user || !adminData) return null;

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="section-label">
                <ShieldCheck className="h-3 w-3 text-primary" />
                <span>Verified Admin: {user?.email}</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">System Intelligence</h1>
              <p className="text-muted-foreground font-medium">Real-time telemetry and global asset analytics.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl border-accent/10 bg-white shadow-sm font-bold text-[10px] uppercase tracking-widest h-11 px-6">
                <Download className="mr-2 h-3.5 w-3.5" /> Export Report
              </Button>
              <Button className="rounded-xl bg-accent text-white shadow-xl shadow-accent/20 font-bold text-[10px] uppercase tracking-widest h-11 px-6">
                <Activity className="mr-2 h-3.5 w-3.5" /> Live Stream
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Users", val: "12,842", delta: "+12%", icon: Users, up: true },
              { label: "Assets Processed", val: "849,201", delta: "+24%", icon: Files, up: true },
              { label: "System Health", val: "99.9%", delta: "Stable", icon: Activity, up: true },
              { label: "Network Latency", val: "14ms", delta: "-2ms", icon: Database, up: true },
            ].map((stat) => (
              <Card key={stat.label} className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden group hover:scale-[1.02] transition-all">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover:scale-110 transition-transform">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${stat.up ? 'text-green-600' : 'text-primary'}`}>
                      {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.delta}
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent/40 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-accent italic tracking-tighter">{stat.val}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-10 pb-0">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-black uppercase italic text-accent">Operational Throughput</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Document transformations over last 30 days</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="h-2 w-2 rounded-full bg-accent opacity-20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-8 h-[400px]">
                <OperationalChart />
              </CardContent>
            </Card>

            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-accent text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Activity className="h-32 w-32" />
              </div>
              <CardHeader className="p-10">
                <CardTitle className="text-xl font-black uppercase italic">Audit Registry</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-white/40">Recent system interactions</CardDescription>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-6">
                {[
                  { user: "j.doe@apple.com", op: "PDF Merge", time: "2m ago" },
                  { user: "sufian.admin", op: "Security Sweep", time: "14m ago" },
                  { user: "dev@google.com", op: "Excel Export", time: "32m ago" },
                  { user: "mark@tesla.com", op: "AES Unlock", time: "1h ago" },
                  { user: "lisa@meta.com", op: "Watermark", time: "3h ago" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-default">
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black uppercase italic group-hover:text-primary transition-colors">{log.user}</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{log.op}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-white/20">
                      <Clock className="h-3 w-3" />
                      {log.time}
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-white/40 hover:text-white font-black uppercase tracking-widest text-[9px] mt-4">
                  View Full Audit Trail
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* User Table */}
          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="p-10 border-b border-accent/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-black uppercase italic text-accent">User Intelligence</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Platform registration database</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-accent/30" />
                    <Input placeholder="SEARCH EMAIL..." className="h-10 pl-10 w-[240px] rounded-xl bg-muted/20 border-accent/5 text-[10px] font-bold" />
                  </div>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-accent/10">
                    <Filter className="h-4 w-4 text-accent/40" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 border-b border-accent/5">
                      <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-accent/40">User Account</th>
                      <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-accent/40">Role</th>
                      <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-accent/40">Operations</th>
                      <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-accent/40">Status</th>
                      <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-accent/40">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { email: "office.contact.sufian@gmail.com", role: "ADMIN", ops: 124, status: "Active", time: "NOW" },
                      { email: "sarah.connor@sky.net", role: "PRO", ops: 45, status: "Active", time: "12m ago" },
                      { email: "bruce.wayne@wayne.co", role: "ENTERPRISE", ops: 892, status: "Idle", time: "1h ago" },
                      { email: "clark.kent@daily.planet", role: "FREE", ops: 12, status: "Active", time: "2h ago" },
                      { email: "tony.stark@stark.ind", role: "ENTERPRISE", ops: 1542, status: "Active", time: "4h ago" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-accent/5 hover:bg-primary/5 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-accent text-white flex items-center justify-center text-[10px] font-black italic">
                              {row.email[0].toUpperCase()}
                            </div>
                            <span className="text-[11px] font-bold text-accent uppercase italic">{row.email}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${row.role === 'ADMIN' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-accent/5 border-accent/10 text-accent/60'}`}>
                            {row.role}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-[11px] font-black text-accent/60 italic">{row.ops} Units</td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${row.status === 'Active' ? 'bg-green-500' : 'bg-orange-400'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">{row.status}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-[10px] font-bold text-accent/40 uppercase tracking-widest">{row.time}</td>
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
