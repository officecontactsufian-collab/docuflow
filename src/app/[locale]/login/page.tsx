
"use client"

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Loader2, Lock, Mail, Chrome, ArrowRight, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Script from 'next/script';
import { useTranslation } from '@/lib/i18n-context';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isUserLoading && user && !user.isAnonymous) {
      router.push(`/${locale}/dashboard`);
    }
  }, [user, isUserLoading, router, locale]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth!, email, password);
      router.push(`/${locale}/dashboard`);
    } catch (error: any) {
      console.error('Auth Protocol Failure:', error.code);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      await signInWithPopup(auth!, provider);
      // Silent redirect for Gmail login
      router.push(`/${locale}/dashboard`);
    } catch (error: any) {
      console.error('Federated Auth Error:', error.code);
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {siteKey && (
        <Script 
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="afterInteractive"
        />
      )}
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-lg mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic text-accent">{t('common.login')}</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Secure identity verification required.</p>
          </div>

          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl font-black uppercase italic text-accent">{t('auth.login.title')}</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">{t('auth.login.desc')}</CardDescription>
            </CardHeader>
            <form onSubmit={handleEmailLogin}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {t('auth.login.identity')}
                  </Label>
                  <Input 
                    id="email" type="email" placeholder="USER@DOCFLOW.PRO" required 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" /> {t('auth.login.key')}
                    </Label>
                    <Link href={`/${locale}/reset-password`} className="text-[9px] font-black uppercase text-primary hover:underline italic">{t('auth.login.lost_key')}</Link>
                  </div>
                  <Input 
                    id="password" type="password" required 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pb-8">
                <Button type="submit" className="w-full h-12 rounded-xl bg-accent text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-accent/20" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('auth.login.submit')}
                </Button>
                
                <div className="relative w-full py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-accent/5"></span></div>
                  <div className="relative flex justify-center text-[8px] font-black uppercase"><span className="bg-white px-4 text-accent/20 tracking-[0.3em]">{t('auth.login.or')}</span></div>
                </div>

                <Button type="button" variant="outline" onClick={handleGoogleLogin} className="w-full h-12 rounded-xl border-accent/10 font-black uppercase tracking-widest text-[10px]" disabled={isLoading}>
                  <Chrome className="mr-2 h-4 w-4 text-primary" /> {t('auth.login.google')}
                </Button>

                <div className="pt-4 text-center">
                  <p className="text-[10px] font-bold text-accent/40 uppercase">{t('auth.login.new_user')} <Link href={`/${locale}/signup`} className="text-primary hover:underline italic">{t('common.signup')} <ArrowRight className="inline h-2.5 w-2.5" /></Link></p>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
