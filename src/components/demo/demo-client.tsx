"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, VideoIcon, FileAudio, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { performAnalysis } from '@/lib/actions';
import type { GenerateTamperReportOutput } from '@/ai/flows/generate-tamper-report';
import ResultsDisplay from './results-display';

type AnalysisResult = GenerateTamperReportOutput | { error: string };

export default function DemoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Add size validation if needed
      setFile(selectedFile);
      setResult(null); // Clear previous results
    }
  };

  const handleAnalysis = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select an image, video, or audio file to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const analysisResult = await performAnalysis(base64Data);
      
      if ('error' in analysisResult) {
        toast({
          title: 'Analysis Failed',
          description: analysisResult.error,
          variant: 'destructive',
        });
      } else {
        setResult(analysisResult);
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      toast({
        title: 'File Read Error',
        description: 'Could not read the selected file.',
        variant: 'destructive',
      });
      setIsLoading(false);
    };
  };

  const renderUploadForm = (accept: string, type: string) => (
    <div className="space-y-4">
      <Input type="file" accept={accept} onChange={handleFileChange} className="text-base" />
      {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
      <Button onClick={handleAnalysis} disabled={isLoading || !file} className="w-full btn-gradient">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          `Analyze ${type}`
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        {type === 'Image' ? 'PNG/JPEG up to 25MB.' : type === 'Video' ? 'MP4/MKV up to 200MB.' : 'MP3/WAV/FLAC up to 50MB.'}
      </p>
    </div>
  );

  return (
    <Card className="glassmorphism">
      <CardContent className="p-6">
        <Tabs defaultValue="image">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="image"><ImageIcon className="mr-2" />Image</TabsTrigger>
            <TabsTrigger value="video"><VideoIcon className="mr-2" />Video</TabsTrigger>
            <TabsTrigger value="audio"><FileAudio className="mr-2" />Audio</TabsTrigger>
          </TabsList>
          <TabsContent value="image" className="pt-4">
            {renderUploadForm("image/png, image/jpeg", "Image")}
          </TabsContent>
          <TabsContent value="video" className="pt-4">
            {renderUploadForm("video/mp4, video/mkv", "Video")}
          </TabsContent>
          <TabsContent value="audio" className="pt-4">
            {renderUploadForm("audio/mpeg, audio/wav, audio/flac", "Audio")}
          </TabsContent>
        </Tabs>

        {isLoading && (
            <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">Processing... this may take a few moments.</p>
                <p className="text-xs text-muted-foreground mt-1">File analysis → Artifact scoring → Report generation</p>
            </div>
        )}

        {result && !('error' in result) && file && (
            <div className="mt-6">
                <ResultsDisplay result={result} mediaFile={file} />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
