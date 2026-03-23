interface PageContainerProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function PageContainer({ title, description, children }: PageContainerProps) {
  return (
    <div className="flex-1 md:ml-64">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
