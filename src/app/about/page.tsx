import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Metadata } from "next";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the mission, team, and vision behind FakeCheck.",
};

const teamMembers = [
  { name: "Alex Johnson", role: "Founder & CEO" },
  { name: "Dr. Evelyn Reed", role: "Head of AI Research" },
  { name: "Ben Carter", role: "Lead Platform Engineer" },
  { name: "Olivia Chen", role: "Product & Design Lead" },
];

const teamImage = PlaceHolderImages.find((img) => img.id === 'about-team');

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Our Mission
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-2xl text-muted-foreground leading-snug">
          To restore trust in visual and audio content by providing accessible, transparent, and powerful verification tools.
        </p>
      </div>

      {teamImage && (
        <div className="mb-16">
          <Image
            src={teamImage.imageUrl}
            alt={teamImage.description}
            data-ai-hint={teamImage.imageHint}
            width={1200}
            height={600}
            className="rounded-lg aspect-[2/1] object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Meet the Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {teamMembers.map((member, index) => (
            <div key={member.name} className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${member.name}`} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

       <div className="max-w-4xl mx-auto mt-20 text-center">
        <h2 className="text-3xl font-bold text-center mb-6">Our Research</h2>
        <p className="text-muted-foreground text-lg mb-6">
            We stand on the shoulders of giants and contribute back to the academic community. Our work is built upon and contributes to the fields of computer vision, machine learning, and digital forensics.
        </p>
        <div className="flex justify-center gap-4">
            <a href="#" className="text-primary hover:underline">Whitepapers</a>
            <span className="text-muted-foreground">·</span>
            <a href="#" className="text-primary hover:underline">Public Benchmarks</a>
            <span className="text-muted-foreground">·</span>
            <a href="#" className="text-primary hover:underline">Published Papers</a>
        </div>
      </div>

    </div>
  );
}
