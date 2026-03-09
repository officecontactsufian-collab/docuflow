"use client"

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, UserPlus, Mail, Lock, Chrome, ArrowRight, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Script from 'next/script';
import { verifyRecaptcha } from '../auth-actions';

export default function SignupPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isUserLoading && user && !user.isAnonymous) {
      router.push(`/${locale}/dashboard`);
    }
  }, [user, isUserLoading, router, locale]);

  const syncUserProfile = async (uid: string, email: string, displayName: string) => {
    const userRef = doc(firestore, 'users', uid);
    await setDoc(userRef, {
      uid,
      email,
      displayName,
      createdAt: serverTimestamp(),
      usageCount: 0
    }, { merge: true });
  };

  const executeRecaptcha = async (action: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      
      if (!siteKey) {
        console.warn('reCAPTCHA site key is missing. Initializing in sandbox mode.');
        resolve(null);
        return;
      }

      if (typeof window === 'undefined' || !window.grecaptcha) {
        console.warn('reCAPTCHA registry not found in window buffer.');
        resolve(null);
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(siteKey, { action })
          .then((token: string) => resolve(token))
          .catch((err: any) => {
            console.error('reCAPTCHA Synthesis Failure:', err);
            resolve(null);
          });
      });
    });
  };

  const verifyHumanity = async (action: string) => {
    const token = await executeRecaptcha(action);
    if (!token) return true; // Fallback for missing keys in dev environment
    return await verifyRecaptcha(token);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const isHuman = await verifyHumanity('signup_email');
      if (!isHuman) {
        throw new Error("Security verification failed. High risk activity detected.");
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await syncUserProfile(cred.user.uid, email, name);
      toast({ title: "Account Synthesized", description: "Your professional registry has been established." });
      router.push(`/${locale}/dashboard`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Synthesis Error", description: error.message || "Failed to create account." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const isHuman = await verifyHumanity('signup_google');
      if (!isHuman) {
        throw new Error("Security verification failed. High risk activity detected.");
      }

      const cred = await signInWithPopup(auth, provider);
      await syncUserProfile(cred.user.uid, cred.user.email!, cred.user.displayName!);
      toast({ title: "Identity Federated", description: "Account created via Google tunnel." });
      router.push(`/${locale}/dashboard`);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        setIsLoading(false);
        return;
      }
      toast({ 
        variant: "destructive", 
        title: "Protocol Error", 
        description: error.message || "Google onboarding sequence interrupted." 
      });
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
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg mb-4">
              <UserPlus className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic text-accent">Synthesize Account</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Establish your professional presence.</p>
          </div>

          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl font-black uppercase italic text-accent">Identity Registry</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">New User Onboarding</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-accent/60">Full Legal Name</Label>
                  <Input 
                    id="name" placeholder="JOHN DOE" required 
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-accent/60">Email Endpoint</Label>
                  <Input 
                    id="email" type="email" placeholder="YOUR@EMAIL.PRO" required 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-accent/60">Secure Key</Label>
                  <Input 
                    id="password" type="password" required 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pb-8">
                <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Deploy Identity"}
                </Button>
                
                <div className="relative w-full py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-accent/5"></span></div>
                  <div className="relative flex justify-center text-[8px] font-black uppercase"><span className="bg-white px-4 text-accent/20 tracking-[0.3em]">OR GOOGLE TUNNEL</span></div>
                </div>

                <Button type="button" variant="outline" onClick={handleGoogleSignup} className="w-full h-12 rounded-xl border-accent/10 font-black uppercase tracking-widest text-[10px]" disabled={isLoading}>
                  <Chrome className="mr-2 h-4 w-4 text-primary" /> Google Synthesis
                </Button>

                <div className="pt-4 text-center">
                  <p className="text-[10px] font-bold text-accent/40 uppercase">Already registered? <Link href={`/${locale}/login`} className="text-primary hover:underline italic">Sign Up - Login <ArrowRight className="inline h-2.5 w-2.5" /></Link></p>
                </div>
              </CardFooter>
            </form>
          </Card>
          
          <div className="text-center">
             <p className="text-[8px] font-bold text-accent/20 uppercase tracking-[0.2em] max-w-[240px] mx-auto leading-relaxed">
               Protected by reCAPTCHA v3. Google <Link href="/privacy" className="underline">Privacy</Link> and <Link href="/terms" className="underline">Terms</Link> apply.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}
