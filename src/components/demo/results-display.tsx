"use client";

import type { GenerateTamperReportOutput } from "@/ai/flows/generate-tamper-heatmaps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import Image from 'next/image';
import { useRef, useState } from "react";

interface ResultsDisplayProps {
  result: GenerateTamperReportOutput;
  mediaFile: File;
}

export default function ResultsDisplay({ result, mediaFile }: ResultsDisplayProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
  
  const handleDownloadPdf = async () => {
    const reportElement = reportRef.current;
    if (!reportElement) return;

    setIsDownloading(true);

    const canvas = await html2canvas(reportElement, { 
      useCORS: true,
      backgroundColor: null // Use a transparent background
    });
    
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    // Theming for the PDF
    pdf.setFillColor(24, 24, 27); // Dark background similar to the card
    pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
    
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    
    pdf.save(`fakecheck-report-${new Date().toISOString()}.pdf`);

    setIsDownloading(false);
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
        <div className="flex justify-between items-center">
            <CardTitle className="text-center text-2xl flex-1">Analysis Results</CardTitle>
            <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={isDownloading}>
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Button>
        </div>
      </CardHeader>
      <CardContent ref={reportRef} className="space-y-6">
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-center flex-1">Evidence Report</h3>
              </div>
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
