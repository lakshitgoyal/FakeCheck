import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Enterprise Trial",
  description: "Get in touch with the FakeCheck team or request a trial for our enterprise solution.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Request an Enterprise Trial
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Fill out the form below to get in touch with our sales team. Let&apos;s build a more trustworthy internet together.
          </p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Alex Johnson" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Your Company Inc." required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input id="email" type="email" placeholder="alex@yourcompany.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
             <Select>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineer">Engineer/Developer</SelectItem>
                <SelectItem value="product">Product Manager</SelectItem>
                <SelectItem value="security">Trust &amp; Safety / Security</SelectItem>
                <SelectItem value="journalist">Journalist/Researcher</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="use-case">Use Case</Label>
            <Textarea id="use-case" placeholder="Tell us how you plan to use FakeCheck (e.g., content moderation, news verification, etc.)" required />
          </div>
           <div className="space-y-2">
            <Label htmlFor="volume">Expected Volume (monthly analyses)</Label>
             <Select>
              <SelectTrigger id="volume">
                <SelectValue placeholder="Select expected volume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<10k">Under 10,000</SelectItem>
                <SelectItem value="10k-100k">10,000 - 100,000</SelectItem>
                <SelectItem value="100k-1m">100,000 - 1 Million</SelectItem>
                <SelectItem value="1m+">Over 1 Million</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the <a href="/legal" className="underline hover:text-primary">Terms of Service</a> and acknowledge the <a href="/legal" className="underline hover:text-primary">Privacy Policy</a>.
            </Label>
          </div>
          <Button type="submit" className="w-full btn-gradient" size="lg">
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  );
}
