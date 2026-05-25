const MODAL_SURFACE_BASE_CLASSNAME =
  'overflow-hidden p-0 !bg-background/95 sm:w-[calc(100vw-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:rounded-[28px] sm:border sm:border-border/60 sm:shadow-[0_25px_100px_hsl(var(--marketing-overlay-dark)/0.5)] sm:backdrop-blur-2xl'
const COMMUNITY_MODAL_SCROLL_CLASSNAME = 'overflow-y-auto overscroll-y-contain'

export const DARK_APP_MODAL_CLASSNAME =
  'dark !bg-[#0B0F15] [--color-background:hsl(var(--background))] [--color-foreground:hsl(var(--foreground))] [--color-card:hsl(var(--card))] [--color-card-foreground:hsl(var(--card-foreground))] [--color-muted:hsl(var(--muted))] [--color-muted-foreground:hsl(var(--muted-foreground))] [--color-border:hsl(var(--border))] [--color-primary:hsl(var(--primary))] [--color-primary-foreground:hsl(var(--primary-foreground))]'

export const LOGIN_MODAL_CONTENT_CLASSNAME = `${MODAL_SURFACE_BASE_CLASSNAME} sm:max-w-[425px]`
export const REGISTER_MODAL_CONTENT_CLASSNAME = `${MODAL_SURFACE_BASE_CLASSNAME} sm:max-w-lg`
export const QUICK_VIEW_MODAL_CONTENT_CLASSNAME = `${MODAL_SURFACE_BASE_CLASSNAME} sm:h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:max-w-[1420px]`
export const SUPPORT_FLOW_MODAL_CONTENT_CLASSNAME = `${MODAL_SURFACE_BASE_CLASSNAME} data-[open]:animate-none data-[closed]:animate-none sm:h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:max-w-3xl`
export const COMMUNITY_POST_MODAL_CONTENT_CLASSNAME = `${MODAL_SURFACE_BASE_CLASSNAME} ${COMMUNITY_MODAL_SCROLL_CLASSNAME} sm:max-w-4xl`
export const COMMUNITY_SHARE_MODAL_CONTENT_CLASSNAME = `${MODAL_SURFACE_BASE_CLASSNAME} ${COMMUNITY_MODAL_SCROLL_CLASSNAME} sm:max-w-3xl`
export const COMMUNITY_COMPOSER_MODAL_CONTENT_CLASSNAME = `${MODAL_SURFACE_BASE_CLASSNAME} ${COMMUNITY_MODAL_SCROLL_CLASSNAME} sm:max-w-2xl`
