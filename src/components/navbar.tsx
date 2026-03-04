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
  Zap,
  Maximize,
  LayoutGrid,
  FilePenLine,
  Table,
  Cpu
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

  const manipulationTools = [
    { href: "/merge", icon: Merge, title: "Merge PDF", desc: "Combine documents" },
    { href: "/split", icon: Scissors, title: "Split PDF", desc: "Extract pages" },
    { href: "/organize", icon: RotateCw, title: "Organize", desc: "Reorder & rotate" },
    { href: "/compress", icon: Maximize, title: "Compress", desc: "Optimize size" },
  ];

  const analysisTools = [
    { href: "/analyze", icon: Cpu, title: "AI Analysis", desc: "Summarize with AI" },
    { href: "/protect", icon: Lock, title: "Security", desc: "Lock & sanitize" },
    { href: "/convert", icon: Table, title: "Excel Export", desc: "Data extraction" },
  ];

  return (
    <nav className="glass-nav">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary shadow-lg transition-transform group-hover:scale-105">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-xl font-black tracking-tighter text-accent uppercase italic">
              DocuFlow
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent/70 hover:text-accent transition-colors outline-none">
                Manipulation <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px] p-4 rounded-2xl shadow-2xl border-white/20">
                {manipulationTools.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-3 rounded-xl cursor-pointer hover:bg-muted/20">
                    <Link href={item.href} className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-secondary text-primary rounded-lg flex items-center justify-center">
                        <item.icon className="h-4 w-4" />
                      </div> 
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-accent">{item.title}</span>
                        <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent/70 hover:text-accent transition-colors outline-none">
                Analysis <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px] p-4 rounded-2xl shadow-2xl border-white/20">
                {analysisTools.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-3 rounded-xl cursor-pointer hover:bg-muted/20">
                    <Link href={item.href} className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-secondary text-primary rounded-lg flex items-center justify-center">
                        <item.icon className="h-4 w-4" />
                      </div> 
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-accent">{item.title}</span>
                        <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/pricing" className="text-[10px] font-black uppercase tracking-widest text-accent/70 hover:text-accent transition-colors">Pricing</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isUserLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 px-4 rounded-xl hover:bg-white/10 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="h-3 w-3 opacity-50 text-accent" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl bg-card">
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary/60">Professional Workspace</DropdownMenuLabel>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer font-bold text-xs text-accent hover:bg-muted/20">User Profile</DropdownMenuItem>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer font-bold text-xs text-accent hover:bg-muted/20">Team Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="p-3 rounded-xl cursor-pointer text-destructive font-bold text-xs">
                  <LogOut className="h-4 w-4 mr-2" /> End Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-[10px] font-black uppercase tracking-widest text-accent/70 hover:text-accent transition-colors">Sign In</Link>
              <Button asChild size="sm" className="h-10 px-6 rounded-xl bg-accent text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          )}
          
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-accent">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
