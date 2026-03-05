
"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  useAuth, 
  useUser, 
  useFirestore, 
  setDocumentNonBlocking
} from '@/firebase';
import { 
  FileText, 
  Loader2, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  LogOut,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, serverTimestamp } from 'firebase/firestore';
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';

const MASTER_ADMIN_EMAIL = 'office.contact.sufian@gmail.com';

export default function AdminLoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // Security Guard: Prevent logged-in non-admins from even seeing this page
  // And redirect logged-in admins to the dashboard
  React.useEffect(() => {
    if (!isUserLoading && user) {
      if (user.email === MASTER_ADMIN_EMAIL) {
        router.push('/admin-dashboard');
      } else {
        // Eject unauthorized session
        signOut(auth);
        router.push('/');
      }
    }
  }, [user, isUserLoading, auth, router]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email.toLowerCase() !== MASTER_ADMIN_EMAIL) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "This portal is restricted to authorized system administrators only.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Identity Verified",
        description: "Welcome back, Master Admin.",
      });
    } catch (error: any) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid credentials. The secure session could not be established.",
      });
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-lg mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight font-headline uppercase italic text-accent">Admin Portal</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">
              Direct Protocol Access Required.
            </p>
          </div>

          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="space-y-1 pb-2 text-center">
              <CardTitle className="text-xl font-black uppercase italic text-accent">System Entrance</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">Encrypted Command Gateway</CardDescription>
            </CardHeader>
            <form onSubmit={handleAdminSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> Identity
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="ADMIN@DOCUFLOW.PRO" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" /> Secure Key
                  </Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pb-8">
                <Button type="submit" className="w-full h-12 rounded-xl bg-accent text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-accent/20" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Identity"}
                </Button>
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-xl">
                  <AlertCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-[9px] font-bold text-accent/40 uppercase leading-normal">
                    Warning: Unauthorized access attempts are logged and reported to global security protocols.
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
