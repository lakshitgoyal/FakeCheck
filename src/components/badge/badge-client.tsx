'use client';

import { performAnalysis } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import type { GenerateTamperReportOutput } from '@/ai/flows/generate-tamper-heatmaps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, Download, ImageIcon, Loader2, VideoIcon } from 'lucide-react';
import { VerifiedBadge } from '@/components/icons/verified-badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type AnalysisResult = (GenerateTamperReportOutput & { mediaDataUri?: string }) | { error: string };

export default function BadgeClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setProgress(0);
      setMediaPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalysis = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select an image or video to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setProgress(30);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setProgress(60);
      const base64Data = reader.result as string;
      const analysisResult = await performAnalysis(base64Data);
      setProgress(100);

      if ('error' in analysisResult) {
        toast({
          title: 'Analysis Failed',
          description: analysisResult.error,
          variant: 'destructive',
        });
        setResult(analysisResult);
      } else {
        setResult({ ...analysisResult, mediaDataUri: base64Data });
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setIsLoading(false);
      setProgress(0);
      toast({
        title: 'File Read Error',
        description: 'Could not read the selected file.',
        variant: 'destructive',
      });
    };
  };

  const handleDownload = async () => {
    if (!mediaContainerRef.current) return;

    const canvas = await html2canvas(mediaContainerRef.current, {
        useCORS: true,
        backgroundColor: null,
    });
    
    const link = document.createElement('a');
    link.download = `verified_${file?.name || 'media.png'}`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  
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

  const renderMediaPreview = (isBadged = false) => {
    if (!mediaPreviewUrl) return null;
    const isImage = file?.type.startsWith('image/');
    const isVideo = file?.type.startsWith('video/');

    return (
      <div ref={mediaContainerRef} className="relative w-full max-w-lg mx-auto">
        {isImage ? (
          <img src={mediaPreviewUrl} alt="Media preview" className="rounded-lg w-full" />
        ) : isVideo ? (
          <video src={mediaPreviewUrl} controls className="rounded-lg w-full"></video>
        ) : null}
        {isBadged && (
          <div className="absolute bottom-4 right-4">
            <VerifiedBadge className="w-16 h-16" />
          </div>
        )}
      </div>
    );
  };
  
  const renderResult = () => {
    if (!result) return null;
    if ('error' in result) {
      return (
         <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      );
    }
    
    const isSafe = result.verdict === 'Safe';

    return (
        <Card className="mt-6 glassmorphism">
            <CardContent className="p-6 text-center space-y-4">
                 <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Verdict</h3>
                    <Badge className={cn("text-lg mt-1", getVerdictStyles(result.verdict))}>
                        {result.verdict}
                    </Badge>
                </div>

                {isSafe ? (
                    <div className='space-y-4'>
                        {renderMediaPreview(true)}
                        <Button onClick={handleDownload} disabled={isLoading}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Verified Media
                        </Button>
                    </div>
                ) : (
                    <Alert variant="destructive" className="text-left">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Media Flagged as Manipulated</AlertTitle>
                        <AlertDescription>
                            Our system has detected signs of manipulation. Please review carefully before using or sharing this file.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
  };

  return (
    <Card className="glassmorphism">
      <CardContent className="p-6 space-y-6">
        {!result && (
          <>
            <label
              htmlFor="media-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {file?.type.startsWith('video/') ? (
                    <VideoIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                ) : (
                    <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                )}
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">Image (PNG, JPG) or Video (MP4)</p>
              </div>
              <Input
                id="media-upload"
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,video/mp4"
                onChange={handleFileChange}
              />
            </label>
            {mediaPreviewUrl && (
                <div className="space-y-4">
                    {renderMediaPreview()}
                </div>
            )}
            {isLoading && <Progress value={progress} className="w-full" />}
            <Button onClick={handleAnalysis} disabled={isLoading || !file} className="w-full btn-gradient" size="lg">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Generate Badge'}
            </Button>
          </>
        )}
        {result && renderResult()}
      </CardContent>
    </Card>
  );
}