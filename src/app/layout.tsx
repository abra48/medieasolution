import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  title: "Mediea Solution — Social Media Account Recovery",
  description:
    "Recover blocked, hacked, and locked-out social media accounts with step-by-step guided solutions.",
  keywords: [
    "social media recovery",
    "account recovery",
    "Facebook recovery",
    "Instagram recovery",
    "TikTok recovery",
  ],
  authors: [{ name: "Mediea Solution" }],
  openGraph: {
    title: "Mediea Solution — Social Media Account Recovery",
    description:
      "Step-by-step guided recovery for blocked, hacked, and locked social media accounts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg-primary text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
