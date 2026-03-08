
"use client"

import Link from 'next/link';
import { 
  FileText, 
  ChevronDown, 
  Merge, 
  RotateCw, 
  LayoutDashboard, 
  ShieldCheck, 
  Unlock, 
  Signature, 
  Hash, 
  Crop, 
  FilePenLine, 
  Search, 
  Activity, 
  LogOut, 
  Layout, 
  Camera,
  Menu,
  BrainCircuit,
  Lock,
  CheckCircle2,
  BookOpen,
  Briefcase,
  Mail,
  Languages,
  MessageSquare,
  RefreshCcw,
  FileBadge,
  ArrowRightLeft,
  Image as ImageIcon,
  Table,
  Eraser,
  Wrench,
  Scissors
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import * as React from 'react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n-context';
import { LanguageSwitcher } from './language-switcher';

export function Navbar() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { t, isHydrated } = useTranslation();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const categories = [
    {
      label: t('nav.ai_writing'),
      items: [
        { href: "/ai-studio", icon: RefreshCcw, title: t('tools.paraphraser.title'), desc: t('tools.paraphraser.desc') },
        { href: "/ai-studio", icon: Activity, title: t('tools.summarizer.title'), desc: t('tools.summarizer.desc') },
        { href: "/ai-studio", icon: CheckCircle2, title: t('tools.grammar.title'), desc: t('tools.grammar.desc') },
        { href: "/ai-studio", icon: BookOpen, title: t('tools.essay.title'), desc: t('tools.essay.desc') },
      ]
    },
    {
      label: t('nav.ai_career'),
      items: [
        { href: "/ai-studio", icon: Briefcase, title: t('tools.resume.title'), desc: t('tools.resume.desc') },
        { href: "/ai-studio", icon: FileBadge, title: t('tools.cover_letter.title'), desc: t('tools.cover_letter.desc') },
        { href: "/ai-studio", icon: Mail, title: t('tools.email.title'), desc: t('tools.email.desc') },
        { href: "/sign", icon: Signature, title: t('tools.sign.title'), desc: t('tools.sign.desc') },
      ]
    },
    {
      label: t('nav.ai_productivity'),
      items: [
        { href: "/ai-studio", icon: Languages, title: t('tools.translator.title'), desc: t('tools.translator.desc') },
        { href: "/ai-studio", icon: MessageSquare, title: t('tools.doc_intel.title'), desc: t('tools.doc_intel.desc') },
        { href: "/scan-to-pdf", icon: Camera, title: t('tools.scan.title'), desc: t('tools.scan.desc') },
        { href: "/analyze", icon: Search, title: t('tools.inspect.title'), desc: t('tools.inspect.desc') },
      ]
    },
    {
      label: t('nav.layout'),
      items: [
        { href: "/crop", icon: Crop, title: t('tools.crop.title'), desc: t('tools.crop.desc') },
        { href: "/organize", icon: RotateCw, title: t('tools.organize.title'), desc: t('tools.organize.desc') },
        { href: "/numbers", icon: Hash, title: t('tools.numbers.title'), desc: t('tools.numbers.desc') },
        { href: "/merge", icon: Merge, title: t('tools.merge.title'), desc: t('tools.merge.desc') },
      ]
    },
    {
      label: t('nav.convert'),
      items: [
        { href: "/convert", icon: ArrowRightLeft, title: t('tools.convert_hub.title'), desc: t('tools.convert_hub.desc') },
        { href: "/convert?type=pdf-to-word", icon: FileText, title: t('tools.pdf_to_word.title'), desc: t('tools.pdf_to_word.desc') },
        { href: "/convert?type=word-to-pdf", icon: FilePenLine, title: t('tools.word_to_pdf.title'), desc: t('tools.word_to_pdf.desc') },
        { href: "/convert?type=pdf-to-excel", icon: Table, title: t('tools.pdf_to_excel.title'), desc: t('tools.pdf_to_excel.desc') },
      ]
    },
    {
      label: t('nav.security'),
      items: [
        { href: "/secure", icon: Lock, title: t('tools.protect.title'), desc: t('tools.protect.desc') },
        { href: "/protect", icon: ShieldCheck, title: t('tools.privacy.title'), desc: t('tools.privacy.desc') },
        { href: "/protect?mode=unlock", icon: Unlock, title: t('tools.unlock.title'), desc: t('tools.unlock.desc') },
        { href: "/sanitize", icon: Eraser, title: t('tools.sanitize.title'), desc: t('tools.sanitize.desc') },
      ]
    }
  ];

  return (
    <nav className="glass-nav border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-12 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group mr-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-primary shadow-lg transition-transform group-hover:scale-105 group-hover:-rotate-3">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-base font-black tracking-tighter text-accent uppercase italic">DOCFLOW</span>
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent hover:text-primary transition-all outline-none">
                <LayoutDashboard className="h-3 w-3 text-primary" />
                <span suppressHydrationWarning>{isHydrated ? t('common.all_protocols') : 'All Protocols'}</span> 
                <ChevronDown className="h-2.5 w-2.5 opacity-40" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[1000px] p-6 rounded-2xl shadow-2xl border-white/20 grid grid-cols-3 gap-8 bg-white/95 backdrop-blur-xl mt-2">
                {categories.map((cat) => (
                  <div key={cat.label} className="space-y-4">
                    <DropdownMenuLabel className="px-0 text-[9px] font-black uppercase tracking-[0.3em] text-primary/40">
                      {cat.label}
                    </DropdownMenuLabel>
                    <div className="grid gap-1">
                      {cat.items.map((item) => (
                        <DropdownMenuItem key={item.title} asChild className="p-2 rounded-xl cursor-pointer hover:bg-primary/5 transition-all">
                          <Link href={item.href} className="flex items-center gap-3">
                            <div className="h-8 w-8 text-primary flex items-center justify-center bg-primary/5 rounded-lg shrink-0">
                              <item.icon className="h-4 w-4" />
                            </div> 
                            <div className="flex flex-col min-w-0">
                              <span className="font-black text-[10px] uppercase tracking-wider text-accent truncate">{item.title}</span>
                              <span className="text-[8px] text-muted-foreground font-bold uppercase truncate">{item.desc}</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/ai-studio" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all group">
              <BrainCircuit className="h-3 w-3" /> {isHydrated ? t('nav.ai_studio') : 'AI Studio'}
            </Link>
            <Link href="/convert" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <ArrowRightLeft className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> {isHydrated ? t('nav.convert') : 'Convert'}
            </Link>
            <Link href="/merge" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <Merge className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> {isHydrated ? t('nav.merge') : 'Merge'}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-6 mr-2">
            <Link href="/pricing" className="text-[9px] font-black uppercase tracking-widest text-accent/60 hover:text-primary transition-all">{isHydrated ? t('common.pricing') : 'Pricing'}</Link>
            <Link href="/analyze" className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all">
              <Search className="h-3 w-3 text-primary" /> {isHydrated ? t('common.inspect') : 'Inspect'}
            </Link>
          </div>
          
          <LanguageSwitcher />
          
          {user?.email === 'office.contact.sufian@gmail.com' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2 bg-accent text-white hover:bg-accent/90">
                  <Layout className="h-3 w-3" /> Admin Suite
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl bg-white shadow-2xl border-accent/5">
                <DropdownMenuLabel className="text-[8px] font-black uppercase tracking-widest text-accent/40">{user?.email}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/admin-dashboard" className="cursor-pointer text-[10px] font-bold uppercase">
                    <Activity className="h-3 w-3 mr-2" /> Command Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer text-[10px] font-bold uppercase">
                  <LogOut className="h-3 w-3 mr-2" /> End Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-accent hover:bg-accent/5 rounded-lg">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
