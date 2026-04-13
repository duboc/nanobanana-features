'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { cn } from '@/lib/utils'
import { Copy, Check, Terminal, Key, Shield } from 'lucide-react'

// ---------------------------------------------------------------------------
// Copy-to-clipboard button
// ---------------------------------------------------------------------------
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="absolute top-2 right-2 rounded-md bg-white/10 p-1.5 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Code block
// ---------------------------------------------------------------------------
function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  return (
    <div className="relative my-4 rounded-lg bg-[#1e1e1e] text-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-[11px] font-medium text-white/40 uppercase">{language}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Auth method type
// ---------------------------------------------------------------------------
type AuthMethod = 'adc' | 'api-key'

// ---------------------------------------------------------------------------
// Model configurations
// ---------------------------------------------------------------------------
const MODELS = [
  {
    id: 'gemini-3.1-flash-image-preview',
    name: 'Flash 3.1',
    location: 'global',
    color: 'gcp-blue',
    dotColor: '#4285f4',
  },
  {
    id: 'gemini-3-pro-image-preview',
    name: 'Pro 3',
    location: 'global',
    color: 'gcp-green',
    dotColor: '#34a853',
  },
  {
    id: 'gemini-2.5-flash-image',
    name: 'Flash 2.5',
    location: 'us-central1',
    color: 'gcp-yellow',
    dotColor: '#fbbc04',
  },
]

// ---------------------------------------------------------------------------
// Request body builder
// ---------------------------------------------------------------------------
function buildRequestJson(prompt: string, options?: {
  resolution?: string
  aspectRatio?: string
  thinkingLevel?: string
  personGeneration?: string
}) {
  return JSON.stringify({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 1,
      maxOutputTokens: 32768,
      responseModalities: ['TEXT', 'IMAGE'],
      topP: 0.95,
      imageConfig: {
        aspectRatio: options?.aspectRatio || 'auto',
        imageSize: options?.resolution || '1K',
        imageOutputOptions: {
          mimeType: 'image/png',
        },
        personGeneration: options?.personGeneration || 'ALLOW_ALL',
      },
      thinkingConfig: {
        thinkingLevel: options?.thinkingLevel || 'HIGH',
      },
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' },
    ],
  }, null, 2)
}

// ---------------------------------------------------------------------------
// curl command builder
// ---------------------------------------------------------------------------
function buildCurlCommand(
  auth: AuthMethod,
  modelId: string,
  location: string,
  requestFile: string,
) {
  if (auth === 'api-key') {
    return `curl \\
  -X POST \\
  -H "Content-Type: application/json" \\
  "https://aiplatform.googleapis.com/v1/publishers/google/models/${modelId}:streamGenerateContent?key=\${API_KEY}" \\
  -d '@${requestFile}'`
  }

  // ADC (Application Default Credentials)
  return `curl \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \\
  "https://${location === 'global' ? '' : `${location}-`}aiplatform.googleapis.com/v1/projects/\${PROJECT_ID}/locations/${location}/publishers/google/models/${modelId}:streamGenerateContent" \\
  -d '@${requestFile}'`
}

// ---------------------------------------------------------------------------
// Example definitions
// ---------------------------------------------------------------------------
interface Example {
  title: string
  description: string
  prompt: string
  filename: string
  options?: {
    resolution?: string
    aspectRatio?: string
    thinkingLevel?: string
    personGeneration?: string
  }
}

const EXAMPLES: Example[] = [
  {
    title: 'Basic Text-to-Image',
    description: 'Generate an image from a simple text prompt.',
    prompt: 'Generate an image of a golden retriever puppy playing in autumn leaves in a park, soft afternoon light.',
    filename: 'request.json',
  },
  {
    title: 'High Resolution (4K)',
    description: 'Generate a high-resolution 4K image. Available on Flash 3.1 and Pro 3.',
    prompt: 'A detailed macro photograph of a dewdrop on a spider web at sunrise, with bokeh background.',
    filename: 'request_4k.json',
    options: { resolution: '4K' },
  },
  {
    title: 'Specific Aspect Ratio',
    description: 'Generate a wide 16:9 landscape image.',
    prompt: 'A panoramic view of a misty mountain valley at dawn, layers of mountains fading into the distance.',
    filename: 'request_wide.json',
    options: { aspectRatio: '16:9' },
  },
  {
    title: 'Minimal Thinking (Faster)',
    description: 'Use minimal thinking for faster generation when the prompt is straightforward.',
    prompt: 'A flat-design icon of a red rocket ship on a white background.',
    filename: 'request_fast.json',
    options: { thinkingLevel: 'minimal' },
  },
  {
    title: 'Person Generation',
    description: 'Generate images containing people. Requires personGeneration set to ALLOW_ALL.',
    prompt: 'A portrait of a smiling chef in a professional kitchen, preparing a colorful salad.',
    filename: 'request_person.json',
    options: { personGeneration: 'ALLOW_ALL' },
  },
]

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function ApiExamplesPage() {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('adc')
  const [selectedModel, setSelectedModel] = useState(MODELS[0])
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null)

  function copyToClipboard(id: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopiedBlock(id)
    setTimeout(() => setCopiedBlock(null), 2000)
  }

  return (
    <PageContainer
      title="API Examples"
      description="Ready-to-use curl commands to test Nano Banana image generation models directly"
    >
      <div className="max-w-4xl space-y-8">
        {/* Auth & Model Selection */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-5">
          {/* Auth method */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Authentication Method
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setAuthMethod('adc')}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg border p-4 text-left transition-all flex-1',
                  authMethod === 'adc'
                    ? 'border-gcp-blue bg-gcp-blue/5'
                    : 'border-border hover:border-muted-foreground/30'
                )}
              >
                <Shield className={cn('h-5 w-5', authMethod === 'adc' ? 'text-gcp-blue' : 'text-muted-foreground')} />
                <div>
                  <p className="text-[13px] font-medium">Application Default Credentials</p>
                  <p className="text-[11px] text-muted-foreground">Uses gcloud auth &mdash; recommended for GCP</p>
                </div>
              </button>
              <button
                onClick={() => setAuthMethod('api-key')}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg border p-4 text-left transition-all flex-1',
                  authMethod === 'api-key'
                    ? 'border-gcp-blue bg-gcp-blue/5'
                    : 'border-border hover:border-muted-foreground/30'
                )}
              >
                <Key className={cn('h-5 w-5', authMethod === 'api-key' ? 'text-gcp-blue' : 'text-muted-foreground')} />
                <div>
                  <p className="text-[13px] font-medium">API Key</p>
                  <p className="text-[11px] text-muted-foreground">Simple key-based auth for quick testing</p>
                </div>
              </button>
            </div>
          </div>

          {/* Model selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Model
            </h3>
            <div className="flex gap-2">
              {MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-left transition-all',
                    selectedModel.id === m.id
                      ? 'border-transparent bg-opacity-10'
                      : 'border-border hover:border-muted-foreground/30'
                  )}
                  style={selectedModel.id === m.id ? {
                    borderColor: m.dotColor,
                    backgroundColor: `${m.dotColor}10`,
                  } : undefined}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: m.dotColor }}
                  />
                  <span className="text-[13px] font-medium">{m.name}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Model: <code className="rounded bg-muted px-1.5 py-0.5 text-[11px]">{selectedModel.id}</code>
              {' '}&mdash; Location: <code className="rounded bg-muted px-1.5 py-0.5 text-[11px]">{selectedModel.location}</code>
            </p>
          </div>

          {/* Setup instructions */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <h4 className="text-[13px] font-medium text-foreground flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              Prerequisites
            </h4>
            {authMethod === 'adc' ? (
              <div className="space-y-2">
                <p className="text-[12px] text-muted-foreground">
                  Set your project ID and authenticate with Application Default Credentials:
                </p>
                <CodeBlock
                  code={`export PROJECT_ID="your-gcp-project-id"
gcloud auth application-default login
gcloud config set project $PROJECT_ID`}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[12px] text-muted-foreground">
                  Set your API key. You can create one in the Google Cloud Console under APIs &amp; Services &gt; Credentials:
                </p>
                <CodeBlock
                  code={`export API_KEY="your-api-key-here"`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Examples */}
        {EXAMPLES.map((example, idx) => {
          const requestJson = buildRequestJson(example.prompt, example.options)
          const writeFileCmd = `cat << 'EOF' > ${example.filename}\n${requestJson}\nEOF`
          const curlCmd = buildCurlCommand(authMethod, selectedModel.id, selectedModel.location, example.filename)
          const fullCommand = `${writeFileCmd}\n\n${curlCmd}`
          const blockId = `example-${idx}`

          return (
            <div key={idx} className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gcp-blue/10 text-[12px] font-semibold text-gcp-blue">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{example.title}</h3>
                    <p className="text-[12px] text-muted-foreground">{example.description}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 space-y-3">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  {example.options?.resolution && (
                    <span className="rounded-full bg-muted px-2 py-0.5">Resolution: {example.options.resolution}</span>
                  )}
                  {example.options?.aspectRatio && (
                    <span className="rounded-full bg-muted px-2 py-0.5">Aspect: {example.options.aspectRatio}</span>
                  )}
                  {example.options?.thinkingLevel && (
                    <span className="rounded-full bg-muted px-2 py-0.5">Thinking: {example.options.thinkingLevel}</span>
                  )}
                </div>

                {/* Step 1: Create request file */}
                <div>
                  <p className="text-[12px] font-medium text-muted-foreground mb-1">
                    Step 1 &mdash; Create the request file
                  </p>
                  <div className="relative rounded-lg bg-[#1e1e1e] text-sm">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                      <span className="text-[11px] font-medium text-white/40 uppercase">bash</span>
                      <button
                        onClick={() => copyToClipboard(`${blockId}-req`, writeFileCmd)}
                        className="rounded-md bg-white/10 p-1.5 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                      >
                        {copiedBlock === `${blockId}-req` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-gray-300">
                      <code>{writeFileCmd}</code>
                    </pre>
                  </div>
                </div>

                {/* Step 2: Run curl */}
                <div>
                  <p className="text-[12px] font-medium text-muted-foreground mb-1">
                    Step 2 &mdash; Call the API
                  </p>
                  <div className="relative rounded-lg bg-[#1e1e1e] text-sm">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                      <span className="text-[11px] font-medium text-white/40 uppercase">bash</span>
                      <button
                        onClick={() => copyToClipboard(`${blockId}-curl`, curlCmd)}
                        className="rounded-md bg-white/10 p-1.5 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                      >
                        {copiedBlock === `${blockId}-curl` ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-gray-300">
                      <code>{curlCmd}</code>
                    </pre>
                  </div>
                </div>

                {/* Copy all button */}
                <div className="pt-1">
                  <button
                    onClick={() => copyToClipboard(`${blockId}-all`, fullCommand)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-4 py-2 text-[12px] font-medium transition-colors',
                      copiedBlock === `${blockId}-all`
                        ? 'border-gcp-green/40 bg-gcp-green/5 text-gcp-green'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40'
                    )}
                  >
                    {copiedBlock === `${blockId}-all` ? (
                      <><Check className="h-3.5 w-3.5" /> Copied!</>
                    ) : (
                      <><Copy className="h-3.5 w-3.5" /> Copy both steps</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {/* Response format info */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Understanding the Response</h3>
          <p className="text-[13px] text-muted-foreground">
            The API returns a streamed JSON response. Each candidate contains parts with either text or inline image data (base64-encoded):
          </p>
          <CodeBlock
            language="json"
            code={`{
  "candidates": [{
    "content": {
      "parts": [
        { "text": "Here is the generated image..." },
        {
          "inlineData": {
            "mimeType": "image/png",
            "data": "<base64-encoded-image>"
          }
        }
      ]
    }
  }]
}`}
          />
          <p className="text-[13px] text-muted-foreground">
            To save the image from the response, extract the base64 data and decode it:
          </p>
          <CodeBlock
            code={`# Parse the response and save the image (requires jq)
cat response.json | jq -r '.[0].candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' | base64 -d > output.png`}
          />
        </div>

        {/* Tips */}
        <div className="rounded-lg border border-gcp-blue/20 bg-gcp-blue/5 p-5 space-y-3">
          <h4 className="text-[13px] font-medium text-foreground">Tips</h4>
          <ul className="text-[12px] text-muted-foreground space-y-2 list-disc pl-4">
            <li>
              <strong>Flash 3.1</strong> and <strong>Pro 3</strong> use the <code className="rounded bg-muted px-1 py-0.5 text-[11px]">global</code> endpoint.{' '}
              <strong>Flash 2.5</strong> uses <code className="rounded bg-muted px-1 py-0.5 text-[11px]">us-central1</code>.
            </li>
            <li>
              Use <code className="rounded bg-muted px-1 py-0.5 text-[11px]">streamGenerateContent</code> for streamed responses or{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-[11px]">generateContent</code> for a single response.
            </li>
            <li>
              Set <code className="rounded bg-muted px-1 py-0.5 text-[11px]">thinkingLevel</code> to{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-[11px]">minimal</code> for faster generation when the prompt is simple.
            </li>
            <li>
              The <code className="rounded bg-muted px-1 py-0.5 text-[11px]">safetySettings</code> with threshold <code className="rounded bg-muted px-1 py-0.5 text-[11px]">OFF</code> disables content filtering &mdash; adjust for production use.
            </li>
            <li>
              Available resolutions: <strong>512</strong> (Flash 3.1 only), <strong>1K</strong> (all models), <strong>2K</strong> (Flash 3.1, Pro 3), <strong>4K</strong> (Flash 3.1, Pro 3).
            </li>
          </ul>
        </div>
      </div>
    </PageContainer>
  )
}
