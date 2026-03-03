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
  LogOut
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary font-headline hidden sm:block">
              DocuFlow <span className="text-foreground/50 font-medium">Pro</span>
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors outline-none">
              Products <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[600px] p-6 grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Manipulation</DropdownMenuLabel>
                <div className="grid gap-1">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/merge" className="flex items-center gap-2"><Merge className="h-4 w-4 text-primary" /> Merge PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/split" className="flex items-center gap-2"><Scissors className="h-4 w-4 text-primary" /> Split PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/organize" className="flex items-center gap-2"><RotateCw className="h-4 w-4 text-primary" /> Organize Pages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/watermark" className="flex items-center gap-2"><Type className="h-4 w-4 text-primary" /> Watermark PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/numbers" className="flex items-center gap-2"><Hash className="h-4 w-4 text-primary" /> Add Page Numbers</Link>
                  </DropdownMenuItem>
                </div>
              </div>
              <div className="space-y-3 border-l pl-6">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Intelligence & Security</DropdownMenuLabel>
                <div className="grid gap-1">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/analyze" className="flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> Doc Inspector</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/sanitize" className="flex items-center gap-2"><Eraser className="h-4 w-4 text-primary" /> Sanitize PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/repair" className="flex items-center gap-2"><Wrench className="h-4 w-4 text-primary" /> Repair PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/sign" className="flex items-center gap-2"><Signature className="h-4 w-4 text-primary" /> Sign PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/protect" className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Protect PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/protect?mode=unlock" className="flex items-center gap-2"><Unlock className="h-4 w-4 text-primary" /> Unlock PDF</Link>
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Enterprise</Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Security</Link>
        </div>

        <div className="flex items-center gap-3">
          {!isUserLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline-block max-w-[150px] truncate">{user.isAnonymous ? "Guest User" : user.email}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Usage Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-4 mr-4">
                 <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Login</Link>
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90 shadow-md">
                <Link href="/login">Get Started</Link>
              </Button>
            </>
          )}
          
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuLabel>Tools</DropdownMenuLabel>
                <DropdownMenuItem asChild><Link href="/merge">Merge PDF</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/split">Split PDF</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/sign">Sign PDF</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/numbers">Numbers</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/sanitize">Sanitize</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/repair">Repair</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                {!user && <DropdownMenuItem asChild><Link href="/login">Login</Link></DropdownMenuItem>}
                {user && <DropdownMenuItem onClick={handleLogout} className="text-destructive">Sign Out</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
