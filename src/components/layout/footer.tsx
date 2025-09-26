import Link from "next/link";
import { Logo } from "../icons/logo";

export default function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-start space-y-4 col-span-2 md:col-span-1">
          <div className="flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold">FakeCheck</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time, explainable deepfake detection for content integrity and
            trust.
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FakeCheck. All rights reserved.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/pricing" className="text-muted-foreground hover:text-primary">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/demo" className="text-muted-foreground hover:text-primary">
                Demo
              </Link>
            </li>
            <li>
              <Link href="/features" className="text-muted-foreground hover:text-primary">
                Features
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Developers</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/api-docs" className="text-muted-foreground hover:text-primary">
                API Docs
              </Link>
            </li>
            <li>
              <Link href="/security" className="text-muted-foreground hover:text-primary">
                Security
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Status
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </li>
             <li>
              <Link href="/legal" className="text-muted-foreground hover:text-primary">
                Legal
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
