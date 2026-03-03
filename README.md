# Zermelo Liquid Glass (Chrome extensie)

Deze extensie geeft Zermelo een hyperminimalistische Apple-achtige liquid glass/glassmorphism look met duidelijk contrast.

## Features
- Light + dark mode
- Floating toggle-knop rechtsonder (☀/☾)
- Poppins lettertype (Google Fonts)
- Micro-interacties op cards, menu-items en knoppen
- SVG-kleur-override voor consistente icon-contrast in beide themes

## Inhoud
- `manifest.json`: Chrome MV3-configuratie
- `content.js`: theme-management, toggle, Poppins injectie, micro-interacties
- `dark-modern.css`: volledige glassmorphism overrides voor Zermelo

## Installeren in Chrome
1. Open `chrome://extensions`
2. Zet `Developer mode` aan
3. Klik op `Load unpacked`
4. Selecteer deze map:
   `/Users/yannis/Downloads/zermelo css extensie`
5. Open je Zermelo pagina (`*.zermelo.nl` of `*.zportal.nl`) en refresh

## Toggle gebruiken
- Klik op de zwevende knop rechtsonder om te wisselen tussen light en dark mode.
- De keuze wordt opgeslagen per Zermelo-domein in `localStorage`.
