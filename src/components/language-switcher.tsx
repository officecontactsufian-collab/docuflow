"use client"

import * as React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages, Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
] as const;

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const currentLang = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger suppressHydrationWarning asChild>
        <Button variant="ghost" size="sm" className="h-8 rounded-lg gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all">
          <Languages className="h-4 w-4 text-primary" />
          <span className="hidden md:inline">{currentLang.label}</span>
          <span className="md:hidden">{currentLang.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-xl bg-white/95 backdrop-blur-xl shadow-2xl border-accent/5 p-1 mt-2">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code as any)}
            className={cn(
              "flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all",
              locale === lang.code ? "bg-primary/5 text-primary" : "hover:bg-muted/50"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">{lang.flag}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{lang.label}</span>
            </div>
            {locale === lang.code && <Check className="h-3 w-3" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
