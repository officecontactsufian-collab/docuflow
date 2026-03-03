"use client"

import Link from 'next/link';
import { 
  FileText, 
  ChevronDown, 
  Merge, 
  Scissors, 
  Search, 
  Lock,
  Menu,
  RotateCw,
  Unlock,
  Type,
  Hash,
  Eraser,
  Signature,
  Wrench,
  User,
  LogOut,
  Zap,
  Globe,
  ShieldCheck
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 transition-transform group-hover:scale-110">
              <FileText className="h-7 w-7" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 font-headline hidden sm:block italic uppercase">
              DocuFlow <span className="text-primary not-italic">Pro</span>
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors outline-none">
              Capabilities <ChevronDown className="h-3 w-3 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[700px] p-8 grid grid-cols-2 gap-8 rounded-3xl shadow-2xl border-slate-100">
              <div className="space-y-5">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">Manipulation & Logic</DropdownMenuLabel>
                <div className="grid gap-2">
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-slate-50">
                    <Link href="/merge" className="flex items-center gap-3"><Merge className="h-5 w-5 text-primary" /> <div className="flex flex-col"><span className="font-bold">Merge PDF</span><span className="text-[10px] text-slate-400">Combine volumes</span></div></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-slate-50">
                    <Link href="/split" className="flex items-center gap-3"><Scissors className="h-5 w-5 text-primary" /> <div className="flex flex-col"><span className="font-bold">Split PDF</span><span className="text-[10px] text-slate-400">Extract pages</span></div></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-slate-50">
                    <Link href="/organize" className="flex items-center gap-3"><RotateCw className="h-5 w-5 text-primary" /> <div className="flex flex-col"><span className="font-bold">Organize Pages</span><span className="text-[10px] text-slate-400">Reorder & rotate</span></div></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-slate-50">
                    <Link href="/watermark" className="flex items-center gap-3"><Type className="h-5 w-5 text-primary" /> <div className="flex flex-col"><span className="font-bold">Watermark</span><span className="text-[10px] text-slate-400">Branding & security</span></div></Link>
                  </DropdownMenuItem>
                </div>
              </div>
              <div className="space-y-5 border-l border-slate-100 pl-8">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">Analysis & Compliance</DropdownMenuLabel>
                <div className="grid gap-2">
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-slate-50">
                    <Link href="/analyze" className="flex items-center gap-3"><Search className="h-5 w-5 text-accent" /> <div className="flex flex-col"><span className="font-bold">Inspector</span><span className="text-[10px] text-slate-400">Metadata analysis</span></div></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-slate-50">
                    <Link href="/sanitize" className="flex items-center gap-3"><Eraser className="h-5 w-5 text-accent" /> <div className="flex flex-col"><span className="font-bold">Sanitize</span><span className="text-[10px] text-slate-400">Strip tracking info</span></div></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-slate-50">
                    <Link href="/protect" className="flex items-center gap-3"><Lock className="h-5 w-5 text-accent" /> <div className="flex flex-col"><span className="font-bold">Encrypt</span><span className="text-[10px] text-slate-400">AES-256 protection</span></div></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-slate-50">
                    <Link href="/sign" className="flex items-center gap-3"><Signature className="h-5 w-5 text-accent" /> <div className="flex flex-col"><span className="font-bold">Digital Sign</span><span className="text-[10px] text-slate-400">E-signature flow</span></div></Link>
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/pricing" className="text-[13px] font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors">Pricing</Link>
          <Link href="/enterprise" className="text-[13px] font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors">Enterprise</Link>
          <Link href="/security" className="text-[13px] font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors">Trust Hub</Link>
        </div>

        <div className="flex items-center gap-5">
          {!isUserLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-11 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-3 border border-slate-200/50">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                    {user.email?.[0].toUpperCase() || 'G'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate font-bold text-xs">{user.isAnonymous ? "Guest Session" : user.email}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-slate-100">
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Account Control</DropdownMenuLabel>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3"><User className="h-4 w-4" /> Account Settings</DropdownMenuItem>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3"><Zap className="h-4 w-4" /> Usage Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="p-3 rounded-xl cursor-pointer gap-3 text-destructive focus:bg-destructive/5 focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-6 mr-2">
                 <Link href="/login" className="text-[13px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">Sign In</Link>
              </div>
              <Button asChild size="lg" className="h-12 px-8 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
                <Link href="/login">Get Started</Link>
              </Button>
            </>
          )}
          
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-4 rounded-2xl shadow-2xl border-slate-100 space-y-4">
                <div className="space-y-1">
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Navigation</DropdownMenuLabel>
                  <DropdownMenuItem asChild className="p-3 rounded-xl"><Link href="/pricing" className="flex items-center gap-3 font-bold"><Zap className="h-4 w-4" /> Pricing</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl"><Link href="/enterprise" className="flex items-center gap-3 font-bold"><Globe className="h-4 w-4" /> Enterprise</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl"><Link href="/security" className="flex items-center gap-3 font-bold"><ShieldCheck className="h-4 w-4" /> Security</Link></DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                {!user && <DropdownMenuItem asChild className="p-3 rounded-xl bg-primary text-white hover:bg-primary/90 hover:text-white"><Link href="/login" className="flex items-center justify-center font-bold">Log In</Link></DropdownMenuItem>}
                {user && <DropdownMenuItem onClick={handleLogout} className="p-3 rounded-xl bg-destructive/10 text-destructive font-bold justify-center">Sign Out</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}