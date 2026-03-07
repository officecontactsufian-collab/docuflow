"use client"

import Link from 'next/link';
import { 
  FileText, 
  ChevronDown, 
  Merge, 
  RotateCw, 
  LayoutDashboard, 
  ShieldCheck, 
  Unlock, 
  Signature, 
  Hash, 
  Crop, 
  FilePenLine, 
  Search, 
  Activity, 
  LogOut, 
  Layout, 
  Camera,
  Menu,
  BrainCircuit,
  Lock,
  CheckCircle2,
  BookOpen,
  Briefcase,
  Mail,
  Languages,
  MessageSquare,
  RefreshCcw,
  FileBadge,
  ArrowRightLeft,
  Image as ImageIcon,
  Table,
  Presentation,
  Eraser,
  Wrench,
  FileUp,
  Scissors
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import * as React from 'react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const categories = [
    {
      label: "AI Writing Suite",
      items: [
        { href: "/ai-studio", icon: RefreshCcw, title: "Paraphraser", desc: "Re-engineer text" },
        { href: "/ai-studio", icon: Activity, title: "Summarizer", desc: "Executive summary" },
        { href: "/ai-studio", icon: CheckCircle2, title: "Grammar Check", desc: "Industrial proofing" },
        { href: "/ai-studio", icon: BookOpen, title: "Essay Writer", desc: "Structured drafts" },
      ]
    },
    {
      label: "AI Career Suite",
      items: [
        { href: "/ai-studio", icon: Briefcase, title: "Resume Builder", desc: "Profile engineering" },
        { href: "/ai-studio", icon: FileBadge, title: "Cover Letter", desc: "Intro architect" },
        { href: "/ai-studio", icon: Mail, title: "Email Architect", desc: "Corporate drafts" },
        { href: "/sign", icon: Signature, title: "Digital Sign", desc: "Apply signatures" },
      ]
    },
    {
      label: "AI Productivity",
      items: [
        { href: "/ai-studio", icon: Languages, title: "Translator", desc: "Linguistic shift" },
        { href: "/ai-studio", icon: MessageSquare, title: "Doc Intel", desc: "Asset chat" },
        { href: "/scan-to-pdf", icon: Camera, title: "Scan to PDF", desc: "Direct capture" },
        { href: "/analyze", icon: Search, title: "Deep Inspect", desc: "Metadata analysis" },
      ]
    },
    {
      label: "Layout & Capture",
      items: [
        { href: "/crop", icon: Crop, title: "Precision Crop", desc: "Trim page margins" },
        { href: "/organize", icon: RotateCw, title: "Visual Organizer", desc: "Reorder & Rotate" },
        { href: "/numbers", icon: Hash, title: "Add Numbers", desc: "Sequential counters" },
        { href: "/merge", icon: Merge, title: "Merge PDF", desc: "Combine assets" },
      ]
    },
    {
      label: "Convert & Export",
      items: [
        { href: "/convert", icon: ArrowRightLeft, title: "Convert Hub", desc: "Format inversion" },
        { href: "/convert?type=pdf-to-word", icon: FileText, title: "PDF to Word", desc: "Recover text" },
        { href: "/convert?type=word-to-pdf", icon: FilePenLine, title: "Word to PDF", desc: "Standardize DOCX" },
        { href: "/convert?type=pdf-to-excel", icon: Table, title: "PDF to Excel", desc: "Table recovery" },
      ]
    },
    {
      label: "Security & Shield",
      items: [
        { href: "/secure", icon: Lock, title: "Protect PDF", desc: "Secure encryption" },
        { href: "/protect", icon: ShieldCheck, title: "Privacy Shield", desc: "Metadata purge" },
        { href: "/protect?mode=unlock", icon: Unlock, title: "Unlock PDF", desc: "Strip restrictions" },
        { href: "/sanitize", icon: Eraser, title: "Deep cleaning" },
      ]
    }
  ];

  return (
    <nav className="glass-nav border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-12 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group mr-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-primary shadow-lg transition-transform group-hover:scale-105 group-hover:-rotate-3">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-base font-black tracking-tighter text-accent uppercase italic">DOCFLOW</span>
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent hover:text-primary transition-all outline-none">
                <LayoutDashboard className="h-3 w-3 text-primary" />
                All Protocols <ChevronDown className="h-2.5 w-2.5 opacity-40" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[1000px] p-6 rounded-2xl shadow-2xl border-white/20 grid grid-cols-3 gap-8 bg-white/95 backdrop-blur-xl mt-2">
                {categories.map((cat) => (
                  <div key={cat.label} className="space-y-4">
                    <DropdownMenuLabel className="px-0 text-[9px] font-black uppercase tracking-[0.3em] text-primary/40">
                      {cat.label}
                    </DropdownMenuLabel>
                    <div className="grid gap-1">
                      {cat.items.map((item) => (
                        <DropdownMenuItem key={item.title} asChild className="p-2 rounded-xl cursor-pointer hover:bg-primary/5 transition-all">
                          <Link href={item.href} className="flex items-center gap-3">
                            <div className="h-8 w-8 text-primary flex items-center justify-center bg-primary/5 rounded-lg shrink-0">
                              <item.icon className="h-4 w-4" />
                            </div> 
                            <div className="flex flex-col min-w-0">
                              <span className="font-black text-[10px] uppercase tracking-wider text-accent truncate">{item.title}</span>
                              <span className="text-[8px] text-muted-foreground font-bold uppercase truncate">{item.desc}</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/ai-studio" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all group">
              <BrainCircuit className="h-3 w-3" /> AI Studio
            </Link>
            <Link href="/convert" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <ArrowRightLeft className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> Convert
            </Link>
            <Link href="/merge" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <Merge className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> Merge
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-6 mr-2">
            <Link href="/pricing" className="text-[9px] font-black uppercase tracking-widest text-accent/60 hover:text-primary transition-all">Pricing</Link>
            <Link href="/analyze" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all">
              <Search className="h-3 w-3 text-primary" /> Inspect
            </Link>
          </div>
          
          {user?.email === 'office.contact.sufian@gmail.com' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2 bg-accent text-white hover:bg-accent/90">
                  <Layout className="h-3 w-3" /> Admin Suite
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl bg-white shadow-2xl border-accent/5">
                <DropdownMenuLabel className="text-[8px] font-black uppercase tracking-widest text-accent/40">{user?.email}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/admin-dashboard" className="cursor-pointer text-[10px] font-bold uppercase">
                    <Activity className="h-3 w-3 mr-2" /> Command Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer text-[10px] font-bold uppercase">
                  <LogOut className="h-3 w-3 mr-2" /> End Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-accent hover:bg-accent/5 rounded-lg">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
