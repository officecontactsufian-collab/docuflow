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
  Zap,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate industrial transmission sequence
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsDone(true);
    toast({
      title: "Transmission Success",
      description: "Your inquiry has been staged for administrative review.",
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
            <h1 className="text-4xl font-black tracking-tighter text-accent uppercase italic">Contact Gateway</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest max-w-xl mx-auto">
              Direct Tunnel to Administration. Initialize a support sequence or request enterprise-grade integrations.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <div className="section-label">
                  <Globe className="h-3 w-3 text-primary" />
                  <span>Verified Identity Support</span>
                </div>
                <h2 className="text-3xl font-black text-accent uppercase italic tracking-tighter">Unified Protocol Tunnel.</h2>
                <p className="text-accent/60 font-bold leading-relaxed">
                  The DOCFLOW administrative tunnel is active 24/7. All inquiries, from technical debugging to 
                  enterprise volume licensing, are routed through our verified singular endpoint.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { label: "Primary Protocol", val: "office.contact.sufian@gmail.com", icon: Mail },
                  { label: "Security Registry", val: "office.contact.sufian@gmail.com", icon: ShieldCheck },
                  { label: "Administrative Gateway", val: "office.contact.sufian@gmail.com", icon: Zap },
                ].map((item) => (
                  <div key={item.label} className="p-6 bg-white rounded-3xl border border-accent/5 shadow-xl flex items-center gap-5 group hover:border-primary/20 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase text-accent/40 tracking-widest">{item.label}</p>
                      <p className="text-[10px] font-bold text-accent uppercase italic truncate max-w-[200px]">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-accent text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                 <div className="relative z-10 space-y-4">
                    <h4 className="text-xl font-black uppercase italic tracking-tighter">Direct Engagement</h4>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                      Our high-fidelity response protocol ensures that mission-critical inquiries are addressed with priority via our master endpoint.
                    </p>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              {!isDone ? (
                <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                  <CardHeader className="p-10 pb-4">
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-accent">Initialize Inquiry</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest italic">Encrypted Transmission Channel</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="p-10 pt-4 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Account Identity</Label>
                          <Input required placeholder="NAME / ENTITY..." className="h-12 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Communication Tunnel</Label>
                          <Input required type="email" placeholder="YOUR@EMAIL.PRO..." className="h-12 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Inquiry Classification</Label>
                        <Input required placeholder="TECHNICAL / PARTNERSHIP / SECURITY..." className="h-12 bg-muted/20 border-accent/10 rounded-xl font-bold text-accent" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-accent/60">Transmission Payload</Label>
                        <Textarea required placeholder="DETAILED INQUIRY STREAM..." className="min-h-[150px] bg-muted/20 border-accent/10 rounded-2xl font-bold text-accent resize-none" />
                      </div>
                      
                      <Button 
                        disabled={isSubmitting}
                        className="w-full h-16 rounded-2xl bg-accent text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-accent/20 hover:scale-[1.01] transition-transform"
                      >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Deploy Transmission Sequence
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
                      <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">Transmission Logged!</h2>
                      <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">Protocol successfully archived for review.</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsDone(false)} 
                      className="text-[10px] font-black uppercase tracking-widest text-accent/40"
                    >
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
