"use client"

import * as React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Copy, 
  Check, 
  Twitter, 
  Facebook, 
  MessageCircle, 
  Share2,
  Globe,
  ShieldAlert
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ShareDialogProps {
  url?: string;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
}

/**
 * @fileOverview DOCFLOW Industrial Share Dialog
 * Provides a unified transmission gate for viral distribution.
 * Supports dynamic URL capture and professional social anchors.
 */
export function ShareDialog({ url, title = "Transmission Gate", description = "Viral Distribution Channel v2.5", trigger }: ShareDialogProps) {
  const [currentUrl, setCurrentUrl] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(url || window.location.href);
    }
  }, [url]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast({ title: "Copied to Buffer", description: "Manifest endpoint shifted to local clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ variant: "destructive", title: "Protocol Error", description: "Failed to access clipboard buffer." });
    }
  };

  const shareLinks = [
    { 
      name: 'X (Twitter)', 
      icon: Twitter, 
      color: "bg-[#1DA1F2]", 
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}` 
    },
    { 
      name: 'Facebook', 
      icon: Facebook, 
      color: "bg-[#4267B2]", 
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}` 
    },
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: "bg-[#25D366]", 
      href: `https://wa.me/?text=${encodeURIComponent(currentUrl)}` 
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 rounded-lg gap-2 text-[10px] font-black uppercase tracking-widest border border-accent/5 hover:bg-primary/5 transition-all">
            <Share2 className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Share Protocol</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-[2.5rem] p-10 max-w-md border-none shadow-2xl overflow-hidden bg-white">
        <DialogHeader className="space-y-3 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-2 mx-auto">
            <Globe className="h-7 w-7" />
          </div>
          <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-accent leading-none">
            Transmission <br/><span className="not-italic text-primary">Gate.</span>
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.3em] italic text-accent/30">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-10 pt-8">
          <div className="flex flex-col items-center gap-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-accent/40">Authorized Networks</p>
            <div className="flex gap-5">
              {shareLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(
                    "h-14 w-14 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all",
                    social.color
                  )}
                  title={`Share on ${social.name}`}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="text-[9px] font-black uppercase tracking-widest text-accent/40 px-1">Manifest Endpoint</Label>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl border border-accent/5 group focus-within:border-primary/40 transition-all">
              <input 
                readOnly 
                value={currentUrl} 
                className="flex-1 bg-transparent text-[11px] font-bold text-accent px-2 outline-none truncate" 
              />
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={copyToClipboard}
                className="h-10 w-10 rounded-xl hover:bg-primary/10 text-primary shrink-0 transition-transform active:scale-90"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-start gap-4">
            <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-accent uppercase italic">Privacy Sync Note</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed tracking-tight">
                Shared links expose the manifest registry endpoint. Original document binary streams remain locally encrypted within your hardware's memory buffer.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
