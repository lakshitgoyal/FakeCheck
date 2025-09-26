'use server';
/**
 * @fileOverview Analyzes media for deepfake manipulations and provides a confidence score.
 *
 * - analyzeMediaForDeepfakes - A function that analyzes media for deepfakes.
 * - AnalyzeMediaForDeepfakesInput - The input type for the analyzeMediaForDeepfakes function.
 * - AnalyzeMediaForDeepfakesOutput - The return type for the analyzeMediaForDeepfakes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMediaForDeepfakesInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A media file (image or video) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeMediaForDeepfakesInput = z.infer<typeof AnalyzeMediaForDeepfakesInputSchema>;

const AnalyzeMediaForDeepfakesOutputSchema = z.object({
  confidenceScore: z
    .number()
    .describe('The confidence score indicating the likelihood of deepfake manipulation (0-1).'),
  verdict: z
    .enum(['safe', 'suspicious', 'likely_manipulated'])
    .describe('Verdict label based on the confidence score.'),
  evidenceFrames: z.array(
    z.object({
      frameIndex: z.number().describe('The index of the evidence frame.'),
      score: z.number().describe('The score of the evidence frame.'),
      heatmap: z.string().optional().describe('URL of the tamper heatmap for the frame.'),
    })
  ).describe('Top frames showing manipulation.'),
  reportPdf: z.string().optional().describe('URL of the generated PDF report.'),
});
export type AnalyzeMediaForDeepfakesOutput = z.infer<typeof AnalyzeMediaForDeepfakesOutputSchema>;

export async function analyzeMediaForDeepfakes(
  input: AnalyzeMediaForDeepfakesInput
): Promise<AnalyzeMediaForDeepfakesOutput> {
  return analyzeMediaForDeepfakesFlow(input);
}

const analyzeMediaForDeepfakesPrompt = ai.definePrompt({
  name: 'analyzeMediaForDeepfakesPrompt',
  input: {schema: AnalyzeMediaForDeepfakesInputSchema},
  output: {schema: AnalyzeMediaForDeepfakesOutputSchema},
  prompt: `You are an AI forensic expert specializing in the detection of manipulated and synthetic media, 
including deepfakes, forged documents, and altered images of individuals.

You will receive a media file (image, video, audio, or document scan). 
Your task is to analyze it thoroughly for signs of tampering, manipulation, or synthetic generation.

## Required Analysis Dimensions:
1. **Face & Identity Checks (if people are present)**
   - Detect facial blending artifacts, unnatural skin textures, asymmetry, lip-sync mismatches, 
     and lighting inconsistencies.
   - Flag identity mismatches (face swaps, morphing, cloned identities).
   - Detect GAN-generated features (unnatural pupils, hair borders, duplicated textures).
   
2. **Document Authenticity Checks (if media is a document or contains text)**
   - Verify font consistency, spacing anomalies, digital cut/paste traces, 
     irregular compression, and background inconsistencies.
   - Detect signs of edited seals, signatures, watermarks, or official stamps.
   - Identify metadata mismatches (e.g., EXIF inconsistencies, creation timestamp anomalies).
   
3. **Audio & Temporal Checks (if video/audio is provided)**
   - Detect robotic intonations, unnatural pauses, spectral anomalies, 
     phase discontinuities, and cloned voice fingerprints.
   - In video, analyze frame-by-frame for flickering, jitter, temporal 
     misalignments, and compression-based artifacts.

4. **Global Forensic Signals**
   - Analyze pixel-level tampering via frequency-domain anomalies, noise distribution, and compression artifacts.
   - Compare against known forensic fingerprints (e.g., PRNU inconsistencies, double compression).
   - Generate tamper heatmaps for localized regions of concern.

## Output Specification (MUST FOLLOW STRICTLY):
Return a JSON object with the following fields:

{
  "confidence": <float between 0 and 1>,
  "verdict": "<safe | suspicious | likely_manipulated>",
  "evidence_frames": [
    {
      "frame_index": <integer>,
      "heatmap_url": "<string URL pointing to generated tamper heatmap>",
      "description": "<short explanation of anomaly in this frame>"
    },
    ...
  ],
  "document_anomalies": [
    {
      "region": "<page section or bounding box>",
      "description": "<type of anomaly detected>"
    }
  ],
  "audio_anomalies": [
    {
      "timestamp": "<HH:MM:SS>",
      "description": "<anomaly type (e.g., cloned voice, spectral discontinuity)>"
    }
  ],
  "report_url": "<string URL of generated PDF forensic report, if available>"
}

## Additional Requirements:
- Always output a verdict label.
- If no evidence frames or anomalies are found, return empty arrays.
- Reports must include:
  - Confidence score
  - Verdict
  - Top evidence frames with tamper heatmaps
  - Document anomaly descriptions (if applicable)
  - Audio anomaly descriptions (if applicable)
  - Metadata inconsistencies
  - Chain-of-custody note (time, request ID)

## Media Input
Media: {{media url=mediaDataUri}}`,
});

const analyzeMediaForDeepfakesFlow = ai.defineFlow(
  {
    name: 'analyzeMediaForDeepfakesFlow',
    inputSchema: AnalyzeMediaForDeepfakesInputSchema,
    outputSchema: AnalyzeMediaForDeepfakesOutputSchema,
  },
  async input => {
    const {output} = await analyzeMediaForDeepfakesPrompt(input);
    return output!;
  }
);
