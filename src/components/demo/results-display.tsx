"use client";

import type { GenerateTamperReportOutput } from "@/ai/flows/generate-tamper-report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
  const mediaPreviewRef = useRef<HTMLImageElement | HTMLVideoElement | HTMLAudioElement>(null);
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
    if (!reportRef.current) return;
    setIsDownloading(true);

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;

    // Set background color
    pdf.setFillColor(24, 24, 27);
    pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');

    // Set text color
    pdf.setTextColor(255, 255, 255);

    // Title
    pdf.setFontSize(24);
    pdf.text("Analysis Report", pageWidth / 2, margin, { align: 'center' });

    // Verdict
    pdf.setFontSize(12);
    pdf.text("Verdict:", margin, margin + 30);
    pdf.setFontSize(16);
    pdf.text(result.verdict, margin + 65, margin + 30);

    let yPos = margin + 60;

    // Media Preview
    if (mediaPreviewRef.current && !(mediaPreviewRef.current instanceof HTMLAudioElement)) {
        pdf.setFontSize(14);
        pdf.text("Input Media Preview", margin, yPos);
        yPos += 20;

        try {
            const mediaElement = mediaPreviewRef.current;
            let canvas = document.createElement('canvas');
            if (mediaElement instanceof HTMLImageElement) {
                canvas.width = mediaElement.naturalWidth;
                canvas.height = mediaElement.naturalHeight;
                canvas.getContext('2d')?.drawImage(mediaElement, 0, 0);
            } else if (mediaElement instanceof HTMLVideoElement) {
                canvas.width = mediaElement.videoWidth;
                canvas.height = mediaElement.videoHeight;
                canvas.getContext('2d')?.drawImage(mediaElement, 0, 0, mediaElement.videoWidth, mediaElement.videoHeight);
            }
            
            const imgData = canvas.toDataURL('image/jpeg', 0.8);
            const aspectRatio = canvas.width / canvas.height;
            const imgWidth = contentWidth;
            const imgHeight = imgWidth / aspectRatio;

            if (yPos + imgHeight > pdf.internal.pageSize.getHeight() - margin) {
                pdf.addPage();
                yPos = margin;
            }

            pdf.addImage(imgData, 'JPEG', margin, yPos, imgWidth, imgHeight);
            yPos += imgHeight + 20;
        } catch (e) {
            console.error("Error adding media to PDF:", e);
             pdf.setTextColor(255, 100, 100);
             pdf.text("Could not render media preview.", margin, yPos);
             pdf.setTextColor(255, 255, 255);
             yPos += 20;
        }
    } else {
        pdf.setFontSize(12);
        pdf.text(`Input File: ${mediaFile.name}`, margin, yPos);
        yPos += 20;
    }


    // Report Content
    pdf.setFontSize(14);
    pdf.text("Evidence Report", margin, yPos);
    yPos += 20;

    pdf.setDrawColor(100, 100, 100);
    pdf.line(margin, yPos-5, pageWidth - margin, yPos-5);
    
    pdf.setFontSize(10);
    const reportText = result.report
      .replace(/### (.*?)\\n/g, '@@@$1\\n') // Mark headers
      .replace(/\\* (.*?)\\n/g, '  • $1\\n'); // Mark list items

    const lines = pdf.splitTextToSize(reportText, contentWidth);
    
    lines.forEach((line: string) => {
        if (yPos > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            pdf.setFillColor(24, 24, 27);
            pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
            pdf.setTextColor(255, 255, 255);
            yPos = margin;
        }
        
        if (line.startsWith('@@@')) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text(line.substring(3), margin, yPos);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
        } else {
            pdf.text(line, margin, yPos);
        }

        yPos += 12; // line height
    });
    

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
      <CardContent className="space-y-6">
        <div ref={reportRef} className="space-y-6">
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
                        ref={mediaPreviewRef as React.Ref<HTMLImageElement>}
                        src={mediaPreviewUrl}
                        alt="Input media preview"
                        width={400}
                        height={400}
                        className="rounded-lg w-full h-auto object-contain"
                        crossOrigin="anonymous"
                      />
                    ) : mediaFile.type.startsWith('video/') ? (
                      <video
                        ref={mediaPreviewRef as React.Ref<HTMLVideoElement>}
                        src={mediaPreviewUrl}
                        controls
                        className="rounded-lg w-full"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <audio
                        ref={mediaPreviewRef as React.Ref<HTMLAudioElement>}
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
        </div>
      </CardContent>
    </Card>
  );
}
