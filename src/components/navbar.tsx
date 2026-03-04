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
  Table,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Image as ImageIcon,
  Presentation,
  FileCode,
  Wrench,
  Unlock,
  Type,
  Signature,
  Edit3,
  Hash,
  Crop
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
      label: "Organize & Edit",
      items: [
        { href: "/merge", icon: Merge, title: "Merge", desc: "Combine multiple PDFs" },
        { href: "/split", icon: Scissors, title: "Split", desc: "Extract or divide pages" },
        { href: "/organize", icon: RotateCw, title: "Organize", desc: "Reorder and rotate" },
        { href: "/edit", icon: Edit3, title: "Edit", desc: "Add text and shapes" },
        { href: "/crop", icon: Crop, title: "Crop", desc: "Trim page margins" },
        { href: "/numbers", icon: Hash, title: "Page Numbers", desc: "Add sequential counters" },
      ]
    },
    {
      label: "Convert & Export",
      items: [
        { href: "/convert?type=word-to-pdf", icon: FileText, title: "To PDF", desc: "Word, Excel, JPG, HTML" },
        { href: "/convert?type=pdf-to-word", icon: FileText, title: "From PDF", desc: "Word, Excel, PPT, JPG" },
        { href: "/convert?type=pdf-to-pdfa", icon: ShieldCheck, title: "PDF/A", desc: "Archival conversion" },
      ]
    },
    {
      label: "Optimize & Secure",
      items: [
        { href: "/compress", icon: Maximize, title: "Compress", desc: "Reduce file size" },
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
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary shadow-xl transition-transform group-hover:scale-105 group-hover:-rotate-3">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-accent uppercase italic">
              DocuFlow
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all outline-none">
                <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                Capabilities <ChevronDown className="h-3 w-3 opacity-40" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[850px] p-8 rounded-[2rem] shadow-2xl border-white/20 grid grid-cols-3 gap-8">
                {categories.map((cat) => (
                  <div key={cat.label} className="space-y-4">
                    <DropdownMenuLabel className="px-0 text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                      {cat.label}
                    </DropdownMenuLabel>
                    <div className="space-y-2">
                      {cat.items.map((item) => (
                        <DropdownMenuItem key={item.href} asChild className="p-3 rounded-2xl cursor-pointer hover:bg-primary/5">
                          <Link href={item.href} className="flex items-center gap-4">
                            <div className="h-8 w-8 text-primary flex items-center justify-center">
                              <item.icon className="h-5 w-5" />
                            </div> 
                            <div className="flex flex-col">
                              <span className="font-bold text-xs text-accent">{item.title}</span>
                              <span className="text-[9px] text-muted-foreground">{item.desc}</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/pricing" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Pricing
            </Link>
            <Link href="/security" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all">
              <Lock className="h-3.5 w-3.5 text-primary" />
              Security
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {!isUserLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 px-5 rounded-2xl hover:bg-white/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center text-[11px] font-bold">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="h-3 w-3 opacity-40 text-accent" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-3 rounded-[1.5rem] shadow-2xl bg-card">
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary/60">Professional Profile</DropdownMenuLabel>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer font-bold text-xs text-accent">Workspace Overview</DropdownMenuItem>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer font-bold text-xs text-accent">Account Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="p-3 rounded-xl cursor-pointer text-destructive font-bold text-xs">
                  <LogOut className="h-4 w-4 mr-3" /> Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-5">
              <Link href="/login" className="hidden md:block text-[11px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all">Sign In</Link>
              <Button asChild className="h-12 px-8 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all">
                <Link href="/login">Start Free</Link>
              </Button>
            </div>
          )}
          
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-11 w-11 text-accent">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
