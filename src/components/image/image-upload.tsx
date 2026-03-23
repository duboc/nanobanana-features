'use client'

import { useCallback, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { base64ToDataUrl, validateImageFile } from '@/lib/image-utils'
import type { ImageData } from '@/types'

interface ImageUploadProps {
  onUpload: (image: ImageData) => void
  currentImage?: ImageData | null
  onClear?: () => void
  multiple?: boolean
  onMultipleUpload?: (images: ImageData[]) => void
  maxImages?: number
  currentCount?: number
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ImageUpload({
  onUpload,
  currentImage,
  onClear,
  multiple = false,
  onMultipleUpload,
  maxImages = 14,
  currentCount = 0,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(async (files: FileList) => {
    const validFiles = Array.from(files).filter(f => validateImageFile(f.type))
    if (validFiles.length === 0) return

    if (multiple && onMultipleUpload) {
      const remaining = maxImages - currentCount
      const toProcess = validFiles.slice(0, remaining)
      const images: ImageData[] = await Promise.all(
        toProcess.map(async file => ({
          base64: await fileToBase64(file),
          mimeType: file.type,
        }))
      )
      onMultipleUpload(images)
    } else {
      const file = validFiles[0]
      const base64 = await fileToBase64(file)
      onUpload({ base64, mimeType: file.type })
    }
  }, [multiple, onMultipleUpload, onUpload, maxImages, currentCount])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  if (currentImage && !multiple) {
    return (
      <div className="relative inline-block rounded-xl border border-border overflow-hidden">
        <img
          src={base64ToDataUrl(currentImage.base64, currentImage.mimeType)}
          alt="Uploaded image"
          className="max-h-64 object-contain"
        />
        {onClear && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-muted-foreground/30'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={e => e.target.files && processFiles(e.target.files)}
      />
      <div className="flex flex-col items-center gap-3">
        {isDragging ? (
          <Upload className="h-8 w-8 text-primary" />
        ) : (
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        )}
        <div>
          <p className="text-sm font-medium">
            {isDragging ? 'Drop image here' : 'Click or drag image to upload'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPEG, GIF, WebP
            {multiple && ` (${currentCount}/${maxImages})`}
          </p>
        </div>
      </div>
    </div>
  )
}
