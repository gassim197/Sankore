import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const publicDir  = resolve(__dirname, '../public');
const svgPath    = resolve(publicDir, 'logo.svg');
const svg        = readFileSync(svgPath, 'utf8');

const sizes = [256, 512, 1024];

for (const size of sizes) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: 'rgba(0,0,0,0)',
    font: { loadSystemFonts: true },
  });
  const png = resvg.render().asPng();
  const out = resolve(publicDir, `logo-${size}.png`);
  writeFileSync(out, png);
  console.log(`✓ logo-${size}.png  (${(png.length / 1024).toFixed(0)} ko)`);
}

// Convertit logo-1024.png → logo-1024.jpg avec fond blanc via System.Drawing (PowerShell)
const pngIn  = resolve(publicDir, 'logo-1024.png').replace(/\\/g, '\\\\');
const jpgOut = resolve(publicDir, 'logo-1024.jpg').replace(/\\/g, '\\\\');

const ps = [
  'Add-Type -AssemblyName System.Drawing;',
  `$src = [System.Drawing.Image]::FromFile('${pngIn}');`,
  '$bmp = New-Object System.Drawing.Bitmap 1024,1024;',
  '$g = [System.Drawing.Graphics]::FromImage($bmp);',
  '$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality;',
  '$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic;',
  '$g.Clear([System.Drawing.Color]::White);',
  '$g.DrawImage($src, 0, 0, 1024, 1024);',
  '$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq \'image/jpeg\' };',
  '$params = New-Object System.Drawing.Imaging.EncoderParameters 1;',
  '$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 92L);',
  `$bmp.Save('${jpgOut}', $encoder, $params);`,
  '$g.Dispose(); $bmp.Dispose(); $src.Dispose();',
].join(' ');

execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${ps}"`, { stdio: 'inherit' });

const jpgSize = readFileSync(resolve(publicDir, 'logo-1024.jpg')).length;
console.log(`✓ logo-1024.jpg  (${(jpgSize / 1024).toFixed(0)} ko)`);
