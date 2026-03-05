"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { 
  useAuth, 
  useUser, 
  useFirestore, 
  initiateEmailSignIn, 
  initiateEmailSignUp, 
  initiateAnonymousSignIn,
  errorEmitter,
  FirestorePermissionError
} from '@/firebase';
import { FileText, Loader2, ShieldCheck, Zap, User, Mail, Lock, KeyRound, Check, Globe, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { countryCodes } from '@/lib/country-codes';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const [fullName, setFullName] = React.useState('');
  const [selectedCountryISO, setSelectedCountryISO] = React.useState('US');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCountryPopoverOpen, setIsCountryPopoverOpen] = React.useState(false);

  const selectedCountry = React.useMemo(() => 
    countryCodes.find(c => c.code === selectedCountryISO) || countryCodes[0]
  , [selectedCountryISO]);

  const sortedCountries = React.useMemo(() => {
    return [...countryCodes].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Handle Administrative Elevation for the master email
  React.useEffect(() => {
    if (user && !isUserLoading && firestore) {
      if (user.email === 'office.contact.sufian@gmail.com') {
        const adminRef = doc(firestore, 'roles_admin', user.uid);
        const adminData = {
          id: user.uid,
          email: user.email,
          role: 'admin',
          updatedAt: serverTimestamp()
        };

        // Non-blocking write to establish admin marker
        setDoc(adminRef, adminData, { merge: true })
          .then(() => {
            toast({
              title: "Intelligence Access Granted",
              description: "Administrative identity verified and established.",
            });
          })
          .catch(async (err) => {
            const permissionError = new FirestorePermissionError({
              path: adminRef.path,
              operation: 'write',
              requestResourceData: adminData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });

        // Redirect immediately - local cache handles data availability
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, isUserLoading, router, firestore, toast]);

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    initiateEmailSignIn(auth, email, password);
  };

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "Passwords do not match. Please verify your credentials.",
      });
      return;
    }
    setIsLoading(true);
    initiateEmailSignUp(auth, email, password);
  };

  const handleQuickStart = () => {
    setIsLoading(true);
    initiateAnonymousSignIn(auth);
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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
            <h1 className="text-3xl font-black tracking-tight font-headline uppercase italic text-accent">Enterprise Access</h1>
            <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Access your professional document intelligence.</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/50 p-1 rounded-2xl border border-accent/5">
              <TabsTrigger value="login" className="rounded-xl font-black uppercase tracking-widest text-[10px]">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="rounded-xl font-black uppercase tracking-widest text-[10px]">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-xl font-black uppercase italic text-accent">Welcome Back</CardTitle>
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
                    <div className="relative w-full py-2">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-accent/5"></span></div>
                      <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]"><span className="bg-white px-3 text-accent/30 italic">High-Fidelity Gateway</span></div>
                    </div>
                    <Button type="button" variant="outline" className="w-full h-12 rounded-xl border-primary/20 hover:bg-primary/5 text-primary font-black uppercase tracking-widest text-[10px]" onClick={handleQuickStart} disabled={isLoading}>
                      <Zap className="mr-2 h-4 w-4 fill-current" /> Initialize Anonymous Protocol
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="text-xl font-black uppercase italic text-accent">New Workspace</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Join 500+ enterprises for document intelligence.</CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSignUp}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        <User className="h-3.5 w-3.5" /> Full Name
                      </Label>
                      <Input 
                        id="reg-name" 
                        placeholder="JANE DOE" 
                        required 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent uppercase"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-phone" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5" /> Global Dialing Protocol
                      </Label>
                      <div className="flex gap-2">
                        <Popover open={isCountryPopoverOpen} onOpenChange={setIsCountryPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={isCountryPopoverOpen}
                              className="w-[120px] bg-muted/20 shrink-0 h-11 rounded-xl border-accent/10 focus:ring-primary shadow-sm justify-between px-3"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span className="text-lg">{selectedCountry.flag}</span>
                                <span className="font-bold text-xs text-accent">{selectedCountry.dial_code}</span>
                              </div>
                              <ChevronDown className="h-3 w-3 opacity-40 shrink-0" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0 rounded-2xl border-accent/10 shadow-2xl bg-white/95 backdrop-blur-xl overflow-hidden" align="start">
                            <Command>
                              <CommandInput placeholder="Search country..." className="h-11" />
                              <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                  {sortedCountries.map((country) => (
                                    <CommandItem
                                      key={country.code}
                                      value={`${country.name} ${country.dial_code} ${country.code}`}
                                      onSelect={() => {
                                        setSelectedCountryISO(country.code);
                                        setIsCountryPopoverOpen(false);
                                      }}
                                      className="flex items-center gap-3 p-2.5 rounded-lg m-1 cursor-pointer transition-colors"
                                    >
                                      <span className="text-xl shrink-0">{country.flag}</span>
                                      <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-xs font-bold text-accent truncate uppercase tracking-tight">{country.name}</span>
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{country.dial_code}</span>
                                      </div>
                                      {selectedCountryISO === country.code && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <Input 
                          id="reg-phone" 
                          type="tel" 
                          placeholder="555-000-0000" 
                          required 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="bg-muted/20 flex-1 font-mono h-11 rounded-xl border-accent/10 font-bold text-accent"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" /> Professional Email
                      </Label>
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="NAME@COMPANY.COM" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-password" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                          <Lock className="h-3.5 w-3.5" /> Password
                        </Label>
                        <Input 
                          id="reg-password" 
                          type="password" 
                          placeholder="••••••••"
                          required 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-confirm" className="text-[10px] font-black uppercase tracking-widest text-accent/60 flex items-center gap-2">
                          <KeyRound className="h-3.5 w-3.5" /> Verify
                        </Label>
                        <Input 
                          id="reg-confirm" 
                          type="password" 
                          placeholder="••••••••"
                          required 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-11 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pb-8 pt-2">
                    <Button type="submit" className="w-full h-12 rounded-xl bg-accent text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-accent/20" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Establish Professional Identity"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent/40">
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span>Secure 256-bit AES Enterprise Tunnel</span>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground max-w-[300px] uppercase leading-relaxed opacity-60">
              By continuing, you agree to our Terms of Work and Privacy Protocol for high-performance data processing.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
