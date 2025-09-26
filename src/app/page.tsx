import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileText,
  ImageIcon,
  Code,
  ShieldCheck,
  Award,
} from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <ImageIcon className="h-8 w-8 text-primary" />,
    title: 'Image & Video Detection',
    description:
      'Frame-level tamper maps, face-swap detection, artifact analysis.',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Explainable Results',
    description:
      'Confidence score, evidence frames, provenance hints you can trust.',
  },
  {
    icon: <Code className="h-8 w-8 text-primary" />,
    title: 'Integrate Anywhere',
    description: 'REST API, SDKs (Python, JS), Webhook & batch processing.',
  },
];

const heroImage = PlaceHolderImages.find(
  (img) => img.id === 'hero-animation-placeholder'
);

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl/none">
                  Detect Deepfakes with Confidence
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Fast, explainable AI that flags manipulated audio, images, and
                  video — with frame-level evidence and developer-friendly
                  APIs.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="btn-gradient">
                  <Link href="/sign-up">Get Started for Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={600}
                  height={400}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="glassmorphism">
                <CardHeader>
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="social-proof" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Trusted by Industry Leaders
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our technology is recognized for its accuracy and reliability in
              critical applications.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <Card className="glassmorphism p-6">
              <div className="flex items-center gap-4">
                <Award className="h-8 w-8 text-accent" />
                <p className="font-semibold">Used in National Trials</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Our models have been benchmarked and utilized in
                government-level forensic investigations.
              </p>
            </Card>
            <Card className="glassmorphism p-6">
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-8 w-8 text-accent" />
                <p className="font-semibold">ISO-Aligned Security</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                We adhere to strict security and data privacy protocols to protect
                your information.
              </p>
            </Card>
          </div>
          <div className="text-center mt-8">
            <p className="text-lg italic text-foreground">
              &quot;FakeCheck provided the clarity and evidence we needed to
              tackle disinformation campaigns head-on.&quot;
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              - Head of Trust &amp; Safety, Major Social Platform
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
