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
    } catch {
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
            className="text-muted-foreground font-functional mb-10 text-[10px] font-bold tracking-[0.6em] uppercase"
          >
            For bookings & collabs
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-expressive text-lg leading-none tracking-normal md:text-2xl lg:text-[2.5rem]"
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

      {/* SECTION 2: CONTACT & SOCIAL */}
      <section className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-20 lg:flex-row lg:justify-between lg:gap-32">

            {/* Form Container - Far Left */}
            <div className="w-full max-w-xl">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                  {/* Name Field */}
                  <div className="group space-y-4">
                    <label className="text-muted-foreground ml-1 text-xs font-bold tracking-[0.3em] uppercase transition-colors group-focus-within:text-accent">
                      Name
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="Your Name"
                      className="font-functional focus:border-accent w-full border-b border-white/10 bg-transparent py-4 text-base text-white transition-all placeholder:text-white/5 focus:ring-0 focus:outline-none"
                    />
                    {errors.name && (
                      <p className="ml-1 text-[10px] font-medium tracking-wide text-red-500/80 uppercase">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="group space-y-4">
                    <label className="text-muted-foreground ml-1 text-xs font-bold tracking-[0.3em] uppercase transition-colors group-focus-within:text-accent">
                      Email
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Digital Address"
                      className="font-functional focus:border-accent w-full border-b border-white/10 bg-transparent py-4 text-base text-white transition-all placeholder:text-white/5 focus:ring-0 focus:outline-none"
                    />
                    {errors.email && (
                      <p className="ml-1 text-[10px] font-medium tracking-wide text-red-500/80 uppercase">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="group space-y-4">
                    <label className="text-muted-foreground ml-1 text-xs font-bold tracking-[0.3em] uppercase transition-colors group-focus-within:text-accent">
                      Message
                    </label>
                    <textarea
                      {...register('message')}
                      placeholder="What is the shade?"
                      rows={4}
                      className="font-functional focus:border-accent min-h-[120px] w-full resize-none border-b border-white/10 bg-transparent py-4 text-base text-white transition-all placeholder:text-white/5 focus:ring-0 focus:outline-none"
                    />
                    {errors.message && (
                      <p className="ml-1 text-[10px] font-medium tracking-wide text-red-500/80 uppercase">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Magnetic strength={0.1}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-accent hover:bg-accent/90 focus:ring-accent/40 flex h-16 w-full items-center justify-center gap-4 rounded-[12px] px-10 text-sm font-bold tracking-[0.4em] text-black uppercase transition-all focus:ring-4 disabled:opacity-50 md:w-auto"
                      >
                        {isSubmitting ? (
                          'Transmitting...'
                        ) : (
                          <>
                            Send Message
                            <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Social Contact - Right of the form */}
            <div className="w-full space-y-12 lg:w-auto lg:min-w-[360px]">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-10"
              >
                <div className="flex flex-col gap-6">
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
                      label: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
                      icon: Mail01Icon,
                      href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
                      color: '#22D3EE',
                      isEmail: true,
                    },
                  ].map((social) => (
                    <Magnetic key={social.name} strength={0.1}>
                      <a
                        href={social.href}
                        target={social.isEmail ? undefined : '_blank'}
                        rel={social.isEmail ? undefined : 'noopener noreferrer'}
                        className="group flex items-center gap-6 py-2 transition-all"
                      >
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-black"
                        >
                          <HugeiconsIcon icon={social.icon} size={20} />
                        </div>
                        <div className="text-left">
                          <span className="text-muted-foreground block text-[10px] font-bold tracking-widest uppercase opacity-60">
                            {social.name}
                          </span>
                          <span className="font-functional block text-sm tracking-widest text-white underline-offset-8 transition-all group-hover:text-accent group-hover:underline">
                            {social.label}
                          </span>
                        </div>
                      </a>
                    </Magnetic>
                  ))}
                </div>
              </motion.div>
            </div>
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
