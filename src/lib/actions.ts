
'use server';

import { generateTamperHeatmap, type GenerateTamperHeatmapOutput } from '@/ai/flows/generate-tamper-heatmaps';

export async function performAnalysis(mediaDataUri: string): Promise<GenerateTamperHeatmapOutput | { error: string }> {
  if (!mediaDataUri || typeof mediaDataUri !== 'string') {
    return { error: 'Invalid media data URI provided.' };
  }

  try {
    // In a real app, you would call the actual AI model.
    // The provided flow is a mock, so we use it directly.
    const result = await generateTamperHeatmap({ mediaDataUri });
    return result;
  } catch (e) {
    console.error("Analysis failed:", e);
    // In a real app, you'd have more robust error handling and logging.
    return { error: 'An error occurred during AI analysis. Please try again.' };
  }
}
