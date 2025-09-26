import type { GenerateTamperReportOutput } from "@/ai/flows/generate-tamper-heatmaps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Download, Copy, Share2 } from "lucide-react";
import Image from 'next/image';

interface ResultsDisplayProps {
  result: GenerateTamperReportOutput;
  mediaFile: File;
}

export default function ResultsDisplay({ result, mediaFile }: ResultsDisplayProps) {
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

  const reportHTML = result.report
    .replace(/### (.*)/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/\* (.*)/g, '<li class="ml-4">$1</li>')
    .replace(/<\/h3>\n?<ul>/g, '</h3><ul class="list-disc list-inside text-muted-foreground">')
    .replace(/<\/ul>\n?<p>/g, '</ul><p class="text-muted-foreground">');

  const mediaPreviewUrl = URL.createObjectURL(mediaFile);

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
        
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-center">Input Media</h3>
            {mediaFile.type.startsWith('image/') ? (
              <Image
                src={mediaPreviewUrl}
                alt="Input media preview"
                width={400}
                height={400}
                className="rounded-lg w-full h-auto object-contain"
              />
            ) : (
              <video
                src={mediaPreviewUrl}
                controls
                className="rounded-lg w-full"
              />
            )}
          </div>
          <div>
              <h3 className="text-lg font-semibold mb-2 text-center">Evidence Report</h3>
              <Card>
                  <CardContent className="p-6 prose prose-invert prose-sm max-w-none h-64 overflow-y-auto">
                       <div dangerouslySetInnerHTML={{ __html: reportHTML }} />
                  </CardContent>
              </Card>
          </div>
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
