"use client";

import { useActionState } from "react";
import { login, type AuthState } from "@/app/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    login,
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary relative">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-accent-green/[0.03] blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-green/20 border border-accent-green/30 flex items-center justify-center">
              <span className="text-accent-green text-lg font-bold">M</span>
            </div>
            <span className="text-xl font-semibold text-text-primary tracking-tight">
              Mediea<span className="text-accent-green">Solution</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-text-secondary">
            Sign in to access your recovery dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="card !p-8">
          <form action={action} className="space-y-5">
            {/* Error Message */}
            {state?.error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
                <svg
                  className="w-5 h-5 text-danger shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-danger">{state.error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="input"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-secondary mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="input"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing In...
                </span>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border-default" />
            <span className="text-xs text-text-tertiary uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-border-default" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-accent-green font-medium hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
