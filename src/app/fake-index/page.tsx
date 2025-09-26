
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Fake Index',
  description:
    'A real-time feed of potentially manipulated media detected across the web.',
};

// Mock data simulating Firestore collection
const mockAlerts = [
  {
    id: '1',
    content_url: 'https://twitter.com/verge/status/1791211791559844141',
    platform: 'X (Twitter)',
    status: 'Likely Manipulated',
    confidence_score: 95,
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '2',
    content_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'YouTube',
    status: 'Safe',
    confidence_score: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
  },
  {
    id: '3',
    content_url: 'https://www.instagram.com/p/C7Y8g7aP1x2/',
    platform: 'Instagram',
    status: 'Suspicious',
    confidence_score: 78,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '4',
    content_url: 'https://www.tiktok.com/@tiktok/video/7374635398284561694',
    platform: 'TikTok',
    status: 'Safe',
    confidence_score: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
  },
];

const getVerdictStyles = (verdict: string) => {
  switch (verdict) {
    case 'Safe':
      return 'bg-safe text-white';
    case 'Suspicious':
      return 'bg-suspicious text-black';
    case 'Likely Manipulated':
      return 'bg-manipulated text-white';
    default:
      return 'bg-secondary';
  }
};

const sampleAnalysis = {
  title: 'Analysis of X (Twitter) Post',
  url: 'https://twitter.com/verge/status/1791211791559844141',
  report: `### Overall Assessment
The media shows strong indicators of manipulation, consistent with AI-powered "deepfake" techniques.

### Key Indicators
*   Inconsistent lighting between the primary subject and the background.
*   Blurry or distorted edges around the subject's head and shoulders.
*   Unusual block-based compression artifacts detected in the background, particularly in low-texture areas.

### Detailed Analysis
The subject appears to be digitally inserted into the scene. The lighting on the subject's face (soft, diffused) does not match the harsh, direct sunlight seen in the environment. There are noticeable artifacts around the edges of the subject's hair and clothing, suggesting a sloppy composite. These are common signs of a deepfake or digital composite.

### Forensic Traces
Forensic analysis reveals a significant mismatch in the Photo Response Non-Uniformity (PRNU) pattern between the subject's face and the rest of the image. This strongly suggests that the facial region was sourced from a different camera than the one that captured the original image. Additionally, we noted inconsistencies in the JPEG quantization tables, indicating re-compression.`
};

export default function FakeIndexPage() {
  const reportHTML = sampleAnalysis.report
    .replace(/### (.*)/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/\* (.*)/g, '<li class="ml-4">$1</li>')
    .replace(/<\/h3>\n?<ul>/g, '</h3><ul class="list-disc list-inside text-muted-foreground">')
    .replace(/<\/ul>\n?<p>/g, '</ul><p class="text-muted-foreground">');

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Proactive Fake Index
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          A real-time feed of potentially manipulated media detected across popular
          platforms. This feed is for demonstration purposes.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Content URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Flagged</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.platform}</TableCell>
                    <TableCell>
                      <Link
                        href={alert.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate block max-w-[200px]"
                      >
                        {alert.content_url}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(getVerdictStyles(alert.status))}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {alert.timestamp.toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Sample Analysis: <Link href={sampleAnalysis.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">X (Twitter) Post</Link></CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert prose-sm max-w-none h-[400px] overflow-y-auto">
            <div dangerouslySetInnerHTML={{ __html: reportHTML }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
