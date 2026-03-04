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
  Type,
  Signature,
  User,
  LogOut,
  Zap,
  Globe,
  ShieldCheck,
  Eraser
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
    <nav className="sticky top-0 z-50 w-full border-b bg-[#91C5C1]/90 backdrop-blur-xl transition-all shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2A1E5C] text-white shadow-2xl shadow-accent/30 transition-transform group-hover:scale-110">
              <FileText className="h-7 w-7 text-[#DE496C]" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#2A1E5C] font-headline hidden sm:block italic uppercase">
              DocuFlow <span className="text-white not-italic">Pro</span>
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-widest text-[#2A1E5C] hover:text-[#2A1E5C]/80 transition-colors outline-none">
              Capabilities <ChevronDown className="h-3 w-3 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[700px] p-8 grid grid-cols-2 gap-8 rounded-3xl shadow-2xl border-slate-100 bg-white">
              <div className="space-y-5">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.2em] text-[#2A1E5C] font-black border-b pb-2">Manipulation & Logic</DropdownMenuLabel>
                <div className="grid gap-2">
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-[#2A1E5C]/5 transition-colors">
                    <Link href="/merge" className="flex items-center gap-3">
                      <div className="p-2 text-[#DE496C]"><Merge className="h-6 w-6" /></div> 
                      <div className="flex flex-col"><span className="font-bold text-[#2A1E5C]">Merge PDF</span><span className="text-[10px] text-[#0A0F0D]/60">Combine volumes</span></div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-[#2A1E5C]/5 transition-colors">
                    <Link href="/split" className="flex items-center gap-3">
                      <div className="p-2 text-[#DE496C]"><Scissors className="h-6 w-6" /></div> 
                      <div className="flex flex-col"><span className="font-bold text-[#2A1E5C]">Split PDF</span><span className="text-[10px] text-[#0A0F0D]/60">Extract pages</span></div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-[#2A1E5C]/5 transition-colors">
                    <Link href="/organize" className="flex items-center gap-3">
                      <div className="p-2 text-[#DE496C]"><RotateCw className="h-6 w-6" /></div> 
                      <div className="flex flex-col"><span className="font-bold text-[#2A1E5C]">Organize Pages</span><span className="text-[10px] text-[#0A0F0D]/60">Reorder & rotate</span></div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-[#2A1E5C]/5 transition-colors">
                    <Link href="/watermark" className="flex items-center gap-3">
                      <div className="p-2 text-[#DE496C]"><Type className="h-6 w-6" /></div> 
                      <div className="flex flex-col"><span className="font-bold text-[#2A1E5C]">Watermark</span><span className="text-[10px] text-[#0A0F0D]/60">Branding & security</span></div>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </div>
              <div className="space-y-5 border-l border-slate-100 pl-8">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.2em] text-[#2A1E5C] font-black border-b pb-2">Analysis & Compliance</DropdownMenuLabel>
                <div className="grid gap-2">
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-[#2A1E5C]/5 transition-colors">
                    <Link href="/analyze" className="flex items-center gap-3">
                      <div className="p-2 text-[#DE496C]"><Search className="h-6 w-6" /></div> 
                      <div className="flex flex-col"><span className="font-bold text-[#2A1E5C]">Inspector</span><span className="text-[10px] text-[#0A0F0D]/60">Metadata analysis</span></div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-[#2A1E5C]/5 transition-colors">
                    <Link href="/sanitize" className="flex items-center gap-3">
                      <div className="p-2 text-[#DE496C]"><Eraser className="h-6 w-6" /></div> 
                      <div className="flex flex-col"><span className="font-bold text-[#2A1E5C]">Sanitize</span><span className="text-[10px] text-[#0A0F0D]/60">Strip tracking info</span></div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-[#2A1E5C]/5 transition-colors">
                    <Link href="/protect" className="flex items-center gap-3">
                      <div className="p-2 text-[#DE496C]"><Lock className="h-6 w-6" /></div> 
                      <div className="flex flex-col"><span className="font-bold text-[#2A1E5C]">Encrypt</span><span className="text-[10px] text-[#0A0F0D]/60">AES-256 protection</span></div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer hover:bg-[#2A1E5C]/5 transition-colors">
                    <Link href="/sign" className="flex items-center gap-3">
                      <div className="p-2 text-[#DE496C]"><Signature className="h-6 w-6" /></div> 
                      <div className="flex flex-col"><span className="font-bold text-[#2A1E5C]">Digital Sign</span><span className="text-[10px] text-[#0A0F0D]/60">E-signature flow</span></div>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/pricing" className="text-[13px] font-bold uppercase tracking-widest text-[#2A1E5C] hover:text-[#2A1E5C]/70 transition-colors">Pricing</Link>
          <Link href="/enterprise" className="text-[13px] font-bold uppercase tracking-widest text-[#2A1E5C] hover:text-[#2A1E5C]/70 transition-colors">Enterprise</Link>
          <Link href="/security" className="text-[13px] font-bold uppercase tracking-widest text-[#2A1E5C] hover:text-[#2A1E5C]/70 transition-colors">Trust Hub</Link>
        </div>

        <div className="flex items-center gap-5">
          {!isUserLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-11 px-5 rounded-xl bg-[#2A1E5C]/10 hover:bg-[#2A1E5C]/20 flex items-center gap-3 border border-transparent">
                  <div className="w-6 h-6 rounded-full bg-[#2A1E5C] text-white flex items-center justify-center text-[10px] font-bold">
                    {user.email?.[0].toUpperCase() || 'G'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate font-bold text-xs text-[#2A1E5C]">{user.isAnonymous ? "Guest Session" : user.email}</span>
                  <ChevronDown className="h-3 w-3 opacity-50 text-[#2A1E5C]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-slate-100 bg-white">
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#DE496C]">Account Control</DropdownMenuLabel>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3 font-medium"><User className="h-4 w-4" /> Account Settings</DropdownMenuItem>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3 font-medium"><Zap className="h-4 w-4" /> Usage Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="p-3 rounded-xl cursor-pointer gap-3 text-destructive focus:bg-destructive/5 focus:text-destructive font-medium">
                  <LogOut className="h-4 w-4" />
                  Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-6 mr-2">
                 <Link href="/login" className="text-[13px] font-bold uppercase tracking-widest text-[#2A1E5C] hover:text-[#2A1E5C]/80">Sign In</Link>
              </div>
              <Button asChild size="lg" className="h-12 px-8 rounded-xl bg-[#2A1E5C] text-white shadow-xl shadow-accent/20 hover:shadow-accent/30 transition-all">
                <Link href="/login">Get Started</Link>
              </Button>
            </>
          )}
          
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-white/20 bg-white/10">
                  <Menu className="h-6 w-6 text-[#2A1E5C]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-4 rounded-2xl shadow-2xl border-slate-100 space-y-4 bg-white">
                <div className="space-y-1">
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-[#DE496C] font-black">Navigation</DropdownMenuLabel>
                  <DropdownMenuItem asChild className="p-3 rounded-xl"><Link href="/pricing" className="flex items-center gap-3 font-bold text-[#2A1E5C]"><Zap className="h-4 w-4" /> Pricing</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl"><Link href="/enterprise" className="flex items-center gap-3 font-bold text-[#2A1E5C]"><Globe className="h-4 w-4" /> Enterprise</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl"><Link href="/security" className="flex items-center gap-3 font-bold text-[#2A1E5C]"><ShieldCheck className="h-4 w-4" /> Security</Link></DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                {!user && <DropdownMenuItem asChild className="p-3 rounded-xl bg-[#2A1E5C] text-white hover:bg-[#2A1E5C]/90 hover:text-white"><Link href="/login" className="flex items-center justify-center font-bold">Log In</Link></DropdownMenuItem>}
                {user && <DropdownMenuItem onClick={handleLogout} className="p-3 rounded-xl bg-destructive/10 text-destructive font-bold justify-center">Sign Out</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
