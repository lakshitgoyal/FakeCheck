import type { GenerateTamperHeatmapOutput } from "@/ai/flows/generate-tamper-heatmaps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Download, Copy, Share2 } from "lucide-react";
import Image from "next/image";

interface ResultsDisplayProps {
  result: GenerateTamperHeatmapOutput;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const confidencePercent = Math.round(result.confidenceScore * 100);

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case "Safe":
        return "bg-safe text-white";
      case "Suspicious":
        return "bg-suspicious text-black";
      case "Likely Manipulated":
        return "bg-manipulated text-white";
      default:
        return "bg-secondary";
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Verdict</h3>
            <Badge className={cn("text-lg mt-1", getVerdictStyles(result.verdict))}>
              {result.verdict}
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Confidence</h3>
            <p className="text-2xl font-bold">{confidencePercent}%</p>
            <Progress value={confidencePercent} className="mt-2 h-2" />
          </div>
        </div>

        <Separator />
        
        <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Evidence Panel</h3>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Tamper Map</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        This heatmap highlights areas with a higher probability of being manipulated. Brighter areas indicate stronger signals of tampering.
                    </p>
                    <div className="flex justify-center bg-black rounded-lg p-2">
                        <Image
                            src={result.heatmapDataUri}
                            alt="Tamper heatmap"
                            width={500}
                            height={300}
                            className="object-contain"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline"><Download className="mr-2" />Download Report (PDF)</Button>
            <Button variant="outline"><Copy className="mr-2" />Copy JSON</Button>
            <Button variant="outline"><Share2 className="mr-2" />Share Permalink</Button>
        </div>
      </CardContent>
    </Card>
  );
}
