import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ShieldCheck, DatabaseZap, FileKey } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Privacy",
  description: "Learn about FakeCheck's commitment to data security, privacy, and compliance. Your trust is our priority.",
};

const securityPoints = [
  {
    icon: <Lock className="h-8 w-8 text-primary" />,
    title: "Encryption in Transit and at Rest",
    description: "All data uploaded to FakeCheck is encrypted using industry-standard TLS 1.3 while in transit. Once stored for processing, your files are encrypted at rest using AES-256.",
  },
  {
    icon: <DatabaseZap className="h-8 w-8 text-primary" />,
    title: "Data Retention & Deletion Policy",
    description: "By default, all uploaded media and generated reports for demo users are permanently deleted after 24 hours. Enterprise customers can configure custom retention policies, including immediate deletion after processing. You can request deletion of your data at any time.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Compliance & Data Handling",
    description: "We are GDPR-friendly in our data handling practices. We never share your data with third parties for marketing or training purposes. Note: Our platform is not intended for processing Protected Health Information (PHI) and is not HIPAA compliant.",
  },
  {
    icon: <FileKey className="h-8 w-8 text-primary" />,
    title: "Authentication & Access Control",
    description: "API access is secured via unique, revocable API keys. Enterprise plans include options for OAuth 2.0 integration and fine-grained Role-Based Access Control (RBAC) to ensure users only have access to the data and features they need.",
  },
];

export default function SecurityPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Security & Privacy by Design
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          We are committed to the highest standards of data protection and transparency.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        {securityPoints.map((point) => (
          <Card key={point.title} className="glassmorphism">
            <CardHeader className="flex flex-row items-center gap-4">
              {point.icon}
              <CardTitle>{point.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{point.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
