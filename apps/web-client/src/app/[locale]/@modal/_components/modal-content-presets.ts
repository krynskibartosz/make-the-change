const MODAL_SURFACE_BASE_CLASSNAME =
  'overflow-hidden p-0 !bg-background/95 sm:w-[calc(100vw-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:rounded-[28px] sm:border sm:border-border/60 sm:shadow-[0_25px_100px_hsl(var(--marketing-overlay-dark)/0.5)] sm:backdrop-blur-2xl'

export const LOGIN_MODAL_CONTENT_CLASSNAME = `${MODAL_SURFACE_BASE_CLASSNAME} sm:max-w-[425px]`
export const REGISTER_MODAL_CONTENT_CLASSNAME = `${MODAL_SURFACE_BASE_CLASSNAME} sm:max-w-lg`
export const QUICK_VIEW_MODAL_CONTENT_CLASSNAME = `${MODAL_SURFACE_BASE_CLASSNAME} sm:h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:max-w-[1420px]`
