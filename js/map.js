// Mapa esquemático del recorrido — es una representación orientativa y
// simplificada del orden y disposición relativa de las zonas (Generalife,
// Palacios Nazaríes, Partal), no un plano oficial ni topográfico.
// Coordenadas en un lienzo de 400x260.

const MAP_ZONES = [
  { name: 'Generalife', x: 40, y: 30, w: 110, h: 90 },
  { name: 'Palacios Nazaríes', x: 170, y: 60, w: 130, h: 140 },
  { name: 'El Partal', x: 310, y: 100, w: 70, h: 90 },
];

// Posición aproximada de cada parada (0-12) sobre el lienzo, siguiendo
// el recorrido: Generalife → acceso → Palacios → Partal
const STOP_POSITIONS = [
  { x: 40, y: 130 },   // 0 Bienvenida (entrada general)
  { x: 60, y: 110 },   // 1 La ciudad roja (camino)
  { x: 80, y: 90 },    // 2 Refugio del sultán
  { x: 105, y: 70 },   // 3 Agua del paraíso (Generalife)
  { x: 150, y: 95 },   // 4 Puertas del poder (acceso a Palacios)
  { x: 190, y: 100 },  // 5 Mexuar
  { x: 210, y: 120 },  // 6 Patio Arrayanes
  { x: 225, y: 140 },  // 7 Salón Embajadores
  { x: 245, y: 165 },  // 8 Patio de los Leones
  { x: 260, y: 185 },  // 9 Vida detrás del poder
  { x: 275, y: 165 },  // 10 Paredes que hablan
  { x: 320, y: 140 },  // 11 El Partal
  { x: 340, y: 120 },  // 12 Final de un reino
];

function renderMap(container, currentIndex) {
  const zonesSvg = MAP_ZONES.map(z => `
    <rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="10" class="map-zone"/>
    <text x="${z.x + z.w / 2}" y="${z.y + 14}" class="map-zone-label" text-anchor="middle">${z.name}</text>
  `).join('');

  const pathD = STOP_POSITIONS.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');

  const pointsSvg = STOP_POSITIONS.map((p, i) => {
    let cls = 'map-point pending';
    if (i < currentIndex) cls = 'map-point done';
    if (i === currentIndex) cls = 'map-point current';
    return `<circle cx="${p.x}" cy="${p.y}" r="${i === currentIndex ? 7 : 4}" class="${cls}" data-i="${i}"/>`;
  }).join('');

  container.innerHTML = `
    <svg viewBox="0 0 400 260" class="map-svg">
      ${zonesSvg}
      <path d="${pathD}" class="map-path" fill="none"/>
      ${pointsSvg}
    </svg>
  `;

  container.querySelectorAll('.map-point').forEach(pt => {
    pt.addEventListener('click', () => loadStop(parseInt(pt.dataset.i, 10)));
  });
}

window.renderMap = renderMap;
