const CARD_INTERACTIVE_SELECTOR =
  'a[href], button, input, select, textarea, label, summary, [role="button"], [role="switch"], [role="menuitem"], [contenteditable="true"], [data-card-action]'

export const isCardInteractiveTarget = (
  target: EventTarget | null,
  currentTarget?: EventTarget | null,
): boolean => {
  if (!(target instanceof Element)) {
    return false
  }

  const interactiveAncestor = target.closest(CARD_INTERACTIVE_SELECTOR)
  if (!interactiveAncestor) {
    return false
  }

  if (currentTarget instanceof Element && interactiveAncestor === currentTarget) {
    return false
  }

  return true
}

export const blurCardContainer = (target: EventTarget | null): void => {
  if (!(target instanceof HTMLElement)) {
    return
  }

  target.blur()
}
