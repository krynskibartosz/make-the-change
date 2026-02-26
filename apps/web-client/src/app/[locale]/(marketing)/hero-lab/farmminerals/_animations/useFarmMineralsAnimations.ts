// @ts-nocheck
'use client'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Splide from '@splidejs/splide'
import SplitType from 'split-type'
import lottie from 'lottie-web'
import { FARM_MINERALS_SCROLL_FRAMES } from './frame-manifest'

gsap.registerPlugin(ScrollTrigger)

type Cleanup = () => void

const LIGHT = '#F4EDE6'
const DARK = '#404F1D'
const TARGET_SECTIONS = ['#s-second', '#s-numbers', '#s-carbon', '#products', '#s-trials']

const setInlineStyle = (
  element: Element | null,
  styles: Partial<CSSStyleDeclaration>,
): void => {
  if (!element) {
    return
  }

  Object.entries(styles).forEach(([key, value]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(element as any).style[key] = value ?? ''
  })
}

const preloadFrames = (frameUrls: readonly string[]): Promise<(HTMLImageElement | null)[]> => {
  return Promise.all(
    frameUrls.map(
      (url) =>
        new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image()
          img.src = url
          img.onload = () => resolve(img)
          img.onerror = () => resolve(null)
        }),
    ),
  )
}

const initScrollImageSequence = (
  imageSelector: string,
  frameUrls: readonly string[],
  triggerSelector: string,
  reducedMotion: boolean,
): Cleanup => {
  const sequenceImage = document.querySelector<HTMLImageElement>(imageSelector)
  if (!sequenceImage) {
    return () => {}
  }

  let mounted = true
  let tween: gsap.core.Tween | null = null
  const frameProxy = { frame: 0 }
  let rafId = 0

  const setFrame = (images: (HTMLImageElement | null)[]) => {
    const index = Math.max(0, Math.min(Math.round(frameProxy.frame), images.length - 1))
    const image = images[index]
    if (!image) {
      return
    }

    if (sequenceImage.src !== image.src) {
      sequenceImage.src = image.src
    }
  }

  void preloadFrames(frameUrls).then((images) => {
    if (!mounted) {
      return
    }

    frameProxy.frame = 0
    setFrame(images)
    sequenceImage.style.opacity = '1'

    if (reducedMotion) {
      return
    }

    tween = gsap.to(frameProxy, {
      frame: images.length - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: triggerSelector,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
      onUpdate: () => {
        if (rafId) {
          cancelAnimationFrame(rafId)
        }

        rafId = requestAnimationFrame(() => setFrame(images))
      },
    })
  })

  return () => {
    mounted = false
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    tween?.kill()
  }
}

const initHeaderColorSwitch = (): Cleanup => {
  const nav = document.querySelector<HTMLElement>('.nav-wrap')
  if (!nav) {
    return () => {}
  }

  const menuIcon = document.querySelector<HTMLElement>('.nav-wrap > .menu-btn-wrap > .icon-menu')
  const menuText = document.querySelector<HTMLElement>(
    '.nav-wrap > .menu-btn-wrap > .text-14-caps',
  )
  const logos = Array.from(document.querySelectorAll<HTMLElement>('.logo-header'))
  const contactText = document.querySelector<HTMLElement>('.nav-wrap > .contact-wrap > .text-14-caps')
  const underline = document.querySelector<HTMLElement>('.nav-wrap > .contact-wrap > .underline')

  const colorizeSvg = (container: HTMLElement | null, color: string): void => {
    if (!container) {
      return
    }

    const svg = container.querySelector('svg')
    if (!svg) {
      return
    }

    svg.querySelectorAll('[fill]').forEach((node) => {
      const current = node.getAttribute('fill')
      if (current && current !== 'none') {
        node.setAttribute('fill', color)
      }
    })

    svg.querySelectorAll('[stroke]').forEach((node) => {
      const current = node.getAttribute('stroke')
      if (current && current !== 'none') {
        node.setAttribute('stroke', color)
      }
    })
  }

  const colorizeLottieIcon = (color: string): void => {
    if (!menuIcon) {
      return
    }

    const tryApply = () => {
      const svg = menuIcon.querySelector('svg')
      if (!svg) {
        return false
      }

      colorizeSvg(menuIcon, color)
      return true
    }

    if (tryApply()) {
      return
    }

    const observer = new MutationObserver(() => {
      if (tryApply()) {
        observer.disconnect()
      }
    })

    observer.observe(menuIcon, { childList: true, subtree: true })

    setTimeout(() => {
      if (tryApply()) {
        observer.disconnect()
      }
    }, 1000)
  }

  const setHeaderColors = (color: string) => {
    setInlineStyle(menuText, { color })
    setInlineStyle(contactText, { color })
    setInlineStyle(underline, { backgroundColor: color })
    colorizeLottieIcon(color)

    logos.forEach((logo) => {
      setInlineStyle(logo, { color })
      colorizeSvg(logo, color)
    })
  }

  const sections = TARGET_SECTIONS.map((selector) => document.querySelector<HTMLElement>(selector)).filter(
    Boolean,
  )

  if (!sections.length) {
    return () => {}
  }

  const headerOverlapsSection = (section: HTMLElement, headerRect: DOMRect): boolean => {
    const rect = section.getBoundingClientRect()
    return rect.top <= headerRect.bottom && rect.bottom > headerRect.top
  }

  let ticking = false

  const evaluate = (): void => {
    const headerRect = nav.getBoundingClientRect()
    const onTargetSection = sections.some((section) => headerOverlapsSection(section, headerRect))
    setHeaderColors(onTargetSection ? DARK : LIGHT)
  }

  const onScroll = (): void => {
    if (ticking) {
      return
    }

    ticking = true
    requestAnimationFrame(() => {
      evaluate()
      ticking = false
    })
  }

  window.addEventListener('resize', onScroll)
  document.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('load', evaluate, { once: true })
  setHeaderColors(LIGHT)

  return () => {
    window.removeEventListener('resize', onScroll)
    document.removeEventListener('scroll', onScroll)
  }
}

const initFormInteractions = (): Cleanup => {
  const cleanups: Cleanup[] = []

  const seasonSelect = document.getElementById('season-choose') as HTMLSelectElement | null
  const otherTimingField = document.getElementById('other-timing-field') as HTMLElement | null
  if (seasonSelect && otherTimingField) {
    const toggle = () => {
      otherTimingField.style.display = seasonSelect.value === 'Other timing' ? 'block' : 'none'
    }

    toggle()
    seasonSelect.addEventListener('change', toggle)
    cleanups.push(() => seasonSelect.removeEventListener('change', toggle))
  }

  const otherFertilizerCheckbox = document.getElementById(
    'other-fertilizer-checkbox',
  ) as HTMLInputElement | null
  const otherFertilizerField = document.getElementById('other-fertilizer-field') as HTMLElement | null
  if (otherFertilizerCheckbox && otherFertilizerField) {
    const toggle = () => {
      otherFertilizerField.style.display = otherFertilizerCheckbox.checked ? 'block' : 'none'
    }

    toggle()
    otherFertilizerCheckbox.addEventListener('change', toggle)
    cleanups.push(() => otherFertilizerCheckbox.removeEventListener('change', toggle))
  }

  const otherCropCheckbox = document.getElementById('checkbox-crop-other') as HTMLInputElement | null
  const otherCropField = document.getElementById('other-crop-field') as HTMLElement | null
  if (otherCropCheckbox && otherCropField) {
    const toggle = () => {
      otherCropField.style.display = otherCropCheckbox.checked ? 'block' : 'none'
    }

    toggle()
    otherCropCheckbox.addEventListener('change', toggle)
    cleanups.push(() => otherCropCheckbox.removeEventListener('change', toggle))
  }

  const dropdown = document.querySelector('.dropdown-form-item')
  const output = dropdown?.querySelector('#dropdown-text') as HTMLElement | null
  const checkboxes = dropdown?.querySelectorAll(".dropdown-menu input[type='checkbox']")
  if (dropdown && output && checkboxes?.length) {
    const placeholder = (output.textContent ?? '').trim()

    const updateDropdownText = () => {
      const selected: string[] = []
      checkboxes.forEach((checkbox) => {
        const field = checkbox.closest('.checkbox-field') as HTMLElement | null
        if (!field || !(checkbox as HTMLInputElement).checked) {
          return
        }

        const children = Array.from(field.children)
        const textNode = children.find(
          (child) => child !== checkbox && (child.textContent ?? '').trim().length > 0,
        )

        if (textNode?.textContent) {
          selected.push(textNode.textContent.trim())
        }
      })

      output.textContent = selected.length ? selected.join(', ') : placeholder
    }

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', updateDropdownText)
      cleanups.push(() => checkbox.removeEventListener('change', updateDropdownText))
    })
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup())
  }
}

const initApplyFormToggle = (lenisRef: Lenis | null): Cleanup => {
  const openTriggers = Array.from(document.querySelectorAll<HTMLElement>('[apply="open"]'))
  const closeButton = document.querySelector<HTMLElement>('.close-btn-form')
  const background = document.querySelector<HTMLElement>('.apply-form-bg')

  const open = () => {
    document.body.classList.add('fm-apply-open')
    lenisRef?.stop()
  }

  const close = () => {
    document.body.classList.remove('fm-apply-open')
    lenisRef?.start()
  }

  openTriggers.forEach((trigger) => {
    const handler = (event: Event) => {
      event.preventDefault()
      open()
    }
    trigger.addEventListener('click', handler)
    ;(trigger as any).__fmOpenHandler = handler
  })

  const closeHandler = (event: Event) => {
    event.preventDefault()
    close()
  }

  closeButton?.addEventListener('click', closeHandler)
  background?.addEventListener('click', closeHandler)

  return () => {
    openTriggers.forEach((trigger) => {
      const handler = (trigger as any).__fmOpenHandler
      if (handler) {
        trigger.removeEventListener('click', handler)
      }
    })

    closeButton?.removeEventListener('click', closeHandler)
    background?.removeEventListener('click', closeHandler)
  }
}

const initMobileMenuAccordion = (): Cleanup => {
  const menuButton = document.querySelector<HTMLElement>('.menu-btn-wrap')
  const closeButton = document.querySelector<HTMLElement>('.close-btn-wrap')
  const overlay = document.querySelector<HTMLElement>('.menu-side-bg')
  const items = Array.from(document.querySelectorAll<HTMLElement>('.link-item'))

  let activeItem: HTMLElement | null = null

  const openMenu = () => {
    document.body.classList.add('fm-menu-open')
  }

  const closeMenu = () => {
    document.body.classList.remove('fm-menu-open')
  }

  const collapse = (element: Element | null): void => {
    if (!element) {
      return
    }
    setInlineStyle(element, { maxHeight: '0px' })
  }

  const expand = (element: Element | null): void => {
    if (!element) {
      return
    }
    setInlineStyle(element, { maxHeight: `${(element as HTMLElement).scrollHeight}px` })
  }

  const closeItem = (item: HTMLElement | null): void => {
    if (!item) {
      return
    }

    item.classList.remove('active')
    collapse(item.querySelector('.link-item_links'))
    activeItem = null

    items.forEach((entry) => {
      setInlineStyle(entry, { opacity: '1' })
    })
  }

  const openItem = (item: HTMLElement): void => {
    items.forEach((entry) => {
      if (entry === item) {
        return
      }

      setInlineStyle(entry, { opacity: '0.2' })
      entry.classList.remove('active')
      collapse(entry.querySelector('.link-item_links'))
    })

    item.classList.add('active')
    setInlineStyle(item, { opacity: '1' })
    expand(item.querySelector('.link-item_links'))
    activeItem = item
  }

  const itemHandlers: Array<{ item: HTMLElement; handler: () => void }> = []

  if (window.innerWidth <= 991) {
    items.forEach((item) => {
      collapse(item.querySelector('.link-item_links'))
      setInlineStyle(item, { opacity: '1' })

      const handler = () => {
        if (activeItem === item) {
          closeItem(item)
          return
        }

        if (activeItem && activeItem !== item) {
          const previous = activeItem
          closeItem(previous)
          window.setTimeout(() => openItem(item), 350)
          return
        }

        openItem(item)
      }

      item.addEventListener('click', handler)
      itemHandlers.push({ item, handler })
    })
  }

  const onOpenMenu = (event: Event) => {
    event.preventDefault()
    openMenu()
  }

  const onCloseMenu = (event: Event) => {
    event.preventDefault()
    closeItem(activeItem)
    closeMenu()
  }

  menuButton?.addEventListener('click', onOpenMenu)
  closeButton?.addEventListener('click', onCloseMenu)
  overlay?.addEventListener('click', onCloseMenu)

  return () => {
    menuButton?.removeEventListener('click', onOpenMenu)
    closeButton?.removeEventListener('click', onCloseMenu)
    overlay?.removeEventListener('click', onCloseMenu)

    itemHandlers.forEach(({ item, handler }) => item.removeEventListener('click', handler))
  }
}

const initSplide = (): Cleanup => {
  const sliders = Array.from(document.querySelectorAll<HTMLElement>('.splide--posts'))

  if (!sliders.length) {
    return () => {}
  }

  const instances = sliders.map((slider) =>
    new Splide(slider, {
      perPage: 2.5,
      perMove: 1,
      focus: 0,
      type: 'loop',
      gap: '1.69em',
      arrows: true,
      pagination: false,
      speed: 1000,
      dragAngleThreshold: 30,
      autoWidth: false,
      rewind: false,
      rewindSpeed: 400,
      waitForTransition: false,
      updateOnMove: true,
      trimSpace: false,
      breakpoints: {
        991: { perPage: 1.5 },
        767: { perPage: 1.5 },
        479: { perPage: 1 },
      },
    }).mount(),
  )

  return () => {
    instances.forEach((instance) => instance.destroy())
  }
}

const initLottie = (): Cleanup => {
  const containers = Array.from(document.querySelectorAll<HTMLElement>('.icon-menu[data-src]'))

  if (!containers.length) {
    return () => {}
  }

  const instances = containers.map((container) =>
    lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: container.dataset.autoplay === '1' || container.dataset.autoplay === 'true',
      path: container.dataset.src,
    }),
  )

  return () => {
    instances.forEach((instance) => instance.destroy())
  }
}

const initTextSplitAnimations = (reducedMotion: boolean): Cleanup => {
  const splits: SplitType[] = []
  const timelines: gsap.core.Timeline[] = []

  const createTrigger = (element: Element, timeline: gsap.core.Timeline): void => {
    ScrollTrigger.create({ trigger: element, start: 'top bottom' })
    ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      onEnter: () => timeline.play(),
    })
  }

  const buildAnimation = (element: Element, delay = 0): void => {
    const split = new SplitType(element as HTMLElement, { types: 'lines,words,chars' })
    splits.push(split)

    const chars = split.chars ?? []
    gsap.set(chars, { autoAlpha: 0 })

    const timeline = gsap.timeline({ paused: true })
    timeline.fromTo(
      chars,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: reducedMotion ? 0.01 : 0.35,
        ease: 'power2.out',
        stagger: reducedMotion
          ? 0
          : {
              each: 0.02,
              from: 'random',
            },
        delay,
      },
    )

    timelines.push(timeline)
    createTrigger(element, timeline)
  }

  const run = () => {
    document.querySelectorAll('[text-split]').forEach((element) => {
      buildAnimation(element)
    })

    document.querySelectorAll('[text-split-delay]').forEach((element) => {
      const delay = Number.parseFloat(element.getAttribute('text-split-delay') || '0') || 0
      buildAnimation(element, delay)
    })

    gsap.set('[text-split], [text-split-delay]', { autoAlpha: 1 })
  }

  if (document.fonts?.ready) {
    void document.fonts.ready.then(run)
  } else {
    run()
  }

  return () => {
    timelines.forEach((timeline) => timeline.kill())
    splits.forEach((split) => split.revert())
  }
}

export const useFarmMineralsAnimations = (): void => {
  useEffect(() => {
    const cleanups: Cleanup[] = []

    document.documentElement.classList.add('w-mod-js')

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.documentElement.classList.add('w-mod-touch')
    }

    const setIxReady = () => {
      document.documentElement.classList.add('w-mod-ix3')
    }
    requestAnimationFrame(setIxReady)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lenis = new Lenis({ lerp: 0.1 })
    let rafId = 0

    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    cleanups.push(() => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    })

    cleanups.push(initTextSplitAnimations(reducedMotion))
    cleanups.push(initLottie())
    cleanups.push(initMobileMenuAccordion())
    cleanups.push(initFormInteractions())
    cleanups.push(initSplide())
    cleanups.push(initHeaderColorSwitch())
    cleanups.push(initApplyFormToggle(lenis))
    cleanups.push(
      initScrollCanvasSequence(
        '#scroll-canvas',
        FARM_MINERALS_SCROLL_FRAMES,
        '.capsule',
        reducedMotion,
      ),
    )
    cleanups.push(
      initHoverCanvasSequence('#hover-canvas', FARM_MINERALS_HOVER_FRAMES, '.capsule', reducedMotion),
    )

    ScrollTrigger.refresh()

    return () => {
      cleanups.reverse().forEach((cleanup) => cleanup())
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      document.body.classList.remove('fm-menu-open', 'fm-apply-open')
      document.documentElement.classList.remove('w-mod-ix3')
    }
  }, [])
}
