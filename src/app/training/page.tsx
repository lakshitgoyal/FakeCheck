import TrainingClient from '@/components/training/training-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detection Training',
  description: 'Hone your deepfake detection skills. Analyze media and test your verdict against our AI.',
};

export default function TrainingPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Detection Training
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Test your skills. Upload media, predict the verdict, and see how you stack up against our AI analysis.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <TrainingClient />
      </div>
    </div>
  );
}
