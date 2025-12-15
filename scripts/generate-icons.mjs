#!/usr/bin/env node
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const sourceLogo = join(projectRoot, 'public/images/logo.png');
const publicDir = join(projectRoot, 'public');
const imagesDir = join(projectRoot, 'public/images');

// Vérifier que le logo source existe
if (!existsSync(sourceLogo)) {
  console.error('❌ Logo source introuvable:', sourceLogo);
  process.exit(1);
}

console.log('🎨 Génération des icônes à partir de:', sourceLogo);

const icons = [
  // Favicons
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon.ico', size: 32 }, // ICO 32x32
  
  // Apple Touch Icons
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'images/apple-touch-icon-180x180.png', size: 180 },
  
  // PWA Icons (différentes tailles pour manifest)
  { name: 'images/icon-192x192.png', size: 192 },
  { name: 'images/icon-512x512.png', size: 512 },
  { name: 'images/icon-maskable-192x192.png', size: 192, maskable: true },
  { name: 'images/icon-maskable-512x512.png', size: 512, maskable: true },
  
  // Open Graph optimal pour réseaux sociaux (1200x630)
  { name: 'images/og-image-social.png', width: 1200, height: 630 },
];

async function generateIcons() {
  for (const icon of icons) {
    try {
      const outputPath = join(publicDir, icon.name);
      const outputDir = dirname(outputPath);
      
      // Créer le dossier si nécessaire
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      let sharpInstance = sharp(sourceLogo);

      if (icon.maskable) {
        // Pour les icônes maskable, ajouter un padding de 10% (safe zone)
        const size = icon.size;
        const padding = Math.floor(size * 0.1);
        const innerSize = size - (padding * 2);
        
        sharpInstance = sharpInstance
          .resize(innerSize, innerSize, { fit: 'contain', background: { r: 253, g: 251, b: 247, alpha: 1 } })
          .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 253, g: 251, b: 247, alpha: 1 }
          });
      } else if (icon.width && icon.height) {
        // Pour Open Graph (ratio différent)
        sharpInstance = sharpInstance
          .resize(icon.width, icon.height, { 
            fit: 'contain', 
            background: { r: 253, g: 251, b: 247, alpha: 1 } 
          });
      } else {
        // Resize standard carré
        sharpInstance = sharpInstance
          .resize(icon.size, icon.size, { fit: 'contain', background: { r: 253, g: 251, b: 247, alpha: 1 } });
      }

      // Convertir en PNG ou ICO
      if (icon.name.endsWith('.ico')) {
        await sharpInstance.png().toFile(outputPath);
      } else {
        await sharpInstance.png().toFile(outputPath);
      }

      console.log(`✅ Généré: ${icon.name} ${icon.width ? `(${icon.width}x${icon.height})` : `(${icon.size}x${icon.size})`}`);
    } catch (error) {
      console.error(`❌ Erreur pour ${icon.name}:`, error.message);
    }
  }
}

generateIcons()
  .then(() => {
    console.log('\n🎉 Toutes les icônes ont été générées avec succès !');
    console.log('\n📋 Icônes créées:');
    console.log('  - Favicons: favicon-16x16.png, favicon-32x32.png, favicon.ico');
    console.log('  - Apple Touch: apple-touch-icon.png');
    console.log('  - PWA: icon-192x192.png, icon-512x512.png');
    console.log('  - Maskable: icon-maskable-192x192.png, icon-maskable-512x512.png');
    console.log('  - Social: og-image-social.png (1200x630)');
  })
  .catch(error => {
    console.error('❌ Erreur globale:', error);
    process.exit(1);
  });
