export type FaqItemConfig = {
  id: string
  category: string
  q: string
  a: string
}

export type FaqViewModel = {
  badge: string
  title: string
  description: string
  footerTitle: string
  footerDescription: string
  footerCta: string
  items: FaqItemConfig[]
}
