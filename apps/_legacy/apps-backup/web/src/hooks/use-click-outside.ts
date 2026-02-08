import { useEffect, RefObject } from 'react';

/**
 * Hook personnalisé pour détecter les clics en dehors d'un élément
 *
 * @param ref - Référence à l'élément à surveiller
 * @param handler - Fonction à appeler lors d'un clic externe
 * @param enabled - Activer/désactiver le hook (défaut: true)
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setIsOpen(false));
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;

      // Ne rien faire si l'élément n'existe pas ou si le clic est à l'intérieur
      if (!element || element.contains(event.target as Node)) {
        return;
      }

      // Appeler le handler si le clic est à l'extérieur
      handler(event);
    };

    // Utiliser mousedown/touchstart au lieu de click pour une meilleure UX
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}
