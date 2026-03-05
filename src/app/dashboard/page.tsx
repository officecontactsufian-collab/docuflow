
"use client"

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/navbar';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
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
  UserPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { doc, collection, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

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

const MASTER_ADMIN_EMAIL = 'office.contact.sufian@gmail.com';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isProvisioning, setIsProvisioning] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState('');
  const [newRole, setNewRole] = React.useState('standard');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLiveStreamActive, setIsLiveStreamActive] = React.useState(false);

  const adminRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: adminData, isLoading: isAdminLoading } = useDoc(adminRef);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: allUsers, isLoading: isUsersLoading } = useCollection(usersQuery);

  const filteredUsers = React.useMemo(() => {
    if (!allUsers) return [];
    return allUsers.filter(u => 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);

  React.useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    const isMasterAdmin = user.email === MASTER_ADMIN_EMAIL;
    if (!isMasterAdmin && !isAdminLoading && !adminData) {
      router.push('/');
    }
  }, [user, isUserLoading, adminData, isAdminLoading, router]);

  const handleExportReport = async () => {
    if (!allUsers) return;
    
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      let page = pdfDoc.addPage([595, 842]);
      const { width, height } = page.getSize();
      let y = height - 50;

      // High-Fidelity Branding Header
      page.drawRectangle({
        x: 0,
        y: height - 100,
        width: width,
        height: 100,
        color: rgb(0.14, 0.12, 0.29), // Accent color
      });

      page.drawText("DOCUFLOW SYSTEM INTELLIGENCE BRIEF", { 
        x: 50, 
        y: height - 50, 
        size: 20, 
        font: boldFont, 
        color: rgb(1, 1, 1) 
      });
      
      page.drawText(`SECURITY CLEARANCE: MASTER ADMIN | GENERATED: ${new Date().toLocaleString()}`, { 
        x: 50, 
        y: height - 75, 
        size: 8, 
        font: font, 
        color: rgb(0.8, 0.8, 0.8) 
      });

      y = height - 140;

      // Operational Telemetry Summary
      page.drawText("OPERATIONAL TELEMETRY", { x: 50, y, size: 12, font: boldFont, color: rgb(0.87, 0.29, 0.42) });
      y -= 30;

      const stats = [
        { label: "Total Platform Users", value: String(allUsers.length) },
        { label: "Total Assets Processed", value: "849,201" },
        { label: "System Health Rating", value: "99.9% Stable" },
        { label: "Security Protocol", value: "AES-256 Enterprise" }
      ];

      stats.forEach(s => {
        page.drawText(`${s.label}:`, { x: 50, y, size: 10, font: boldFont });
        page.drawText(s.value, { x: 250, y, size: 10, font });
        y -= 18;
      });

      y -= 40;

      // User Registry Table
      page.drawText("GLOBAL USER REGISTRY", { x: 50, y, size: 12, font: boldFont, color: rgb(0.87, 0.29, 0.42) });
      y -= 25;

      // Table Headers
      page.drawRectangle({
        x: 40,
        y: y - 5,
        width: width - 80,
        height: 25,
        color: rgb(0.95, 0.95, 0.95),
      });

      const colWidths = [220, 80, 100, 80];
      const headers = ["Account Identity", "Privilege", "Registered", "Status"];
      
      headers.forEach((header, i) => {
        const x = 50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
        page.drawText(header.toUpperCase(), { x, y, size: 9, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
      });
      y -= 30;

      // Table Rows
      for (const userRow of allUsers) {
        if (y < 60) {
          page = pdfDoc.addPage([595, 842]);
          y = height - 50;
          
          // Repeat headers on new page
          page.drawRectangle({ x: 40, y: y - 5, width: width - 80, height: 25, color: rgb(0.95, 0.95, 0.95) });
          headers.forEach((header, i) => {
            const x = 50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
            page.drawText(header.toUpperCase(), { x, y, size: 9, font: boldFont, color: rgb(0.3, 0.3, 0.3) });
          });
          y -= 30;
        }

        const rowData = [
          userRow.email || 'ANONYMOUS',
          (userRow.role || 'standard').toUpperCase(),
          userRow.creationDateTime ? new Date(userRow.creationDateTime).toLocaleDateString() : 'LEGACY',
          (userRow.status || 'Active').toUpperCase()
        ];

        rowData.forEach((text, i) => {
          const x = 50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
          page.drawText(String(text).substring(0, 45), { x, y, size: 8, font, color: rgb(0.1, 0.1, 0.1) });
        });

        // Subtle row line
        page.drawLine({
          start: { x: 40, y: y - 5 },
          end: { x: width - 40, y: y - 5 },
          thickness: 0.5,
          color: rgb(0.9, 0.9, 0.9),
        });

        y -= 22;
      }

      // Final Legal Footer
      const footerText = "CONFIDENTIAL SYSTEM INTELLIGENCE - DOCUFLOW PROFESSIONAL INTERNAL ARCHIVE";
      const footerWidth = font.widthOfTextAtSize(footerText, 7);
      page.drawText(footerText, { 
        x: (width / 2) - (footerWidth / 2), 
        y: 25, 
        size: 7, 
        font, 
        color: rgb(0.6, 0.6, 0.6) 
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DocuFlow_Intelligence_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({ title: "Report Deployed", description: "Industrial intelligence report generated successfully." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Export Error", description: "Failed to generate professional PDF report." });
    }
  };

  const handleProvisionAccount = () => {
    if (!firestore || !newEmail) return;
    setIsProvisioning(true);

    const tempId = Math.random().toString(36).substring(7);
    const userRef = doc(firestore, 'users', tempId);
    const userData = {
      id: tempId,
      email: newEmail,
      role: newRole,
      status: 'active',
      creationDateTime: new Date().toISOString(),
      provisionedBy: user?.email
    };

    setDocumentNonBlocking(userRef, userData, { merge: true });
    
    if (newRole === 'admin') {
      const markerRef = doc(firestore, 'roles_admin', tempId);
      setDocumentNonBlocking(markerRef, { id: tempId, email: newEmail, role: 'admin' }, { merge: true });
    }

    toast({ title: "Protocol Initiated", description: `${newRole.toUpperCase()} account provisioned for ${newEmail}.` });
    setNewEmail('');
    setIsProvisioning(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'users', userId));
      await deleteDoc(doc(firestore, 'roles_admin', userId)).catch(() => {});
      toast({ title: "Record Shredded", description: "User intelligence data has been purged." });
    } catch (e) {
      toast({ variant: "destructive", title: "Shredder Error", description: "Failed to delete user record." });
    }
  };

  if (isUserLoading || (isAdminLoading && user?.email !== MASTER_ADMIN_EMAIL)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <Activity className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/40 italic">Authenticating Administrative Tunnel...</p>
        </div>
      </div>
    );
  }

  const isAuthorized = user && (user.email === MASTER_ADMIN_EMAIL || adminData);
  if (!isAuthorized) return null;

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
              <Button onClick={handleExportReport} variant="outline" className="rounded-xl border-accent/10 bg-white shadow-sm font-bold text-[10px] uppercase tracking-widest h-11 px-6">
                <Download className="mr-2 h-3.5 w-3.5" /> Export Report (PDF)
              </Button>
              <Button 
                onClick={() => {
                  setIsLiveStreamActive(!isLiveStreamActive);
                  toast({ title: isLiveStreamActive ? "Stream Terminated" : "Stream Active", description: "Live telemetry synchronization updated." });
                }}
                className={`rounded-xl shadow-xl font-bold text-[10px] uppercase tracking-widest h-11 px-6 transition-all ${isLiveStreamActive ? 'bg-primary text-white shadow-primary/20' : 'bg-accent text-white shadow-accent/20'}`}
              >
                <Activity className={`mr-2 h-3.5 w-3.5 ${isLiveStreamActive ? 'animate-pulse' : ''}`} /> {isLiveStreamActive ? 'Live Syncing' : 'Live Stream'}
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Platform Users", val: allUsers?.length || "...", delta: "+12%", icon: Users, up: true },
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
                    <Input 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="SEARCH EMAIL..." 
                      className="h-10 pl-10 w-[240px] rounded-xl bg-muted/20 border-accent/5 text-[10px] font-bold" 
                    />
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="h-10 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 font-bold text-[10px] uppercase tracking-widest px-6">
                        <Plus className="mr-2 h-3.5 w-3.5" /> Provision Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2rem] border-none shadow-2xl bg-white max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase italic text-accent">New Intelligence Profile</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold uppercase tracking-widest">Establish a new professional user or worker identity.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Email Protocol</Label>
                          <Input 
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="NAME@COMPANY.COM" 
                            className="h-12 rounded-xl bg-muted/20 border-accent/10 font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Privilege Level</Label>
                          <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-accent/10 font-bold uppercase text-[10px]">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-accent/10">
                              <SelectItem value="standard" className="text-xs font-bold uppercase">Standard User</SelectItem>
                              <SelectItem value="worker" className="text-xs font-bold uppercase">Worker Protocol</SelectItem>
                              <SelectItem value="admin" className="text-xs font-bold uppercase">Intelligence Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handleProvisionAccount}
                          disabled={isProvisioning || !newEmail}
                          className="w-full h-12 rounded-xl bg-accent text-white font-black uppercase tracking-widest text-[10px]"
                        >
                          {isProvisioning ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                          Establish Profile
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                      <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-accent/40">Registered</th>
                      <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-accent/40">Status</th>
                      <th className="px-10 py-5 text-[9px] font-black uppercase tracking-widest text-accent/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isUsersLoading ? (
                      <tr>
                        <td colSpan={5} className="px-10 py-20 text-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary/20 mx-auto" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-accent/20 mt-4 italic">Retrieving Global Registry...</p>
                        </td>
                      </tr>
                    ) : filteredUsers.map((userRow, i) => (
                      <tr key={userRow.id} className="border-b border-accent/5 hover:bg-primary/5 transition-colors group">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-accent text-white flex items-center justify-center text-[10px] font-black italic">
                              {userRow.email?.[0].toUpperCase() || 'U'}
                            </div>
                            <span className="text-[11px] font-bold text-accent uppercase italic">{userRow.email}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${
                            userRow.role === 'admin' ? 'bg-primary/10 border-primary/20 text-primary' : 
                            userRow.role === 'worker' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 
                            'bg-accent/5 border-accent/10 text-accent/60'
                          }`}>
                            {(userRow.role || 'standard').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-[10px] font-bold text-accent/40 uppercase tracking-widest">
                          {userRow.creationDateTime ? new Date(userRow.creationDateTime).toLocaleDateString() : 'LEGACY'}
                        </td>
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${userRow.status === 'active' ? 'bg-green-500' : 'bg-orange-400'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">{userRow.status || 'Active'}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteUser(userRow.id)}
                            className="h-8 w-8 rounded-lg text-accent/20 hover:text-destructive transition-all"
                          >
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
      </main>
    </div>
  );
}
