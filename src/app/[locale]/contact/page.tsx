"use client"

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Loader2, 
  CheckCircle2, 
  Globe, 
  ShieldCheck, 
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/lib/i18n-context';

export default function ContactPage() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsDone(true);
    toast({
      title: t('contact.form.success'),
      description: t('contact.form.success_desc'),
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl mb-2">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">{t('contact.title')}</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <div className="section-label">
                  <Globe className="h-3 w-3 text-primary" />
                  <span>Verified Identity Support</span>
                </div>
                <h2 className="text-3xl font-black text-accent uppercase italic tracking-tighter">Unified Protocol Tunnel.</h2>
                <p className="text-accent/60 font-bold leading-relaxed">
                  The DOCFLOW administrative tunnel is active 24/7. All inquiries are routed through our verified singular endpoint.
                </p>
              </div>

              <div className="p-10 bg-white rounded-[3rem] border border-accent/5 shadow-2xl space-y-8 group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg shrink-0">
                    <Mail className="h-8 w-8" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-2xl font-black text-accent uppercase italic tracking-tighter leading-none">{t('contact.endpoint.title')}</h3>
                    <p className="text-lg font-bold text-primary truncate italic">office.contact.sufian@gmail.com</p>
                  </div>
                </div>
                
                <div className="h-px w-full bg-accent/5" />
                
                <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-accent/40">{t('contact.endpoint.label')}</p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: "Primary Protocol", icon: Mail },
                      { label: "Security Registry", icon: ShieldCheck },
                      { label: "Administrative Gateway", icon: Zap },
                    ].map((scope) => (
                      <div key={scope.label} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-accent/60">
                        <scope.icon className="h-3 w-3 text-primary" />
                        <span>{scope.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {!isDone ? (
                <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                  <CardHeader className="p-10 pb-4">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-accent">{t('contact.form.title')}</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">{t('contact.form.desc')}</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="p-10 pt-4 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">{t('contact.form.identity')}</Label>
                          <Input required placeholder="NAME / ENTITY..." className="h-12 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">{t('contact.form.tunnel')}</Label>
                          <Input required type="email" placeholder="YOUR@EMAIL.PRO..." className="h-12 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">{t('contact.form.payload')}</Label>
                        <Textarea required placeholder="DETAILED INQUIRY STREAM..." className="min-h-[150px] bg-muted/20 border-accent/10 rounded-2xl font-bold text-accent resize-none" />
                      </div>
                      
                      <Button 
                        disabled={isSubmitting}
                        className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20 hover:scale-[1.01] transition-transform"
                      >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {t('contact.form.submit')}
                      </Button>
                    </CardContent>
                  </form>
                </Card>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8">
                  <Card className="p-12 bg-white border-none shadow-2xl rounded-[3rem] space-y-8 w-full">
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">{t('contact.form.success')}</h2>
                      <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">{t('contact.form.success_desc')}</p>
                    </div>
                    <Button variant="ghost" onClick={() => setIsDone(false)} className="text-[10px] font-black uppercase tracking-widest text-accent/40">
                      Start New Transmission
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
