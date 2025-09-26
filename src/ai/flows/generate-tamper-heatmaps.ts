'use server';

/**
 * @fileOverview Generates tamper heatmaps using AI to highlight areas of potential manipulation in images and videos.
 *
 * - generateTamperReport - A function that handles the tamper report generation process.
 * - GenerateTamperReportInput - The input type for the generateTamperReport function.
 * - GenerateTamperReportOutput - The return type for the generateTamperReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTamperReportInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A media file (image or video) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateTamperReportInput = z.infer<typeof GenerateTamperReportInputSchema>;

const GenerateTamperReportOutputSchema = z.object({
  report: z
    .string()
    .describe(
      'A detailed markdown report of the analysis, including potential manipulations.'
    ),
  confidenceScore: z.number().describe('The confidence score of the manipulation detection.'),
  verdict: z.enum(['Safe', 'Suspicious', 'Likely Manipulated']).describe('Verdict label based on the confidence score'),
});
export type GenerateTamperReportOutput = z.infer<typeof GenerateTamperReportOutputSchema>;

export async function generateTamperReport(input: GenerateTamperReportInput): Promise<GenerateTamperReportOutput> {
  return generateTamperReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTamperReportPrompt',
  input: {schema: GenerateTamperReportInputSchema},
  output: {schema: GenerateTamperReportOutputSchema},
  prompt: `You are an AI-powered deepfake detection system. You will analyze the provided image or video and generate a detailed report in markdown format, highlighting areas of potential manipulation. You will also return a confidence score and a verdict label based on the analysis. Here is the media to analyze: {{media url=mediaDataUri}}.

Confidence Score Guidelines:
- High confidence (0.75 - 1.0): Likely Manipulated
- Medium confidence (0.4 - 0.74): Suspicious
- Low confidence (0.0 - 0.39): Safe

Your report should be structured with the following sections:
- **Overall Assessment**: A summary of your findings.
- **Key Indicators**: A bulleted list of specific findings (e.g., "Unnatural lighting on subject's face", "Inconsistencies in background details").
- **Detailed Analysis**: A more in-depth explanation of the indicators.`,
});

const generateTamperReportFlow = ai.defineFlow(
  {
    name: 'generateTamperReportFlow',
    inputSchema: GenerateTamperReportInputSchema,
    outputSchema: GenerateTamperReportOutputSchema,
  },
  async input => {
    // In a real app, you would call an AI model. For this demo, we'll use a mock.
    const mockConfidenceScore = Math.random();
    let mockVerdict: 'Safe' | 'Suspicious' | 'Likely Manipulated' = 'Safe';
    let mockReport = `### Overall Assessment
The provided media appears to be authentic.

### Key Indicators
*   Consistent lighting and shadows.
*   No obvious signs of digital alteration.
*   Normal background details.

### Detailed Analysis
A thorough review of the media file shows no significant signs of manipulation. The lighting is consistent across the entire frame, and there are no discernible artifacts that would suggest digital editing or AI generation.`;

    if (mockConfidenceScore > 0.75) {
      mockVerdict = 'Likely Manipulated';
      mockReport = `### Overall Assessment
The media shows strong indicators of manipulation.

### Key Indicators
*   Inconsistent lighting between the subject and background.
*   Blurry or distorted edges around the subject.
*   Unusual patterns detected in the background.

### Detailed Analysis
The subject appears to be digitally inserted. The lighting on the subject does not match the environment, and there are noticeable artifacts around the edges of the subject's hair and clothing. These are common signs of a deepfake or digital composite.`;
    } else if (mockConfidenceScore > 0.4) {
      mockVerdict = 'Suspicious';
      mockReport = `### Overall Assessment
The media contains some suspicious artifacts that warrant closer inspection.

### Key Indicators
*   Minor lighting inconsistencies.
*   Slightly unnatural texture on the subject's skin.

### Detailed Analysis
While not definitive, there are some subtle signs that could indicate manipulation. The skin texture appears overly smooth in some areas, which can be a byproduct of some AI generation techniques. Further analysis would be needed to confirm.`;
    }

    return {
      report: mockReport,
      confidenceScore: mockConfidenceScore,
      verdict: mockVerdict,
    };
  }
);
