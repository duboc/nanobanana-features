'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ImageIcon,
  Wand2,
  MessageSquare,
  Images,
  Search,
  Palette,
  Home,
  Menu,
  X,
  Cloud,
  BookOpen,
} from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/text-to-image', label: 'Text to Image', icon: ImageIcon },
  { href: '/image-editing', label: 'Image Editing', icon: Wand2 },
  { href: '/multi-turn', label: 'Multi-turn Chat', icon: MessageSquare },
  { href: '/reference-images', label: 'Reference Images', icon: Images },
  { href: '/search-grounding', label: 'Search Grounding', icon: Search },
  { href: '/style-gallery', label: 'Style Gallery', icon: Palette },
  { href: '/docs', label: 'Documentation', icon: BookOpen },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Top Header Bar - Google Cloud style */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-border bg-white shadow-sm">
        <div className="flex items-center gap-2 px-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full p-2 hover:bg-muted md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <Cloud className="h-6 w-6 text-gcp-blue" />
            <span className="text-base font-medium text-foreground">
              Nano Banana
            </span>
            <span className="hidden sm:inline-block rounded bg-gcp-blue/10 px-2 py-0.5 text-[11px] font-medium text-gcp-blue">
              Image Generation
            </span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-3 px-4">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-gcp-green" />
            ADC Connected
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 mt-14 flex w-60 flex-col border-r border-border bg-sidebar transition-transform duration-200 md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-full px-4 py-2 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-gcp-blue/10 text-gcp-blue'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-[18px] w-[18px]', isActive && 'text-gcp-blue')} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3">
          <p className="text-[11px] text-muted-foreground">
            Powered by Gemini API
          </p>
          <p className="text-[11px] text-muted-foreground">
            GCP Application Default Credentials
          </p>
        </div>
      </aside>
    </>
  )
}
