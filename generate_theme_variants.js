
function hexToHSL(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin;
  let h = 0, s = 0, l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h} ${s}% ${l}%`;
}

function invertLightness(hslStr) {
  const parts = hslStr.split(" ");
  const h = parts[0];
  const s = parts[1];
  let l = parseFloat(parts[2]);
  
  // Invert L: 
  // If it's light (>50), make it dark (5-15). 
  // If it's dark (<50), make it light (90-98).
  let newL = l > 50 ? (l > 90 ? 5 : 15) : (l < 10 ? 98 : 90);
  
  return `${h} ${s} ${newL}%`;
}

const themes = [
  // Light themes needing Dark
  { name: "nostalgic", mode: "dark", base: { bg: "#F0F0DB", fg: "#40513B", primary: "#E67E22" } },
  { name: "vintage", mode: "dark", base: { bg: "#F1E9E9", fg: "#B85042", primary: "#F9C6B0" } },
  { name: "corporate", mode: "dark", base: { bg: "#FFFFFF", fg: "#002C54", primary: "#002C54" } },
  { name: "eco", mode: "dark", base: { bg: "#F9F9F9", fg: "#2B9348", primary: "#556B2F" } },
  { name: "pastel", mode: "dark", base: { bg: "#FDFDFD", fg: "#A78BFA", primary: "#CFFFEA" } },
  { name: "retro", mode: "dark", base: { bg: "#FFF5C5", fg: "#138A7D", primary: "#FFCF36" } },
  { name: "neuro", mode: "dark", base: { bg: "#F7F5F2", fg: "#374151", primary: "#4B7BEC" } },
  { name: "heritage", mode: "dark", base: { bg: "#F3E5AB", fg: "#002FA7", primary: "#002FA7" } },

  // Dark themes needing Light
  { name: "neon", mode: "light", base: { bg: "#0C0C0C", fg: "#00E8FF", primary: "#8A00FF" } },
  { name: "luxury", mode: "light", base: { bg: "#000000", fg: "#D9B648", primary: "#D9B648" } },
  { name: "biolum", mode: "light", base: { bg: "#050510", fg: "#00FF94", primary: "#00FF94" } }
];

themes.forEach(t => {
  const bgHSL = hexToHSL(t.base.bg);
  const fgHSL = hexToHSL(t.base.fg);
  const primHSL = hexToHSL(t.base.primary);
  
  const newBg = invertLightness(bgHSL);
  const newFg = invertLightness(fgHSL);
  
  console.log(`\n/* --- ${t.name.toUpperCase()} (${t.mode === 'dark' ? 'Dark' : 'Light'}) --- */`);
  console.log(`[data-theme='${t.name}']${t.mode === 'dark' ? '.dark' : ''} {`); // Note: for light mode we typically just use the base class or check how other themes do it.
  // Actually, looking at existing CSS:
  // Ocean Light: [data-theme='ocean']
  // Ocean Dark: [data-theme='ocean'].dark
  // So if I am generating "Light" for "Neon" (which is currently dark by default), I should probably make the DEFAULT Neon be Light (or Dark?) and the other one be .dark?
  // Current implementation:
  // Neon: [data-theme='neon'] -> has Dark colors.
  // So for Neon Light, I should probably add [data-theme='neon'].light ? No, usually .dark is the modifier class added by next-themes.
  // If the DEFAULT [data-theme='neon'] is Dark, then when <html class="light"> is present, it might still show dark unless I scope it.
  
  // Correction:
  // Usually themes are written as:
  // [data-theme='foo'] { ...light vars... }
  // [data-theme='foo'].dark { ...dark vars... }
  
  // But for Neon, I wrote:
  // [data-theme='neon'] { ...dark vars... }
  // This means Neon is Dark in both Light and Dark mode currently (unless system overrides).
  // To fix this, I should:
  // 1. Move the current Neon definition to `[data-theme='neon'].dark` (or keep it as default if it's inherently dark, but better to follow convention).
  // 2. Create a `[data-theme='neon']` (implied light) or `[data-theme='neon']` for light mode.
  
  // So for "Light themes needing Dark":
  // Generate `[data-theme='name'].dark` block.
  
  // For "Dark themes needing Light":
  // 1. Rename current `[data-theme='name']` to `[data-theme='name'].dark` ?
  // 2. Generate new `[data-theme='name']` for light mode.
  
  // Wait, if I change the current [data-theme='neon'] to be just Light, I break the "Neon is dark" vibe.
  // But the user wants adaptation.
  // So:
  // [data-theme='neon'] -> Light Mode version (White bg with Neon accents)
  // [data-theme='neon'].dark -> Dark Mode version (Black bg with Neon accents - CURRENT)
  
  // My script generates the *missing* part.
  
  if (t.mode === 'light') {
     // This means we are generating the LIGHT version for a theme that is currently DARK.
     // So the selector should be just [data-theme='${t.name}']
     // AND I need to know that I must update the EXISTING selector to be .dark
     console.log(`  /* New Light Mode for ${t.name} */`);
  } else {
     // Generating DARK version for a Light theme
     console.log(`  /* Dark Mode for ${t.name} */`);
  }

  console.log(`  --background: ${newBg};`);
  console.log(`  --color-background: hsl(${newBg});`);
  
  console.log(`  --foreground: ${newFg};`);
  console.log(`  --color-foreground: hsl(${newFg});`);
  
  // Card
  // For dark mode: slightly lighter than bg. For light mode: white or slightly off-white.
  // Heuristic: same as bg but shift lightness 5%
  let bgL = parseFloat(newBg.split(" ")[2]);
  let cardL = t.mode === 'dark' ? bgL + 5 : 100; 
  let cardHSL = `${newBg.split(" ")[0]} ${newBg.split(" ")[1]} ${cardL}%`;
  console.log(`  --card: ${cardHSL};`);
  console.log(`  --color-card: hsl(${cardHSL});`);
  
  console.log(`  --card-foreground: ${newFg};`);
  console.log(`  --color-card-foreground: hsl(${newFg});`);
  
  console.log(`  --popover: ${cardHSL};`);
  console.log(`  --color-popover: hsl(${cardHSL});`);
  
  console.log(`  --popover-foreground: ${newFg};`);
  console.log(`  --color-popover-foreground: hsl(${newFg});`);
  
  console.log(`  --primary: ${primHSL};`);
  console.log(`  --color-primary: hsl(${primHSL});`);
  
  // Primary Foreground: usually white for dark themes, dark for light themes (or white if primary is dark enough)
  // Simple heuristic: if primary L > 50, use black, else white.
  let primL = parseFloat(primHSL.split(" ")[2]);
  let primFg = primL > 60 ? "0 0% 0%" : "0 0% 100%";
  console.log(`  --primary-foreground: ${primFg};`);
  console.log(`  --color-primary-foreground: hsl(${primFg});`);
  
  // Secondary: usually muted version of primary or background
  // Let's use fg color but with low opacity/lightness?
  // Or just use the inverted secondary from base?
  // Let's just map secondary to be a soft version of primary.
  let secL = t.mode === 'dark' ? 20 : 90;
  let secHSL = `${primHSL.split(" ")[0]} 20% ${secL}%`;
  console.log(`  --secondary: ${secHSL};`);
  console.log(`  --color-secondary: hsl(${secHSL});`);
  
  console.log(`  --secondary-foreground: ${newFg};`);
  console.log(`  --color-secondary-foreground: hsl(${newFg});`);
  
  // Muted
  let mutedL = t.mode === 'dark' ? 15 : 90;
  let mutedHSL = `${newBg.split(" ")[0]} 10% ${mutedL}%`;
  console.log(`  --muted: ${mutedHSL};`);
  console.log(`  --color-muted: hsl(${mutedHSL});`);
  
  console.log(`  --muted-foreground: ${newFg};`); // rough approx
  console.log(`  --color-muted-foreground: hsl(${newFg});`);
  
  // Accent
  let accL = t.mode === 'dark' ? 20 : 90;
  let accHSL = `${primHSL.split(" ")[0]} 30% ${accL}%`;
  console.log(`  --accent: ${accHSL};`);
  console.log(`  --color-accent: hsl(${accHSL});`);
  
  console.log(`  --accent-foreground: ${primHSL};`);
  console.log(`  --color-accent-foreground: hsl(${primHSL});`);
  
  // Destructive - standard
  console.log(`  --destructive: 0 84% 60%;`);
  console.log(`  --color-destructive: hsl(0 84% 60%);`);
  console.log(`  --destructive-foreground: 0 0% 98%;`);
  console.log(`  --color-destructive-foreground: hsl(0 0% 98%);`);
  
  // Border/Input
  let bordL = t.mode === 'dark' ? 20 : 85;
  let bordHSL = `${newBg.split(" ")[0]} 20% ${bordL}%`;
  console.log(`  --border: ${bordHSL};`);
  console.log(`  --color-border: hsl(${bordHSL});`);
  
  console.log(`  --input: ${bordHSL};`);
  console.log(`  --color-input: hsl(${bordHSL});`);
  
  console.log(`  --ring: ${primHSL};`);
  console.log(`  --color-ring: hsl(${primHSL});`);
  
  console.log(`}`);
});
