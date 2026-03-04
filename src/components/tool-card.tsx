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
      <Card className="tool-card h-full rounded-[2.5rem] p-4 border-none">
        <CardHeader className="space-y-6 p-6">
          <div className="icon-box">
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-xl font-black tracking-tight text-accent uppercase italic transition-colors group-hover:text-primary">
              {title}
            </CardTitle>
            <CardDescription className="text-accent/60 text-xs leading-relaxed font-bold uppercase tracking-widest">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 mt-auto">
           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 text-accent/20 group-hover:text-primary group-hover:translate-x-1">
             Process Asset <ArrowRight className="h-3 w-3" />
           </div>
        </CardContent>
      </Card>
    </Link>
  );
}