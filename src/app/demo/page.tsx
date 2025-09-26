import DemoClient from '@/components/demo/demo-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Demo',
  description: 'Try FakeCheck\'s deepfake detection live. Upload an image, video, or use your webcam to see our AI in action.',
};

export default function DemoPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Live Demo
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Upload an image, video, or use your webcam to test our AI. All uploads are deleted immediately after processing.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <DemoClient />
      </div>
    </div>
  );
}
