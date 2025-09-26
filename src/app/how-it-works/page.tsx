import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Bot, FileText } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn about the three-step process to verify your content with FakeCheck's advanced AI analysis.",
};

const visual = PlaceHolderImages.find(
  (img) => img.id === 'how-it-works-visual'
);

const steps = [
  {
    icon: <UploadCloud className="h-10 w-10 text-primary" />,
    title: "Step 1: Upload or Stream",
    description: "Submit your content via our web interface or API. We support a wide range of image (PNG, JPEG) and video (MP4, MKV) formats. You can also stream live content using our webcam feature or via a direct RTMP feed for enterprise clients.",
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: "Step 2: AI Analysis",
    description: "Our ensemble of AI models gets to work. This includes face forensics, audio deepfake detection, temporal consistency checks, and artifact analysis. Each model scans for specific manipulation signatures, and their outputs are combined for a robust final verdict.",
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Step 3: Results & Evidence",
    description: "Receive a clear, actionable report. This includes an overall confidence score, a simple verdict (Safe, Suspicious, or Likely Manipulated), and detailed evidence such as tamper heatmaps, influenced frames, and audio spectrograms, all available via a downloadable report or a structured JSON payload.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Three Steps to Verify Content
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Our platform simplifies complex forensic analysis into a straightforward process.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:gap-12">
        {steps.map((step, index) => (
          <Card key={index} className="glassmorphism flex flex-col md:flex-row items-center overflow-hidden">
            <div className="p-8 flex-shrink-0">{step.icon}</div>
            <div className="p-8 pt-0 md:pt-8">
              <CardTitle className="mb-2 text-2xl">{step.title}</CardTitle>
              <CardContent className="p-0 text-muted-foreground">
                <p>{step.description}</p>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-20 text-center">
         <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Visualizing the Evidence
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          We provide intuitive visualizations like heatmaps and frame timelines to help you understand the analysis.
        </p>
         {visual && (
            <div className="mt-8 flex justify-center">
                <Image
                    src={visual.imageUrl}
                    alt={visual.description}
                    data-ai-hint={visual.imageHint}
                    width={800}
                    height={450}
                    className="rounded-lg shadow-2xl border border-border"
                />
            </div>
        )}
      </div>

    </div>
  );
}
