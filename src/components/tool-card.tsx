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
      <Card className="h-full tool-card-shadow transition-all duration-500 hover:-translate-y-2 border-white/10 bg-card/80 backdrop-blur-sm overflow-hidden relative flex flex-col rounded-[2rem] group-hover:border-primary/30 group-hover:ring-1 group-hover:ring-primary/10">
        <CardHeader className="space-y-6 p-8 pb-4">
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center transition-all duration-500 text-primary group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
            <Icon className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-lg font-black tracking-tight text-accent uppercase italic transition-colors group-hover:text-primary">
              {title}
            </CardTitle>
            <CardDescription className="text-accent/60 text-xs leading-relaxed font-bold">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-4 mt-auto">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 text-accent/30 group-hover:text-primary group-hover:translate-x-1">
             Process Document <ArrowRight className="h-3 w-3" />
           </div>
        </CardContent>
      </Card>
    </Link>
  );
}
