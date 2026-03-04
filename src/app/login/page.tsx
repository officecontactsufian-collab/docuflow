"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, useUser, initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn } from '@/firebase';
import { FileText, Loader2, ShieldCheck, Zap, User, Phone, Mail, Lock, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { countryCodes } from '@/lib/country-codes';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  // Registration fields
  const [fullName, setFullName] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('+1');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

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
    // Note: Standard Firebase initiateEmailSignUp only takes email/password.
    // In a full implementation, the additional profile data would be saved here.
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
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing Secure Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Enterprise Login</h1>
            <p className="text-muted-foreground">Access your professional document workspace.</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-border/60 shadow-xl">
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>Enter your professional credentials to access your account.</CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Address
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@company.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-muted/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Password
                      </Label>
                      <Input 
                        id="password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-muted/20"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full h-11 shadow-lg shadow-primary/20" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                    </Button>
                    <div className="relative w-full py-2">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                      <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white px-2 text-muted-foreground">Professional Access</span></div>
                    </div>
                    <Button type="button" variant="outline" className="w-full h-11 border-primary/20 hover:bg-primary/5" onClick={handleQuickStart} disabled={isLoading}>
                      <Zap className="mr-2 h-4 w-4 text-primary" /> Quick Start (Anonymous)
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-border/60 shadow-xl">
                <CardHeader>
                  <CardTitle>Register Account</CardTitle>
                  <CardDescription>Join DocuFlow for enterprise-grade document intelligence.</CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name" className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
                      </Label>
                      <Input 
                        id="reg-name" 
                        placeholder="Jane Doe" 
                        required 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-muted/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-phone" className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone Number
                      </Label>
                      <div className="flex gap-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-[110px] bg-muted/20 shrink-0">
                            <SelectValue placeholder="+1" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem key={`${country.code}-${country.dial_code}`} value={country.dial_code}>
                                <span className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span className="font-mono text-xs">{country.dial_code}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input 
                          id="reg-phone" 
                          type="tel" 
                          placeholder="555-000-0000" 
                          required 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="bg-muted/20 flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Professional Email
                      </Label>
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="name@company.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-muted/20"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-password" className="flex items-center gap-2">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Password
                        </Label>
                        <Input 
                          id="reg-password" 
                          type="password" 
                          placeholder="••••••••"
                          required 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-muted/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-confirm" className="flex items-center gap-2">
                          <KeyRound className="h-3.5 w-3.5 text-muted-foreground" /> Verification
                        </Label>
                        <Input 
                          id="reg-confirm" 
                          type="password" 
                          placeholder="••••••••"
                          required 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-muted/20"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full h-11 shadow-lg shadow-primary/20" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Professional Account"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3" />
              <span>Secure 256-bit AES Enterprise Authentication</span>
            </div>
            <p className="text-[10px] text-muted-foreground max-w-[280px]">
              By continuing, you agree to our Terms of Service and Privacy Policy for professional data processing.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
