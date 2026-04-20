import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { BlogPostContent, TipTapDoc, TipTapMark, TipTapNode } from '../blog-types'

type RenderTipTapContentProps = {
  content: BlogPostContent
  className?: string
}

const ALLOWED_NODE_TYPES = new Set([
  'doc',
  'paragraph',
  'heading',
  'text',
  'bulletList',
  'orderedList',
  'listItem',
  'blockquote',
  'codeBlock',
  'horizontalRule',
  'hardBreak',
  'image',
])

const ALLOWED_MARK_TYPES = new Set(['bold', 'italic', 'strike', 'code', 'link'])

const isSafeUrl = (href: string): boolean =>
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('mailto:') ||
  href.startsWith('/')

const renderChildren = (nodes: TipTapNode[] | undefined, keyPrefix: string): ReactNode[] => {
  if (!nodes?.length) {
    return []
  }

  return nodes.map((node, index) => renderNode(node, `${keyPrefix}-${index}`)).filter(Boolean)
}

const applyMark = (content: ReactNode, mark: TipTapMark, key: string): ReactNode => {
  if (!ALLOWED_MARK_TYPES.has(mark.type)) {
    return content
  }

  if (mark.type === 'bold') {
    return <strong key={key}>{content}</strong>
  }

  if (mark.type === 'italic') {
    return <em key={key}>{content}</em>
  }

  if (mark.type === 'strike') {
    return <s key={key}>{content}</s>
  }

  if (mark.type === 'code') {
    return (
      <code key={key} className="rounded bg-muted px-1.5 py-0.5 text-[0.9em]">
        {content}
      </code>
    )
  }

  if (mark.type === 'link') {
    const href = typeof mark.attrs?.href === 'string' ? mark.attrs.href : ''
    if (!href || !isSafeUrl(href)) {
      return content
    }

    const isExternal = href.startsWith('http://') || href.startsWith('https://')
    return (
      <a
        key={key}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer noopener' : undefined}
        className="font-semibold text-primary underline underline-offset-4 hover:no-underline"
      >
        {content}
      </a>
    )
  }

  return content
}

const renderTextNode = (node: TipTapNode, key: string): ReactNode => {
  const base = node.text ?? ''
  if (!node.marks?.length) {
    return <span key={key}>{base}</span>
  }

  return node.marks.reduce<ReactNode>(
    (accumulator, mark, index) => {
      return applyMark(accumulator, mark, `${key}-mark-${index}`)
    },
    <span key={`${key}-text`}>{base}</span>,
  )
}

const renderHeading = (node: TipTapNode, key: string): ReactNode => {
  const level = Number(node.attrs?.level)
  const content = renderChildren(node.content, key)

  if (level === 2) {
    return (
      <h2 key={key} className="mt-12 text-3xl font-black tracking-tight">
        {content}
      </h2>
    )
  }

  if (level === 3) {
    return (
      <h3 key={key} className="mt-10 text-2xl font-bold tracking-tight">
        {content}
      </h3>
    )
  }

  return (
    <h4 key={key} className="mt-8 text-xl font-bold tracking-tight">
      {content}
    </h4>
  )
}

const renderImage = (node: TipTapNode, key: string): ReactNode => {
  const src = typeof node.attrs?.src === 'string' ? node.attrs.src : ''
  const alt = typeof node.attrs?.alt === 'string' ? node.attrs.alt : 'Blog image'

  if (!src || !isSafeUrl(src)) {
    return null
  }

  return (
    <img
      key={key}
      src={src}
      alt={alt}
      className="my-10 w-full rounded-3xl border border-border object-cover shadow-xl"
      loading="lazy"
    />
  )
}

const renderNode = (node: TipTapNode, key: string): ReactNode => {
  if (!ALLOWED_NODE_TYPES.has(node.type)) {
    return (
      <div key={key} className="contents">
        {renderChildren(node.content, key)}
      </div>
    )
  }

  if (node.type === 'text') {
    return renderTextNode(node, key)
  }

  if (node.type === 'paragraph') {
    return (
      <p key={key} className="text-lg leading-relaxed text-muted-foreground">
        {renderChildren(node.content, key)}
      </p>
    )
  }

  if (node.type === 'heading') {
    return renderHeading(node, key)
  }

  if (node.type === 'bulletList') {
    return (
      <ul key={key} className="list-disc space-y-3 pl-6 text-lg text-muted-foreground">
        {renderChildren(node.content, key)}
      </ul>
    )
  }

  if (node.type === 'orderedList') {
    return (
      <ol key={key} className="list-decimal space-y-3 pl-6 text-lg text-muted-foreground">
        {renderChildren(node.content, key)}
      </ol>
    )
  }

  if (node.type === 'listItem') {
    return <li key={key}>{renderChildren(node.content, key)}</li>
  }

  if (node.type === 'blockquote') {
    return (
      <blockquote
        key={key}
        className="my-8 border-l-4 border-primary/40 pl-5 text-lg italic text-muted-foreground"
      >
        {renderChildren(node.content, key)}
      </blockquote>
    )
  }

  if (node.type === 'codeBlock') {
    return (
      <pre
        key={key}
        className="my-8 overflow-x-auto rounded-2xl border border-border bg-muted/40 p-4 text-sm"
      >
        <code>{renderChildren(node.content, key)}</code>
      </pre>
    )
  }

  if (node.type === 'horizontalRule') {
    return <hr key={key} className="my-10 border-border" />
  }

  if (node.type === 'hardBreak') {
    return <br key={key} />
  }

  if (node.type === 'image') {
    return renderImage(node, key)
  }

  return null
}

const renderTipTapDocument = (doc: TipTapDoc): ReactNode[] => {
  return renderChildren(doc.content, 'doc')
}

const renderLegacyText = (text: string): ReactNode[] => {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={`legacy-${index}`} className="text-lg leading-relaxed text-muted-foreground">
        {paragraph}
      </p>
    ))
}

export function RenderTipTapContent({ content, className }: RenderTipTapContentProps) {
  const blocks =
    content.kind === 'tiptap' ? renderTipTapDocument(content.doc) : renderLegacyText(content.text)

  return <div className={cn('space-y-6', className)}>{blocks}</div>
}
