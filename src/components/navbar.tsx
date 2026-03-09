
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
  UserCheck,
  BookOpen,
  Languages,
  MessageSquare,
  RefreshCcw,
  ArrowRightLeft,
  Table,
  Eraser,
  Wrench,
  Scissors,
  TrendingUp,
  Scale,
  Sparkles,
  Target,
  Zap,
  Globe
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
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n-context';
import { LanguageSwitcher } from './language-switcher';

export function Navbar() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || 'en';
  const { t, isHydrated } = useTranslation();

  const handleLogout = async () => {
    await signOut(auth);
    router.push(`/${locale}`);
  };

  const categories = [
    {
      label: t('nav.ai_writing'),
      items: [
        { href: `/${locale}/ai-studio`, icon: FilePenLine, title: "Paraphraser", desc: "Re-engineer text." },
        { href: `/${locale}/tools/ai-humanizer`, icon: UserCheck, title: "AI Humanizer", desc: "Natural synthesis." },
        { href: `/${locale}/ai-studio`, icon: Activity, title: "AI Summarizer", desc: "Executive distillation." },
        { href: `/${locale}/tools/ai-prompt-improver`, icon: Sparkles, title: "Prompt Improver", desc: "Optimize payloads." },
      ]
    },
    {
      label: "Discovery & Learning",
      items: [
        { href: `/${locale}/tools/ai-niche-finder`, icon: TrendingUp, title: "Niche Finder", desc: "Market opportunities." },
        { href: `/${locale}/tools/ai-skill-generator`, icon: BookOpen, title: "Skill Generator", desc: "30-day learning plans." },
        { href: `/${locale}/tools/ai-reality-check`, icon: Target, title: "Reality Check", desc: "Project viability scan." },
        { href: `/${locale}/tools/ai-life-simulator`, icon: Globe, title: "Life Simulator", desc: "Simulate future paths." },
      ]
    },
    {
      label: "Productivity & Logic",
      items: [
        { href: `/${locale}/tools/ai-decision-helper`, icon: Scale, title: "Decision Helper", desc: "Logic framework." },
        { href: `/${locale}/tools/ai-content-repurposer`, icon: RefreshCcw, title: "Content Repurposer", desc: "Omnichannel stream." },
        { href: `/${locale}/tools/ai-personal-brain`, icon: BrainCircuit, title: "Personal Brain", desc: "Cognitive indexing." },
        { href: `/${locale}/ai-studio`, icon: Languages, title: "Translator", desc: "Linguistic shift." },
      ]
    },
    {
      label: "Asset Intelligence",
      items: [
        { href: `/${locale}/ai-studio`, icon: MessageSquare, title: "Doc Intelligence", desc: "Deep interrogation." },
        { href: `/${locale}/scan-to-pdf`, icon: Camera, title: "Scan to PDF", desc: "Hardware capture." },
        { href: `/${locale}/analyze`, icon: Search, title: "Deep Inspect", desc: "Structural metadata." },
        { href: `/${locale}/repair`, icon: Wrench, title: "Repair PDF", desc: "Fix broken catalogs." },
      ]
    },
    {
      label: t('nav.layout'),
      items: [
        { href: `/${locale}/crop`, icon: Crop, title: "Crop PDF", desc: "Trim page margins." },
        { href: `/${locale}/organize`, icon: RotateCw, title: "Visual Organizer", desc: "Reorder & rotate." },
        { href: `/${locale}/numbers`, icon: Hash, title: "Add Numbers", desc: "Sequential counters." },
        { href: `/${locale}/merge`, icon: Merge, title: "Merge PDF", desc: "Combine assets." },
        { href: `/${locale}/split`, icon: Scissors, title: "Split PDF", desc: "Range extraction." },
        { href: `/${locale}/sign`, icon: Signature, title: "Sign PDF", desc: "Digital signatures." },
      ]
    },
    {
      label: t('nav.convert'),
      items: [
        { href: `/${locale}/convert`, icon: ArrowRightLeft, title: "Convert Hub", desc: "Inversion Engine." },
        { href: `/${locale}/convert?type=pdf-to-word`, icon: FileText, title: "PDF to Word", desc: "Text recovery." },
        { href: `/${locale}/convert?type=word-to-pdf`, icon: FilePenLine, title: "Word to PDF", desc: "Standardize DOCX." },
        { href: `/${locale}/convert?type=pdf-to-excel`, icon: Table, title: "PDF to Excel", desc: "Table recovery." },
      ]
    },
    {
      label: t('nav.security'),
      items: [
        { href: `/${locale}/secure`, icon: Lock, title: "Password Protect", desc: "Encrypt PDF." },
        { href: `/${locale}/protect`, icon: ShieldCheck, title: "Privacy Shield", desc: "Metadata erasure." },
        { href: `/${locale}/protect?mode=unlock`, icon: Unlock, title: "Unlock PDF", desc: "Strip restrictions." },
        { href: `/${locale}/sanitize`, icon: Eraser, title: "Sanitize Asset", desc: "Deep cleaning." },
      ]
    }
  ];

  return (
    <nav className="glass-nav border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex h-12 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href={`/${locale}`} className="flex items-center gap-2 group mr-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-primary shadow-lg transition-transform group-hover:scale-105 group-hover:-rotate-3">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-base font-black tracking-tighter text-accent uppercase italic">DOCFLOW</span>
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent hover:text-primary transition-all outline-none">
                <LayoutDashboard className="h-3 w-3 text-primary" />
                <span suppressHydrationWarning>{t('common.all_protocols')}</span> 
                <ChevronDown className="h-2.5 w-2.5 opacity-40" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[1000px] p-6 rounded-2xl shadow-2xl border-white/20 grid grid-cols-3 gap-x-8 gap-y-10 bg-white/95 backdrop-blur-xl mt-2 max-h-[80vh] overflow-y-auto custom-scrollbar">
                {categories.map((cat) => (
                  <div key={cat.label} className="space-y-4">
                    <DropdownMenuLabel className="px-0 text-[9px] font-black uppercase tracking-[0.3em] text-primary/40 border-b border-accent/5 pb-2">
                      {cat.label}
                    </DropdownMenuLabel>
                    <div className="grid gap-1">
                      {cat.items.map((item) => (
                        <DropdownMenuItem key={`${cat.label}-${item.title}`} asChild className="p-2 rounded-xl cursor-pointer hover:bg-primary/5 transition-all">
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

            <Link href={`/${locale}/ai-studio`} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all group">
              <BrainCircuit className="h-3 w-3" /> {t('nav.ai_studio')}
            </Link>
            <Link href={`/${locale}/tools/ai-niche-finder`} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <TrendingUp className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> Niche Finder
            </Link>
            <Link href={`/${locale}/tools/ai-reality-check`} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <Target className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> Reality Check
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-6 mr-2">
            <Link href={`/${locale}/analyze`} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all">
              <Search className="h-3 w-3 text-primary" /> {t('common.inspect')}
            </Link>
          </div>
          
          <LanguageSwitcher />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2 bg-accent text-white hover:bg-accent/90">
                  <Layout className="h-3 w-3" /> Dashboard
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl bg-white shadow-2xl border-accent/5">
                <DropdownMenuLabel className="text-[8px] font-black uppercase tracking-widest text-accent/40">{user.email}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard`} className="cursor-pointer text-[10px] font-bold uppercase">
                    <Activity className="h-3 w-3 mr-2" /> Command Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer text-[10px] font-bold uppercase">
                  <LogOut className="h-3 w-3 mr-2" /> End Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest border-accent/10">
              <Link href={`/${locale}/login`}>Initialize Session</Link>
            </Button>
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
