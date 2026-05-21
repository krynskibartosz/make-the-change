// Image-based atlas backdrop. Full-bleed organic scene + golden dust overlay,
// masked so the title area at top stays calm and the dust only blooms below.

function AtlasBackground({ dust = 0.28, vignette = 0.55 }) {
  // Push the dust to start much lower so the title area breathes
  const dustMask = 'linear-gradient(to bottom, transparent 0%, transparent 26%, rgba(0,0,0,0.4) 38%, black 50%, black 88%, rgba(0,0,0,0.7) 100%)';
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: '#04060a',
    }}>
      {/* Main illustrated scene */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url("assets/atlas_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}/>

      {/* Golden dust overlay — screen blend, masked from top */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url("assets/golden_dust.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        mixBlendMode: 'screen',
        opacity: dust,
        pointerEvents: 'none',
        WebkitMaskImage: dustMask,
        maskImage: dustMask,
      }}/>

      {/* Soft top scrim so the title sits cleanly */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '24%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))',
        pointerEvents: 'none',
      }}/>

      {/* Inner vignette focusing on content */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(120% 90% at 50% 50%, transparent 50%, rgba(0,0,0,${0.5 * vignette}) 100%)`,
        pointerEvents: 'none',
      }}/>
    </div>
  );
}

window.AtlasBackground = AtlasBackground;
