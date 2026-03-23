import Link from 'next/link'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ImageIcon,
  Wand2,
  MessageSquare,
  Images,
  Search,
  Palette,
  Zap,
  Crown,
  Bolt,
} from 'lucide-react'

const FEATURES = [
  {
    href: '/text-to-image',
    icon: ImageIcon,
    title: 'Text to Image',
    description: 'Generate images from text prompts with model selection, aspect ratios, and resolutions up to 4K.',
    badges: ['All Models'],
    color: 'text-gcp-blue',
    bg: 'bg-gcp-blue/8',
  },
  {
    href: '/image-editing',
    icon: Wand2,
    title: 'Image Editing',
    description: 'Upload an image and describe edits. Add, remove, or modify elements with style preservation.',
    badges: ['Inpainting', 'Style Transfer'],
    color: 'text-gcp-green',
    bg: 'bg-gcp-green/8',
  },
  {
    href: '/multi-turn',
    icon: MessageSquare,
    title: 'Multi-turn Chat',
    description: 'Iteratively create and refine images through natural conversation.',
    badges: ['Conversational'],
    color: 'text-gcp-blue',
    bg: 'bg-gcp-blue/8',
  },
  {
    href: '/reference-images',
    icon: Images,
    title: 'Reference Images',
    description: 'Combine up to 14 reference images to generate new compositions with character consistency.',
    badges: ['Up to 14 Images'],
    color: 'text-gcp-yellow',
    bg: 'bg-gcp-yellow/10',
  },
  {
    href: '/search-grounding',
    icon: Search,
    title: 'Search Grounding',
    description: 'Generate images grounded in real-time data from Google Search and Image Search.',
    badges: ['Real-time', 'Google Search'],
    color: 'text-gcp-red',
    bg: 'bg-gcp-red/8',
  },
  {
    href: '/style-gallery',
    icon: Palette,
    title: 'Style Gallery',
    description: 'Browse prompt templates for photorealistic, sticker, product, comic, and more styles.',
    badges: ['10+ Templates'],
    color: 'text-gcp-green',
    bg: 'bg-gcp-green/8',
  },
]

const MODEL_CARDS = [
  {
    name: 'Nano Banana 2',
    id: 'gemini-3.1-flash-image-preview',
    description: 'Speed + 512 to 4K + Image Search',
    icon: Zap,
    color: 'text-gcp-blue',
    borderColor: 'border-gcp-blue/20',
    bgColor: 'bg-gcp-blue/5',
  },
  {
    name: 'Nano Banana Pro',
    id: 'gemini-3-pro-image-preview',
    description: 'Pro quality + Advanced reasoning',
    icon: Crown,
    color: 'text-gcp-green',
    borderColor: 'border-gcp-green/20',
    bgColor: 'bg-gcp-green/5',
  },
  {
    name: 'Nano Banana',
    id: 'gemini-2.5-flash-image',
    description: 'Fast + Low-latency tasks',
    icon: Bolt,
    color: 'text-gcp-yellow',
    borderColor: 'border-gcp-yellow/30',
    bgColor: 'bg-gcp-yellow/5',
  },
]

export default function HomePage() {
  return (
    <PageContainer
      title="Nano Banana"
      description="Explore Gemini's native image generation capabilities"
    >
      {/* Model Cards - Google Cloud info banner style */}
      <div className="mb-10 rounded-lg border border-gcp-blue/20 bg-gcp-blue/[0.03] p-6">
        <h2 className="text-sm font-medium text-foreground mb-4">Available Models</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MODEL_CARDS.map(m => (
            <div key={m.id} className={`rounded-lg border ${m.borderColor} ${m.bgColor} p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <m.icon className={`h-4 w-4 ${m.color}`} />
                <span className={`text-sm font-medium ${m.color}`}>{m.name}</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{m.id}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <h2 className="text-sm font-medium text-foreground mb-4">Features</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(feature => (
          <Link key={feature.href} href={feature.href}>
            <Card className="group h-full cursor-pointer border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-gcp-blue/30">
              <CardHeader className="pb-3">
                <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg}`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <CardTitle className="text-[15px] font-medium group-hover:text-gcp-blue transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-[13px] leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {feature.badges.map(badge => (
                    <Badge key={badge} variant="secondary" className="text-[11px] font-normal rounded-full px-2.5">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  )
}
