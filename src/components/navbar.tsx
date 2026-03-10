
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
  Sparkles,
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
  const locale = (params?.locale as string) || 'en';
  const { t } = useTranslation();

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push(`/${locale}`);
  };

  const categories = [
    {
      label: t('nav.ai_writing'),
      items: [
        { href: `/${locale}/ai-studio`, icon: FilePenLine, title: t('tools.paraphraser.title'), desc: t('tools.paraphraser.desc') },
        { href: `/${locale}/tools/ai-humanizer`, icon: UserCheck, title: t('tools.humanizer.title'), desc: t('tools.humanizer.desc') },
        { href: `/${locale}/ai-studio`, icon: Activity, title: t('tools.summarizer.title'), desc: t('tools.summarizer.desc') },
        { href: `/${locale}/tools/ai-prompt-improver`, icon: Sparkles, title: t('tools.prompt_improver.title'), desc: t('tools.prompt_improver.desc') },
      ]
    },
    {
      label: t('nav.ai_discovery'),
      items: [
        { href: `/${locale}/tools/ai-niche-finder`, icon: TrendingUp, title: t('tools.niche_finder.title'), desc: t('tools.niche_finder.desc') },
        { href: `/${locale}/tools/ai-skill-generator`, icon: BookOpen, title: t('tools.skill_generator.title'), desc: t('tools.skill_generator.desc') },
        { href: `/${locale}/tools/ai-reality-check`, icon: Target, title: t('tools.reality_check.title'), desc: t('tools.reality_check.desc') },
        { href: `/${locale}/tools/ai-life-simulator`, icon: Globe, title: t('tools.life_simulator.title'), desc: t('tools.life_simulator.desc') },
      ]
    },
    {
      label: t('nav.ai_productivity'),
      items: [
        { href: `/${locale}/tools/ai-decision-helper`, icon: Scale, title: t('tools.decision_helper.title'), desc: t('tools.decision_helper.desc') },
        { href: `/${locale}/tools/ai-content-repurposer`, icon: RefreshCcw, title: t('tools.repurposer.title'), desc: t('tools.repurposer.desc') },
        { href: `/${locale}/tools/ai-personal-brain`, icon: BrainCircuit, title: t('tools.personal_brain.title'), desc: t('tools.personal_brain.desc') },
        { href: `/${locale}/ai-studio`, icon: Languages, title: t('tools.translator.title'), desc: t('tools.translator.desc') },
      ]
    },
    {
      label: t('home.categories.asset_intel'),
      items: [
        { href: `/${locale}/ai-studio`, icon: MessageSquare, title: t('tools.doc_intel.title'), desc: t('tools.doc_intel.desc') },
        { href: `/${locale}/scan-to-pdf`, icon: Camera, title: t('tools.scan.title'), desc: t('tools.scan.desc') },
        { href: `/${locale}/analyze`, icon: Search, title: t('tools.inspect.title'), desc: t('tools.inspect.desc') },
        { href: `/${locale}/repair`, icon: Wrench, title: t('tools.repair.title'), desc: t('tools.repair.desc') },
      ]
    },
    {
      label: t('nav.layout'),
      items: [
        { href: `/${locale}/crop`, icon: Crop, title: t('tools.crop.title'), desc: t('tools.crop.desc') },
        { href: `/${locale}/organize`, icon: RotateCw, title: t('tools.organize.title'), desc: t('tools.organize.desc') },
        { href: `/${locale}/numbers`, icon: Hash, title: t('tools.numbers.title'), desc: t('tools.numbers.desc') },
        { href: `/${locale}/merge`, icon: Merge, title: t('tools.merge.title'), desc: t('tools.merge.desc') },
        { href: `/${locale}/split`, icon: Scissors, title: t('tools.split.title'), desc: t('tools.split.desc') },
        { href: `/${locale}/sign`, icon: Signature, title: t('tools.sign.title'), desc: t('tools.sign.desc') },
      ]
    },
    {
      label: t('nav.convert'),
      items: [
        { href: `/${locale}/convert`, icon: ArrowRightLeft, title: t('tools.convert_hub.title'), desc: t('tools.convert_hub.desc') },
        { href: `/${locale}/convert?type=pdf-to-word`, icon: FileText, title: t('tools.pdf_to_word.title'), desc: t('tools.pdf_to_word.desc') },
        { href: `/${locale}/convert?type=word-to-pdf`, icon: FilePenLine, title: t('tools.word_to_pdf.title'), desc: t('tools.word_to_pdf.desc') },
        { href: `/${locale}/convert?type=pdf-to-excel`, icon: Table, title: t('tools.pdf_to_excel.title'), desc: t('tools.pdf_to_excel.desc') },
      ]
    },
    {
      label: t('nav.security'),
      items: [
        { href: `/${locale}/secure`, icon: Lock, title: t('tools.protect.title'), desc: t('tools.protect.desc') },
        { href: `/${locale}/protect`, icon: ShieldCheck, title: t('tools.privacy.title'), desc: t('tools.privacy.desc') },
        { href: `/${locale}/protect?mode=unlock`, icon: Unlock, title: t('tools.unlock.title'), desc: t('tools.unlock.desc') },
        { href: `/${locale}/sanitize`, icon: Eraser, title: t('tools.sanitize.title'), desc: t('tools.sanitize.desc') },
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
              <DropdownMenuTrigger 
                suppressHydrationWarning
                className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent hover:text-primary transition-all outline-none"
              >
                <LayoutDashboard className="h-3 w-3 text-primary" />
                <span>{t('common.all_protocols')}</span> 
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
              <TrendingUp className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> {t('tools.niche_finder.title')}
            </Link>
            <Link href={`/${locale}/tools/ai-reality-check`} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-accent/80 hover:text-accent transition-all group">
              <Target className="h-3 w-3 text-primary/60 group-hover:text-primary transition-colors" /> {t('tools.reality_check.title')}
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
          
          {user && !user.isAnonymous ? (
            <DropdownMenu>
              <DropdownMenuTrigger suppressHydrationWarning asChild>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest gap-2 bg-accent text-white hover:bg-accent/90">
                  <Layout className="h-3 w-3" /> {t('common.dashboard')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl bg-white shadow-2xl border-accent/5">
                <DropdownMenuLabel className="text-[8px] font-black uppercase tracking-widest text-accent/40">{user.email}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/dashboard`} className="cursor-pointer text-[10px] font-bold uppercase">
                    <Activity className="h-3.5 w-3.5 mr-2" /> {t('nav.dashboard_center')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer text-[10px] font-bold uppercase">
                  <LogOut className="h-3.5 w-3.5 mr-2" /> {t('common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest border-accent/10">
              <Link href={`/${locale}/login`}>{t('common.login')}</Link>
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
