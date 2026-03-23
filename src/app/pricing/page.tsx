'use client'

import { useState, useMemo } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { cn } from '@/lib/utils'
import {
  Calculator,
  DollarSign,
  ImageIcon,
  MessageSquare,
  Search,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Pricing data
// ---------------------------------------------------------------------------
type ModelKey = 'flash31' | 'pro3' | 'flash25'

interface ModelPricing {
  id: string
  name: string
  color: string
  inputPer1M: number
  textOutputPer1M: number
  imageOutputPer1M: number
  resolutions: { label: string; tokens: number }[]
}

const PRICING: Record<ModelKey, ModelPricing> = {
  flash31: {
    id: 'gemini-3.1-flash-image-preview',
    name: 'Nano Banana 2 (Flash 3.1)',
    color: 'gcp-blue',
    inputPer1M: 0.5,
    textOutputPer1M: 3.0,
    imageOutputPer1M: 60.0,
    resolutions: [
      { label: '512', tokens: 747 },
      { label: '1K', tokens: 1120 },
      { label: '2K', tokens: 1120 },
      { label: '4K', tokens: 2000 },
    ],
  },
  pro3: {
    id: 'gemini-3-pro-image-preview',
    name: 'Nano Banana Pro (Pro 3)',
    color: 'gcp-green',
    inputPer1M: 2.0,
    textOutputPer1M: 12.0,
    imageOutputPer1M: 120.0,
    resolutions: [
      { label: '1K', tokens: 1120 },
      { label: '2K', tokens: 1120 },
      { label: '4K', tokens: 2000 },
    ],
  },
  flash25: {
    id: 'gemini-2.5-flash-image',
    name: 'Nano Banana (Flash 2.5)',
    color: 'gcp-yellow',
    inputPer1M: 0.3,
    textOutputPer1M: 2.5,
    imageOutputPer1M: 30.0,
    resolutions: [
      { label: '1K', tokens: 1290 },
    ],
  },
}

const SEARCH_FREE_QUERIES = 5000
const SEARCH_COST_PER_1000 = 14.0

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatCost(cost: number): string {
  if (cost < 0.001) return '$0.00'
  if (cost < 0.01) return `$${cost.toFixed(4)}`
  if (cost < 1) return `$${cost.toFixed(3)}`
  return `$${cost.toFixed(2)}`
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function PricingPage() {
  const [selectedModel, setSelectedModel] = useState<ModelKey>('flash31')
  const [resolution, setResolution] = useState('1K')
  const [numImages, setNumImages] = useState(1)
  const [inputTokens, setInputTokens] = useState(500)
  const [textOutputTokens, setTextOutputTokens] = useState(200)
  const [includeSearch, setIncludeSearch] = useState(false)
  const [searchQueries, setSearchQueries] = useState(1)
  const [monthlyVolume, setMonthlyVolume] = useState(100)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const model = PRICING[selectedModel]

  // Find valid resolution
  const validResolution = model.resolutions.find(r => r.label === resolution) || model.resolutions[0]

  // Ensure resolution is valid when switching models
  const effectiveResolution = validResolution

  const costs = useMemo(() => {
    const inputCost = (inputTokens / 1_000_000) * model.inputPer1M
    const textOutputCost = (textOutputTokens / 1_000_000) * model.textOutputPer1M
    const imageTokens = effectiveResolution.tokens * numImages
    const imageOutputCost = (imageTokens / 1_000_000) * model.imageOutputPer1M
    const perRequestCost = inputCost + textOutputCost + imageOutputCost

    // Monthly
    const monthlyBaseCost = perRequestCost * monthlyVolume

    // Search costs
    let monthlySearchCost = 0
    if (includeSearch) {
      const totalQueries = searchQueries * monthlyVolume
      const billableQueries = Math.max(0, totalQueries - SEARCH_FREE_QUERIES)
      monthlySearchCost = (billableQueries / 1000) * SEARCH_COST_PER_1000
    }

    const monthlyTotalCost = monthlyBaseCost + monthlySearchCost

    return {
      inputCost,
      textOutputCost,
      imageTokens,
      imageOutputCost,
      perRequestCost,
      monthlyBaseCost,
      monthlySearchCost,
      monthlyTotalCost,
    }
  }, [selectedModel, effectiveResolution, numImages, inputTokens, textOutputTokens, includeSearch, searchQueries, monthlyVolume, model])

  return (
    <PageContainer
      title="Pricing Calculator"
      description="Estimate costs for Nano Banana image generation across all models and configurations"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Configuration */}
        <div className="lg:col-span-1 space-y-5">
          {/* Model Selection */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Model & Resolution
            </h3>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-foreground">Model</label>
              <div className="space-y-1.5">
                {(Object.entries(PRICING) as [ModelKey, ModelPricing][]).map(([key, m]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedModel(key)
                      // Reset resolution if not supported
                      if (!m.resolutions.find(r => r.label === resolution)) {
                        setResolution(m.resolutions[0].label)
                      }
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
                      selectedModel === key
                        ? `border-${m.color}/40 bg-${m.color}/5`
                        : 'border-border hover:border-muted-foreground/30'
                    )}
                    style={selectedModel === key ? {
                      borderColor: key === 'flash31' ? '#4285f4' : key === 'pro3' ? '#34a853' : '#fbbc04',
                      backgroundColor: key === 'flash31' ? '#4285f410' : key === 'pro3' ? '#34a85310' : '#fbbc0410',
                    } : undefined}
                  >
                    <div className="flex-1">
                      <p className="text-[13px] font-medium">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">{m.id}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-foreground">Resolution</label>
              <div className="inline-flex rounded-full border border-border bg-muted/50 p-0.5">
                {model.resolutions.map(res => (
                  <button
                    key={res.label}
                    onClick={() => setResolution(res.label)}
                    className={cn(
                      'rounded-full px-4 py-1 text-[13px] font-medium transition-all',
                      effectiveResolution.label === res.label
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {res.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {formatNumber(effectiveResolution.tokens)} image output tokens per image
              </p>
            </div>
          </div>

          {/* Request Parameters */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Request Parameters
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-foreground">Images per request</label>
                <span className="text-[13px] font-mono text-muted-foreground">{numImages}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={numImages}
                onChange={e => setNumImages(Number(e.target.value))}
                className="w-full accent-[#4285f4]"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1</span><span>10</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-foreground">Input tokens (prompt)</label>
                <span className="text-[13px] font-mono text-muted-foreground">{formatNumber(inputTokens)}</span>
              </div>
              <input
                type="range"
                min={50}
                max={10000}
                step={50}
                value={inputTokens}
                onChange={e => setInputTokens(Number(e.target.value))}
                className="w-full accent-[#4285f4]"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>50</span><span>10,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-foreground">Text output tokens</label>
                <span className="text-[13px] font-mono text-muted-foreground">{formatNumber(textOutputTokens)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={2000}
                step={50}
                value={textOutputTokens}
                onChange={e => setTextOutputTokens(Number(e.target.value))}
                className="w-full accent-[#4285f4]"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0 (image only)</span><span>2,000</span>
              </div>
            </div>
          </div>

          {/* Search Grounding */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Search Grounding
            </h3>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSearch}
                onChange={e => setIncludeSearch(e.target.checked)}
                className="rounded border-border accent-[#4285f4]"
              />
              <span className="text-[13px] font-medium text-foreground">Include Google Search</span>
            </label>
            {includeSearch && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-medium text-foreground">Queries per request</label>
                  <span className="text-[13px] font-mono text-muted-foreground">{searchQueries}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={searchQueries}
                  onChange={e => setSearchQueries(Number(e.target.value))}
                  className="w-full accent-[#4285f4]"
                />
                <p className="text-[11px] text-muted-foreground">
                  {formatNumber(SEARCH_FREE_QUERIES)} free queries/month, then ${SEARCH_COST_PER_1000}/1,000 queries
                </p>
              </div>
            )}
          </div>

          {/* Monthly Volume */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Monthly Volume
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-foreground">Requests per month</label>
                <span className="text-[13px] font-mono text-muted-foreground">{formatNumber(monthlyVolume)}</span>
              </div>
              <input
                type="range"
                min={1}
                max={100000}
                step={1}
                value={monthlyVolume}
                onChange={e => setMonthlyVolume(Number(e.target.value))}
                className="w-full accent-[#4285f4]"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1</span><span>100,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Per-Request Cost Card */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-4 w-4 text-gcp-blue" />
              <h3 className="text-sm font-semibold text-foreground">Per-Request Cost</h3>
            </div>

            <div className="text-4xl font-bold text-foreground mb-2">
              {formatCost(costs.perRequestCost)}
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              per API call generating {numImages} image{numImages > 1 ? 's' : ''} at {effectiveResolution.label} resolution
            </p>

            {/* Cost breakdown bars */}
            <div className="space-y-3">
              {[
                { label: 'Input tokens', cost: costs.inputCost, tokens: inputTokens, color: '#4285f4' },
                { label: 'Text output', cost: costs.textOutputCost, tokens: textOutputTokens, color: '#34a853' },
                { label: 'Image output', cost: costs.imageOutputCost, tokens: costs.imageTokens, color: '#ea4335' },
              ].map(item => {
                const pct = costs.perRequestCost > 0 ? (item.cost / costs.perRequestCost) * 100 : 0
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {item.label} ({formatNumber(item.tokens)} tokens)
                      </span>
                      <span className="font-medium">{formatCost(item.cost)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(pct, 0.5)}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Monthly Estimate Card */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-4 w-4 text-gcp-green" />
              <h3 className="text-sm font-semibold text-foreground">Monthly Estimate</h3>
            </div>

            <div className="text-4xl font-bold text-foreground mb-2">
              {formatCost(costs.monthlyTotalCost)}
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              for {formatNumber(monthlyVolume)} requests/month
              {includeSearch ? ` + search grounding` : ''}
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-muted-foreground uppercase">Generation</span>
                </div>
                <p className="text-lg font-semibold">{formatCost(costs.monthlyBaseCost)}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatNumber(monthlyVolume * numImages)} images total
                </p>
              </div>
              {includeSearch && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-medium text-muted-foreground uppercase">Search</span>
                  </div>
                  <p className="text-lg font-semibold">{formatCost(costs.monthlySearchCost)}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatNumber(searchQueries * monthlyVolume)} queries
                    {searchQueries * monthlyVolume <= SEARCH_FREE_QUERIES ? ' (within free tier)' : ''}
                  </p>
                </div>
              )}
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-medium text-muted-foreground uppercase">Per Image</span>
                </div>
                <p className="text-lg font-semibold">
                  {formatCost(costs.monthlyTotalCost / Math.max(monthlyVolume * numImages, 1))}
                </p>
                <p className="text-[11px] text-muted-foreground">avg cost per image</p>
              </div>
            </div>
          </div>

          {/* Model Comparison */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Quick Model Comparison</h3>
              <span className="text-[11px] text-muted-foreground">
                {numImages} image{numImages > 1 ? 's' : ''}, {formatNumber(inputTokens)} input + {formatNumber(textOutputTokens)} text output tokens
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Model</th>
                    <th className="px-4 py-3 text-center font-medium">1K Cost</th>
                    <th className="px-4 py-3 text-center font-medium">2K Cost</th>
                    <th className="px-4 py-3 text-center font-medium">4K Cost</th>
                    <th className="px-4 py-3 text-center font-medium">Monthly (1K)</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.entries(PRICING) as [ModelKey, ModelPricing][]).map(([key, m]) => {
                    function calcCost(res: { tokens: number }) {
                      const inp = (inputTokens / 1_000_000) * m.inputPer1M
                      const txt = (textOutputTokens / 1_000_000) * m.textOutputPer1M
                      const img = ((res.tokens * numImages) / 1_000_000) * m.imageOutputPer1M
                      return inp + txt + img
                    }
                    const r1k = m.resolutions.find(r => r.label === '1K')
                    const r2k = m.resolutions.find(r => r.label === '2K')
                    const r4k = m.resolutions.find(r => r.label === '4K')
                    const cost1k = r1k ? calcCost(r1k) : null
                    const cost2k = r2k ? calcCost(r2k) : null
                    const cost4k = r4k ? calcCost(r4k) : null

                    return (
                      <tr key={key} className={cn('border-b border-border last:border-0', selectedModel === key && 'bg-muted/30')}>
                        <td className="px-4 py-2.5">
                          <span className="font-medium text-[13px]">{m.name.split(' (')[0]}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center text-[13px]">
                          {cost1k !== null ? formatCost(cost1k) : '-'}
                        </td>
                        <td className="px-4 py-2.5 text-center text-[13px]">
                          {cost2k !== null ? formatCost(cost2k) : '-'}
                        </td>
                        <td className="px-4 py-2.5 text-center text-[13px]">
                          {cost4k !== null ? formatCost(cost4k) : '-'}
                        </td>
                        <td className="px-4 py-2.5 text-center text-[13px] font-medium">
                          {cost1k !== null ? formatCost(cost1k * monthlyVolume) : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed breakdown toggle */}
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center gap-2 text-sm text-gcp-blue hover:underline"
          >
            {showBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showBreakdown ? 'Hide' : 'Show'} detailed rate card
          </button>

          {showBreakdown && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-semibold text-foreground">Rate Card</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Type</th>
                      <th className="px-4 py-3 text-center font-medium text-gcp-blue">Flash 3.1</th>
                      <th className="px-4 py-3 text-center font-medium text-gcp-green">Pro 3</th>
                      <th className="px-4 py-3 text-center font-medium text-gcp-yellow">Flash 2.5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 font-medium">Input (text, image)</td>
                      <td className="px-4 py-2.5 text-center">$0.50 / 1M</td>
                      <td className="px-4 py-2.5 text-center">$2.00 / 1M</td>
                      <td className="px-4 py-2.5 text-center">$0.30 / 1M</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 font-medium">Text output</td>
                      <td className="px-4 py-2.5 text-center">$3.00 / 1M</td>
                      <td className="px-4 py-2.5 text-center">$12.00 / 1M</td>
                      <td className="px-4 py-2.5 text-center">$2.50 / 1M</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 font-medium">Image output</td>
                      <td className="px-4 py-2.5 text-center">$60.00 / 1M</td>
                      <td className="px-4 py-2.5 text-center">$120.00 / 1M</td>
                      <td className="px-4 py-2.5 text-center">$30.00 / 1M</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="text-[13px] font-medium text-foreground mt-4">Image Output Tokens by Resolution</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Resolution</th>
                      <th className="px-4 py-3 text-center font-medium">Flash 3.1</th>
                      <th className="px-4 py-3 text-center font-medium">Pro 3</th>
                      <th className="px-4 py-3 text-center font-medium">Flash 2.5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 font-medium">512</td>
                      <td className="px-4 py-2.5 text-center">747</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground">-</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground">-</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 font-medium">1K</td>
                      <td className="px-4 py-2.5 text-center">1,120</td>
                      <td className="px-4 py-2.5 text-center">1,120</td>
                      <td className="px-4 py-2.5 text-center">1,290</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 font-medium">2K</td>
                      <td className="px-4 py-2.5 text-center">1,120</td>
                      <td className="px-4 py-2.5 text-center">1,120</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground">-</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-2.5 font-medium">4K</td>
                      <td className="px-4 py-2.5 text-center">2,000</td>
                      <td className="px-4 py-2.5 text-center">2,000</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h4 className="text-[13px] font-medium text-foreground mt-4">Cost Per Image (image output tokens only)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Resolution</th>
                      <th className="px-4 py-3 text-center font-medium">Flash 3.1</th>
                      <th className="px-4 py-3 text-center font-medium">Pro 3</th>
                      <th className="px-4 py-3 text-center font-medium">Flash 2.5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { res: '512', flash: 747, pro: null, v25: null },
                      { res: '1K', flash: 1120, pro: 1120, v25: 1290 },
                      { res: '2K', flash: 1120, pro: 1120, v25: null },
                      { res: '4K', flash: 2000, pro: 2000, v25: null },
                    ].map(row => (
                      <tr key={row.res} className="border-b border-border">
                        <td className="px-4 py-2.5 font-medium">{row.res}</td>
                        <td className="px-4 py-2.5 text-center">
                          {formatCost((row.flash / 1_000_000) * 60)}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {row.pro !== null ? formatCost((row.pro / 1_000_000) * 120) : <span className="text-muted-foreground">-</span>}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {row.v25 !== null ? formatCost((row.v25 / 1_000_000) * 30) : <span className="text-muted-foreground">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3 items-start rounded-lg border border-gcp-blue/20 bg-gcp-blue/5 p-4 mt-4">
                <Info className="h-4 w-4 shrink-0 text-gcp-blue mt-0.5" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>All prices are per 1M tokens for inputs &le; 200K tokens.</p>
                  <p>Search grounding includes 5,000 free queries/month across all Gemini 3 models. Excess billed at $14/1,000 queries.</p>
                  <p>Input tokens from Grounding with Google Search are not charged.</p>
                  <p>Thinking tokens are billed regardless of whether includeThoughts is enabled.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
