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
} from 'lucide-react'

const FEATURES = [
  {
    href: '/text-to-image',
    icon: ImageIcon,
    title: 'Text to Image',
    description: 'Generate stunning images from text prompts. Choose from three models, multiple aspect ratios, and resolutions up to 4K.',
    badges: ['Nano Banana 2', 'Pro', 'Classic'],
    gradient: 'from-yellow-500/20 to-orange-500/20',
  },
  {
    href: '/image-editing',
    icon: Wand2,
    title: 'Image Editing',
    description: 'Upload an image and describe your changes. Add, remove, or modify elements while preserving style and lighting.',
    badges: ['Inpainting', 'Style Transfer'],
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    href: '/multi-turn',
    icon: MessageSquare,
    title: 'Multi-turn Chat',
    description: 'Have a conversation to iteratively create and refine images. Each turn builds on the previous context.',
    badges: ['Conversational', 'Iterative'],
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    href: '/reference-images',
    icon: Images,
    title: 'Reference Images',
    description: 'Combine up to 14 reference images to generate new compositions. Mix characters, objects, and styles.',
    badges: ['Up to 14 Images', 'Composition'],
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    href: '/search-grounding',
    icon: Search,
    title: 'Search Grounding',
    description: 'Generate images based on real-time information from Google Search. Perfect for current events and data visualization.',
    badges: ['Real-time', 'Google Search'],
    gradient: 'from-red-500/20 to-rose-500/20',
  },
  {
    href: '/style-gallery',
    icon: Palette,
    title: 'Style Gallery',
    description: 'Browse pre-built prompt templates for photorealistic scenes, stickers, product mockups, comics, and more.',
    badges: ['Templates', '10+ Styles'],
    gradient: 'from-indigo-500/20 to-violet-500/20',
  },
]

export default function HomePage() {
  return (
    <PageContainer
      title="Nano Banana"
      description="Explore all features of Gemini's native image generation capabilities"
    >
      {/* Hero Section */}
      <div className="mb-12 rounded-2xl border border-border bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-pink-500/5 p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg">
            <span className="text-3xl">🍌</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Image Generation Explorer</h2>
            <p className="text-muted-foreground">Three models. Endless possibilities.</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-sm font-semibold text-primary">Nano Banana 2</p>
            <p className="text-xs text-muted-foreground mt-1">gemini-3.1-flash-image-preview</p>
            <p className="text-xs text-muted-foreground mt-1">Speed + 512 to 4K + Image Search</p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-sm font-semibold text-primary">Nano Banana Pro</p>
            <p className="text-xs text-muted-foreground mt-1">gemini-3-pro-image-preview</p>
            <p className="text-xs text-muted-foreground mt-1">Pro quality + Advanced reasoning</p>
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-sm font-semibold text-primary">Nano Banana</p>
            <p className="text-xs text-muted-foreground mt-1">gemini-2.5-flash-image</p>
            <p className="text-xs text-muted-foreground mt-1">Fast + Low-latency tasks</p>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(feature => (
          <Link key={feature.href} href={feature.href}>
            <Card className="group h-full cursor-pointer border-border transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {feature.badges.map(badge => (
                    <Badge key={badge} variant="secondary" className="text-xs">
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
