"use client";

import { useState, useEffect } from "react";

/* ——— Platform Data (static until Supabase is connected) ——— */
const PLATFORMS = [
  { name: "Facebook", icon: "f", color: "#1877F2" },
  { name: "Instagram", icon: "📷", color: "#E4405F" },
  { name: "TikTok", icon: "♪", color: "#00F2EA" },
  { name: "Twitter / X", icon: "𝕏", color: "#FFFFFF" },
  { name: "YouTube", icon: "▶", color: "#FF0000" },
  { name: "WhatsApp", icon: "💬", color: "#25D366" },
  { name: "Telegram", icon: "✈", color: "#26A5E4" },
  { name: "LinkedIn", icon: "in", color: "#0A66C2" },
];

const STEPS = [
  {
    number: "01",
    title: "Enter Access Code",
    description: "Use your unique access code to unlock the recovery platform.",
    icon: "🔑",
  },
  {
    number: "02",
    title: "Select Platform",
    description: "Choose the social media platform you need to recover.",
    icon: "🎯",
  },
  {
    number: "03",
    title: "Identify Your Issue",
    description: "Pick the exact problem — blocked, hacked, lost auth, or more.",
    icon: "🔍",
  },
  {
    number: "04",
    title: "Follow the Solution",
    description: "Step-by-step guided recovery with templates and shortcuts.",
    icon: "✅",
  },
];

const FEATURES = [
  {
    title: "Expert-Guided Recovery",
    description: "Step-by-step solutions crafted by social media security professionals.",
    icon: "🛡️",
  },
  {
    title: "Multi-Platform Support",
    description: "Covers Facebook, Instagram, TikTok, YouTube, and more major platforms.",
    icon: "🌐",
  },
  {
    title: "Instant Access",
    description: "No waiting — get immediate access to recovery solutions with your code.",
    icon: "⚡",
  },
  {
    title: "Template & Shortcuts",
    description: "Pre-built appeal templates and direct links to save you hours of effort.",
    icon: "📋",
  },
  {
    title: "Video Tutorials",
    description: "Visual walkthroughs for complex recovery procedures.",
    icon: "🎬",
  },
  {
    title: "Secure & Private",
    description: "Your data stays private. We never ask for your passwords or credentials.",
    icon: "🔒",
  },
];

export default function Home() {
  const [accessCode, setAccessCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;
    setIsSubmitting(true);
    // TODO: Validate against Supabase access_codes table
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ——— Background Effects ——— */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-accent-green/[0.04] blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-accent-gold/[0.03] blur-[100px] pointer-events-none" />

      {/* ============================
          NAVIGATION
          ============================ */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-green/20 border border-accent-green/30 flex items-center justify-center">
              <span className="text-accent-green text-sm font-bold">M</span>
            </div>
            <span className="font-semibold text-text-primary tracking-tight">
              Mediea<span className="text-accent-green">Solution</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#platforms" className="text-sm text-text-secondary hover:text-accent-green transition-colors duration-200">
              Platforms
            </a>
            <a href="#how-it-works" className="text-sm text-text-secondary hover:text-accent-green transition-colors duration-200">
              How It Works
            </a>
            <a href="#features" className="text-sm text-text-secondary hover:text-accent-green transition-colors duration-200">
              Features
            </a>
            <a href="#access" className="btn-primary !py-2 !px-5 !text-sm">
              Get Access
            </a>
          </div>
          {/* Mobile menu button */}
          <button className="md:hidden text-text-secondary hover:text-accent-green transition-colors" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ============================
          HERO SECTION
          ============================ */}
      <section className="relative pt-32 pb-24 px-6">
        <div
          className={`max-w-7xl mx-auto text-center transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-green/20 bg-accent-green/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-glow" />
            <span className="text-xs font-medium text-accent-green tracking-wide uppercase">
              Professional Recovery Tool
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Recover Your
            <br />
            <span className="text-gradient-green">Social Media</span>
            <br />
            Accounts
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-text-secondary leading-relaxed mb-10">
            Expert-guided recovery solutions for{" "}
            <span className="text-accent-gold font-medium">blocked</span>,{" "}
            <span className="text-accent-gold font-medium">hacked</span>, and{" "}
            <span className="text-accent-gold font-medium">locked-out</span>{" "}
            social media accounts. Fast, secure, and professional.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#access" className="btn-primary text-base px-8 py-3.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Recovery
            </a>
            <a href="#how-it-works" className="btn-secondary text-base px-8 py-3.5">
              How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "8+", label: "Platforms" },
              { value: "50+", label: "Issue Types" },
              { value: "200+", label: "Solutions" },
              { value: "99%", label: "Success Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-accent-green">{stat.value}</div>
                <div className="text-sm text-text-tertiary mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          PLATFORMS SECTION
          ============================ */}
      <section id="platforms" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Supported <span className="text-gradient-green">Platforms</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              We cover all major social media platforms with specialized recovery solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {PLATFORMS.map((platform, index) => (
              <div
                key={platform.name}
                className="group card flex flex-col items-center gap-3 py-6 cursor-pointer hover:bg-bg-tertiary"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${platform.color}15`, border: `1px solid ${platform.color}30` }}
                >
                  <span style={{ color: platform.color }}>{platform.icon}</span>
                </div>
                <span className="text-sm font-medium text-text-primary group-hover:text-accent-green transition-colors">
                  {platform.name}
                </span>
                <span className="text-xs text-text-tertiary flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          HOW IT WORKS SECTION
          ============================ */}
      <section id="how-it-works" className="relative py-24 px-6 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="text-gradient-gold">Works</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Four simple steps to recover your social media account.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-accent-green/40 to-accent-gold/40" />
                )}
                <div className="card text-center relative">
                  {/* Step number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent-green text-text-inverse text-xs font-bold">
                    STEP {step.number}
                  </div>
                  <div className="text-4xl mb-4 mt-4">{step.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-text-primary">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          FEATURES SECTION
          ============================ */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient-mixed">Mediea Solution</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Built for professionals who need reliable, fast, and comprehensive account recovery.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card group hover:bg-bg-tertiary">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-text-primary group-hover:text-accent-green transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          ACCESS CODE SECTION
          ============================ */}
      <section id="access" className="relative py-24 px-6 bg-bg-secondary/50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-gold/20 bg-accent-gold/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
            <span className="text-xs font-medium text-accent-gold tracking-wide uppercase">
              Premium Access
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Enter Your <span className="text-gradient-gold">Access Code</span>
          </h2>
          <p className="text-text-secondary mb-10 max-w-md mx-auto">
            Use your unique access code to unlock the full recovery platform and start recovering your accounts immediately.
          </p>

          <form onSubmit={handleAccessCode} className="max-w-md mx-auto">
            <div className="relative mb-4">
              <input
                id="access-code-input"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="ENTER YOUR ACCESS CODE"
                className="input text-center tracking-[0.3em] font-mono text-lg py-4 pr-4 pl-4 uppercase"
                maxLength={20}
                autoComplete="off"
              />
              {accessCode.length > 0 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <span className="text-xs text-text-tertiary">{accessCode.length}/20</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!accessCode.trim() || isSubmitting}
              className="btn-gold w-full py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Validating...
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Unlock Access
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-text-tertiary mt-6">
            Don&apos;t have an access code?{" "}
            <a href="#" className="text-accent-green hover:underline">
              Contact our team
            </a>{" "}
            to get one.
          </p>
        </div>
      </section>

      {/* ============================
          FOOTER
          ============================ */}
      <footer className="border-t border-border-default bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent-green/20 border border-accent-green/30 flex items-center justify-center">
                  <span className="text-accent-green text-sm font-bold">M</span>
                </div>
                <span className="font-semibold text-text-primary">
                  Mediea<span className="text-accent-green">Solution</span>
                </span>
              </div>
              <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
                Professional social media account recovery tool. Expert-guided solutions for blocked, hacked, and locked-out accounts.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-4">Platform</h4>
              <ul className="space-y-2">
                {["Features", "Platforms", "Pricing", "FAQ"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-text-secondary hover:text-accent-green transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-4">Support</h4>
              <ul className="space-y-2">
                {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-text-secondary hover:text-accent-green transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-text-tertiary">
              © {new Date().getFullYear()} Mediea Solution. All rights reserved.
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs text-text-tertiary">Powered by</span>
              <span className="text-xs text-accent-green font-medium">Mediea Solution</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
