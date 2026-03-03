import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
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
      <Card className="h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border-border/60 overflow-hidden relative bg-white hover:border-primary/50">
        <CardHeader className="space-y-5 p-6 pb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg duration-300 bg-primary/5 text-primary border border-primary/10">
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-lg transition-colors font-headline group-hover:text-primary">
              {title}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
           <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-opacity group-hover:opacity-100 opacity-0 text-primary">
             Open Tool <Icon className="h-3 w-3" />
           </div>
        </CardContent>
      </Card>
    </Link>
  );
}
