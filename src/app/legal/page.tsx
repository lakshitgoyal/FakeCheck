import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Information",
  description: "Read FakeCheck's Terms of Service, Privacy Policy, and Acceptable Use Policy.",
};

export default function LegalPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Legal Information
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Important documents regarding your use of our services.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Terms of Service</h2>
            <p className="text-muted-foreground mb-4">
              Last updated: {new Date().toLocaleDateString()}. By accessing or using FakeCheck, you agree to be bound by these Terms of Service. These terms govern your access to and use of our website, APIs, and services.
            </p>
            <p className="text-muted-foreground">
              Please read the full document carefully. It includes important information about your legal rights and obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Privacy Policy</h2>
            <p className="text-muted-foreground mb-4">
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and share your information when you use FakeCheck. It also describes your rights regarding your personal data.
            </p>
            <p className="text-muted-foreground">
              We are committed to protecting your data and being transparent about our practices. Please review our full policy to understand how we handle your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Acceptable Use Policy</h2>
            <p className="text-muted-foreground mb-4">
              FakeCheck is a tool for promoting trust and integrity. You may not use our services for any illegal, harmful, or abusive activities. This includes, but is not limited to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Invading the privacy of others.</li>
              <li>Creating or assisting in the creation of deepfakes or manipulated media.</li>
              <li>Harassment, defamation, or spreading of disinformation.</li>
              <li>Attempting to reverse-engineer our models or platform.</li>
            </ul>
             <p className="text-muted-foreground mt-4">
              Violation of this policy may result in immediate suspension of your account.
            </p>
          </section>

           <section>
            <h2 className="text-2xl font-semibold border-b pb-2 mb-4">DMCA &amp; Incident Reporting</h2>
            <p className="text-muted-foreground">
              To report a copyright infringement or a security incident, please contact us at <a href="mailto:legal@fakecheck.app" className="text-primary hover:underline">legal@fakecheck.app</a>. Please provide detailed information regarding the incident so we can investigate promptly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
