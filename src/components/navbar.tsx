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
    <nav className="sticky top-0 z-50 w-full border-b bg-muted/90 backdrop-blur-xl transition-all shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-2xl shadow-accent/30 transition-transform group-hover:scale-110">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-accent font-headline hidden sm:block italic uppercase">
              DocuFlow <span className="text-white not-italic">Pro</span>
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors outline-none">
              Capabilities <ChevronDown className="h-3 w-3 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[700px] p-8 grid grid-cols-2 gap-8 rounded-[2rem] shadow-2xl border-border/40 bg-card">
              <div className="space-y-5">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.2em] text-accent font-black border-b border-border/50 pb-2">Manipulation & Logic</DropdownMenuLabel>
                <div className="grid gap-2">
                  {[
                    { href: "/merge", icon: Merge, title: "Merge PDF", desc: "Combine volumes" },
                    { href: "/split", icon: Scissors, title: "Split PDF", desc: "Extract pages" },
                    { href: "/organize", icon: RotateCw, title: "Organize Pages", desc: "Reorder & rotate" },
                    { href: "/watermark", icon: Type, title: "Watermark", desc: "Branding & security" },
                  ].map((item) => (
                    <DropdownMenuItem key={item.href} asChild className="p-3 rounded-xl cursor-pointer hover:bg-accent/5 transition-colors">
                      <Link href={item.href} className="flex items-center gap-3">
                        <div className="p-2 bg-secondary text-primary rounded-lg shadow-sm"><item.icon className="h-6 w-6" /></div> 
                        <div className="flex flex-col"><span className="font-bold text-accent">{item.title}</span><span className="text-[10px] text-foreground/60">{item.desc}</span></div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
              <div className="space-y-5 border-l border-border/50 pl-8">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.2em] text-accent font-black border-b border-border/50 pb-2">Analysis & Compliance</DropdownMenuLabel>
                <div className="grid gap-2">
                  {[
                    { href: "/analyze", icon: Search, title: "Inspector", desc: "Metadata analysis" },
                    { href: "/sanitize", icon: Eraser, title: "Sanitize", desc: "Strip tracking info" },
                    { href: "/protect", icon: Lock, title: "Encrypt", desc: "AES-256 protection" },
                    { href: "/sign", icon: Signature, title: "Digital Sign", desc: "E-signature flow" },
                  ].map((item) => (
                    <DropdownMenuItem key={item.href} asChild className="p-3 rounded-xl cursor-pointer hover:bg-accent/5 transition-colors">
                      <Link href={item.href} className="flex items-center gap-3">
                        <div className="p-2 bg-secondary text-primary rounded-lg shadow-sm"><item.icon className="h-6 w-6" /></div> 
                        <div className="flex flex-col"><span className="font-bold text-accent">{item.title}</span><span className="text-[10px] text-foreground/60">{item.desc}</span></div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/pricing" className="text-[13px] font-bold uppercase tracking-widest text-accent hover:text-accent/70 transition-colors">Pricing</Link>
          <Link href="/enterprise" className="text-[13px] font-bold uppercase tracking-widest text-accent hover:text-accent/70 transition-colors">Enterprise</Link>
          <Link href="/security" className="text-[13px] font-bold uppercase tracking-widest text-accent hover:text-accent/70 transition-colors">Trust Hub</Link>
        </div>

        <div className="flex items-center gap-5">
          {!isUserLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-11 px-5 rounded-xl bg-accent/10 hover:bg-accent/20 flex items-center gap-3 border border-transparent">
                  <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                    {user.email?.[0].toUpperCase() || 'G'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate font-bold text-xs text-accent">{user.isAnonymous ? "Guest Session" : user.email}</span>
                  <ChevronDown className="h-3 w-3 opacity-50 text-accent" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-border/40 bg-card">
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-primary">Account Control</DropdownMenuLabel>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3 font-medium text-accent hover:bg-accent/5 transition-colors"><User className="h-4 w-4" /> Account Settings</DropdownMenuItem>
                <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3 font-medium text-accent hover:bg-accent/5 transition-colors"><Zap className="h-4 w-4" /> Usage Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={handleLogout} className="p-3 rounded-xl cursor-pointer gap-3 text-destructive focus:bg-destructive/5 focus:text-destructive font-medium">
                  <LogOut className="h-4 w-4" />
                  Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-6 mr-2">
                 <Link href="/login" className="text-[13px] font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors">Sign In</Link>
              </div>
              <Button asChild size="lg" className="h-12 px-8 rounded-xl bg-accent text-white shadow-xl shadow-accent/20 hover:shadow-accent/30 transition-all">
                <Link href="/login">Get Started</Link>
              </Button>
            </>
          )}
          
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border/40 bg-muted/20">
                  <Menu className="h-6 w-6 text-accent" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-4 rounded-2xl shadow-2xl border-border/40 bg-card space-y-4">
                <div className="space-y-1">
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-primary font-black">Navigation</DropdownMenuLabel>
                  <DropdownMenuItem asChild className="p-3 rounded-xl text-accent hover:bg-accent/5"><Link href="/pricing" className="flex items-center gap-3 font-bold"><Zap className="h-4 w-4" /> Pricing</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl text-accent hover:bg-accent/5"><Link href="/enterprise" className="flex items-center gap-3 font-bold"><Globe className="h-4 w-4" /> Enterprise</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 rounded-xl text-accent hover:bg-accent/5"><Link href="/security" className="flex items-center gap-3 font-bold"><ShieldCheck className="h-4 w-4" /> Security</Link></DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                {!user && <DropdownMenuItem asChild className="p-3 rounded-xl bg-accent text-white hover:bg-accent/90 hover:text-white"><Link href="/login" className="flex items-center justify-center font-bold">Log In</Link></DropdownMenuItem>}
                {user && <DropdownMenuItem onClick={handleLogout} className="p-3 rounded-xl bg-destructive/10 text-destructive font-bold justify-center">Sign Out</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}