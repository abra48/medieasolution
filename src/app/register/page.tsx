"use client";

import { useActionState } from "react";
import { register, type AuthState } from "@/app/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    register,
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <img src="https://i.ibb.co.com/qY3R33DK/Gemini-Generated-Image-xmtysbxmtysbxmty.png" alt="Mediea Solution" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-base font-semibold text-text-primary">
              Mediea<span className="text-accent">Solution</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-text-primary mb-1">
            Create account
          </h1>
          <p className="text-sm text-text-tertiary">
            Get started with Mediea Solution
          </p>
        </div>

        {/* Form */}
        <div className="card !p-6">
          <form action={action} className="space-y-4">
            {state?.error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-danger/10 border border-danger/20">
                <svg className="w-4 h-4 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-danger">{state.error}</span>
              </div>
            )}

            {state?.message && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-accent/10 border border-accent/20">
                <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-accent">{state.message}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="input" />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input id="password" name="password" type="password" required autoComplete="new-password" placeholder="Minimum 8 characters" minLength={8} className="input" />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-text-secondary mb-1.5">
                Confirm Password
              </label>
              <input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" placeholder="Repeat password" minLength={8} className="input" />
            </div>

            <button type="submit" disabled={pending} className="btn-primary w-full py-2.5 text-sm disabled:opacity-50">
              {pending ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border-default" />
            <span className="text-xs text-text-tertiary">or</span>
            <div className="flex-1 h-px bg-border-default" />
          </div>

          <p className="text-center text-xs text-text-tertiary">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center mt-5">
          <Link href="/" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
