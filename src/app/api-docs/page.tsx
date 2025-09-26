import { CodeBlock } from "@/components/ui/code-block";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API & Docs",
  description: "Integrate FakeCheck's deepfake detection with our developer-friendly REST API. Get started with code snippets for cURL, Python, and JavaScript.",
};

const curlSnippet = `curl -X POST \\
  https://api.fakecheck.app/api/v1/verify \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -F "file=@/path/to/your/media.mp4" \\
  -F "callback_url=https://your-app.com/webhook"`;

const pythonSnippet = `import requests

api_key = "YOUR_API_KEY"
file_path = "/path/to/your/media.mp4"

with open(file_path, "rb") as f:
    response = requests.post(
        "https://api.fakecheck.app/api/v1/verify",
        headers={"Authorization": f"Bearer {api_key}"},
        files={"file": f},
        data={"callback_url": "https://your-app.com/webhook"}
    )
    print(response.json())
`;

const jsSnippet = `const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

const apiKey = 'YOUR_API_KEY';
const filePath = '/path/to/your/media.mp4';

const form = new FormData();
form.append('file', fs.createReadStream(filePath));
form.append('callback_url', 'https://your-app.com/webhook');

fetch('https://api.fakecheck.app/api/v1/verify', {
    method: 'POST',
    headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        ...form.getHeaders()
    },
    body: form
})
.then(res => res.json())
.then(json => console.log(json));
`;

const jsonResponse = `{
  "id": "req_123",
  "verdict": "suspicious",
  "confidence": 0.82,
  "analysis": {
    "image_results": [{ 
      "frame": 120, 
      "score": 0.91, 
      "heatmap_url": "..."
    }],
    "audio_results": {
      "voice_clone": 0.75, 
      "spectral_anomalies": true
    }
  },
  "report_url": "https://fakecheck.app/report/req_123"
}`;

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Developer API
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Integrate our powerful detection engine into any application with a simple REST API.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>API Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-sm">
                <span className="text-primary font-semibold">POST</span> /api/v1/verify
              </p>
              <p className="mt-4 text-muted-foreground">
                Submit media for analysis. The request is processed asynchronously. You can receive the result via a webhook or by polling the status endpoint (not shown).
              </p>
              <h4 className="font-semibold mt-6 mb-2">Request (multipart/form-data)</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li><code className="font-mono">file</code>: The image or video file.</li>
                <li><code className="font-mono">callback_url</code> (optional): URL for webhook notification.</li>
                <li><code className="font-mono">metadata</code> (optional): JSON string for your internal reference (e.g., source_url, uploader_id).</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Example Response</CardTitle>
            </CardHeader>
            <CardContent>
               <CodeBlock language="json" code={jsonResponse} />
            </CardContent>
          </Card>

           <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>SDKs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Official SDKs for Python and Node.js are available to simplify integration.</p>
              <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Python</h4>
                    <CodeBlock language="bash" code="pip install fakecheck" />
                  </div>
                   <div>
                    <h4 className="font-semibold mb-2">JavaScript/TypeScript</h4>
                    <CodeBlock language="bash" code="npm install fakecheck-sdk" />
                  </div>
              </div>
              <Button variant="outline" asChild className="mt-4">
                <Link href="#" target="_blank">View on GitHub</Link>
              </Button>
            </CardContent>
          </Card>

        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Quickstart Examples</h3>
          <p className="text-muted-foreground">Get started in seconds with these copy-pasteable snippets.</p>
          <h4 className="font-semibold pt-4">cURL</h4>
          <CodeBlock language="bash" code={curlSnippet} />
          <h4 className="font-semibold pt-4">Python</h4>
          <CodeBlock language="python" code={pythonSnippet} />
          <h4 className="font-semibold pt-4">Node.js</h4>
          <CodeBlock language="javascript" code={jsSnippet} />
        </div>
      </div>
    </div>
  );
}
