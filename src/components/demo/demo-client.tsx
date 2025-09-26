
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, VideoIcon, LinkIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { performAnalysis, analyzeUrl } from '@/lib/actions';
import type { GenerateTamperReportOutput } from '@/ai/flows/generate-tamper-heatmaps';
import ResultsDisplay from './results-display';
import Image from 'next/image';

type AnalysisResult = (GenerateTamperReportOutput & { mediaDataUri?: string }) | { error: string };


export default function DemoClient() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUrl('');
      setResult(null);
      setMediaPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    setFile(null);
    setResult(null);
    setMediaPreviewUrl(null);
  };

  const handleFileAnalysis = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select an image or video file to analyze.',
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
        if (mediaPreviewUrl) { // Keep existing local object URL
          setResult({ ...analysisResult });
        }
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setIsLoading(false);
      toast({
        title: 'File Read Error',
        description: 'Could not read the selected file.',
        variant: 'destructive',
      });
    };
  };

  const handleUrlAnalysis = async () => {
    if (!url) {
      toast({
        title: 'No URL entered',
        description: 'Please enter a URL to analyze.',
        variant: 'destructive',
      });
      return;
    }
    // Basic URL validation
    try {
      new URL(url);
    } catch (_) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setMediaPreviewUrl(null);
    
    const analysisResult = await analyzeUrl(url);
    if ('error' in analysisResult) {
      toast({
        title: 'Analysis Failed',
        description: analysisResult.error,
        variant: 'destructive',
      });
    } else {
      setResult(analysisResult);
      setMediaPreviewUrl(analysisResult.mediaDataUri);
    }
    setIsLoading(false);
  };
  
  const currentMediaName = file?.name || url.substring(url.lastIndexOf('/') + 1) || 'media';
  const finalMediaUrl = file ? mediaPreviewUrl : (result && 'mediaDataUri' in result ? result.mediaDataUri : mediaPreviewUrl);

  if (result && !('error' in result) && finalMediaUrl) {
    return (
      <ResultsDisplay
        result={result as GenerateTamperReportOutput}
        mediaUrl={finalMediaUrl}
        mediaName={currentMediaName}
      />
    );
  }

  return (
    <Card className="glassmorphism">
      <CardContent className="p-6">
        <Tabs defaultValue="image">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="image"><ImageIcon className="mr-2" />Image</TabsTrigger>
            <TabsTrigger value="video"><VideoIcon className="mr-2" />Video</TabsTrigger>
            <TabsTrigger value="url"><LinkIcon className="mr-2" />URL</TabsTrigger>
          </TabsList>
          <TabsContent value="image" className="mt-6">
            <div className="flex flex-col items-center justify-center w-full space-y-4">
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WEBP</p>
                </div>
                <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
              <Button onClick={handleFileAnalysis} disabled={isLoading || !file} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Analyze Image'}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="video" className="mt-6">
             <div className="flex flex-col items-center justify-center w-full space-y-4">
              <label htmlFor="video-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <VideoIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-muted-foreground">MP4, MKV, WEBM</p>
                </div>
                <Input id="video-upload" type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
              </label>
              <Button onClick={handleFileAnalysis} disabled={isLoading || !file} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Analyze Video'}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="url" className="mt-6">
             <div className="flex flex-col items-center justify-center w-full space-y-4">
               <Input 
                 type="url" 
                 placeholder="https://example.com/media.mp4" 
                 value={url}
                 onChange={handleUrlChange}
                 className="w-full"
               />
              <Button onClick={handleUrlAnalysis} disabled={isLoading || !url} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Analyze URL'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        {mediaPreviewUrl && !result && (
          <div className="mt-4">
            <h3 className="font-semibold text-center mb-2">Preview</h3>
            {file?.type.startsWith('image/') ? (
              <Image src={mediaPreviewUrl} alt="Preview" width={400} height={300} className="rounded-lg mx-auto object-contain" />
            ) : file?.type.startsWith('video/') ? (
              <video src={mediaPreviewUrl} controls className="rounded-lg mx-auto w-full max-w-md"></video>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
