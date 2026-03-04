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
    <Link href={href} className="group h-full">
      <Card className="h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-slate-200/60 overflow-hidden relative bg-white flex flex-col rounded-[1.5rem] group-hover:border-primary/40 group-hover:ring-1 group-hover:ring-primary/10">
        <CardHeader className="space-y-6 p-8 pb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 text-primary group-hover:scale-125 group-hover:-rotate-6">
            <Icon className="h-8 w-8" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-xl font-black tracking-tight text-slate-900 group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-6 mt-auto">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 opacity-60 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1">
             Configure Tool <ArrowRight className="h-3 w-3" />
           </div>
        </CardContent>
        {/* Subtle hover background decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
           <div className="w-24 h-24 bg-primary/5 rounded-full blur-3xl" />
        </div>
      </Card>
    </Link>
  );
}
