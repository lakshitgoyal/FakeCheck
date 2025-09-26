"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "../icons/logo";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";

const navLinks = [
  { href: "/media-analysis", label: "Media Analysis", auth: true },
  { href: "/verification-badge", label: "Verification Badge", auth: true },
  { href: "/fake-index", label: "Fake Index", auth: true },
  { href: "/training", label: "Training", auth: true },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/extension", label: "Extension" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "Security" },
];

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const NavLink = ({ href, label, auth }: { href: string; label: string, auth?: boolean }) => {
    const finalHref = (auth && !isSignedIn) ? '/sign-up' : href;
    return (
      <Link
        href={finalHref}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === href ? "text-primary" : "text-muted-foreground"
        )}
      >
        {label}
      </Link>
    );
  };

  const MobileNavLink = ({ href, label, auth }: { href: string; label: string, auth?: boolean }) => {
    const finalHref = (auth && !isSignedIn) ? '/sign-up' : href;
    return (
      <Link
        href={finalHref}
        className={cn(
          "text-lg font-medium transition-colors hover:text-primary",
          pathname === href
            ? "text-primary"
            : "text-foreground"
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">FakeCheck</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <Logo className="h-6 w-6" />
                <span className="font-bold">FakeCheck</span>
              </Link>
              <div className="flex flex-col space-y-4 p-6">
                {navLinks.map((link) => (
                  <MobileNavLink key={link.href} {...link} />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <SignedOut>
            <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="btn-gradient">
                <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
