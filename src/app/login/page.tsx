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
  initiateEmailSignIn, 
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doc, serverTimestamp } from 'firebase/firestore';
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // Handle Post-Auth Registration & Administrative Elevation
  React.useEffect(() => {
    if (user && !isUserLoading && firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      const profileData = {
        id: user.uid,
        email: user.email,
        role: user.email === 'office.contact.sufian@gmail.com' ? 'admin' : 'standard',
        status: 'active',
        updatedAt: serverTimestamp()
      };
      
      setDocumentNonBlocking(userRef, profileData, { merge: true });

      if (user.email === 'office.contact.sufian@gmail.com') {
        const adminRef = doc(firestore, 'roles_admin', user.uid);
        const adminData = {
          id: user.uid,
          email: user.email,
          role: 'admin',
          updatedAt: serverTimestamp()
        };

        setDocumentNonBlocking(adminRef, adminData, { merge: true });
        router.push('/dashboard');
      } else {
        router.push('/');
      }
      
      setIsLoading(false);
    }
  }, [user, isUserLoading, firestore, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid credentials. Please verify your email and password.",
      });
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsLoading(false);
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm font-black uppercase tracking-widest text-accent/40 animate-pulse italic">Initializing Secure Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight font-headline uppercase italic text-accent">Admin Gateway</h1>
            <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">
              {user ? "Session established." : "Access system intelligence dashboard."}
            </p>
          </div>

          {user ? (
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden animate-in zoom-in-95 duration-500">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-green-600">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-black uppercase italic text-accent">Session Verified</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">
                  Authenticated as: <span className="text-primary">{user.email}</span>
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col gap-3 pb-10 px-8">
                <Button 
                  onClick={() => router.push(user.email === 'office.contact.sufian@gmail.com' ? '/dashboard' : '/')}
                  className="w-full h-14 rounded-2xl bg-accent text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-accent/20"
                >
                  {user.email === 'office.contact.sufian@gmail.com' ? "Enter Command Dashboard" : "Enter Professional Workspace"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="w-full h-12 text-destructive hover:bg-destructive/5 font-black uppercase tracking-widest text-[9px]"
                >
                  <LogOut className="mr-2 h-3.5 w-3.5" /> Terminate Session
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="space-y-1 pb-2">
                <CardTitle className="text-xl font-black uppercase italic text-accent">Sign In</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Enter credentials for secure staging.</CardDescription>
              </CardHeader>
              <form onSubmit={handleEmailSignIn}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" /> Email Protocol
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="NAME@COMPANY.COM" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" /> Access Key
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
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Authenticate Session"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent/40">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span>Secure 256-bit AES Enterprise Tunnel</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}