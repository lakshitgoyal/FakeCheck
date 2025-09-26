import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, CheckCircle, Search, ShieldCheck, Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Chrome Extension",
    description: "Real-time deepfake detection, directly in your browser with the FakeCheck Chrome Extension.",
};

const extensionImage = PlaceHolderImages.find(
  (img) => img.id === 'extension-mockup'
);

const howItWorksSteps = [
    {
        icon: <Search className="h-10 w-10 text-primary" />,
        title: "1. Right-Click Media",
        description: "While browsing, simply right-click on any image or video you want to verify."
    },
    {
        icon: <ShieldCheck className="h-10 w-10 text-primary" />,
        title: "2. Analyze with One Click",
        description: "Select 'Analyze with FakeCheck' from the menu. The media is securely sent to our AI for deep analysis."
    },
    {
        icon: <CheckCircle className="h-10 w-10 text-primary" />,
        title: "3. Get Instant Results",
        description: "A verdict (Safe, Suspicious, or Manipulated) appears in the extension popup. 'Safe' media gets a verified badge on the page."
    }
]

const features = [
    "One-click analysis via the context menu.",
    "Works with images, videos, and audio on major platforms.",
    "Displays confidence score & verdict instantly.",
    "Optional 'Verified' badge overlay for safe media.",
    "Secure API key handling.",
    "Lightweight and privacy-first design.",
];

const faqs = [
    {
        question: "Does it slow down my browsing?",
        answer: "No, the extension is extremely lightweight and optimized for performance. It only uses resources when you explicitly right-click and request an analysis."
    },
    {
        question: "Can I turn off the overlay badge?",
        answer: "Yes, you have full control. You can toggle the verified badge overlay on or off at any time from the extension's settings panel."
    },
    {
        question: "Does it work offline?",
        answer: "No, an internet connection is required. The analysis is performed by our powerful backend AI models, which cannot run locally in your browser."
    },
     {
        question: "Is my browsing data secure?",
        answer: "Absolutely. The extension only sends the URL of the specific media you choose to analyze. All communication with our API is encrypted, and we do not store your media after the analysis is complete."
    }
]

export default function ExtensionPage() {
    return (
        <div className="container mx-auto py-12 md:py-20">
            {/* Hero Section */}
            <section className="text-center mb-20">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    FakeCheck Chrome Extension
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Real-time deepfake detection, directly in your browser.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                     <Button asChild className="btn-gradient" size="lg">
                        <Link href="https://github.com/lakshitgoyal/FakeCheck-Chrome-Extension" target="_blank">Install from Chrome Web Store</Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                         <Link href="https://github.com/lakshitgoyal/FakeCheck-Chrome-Extension/archive/refs/heads/main.zip" target="_blank">Download Extension (ZIP) <Download className="ml-2" /></Link>
                    </Button>
                </div>
                 {extensionImage && (
                    <div className="mt-12 flex justify-center">
                        <Image
                            src={extensionImage.imageUrl}
                            alt={extensionImage.description}
                            data-ai-hint={extensionImage.imageHint}
                            width={800}
                            height={450}
                            className="rounded-lg shadow-2xl border border-border"
                        />
                    </div>
                )}
            </section>
            
            {/* How It Works Section */}
            <section className="mb-20">
                <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    {howItWorksSteps.map(step => (
                        <div key={step.title}>
                             <div className="flex justify-center mb-4">{step.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="mb-20">
                <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {features.map((feature, index) => (
                        <Card key={index} className="glassmorphism">
                            <CardContent className="p-6 flex items-center gap-4">
                                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                <p>{feature}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Security & Privacy */}
            <section className="mb-20 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Security & Privacy First</h2>
                 <p className="text-muted-foreground">
                    FakeCheck's Chrome Extension processes media securely and does not store or share your data. All analysis happens through encrypted requests to our servers, and your browsing activity remains private. Set your own API key for full control.
                </p>
            </section>

            {/* FAQ Section */}
            <section className="mb-20 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* Footer CTA */}
            <section className="text-center bg-card glassmorphism p-10 rounded-lg">
                 <h2 className="text-3xl font-bold mb-4">Bring deepfake detection into your browser.</h2>
                 <Button asChild className="btn-gradient" size="lg">
                    <Link href="https://github.com/lakshitgoyal/FakeCheck-Chrome-Extension" target="_blank">Get Extension Now <ArrowRight className="ml-2"/></Link>
                </Button>
            </section>

        </div>
    );
}
