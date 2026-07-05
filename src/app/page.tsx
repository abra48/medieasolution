"use client";

import { useState } from "react";
import Link from "next/link";

const PLATFORMS = [
  { name: "Facebook", color: "#1877F2" },
  { name: "Instagram", color: "#E4405F" },
  { name: "TikTok", color: "#00F2EA" },
  { name: "Twitter / X", color: "#A0A0A0" },
  { name: "YouTube", color: "#FF0000" },
  { name: "WhatsApp", color: "#25D366" },
  { name: "Telegram", color: "#26A5E4" },
  { name: "LinkedIn", color: "#0A66C2" },
];

const STEPS = [
  {
    number: "01",
    title: "Enter Access Code",
    description: "Use your unique code to unlock the recovery platform.",
  },
  {
    number: "02",
    title: "Select Platform",
    description: "Choose which social media account needs recovery.",
  },
  {
    number: "03",
    title: "Identify the Issue",
    description: "Pick the specific problem — blocked, hacked, or locked.",
  },
  {
    number: "04",
    title: "Follow the Guide",
    description: "Step-by-step instructions with templates and direct links.",
  },
];

export default function Home() {
  const [accessCode, setAccessCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <div className="min-h-screen">
      {/* ——— Nav ——— */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <span className="text-accent text-xs font-semibold">M</span>
            </div>
            <span className="text-sm font-semibold text-text-primary tracking-tight">
              Mediea<span className="text-accent">Solution</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="hidden sm:block text-sm text-text-tertiary hover:text-text-secondary transition-colors">
              How It Works
            </a>
            <Link href="/login" className="text-sm text-text-tertiary hover:text-text-secondary transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="btn-primary !py-1.5 !px-4 !text-xs">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ——— Hero ——— */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-medium text-accent tracking-widest uppercase mb-6">
            Account Recovery Platform
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-text-primary mb-5">
            Recover your social media accounts
          </h1>

          <p className="max-w-xl mx-auto text-base text-text-secondary leading-relaxed mb-10">
            Step-by-step guided solutions for blocked, hacked, and locked-out
            accounts across all major platforms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <a href="#access" className="btn-primary px-6 py-2.5 text-sm">
              Start Recovery
            </a>
            <a href="#how-it-works" className="btn-secondary px-6 py-2.5 text-sm">
              How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 max-w-md mx-auto">
            {[
              { value: "8+", label: "Platforms" },
              { value: "50+", label: "Issues" },
              { value: "200+", label: "Solutions" },
              { value: "99%", label: "Success" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-xs text-text-tertiary mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Platforms ——— */}
      <section className="py-20 px-6 border-t border-border-default">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-medium text-text-tertiary tracking-widest uppercase mb-8 text-center">
            Supported Platforms
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLATFORMS.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border-default bg-bg-secondary hover:border-border-focus transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: platform.color }}
                />
                <span className="text-sm text-text-primary">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— How It Works ——— */}
      <section id="how-it-works" className="py-20 px-6 border-t border-border-default bg-bg-secondary/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              How it works
            </h2>
            <p className="text-sm text-text-secondary">
              Four steps to recover your account.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <div className="card">
                  <span className="text-xs font-mono text-accent mb-3 block">
                    {step.number}
                  </span>
                  <h3 className="text-sm font-semibold text-text-primary mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Features ——— */}
      <section className="py-20 px-6 border-t border-border-default">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Why Mediea Solution
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Expert-Guided", desc: "Solutions crafted by social media security professionals." },
              { title: "Multi-Platform", desc: "Covers Facebook, Instagram, TikTok, YouTube, and more." },
              { title: "Instant Access", desc: "No waiting — get immediate access with your code." },
              { title: "Templates Included", desc: "Pre-built appeal templates and direct links to save time." },
              { title: "Video Tutorials", desc: "Visual walkthroughs for complex recovery procedures." },
              { title: "Private & Secure", desc: "We never ask for your passwords or credentials." },
            ].map((feature) => (
              <div key={feature.title} className="card group">
                <h3 className="text-sm font-semibold text-text-primary mb-1.5 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-tertiary leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Access Code ——— */}
      <section id="access" className="py-20 px-6 border-t border-border-default bg-bg-secondary/40">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs font-medium text-secondary tracking-widest uppercase mb-4">
            Premium Access
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            Enter your access code
          </h2>
          <p className="text-sm text-text-secondary mb-8">
            Use your unique code to unlock the full recovery platform.
          </p>

          <form onSubmit={handleAccessCode} className="space-y-3">
            <input
              id="access-code-input"
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="ENTER YOUR CODE"
              className="input text-center tracking-[0.2em] font-mono py-3 uppercase"
              maxLength={20}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!accessCode.trim() || isSubmitting}
              className="btn-accent-secondary w-full py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Validating..." : "Unlock Access"}
            </button>
          </form>

          <p className="text-xs text-text-tertiary mt-6">
            Don&apos;t have a code?{" "}
            <a href="#" className="text-accent hover:underline">
              Contact us
            </a>{" "}
            to get one.
          </p>
        </div>
      </section>

      {/* ——— Footer ——— */}
      <footer className="border-t border-border-default">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
                <span className="text-accent text-[10px] font-semibold">M</span>
              </div>
              <span className="text-sm font-semibold text-text-primary">
                Mediea<span className="text-accent">Solution</span>
              </span>
            </div>
            <p className="text-xs text-text-tertiary">
              © {new Date().getFullYear()} Mediea Solution. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
