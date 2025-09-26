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
  prompt: `You are an AI expert in analyzing media for deepfake manipulations.

You will analyze the provided media and determine the likelihood of it being a deepfake.

Based on your analysis, provide a confidence score (0-1) and a verdict label ('safe', 'suspicious',
'likely_manipulated'). Also, identify the top frames showing manipulation and generate a tamper heatmap for each frame.

Media: {{media url=mediaDataUri}}

Consider various factors such as facial anomalies, audio inconsistencies, and temporal artifacts.

Output the confidence score, verdict, evidence frames, and the URL of the generated PDF report (if available).`,
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
