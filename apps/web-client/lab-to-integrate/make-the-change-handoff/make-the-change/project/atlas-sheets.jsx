// Overlays for Atlas: territory sheet, search, guided onboarding, toast.

function Backdrop({ open, onClick, dim = 0.5 }) {
  return (
    <div onClick={onClick} style={{
      position:'absolute', inset:0,
      background:`rgba(0,0,0,${dim})`,
      backdropFilter:'blur(6px)',
      WebkitBackdropFilter:'blur(6px)',
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition:'opacity 260ms ease',
      zIndex: 30,
    }}/>
  );
}

// Bottom sheet showing the picked territory details
function TerritorySheet({ territory, onClose }) {
  const open = !!territory;
  // Keep last rendered territory so it doesn't blank on close transition
  const [last, setLast] = React.useState(territory);
  React.useEffect(() => { if (territory) setLast(territory); }, [territory]);
  const t = territory || last;

  return (
    <>
      <Backdrop open={open} onClick={onClose} dim={0.55}/>
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, zIndex:40,
        transform: open ? 'translateY(0)' : 'translateY(110%)',
        transition:'transform 360ms cubic-bezier(.2,.7,.2,1)',
      }}>
        {t && (
          <div style={{
            margin:'0 8px 8px',
            background:'linear-gradient(180deg, #1a1d20 0%, #0f1113 100%)',
            border:'1px solid rgba(255,255,255,0.06)',
            borderRadius:'28px 28px 24px 24px',
            padding:'14px 22px 28px',
            color:'#eae3d2',
            boxShadow:'0 -10px 40px rgba(0,0,0,0.55)',
          }}>
            {/* Grab handle */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:14 }}>
              <div style={{ width:46, height:4, borderRadius:4, background:'rgba(255,255,255,0.18)' }}/>
            </div>

            {/* Header row */}
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
              <div style={{
                width:54, height:54, borderRadius:'50%',
                background:`radial-gradient(circle at 35% 30%, ${t.color}55, ${t.dark}cc)`,
                display:'grid', placeItems:'center',
                border:`1px solid ${t.color}66`,
                boxShadow:`0 0 24px ${t.color}33`,
              }}>
                <TerritoryIcon kind={t.icon} size={28} color="#f4ecd8"/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{
                  fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:500,
                  lineHeight:1.05, color:'#f6efdc',
                }}>{t.label}</div>
                <div style={{ fontSize:12, letterSpacing:1.4, textTransform:'uppercase', color:t.color, marginTop:4, opacity:0.85 }}>
                  Territoire {t.id === 'relations' ? 'central' : 'périphérique'}
                </div>
              </div>
            </div>

            <p style={{ margin:'0 0 18px', fontSize:15, lineHeight:1.5, color:'#cfc8b5' }}>
              {t.desc}
            </p>

            {/* Stats */}
            <div style={{ display:'flex', gap:8, marginBottom:20 }}>
              {t.stats.map(([k,v]) => (
                <div key={k} style={{
                  flex:1,
                  padding:'12px 10px',
                  borderRadius:14,
                  background:'rgba(255,255,255,0.03)',
                  border:'1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontWeight:600, color:t.color }}>{v}</div>
                  <div style={{ fontSize:11, color:'#9a937f', marginTop:2, letterSpacing:0.3 }}>{k}</div>
                </div>
              ))}
            </div>

            {/* Primary CTA */}
            <button onClick={onClose} style={{
              width:'100%', padding:'16px 18px', borderRadius:9999,
              border:'none', cursor:'pointer',
              background:`linear-gradient(180deg, #f4ecd8, #d9cfb0)`,
              color:'#1c1a14', fontWeight:600, fontSize:16,
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              boxShadow:`0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${t.color}44, 0 0 28px ${t.color}22`,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1a14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              {t.cta}
            </button>

            {/* Secondary actions */}
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:14, fontSize:13, color:'#9a937f' }}>
              <button onClick={onClose} style={{ background:'none', border:'none', padding:'8px 4px', cursor:'pointer', color:'#9a937f' }}>Aperçu</button>
              <button onClick={onClose} style={{ background:'none', border:'none', padding:'8px 4px', cursor:'pointer', color:'#9a937f' }}>Partager</button>
              <button onClick={onClose} style={{ background:'none', border:'none', padding:'8px 4px', cursor:'pointer', color:'#9a937f' }}>Mettre en favori</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Search modal — fake search with chips
function SearchPanel({ open, onClose, onPickQuery }) {
  const [q, setQ] = React.useState('');
  React.useEffect(() => { if (!open) setQ(''); }, [open]);

  const suggestions = [
    { kind:'Milieux', label:'Mangroves' },
    { kind:'Alphabet', label:'Pollinisateurs' },
    { kind:'Menaces', label:'Imperméabilisation des sols' },
    { kind:'Solutions', label:'Haies bocagères' },
    { kind:'Relations', label:'Lichens & arbres' },
    { kind:'Impact', label:'Empreinte hebdomadaire' },
  ];
  const filtered = q ? suggestions.filter(s => (s.label + ' ' + s.kind).toLowerCase().includes(q.toLowerCase())) : suggestions;

  return (
    <>
      <Backdrop open={open} onClick={onClose} dim={0.6}/>
      <div style={{
        position:'absolute', left:0, right:0, top:0, zIndex:40,
        transform: open ? 'translateY(0)' : 'translateY(-100%)',
        transition:'transform 320ms cubic-bezier(.2,.7,.2,1)',
        padding:'56px 16px 0',
      }}>
        <div style={{
          background:'linear-gradient(180deg, #1a1d20 0%, #0f1113 100%)',
          border:'1px solid rgba(255,255,255,0.06)',
          borderRadius:24, padding:'14px 14px 18px',
        }}>
          <div style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 12px',
            background:'rgba(255,255,255,0.05)', borderRadius:14 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cfc8b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.3-4.3"/>
            </svg>
            <input
              autoFocus={open}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Chercher une espèce, un milieu, un geste…"
              style={{
                flex:1, background:'transparent', border:'none', outline:'none',
                color:'#eae3d2', fontSize:15, padding:'8px 0',
              }}/>
            {q && (
              <button onClick={() => setQ('')} style={{ background:'none', border:'none', color:'#9a937f', cursor:'pointer', fontSize:13 }}>Effacer</button>
            )}
          </div>

          <div style={{ marginTop:14, fontSize:11, letterSpacing:1.3, textTransform:'uppercase', color:'#9a937f' }}>
            {q ? 'Résultats' : 'Suggestions'}
          </div>
          <div style={{ marginTop:10, maxHeight:280, overflowY:'auto', paddingRight:4 }}>
            {filtered.length === 0 && (
              <div style={{ fontSize:14, color:'#9a937f', padding:'18px 4px' }}>
                Aucun résultat. Essayez « forêt », « pollinisateur », « eau »…
              </div>
            )}
            {filtered.map((s, i) => (
              <button key={i} onClick={() => onPickQuery(s)} style={{
                width:'100%', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between',
                background:'none', border:'none', padding:'12px 8px', cursor:'pointer',
                borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                color:'#eae3d2', fontSize:15,
              }}>
                <span>{s.label}</span>
                <span style={{ fontSize:11, letterSpacing:1, textTransform:'uppercase', color:'#9a937f' }}>{s.kind}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Onboarding overlay — 3 step guide
function GuideOverlay({ open, onClose }) {
  const [step, setStep] = React.useState(0);
  React.useEffect(() => { if (!open) setStep(0); }, [open]);

  const steps = [
    {
      title: 'Bienvenue dans l’Atlas',
      body: 'Six territoires composent une carte vivante du monde. Chacun raconte une facette du vivant.',
      target: 'all',
    },
    {
      title: 'Au centre, les Relations',
      body: 'C’est le cœur de l’Atlas : les liens entre espèces, milieux et saisons. Tout y converge.',
      target: 'relations',
    },
    {
      title: 'Et vous, l’impact',
      body: 'Suivez l’effet de vos gestes au fil des semaines. Petits choix, grandes répercussions.',
      target: 'impact',
    },
  ];

  const s = steps[step];

  return (
    <>
      <Backdrop open={open} onClick={onClose} dim={0.65}/>
      <div style={{
        position:'absolute', inset:0, zIndex:41,
        display: open ? 'flex' : 'none',
        flexDirection:'column', justifyContent:'flex-end',
        pointerEvents: open ? 'auto' : 'none',
      }}>
        <div style={{
          margin:'0 16px 28px',
          background:'linear-gradient(180deg, #1a1d20 0%, #0f1113 100%)',
          border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:24,
          padding:'22px 22px 18px',
          color:'#eae3d2',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(20px)',
          transition: 'transform 360ms cubic-bezier(.2,.7,.2,1), opacity 280ms',
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display:'flex', gap:6, marginBottom:14 }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                flex:1, height:3, borderRadius:3,
                background: i <= step ? '#f4d889' : 'rgba(255,255,255,0.12)',
                transition:'background 200ms',
              }}/>
            ))}
          </div>
          <div style={{
            fontFamily:"'Cormorant Garamond', serif", fontSize:26, fontWeight:500,
            lineHeight:1.1, marginBottom:10, color:'#f6efdc',
          }}>{s.title}</div>
          <div style={{ fontSize:15, lineHeight:1.5, color:'#cfc8b5', marginBottom:20 }}>{s.body}</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <button onClick={onClose} style={{
              background:'none', border:'none', color:'#9a937f', cursor:'pointer', fontSize:14, padding:'8px 4px',
            }}>Passer</button>
            <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onClose()} style={{
              padding:'12px 22px', borderRadius:9999,
              background:'linear-gradient(180deg, #f4ecd8, #d9cfb0)',
              color:'#1c1a14', fontWeight:600, fontSize:14,
              border:'none', cursor:'pointer',
              boxShadow:'0 6px 20px rgba(0,0,0,0.35)',
            }}>{step < steps.length - 1 ? 'Suivant' : 'C’est parti'}</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Toast({ text }) {
  if (!text) return null;
  return (
    <div style={{
      position:'absolute', left:'50%', top:80, transform:'translateX(-50%)',
      background:'rgba(20,22,24,0.92)',
      color:'#eae3d2',
      padding:'10px 16px',
      borderRadius:9999,
      fontSize:13,
      border:'1px solid rgba(255,255,255,0.08)',
      backdropFilter:'blur(6px)',
      WebkitBackdropFilter:'blur(6px)',
      zIndex: 50,
      animation:'toastIn 240ms ease both',
      pointerEvents:'none',
    }}>{text}</div>
  );
}

Object.assign(window, { TerritorySheet, SearchPanel, GuideOverlay, Toast });
