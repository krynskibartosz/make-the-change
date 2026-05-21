import * as React from 'react'
import { useDialogFocus } from './atlas-a11y'

type SearchSuggestion = {
  kind: string
  label: string
}

type BackdropProps = {
  open: boolean
  onClick: () => void
  dim?: number
}

type SearchPanelProps = {
  open: boolean
  onClose: () => void
  onPickQuery: (suggestion: SearchSuggestion) => void
}

type GuideOverlayProps = {
  open: boolean
  onClose: () => void
}

const SEARCH_SUGGESTIONS = [
  { kind: 'Milieux', label: 'Mangroves' },
  { kind: 'Alphabet', label: 'Pollinisateurs' },
  { kind: 'Menaces', label: 'Imperméabilisation des sols' },
  { kind: 'Solutions', label: 'Haies bocagères' },
  { kind: 'Relations', label: 'Lichens & arbres' },
  { kind: 'Impact', label: 'Empreinte hebdomadaire' },
]

const GUIDE_STEPS = [
  {
    title: 'Bienvenue dans l’Atlas',
    body: 'Six territoires composent une carte vivante du monde. Chacun raconte une facette du vivant.',
  },
  {
    title: 'Au centre, les Relations',
    body: 'C’est le cœur de l’Atlas : les liens entre espèces, milieux et saisons. Tout y converge.',
  },
  {
    title: 'Et vous, l’impact',
    body: 'Suivez l’effet de vos gestes au fil des semaines. Petits choix, grandes répercussions.',
  },
]

function Backdrop({ open, onClick, dim = 0.5 }: BackdropProps) {
  return (
    <div
      onClick={onClick}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        background: `rgba(0,0,0,${dim})`,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 260ms ease',
        zIndex: 30,
      }}
    />
  )
}

export function SearchPanel({ open, onClose, onPickQuery }: SearchPanelProps) {
  const [q, setQ] = React.useState('')
  const dialogRef = useDialogFocus(open, onClose)

  React.useEffect(() => {
    if (!open) setQ('')
  }, [open])

  const query = q.toLowerCase()
  const filtered = query
    ? SEARCH_SUGGESTIONS.filter((s) => `${s.label} ${s.kind}`.toLowerCase().includes(query))
    : SEARCH_SUGGESTIONS

  return (
    <>
      <Backdrop open={open} onClick={onClose} dim={0.6} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Recherche dans l’Atlas"
        tabIndex={-1}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          zIndex: 40,
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 320ms cubic-bezier(.2,.7,.2,1)',
          padding: '56px 16px 0',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(180deg, #1a1d20 0%, #0f1113 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 24,
            padding: '14px 14px 18px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 14,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cfc8b5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Chercher une espèce, un milieu, un geste..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#eae3d2',
                fontSize: 15,
                padding: '8px 0',
              }}
            />
            {q && (
              <button
                onClick={() => setQ('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9a937f',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Effacer
              </button>
            )}
          </div>

          <div
            style={{
              marginTop: 14,
              fontSize: 11,
              letterSpacing: 1.3,
              textTransform: 'uppercase',
              color: '#9a937f',
            }}
          >
            {q ? 'Résultats' : 'Suggestions'}
          </div>
          <div style={{ marginTop: 10, maxHeight: 280, overflowY: 'auto', paddingRight: 4 }}>
            {filtered.length === 0 && (
              <div style={{ fontSize: 14, color: '#9a937f', padding: '18px 4px' }}>
                Aucun résultat. Essayez « forêt », « pollinisateur », « eau »...
              </div>
            )}
            {filtered.map((s) => (
              <button
                key={`${s.kind}-${s.label}`}
                onClick={() => onPickQuery(s)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  padding: '12px 8px',
                  cursor: 'pointer',
                  borderTop: s === filtered[0] ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  color: '#eae3d2',
                  fontSize: 15,
                }}
              >
                <span>{s.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: '#9a937f',
                  }}
                >
                  {s.kind}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export function GuideOverlay({ open, onClose }: GuideOverlayProps) {
  const [step, setStep] = React.useState(0)
  const dialogRef = useDialogFocus(open, onClose)

  React.useEffect(() => {
    if (!open) setStep(0)
  }, [open])

  const currentStep = GUIDE_STEPS[step] ?? GUIDE_STEPS[0]!

  return (
    <>
      <Backdrop open={open} onClick={onClose} dim={0.65} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="atlas-guide-title"
        tabIndex={-1}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 41,
          display: open ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            margin: '0 16px 28px',
            background: 'linear-gradient(180deg, #1a1d20 0%, #0f1113 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            padding: '22px 22px 18px',
            color: '#eae3d2',
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(20px)',
            transition: 'transform 360ms cubic-bezier(.2,.7,.2,1), opacity 280ms',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {GUIDE_STEPS.map((_, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 3,
                  background: i <= step ? '#f4d889' : 'rgba(255,255,255,0.12)',
                  transition: 'background 200ms',
                }}
              />
            ))}
          </div>
          <div
            id="atlas-guide-title"
            style={{
              fontFamily: 'var(--atlas-prototype-serif), serif',
              fontSize: 26,
              fontWeight: 500,
              lineHeight: 1.1,
              marginBottom: 10,
              color: '#f6efdc',
            }}
          >
            {currentStep.title}
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.5, color: '#cfc8b5', marginBottom: 20 }}>
            {currentStep.body}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#9a937f',
                cursor: 'pointer',
                fontSize: 14,
                padding: '8px 4px',
              }}
            >
              Passer
            </button>
            <button
              onClick={() => (step < GUIDE_STEPS.length - 1 ? setStep(step + 1) : onClose())}
              style={{
                padding: '12px 22px',
                borderRadius: 9999,
                background: 'linear-gradient(180deg, #f4ecd8, #d9cfb0)',
                color: '#1c1a14',
                fontWeight: 600,
                fontSize: 14,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
              }}
            >
              {step < GUIDE_STEPS.length - 1 ? 'Suivant' : 'C’est parti'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
