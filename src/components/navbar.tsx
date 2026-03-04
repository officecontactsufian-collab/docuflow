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
  Globe,
  ShieldCheck,
  Maximize,
  LayoutGrid,
  FilePenLine,
  Table
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

  const navTools = [
    { href: "/merge", icon: Merge, title: "Merge PDF", desc: "Combine multiple files" },
    { href: "/split", icon: Scissors, title: "Split PDF", desc: "Extract specific pages" },
    { href: "/compress", icon: Maximize, title: "Compress PDF", desc: "Reduce size instantly" },
    { href: "/convert?type=pdf-to-word", icon: FileText, title: "PDF to Word", desc: "Edit PDFs in Word" },
    { href: "/organize", icon: RotateCw, title: "Edit PDF", desc: "Manage page structure" },
    { href: "/protect", icon: Lock, title: "Protect PDF", desc: "Add AES-256 security" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-nav transition-all">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-lg transition-transform group-hover:scale-105">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-black tracking-tight text-accent font-headline italic uppercase">
              DocuFlow
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-accent hover:text-primary transition-colors outline-none">
                All Tools <ChevronDown className="h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[640px] p-6 grid grid-cols-2 gap-4 rounded-3xl shadow-2xl border-white/20 bg-card">
                {navTools.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="p-3 rounded-2xl cursor-pointer hover:bg-muted/30 transition-all border border-transparent hover:border-muted-foreground/10">
                    <Link href={item.href} className="flex items-center gap-4">
                      <div className="h-10 w-10 shrink-0 bg-secondary text-primary rounded-xl flex items-center justify-center shadow-sm">
                        <item.icon className="h-5 w-5" />
                      </div> 
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-accent">{item.title}</span>
                        <span className="text-[10px] font-medium text-foreground/50 leading-none mt-1">{item.desc}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <div className="col-span-2 pt-2">
                  <DropdownMenuSeparator className="mb-4" />
                  <Link href="/convert" className="flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                    View all document solutions <Zap className="h-3 w-3" />
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/pricing" className="text-xs font-black uppercase tracking-widest text-accent hover:text-primary transition-colors">Pricing</Link>
            <Link href="/enterprise" className="text-xs font-black uppercase tracking-widest text-accent hover:text-primary transition-colors">Enterprise</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isUserLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 px-4 rounded-xl bg-accent/5 hover:bg-accent/10 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate font-bold text-xs text-accent uppercase tracking-tighter">Account</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-white/20 bg-card">
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary/60">Manage Account</DropdownMenuLabel>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3 font-bold text-xs text-accent hover:bg-muted/20">Dashboard</DropdownMenuItem>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3 font-bold text-xs text-accent hover:bg-muted/20">Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="p-3 rounded-xl cursor-pointer gap-3 text-destructive font-bold text-xs">
                  <LogOut className="h-4 w-4" /> Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-xs font-black uppercase tracking-widest text-accent hover:text-primary transition-colors">Sign In</Link>
              <Button asChild size="sm" className="h-10 px-6 rounded-xl bg-accent text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          )}
          
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-accent/5">
              <Menu className="h-5 w-5 text-accent" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
