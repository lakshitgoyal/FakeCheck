import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore the deep technical features of FakeCheck's deepfake detection platform.",
};

const featureList = [
    {
        title: "Frame-Level Tamper Localization",
        description: "Generates high-resolution heatmaps that pinpoint manipulated regions within each video frame or image, allowing for precise forensic analysis."
    },
    {
        title: "Face-Swap and Reenactment Detection",
        description: "Utilizes specialized models trained to identify anomalies consistent with facial swapping, replacement, and puppetry, even in high-quality deepfakes."
    },
    {
        title: "Audio Spoofing & Voice-Clone Detection",
        description: "Analyzes audio streams for signs of synthetic speech, voice cloning, and splicing, visualizing anomalies in a spectrogram."
    },
    {
        title: "Temporal & Compression Artifact Analysis",
        description: "Detects inconsistencies in video streams between frames and identifies unusual compression patterns that often indicate AI-generated or manipulated content."
    },
    {
        title: "Explainability Layer",
        description: "Goes beyond a simple score by providing saliency maps and feature importance data, showing what our AI focused on to reach its verdict."
    },
    {
        title: "Batch Processing and Bulk Reporting",
        description: "Upload and analyze thousands of files at once through our API or web interface, and generate a consolidated report for large-scale investigations."
    },
    {
        title: "Low-Latency Mode",
        description: "An optional API setting for real-time use cases like content moderation pipelines, providing a faster verdict with a slight trade-off in deep analysis."
    },
    {
        title: "Role-Based Access & Audit Logs",
        description: "Enterprise-grade user management allows for different permission levels (admin, analyst, viewer) and provides a complete audit trail of all platform activity."
    }
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Platform Features
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          A comprehensive suite of tools for robust content verification.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
            {featureList.map((feature, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            {feature.title}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground pl-8">
                        {feature.description}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
