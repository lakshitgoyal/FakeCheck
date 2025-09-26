import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'FakeCheck — Deepfake Detection & Verification',
    template: '%s | FakeCheck',
  },
  description: 'FakeCheck: fast, explainable deepfake detection for images, audio, and video. Try the live demo or integrate with our REST API.',
  keywords: ['deepfake detection', 'deepfake detector', 'deepfake verification', 'image forensic', 'video forensics', 'fake news verification', 'content integrity'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={cn('min-h-screen font-body antialiased', inter.variable)}>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
