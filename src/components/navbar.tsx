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
  LogOut,
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
  RefreshCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export function Navbar() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = () => {
    signOut(auth);
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
        { href: "/protect", icon: Lock, title: "Protect", desc: "Add password lock" },
        { href: "/protect?mode=unlock", icon: Unlock, title: "Unlock", desc: "Remove restrictions" },
        { href: "/watermark", icon: Type, title: "Watermark", desc: "Add text overlays" },
        { href: "/sign", icon: Signature, title: "Digital Sign", desc: "Apply signatures" },
      ]
    }
  ];

  return (
    <nav className="glass-nav">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-10">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-2 group mr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary shadow-lg transition-transform group-hover:scale-105 group-hover:-rotate-3">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-lg font-black tracking-tighter text-accent uppercase italic">
              DocuFlow
            </span>
          </Link>

          {/* Core Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Mega Menu Trigger - Now First after Brand */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent hover:text-primary transition-all outline-none">
                <LayoutDashboard className="h-3 w-3 text-primary" />
                All PDF Tools <ChevronDown className="h-3 w-3 opacity-40" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[800px] p-6 rounded-3xl shadow-2xl border-white/20 grid grid-cols-3 gap-6 bg-white/95 backdrop-blur-xl mt-2">
                {categories.map((cat) => (
                  <div key={cat.label} className="space-y-3">
                    <DropdownMenuLabel className="px-0 text-[9px] font-black uppercase tracking-[0.2em] text-primary/40">
                      {cat.label}
                    </DropdownMenuLabel>
                    <div className="space-y-1">
                      {cat.items.map((item) => (
                        <DropdownMenuItem key={item.href} asChild className="p-2 rounded-xl cursor-pointer hover:bg-primary/5 transition-all">
                          <Link href={item.href} className="flex items-center gap-3">
                            <div className="h-7 w-7 text-primary flex items-center justify-center bg-primary/5 rounded-lg">
                              <item.icon className="h-4 w-4" />
                            </div> 
                            <div className="flex flex-col">
                              <span className="font-bold text-[10px] uppercase tracking-wider text-accent">{item.title}</span>
                              <span className="text-[8px] text-muted-foreground font-medium">{item.desc}</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/merge" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <Merge className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" />
              Merge
            </Link>
            <Link href="/split" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <Scissors className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" />
              Split
            </Link>
            <Link href="/compress" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <Maximize className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" />
              Compress
            </Link>
            <Link href="/convert?type=word-to-pdf" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <RefreshCcw className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" />
              Convert
            </Link>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-8 mr-2">
            <Link href="/pricing" className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all">
              <Zap className="h-3 w-3 text-primary" />
              Pricing
            </Link>
          </div>

          {!isUserLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 px-3 rounded-xl hover:bg-accent/5 flex items-center gap-2 transition-all">
                  <div className="flex flex-col items-end mr-1 hidden sm:flex">
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary leading-none">Admin</span>
                    <span className="text-[8px] font-bold text-accent/40 leading-tight">Pro</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center text-[10px] font-black italic shadow-md">
                    {user.email?.[0].toUpperCase() || 'A'}
                  </div>
                  <ChevronDown className="h-2.5 w-2.5 opacity-40 text-accent" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl bg-white border-accent/10 mt-1">
                <DropdownMenuLabel className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-primary/60">Workspace</DropdownMenuLabel>
                <DropdownMenuItem className="p-2.5 rounded-lg cursor-pointer font-bold text-[10px] text-accent hover:bg-accent/5 transition-colors">Overview</DropdownMenuItem>
                <DropdownMenuItem className="p-2.5 rounded-lg cursor-pointer font-bold text-[10px] text-accent hover:bg-accent/5 transition-colors">Billing</DropdownMenuItem>
                <DropdownMenuItem className="p-2.5 rounded-lg cursor-pointer font-bold text-[10px] text-accent hover:bg-accent/5 transition-colors">Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="my-1.5 bg-accent/5" />
                <DropdownMenuItem onClick={handleLogout} className="p-2.5 rounded-lg cursor-pointer text-destructive font-bold text-[10px] hover:bg-destructive/5 transition-colors">
                  <LogOut className="h-3.5 w-3.5 mr-2.5" /> Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-[10px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all">Sign In</Link>
              <Button asChild className="h-10 px-6 rounded-xl bg-accent text-white font-black uppercase tracking-widest text-[9px] shadow-xl hover:scale-105 transition-all">
                <Link href="/login">Start Free</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile Navigation Trigger */}
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-accent hover:bg-accent/5 rounded-xl">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
