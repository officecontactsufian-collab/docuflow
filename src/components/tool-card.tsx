import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export function ToolCard({ title, description, icon: Icon, href }: ToolCardProps) {
  return (
    <Link href={href} className="group h-full block">
      <Card className="h-full tool-card-shadow transition-all duration-500 hover:-translate-y-2 border-white/10 bg-card overflow-hidden relative flex flex-col rounded-[2.5rem] group-hover:border-primary/40 group-hover:ring-1 group-hover:ring-primary/20">
        <CardHeader className="space-y-6 p-10 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center transition-all duration-500 text-primary group-hover:scale-110 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/10">
            <Icon className="h-8 w-8" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-xl font-black tracking-tight text-accent uppercase italic transition-colors group-hover:text-primary">
              {title}
            </CardTitle>
            <CardDescription className="text-accent/60 text-sm leading-relaxed font-semibold">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-10 pb-10 pt-4 mt-auto">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 text-accent/30 group-hover:text-primary group-hover:translate-x-1">
             Process Now <ArrowRight className="h-3 w-3" />
           </div>
        </CardContent>
        {/* Subtle accent corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[40px] -mr-12 -mt-12 transition-opacity opacity-0 group-hover:opacity-100" />
      </Card>
    </Link>
  );
}
