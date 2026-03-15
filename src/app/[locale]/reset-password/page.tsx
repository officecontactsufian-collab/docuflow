
"use client"

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Loader2, KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n-context';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const auth = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth!, email);
      setIsDone(true);
      toast({ title: t('common.success'), description: t('auth.reset_password.success_desc') });
    } catch (error: any) {
      toast({ variant: "destructive", title: t('common.failure'), description: error.message || t('auth.errors.default') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-lg mb-4">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic text-accent">Key Recovery</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Credential restoration protocol.</p>
          </div>

          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            {!isDone ? (
              <>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl font-black uppercase italic text-accent">{t('auth.reset_password.title')}</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">{t('auth.reset_password.desc')}</CardDescription>
                </CardHeader>
                <form onSubmit={handleReset}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" /> {t('auth.reset_password.endpoint')}
                      </Label>
                      <Input 
                        id="email" type="email" placeholder="YOUR@EMAIL.PRO" required 
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 pb-8">
                    <Button type="submit" className="w-full h-12 rounded-xl bg-accent text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-accent/20" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('auth.reset_password.submit')}
                    </Button>
                    <Button asChild variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-accent/40">
                      <Link href={`/${locale}/login`}><ArrowLeft className="mr-2 h-3 w-3" /> {t('auth.reset_password.return')}</Link>
                    </Button>
                  </CardFooter>
                </form>
              </>
            ) : (
              <CardContent className="p-12 text-center space-y-6">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase italic text-accent">{t('auth.reset_password.success_title')}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">{t('auth.reset_password.success_desc')}</p>
                </div>
                <Button asChild className="w-full h-12 rounded-xl bg-accent text-white font-black uppercase tracking-widest text-[10px]">
                  <Link href={`/${locale}/login`}>{t('auth.reset_password.return')}</Link>
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
