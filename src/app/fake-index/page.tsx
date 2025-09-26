
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
    content_url: 'https://example.com/video1',
    platform: 'YouTube',
    status: 'Likely Manipulated',
    confidence_score: 95,
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: '2',
    content_url: 'https://example.com/image1',
    platform: 'Twitter',
    status: 'Suspicious',
    confidence_score: 78,
    timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
  },
  {
    id: '3',
    content_url: 'https://example.com/video2',
    platform: 'Facebook',
    status: 'Safe',
    confidence_score: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: '4',
    content_url: 'https://example.com/video3',
    platform: 'TikTok',
    status: 'Likely Manipulated',
    confidence_score: 91,
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

export default function FakeIndexPage() {
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
                <TableHead className="text-right">Confidence</TableHead>
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
                      className="text-primary hover:underline"
                    >
                      View Media
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(getVerdictStyles(alert.status))}>
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {alert.confidence_score}%
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
    </div>
  );
}
