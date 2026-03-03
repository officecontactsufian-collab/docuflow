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
    <Link href={href} className="group">
      <Card className={`h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-border/50 ${accent ? 'bg-gradient-to-br from-white to-accent/5 ring-1 ring-accent/20' : 'hover:border-primary/50'}`}>
        <CardHeader className="space-y-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors group-hover:scale-110 duration-300 ${accent ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20' : 'bg-primary/10 text-primary'}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl group-hover:text-primary transition-colors font-headline">{title}</CardTitle>
            <CardDescription className="text-muted-foreground leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}