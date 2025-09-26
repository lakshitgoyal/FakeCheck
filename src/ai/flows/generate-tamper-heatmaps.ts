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
  verdict: z.enum(['Safe', 'Suspicious', 'Likely Manipulated']).describe('Verdict label based on the analysis'),
});
export type GenerateTamperReportOutput = z.infer<typeof GenerateTamperReportOutputSchema>;

export async function generateTamperReport(input: GenerateTamperReportInput): Promise<GenerateTamperReportOutput> {
  return generateTamperReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTamperReportPrompt',
  input: {schema: GenerateTamperReportInputSchema},
  output: {schema: GenerateTamperReportOutputSchema},
  prompt: `You are an AI-powered forensic deepfake detection system.  
Your task is to analyze the provided image or video and generate a comprehensive forensic report in **Markdown format**, highlighting all potential indicators of manipulation.  
You must also assign a **verdict label** based on the findings.

Media to analyze: {{media url=mediaDataUri}}

---

## Verdict Guidelines
- **Likely Manipulated** → Clear, strong evidence of tampering or synthetic generation.  
- **Suspicious** → Noticeable anomalies that may indicate manipulation, but not conclusive.  
- **Safe** → No meaningful signs of manipulation detected.  

---

## Report Structure (must follow strictly)

### **Overall Assessment**
- Provide a concise summary of the findings in 2–3 sentences.
- Explicitly state the **verdict label** ("Safe", "Suspicious", or "Likely Manipulated").  
- Mention the confidence level (0–1, two decimal places).

### **Key Indicators**
- Bullet-point list of the most relevant anomalies.  
- Examples:  
  - "Unnatural lighting on subject’s face."  
  - "Mismatched lip-sync between audio and mouth movements."  
  - "Inconsistencies in font size and spacing within document header."  

### **Detailed Analysis**
- Expand on each indicator with technical reasoning.  
- Examples:  
  - *Lighting:* "Key light on subject appears from the left, but shadows fall rightward, suggesting compositing."  
  - *Compression:* "Noticeable blockiness in 8×8 macroblocks around the mouth indicates multiple rounds of JPEG compression."  
  - *Face Swap:* "Jawline shows blending artifacts and mismatched skin texture, consistent with GAN-based reenactment."  
- If no anomalies found, state: *“No inconsistencies observed beyond normal compression or sensor noise.”*

### **Forensic Traces**
- Low-level forensic evidence, where available:  
  - **Sensor Noise / PRNU:** Check for inconsistencies in Photo Response Non-Uniformity patterns.  
  - **CFA Pattern Anomalies:** Look for irregularities in color filter array interpolation.  
  - **Metadata & Encoding:** Mention discrepancies in EXIF data, inconsistent timestamps, or re-encoding traces.  
  - **Temporal Artifacts (for video):** Flicker, ghosting, or frame-to-frame inconsistencies.  
  - **Audio Anomalies (if applicable):** Spectral discontinuities, robotic harmonics, or cloned voice signatures.  

---

## Output Requirements
- Report **must** be in Markdown.  
- Use clear section headers and bullet points where specified.  
- Always include a **verdict label**.  
- Always include a **confidence score (0–1)**.  
- If no anomalies are found, explicitly state that no manipulation was detected.`,
});

const generateTamperReportFlow = ai.defineFlow(
  {
    name: 'generateTamperReportFlow',
    inputSchema: GenerateTamperReportInputSchema,
    outputSchema: GenerateTamperReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
