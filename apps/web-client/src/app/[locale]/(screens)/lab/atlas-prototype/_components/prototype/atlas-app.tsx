// @ts-nocheck
// biome-ignore-all lint: Isolated Claude Design prototype kept close to the handoff for mobile lab testing.
'use client'

import * as React from 'react'
import { AtlasBackground } from './atlas-background'
import { useAtlasViewportProfile } from './atlas-responsive'
import { VoronoiAtlas } from './atlas-territories'

const loadLevel2Screen = () => import('./atlas-level2')
const loadLevel3Screen = () => import('./atlas-level3')
const loadAtlasSheets = () => import('./atlas-sheets')

const Level2Screen = React.lazy(() =>
  loadLevel2Screen().then((mod) => ({ default: mod.Level2Screen })),
)
const Level3Screen = React.lazy(() =>
  loadLevel3Screen().then((mod) => ({ default: mod.Level3Screen })),
)
const SearchPanel = React.lazy(() =>
  loadAtlasSheets().then((mod) => ({ default: mod.SearchPanel })),
)
const GuideOverlay = React.lazy(() =>
  loadAtlasSheets().then((mod) => ({ default: mod.GuideOverlay })),
)

const CONFIG = {
  glow: 1.0,
  dust: 0.26,
  vignette: 0.55,
  animateNodes: true,
}

function useAtlasMotionEnabled() {
  const [enabled, setEnabled] = React.useState(true)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(!mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return enabled
}

function CircleButton({ onClick, children, ariaLabel }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'rgba(20,22,24,0.55)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        color: '#eae3d2',
        boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
        flex: '0 0 auto',
      }}
    >
      {children}
    </button>
  )
}

// L1 screen — global Atlas with 6 territories.
function LazyScreenFallback() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: '#04060a',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid rgba(244,216,137,0.9)',
          borderTopColor: 'transparent',
          animation: 'atlasSpin 680ms linear infinite',
        }}
      />
    </div>
  )
}

function Toast({ text }) {
  if (!text) return null
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 80,
        transform: 'translateX(-50%)',
        background: 'rgba(20,22,24,0.92)',
        color: '#eae3d2',
        padding: '10px 16px',
        borderRadius: 9999,
        fontSize: 13,
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 50,
        animation: 'toastIn 240ms ease both',
        pointerEvents: 'none',
      }}
    >
      {text}
    </div>
  )
}

function Level1Screen({ onPickTerritory, focusedId, transitioningOut, motionEnabled }) {
  const viewport = useAtlasViewportProfile()
  const [search, setSearch] = React.useState(false)
  const [guide, setGuide] = React.useState(false)
  const [toast, setToast] = React.useState('')
  const toastTimerRef = React.useRef()

  const showToast = (msg) => {
    setToast(msg)
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1800)
  }

  React.useEffect(() => () => window.clearTimeout(toastTimerRef.current), [])

  // When a territory is focused, dim everything else and pulse the chosen cell.
  const styleScope = React.useMemo(() => {
    if (!focusedId) return null
    return (
      <style>{`
        svg [role="button"][aria-label] { transition: opacity 400ms ease, filter 400ms ease; }
        svg [role="button"]:not([data-focus="1"]) { opacity: 0.25; filter: saturate(0.7); }
        svg [role="button"][data-focus="1"] { filter: brightness(1.15) drop-shadow(0 0 18px rgba(244,216,137,0.4)); }
      `}</style>
    )
  }, [focusedId])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#04060a',
        opacity: transitioningOut ? 0 : 1,
        transform: transitioningOut ? 'scale(1.15)' : 'scale(1)',
        transition: 'opacity 520ms ease, transform 520ms cubic-bezier(.4,.0,.2,1)',
        transformOrigin: '50% 56%',
      }}
    >
      {styleScope}
      <AtlasBackground dust={CONFIG.dust} vignette={CONFIG.vignette} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: viewport.isShort
            ? 'calc(env(safe-area-inset-top, 0px) + 30px) 0 calc(env(safe-area-inset-bottom, 0px) + 14px)'
            : 'calc(env(safe-area-inset-top, 0px) + 52px) 0 calc(env(safe-area-inset-bottom, 0px) + 24px)',
        }}
      >
        {/* Header */}
        <div style={{ position: 'relative', padding: '2px 16px 0', flex: '0 0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <CircleButton ariaLabel="Retour" onClick={() => showToast('Retour à l’accueil')}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </CircleButton>
            <div style={{ flex: 1, textAlign: 'center', minWidth: 0, padding: '0 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path
                    d="M5 19 C 5 11, 11 5, 19 5 C 19 13, 13 19, 5 19 Z"
                    fill="#9ac06e"
                    opacity="0.95"
                  />
                  <path
                    d="M5.5 18.5 L 14 10"
                    stroke="#1d3010"
                    strokeWidth="1.4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h1
                style={{
                  margin: '2px 0 0',
                  fontFamily: 'var(--atlas-prototype-serif), serif',
                  fontWeight: 500,
                  fontSize: viewport.isNarrow ? 32 : 36,
                  lineHeight: 1.05,
                  color: '#f6efdc',
                  letterSpacing: '-0.3px',
                  textShadow: '0 2px 18px rgba(0,0,0,0.7)',
                }}
              >
                Atlas du vivant
              </h1>
              <div
                style={{
                  margin: '4px auto 0',
                  maxWidth: viewport.isNarrow ? 220 : 280,
                  fontSize: viewport.isNarrow ? 10.5 : 12,
                  lineHeight: 1.55,
                  letterSpacing: viewport.isNarrow ? 1.8 : 2.4,
                  textTransform: 'uppercase',
                  color: '#a89c7c',
                }}
              >
                Explorer · Comprendre · Agir
              </div>
            </div>
            <CircleButton
              ariaLabel="Rechercher"
              onClick={() => {
                void loadAtlasSheets()
                setSearch(true)
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </CircleButton>
          </div>
        </div>

        {/* Carte */}
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: viewport.isShort ? '2px 8px 0' : '0 4px',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              aspectRatio: '380 / 600',
              width: '100%',
              maxWidth: viewport.isShort ? 368 : 402,
              maxHeight: '100%',
              display: 'flex',
            }}
          >
            <VoronoiAtlas
              onPick={onPickTerritory}
              glow={CONFIG.glow}
              animate={motionEnabled && CONFIG.animateNodes}
              focusedId={focusedId}
            />
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            flex: '0 0 auto',
            padding: viewport.isShort ? '8px 18px 10px' : '10px 20px 14px',
          }}
        >
          <button
            onClick={() => {
              void loadAtlasSheets()
              setGuide(true)
            }}
            style={{
              width: '100%',
              minHeight: 56,
              padding: viewport.isNarrow ? '14px 18px' : '16px 22px',
              borderRadius: 9999,
              border: '1px solid rgba(0,0,0,0.06)',
              background: 'linear-gradient(180deg, #f6eedb 0%, #e6dcb9 100%)',
              color: '#1c1a14',
              fontWeight: 600,
              fontSize: viewport.isNarrow ? 16 : 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              cursor: 'pointer',
              boxShadow:
                '0 10px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.15) inset, 0 1px 0 rgba(255,255,255,0.6) inset, 0 0 38px rgba(244,216,137,0.18)',
            }}
          >
            <span
              style={{
                width: viewport.isNarrow ? 28 : 30,
                height: viewport.isNarrow ? 28 : 30,
                borderRadius: '50%',
                border: '1.5px solid #1c1a14',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1c1a14"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="15.5 8.5 13 13 8.5 15.5 11 11" />
              </svg>
            </span>
            Me guider dans l’Atlas
          </button>
        </div>
      </div>

      {search && (
        <React.Suspense fallback={null}>
          <SearchPanel
            open={search}
            onClose={() => setSearch(false)}
            onPickQuery={(s) => {
              setSearch(false)
              showToast('Recherche : « ' + s.label + ' »')
            }}
          />
        </React.Suspense>
      )}
      {guide && (
        <React.Suspense fallback={null}>
          <GuideOverlay open={guide} onClose={() => setGuide(false)} />
        </React.Suspense>
      )}
      <Toast text={toast} />
    </div>
  )
}

// ── Root with view switcher ──
function AtlasScreen() {
  const motionEnabled = useAtlasMotionEnabled()
  const [view, setView] = React.useState('L1') // 'L1' | 'L2' | 'L3'
  const [focusedId, setFocusedId] = React.useState(null)
  const [transitioning, setTransitioning] = React.useState(false)
  const [toast, setToast] = React.useState('')
  const [activeSubdomain, setActiveSubdomain] = React.useState(null)
  const toastTimerRef = React.useRef()
  const transitionTimersRef = React.useRef([])

  const showToast = (msg) => {
    setToast(msg)
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1800)
  }

  React.useEffect(
    () => () => {
      window.clearTimeout(toastTimerRef.current)
      transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    },
    [],
  )

  const pickTerritory = (t) => {
    if (t.id !== 'relations') {
      showToast(`« ${t.label} » : bientôt disponible`)
      return
    }
    transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    transitionTimersRef.current = []
    void loadLevel2Screen()
    setFocusedId(t.id)
    transitionTimersRef.current.push(window.setTimeout(() => setTransitioning(true), 220))
    transitionTimersRef.current.push(
      window.setTimeout(() => {
        setView('L2')
      }, 620),
    )
    transitionTimersRef.current.push(
      window.setTimeout(() => {
        setTransitioning(false)
        setFocusedId(null)
      }, 700),
    )
  }

  const pickSubdomain = (c) => {
    if (c.id !== 'pollinisation') {
      showToast(`« ${c.name + (c.name2 ? ' ' + c.name2 : '')} » : bientôt disponible`)
      return
    }
    void loadLevel3Screen()
    setActiveSubdomain(c)
    setView('L3')
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {view === 'L1' && (
        <Level1Screen
          onPickTerritory={pickTerritory}
          focusedId={focusedId}
          transitioningOut={transitioning}
          motionEnabled={motionEnabled}
        />
      )}
      {view === 'L2' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            animation: motionEnabled ? 'l2enter 520ms cubic-bezier(.2,.7,.2,1) both' : 'none',
          }}
        >
          <React.Suspense fallback={<LazyScreenFallback />}>
            <Level2Screen
              onBack={() => setView('L1')}
              onPickSubdomain={pickSubdomain}
              animateNodes={motionEnabled}
            />
          </React.Suspense>
        </div>
      )}
      {view === 'L3' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            animation: motionEnabled ? 'l3enter 520ms cubic-bezier(.2,.7,.2,1) both' : 'none',
          }}
        >
          <React.Suspense fallback={<LazyScreenFallback />}>
            <Level3Screen
              onBack={() => setView('L2')}
              subdomain={activeSubdomain || { name: 'Pollinisation' }}
              animateNodes={motionEnabled}
            />
          </React.Suspense>
        </div>
      )}
      <Toast text={toast} />
    </div>
  )
}

function AtlasPrototypeStyles() {
  return (
    <style>{`
      @keyframes toastIn {
        from { opacity: 0; transform: translate(-50%, -8px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      @keyframes atlasSpin {
        to { transform: rotate(360deg); }
      }
      @keyframes l2enter {
        from { opacity: 0; transform: scale(0.88); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes l3enter {
        from { opacity: 0; transform: scale(0.92); }
        to   { opacity: 1; transform: scale(1); }
      }
      svg [role="button"]:focus-visible {
        outline: 2px solid rgba(244,216,137,0.95);
        outline-offset: 4px;
      }
    `}</style>
  )
}

export function AtlasPrototypeClient() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        minHeight: '100dvh',
        overflow: 'hidden',
        background: '#04060a',
        color: '#eae3d2',
        fontFamily: 'var(--atlas-prototype-sans), Inter, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <AtlasPrototypeStyles />
      <AtlasScreen />
    </div>
  )
}
