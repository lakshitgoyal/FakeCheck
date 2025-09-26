import type { GenerateTamperReportOutput } from "@/ai/flows/generate-tamper-heatmaps";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface ResultsDisplayProps {
  result: GenerateTamperReportOutput;
  mediaFile: File;
}

export default function ResultsDisplay({ result, mediaFile }: ResultsDisplayProps) {

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
        <div className="text-center">
          <h3 className="text-sm font-medium text-muted-foreground">Verdict</h3>
          <Badge className={cn("text-lg mt-1", getVerdictStyles(result.verdict))}>
            {result.verdict}
          </Badge>
        </div>

        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Input Media</h3>
            <div className="max-w-md mx-auto">
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
          </div>
          <div className="space-y-4 md:col-span-1">
              <h3 className="text-lg font-semibold text-center">Evidence Report</h3>
              <Card>
                  <CardContent className="p-6 prose prose-invert prose-sm max-w-none h-[500px] overflow-y-auto">
                       <div dangerouslySetInnerHTML={{ __html: reportHTML }} />
                  </CardContent>
              </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
