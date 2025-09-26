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
- **Detailed Analysis**: A more in-depth explanation of the indicators, including technical details. For example, if you find lighting inconsistencies, explain *why* they are inconsistent (e.g., "The key light on the subject is coming from the left, while shadows in the background indicate a light source from the right."). If you see compression artifacts, mention the type (e.g., "Noticeable blockiness in the 8x8 pixel grid around the subject's mouth, suggesting re-compression.").
- **Forensic Traces**: Discuss any low-level signs of manipulation, such as sensor noise inconsistencies, color filter array (CFA) pattern anomalies, or Photo Response Non-Uniformity (PRNU) mismatches. Be specific where possible.`,
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
The provided media appears to be authentic. No significant indicators of manipulation were detected.

### Key Indicators
*   Consistent lighting and shadows across all subjects and background elements.
*   No obvious signs of digital alteration, such as smudging, cloning, or warping.
*   Background details are sharp and consistent with the overall scene.

### Detailed Analysis
A thorough review of the media file shows no significant signs of manipulation. The lighting is consistent across the entire frame, and there are no discernible artifacts that would suggest digital editing or AI generation. The shadows cast by objects align with a single, consistent light source.

### Forensic Traces
Our low-level analysis did not reveal any anomalies. The camera sensor noise pattern is uniform throughout the image, and the Color Filter Array (CFA) interpolation patterns are consistent with a single capture device. No PRNU mismatches were found.`;

    if (mockConfidenceScore > 0.75) {
      mockVerdict = 'Likely Manipulated';
      mockReport = `### Overall Assessment
The media shows strong indicators of manipulation, consistent with AI-powered "deepfake" techniques.

### Key Indicators
*   Inconsistent lighting between the primary subject and the background.
*   Blurry or distorted edges around the subject's head and shoulders.
*   Unusual block-based compression artifacts detected in the background, particularly in low-texture areas.

### Detailed Analysis
The subject appears to be digitally inserted into the scene. The lighting on the subject's face (soft, diffused) does not match the harsh, direct sunlight seen in the environment. There are noticeable artifacts around the edges of the subject's hair and clothing, suggesting a sloppy composite. These are common signs of a deepfake or digital composite.

### Forensic Traces
Forensic analysis reveals a significant mismatch in the Photo Response Non-Uniformity (PRNU) pattern between the subject's face and the rest of the image. This strongly suggests that the facial region was sourced from a different camera than the one that captured the original image. Additionally, we noted inconsistencies in the JPEG quantization tables, indicating re-compression.`;
    } else if (mockConfidenceScore > 0.4) {
      mockVerdict = 'Suspicious';
      mockReport = `### Overall Assessment
The media contains some suspicious artifacts that warrant closer inspection, but we cannot definitively conclude it has been manipulated.

### Key Indicators
*   Minor lighting inconsistencies near the subject's jawline.
*   Slightly unnatural texture on the subject's skin, appearing overly smooth.
*   Some edge pixels around the hair appear sharper than in other parts of the image.

### Detailed Analysis
While not definitive, there are some subtle signs that could indicate manipulation. The skin texture appears overly smooth in some areas, which can be a byproduct of some AI-based facial enhancement or generation techniques. The lighting difference is minor but deviates from what would be expected given the single light source.

### Forensic Traces
Our tools detected a minor anomaly in the Color Filter Array (CFA) pattern in a small region on the subject's cheek, which could be an artifact of resampling or splicing. However, the evidence is not strong enough to make a high-confidence determination. Further analysis would be needed to confirm.`;
    }

    return {
      report: mockReport,
      confidenceScore: mockConfidenceScore,
      verdict: mockVerdict,
    };
  }
);
