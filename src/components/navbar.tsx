import Link from 'next/link';
import { 
  FileText, 
  ChevronDown, 
  Merge, 
  Scissors, 
  Sparkles, 
  RefreshCcw, 
  ShieldCheck, 
  Lock,
  Menu,
  Maximize,
  RotateCw,
  Unlock
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

export function Navbar() {
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
            <DropdownMenuContent align="start" className="w-[500px] p-6 grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Manipulation</DropdownMenuLabel>
                <div className="grid gap-1">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/merge" className="flex items-center gap-2"><Merge className="h-4 w-4 text-primary" /> Merge Files</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/split" className="flex items-center gap-2"><Scissors className="h-4 w-4 text-primary" /> Split Pages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/compress" className="flex items-center gap-2"><Maximize className="h-4 w-4 text-primary" /> Compress PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/organize" className="flex items-center gap-2"><RotateCw className="h-4 w-4 text-primary" /> Organize Pages</Link>
                  </DropdownMenuItem>
                </div>
              </div>
              <div className="space-y-3 border-l pl-6">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Intelligence & Security</DropdownMenuLabel>
                <div className="grid gap-1">
                  <DropdownMenuItem asChild className="cursor-pointer bg-accent/5">
                    <Link href="/analyze" className="flex items-center gap-2 font-semibold text-accent"><Sparkles className="h-4 w-4" /> AI Analysis</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/protect" className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Protect PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/protect?mode=unlock" className="flex items-center gap-2"><Unlock className="h-4 w-4 text-primary" /> Unlock PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/convert?type=pdf-to-pdfa" className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-600" /> Compliance PDF/A</Link>
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
          <div className="hidden md:flex items-center gap-4 mr-4">
             <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">Login</Link>
          </div>
          <Button className="bg-primary hover:bg-primary/90 shadow-md">Get Started</Button>
          
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
                <DropdownMenuItem asChild><Link href="/compress">Compress PDF</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/organize">Organize PDF</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/analyze" className="text-accent font-bold">AI Analyze</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/protect">Security</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
