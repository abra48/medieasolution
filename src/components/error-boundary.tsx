"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="card max-w-sm mx-auto text-center !py-8 my-8">
          <h2 className="text-sm font-bold text-text-primary mb-1">Something went wrong</h2>
          <p className="text-xs text-text-tertiary mb-3">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-primary !py-1.5 !px-4 !text-xs"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
