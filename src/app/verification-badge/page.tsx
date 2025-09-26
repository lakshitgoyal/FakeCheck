import BadgeClient from '@/components/badge/badge-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verification Badge',
  description: 'Add a verification badge to your media if it passes our analysis.',
};

export default function VerificationBadgePage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Verification Badge
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Upload your media to generate a tamper-proof verification badge if it's deemed safe by our AI.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <BadgeClient />
      </div>
    </div>
  );
}
