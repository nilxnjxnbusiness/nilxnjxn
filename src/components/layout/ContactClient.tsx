'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Mail01Icon,
  InstagramIcon,
  TwitterIcon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Image from 'next/image';

import { Magnetic } from '@/components/ui/Magnetic';
import { sendContactEmail } from '@/app/actions/contact';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactClient() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await sendContactEmail(data);
      if (response.success) {
        toast.success('Message sent. You\'ll hear back soon.', {
          className: 'font-functional text-xs font-bold tracking-widest uppercase',
        });
        reset();
      } else {
        toast.error('Failed to send message. Please try again.', {
          className: 'font-functional text-xs font-bold tracking-widest uppercase',
        });
      }
    } catch (err) {
      toast.error('An unexpected error occurred.', {
        className: 'font-functional text-xs font-bold tracking-widest uppercase',
      });
    }
  };

  return (
    <main className="bg-background selection:bg-accent relative min-h-screen overflow-hidden text-white selection:text-black">
      {/* SECTION 1: HERO */}
      <section className="relative flex h-[60vh] flex-col items-center justify-center px-6 text-center">
        {/* Background Texture/Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="from-background to-background absolute inset-0 bg-linear-to-b via-transparent" />
          <div className="bg-accent/5 absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground font-functional text-[10px] font-bold tracking-[0.6em] uppercase"
          >
            For bookings & collabs
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-expressive text-7xl leading-none tracking-tighter md:text-9xl"
          >
            Contact
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground font-functional mx-auto max-w-sm text-xs tracking-widest uppercase opacity-60"
          >
            Leave a trace in the shades.
          </motion.p>
        </div>

        {/* Grain Overlay */}
        <div
          className="animate-noise pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("/noise.png")' }}
        />
      </section>

      {/* SECTION 2: CONTACT FORM */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[24px] border border-white/10 bg-[#111111]/80 p-8 shadow-2xl backdrop-blur-2xl md:p-10"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-muted-foreground ml-1 text-[9px] font-bold tracking-widest uppercase">
                  Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Your Name"
                  className="font-functional focus:border-accent/40 w-full rounded-[12px] border border-white/10 bg-[#111111] px-5 py-3.5 text-xs text-white transition-all placeholder:text-white/10 focus:ring-4 focus:ring-white/5 focus:outline-none"
                />
                {errors.name && (
                  <p className="ml-1 text-[9px] font-medium tracking-wide text-red-500/80 uppercase">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-muted-foreground ml-1 text-[9px] font-bold tracking-widest uppercase">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Digital Address"
                  className="font-functional focus:border-accent/40 w-full rounded-[12px] border border-white/10 bg-[#111111] px-5 py-3.5 text-xs text-white transition-all placeholder:text-white/10 focus:ring-4 focus:ring-white/5 focus:outline-none"
                />
                {errors.email && (
                  <p className="ml-1 text-[9px] font-medium tracking-wide text-red-500/80 uppercase">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label className="text-muted-foreground ml-1 text-[9px] font-bold tracking-widest uppercase">
                  Message
                </label>
                <textarea
                  {...register('message')}
                  placeholder="What is the shade?"
                  rows={4}
                  className="font-functional focus:border-accent/40 w-full resize-none rounded-[12px] border border-white/10 bg-[#111111] px-5 py-3.5 text-xs text-white transition-all placeholder:text-white/10 focus:ring-4 focus:ring-white/5 focus:outline-none"
                />
                {errors.message && (
                  <p className="ml-1 text-[9px] font-medium tracking-wide text-red-500/80 uppercase">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Magnetic strength={0.1}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 focus:ring-accent/40 flex h-14 w-full items-center justify-center gap-3 rounded-[12px] px-8 text-[11px] font-bold tracking-[0.3em] text-black uppercase transition-all focus:ring-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Transmitting...'
                  ) : (
                    <>
                      Send Message
                      <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                    </>
                  )}
                </button>
              </Magnetic>
            </form>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: SOCIAL CONTACT OPTIONS */}
      <section className="pb-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.h4
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground font-functional mb-8 text-[10px] font-bold tracking-[0.4em] uppercase"
          >
            Or reach out directly
          </motion.h4>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              {
                name: 'Instagram',
                label: '@nilxnjxn',
                icon: InstagramIcon,
                href: 'https://instagram.com/nilxnjxn',
                color: '#E4405F',
              },
              {
                name: 'X',
                label: 'Realnilxnjxn',
                icon: TwitterIcon,
                href: 'https://x.com/Realnilxnjxn',
                color: '#FFFFFF',
              },
              {
                name: 'Email',
                label: 'hello' + '@' + 'nilxnjxn.com',
                icon: Mail01Icon,
                href: 'mailto:' + 'hello' + '@' + 'nilxnjxn.com',
                color: '#22D3EE',
                isEmail: true,
              },
            ].map((social) => (
              <Magnetic key={social.name} strength={0.2}>
                <a
                  href={social.href}
                  target={social.isEmail ? undefined : '_blank'}
                  rel={social.isEmail ? undefined : 'noopener noreferrer'}
                  className="hover:border-accent/30 group flex items-center gap-4 rounded-full border border-white/5 bg-white/5 px-6 py-4 transition-all hover:bg-white/10"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition-colors group-hover:bg-white group-hover:text-black"
                    style={{ '--brand-color': social.color } as React.CSSProperties}
                  >
                    <HugeiconsIcon icon={social.icon} size={18} />
                  </div>
                  <div className="text-left">
                    <span className="text-muted-foreground block text-[8px] font-bold tracking-widest uppercase">
                      {social.name}
                    </span>
                    <span className="font-functional block text-[10px] tracking-widest text-white">
                      {social.label}
                    </span>
                  </div>
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
      </section>

      {/* Global Grain */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.02] mix-blend-overlay">
        <Image src="/noise.png" alt="" fill className="h-full w-full object-cover" />
      </div>
    </main>
  );
}
