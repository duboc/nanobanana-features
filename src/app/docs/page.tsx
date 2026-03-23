'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  Cpu,
  ImageIcon,
  Wand2,
  MessageSquare,
  Images,
  Search,
  Lightbulb,
  Settings2,
  Maximize,
  Palette,
  Shield,
  Zap,
  Code2,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react'

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
// Code block with syntax highlighting placeholder
// ---------------------------------------------------------------------------
function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
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
// Callout components
// ---------------------------------------------------------------------------
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 flex gap-3 rounded-lg border border-gcp-green/30 bg-gcp-green/5 p-4">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-gcp-green mt-0.5" />
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 flex gap-3 rounded-lg border border-gcp-yellow/30 bg-gcp-yellow/5 p-4">
      <AlertTriangle className="h-5 w-5 shrink-0 text-gcp-yellow mt-0.5" />
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Table of Contents sections
// ---------------------------------------------------------------------------
const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'setup', label: 'Setup & Authentication', icon: Shield },
  { id: 'models', label: 'Models', icon: Cpu },
  { id: 'text-to-image', label: 'Text to Image', icon: ImageIcon },
  { id: 'image-editing', label: 'Image Editing', icon: Wand2 },
  { id: 'multi-turn', label: 'Multi-turn Conversations', icon: MessageSquare },
  { id: 'reference-images', label: 'Reference Images', icon: Images },
  { id: 'search-grounding', label: 'Search Grounding', icon: Search },
  { id: 'thinking', label: 'Thinking Levels', icon: Lightbulb },
  { id: 'config', label: 'Configuration Options', icon: Settings2 },
  { id: 'resolutions', label: 'Resolutions', icon: Maximize },
  { id: 'styles', label: 'Style Prompting', icon: Palette },
  { id: 'best-practices', label: 'Best Practices', icon: Zap },
  { id: 'api-reference', label: 'API Reference', icon: Code2 },
]

// ---------------------------------------------------------------------------
// Comparison table helper
// ---------------------------------------------------------------------------
function ComparisonTable() {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-foreground">Feature</th>
            <th className="px-4 py-3 text-center font-medium text-gcp-blue">Nano Banana 2<br /><span className="text-[11px] font-normal text-muted-foreground">Flash 3.1</span></th>
            <th className="px-4 py-3 text-center font-medium text-gcp-green">Nano Banana Pro<br /><span className="text-[11px] font-normal text-muted-foreground">Pro 3</span></th>
            <th className="px-4 py-3 text-center font-medium text-gcp-yellow">Nano Banana<br /><span className="text-[11px] font-normal text-muted-foreground">Flash 2.5</span></th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Model ID', 'gemini-3.1-flash-image-preview', 'gemini-3-pro-image-preview', 'gemini-2.5-flash-image'],
            ['Text to Image', 'yes', 'yes', 'yes'],
            ['Image Editing', 'yes', 'yes', 'yes'],
            ['Search Grounding', 'yes', 'yes', 'no'],
            ['Image Search', 'yes', 'no', 'no'],
            ['Thinking Levels', 'Minimal, High', 'None', 'None'],
            ['Max Reference Images', '14', '11', '3'],
            ['Character Images', '4', '5', '0'],
            ['Object Images', '10', '6', '3'],
            ['Resolutions', '512, 1K, 2K, 4K', '1K, 2K, 4K', '1K'],
            ['Aspect Ratios', '14 (all)', '10 (standard)', '10 (standard)'],
            ['Best For', 'Speed, volume', 'Quality, complex', 'Efficient, simple'],
          ].map(([feature, flash, pro, v25], i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5 font-medium text-foreground">{feature}</td>
              <td className="px-4 py-2.5 text-center">
                {flash === 'yes' ? <CheckCircle2 className="inline h-4 w-4 text-gcp-green" /> :
                 flash === 'no' ? <span className="text-muted-foreground">-</span> :
                 <span className="text-muted-foreground text-xs">{flash}</span>}
              </td>
              <td className="px-4 py-2.5 text-center">
                {pro === 'yes' ? <CheckCircle2 className="inline h-4 w-4 text-gcp-green" /> :
                 pro === 'no' ? <span className="text-muted-foreground">-</span> :
                 <span className="text-muted-foreground text-xs">{pro}</span>}
              </td>
              <td className="px-4 py-2.5 text-center">
                {v25 === 'yes' ? <CheckCircle2 className="inline h-4 w-4 text-gcp-green" /> :
                 v25 === 'no' ? <span className="text-muted-foreground">-</span> :
                 <span className="text-muted-foreground text-xs">{v25}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  function scrollTo(id: string) {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <PageContainer
      title="Documentation"
      description="Comprehensive guide to Nano Banana image generation features, APIs, and best practices"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sticky Table of Contents */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20">
            <nav className="space-y-0.5 rounded-lg border border-border bg-card p-3 shadow-sm">
              <h3 className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Contents
              </h3>
              {SECTIONS.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors text-left',
                    activeSection === section.id
                      ? 'bg-gcp-blue/10 text-gcp-blue'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <section.icon className="h-3.5 w-3.5 shrink-0" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3 space-y-12">

          {/* ============================================================== */}
          {/* OVERVIEW */}
          {/* ============================================================== */}
          <section id="overview" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Overview</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Nano Banana is Google&apos;s native image generation capability built into the Gemini model family.
              Unlike separate image generation APIs, Nano Banana is fully integrated into Gemini&apos;s multimodal
              architecture, meaning the same model that understands text, code, and images can also <strong>generate
              and edit images</strong> natively.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 my-6">
              {[
                { label: 'Native Generation', desc: 'Images generated directly by the LLM, not a separate diffusion model', color: 'text-gcp-blue' },
                { label: 'Multimodal I/O', desc: 'Interleave text and images freely in both input and output', color: 'text-gcp-green' },
                { label: 'Iterative Refinement', desc: 'Use multi-turn conversations to refine results progressively', color: 'text-gcp-yellow' },
              ].map(item => (
                <div key={item.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <h4 className={cn('text-sm font-semibold mb-1', item.color)}>{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Key differentiators from traditional image generation APIs:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
              <li><strong>Text rendering</strong> &mdash; Accurately renders text within generated images</li>
              <li><strong>World knowledge</strong> &mdash; Leverages Gemini&apos;s training to understand complex concepts</li>
              <li><strong>Instruction following</strong> &mdash; Precisely follows detailed, multi-step prompts</li>
              <li><strong>Conversational editing</strong> &mdash; Edit images through natural dialogue</li>
              <li><strong>Search grounding</strong> &mdash; Generate images based on real-time web data</li>
            </ul>
          </section>

          {/* ============================================================== */}
          {/* SETUP & AUTHENTICATION */}
          {/* ============================================================== */}
          <section id="setup" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Setup & Authentication</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              This application uses <strong>Google Cloud Application Default Credentials (ADC)</strong> via Vertex AI.
              No API keys are needed &mdash; authentication is handled automatically by your GCP environment.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">1. Install the SDK</h3>
            <CodeBlock language="bash" code="npm install @google/genai" />

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2. Authenticate with GCP</h3>
            <CodeBlock language="bash" code={`# Login with your Google account
gcloud auth application-default login

# Set your project
gcloud config set project YOUR_PROJECT_ID`} />

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3. Initialize the Client</h3>
            <CodeBlock code={`import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
})`} />

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4. Environment Variables</h3>
            <CodeBlock language="env" code={`# .env.local
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1  # or 'global'`} />

            <Tip>
              <strong>Vertex AI mode</strong> routes requests through Google Cloud infrastructure, providing enterprise
              features like VPC-SC, CMEK, audit logging, and data residency controls. It also means you
              never need to manage API keys.
            </Tip>

            <Warning>
              All Gemini API calls must run <strong>server-side only</strong>. In Next.js, use Route Handlers
              (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">src/app/api/*/route.ts</code>) to keep
              credentials secure. Never import the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">@google/genai</code> package
              in client components.
            </Warning>
          </section>

          {/* ============================================================== */}
          {/* MODELS */}
          {/* ============================================================== */}
          <section id="models" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Models</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Three Gemini models support native image generation, each optimized for different use cases.
            </p>
            <ComparisonTable />

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">When to Use Each Model</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-gcp-blue/20 bg-gcp-blue/5 p-4">
                <h4 className="text-sm font-semibold text-gcp-blue mb-1">Nano Banana 2 (gemini-3.1-flash-image-preview)</h4>
                <p className="text-xs text-muted-foreground">
                  Best for <strong>speed and volume</strong>. Supports all features including thinking levels, image search
                  grounding, 512px output, and the widest range of aspect ratios (14 options including 1:4, 1:8, 4:1, 8:1).
                  Up to 14 reference images. Ideal for rapid prototyping, high-volume workflows, and applications requiring
                  low latency.
                </p>
              </div>
              <div className="rounded-lg border border-gcp-green/20 bg-gcp-green/5 p-4">
                <h4 className="text-sm font-semibold text-gcp-green mb-1">Nano Banana Pro (gemini-3-pro-image-preview)</h4>
                <p className="text-xs text-muted-foreground">
                  Best for <strong>quality and complex instructions</strong>. Superior reasoning enables more accurate
                  adherence to detailed prompts. Best text rendering fidelity. Supports up to 5 character reference images
                  and 6 object reference images. Ideal for professional asset creation, marketing materials, and detailed compositions.
                </p>
              </div>
              <div className="rounded-lg border border-gcp-yellow/20 bg-gcp-yellow/5 p-4">
                <h4 className="text-sm font-semibold text-gcp-yellow mb-1">Nano Banana (gemini-2.5-flash-image)</h4>
                <p className="text-xs text-muted-foreground">
                  Best for <strong>simple, efficient tasks</strong>. Limited to 1K resolution and 3 reference images,
                  but highly efficient. No search grounding or thinking levels. Ideal for straightforward generation tasks
                  where speed matters more than advanced features.
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* TEXT TO IMAGE */}
          {/* ============================================================== */}
          <section id="text-to-image" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Text to Image</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The most fundamental capability. Provide a text prompt and receive one or more generated images.
              The model can return both text and images in the same response (explaining what it created)
              or images only.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Basic Generation</h3>
            <CodeBlock code={`const response = await ai.models.generateContent({
  model: 'gemini-3.1-flash-image-preview',
  contents: [{
    role: 'user',
    parts: [{ text: 'A serene mountain lake at sunset with snow-capped peaks' }],
  }],
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
})`} />

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Image-Only Mode</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Set <code className="text-xs bg-muted px-1.5 py-0.5 rounded">responseModalities</code> to
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">[&apos;IMAGE&apos;]</code> to receive only the
              generated image without any accompanying text.
            </p>
            <CodeBlock code={`config: {
  responseModalities: ['IMAGE'],  // Image only, no text
}`} />

            <Tip>
              <strong>Text + Image mode</strong> (default) is useful because the model often explains what it created,
              provides context, or suggests refinements. Use <strong>Image Only</strong> mode when you need raw
              image output for automated pipelines.
            </Tip>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Response Structure</h3>
            <CodeBlock code={`// The response contains candidates with parts
const parts = response.candidates[0].content.parts

for (const part of parts) {
  if (part.thought) {
    // Skip thinking tokens (internal reasoning)
    continue
  }
  if (part.text) {
    console.log('Text:', part.text)
  }
  if (part.inlineData) {
    // Base64-encoded image
    const { data, mimeType } = part.inlineData
    const dataUrl = \`data:\${mimeType};base64,\${data}\`
  }
}`} />
          </section>

          {/* ============================================================== */}
          {/* IMAGE EDITING */}
          {/* ============================================================== */}
          <section id="image-editing" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Image Editing</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Upload an existing image alongside a text prompt describing the desired edits.
              The model preserves the original image&apos;s style, lighting, perspective, and composition
              while applying your requested changes.
            </p>

            <CodeBlock code={`const response = await ai.models.generateContent({
  model: 'gemini-3.1-flash-image-preview',
  contents: [{
    role: 'user',
    parts: [
      { text: 'Change the sky to a dramatic sunset with orange and purple clouds' },
      {
        inlineData: {
          data: imageBase64,    // Base64-encoded source image
          mimeType: 'image/png',
        },
      },
    ],
  }],
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
})`} />

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Editing Best Practices</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li><strong>Be specific</strong> &mdash; Instead of &ldquo;make it better&rdquo;, describe exactly what to change: &ldquo;increase the contrast, add warm tones, sharpen the foreground subject&rdquo;</li>
              <li><strong>Reference regions</strong> &mdash; Use spatial terms like &ldquo;in the top-left corner&rdquo;, &ldquo;the background&rdquo;, &ldquo;the person&apos;s shirt&rdquo;</li>
              <li><strong>Preserve intent</strong> &mdash; Mention what should stay the same: &ldquo;keep the original composition but change the color palette to cool blues&rdquo;</li>
              <li><strong>Iterative editing</strong> &mdash; For complex edits, use multi-turn chat to make changes step by step</li>
            </ul>

            <Warning>
              Supported input formats: <strong>PNG, JPEG, GIF, WebP</strong>. Images are sent as base64-encoded
              inline data. Very large images may increase latency &mdash; consider resizing to a reasonable resolution
              before sending.
            </Warning>
          </section>

          {/* ============================================================== */}
          {/* MULTI-TURN */}
          {/* ============================================================== */}
          <section id="multi-turn" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Multi-turn Conversations</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Engage in back-and-forth conversations to iteratively create and refine images.
              The model maintains context across turns, remembering previous images and instructions.
              You can also attach images in your messages to provide visual context.
            </p>

            <CodeBlock code={`// Build conversation history
const contents = [
  {
    role: 'user',
    parts: [{ text: 'Create a cartoon mascot of a friendly banana wearing sunglasses' }],
  },
  {
    role: 'model',
    parts: [
      { text: 'Here is your banana mascot!' },
      { inlineData: { data: previousImageBase64, mimeType: 'image/png' } },
    ],
  },
  {
    role: 'user',
    parts: [{ text: 'Great! Now make it holding a surfboard and add a beach background' }],
  },
]

const response = await ai.models.generateContent({
  model: 'gemini-3.1-flash-image-preview',
  contents,
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
})`} />

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Attaching Images in Chat</h3>
            <p className="text-sm text-muted-foreground mb-3">
              You can include images in user messages to provide visual references during conversation:
            </p>
            <CodeBlock code={`// User message with an attached image
{
  role: 'user',
  parts: [
    { text: 'Make the character look like this person' },
    {
      inlineData: {
        data: referencePhotoBase64,
        mimeType: 'image/jpeg',
      },
    },
  ],
}`} />

            <Tip>
              <strong>Thought signatures:</strong> In multi-turn conversations, the model may include
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded mx-1">part.thought</code> tokens in its
              responses. These are internal reasoning traces and should be <strong>filtered out</strong> when
              displaying responses, but <strong>preserved in history</strong> for context continuity.
            </Tip>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">History Management</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Maintain conversation history client-side and send the full history with each request</li>
              <li>Include both text and image parts from model responses in the history</li>
              <li>Filter out <code className="text-xs bg-muted px-1.5 py-0.5 rounded">thought</code> parts from display but keep them in history</li>
              <li>Longer histories provide better context but increase latency and token usage</li>
            </ul>
          </section>

          {/* ============================================================== */}
          {/* REFERENCE IMAGES */}
          {/* ============================================================== */}
          <section id="reference-images" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Reference Images</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Provide up to <strong>14 reference images</strong> (with Nano Banana 2) alongside a text prompt
              to guide generation. This is powerful for style transfer, composition blending, character consistency,
              and product variations.
            </p>

            <CodeBlock code={`const response = await ai.models.generateContent({
  model: 'gemini-3.1-flash-image-preview',
  contents: [{
    role: 'user',
    parts: [
      { text: 'Combine the style of the first image with the composition of the second' },
      { inlineData: { data: styleImage, mimeType: 'image/png' } },
      { inlineData: { data: compImage, mimeType: 'image/png' } },
    ],
  }],
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
})`} />

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Reference Image Limits</h3>
            <div className="my-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-center font-medium">Flash 3.1</th>
                    <th className="px-4 py-3 text-center font-medium">Pro 3</th>
                    <th className="px-4 py-3 text-center font-medium">Flash 2.5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">Total references</td>
                    <td className="px-4 py-2.5 text-center">14</td>
                    <td className="px-4 py-2.5 text-center">11</td>
                    <td className="px-4 py-2.5 text-center">3</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">Character images</td>
                    <td className="px-4 py-2.5 text-center">4</td>
                    <td className="px-4 py-2.5 text-center">5</td>
                    <td className="px-4 py-2.5 text-center">0</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">Object images</td>
                    <td className="px-4 py-2.5 text-center">10</td>
                    <td className="px-4 py-2.5 text-center">6</td>
                    <td className="px-4 py-2.5 text-center">3</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Use Cases</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
              <li><strong>Style transfer</strong> &mdash; &ldquo;Apply the artistic style from this painting to a photo of a city skyline&rdquo;</li>
              <li><strong>Character consistency</strong> &mdash; Provide multiple views of a character to maintain identity across generations</li>
              <li><strong>Product variations</strong> &mdash; Show a product and request color/material/design variations</li>
              <li><strong>Scene composition</strong> &mdash; Combine elements from multiple reference images into a single scene</li>
              <li><strong>Brand consistency</strong> &mdash; Provide brand assets to maintain visual identity</li>
            </ul>

            <Warning>
              When using multiple reference images, be explicit in your prompt about which image serves
              which purpose. For example: &ldquo;Use the first image as the style reference, the second as the
              subject, and the third as the background.&rdquo;
            </Warning>
          </section>

          {/* ============================================================== */}
          {/* SEARCH GROUNDING */}
          {/* ============================================================== */}
          <section id="search-grounding" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Search Grounding</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Enable Google Search grounding to generate images based on <strong>real-time information</strong>.
              The model searches the web first, then uses the retrieved data to create accurate, up-to-date
              visualizations. Supported by Nano Banana 2 and Pro.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Web Search Grounding</h3>
            <CodeBlock code={`const response = await ai.models.generateContent({
  model: 'gemini-3.1-flash-image-preview',
  contents: [{
    role: 'user',
    parts: [{ text: 'Create an infographic of today\\'s weather in Tokyo' }],
  }],
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
    tools: [{ googleSearch: {} }],
  },
})`} />

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Image Search Grounding</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Nano Banana 2 exclusively supports <strong>image search grounding</strong>, which searches
              Google Images in addition to web pages:
            </p>
            <CodeBlock code={`config: {
  responseModalities: ['TEXT', 'IMAGE'],
  tools: [{
    googleSearch: {
      searchTypes: {
        webSearch: {},
        imageSearch: {},  // Also search Google Images
      },
    },
  }],
}`} />

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Grounding Metadata</h3>
            <p className="text-sm text-muted-foreground mb-3">
              When search grounding is used, the response includes metadata about sources:
            </p>
            <CodeBlock code={`const grounding = response.candidates[0].groundingMetadata

// Search queries the model used
grounding.webSearchQueries   // ['Tokyo weather today', ...]

// Source citations
grounding.groundingChunks    // [{ web: { uri, title } }, ...]

// Pre-rendered search widget HTML
grounding.searchEntryPoint?.renderedContent`} />

            <Tip>
              Search grounding is ideal for: <strong>weather visualizations</strong>, <strong>sports results</strong>,
              <strong>data infographics</strong>, <strong>current events illustrations</strong>, and any scenario
              where the image content depends on real-time data.
            </Tip>
          </section>

          {/* ============================================================== */}
          {/* THINKING LEVELS */}
          {/* ============================================================== */}
          <section id="thinking" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Thinking Levels</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Nano Banana 2 (Flash 3.1) supports configurable <strong>thinking levels</strong> that control
              how much internal reasoning the model performs before generating. Higher thinking improves
              output quality at the cost of increased latency.
            </p>

            <CodeBlock code={`config: {
  responseModalities: ['TEXT', 'IMAGE'],
  thinkingConfig: {
    thinkingLevel: 'High',        // 'Minimal' or 'High'
    includeThoughts: false,       // Include reasoning tokens in response
  },
}`} />

            <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-foreground mb-2">Minimal</h4>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                  <li>Fastest response time</li>
                  <li>Good for simple, straightforward prompts</li>
                  <li>Suitable for high-volume, low-latency workflows</li>
                  <li>Default mode for most use cases</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-foreground mb-2">High</h4>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                  <li>More internal reasoning before generation</li>
                  <li>Better adherence to complex, multi-part instructions</li>
                  <li>Improved spatial reasoning and composition</li>
                  <li>Higher latency tradeoff</li>
                </ul>
              </div>
            </div>

            <Warning>
              When <code className="text-xs bg-muted px-1.5 py-0.5 rounded">includeThoughts: true</code>, the
              response will contain parts with <code className="text-xs bg-muted px-1.5 py-0.5 rounded">thought: true</code>.
              These should be filtered from display but preserved if you&apos;re building conversation history for
              multi-turn interactions.
            </Warning>
          </section>

          {/* ============================================================== */}
          {/* CONFIGURATION OPTIONS */}
          {/* ============================================================== */}
          <section id="config" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Configuration Options</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Response Modalities</h3>
            <div className="my-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Value</th>
                    <th className="px-4 py-3 text-left font-medium">Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">[&apos;TEXT&apos;, &apos;IMAGE&apos;]</code></td>
                    <td className="px-4 py-2.5 text-muted-foreground">Model can return both text and images. Text often describes what was generated.</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">[&apos;IMAGE&apos;]</code></td>
                    <td className="px-4 py-2.5 text-muted-foreground">Image-only output. No accompanying text.</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">[&apos;TEXT&apos;]</code></td>
                    <td className="px-4 py-2.5 text-muted-foreground">Text-only mode (standard Gemini behavior, no image generation).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Image Config</h3>
            <CodeBlock code={`config: {
  responseModalities: ['TEXT', 'IMAGE'],
  imageConfig: {
    aspectRatio: '16:9',    // Output aspect ratio
    imageSize: '2K',        // Output resolution
  },
}`} />
          </section>

          {/* ============================================================== */}
          {/* RESOLUTIONS */}
          {/* ============================================================== */}
          <section id="resolutions" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Resolutions</h2>

            <div className="my-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Value</th>
                    <th className="px-4 py-3 text-left font-medium">Approximate Output Size</th>
                    <th className="px-4 py-3 text-left font-medium">Models</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">512</td>
                    <td className="px-4 py-2.5 text-muted-foreground">~512px on longest edge</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Flash 3.1 only</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">1K</td>
                    <td className="px-4 py-2.5 text-muted-foreground">~1024px on longest edge</td>
                    <td className="px-4 py-2.5 text-muted-foreground">All models</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">2K</td>
                    <td className="px-4 py-2.5 text-muted-foreground">~2048px on longest edge</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Flash 3.1, Pro 3</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">4K</td>
                    <td className="px-4 py-2.5 text-muted-foreground">~4096px on longest edge</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Flash 3.1, Pro 3</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Aspect Ratios</h3>
            <p className="text-sm text-muted-foreground mb-4">
              All models support <strong>10 standard ratios</strong>. Nano Banana 2 (Flash 3.1) supports
              4 additional extreme ratios for panoramic and banner-style outputs.
            </p>

            <div className="my-4 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
              {[
                { ratio: '1:1', w: 1, h: 1, all: true },
                { ratio: '2:3', w: 2, h: 3, all: true },
                { ratio: '3:2', w: 3, h: 2, all: true },
                { ratio: '3:4', w: 3, h: 4, all: true },
                { ratio: '4:3', w: 4, h: 3, all: true },
                { ratio: '4:5', w: 4, h: 5, all: true },
                { ratio: '5:4', w: 5, h: 4, all: true },
                { ratio: '9:16', w: 9, h: 16, all: true },
                { ratio: '16:9', w: 16, h: 9, all: true },
                { ratio: '21:9', w: 21, h: 9, all: true },
                { ratio: '1:4', w: 1, h: 4, all: false },
                { ratio: '1:8', w: 1, h: 8, all: false },
                { ratio: '4:1', w: 4, h: 1, all: false },
                { ratio: '8:1', w: 8, h: 1, all: false },
              ].map(item => {
                const maxDim = 24
                const scale = maxDim / Math.max(item.w, item.h)
                const w = Math.max(item.w * scale, 4)
                const h = Math.max(item.h * scale, 4)
                return (
                  <div
                    key={item.ratio}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-md border p-2',
                      item.all ? 'border-border' : 'border-gcp-blue/30 bg-gcp-blue/5'
                    )}
                  >
                    <div
                      className="rounded-[2px] bg-muted-foreground/25"
                      style={{ width: `${w}px`, height: `${h}px` }}
                    />
                    <span className="text-[10px] font-medium">{item.ratio}</span>
                    {!item.all && (
                      <span className="text-[8px] text-gcp-blue font-medium">Flash 3.1</span>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* ============================================================== */}
          {/* STYLE PROMPTING */}
          {/* ============================================================== */}
          <section id="styles" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Style Prompting</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Nano Banana excels at following detailed style instructions. Here are proven prompt
              templates for different visual styles:
            </p>

            <div className="space-y-4">
              {[
                {
                  name: 'Photorealistic',
                  template: 'A photorealistic {shot_type} of {subject}, {action}, set in {environment}. The scene is illuminated by {lighting}, creating a {mood} atmosphere. Captured with a {camera_details}, emphasizing {textures}.',
                  tip: 'Include specific camera models, lens focal lengths, and f-stop values for maximum realism.',
                },
                {
                  name: 'Sticker / Icon',
                  template: 'A {style} sticker of a {subject}, featuring {characteristics} and a {color_palette}. The design should have {line_style} and {shading}. The background must be transparent.',
                  tip: 'Mention "thick clean outlines" and "flat cel shading" for clean sticker aesthetics.',
                },
                {
                  name: 'Text in Image',
                  template: 'Create a {image_type} for {brand} with the text "{text}" in a {font_style}. The design should be {style}, with a {color_scheme}.',
                  tip: 'Put the exact text in quotes. The model renders text best when it\'s clearly specified and concise.',
                },
                {
                  name: 'Product Mockup',
                  template: 'A high-resolution, studio-lit product photograph of a {product} on a {background}. The lighting is a {lighting_setup} to {purpose}. The camera angle is a {angle}.',
                  tip: 'Describe lighting setup (softbox, rim light, fill) for professional studio quality.',
                },
                {
                  name: 'Comic Panel',
                  template: 'Make a {panel_count} panel comic in a {style}. The character is {character}. {scene_description}.',
                  tip: 'Describe each panel separately for best results. Keep to 3-4 panels.',
                },
                {
                  name: 'Isometric Scene',
                  template: 'A clear, 45-degree top-down isometric miniature 3D cartoon scene of {subject}. Use soft, refined textures with realistic PBR materials and gentle lighting.',
                  tip: 'Always specify "45-degree top-down isometric" for consistent perspective.',
                },
              ].map(style => (
                <div key={style.name} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <h4 className="text-sm font-semibold text-foreground mb-2">{style.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono bg-muted/50 rounded p-2.5 mb-2">
                    {style.template}
                  </p>
                  <p className="text-xs text-gcp-blue">
                    <Lightbulb className="inline h-3 w-3 mr-1" />
                    {style.tip}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* BEST PRACTICES */}
          {/* ============================================================== */}
          <section id="best-practices" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Best Practices</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-gcp-blue" />
                  Prompt Engineering
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  <li><strong>Be descriptive and specific</strong> &mdash; Include details about composition, lighting, mood, style, colors, textures, and camera perspective</li>
                  <li><strong>Use structured prompts</strong> &mdash; Break complex descriptions into subject, action, environment, lighting, and style sections</li>
                  <li><strong>Specify what you don&apos;t want</strong> &mdash; &ldquo;Without text&rdquo;, &ldquo;no watermark&rdquo;, &ldquo;clean background&rdquo;</li>
                  <li><strong>Reference known styles</strong> &mdash; &ldquo;In the style of Studio Ghibli&rdquo;, &ldquo;Wes Anderson color palette&rdquo;, &ldquo;Bauhaus design&rdquo;</li>
                  <li><strong>Use photography terms</strong> &mdash; Bokeh, golden hour, rule of thirds, leading lines, depth of field</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-gcp-green" />
                  Performance & Cost
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  <li><strong>Start with 1K resolution</strong> &mdash; Only use 2K/4K when high resolution is actually needed</li>
                  <li><strong>Use Flash 3.1 for iteration</strong> &mdash; Switch to Pro 3 only for final production assets</li>
                  <li><strong>Minimal thinking for simple prompts</strong> &mdash; Reserve High thinking for complex multi-part instructions</li>
                  <li><strong>Image-only mode for pipelines</strong> &mdash; Skip text output when you only need the image</li>
                  <li><strong>Resize reference images</strong> &mdash; Sending 4K reference images wastes tokens; resize to 1K</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-gcp-yellow" />
                  Architecture
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  <li><strong>Server-side only</strong> &mdash; Keep all Gemini API calls in server routes, never in client components</li>
                  <li><strong>ADC for auth</strong> &mdash; Use Application Default Credentials instead of API keys for enterprise security</li>
                  <li><strong>Base64 for images</strong> &mdash; Images are transferred as base64 inline data; consider caching for repeated access</li>
                  <li><strong>Stateless chat</strong> &mdash; Send full conversation history with each request; the API is stateless</li>
                  <li><strong>Body size limits</strong> &mdash; For multi-image uploads (up to 14), increase your server&apos;s body size limit (e.g., 50MB)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-gcp-red" />
                  Common Pitfalls
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  <li><strong>Don&apos;t forget responseModalities</strong> &mdash; Without <code className="text-xs bg-muted px-1.5 py-0.5 rounded">[&apos;TEXT&apos;, &apos;IMAGE&apos;]</code>, the model won&apos;t generate images</li>
                  <li><strong>Don&apos;t strip thought tokens from history</strong> &mdash; Filter from display, but keep in conversation context</li>
                  <li><strong>Don&apos;t use search grounding with Flash 2.5</strong> &mdash; Only Flash 3.1 and Pro 3 support it</li>
                  <li><strong>Don&apos;t mix up imageSize and imageResolution</strong> &mdash; The config key is <code className="text-xs bg-muted px-1.5 py-0.5 rounded">imageSize</code> (not imageResolution)</li>
                  <li><strong>Handle safety filters</strong> &mdash; The model may refuse to generate certain content; always handle empty responses gracefully</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* API REFERENCE */}
          {/* ============================================================== */}
          <section id="api-reference" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">API Reference</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              This application exposes 5 API routes that wrap the Gemini SDK. All routes accept POST
              requests with JSON bodies and return JSON responses.
            </p>

            <div className="space-y-4">
              {[
                {
                  method: 'POST',
                  path: '/api/generate',
                  desc: 'Text-to-image generation',
                  body: `{
  "prompt": string,
  "model": "gemini-3.1-flash-image-preview" | "gemini-3-pro-image-preview" | "gemini-2.5-flash-image",
  "aspectRatio?": "1:1" | "16:9" | ...,
  "resolution?": "512" | "1K" | "2K" | "4K",
  "thinkingLevel?": "minimal" | "high",
  "imageOnly?": boolean
}`,
                },
                {
                  method: 'POST',
                  path: '/api/edit',
                  desc: 'Edit an existing image',
                  body: `{
  "prompt": string,
  "model": ModelId,
  "image": { "base64": string, "mimeType": string },
  "aspectRatio?": AspectRatio,
  "resolution?": Resolution
}`,
                },
                {
                  method: 'POST',
                  path: '/api/chat',
                  desc: 'Multi-turn conversation with images',
                  body: `{
  "message": string,
  "model": ModelId,
  "history": [{ "role": "user"|"model", "parts": [...] }],
  "aspectRatio?": AspectRatio,
  "resolution?": Resolution,
  "image?": { "base64": string, "mimeType": string }
}`,
                },
                {
                  method: 'POST',
                  path: '/api/reference',
                  desc: 'Generate with multiple reference images',
                  body: `{
  "prompt": string,
  "model": ModelId,
  "images": [{ "base64": string, "mimeType": string }, ...],
  "aspectRatio?": AspectRatio,
  "resolution?": Resolution
}`,
                },
                {
                  method: 'POST',
                  path: '/api/search-grounded',
                  desc: 'Generate with Google Search grounding',
                  body: `{
  "prompt": string,
  "model": ModelId,
  "aspectRatio?": AspectRatio,
  "resolution?": Resolution,
  "enableImageSearch?": boolean
}`,
                },
              ].map(endpoint => (
                <div key={endpoint.path} className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-muted/30">
                    <span className="rounded bg-gcp-blue/10 px-2 py-0.5 text-[11px] font-bold text-gcp-blue">
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-medium font-mono">{endpoint.path}</code>
                    <span className="ml-auto text-xs text-muted-foreground">{endpoint.desc}</span>
                  </div>
                  <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed text-muted-foreground">
                    <code>{endpoint.body}</code>
                  </pre>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-medium text-foreground mt-8 mb-3">Response Format (All Endpoints)</h3>
            <CodeBlock code={`{
  "images": [
    { "base64": "iVBORw0KGgo...", "mimeType": "image/png" }
  ],
  "text": "Here is the generated image...",    // optional
  "groundingMetadata": {                        // only with search grounding
    "groundingChunks": [{ "web": { "uri": "...", "title": "..." } }],
    "searchQueries": ["query1", "query2"]
  }
}`} />

            <h3 className="text-lg font-medium text-foreground mt-8 mb-3">Rendering Images</h3>
            <CodeBlock code={`// Convert base64 response to a displayable data URL
function base64ToDataUrl(base64: string, mimeType: string): string {
  return \`data:\${mimeType};base64,\${base64}\`
}

// Use in an <img> tag
<img src={base64ToDataUrl(image.base64, image.mimeType)} alt="Generated" />`} />
          </section>

          {/* Bottom spacer */}
          <div className="h-12" />
        </div>
      </div>
    </PageContainer>
  )
}
