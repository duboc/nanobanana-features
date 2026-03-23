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
  RotateCw,
  Eraser,
  Layers,
  PenTool,
  Eye,
  Fingerprint,
  Globe,
  Info,
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
  { id: 'editing-techniques', label: 'Editing Techniques', icon: PenTool },
  { id: 'multi-turn', label: 'Multi-turn Conversations', icon: MessageSquare },
  { id: 'reference-images', label: 'Reference Images', icon: Images },
  { id: 'search-grounding', label: 'Search Grounding', icon: Search },
  { id: 'thinking', label: 'Thinking & Signatures', icon: Lightbulb },
  { id: 'config', label: 'Configuration Options', icon: Settings2 },
  { id: 'resolutions', label: 'Resolutions & Dimensions', icon: Maximize },
  { id: 'styles', label: 'Style Prompting', icon: Palette },
  { id: 'best-practices', label: 'Best Practices', icon: Zap },
  { id: 'technical-specs', label: 'Technical Specifications', icon: Info },
  { id: 'limitations', label: 'Limitations', icon: AlertTriangle },
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
            ['Max Input Tokens', '131,072', '65,536', '32,768'],
            ['Max Output Tokens', '32,768', '32,768', '32,768'],
            ['Knowledge Cutoff', 'Jan 2025', 'Jan 2025', 'Jun 2024'],
            ['Launch Stage', 'Preview', 'Preview', 'GA'],
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
              <li><strong>SynthID watermark</strong> &mdash; All generated images include an invisible SynthID watermark for provenance verification</li>
            </ul>

            <Tip>
              All generated images include a <strong>SynthID watermark</strong> &mdash; an invisible, robust digital
              watermark that can be detected to verify the image was AI-generated. This is applied automatically
              and cannot be disabled. Content Credentials (C2PA) metadata is also supported.
            </Tip>
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
              Supported input formats: <strong>PNG, JPEG, WebP, HEIC, HEIF</strong>. Images are sent as base64-encoded
              inline data. Max file size is <strong>7MB</strong> for inline data or <strong>30MB</strong> from Google Cloud
              Storage. Very large images increase latency &mdash; consider resizing before sending.
            </Warning>
          </section>

          {/* ============================================================== */}
          {/* EDITING TECHNIQUES */}
          {/* ============================================================== */}
          <section id="editing-techniques" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Editing Techniques</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Beyond basic editing, Nano Banana supports several advanced image manipulation techniques.
              These all work by providing one or more images alongside descriptive text prompts.
            </p>

            <div className="space-y-8">
              {/* Inpainting */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                  <Eraser className="h-4 w-4 text-gcp-blue" />
                  Inpainting (Semantic Masking)
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Conversationally define a &ldquo;mask&rdquo; by describing the area you want to edit.
                  The model identifies the region semantically and modifies only that part while preserving everything else.
                </p>
                <CodeBlock code={`// Inpainting: change only a specific element
const response = await ai.models.generateContent({
  model: 'gemini-3.1-flash-image-preview',
  contents: [{
    role: 'user',
    parts: [
      { inlineData: { data: livingRoomBase64, mimeType: 'image/png' } },
      { text: 'Change only the blue sofa to be a vintage, brown leather chesterfield sofa. Keep the rest of the room, including the pillows and lighting, unchanged.' },
    ],
  }],
  config: { responseModalities: ['TEXT', 'IMAGE'] },
})`} />
                <Tip>
                  Be explicit about what should remain unchanged. The more detail you give about the &ldquo;mask&rdquo; area,
                  the better the model isolates the edit region.
                </Tip>
              </div>

              {/* Style Transfer */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-gcp-green" />
                  Style Transfer
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Provide an image and ask the model to recreate its content in a completely different artistic style
                  while preserving the original composition.
                </p>
                <CodeBlock code={`// Style transfer: photo to Van Gogh painting
contents: [{
  role: 'user',
  parts: [
    { inlineData: { data: cityPhotoBase64, mimeType: 'image/png' } },
    { text: 'Transform this photograph of a city street at night into the style of Van Gogh\\'s "Starry Night". Preserve the composition of buildings and cars, but render with swirling, impasto brushstrokes and a palette of deep blues and bright yellows.' },
  ],
}]`} />
              </div>

              {/* Adding / Removing Elements */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-gcp-yellow" />
                  Adding & Removing Elements
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add new objects to an image or remove existing ones. The model automatically matches the
                  original style, lighting, and perspective.
                </p>
                <CodeBlock code={`// Add an element to an existing image
contents: [{
  role: 'user',
  parts: [
    { text: 'Add a small, knitted wizard hat on the cat\\'s head. Make it look comfortable and not falling off.' },
    { inlineData: { data: catPhotoBase64, mimeType: 'image/png' } },
  ],
}]`} />
              </div>

              {/* Sketch to Photo */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                  <PenTool className="h-4 w-4 text-gcp-red" />
                  Sketch to Photo (Bring to Life)
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload a rough sketch or drawing and ask the model to refine it into a finished, polished image.
                  Great for concept art, product design, and architectural visualization.
                </p>
                <CodeBlock code={`// Turn a sketch into a polished photo
contents: [{
  role: 'user',
  parts: [
    { inlineData: { data: sketchBase64, mimeType: 'image/png' } },
    { text: 'Turn this rough pencil sketch of a futuristic car into a polished photo of the finished concept car in a showroom. Keep the sleek lines from the sketch but add metallic blue paint and neon rim lighting.' },
  ],
}]`} />
              </div>

              {/* Character Consistency / 360 View */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                  <RotateCw className="h-4 w-4 text-gcp-blue" />
                  Character Consistency & 360 Views
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Generate consistent views of a character from different angles by including previously
                  generated images as references. This maintains identity across multiple generations.
                </p>
                <CodeBlock code={`// Generate a profile view from a front-facing photo
contents: [{
  role: 'user',
  parts: [
    { text: 'A studio portrait of this person against white, in profile looking right' },
    { inlineData: { data: frontViewBase64, mimeType: 'image/png' } },
  ],
}]

// Then use both images for a 3/4 view
contents: [{
  role: 'user',
  parts: [
    { text: 'Generate a 3/4 view of this same person, looking slightly left' },
    { inlineData: { data: frontViewBase64, mimeType: 'image/png' } },
    { inlineData: { data: profileViewBase64, mimeType: 'image/png' } },
  ],
}]`} />
              </div>

              {/* High-Fidelity Detail Preservation */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gcp-green" />
                  High-Fidelity Detail Preservation
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  When critical details (faces, logos, text) must be preserved during editing,
                  describe them in great detail alongside your edit request.
                </p>
                <CodeBlock code={`// Preserve face while adding a logo to a t-shirt
contents: [{
  role: 'user',
  parts: [
    { inlineData: { data: personBase64, mimeType: 'image/png' } },
    { inlineData: { data: logoBase64, mimeType: 'image/png' } },
    { text: 'Take the person from the first image (brown hair, blue eyes, neutral expression). Add the logo from the second image onto their black t-shirt. Ensure the face and features remain completely unchanged. The logo should look naturally printed on the fabric, following the folds.' },
  ],
}]`} />
                <Tip>
                  The more specific you are about features that must be preserved, the better the model
                  retains them. Describe distinguishing features explicitly in your prompt.
                </Tip>
              </div>

              {/* Advanced Composition */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-gcp-yellow" />
                  Advanced Composition (Multiple Images)
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Combine elements from multiple source images into a single, cohesive scene.
                  Perfect for e-commerce mockups, creative collages, and virtual try-on.
                </p>
                <CodeBlock code={`// Virtual try-on: combine product + model
contents: [{
  role: 'user',
  parts: [
    { inlineData: { data: dressBase64, mimeType: 'image/png' } },
    { inlineData: { data: modelBase64, mimeType: 'image/png' } },
    { text: 'Create a professional e-commerce fashion photo. Take the blue floral dress from the first image and let the woman from the second image wear it. Generate a realistic, full-body shot with adjusted lighting and shadows.' },
  ],
}]`} />
              </div>
            </div>
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
            <h2 className="text-2xl font-semibold text-foreground mb-4">Thinking & Thought Signatures</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Gemini 3 image models use a <strong>thinking process</strong> to reason through complex prompts.
              The model generates up to <strong>2 interim &ldquo;thought images&rdquo;</strong> to test composition
              and logic before producing the final output. Thinking is <strong>enabled by default and cannot be disabled</strong>.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Controlling Thinking (Flash 3.1 Only)</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Only Nano Banana 2 (Flash 3.1) allows configuring the thinking level. Pro 3 and Flash 2.5
              use their default thinking behavior without adjustment.
            </p>
            <CodeBlock code={`config: {
  responseModalities: ['TEXT', 'IMAGE'],
  thinkingConfig: {
    thinkingLevel: 'High',        // 'Minimal' or 'High' (Flash 3.1 only)
    includeThoughts: true,        // Show reasoning tokens in response
  },
}`} />

            <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-foreground mb-2">Minimal (Default)</h4>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                  <li>Fastest response time</li>
                  <li>Good for simple, straightforward prompts</li>
                  <li>Suitable for high-volume, low-latency workflows</li>
                  <li>Still uses some thinking (not zero)</li>
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
              Thinking tokens are <strong>billed regardless</strong> of whether
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded mx-1">includeThoughts</code> is true or false.
              The thinking process always runs &mdash; you&apos;re just choosing whether to see it.
            </Warning>

            <h3 className="text-lg font-medium text-foreground mt-8 mb-3">Thought Signatures</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Thought signatures are <strong>encrypted representations</strong> of the model&apos;s internal thought
              process. They preserve reasoning context across multi-turn interactions. You <strong>must pass
              them back exactly as received</strong> in subsequent turns &mdash; failure to do so may cause responses to fail.
            </p>

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-3 my-4">
              <h4 className="text-sm font-semibold text-foreground">Signature Rules</h4>
              <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4">
                <li>All <code className="bg-muted px-1 py-0.5 rounded">inline_data</code> image parts in the
                  final response (not thoughts) include a <code className="bg-muted px-1 py-0.5 rounded">thought_signature</code></li>
                <li>The <strong>first text part</strong> after any thought parts also gets a signature</li>
                <li>Image parts inside thoughts do <strong>not</strong> have signatures</li>
                <li>Follow-up text parts after the first one do <strong>not</strong> have signatures</li>
              </ul>
            </div>

            <CodeBlock code={`// Example response structure with thought signatures:
[
  { inlineData: { data: "...", mimeType: "image/png" }, thought: true },
  // ^ Thought image - NO signature
  { text: "Here is the result...", thought_signature: "<Signature_A>" },
  // ^ First non-thought text - HAS signature
  { inlineData: { data: "...", mimeType: "image/png" }, thought_signature: "<Signature_B>" },
  // ^ Final image - HAS signature
  { text: "You can see the details..." },
  // ^ Follow-up text - NO signature
]`} />

            <Tip>
              If you use the official Google Gen AI SDKs with the <strong>chat feature</strong> (or append the full
              model response object directly to history), thought signatures are handled automatically. You do
              not need to manually extract or manage them.
            </Tip>
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
            <h2 className="text-2xl font-semibold text-foreground mb-4">Resolutions & Pixel Dimensions</h2>

            <Warning>
              Resolution values <strong>must use uppercase K</strong> (e.g., <code className="text-xs bg-muted px-1.5 py-0.5 rounded">1K</code>,
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded mx-1">2K</code>,
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">4K</code>). Lowercase values
              (e.g., <code className="text-xs bg-muted px-1.5 py-0.5 rounded">1k</code>) will be rejected.
              The <code className="text-xs bg-muted px-1.5 py-0.5 rounded">512</code> value does not use a K suffix.
            </Warning>

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

            <h3 className="text-lg font-medium text-foreground mt-8 mb-3">Pixel Dimensions by Aspect Ratio (Flash 3.1)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Exact pixel dimensions for each aspect ratio and resolution combination. The model defaults
              to matching output size to input image size, or 1:1 squares when no input image is provided.
            </p>
            <div className="my-4 overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium">Ratio</th>
                    <th className="px-3 py-2 text-center font-medium">512</th>
                    <th className="px-3 py-2 text-center font-medium">1K</th>
                    <th className="px-3 py-2 text-center font-medium">2K</th>
                    <th className="px-3 py-2 text-center font-medium">4K</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1:1', '512x512', '1024x1024', '2048x2048', '4096x4096'],
                    ['2:3', '424x632', '848x1264', '1696x2528', '3392x5056'],
                    ['3:2', '632x424', '1264x848', '2528x1696', '5056x3392'],
                    ['3:4', '448x600', '896x1200', '1792x2400', '3584x4800'],
                    ['4:3', '600x448', '1200x896', '2400x1792', '4800x3584'],
                    ['4:5', '464x576', '928x1152', '1856x2304', '3712x4608'],
                    ['5:4', '576x464', '1152x928', '2304x1856', '4608x3712'],
                    ['9:16', '384x688', '768x1376', '1536x2752', '3072x5504'],
                    ['16:9', '688x384', '1376x768', '2752x1536', '5504x3072'],
                    ['21:9', '792x168', '1584x672', '3168x1344', '6336x2688'],
                    ['1:4', '256x1024', '512x2048', '1024x4096', '2048x8192'],
                    ['1:8', '192x1536', '384x3072', '768x6144', '1536x12288'],
                    ['4:1', '1024x256', '2048x512', '4096x1024', '8192x2048'],
                    ['8:1', '1536x192', '3072x384', '6144x768', '12288x1536'],
                  ].map(([ratio, r512, r1k, r2k, r4k], i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-3 py-1.5 font-medium">{ratio}</td>
                      <td className="px-3 py-1.5 text-center text-muted-foreground">{r512}</td>
                      <td className="px-3 py-1.5 text-center text-muted-foreground">{r1k}</td>
                      <td className="px-3 py-1.5 text-center text-muted-foreground">{r2k}</td>
                      <td className="px-3 py-1.5 text-center text-muted-foreground">{r4k}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-8 mb-3">Output Token Costs</h3>
            <div className="my-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Resolution</th>
                    <th className="px-4 py-3 text-center font-medium">Output Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">512</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">747 tokens per image</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">1K</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">1,120 tokens per image</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">2K</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">1,120 tokens per image</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">4K</td>
                    <td className="px-4 py-2.5 text-center text-muted-foreground">2,000 tokens per image</td>
                  </tr>
                </tbody>
              </table>
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
                {
                  name: 'Minimalist / Negative Space',
                  template: 'A minimalist composition featuring a single {subject} positioned in the {position} of the frame. The background is a vast, empty {color} canvas, creating significant negative space. Soft, subtle lighting.',
                  tip: 'Excellent for backgrounds where text will be overlaid. Specify the subject position for control.',
                },
                {
                  name: 'Search-Grounded Data Visual',
                  template: 'Visualize {topic} as a {format}. Use current real-time data. Add {visual_elements}.',
                  tip: 'Enable Google Search grounding for this template. Great for weather, sports, news, and data visualizations.',
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
                  <li><strong>Use semantic negatives</strong> &mdash; Instead of &ldquo;no cars&rdquo;, describe the scene positively: &ldquo;an empty, deserted street with no signs of traffic&rdquo;</li>
                  <li><strong>Break complex scenes into steps</strong> &mdash; &ldquo;First, create a misty forest background. Then, add a stone altar. Finally, place a glowing sword on top.&rdquo;</li>
                  <li><strong>Generate text first</strong> &mdash; When creating images with text, first generate the text content, then ask for an image including it</li>
                  <li><strong>Provide context and intent</strong> &mdash; Explain the purpose: &ldquo;for a high-end skincare brand&rdquo; yields better results than generic instructions</li>
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
                  <li><strong>Don&apos;t forget thought signatures</strong> &mdash; In multi-turn, pass thought signatures back exactly as received or responses may fail</li>
                </ul>
              </div>
            </div>

            <Tip>
              <strong>System instructions</strong> are supported by all three models. Use them to set persistent
              behavior, style preferences, or safety guidelines that apply across all turns in a conversation.
            </Tip>

            <Tip>
              <strong>Batch API:</strong> For high-volume image generation, use the Batch API for higher rate limits
              in exchange for up to 24-hour turnaround. Ideal for generating large datasets of images offline.
            </Tip>
          </section>

          {/* ============================================================== */}
          {/* TECHNICAL SPECIFICATIONS */}
          {/* ============================================================== */}
          <section id="technical-specs" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Technical Specifications</h2>

            <div className="my-6 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Specification</th>
                    <th className="px-4 py-3 text-center font-medium text-gcp-blue">Flash 3.1</th>
                    <th className="px-4 py-3 text-center font-medium text-gcp-green">Pro 3</th>
                    <th className="px-4 py-3 text-center font-medium text-gcp-yellow">Flash 2.5</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Max Input Tokens', '131,072', '65,536', '32,768'],
                    ['Max Output Tokens', '32,768', '32,768', '32,768'],
                    ['Max Images per Prompt', '14', '14', '3'],
                    ['Max Output Images', 'Limited by tokens', 'Limited by tokens', '10'],
                    ['Max File Size (Inline)', '7 MB', '7 MB', '7 MB'],
                    ['Max File Size (GCS)', '30 MB', '30 MB', '30 MB'],
                    ['Input Size Limit', '500 MB', '500 MB', '500 MB'],
                    ['Knowledge Cutoff', 'January 2025', 'January 2025', 'June 2024'],
                    ['Launch Stage', 'Public Preview', 'Public Preview', 'GA'],
                    ['Default Temperature', '1.0', '0.0 - 2.0', '1.0'],
                    ['Default topP', '0.95', '0.95', '0.95'],
                  ].map(([spec, flash, pro, v25], i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 font-medium text-foreground">{spec}</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground text-xs">{flash}</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground text-xs">{pro}</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground text-xs">{v25}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Supported Image MIME Types</h3>
            <div className="flex flex-wrap gap-2 my-4">
              {['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'].map(mime => (
                <code key={mime} className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium">{mime}</code>
              ))}
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Supported Capabilities</h3>
            <div className="my-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Capability</th>
                    <th className="px-4 py-3 text-center font-medium">Flash 3.1</th>
                    <th className="px-4 py-3 text-center font-medium">Pro 3</th>
                    <th className="px-4 py-3 text-center font-medium">Flash 2.5</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['System Instructions', 'yes', 'yes', 'yes'],
                    ['Google Search Grounding', 'yes', 'yes', 'no'],
                    ['Image Search Grounding', 'yes', 'no', 'no'],
                    ['Thinking (configurable)', 'yes', 'no', 'no'],
                    ['Thinking (default)', 'yes', 'yes', 'no'],
                    ['Content Credentials (C2PA)', 'yes', 'yes', 'yes'],
                    ['SynthID Watermark', 'yes', 'yes', 'yes'],
                    ['Count Tokens', 'yes', 'yes', 'yes'],
                    ['Batch Prediction', 'yes', 'yes', 'yes'],
                    ['Code Execution', 'no', 'no', 'no'],
                    ['Function Calling', 'no', 'no', 'no'],
                    ['Context Caching', 'no', 'no', 'no'],
                  ].map(([cap, flash, pro, v25], i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-medium text-foreground">{cap}</td>
                      <td className="px-4 py-2 text-center">
                        {flash === 'yes' ? <CheckCircle2 className="inline h-4 w-4 text-gcp-green" /> : <span className="text-muted-foreground">-</span>}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {pro === 'yes' ? <CheckCircle2 className="inline h-4 w-4 text-gcp-green" /> : <span className="text-muted-foreground">-</span>}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {v25 === 'yes' ? <CheckCircle2 className="inline h-4 w-4 text-gcp-green" /> : <span className="text-muted-foreground">-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Deployment Regions</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Flash 3.1 and Pro 3 are available in the <strong>global</strong> region. Flash 2.5 (GA) is available
              in additional regions including us-central1, us-east1, us-west1, europe-west1, europe-west4, and more.
            </p>
          </section>

          {/* ============================================================== */}
          {/* LIMITATIONS */}
          {/* ============================================================== */}
          <section id="limitations" className="scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Limitations</h2>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-foreground mb-2">Language Support</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  For best performance, use the following languages:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['EN', 'AR', 'DE', 'ES', 'FR', 'HI', 'ID', 'IT', 'JA', 'KO', 'PT', 'RU', 'UA', 'VI', 'ZH'].map(lang => (
                    <span key={lang} className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium">{lang}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-foreground mb-2">Input Limitations</h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
                  <li>Image generation does <strong>not support audio or video inputs</strong></li>
                  <li>Flash 2.5 works best with up to <strong>3 images</strong> as input</li>
                  <li>Pro 3 supports <strong>5 images with high fidelity</strong>, up to 14 total</li>
                  <li>Flash 3.1 supports <strong>4 character images</strong> and <strong>10 object images</strong></li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-foreground mb-2">Output Limitations</h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
                  <li>The model <strong>won&apos;t always</strong> follow the exact number of output images requested</li>
                  <li>Flash 2.5 is limited to a maximum of <strong>10 output images</strong> per prompt</li>
                  <li>Flash 3.1 and Pro 3 are limited by the <strong>32,768 output token</strong> limit</li>
                  <li>All generated images include a <strong>SynthID watermark</strong> (cannot be disabled)</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-foreground mb-2">Feature Limitations</h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
                  <li>Search grounding with image search (Flash 3.1) does <strong>not support using
                    real-world images of people</strong> from web search</li>
                  <li><strong>Function calling</strong>, <strong>code execution</strong>, and <strong>context
                    caching</strong> are not supported by any image generation model</li>
                  <li>When using search grounding, image-based search results are <strong>not passed to the
                    generation model</strong> in standard web search mode</li>
                  <li>Text rendering works best when text is <strong>short and clearly specified</strong> in quotes</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-foreground mb-2">Image Search Display Requirements</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  When using Image Search within Grounding with Google Search, you must comply with:
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
                  <li><strong>Source attribution</strong> &mdash; Provide a link to the webpage containing the source image
                    (the containing page, not the image file itself)</li>
                  <li><strong>Direct navigation</strong> &mdash; If displaying source images, provide a direct, single-click
                    path from the source image to its containing webpage. Multi-click paths or intermediate viewers
                    are not permitted.</li>
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
