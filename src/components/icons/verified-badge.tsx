import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function VerifiedBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-white", props.className)}
      {...props}
    >
      <title>Verified Badge</title>
      <path
        d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
        fill="hsl(var(--primary) / 0.7)"
        stroke="hsl(var(--background))"
        strokeWidth="1"
      />
      <path
        d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
      />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
