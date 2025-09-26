
'use server';

import { generateTamperReport, type GenerateTamperReportOutput } from '@/ai/flows/generate-tamper-heatmaps';

export async function performAnalysis(mediaDataUri: string): Promise<GenerateTamperReportOutput | { error: string }> {
  if (!mediaDataUri || typeof mediaDataUri !== 'string') {
    return { error: 'Invalid media data URI provided.' };
  }

  try {
    const result = await generateTamperReport({ mediaDataUri });
    return result;
  } catch (e) {
    console.error("Analysis failed:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `An error occurred during AI analysis: ${errorMessage}` };
  }
}
