import Link from 'next/link';
import { FileText, Github, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary font-headline">
              PDF Spark
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/merge" className="text-sm font-medium hover:text-primary transition-colors">Merge</Link>
          <Link href="/split" className="text-sm font-medium hover:text-primary transition-colors">Split</Link>
          <Link href="/convert" className="text-sm font-medium hover:text-primary transition-colors">Convert</Link>
          <Link href="/analyze" className="text-sm font-medium text-accent font-semibold hover:opacity-80 transition-colors">AI Analyze</Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Github className="h-5 w-5" />
          </Button>
          <Button className="bg-accent hover:bg-accent/90">Sign Up</Button>
          
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild><Link href="/merge">Merge PDF</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/split">Split PDF</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/convert">Convert PDF</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/analyze">AI Analyze</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}