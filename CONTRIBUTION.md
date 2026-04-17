# NILXNJXN: Digital Presence Contribution Guide

This document serves as the architectural manifest and developmental history for the NILXNJXN artist platform. It outlines the core principles that govern the "Cinematic" experience

---

## 🎹 Project Context

NILXNJXN is a dual-surface, artist-first digital infrastructure designed to function as both a high-impact portfolio and a frictionless direct-to-fan distribution channel.

Unlike generic e-commerce sites, this system prioritizes **identity over features**. The architecture is split into two primary domains:

- **nilxnjxn.com** (Portfolio): Focused on immersion, discovery, and the narrative of the artist.
- **store.nilxnjxn.com** (Store): Optimized for high-conversion, secure lossless audio sales without the friction of a cart or account creation.

### Core Design Principles

1. **Instant Engagement**:
   - _Goal_: User must hear music within 2–3 seconds.
   - _Method_: We use audio preloading and "blur-up" lazy loading for images via a custom `LazyImage` component. This ensures the sensory experience starts before the full page is even finished loading.

2. **Zero Friction**:
   - _Goal_: No login, no cart, no extra clicks.
   - _Method_: The "Unlock" buttons trigger a direct Razorpay checkout flow. Success leads instantly to a time-limited secure download link.

3. **Cinematic Narrative**:
   - _Goal_: Every interaction should feel intentional and "heavy," like a film trailer.
   - _Method_: We use **GSAP** for physics-based inertial scrolling and **Framer Motion** for smooth SVG animations and state transitions.

4. **Premium Aesthetics**:
   - _Goal_: A state-of-the-art visual feel that wows the user.
   - _Method_: A dark dominant palette (#0A0A0A), glassmorphism, depth-based shadows, and a global grain/noise overlay that adds an analog texture to the digital surface.

---

## 🛠 Technical Stack for New Developers

If you are new to this codebase, here are the key technologies we use:

- **Next.js 15 (App Router)**: Our framework for routing and server-side rendering.
- **Tailwind CSS**: Our primary styling engine. Note: We use custom utility classes for "cinematic" effects.
- **GSAP (GreenSock)**: Used for complex animations, especially everything involving `ScrollTrigger` and physics (Magnetics, Curshors).
- **Zustand**: A lightweight state management library used for our `audioStore` ensuring music plays uninterrupted across page navigations.
- **Wavesurfer.js**: Used to generate and control the visual waveforms for each track.
- **Cloudflare R2**: High-performance, egress-free object storage used to host lossless audio files. Interacted with using S3 compatibility via the `@aws-sdk/client-s3` Node.js package.
- **Razorpay**: Our frictionless payment gateway. Integrated using the `razorpay` Node.js package for server-side order creation and the Standard Checkout script (`checkout.js`) on the frontend for in-context, frictionless payments.

---


## 🖊 Contribution Guidelines

To maintain the Coding standard:

- **Zero Horizontal Scroll**: Never allow an element to push past the screen width. Use `overflow-x-hidden`.
- **Custom Easing**: Never use default "ease-in-out." Always use `expo.out` or custom cubic-beziers for that "heavy" feel.
- **Performance First**: If adding an image, use `Next/Image` and our `LazyImage` wrapper. Always mark "above-the-fold" images with `priority`.
- **Infrastructure Targets**:
  - **TTFB**: Under 0.8s (Achieved via Static Site Generation & Edge Caching).
  - **LCP**: Under 2.5s (Achieved via Image Priority & Asset Compression).
  - **INP**: Under 200ms (Achieved via Deferred JS initialization & RequestAnimationFrame).
- **Audio Integrity**: The `audioStore` is sacred. Do not modify it without verifying it across the entire site.

**"LIVE FREE, BE YOU."**
