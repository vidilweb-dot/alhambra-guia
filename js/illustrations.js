// Ilustraciones originales por parada — trazo geométrico simple inspirado en
// motivos reales de la arquitectura nazarí (arcos, agua, celosías, epigrafía),
// no son reproducciones de fotografías ni de obras existentes.
// Usan las variables de color de style.css vía currentColor / clases.

const STOP_ICONS = {
  0: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <path class="ic-line" d="M30 75 V45 A20 20 0 0 1 70 45 V75" fill="none"/>
    <path class="ic-gold" d="M50 20 l4 8 8 1 -6 6 1.5 8 -7.5 -4 -7.5 4 1.5 -8 -6 -6 8 -1z"/>
    <line class="ic-line" x1="22" y1="75" x2="78" y2="75"/></svg>`,

  1: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <path class="ic-gold" d="M20 70 V50 h8 v-8 h8 v8h8 v-10 h8 v10h8 v-8h8 v8h8 v20z" fill-rule="evenodd"/>
    <line class="ic-line" x1="20" y1="70" x2="80" y2="70"/></svg>`,

  2: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <path class="ic-teal" d="M35 75 V55 Q35 35 35 25 Q35 35 35 55 V75z"/>
    <path class="ic-teal" d="M65 75 V50 Q65 30 65 20 Q65 30 65 50 V75z"/>
    <path class="ic-gold" d="M42 78 h16 v-14 a8 8 0 0 0 -16 0z"/></svg>`,

  3: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <path class="ic-line" d="M20 45 Q35 35 50 45 T80 45" fill="none"/>
    <path class="ic-gold" d="M20 58 Q35 48 50 58 T80 58" fill="none"/>
    <path class="ic-line" d="M20 71 Q35 61 50 71 T80 71" fill="none"/></svg>`,

  4: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <path class="ic-gold" d="M30 78 V45 A20 20 0 0 1 70 45 V78z" fill="none" stroke-width="4"/>
    <path class="ic-line" d="M38 78 V48 A12 12 0 0 1 62 48 V78z" fill="none"/></svg>`,

  5: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <line class="ic-gold" x1="50" y1="25" x2="50" y2="45"/>
    <line class="ic-line" x1="30" y1="45" x2="70" y2="45"/>
    <line class="ic-line" x1="30" y1="45" x2="24" y2="60"/>
    <line class="ic-line" x1="70" y1="45" x2="76" y2="60"/>
    <path class="ic-teal" d="M18 60 h12 l-6 12z"/>
    <path class="ic-teal" d="M70 60 h12 l-6 12z"/></svg>`,

  6: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <rect class="ic-teal" x="20" y="55" width="60" height="20" rx="2"/>
    <path class="ic-line" d="M30 55 V38 A20 14 0 0 1 70 38 V55" fill="none"/></svg>`,

  7: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <path class="ic-line" d="M22 65 A28 28 0 0 1 78 65" fill="none"/>
    <path class="ic-gold" d="M50 25 L58 40 L42 40z"/>
    <path class="ic-gold" d="M50 25 L58 40 L42 40z" transform="rotate(45 50 40)"/>
    <path class="ic-gold" d="M50 25 L58 40 L42 40z" transform="rotate(90 50 40)"/>
    <path class="ic-gold" d="M50 25 L58 40 L42 40z" transform="rotate(135 50 40)"/></svg>`,

  8: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <circle class="ic-gold" cx="50" cy="50" r="8" fill="none" stroke-width="3"/>
    <line class="ic-teal" x1="50" y1="20" x2="50" y2="38"/>
    <line class="ic-teal" x1="50" y1="62" x2="50" y2="80"/>
    <line class="ic-teal" x1="20" y1="50" x2="38" y2="50"/>
    <line class="ic-teal" x1="62" y1="50" x2="80" y2="50"/></svg>`,

  9: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <path class="ic-line" d="M25 78 V55 A9 9 0 0 1 43 55 V78z" fill="none"/>
    <path class="ic-gold" d="M43 78 V50 A11 11 0 0 1 65 50 V78z" fill="none"/>
    <path class="ic-line" d="M65 78 V58 A7 7 0 0 1 79 58 V78z" fill="none"/></svg>`,

  10: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <path class="ic-gold" d="M22 40 Q32 30 42 40 T62 40 T82 40" fill="none"/>
    <path class="ic-line" d="M22 55 Q32 45 42 55 T62 55 T82 55" fill="none"/>
    <path class="ic-gold" d="M22 70 Q32 60 42 70 T62 70 T82 70" fill="none"/></svg>`,

  11: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <line class="ic-line" x1="28" y1="40" x2="28" y2="76"/>
    <line class="ic-line" x1="44" y1="40" x2="44" y2="76"/>
    <line class="ic-line" x1="60" y1="40" x2="60" y2="76"/>
    <line class="ic-line" x1="76" y1="40" x2="76" y2="76"/>
    <line class="ic-gold" x1="22" y1="40" x2="82" y2="40"/>
    <path class="ic-teal" d="M18 30 l10 -8 10 8 10 -6 10 6 10 -8 10 8" fill="none"/></svg>`,

  12: `<svg viewBox="0 0 100 100"><circle class="ic-bg" cx="50" cy="50" r="46"/>
    <path class="ic-line" d="M20 70 h60 v-6 h-60z"/>
    <path class="ic-gold" d="M30 64 V44 h8 v-8 h4 v8h8 v-8h4 v8h8 v20z" fill="none"/>
    <line class="ic-teal" x1="50" y1="20" x2="50" y2="30"/>
    <line class="ic-teal" x1="43" y1="27" x2="57" y2="27"/></svg>`,
};

window.STOP_ICONS = STOP_ICONS;
