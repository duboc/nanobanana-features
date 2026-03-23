interface PageContainerProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function PageContainer({ title, description, children }: PageContainerProps) {
  return (
    <div className="flex-1 pt-14 md:ml-60">
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-foreground">{title}</h1>
          {description && (
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
