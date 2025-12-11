import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audexa AI - AI-Powered SOX Audit Validation Platform",
  description: "Automate SOX evidence validation with enterprise-grade AI. Up to 90% faster evidence review for internal audit teams, compliance officers, and external auditors.",
  keywords: "SOX audit, AI audit automation, evidence validation, compliance, internal audit, SOC2",
  metadataBase: new URL('https://www.audexaai.com'),
  openGraph: {
    title: "Audexa AI - AI-Powered SOX Audit Validation Platform",
    description: "Automate SOX evidence validation with enterprise-grade AI. Up to 90% faster evidence review.",
    url: 'https://www.audexaai.com',
    siteName: 'Audexa AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Audexa AI - AI-Powered SOX Audit Validation Platform",
    description: "Automate SOX evidence validation with enterprise-grade AI.",
  },
  alternates: {
    canonical: 'https://www.audexaai.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

