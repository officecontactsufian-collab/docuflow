import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  accent?: boolean;
}

export function ToolCard({ title, description, icon: Icon, href, accent }: ToolCardProps) {
  return (
    <Link href={href} className="group h-full">
      <Card className={`h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl border-border/60 overflow-hidden relative ${accent ? 'bg-gradient-to-br from-accent/5 to-white ring-1 ring-accent/20' : 'bg-white hover:border-primary/50'}`}>
        {accent && (
          <div className="absolute top-0 right-0 p-3">
             <div className="px-2 py-0.5 rounded-full bg-accent text-[8px] font-bold text-white uppercase tracking-tighter">AI Powered</div>
          </div>
        )}
        <CardHeader className="space-y-5 p-6 pb-2">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg duration-300 ${accent ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/10' : 'bg-primary/5 text-primary border border-primary/10'}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <CardTitle className={`text-lg transition-colors font-headline ${accent ? 'text-accent' : 'group-hover:text-primary'}`}>
              {title}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4">
           <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-opacity group-hover:opacity-100 opacity-0 ${accent ? 'text-accent' : 'text-primary'}`}>
             Open Tool <Icon className="h-3 w-3" />
           </div>
        </CardContent>
      </Card>
    </Link>
  );
}
