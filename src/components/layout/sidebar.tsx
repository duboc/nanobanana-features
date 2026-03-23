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
} from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/text-to-image', label: 'Text to Image', icon: ImageIcon },
  { href: '/image-editing', label: 'Image Editing', icon: Wand2 },
  { href: '/multi-turn', label: 'Multi-turn Chat', icon: MessageSquare },
  { href: '/reference-images', label: 'Reference Images', icon: Images },
  { href: '/search-grounding', label: 'Search Grounding', icon: Search },
  { href: '/style-gallery', label: 'Style Gallery', icon: Palette },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-card p-2 shadow-lg md:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-300 md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600">
            <span className="text-lg">🍌</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Nano Banana</h1>
            <p className="text-[10px] text-muted-foreground">Image Generation Explorer</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className={cn('h-4 w-4', isActive && 'text-primary')} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-[10px] text-muted-foreground">
            Powered by Gemini API
          </p>
          <p className="text-[10px] text-muted-foreground">
            Using GCP Application Default Credentials
          </p>
        </div>
      </aside>
    </>
  )
}
