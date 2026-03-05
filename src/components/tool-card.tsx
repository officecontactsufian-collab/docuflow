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
      <Card className="tool-card h-full rounded-2xl p-2 border-none ring-1 ring-accent/5">
        <CardHeader className="space-y-4 p-4">
          <div className="icon-box">
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-lg font-black tracking-tight text-accent uppercase italic transition-colors group-hover:text-primary">
              {title}
            </CardTitle>
            <CardDescription className="text-accent/60 text-[10px] leading-relaxed font-bold uppercase tracking-widest">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 mt-auto">
           <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] transition-all duration-300 text-accent/30 group-hover:text-primary group-hover:translate-x-1">
             Deploy Protocol <ArrowRight className="h-2.5 w-2.5" />
           </div>
        </CardContent>
      </Card>
    </Link>
  );
}
