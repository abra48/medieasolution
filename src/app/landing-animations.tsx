"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Scroll-reveal: elements with [data-reveal] get `.revealed` class when in viewport
 */
export function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.revealDelay || "0", 10);
            setTimeout(() => {
              el.classList.add("revealed");
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/**
 * Text reveal: stagger each word in elements with [data-text-reveal]
 */
export function useTextReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-text-reveal]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("text-revealed");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/**
 * Parallax: elements with [data-parallax] move at a fraction of scroll speed
 */
export function useParallax() {
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll("[data-parallax]");
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const speed = parseFloat(htmlEl.dataset.parallax || "0.3");
        const offset = scrollY * speed;
        htmlEl.style.transform = `translateY(${offset}px)`;
      });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);
}

/**
 * Smooth scroll indicator (bouncing arrow)
 */
export function useScrollIndicator() {
  useEffect(() => {
    const indicator = document.querySelector("[data-scroll-indicator]");
    if (!indicator) return;

    const handleScroll = () => {
      if (window.scrollY > 100) {
        (indicator as HTMLElement).style.opacity = "0";
      } else {
        (indicator as HTMLElement).style.opacity = "1";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}

/**
 * Floating particles in the hero section
 */
export function useFloatingParticles() {
  useEffect(() => {
    const canvas = document.getElementById("particles-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    const PARTICLE_COUNT = 35;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Determine if dark mode
      const isDark = document.querySelector(".landing-dark") !== null;
      const dotColor = isDark ? "255,255,255" : "16,185,129";
      const lineColor = isDark ? "255,255,255" : "16,185,129";

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lineColor}, ${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);
}

/**
 * Nav background on scroll
 */
export function useNavScroll() {
  useEffect(() => {
    const nav = document.querySelector("[data-landing-nav]") as HTMLElement;
    if (!nav) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add("nav-scrolled");
      } else {
        nav.classList.remove("nav-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}

/**
 * Theme flash prevention — apply saved theme before paint
 */
export function useThemeInit() {
  useEffect(() => {
    const saved = localStorage.getItem("landing-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    document.querySelector(".landing")?.classList.toggle("landing-dark", isDark);
  }, []);
}

/**
 * Master component that initializes all landing page animations.
 */
export function LandingAnimations() {
  useScrollReveal();
  useTextReveal();
  useParallax();
  useScrollIndicator();
  useFloatingParticles();
  useNavScroll();
  useThemeInit();

  return null;
}
