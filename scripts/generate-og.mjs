import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="topGrad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#C4502E"/>
      <stop offset="100%" stop-color="#B8943B"/>
    </linearGradient>
    <linearGradient id="barFade" x1="0" y1="0" x2="0" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#EDE3D2" stop-opacity="0"/>
      <stop offset="85%"  stop-color="#EDE3D2" stop-opacity="0.85"/>
    </linearGradient>
  </defs>

  <!-- Fond crème parchemin -->
  <rect width="1200" height="630" fill="#F4EDE0"/>

  <!-- Zone droite en paper-3 -->
  <rect x="756" y="0" width="444" height="630" fill="#EDE3D2"/>

  <!-- Barres décoratives (droite) — palette Sankoré -->
  <g transform="translate(778, 50)">
    <rect x="0"   y="170" width="44" height="460" fill="#1B1F2A" opacity="0.13" rx="2"/>
    <rect x="60"  y="90"  width="44" height="540" fill="#C4502E" opacity="0.38" rx="2"/>
    <rect x="120" y="200" width="44" height="430" fill="#B8943B" opacity="0.32" rx="2"/>
    <rect x="180" y="130" width="44" height="500" fill="#1B1F2A" opacity="0.10" rx="2"/>
    <rect x="240" y="160" width="44" height="470" fill="#A6896E" opacity="0.38" rx="2"/>
    <rect x="300" y="110" width="44" height="520" fill="#C4502E" opacity="0.22" rx="2"/>
  </g>
  <!-- Fondu vers le bas sur les barres -->
  <rect x="756" y="0" width="444" height="630" fill="url(#barFade)"/>

  <!-- Ligne de séparation verticale -->
  <rect x="754" y="40" width="1" height="550" fill="#1B1F2A" opacity="0.07"/>

  <!-- Barre supérieure terracotta → or -->
  <rect width="1200" height="5" fill="url(#topGrad)"/>

  <!-- Eyebrow -->
  <text
    x="80" y="164"
    font-family="Arial, Helvetica, sans-serif"
    font-size="13"
    fill="#C4502E"
    letter-spacing="4.5"
  >MÉDIA INDÉPENDANT</text>

  <!-- Titre principal -->
  <text
    x="76" y="295"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="108"
    fill="#1B1F2A"
    letter-spacing="-2"
  >Sankoré</text>

  <!-- Tagline en italique -->
  <text
    x="80" y="362"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="32"
    fill="#4A5165"
    font-style="italic"
  >L'IA au travail, en Afrique</text>

  <!-- Ligne séparatrice terracotta -->
  <rect x="80" y="402" width="72" height="2.5" fill="#C4502E"/>

  <!-- Trois points or -->
  <circle cx="80"  cy="438" r="3.5" fill="#B8943B"/>
  <circle cx="98"  cy="438" r="3.5" fill="#B8943B"/>
  <circle cx="116" cy="438" r="3.5" fill="#B8943B"/>

  <!-- URL -->
  <text
    x="80" y="494"
    font-family="Arial, Helvetica, sans-serif"
    font-size="16"
    fill="#8A8275"
    letter-spacing="3"
  >sankore.africa</text>

  <!-- Bande inférieure paper-3 -->
  <rect x="0"  y="592" width="1200" height="38"  fill="#EDE3D2"/>
  <rect x="0"  y="591" width="1200" height="1"   fill="#1B1F2A" opacity="0.07"/>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
});

const png = resvg.render().asPng();
const out = resolve(__dirname, '../public/og-default.png');
writeFileSync(out, png);

console.log(`✓  og-default.png écrit dans public/ (${(png.length / 1024).toFixed(0)} ko)`);
