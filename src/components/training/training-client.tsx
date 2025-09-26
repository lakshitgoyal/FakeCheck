"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, VideoIcon, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { performAnalysis } from '@/lib/actions';
import type { GenerateTamperReportOutput } from '@/ai/flows/generate-tamper-heatmaps';
import ResultsDisplay from '@/components/demo/results-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';

type AnalysisResult = (GenerateTamperReportOutput & { mediaDataUri?: string }) | { error: string };
type VerdictOption = 'Safe' | 'Suspicious' | 'Likely Manipulated';

export default function TrainingClient() {
  const [file, setFile] = useState<File | null>(null);
  const [userPrediction, setUserPrediction] = useState<VerdictOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null); // Reset previous results
      setMediaPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalysis = async () => {
    if (!file) {
      toast({ title: 'No file selected', description: 'Please select an image or video.', variant: 'destructive' });
      return;
    }
    if (!userPrediction) {
      toast({ title: 'No prediction made', description: 'Please predict a verdict before analyzing.', variant: 'destructive' });
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
        toast({ title: 'Analysis Failed', description: analysisResult.error, variant: 'destructive' });
        setResult(analysisResult);
      } else {
        setResult({ ...analysisResult, mediaDataUri: base64Data });
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setIsLoading(false);
      toast({ title: 'File Read Error', description: 'Could not read the selected file.', variant: 'destructive' });
    };
  };

  const handleReset = () => {
    setFile(null);
    setUserPrediction(null);
    setResult(null);
    setMediaPreviewUrl(null);
  };

  const currentMediaName = file?.name || 'media';
  const isCorrect = result && 'verdict' in result && userPrediction === result.verdict;

  if (result && 'verdict' in result && result.mediaDataUri) {
    return (
      <div>
        <Alert variant={isCorrect ? 'default' : 'destructive'} className={`mb-6 ${isCorrect ? 'border-safe bg-safe/10' : 'border-destructive bg-destructive/10'}`}>
          {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle className="text-lg">
            {isCorrect ? "You were correct!" : "You were incorrect."}
          </AlertTitle>
          <AlertDescription>
            You predicted <span className="font-semibold">{userPrediction}</span> and the AI verdict was <span className="font-semibold">{result.verdict}</span>.
          </AlertDescription>
        </Alert>
        
        <ResultsDisplay
          result={result}
          mediaUrl={result.mediaDataUri}
          mediaName={currentMediaName}
        />

        <div className="mt-6 flex justify-center">
            <Button onClick={handleReset} variant="outline" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Another
            </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="glassmorphism">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col items-center justify-center w-full space-y-4">
          <label htmlFor="media-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, MP4, WEBP, MKV</p>
            </div>
            <Input id="media-upload" type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
          </label>

          {mediaPreviewUrl && (
             <div className="w-full">
                <h3 className="font-semibold text-center mb-2">Preview</h3>
                {file?.type.startsWith('image/') ? (
                    <Image src={mediaPreviewUrl} alt="Preview" width={400} height={300} className="rounded-lg mx-auto object-contain max-h-[300px]" />
                ) : file?.type.startsWith('video/') ? (
                    <video src={mediaPreviewUrl} controls className="rounded-lg mx-auto w-full max-w-md"></video>
                ) : null}
            </div>
          )}

          <div className='w-full space-y-2'>
            <label className="text-sm font-medium">Your Prediction</label>
             <Select onValueChange={(value: VerdictOption) => setUserPrediction(value)} value={userPrediction || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Predict the verdict..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Safe">Safe</SelectItem>
                <SelectItem value="Suspicious">Suspicious</SelectItem>
                <SelectItem value="Likely Manipulated">Likely Manipulated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleAnalysis} disabled={isLoading || !file || !userPrediction} className="w-full btn-gradient" size="lg">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Analyze & Compare'}
          </Button>
        </div>
         {result && 'error' in result && (
            <div className="mt-4 p-4 bg-destructive/20 border border-destructive rounded-lg text-destructive-foreground text-center">
                <p className="font-bold">Analysis Failed</p>
                <p className="text-sm">{result.error}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
