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
      <Card className="h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(42,30,92,0.15)] border-border/40 bg-card overflow-hidden relative flex flex-col rounded-[2rem] group-hover:border-primary/50">
        <CardHeader className="space-y-6 p-8 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center transition-all duration-500 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm">
            <Icon className="h-7 w-7" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-xl font-black tracking-tight text-accent transition-colors group-hover:text-primary">
              {title}
            </CardTitle>
            <CardDescription className="text-foreground/70 text-sm leading-relaxed line-clamp-3 font-medium">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-6 mt-auto">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 text-accent/60 group-hover:text-primary group-hover:translate-x-1">
             Access Pro Tool <ArrowRight className="h-3 w-3" />
           </div>
        </CardContent>
        {/* Subtle background decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
      </Card>
    </Link>
  );
}