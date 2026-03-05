
"use client"

import Link from 'next/link';
import { 
  FileText, 
  ChevronDown, 
  Merge, 
  Scissors, 
  Lock,
  Menu,
  RotateCw,
  Maximize,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Wrench,
  Unlock,
  Type,
  Signature,
  Hash,
  Crop,
  FilePenLine,
  Search,
  Activity,
  LogOut,
  User as UserIcon,
  Settings,
  Layout
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
      label: "Organize & Format",
      items: [
        { href: "/merge", icon: Merge, title: "Merge PDF", desc: "Combine multiple PDFs" },
        { href: "/split", icon: Scissors, title: "Split PDF", desc: "Extract specific pages" },
        { href: "/organize", icon: RotateCw, title: "Organize", desc: "Reorder and rotate" },
        { href: "/crop", icon: Crop, title: "Crop PDF", desc: "Trim page margins" },
        { href: "/numbers", icon: Hash, title: "Page Numbers", desc: "Add sequential counters" },
      ]
    },
    {
      label: "Convert & Export",
      items: [
        { href: "/convert?type=word-to-pdf", icon: FilePenLine, title: "To PDF", desc: "Word, Excel, JPG, PPT" },
        { href: "/convert?type=pdf-to-word", icon: FileText, title: "From PDF", desc: "Word, Excel, JPG, PDF/A" },
        { href: "/convert?type=pdf-to-pdfa", icon: ShieldCheck, title: "PDF/A", desc: "Archival conversion" },
      ]
    },
    {
      label: "Optimize & Secure",
      items: [
        { href: "/compress", icon: Maximize, title: "Compress PDF", desc: "Reduce file size" },
        { href: "/repair", icon: Wrench, title: "Repair", desc: "Fix corrupted PDFs" },
        { href: "/protect", icon: ShieldCheck, title: "Privacy Shield", desc: "Hardened metadata" },
        { href: "/protect?mode=unlock", icon: Unlock, title: "Unlock", desc: "Remove restrictions" },
        { href: "/watermark", icon: Type, title: "Watermark", desc: "Add text overlays" },
        { href: "/sign", icon: Signature, title: "Digital Sign", desc: "Apply signatures" },
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
            <span className="text-base font-black tracking-tighter text-accent uppercase italic">DocuFlow</span>
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent hover:text-primary transition-all outline-none">
                <LayoutDashboard className="h-3 w-3 text-primary" />
                All PDF Tools <ChevronDown className="h-2.5 w-2.5 opacity-40" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[700px] p-5 rounded-2xl shadow-2xl border-white/20 grid grid-cols-3 gap-5 bg-white/95 backdrop-blur-xl mt-2">
                {categories.map((cat) => (
                  <div key={cat.label} className="space-y-3">
                    <DropdownMenuLabel className="px-0 text-[8px] font-black uppercase tracking-[0.2em] text-primary/40">
                      {cat.label}
                    </DropdownMenuLabel>
                    <div className="space-y-1">
                      {cat.items.map((item) => (
                        <DropdownMenuItem key={item.href} asChild className="p-2 rounded-lg cursor-pointer hover:bg-primary/5 transition-all">
                          <Link href={item.href} className="flex items-center gap-3">
                            <div className="h-6 w-6 text-primary flex items-center justify-center bg-primary/5 rounded-md">
                              <item.icon className="h-3.5 w-3.5" />
                            </div> 
                            <div className="flex flex-col">
                              <span className="font-bold text-[9px] uppercase tracking-wider text-accent">{item.title}</span>
                              <span className="text-[7px] text-muted-foreground font-medium">{item.desc}</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/merge" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <Merge className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> Merge
            </Link>
            <Link href="/split" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <Scissors className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> Split
            </Link>
            <Link href="/compress" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <Maximize className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> Compress
            </Link>
            <Link href="/convert?type=word-to-pdf" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <FilePenLine className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> Convert
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-6 mr-2">
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
