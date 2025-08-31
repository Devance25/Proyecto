/* ==================== CONFIGURACIÓN INICIAL ==================== */
const CONFIG = {
  IMAGENES_DINOSAURIOS: {
    't-rex': { disponible: 'img/dino-t-rex.png', colocado: 'img/dino-t-rex-arriba.png' },
    'triceratops': { disponible: 'img/dino-triceratops.png', colocado: 'img/dino-triceratops-arriba.png' },
    'diplodocus': { disponible: 'img/dino-diplodocus.png', colocado: 'img/dino-diplodocus-arriba.png' },
    'stegosaurus': { disponible: 'img/dino-stegosaurus.png', colocado: 'img/dino-stegosaurus-arriba.png' },
    'parasaurolophus': { disponible: 'img/dino-parasaurolophus.png', colocado: 'img/dino-parasaurolophus-arriba.png' }
  },
  PESOS_DINOSAURIOS: {
    't-rex': 7.0, 'triceratops': 7.0, 'diplodocus': 15.0,
    'stegosaurus': 5.0, 'parasaurolophus': 2.5
  },
  TIPOS_DINOSAURIOS: ['t-rex', 'triceratops', 'diplodocus', 'stegosaurus', 'parasaurolophus'],
  DINOSAURIOS_POR_RONDA: 6,
  POSICIONES_DINOSAURIOS: [
    { top: '50%', left: '50%' }, { top: '30%', left: '30%' }, { top: '30%', left: '70%' },
    { top: '70%', left: '30%' }, { top: '70%', left: '70%' }, { top: '50%', left: '20%' },
    { top: '20%', left: '50%' }, { top: '80%', left: '50%' }
  ],
  POSICIONES_MINI_DINOSAURIOS: [
    { top: '50%', left: '50%' }, { top: '25%', left: '25%' }, { top: '25%', left: '75%' },
    { top: '75%', left: '25%' }, { top: '75%', left: '75%' }, { top: '50%', left: '15%' },
    { top: '15%', left: '50%' }, { top: '85%', left: '50%' }
  ]
};

/* ==================== REGLAS DE RECINTOS ==================== */
const REGLAS_RECINTOS = {
  'bosque-semejanza': {
    validar: (recinto, nuevoDino) => recinto.length === 0 || recinto.every(d => d === nuevoDino),
    maxDinos: 6,
    puntos: [0, 2, 4, 8, 12, 18, 24]
  },
  'woody-trio': {
    validar: () => true,
    maxDinos: 3,
    puntos: cant => cant === 3 ? 7 : 0
  },
  'pradera-amor': {
    validar: () => true,
    maxDinos: 6,
    puntos: recinto => {
      const conteos = {};
      recinto.forEach(d => conteos[d] = (conteos[d] || 0) + 1);
      return Object.values(conteos).reduce((t, c) => t + Math.floor(c / 2) * 5, 0);
    }
  },
  'rey-jungla': {
    validar: () => true,
    maxDinos: 1,
    puntos: recinto => recinto.length === 1 ? 7 : 0
  },
  'prado-diferencia': {
    validar: (recinto, nuevoDino) => !recinto.includes(nuevoDino),
    maxDinos: 6,
    puntos: [0, 1, 3, 6, 10, 15, 21]
  },
  'isla-solitaria': {
    validar: () => true,
    maxDinos: 1,
    puntos: (recinto, todos) => {
      if (recinto.length !== 1) return 0;
      const tipo = recinto[0];
      const totalTipo = Object.values(todos).flat().filter(d => d === tipo).length;
      return totalTipo === 1 ? 7 : 0;
    }
  },
  'rio': {
    validar: () => true,
    maxDinos: 20,
    puntos: cant => cant
  }
};

/* ==================== ESTADO DEL JUEGO ==================== */
let estadoJuego = {
  jugadores: [],
  jugadorActual: 1,
  primerJugador: 1,
  rondaActual: 1,
  turnoEnRonda: 1,
  jugador1: {
    nombre: '',
    dinosauriosDisponibles: [],
    recintos: {
      'bosque-semejanza': [], 'woody-trio': [], 'pradera-amor': [],
      'rey-jungla': [], 'prado-diferencia': [], 'isla-solitaria': [], 'rio': []
    },
    puntos: 0,
    puntosRonda: 0
  },
  jugador2: {
    nombre: '',
    dinosauriosDisponibles: [],
    recintos: {
      'bosque-semejanza': [], 'woody-trio': [], 'pradera-amor': [],
      'rey-jungla': [], 'prado-diferencia': [], 'isla-solitaria': [], 'rio': []
    },
    puntos: 0,
    puntosRonda: 0
  },
  restriccionActual: null,
  repartosDisponibles: [],
  puedePasarTurno: false,
  yaColocoEnTurno: false
};

/* === Helpers para popups === */
function abrirCapa(popup) {
  if (!popup) return;
  popup.classList.remove('hidden');
  popup.style.display = popup.classList.contains('popup-overlay') ? 'flex' : 'block';
  document.body.style.overflow = 'hidden';
}
function cerrarCapa(popup) {
  if (!popup) return;
  popup.classList.add('hidden');
  popup.style.display = 'none';
  document.body.style.overflow = '';
}
function hayPopupAbierto() {
  return Array.from(document.querySelectorAll('.popup-overlay'))
    .some(p => !p.classList.contains('hidden') && p.style.display !== 'none');
}

let dinosaurioArrastrado = null;

/* ==================== LÓGICA DEL JUEGO ==================== */
const GameLogic = {
  puedeColocarDinosaurio(recinto, tipoDino) {
    if (estadoJuego.yaColocoEnTurno) return false;
    const jugadorData = estadoJuego[`jugador${estadoJuego.jugadorActual}`];
    const recintoActual = jugadorData.recintos[recinto];
    const reglas = REGLAS_RECINTOS[recinto];
    if (!reglas) return false;

    // Límite de recinto
    if (recintoActual.length >= reglas.maxDinos) return false;

    // Restricción del dado (si existe). validarRestriccion = true => inválido
    if (estadoJuego.restriccionActual && this.validarRestriccion(recinto, tipoDino)) return false;

    return reglas.validar(recintoActual, tipoDino);
  },

  validarRestriccion(recinto, tipoDino) {
    // Devuelve TRUE si NO se puede colocar por la restricción
    const recintosJugador = estadoJuego[`jugador${estadoJuego.jugadorActual}`].recintos;
    switch (estadoJuego.restriccionActual) {
      case 'no-t-rex':
        return tipoDino !== 't-rex' && recintosJugador[recinto].some(d => d === 't-rex');
      case 'lugar-vacio':
        return recintosJugador[recinto].length > 0;
      case 'lado-cafeteria':
        return !['bosque-semejanza', 'woody-trio', 'pradera-amor'].includes(recinto);
      case 'bosque':
        return !['bosque-semejanza', 'woody-trio'].includes(recinto);
      case 'rocas':
        return !['rey-jungla', 'isla-solitaria'].includes(recinto);
      case 'lado-banos':
        return !['rey-jungla', 'prado-diferencia', 'isla-solitaria'].includes(recinto);
      default:
        return false;
    }
  },

  colocarDinosaurio(recinto, tipoDino, area) {
    if (estadoJuego.yaColocoEnTurno) return;

    const jugadorData = estadoJuego[`jugador${estadoJuego.jugadorActual}`];

    // Quitar de disponibles
    const idx = jugadorData.dinosauriosDisponibles.indexOf(tipoDino);
    if (idx > -1) jugadorData.dinosauriosDisponibles.splice(idx, 1);

    // Agregar al estado
    jugadorData.recintos[recinto].push(tipoDino);

    // Pintar en el tablero actual
    const img = document.createElement('img');
    img.src = CONFIG.IMAGENES_DINOSAURIOS[tipoDino].colocado;
    img.className = 'dinosaurio-colocado';
    img.alt = tipoDino;

    const cantidad = jugadorData.recintos[recinto].length;
    this.posicionarDinosaurio(img, cantidad);
    area.appendChild(img);

    // Flags/UI
    estadoJuego.yaColocoEnTurno = true;
    JuegoManager.mostrarDinosauriosDisponibles(); // se actualiza la mano
    this.actualizarPuntos();
    this.actualizarPesos();

    // Pedir descarte
    setTimeout(() => JuegoManager.mostrarPopupDescarte(), 350);
  },

  posicionarDinosaurio(el, cantidad) {
    const pos = CONFIG.POSICIONES_DINOSAURIOS[(cantidad - 1) % CONFIG.POSICIONES_DINOSAURIOS.length];
    Object.assign(el.style, {
      position: 'absolute',
      top: pos.top,
      left: pos.left,
      transform: 'translate(-50%, -50%)',
      zIndex: '15',
      pointerEvents: 'none'
    });
  },

  calcularPuntos(recintos) {
    let total = 0;

    Object.keys(recintos).forEach(nombre => {
      const recinto = recintos[nombre];
      const reglas = REGLAS_RECINTOS[nombre];
      if (!reglas) return;

      if (typeof reglas.puntos === 'function') {
        if (nombre === 'isla-solitaria') total += reglas.puntos(recinto, recintos);
        else if (nombre === 'rio' || nombre === 'woody-trio') total += reglas.puntos(recinto.length);
        else total += reglas.puntos(recinto);
      } else if (Array.isArray(reglas.puntos)) {
        total += reglas.puntos[recinto.length] || 0;
      }
    });

    // Bonus T-Rex: +1 por recinto que contenga al menos un T-Rex
    Object.values(recintos).forEach(recinto => {
      if (recinto.some(d => d === 't-rex')) total += 1;
    });

    return total;
  },

  actualizarPuntos() {
    const j = estadoJuego[`jugador${estadoJuego.jugadorActual}`];
    j.puntosRonda = this.calcularPuntos(j.recintos);
    JuegoManager.actualizarPuntosInterfaz();
  },

  actualizarPesos() {
    const j = estadoJuego[`jugador${estadoJuego.jugadorActual}`];
    let pesoTotal = 0;

    Object.keys(j.recintos).forEach(recinto => {
      const dinos = j.recintos[recinto];
      const peso = dinos.reduce((s, d) => s + CONFIG.PESOS_DINOSAURIOS[d], 0);
      pesoTotal += peso;
      const elem = document.getElementById(`peso-${recinto}`);
      if (elem) elem.textContent = peso.toFixed(1);
    });

    const elemTotal = document.getElementById('peso-total');
    if (elemTotal) elemTotal.textContent = pesoTotal.toFixed(1);
  }
};/* ==================== SISTEMA DRAG & DROP ==================== */
const DragDropManager = {
  init() {
    const dinosaurios = document.querySelectorAll('.dino');
    const dropZones = [...document.querySelectorAll('.cuadro'), ...document.querySelectorAll('.rectangulo')];

    dinosaurios.forEach(dino => {
      dino.addEventListener('dragstart', this.handleDragStart.bind(this));
      dino.addEventListener('dragend', this.handleDragEnd.bind(this));
    });

    dropZones.forEach(zone => {
      if (zone.dataset.ddInited === '1') return;
      zone.addEventListener('dragover', this.handleDragOver);
      zone.addEventListener('drop', this.handleDrop.bind(this));
      zone.addEventListener('dragenter', this.handleDragEnter.bind(this));
      zone.addEventListener('dragleave', this.handleDragLeave);
      zone.dataset.ddInited = '1';
    });
  },

  handleDragStart(e) {
    if (hayPopupAbierto() || estadoJuego.yaColocoEnTurno) {
      e.preventDefault();
      return;
    }
    dinosaurioArrastrado = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.tipo);
  },

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.drop-zone-active, .drop-zone-invalid').forEach(el => {
      el.classList.remove('drop-zone-active', 'drop-zone-invalid');
    });
  },

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  },

  handleDragEnter(e) {
    e.preventDefault();
    const recinto = e.currentTarget.dataset.recinto || e.target.closest('[data-recinto]')?.dataset.recinto;
    if (recinto && GameLogic.puedeColocarDinosaurio(recinto, dinosaurioArrastrado?.dataset.tipo)) {
      e.currentTarget.classList.add('drop-zone-active');
    } else {
      e.currentTarget.classList.add('drop-zone-invalid');
    }
  },

  handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drop-zone-active', 'drop-zone-invalid');
    }
  },

  handleDrop(e) {
    e.preventDefault();
    const tipoDino = e.dataTransfer.getData('text/plain');
    const area = e.target.closest('[data-recinto]') || e.currentTarget;
    const recinto = area.dataset.recinto;

    if (recinto && GameLogic.puedeColocarDinosaurio(recinto, tipoDino)) {
      GameLogic.colocarDinosaurio(recinto, tipoDino, area);
    }

    area.classList.remove('drop-zone-active', 'drop-zone-invalid');
  }
};

/* ==================== SISTEMA DE MAPA DEL OPONENTE ==================== */
const MapaOponente = {
  mostrar() {
    const oponente = estadoJuego.jugadorActual === 1 ? estadoJuego.jugador2 : estadoJuego.jugador1;
    this.actualizarTitulo(oponente.nombre);
    this.mostrarDinosaurios(oponente.recintos);
    this.calcularPuntos(oponente.recintos);
    abrirCapa(document.getElementById('popup-mapa'));
  },

  actualizarTitulo(nombre) {
    const t = document.getElementById('titulo-mapa');
    if (t) t.textContent = `MAPA DE ${nombre?.toUpperCase() || 'OPONENTE'}`;
  },

  mostrarDinosaurios(recintos) {
    document.querySelectorAll('.mini-dinosaurios').forEach(c => c.innerHTML = '');
    Object.entries(recintos).forEach(([recinto, dinos]) => {
      const cont = document.getElementById(`mapa-${recinto}`);
      if (!cont || dinos.length === 0) return;
      dinos.forEach((tipo, i) => {
        const el = this.crearMiniDinosaurio(tipo, i + 1);
        cont.appendChild(el);
      });
    });
  },

  crearMiniDinosaurio(tipoDino, posIndex) {
    const el = document.createElement('img');
    el.src = CONFIG.IMAGENES_DINOSAURIOS[tipoDino].colocado;
    el.className = 'mini-dinosaurio';
    el.alt = tipoDino;
    const pos = CONFIG.POSICIONES_MINI_DINOSAURIOS[(posIndex - 1) % CONFIG.POSICIONES_MINI_DINOSAURIOS.length];
    Object.assign(el.style, {
      position: 'absolute',
      top: pos.top,
      left: pos.left,
      transform: 'translate(-50%, -50%)',
      zIndex: '15',
      pointerEvents: 'none'
    });
    return el;
  },

  calcularPuntos(recintos) {
    const detalle = {};
    let total = 0;

    Object.keys(recintos).forEach(nombre => {
      const recinto = recintos[nombre];
      const reglas = REGLAS_RECINTOS[nombre];
      let pts = 0;

    if (typeof reglas.puntos === 'function') {
        if (nombre === 'isla-solitaria') pts = reglas.puntos(recinto, recintos);
        else if (nombre === 'rio' || nombre === 'woody-trio') pts = reglas.puntos(recinto.length);
        else pts = reglas.puntos(recinto);
      } else if (Array.isArray(reglas.puntos)) {
        pts = reglas.puntos[recinto.length] || 0;
      }detalle[nombre] = pts;
      total += pts;
    });

    Object.values(recintos).forEach(r => {
      if (r.some(d => d === 't-rex')) total += 1;
    });

    this.actualizarPuntosUI(detalle, total);
  },

  actualizarPuntosUI(detalle, total) {
    Object.entries(detalle).forEach(([recinto, pts]) => {
      const el = document.getElementById(`puntos-${recinto}`);
      if (el) el.textContent = `${pts} pts`;
    });
    const totalEl = document.getElementById('puntos-total-oponente');
    if (totalEl) totalEl.innerHTML = `<strong>${total} PUNTOS</strong>`;
  }
};

/* ==================== POPUPS ==================== */
const PopupManager = {
  mostrarReglas() {
    abrirCapa(document.getElementById('popup-reglas'));
  },
  mostrarPesos() {
    GameLogic.actualizarPesos();
    abrirCapa(document.getElementById('popup-pesos'));
  },
  cerrar(popupId) {
    if (popupId) cerrarCapa(document.getElementById(popupId));
    else document.querySelectorAll('.popup-overlay').forEach(p => cerrarCapa(p));
  },
  setupEventListeners() {
    // Cerrar al click fuera
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('popup-overlay')) this.cerrar();
    });
    // Botones cerrar
    document.querySelectorAll('.popup-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = btn.closest('.popup-overlay');
        cerrarCapa(p);
      });
    });
    // ESC
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.cerrar(); });

    // Botón siguiente turno (habilitado tras descartar)
    const btnSig = document.getElementById('btn-siguiente-turno');
    if (btnSig && !btnSig.dataset.bound) {
      btnSig.addEventListener('click', () => {
        if (!estadoJuego.puedePasarTurno) {
          alert('Primero colocá y descartá un dinosaurio.');
          return;
        }
        estadoJuego.puedePasarTurno = false;
        estadoJuego.yaColocoEnTurno = false;
        btnSig.disabled = true;
        JuegoManager.procesarSiguienteTurno();
        JuegoManager.updateBotonTurnoLabel(); // por si venía como "Finalizar ronda"
      });
      btnSig.dataset.bound = '1';
    }
  }
};

/* ==================== UTILIDADES ==================== */
const Utils = {
  setupDragPrevention() {
    document.addEventListener('dragstart', (e) => {
      if (!e.target.classList.contains('dino')) e.preventDefault();
    });
  },
  setupVerMapa() {
    const el = document.querySelector('.ver-mapa');
    if (!el) return;
    el.replaceWith(el.cloneNode(true));
    const nuevo = document.querySelector('.ver-mapa');
    if (!nuevo) return;
    nuevo.style.cursor = 'pointer';
    nuevo.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      MapaOponente.mostrar();
    });
  },
  mostrarPantallaPartida() {
    document.querySelectorAll('.pantalla').forEach(p => p.style.display = 'none');
    const part = document.getElementById('pantalla-partida');
    if (part) part.style.display = 'block';
  },
  debugEstadoJuego() {
    console.log('=== ESTADO ACTUAL DEL JUEGO ===');
    console.log('Ronda:', estadoJuego.rondaActual, 'Turno:', estadoJuego.turnoEnRonda);
    console.log('Jugador actual:', estadoJuego.jugadorActual, 'Restricción:', estadoJuego.restriccionActual);
    console.log('J1:', estadoJuego.jugador1);
    console.log('J2:', estadoJuego.jugador2);
    console.log('Pool restante:', estadoJuego.repartosDisponibles.length);
  }
};

/* ==================== GESTOR PRINCIPAL DEL JUEGO ==================== */
const JuegoManager = {
  /* --- Setup / Inicio --- */
  inicializarPartida(jugadores, jugador2Info, primerJugador) {
    estadoJuego.jugadores = jugadores;
    estadoJuego.primerJugador = primerJugador;
    estadoJuego.jugadorActual = primerJugador;
    estadoJuego.jugador1.nombre = jugadores[0] || 'Jugador 1';
    estadoJuego.jugador2.nombre = jugadores[1] || 'Jugador 2';

    // Exponer info para app.js (avatares)
    if (window.app) window.app.jugador2Info = jugador2Info || { tipo: 'invitado' };

    this.generarPoolDinosaurios();
    this.iniciarRonda();

    console.log('Partida inicializada. Empieza:', jugadores[primerJugador - 1]);
  },

  generarPoolDinosaurios() {
    estadoJuego.repartosDisponibles = [];
    CONFIG.TIPOS_DINOSAURIOS.forEach(tipo => {
      for (let i = 0; i < 8; i++) estadoJuego.repartosDisponibles.push(tipo); // 8 por especie p/2 jugadores
    });
    this.mezclarArray(estadoJuego.repartosDisponibles);
  },

  mezclarArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  },

  iniciarRonda() {
    console.log(`=== INICIANDO RONDA ${estadoJuego.rondaActual} ===`);
    // limpiar visual del tablero (solo imágenes) y mantener estado
    document.querySelectorAll('.dinosaurio-colocado').forEach(el => el.remove());

    this.repartirDinosaurios();
    this.configurarTurnoInicial();
  },

  repartirDinosaurios() {
    estadoJuego.jugador1.dinosauriosDisponibles = this.tomarDinosauriosAleatorios(CONFIG.DINOSAURIOS_POR_RONDA);
    estadoJuego.jugador2.dinosauriosDisponibles = this.tomarDinosauriosAleatorios(CONFIG.DINOSAURIOS_POR_RONDA);
    console.log('Dinosaurios J1:', estadoJuego.jugador1.dinosauriosDisponibles);
    console.log('Dinosaurios J2:', estadoJuego.jugador2.dinosauriosDisponibles);
  },

  tomarDinosauriosAleatorios(cantidad) {
    const dinos = [];
    for (let i = 0; i < cantidad; i++) {
      if (estadoJuego.repartosDisponibles.length > 0) {
        const idx = Math.floor(Math.random() * estadoJuego.repartosDisponibles.length);
        dinos.push(estadoJuego.repartosDisponibles.splice(idx, 1)[0]);
      }
    }
    return dinos;
  },

  configurarTurnoInicial() {
    estadoJuego.turnoEnRonda = 1;
    estadoJuego.puedePasarTurno = false;
    estadoJuego.yaColocoEnTurno = false;
    this.ocultarRestriccion();

    this.mostrarDinosauriosDisponibles();
    this.actualizarInterfazJugador();
    this.renderTableroDelJugadorActual();

    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Siguiente turno';
    }
  },

  /* --- Render del tablero del jugador en turno --- */
  renderTableroDelJugadorActual() {
    // limpiar todo lo visual actual
    document.querySelectorAll('.dinosaurio-colocado').forEach(el => el.remove());

    const j = estadoJuego[`jugador${estadoJuego.jugadorActual}`];
    Object.entries(j.recintos).forEach(([recinto, dinos]) => {
      const area = document.querySelector(`[data-recinto="${recinto}"]`);
      if (!area) return;
      dinos.forEach((tipo, i) => {
        const img = document.createElement('img');
        img.src = CONFIG.IMAGENES_DINOSAURIOS[tipo].colocado;
        img.className = 'dinosaurio-colocado';
        img.alt = tipo;
        GameLogic.posicionarDinosaurio(img, i + 1);
        area.appendChild(img);
      });
    });

    // actualizar pesos del jugador activo
    GameLogic.actualizarPesos();
  },

  /* --- Interfaz / Mano --- */
  mostrarDinosauriosDisponibles() {
    const cont = document.querySelector('.dinosaurios-disponibles');
    if (!cont) return;
    cont.innerHTML = '';

    const jugador = estadoJuego[`jugador${estadoJuego.jugadorActual}`];
    jugador.dinosauriosDisponibles.forEach((tipo, index) => {
      const img = document.createElement('img');
      img.src = CONFIG.IMAGENES_DINOSAURIOS[tipo].disponible;
      img.className = 'dino';
      img.draggable = true;
      img.dataset.tipo = tipo;
      img.dataset.index = index;
      img.alt = tipo;
      cont.appendChild(img);
    });

    DragDropManager.init();
  },

  actualizarInterfazJugador() {
    // Abajo: jugador activo
    const activo = estadoJuego[`jugador${estadoJuego.jugadorActual}`];
    const abajoNombre = document.querySelector('.texto-jugador'); // etiqueta inferior
    if (abajoNombre) abajoNombre.textContent = (activo.nombre || `Jugador ${estadoJuego.jugadorActual}`).toUpperCase();

    // Arriba: oponente con puntos
    const oponenteIdx = estadoJuego.jugadorActual === 1 ? 2 : 1;
    const oponente = estadoJuego[`jugador${oponenteIdx}`];
    const arriba = document.querySelector('.nombre-puntos'); // etiqueta superior
    if (arriba) arriba.textContent = `${(oponente.nombre || `Jugador ${oponenteIdx}`).toUpperCase()} - ${oponente.puntos} PUNTOS`;

    // Actualizar contadores de puntos (totales)
    this.actualizarPuntosInterfaz();
  },

  actualizarPuntosInterfaz() {
    const p1 = document.getElementById('puntos-jugador1');
    const p2 = document.getElementById('puntos-jugador2');
    if (p1) p1.textContent = estadoJuego.jugador1.puntos;
    if (p2) p2.textContent = estadoJuego.jugador2.puntos;
  },/* --- Descarte --- */
  mostrarPopupDescarte() {
    const jugador = estadoJuego[`jugador${estadoJuego.jugadorActual}`];

    // Si no le queda nada para descartar, pasamos de turno
    if (jugador.dinosauriosDisponibles.length === 0) {
      estadoJuego.puedePasarTurno = true;
      const btn = document.getElementById('btn-siguiente-turno');
      if (btn) {
        btn.disabled = false;
        this.updateBotonTurnoLabel();
      }
      return;
    }

    const popup = document.getElementById('popup-descarte');
    const cont = document.getElementById('dinosaurios-descarte');
    if (!popup || !cont) return;

    cont.innerHTML = '';
    this.dinoSeleccionadoDescarte = null;

    jugador.dinosauriosDisponibles.forEach((tipo, index) => {
      const img = document.createElement('img');
      img.src = CONFIG.IMAGENES_DINOSAURIOS[tipo].disponible;
      img.className = 'dino-descarte';
      img.dataset.tipo = tipo;
      img.dataset.index = index;
      img.alt = tipo;
      img.style.width = '64px';
      img.style.height = '64px';
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => this.seleccionarParaDescarte(img, index));
      cont.appendChild(img);
    });

    const btnOk = document.getElementById('btn-confirmar-descarte') || document.getElementById('btn-cancelar-descarte');
    if (btnOk) {
      btnOk.disabled = true;
      btnOk.onclick = () => this.confirmarDescarte();
    }

    abrirCapa(popup);
  },

  seleccionarParaDescarte(el, index) {
    document.querySelectorAll('.dino-descarte').forEach(d => d.classList.remove('seleccionado'));
    el.classList.add('seleccionado');
    this.dinoSeleccionadoDescarte = index;
    const btnOk = document.getElementById('btn-confirmar-descarte') || document.getElementById('btn-cancelar-descarte');
    if (btnOk) btnOk.disabled = false;
  },

  confirmarDescarte() {
    if (this.dinoSeleccionadoDescarte == null) return;

    const jugador = estadoJuego[`jugador${estadoJuego.jugadorActual}`];
    jugador.dinosauriosDisponibles.splice(this.dinoSeleccionadoDescarte, 1);

    const popup = document.getElementById('popup-descarte');
    if (popup) cerrarCapa(popup);
    this.dinoSeleccionadoDescarte = null;

    // Habilitar botón de siguiente turno / o finalizar ronda
    estadoJuego.puedePasarTurno = true;
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      btn.disabled = false;
      this.updateBotonTurnoLabel(); // ↑ actualiza texto: Siguiente turno / Finalizar ronda / Fin del juego
    }

    // Refrescar mano (quedarán 4 tras el primer turno del jugador)
    this.mostrarDinosauriosDisponibles();
  },

  /* --- Botón Siguiente turno: texto dinámico --- */
  updateBotonTurnoLabel() {
    const btn = document.getElementById('btn-siguiente-turno');
    if (!btn) return;
    const finDeRonda = (estadoJuego.jugador1.dinosauriosDisponibles.length === 0 &&
                        estadoJuego.jugador2.dinosauriosDisponibles.length === 0);
    if (finDeRonda) {
      btn.textContent = (estadoJuego.rondaActual === 1) ? 'Finalizar ronda' : 'Fin del juego';
    } else {
      btn.textContent = 'Siguiente turno';
    }
  },

  /* --- Restricciones / UI --- */
  ocultarRestriccion() {
    const info = document.querySelector('.info-restriccion');
    if (info) info.style.visibility = 'hidden';
    estadoJuego.restriccionActual = null;
  },

  mostrarRestriccion(tipo, titulo) {
    const info = document.querySelector('.info-restriccion');
    const icono = document.querySelector('.icono-restriccion-footer');
    const texto = document.querySelector('.texto-restriccion');

    if (info) info.style.visibility = 'visible';
    if (icono) icono.src = `img/dado-${tipo}.png`;
    if (texto) texto.innerHTML = `<div>Restricción</div><div>${titulo}</div>`;

    estadoJuego.restriccionActual = tipo;
  },

  /* --- Turnos / Rondas --- */
  procesarSiguienteTurno() {
    // ¿terminó la ronda? (6 dinos → 3 turnos: colocar 1 y descartar 1 por turno)
    const j1 = estadoJuego.jugador1.dinosauriosDisponibles.length;
    const j2 = estadoJuego.jugador2.dinosauriosDisponibles.length;
    if (j1 === 0 && j2 === 0) {
      this.finalizarRonda();
      return;
    }

    // Cambiar de jugador
    estadoJuego.jugadorActual = (estadoJuego.jugadorActual === 1) ? 2 : 1;
    estadoJuego.turnoEnRonda++;
    estadoJuego.yaColocoEnTurno = false;
    estadoJuego.puedePasarTurno = false;

    // Mostrar animación de dado desde app.js (del turno 2 en adelante)
    if (window.app && typeof window.app.showScreen === 'function') {
      document.getElementById('pantalla-partida')?.setAttribute('style', 'display:none');
      window.app.showScreen('dado-animacion');
      setTimeout(() => window.app.iniciarAnimacionDado(), 400);
    } else {
      // Fallback sin app.js
      this.ocultarRestriccion();
      this.mostrarDinosauriosDisponibles();
      this.actualizarInterfazJugador();
      this.renderTableroDelJugadorActual();
      const btn = document.getElementById('btn-siguiente-turno');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Siguiente turno';
      }
    }
  },

  // Lo llama app.js al cerrar el popup del dado (btn-comenzar-juego)
  procesarResultadoDado(dadoSeleccionado) {
    const conf = {
      1: { tipo: 'lugar-vacio', titulo: 'Lugar vacío' },
      2: { tipo: 'no-t-rex', titulo: 'Sin T-Rex' },
      3: { tipo: 'lado-cafeteria', titulo: 'Lado cafetería' },
      4: { tipo: 'bosque', titulo: 'Bosque' },
      5: { tipo: 'rocas', titulo: 'Rocas' },
      6: { tipo: 'lado-banos', titulo: 'Lado baños' }
    }[dadoSeleccionado || 1];

    if (conf) this.mostrarRestriccion(conf.tipo, conf.titulo);

    // Volver al tablero
    const part = document.getElementById('pantalla-partida');
    if (part) part.style.display = 'block';

    this.mostrarDinosauriosDisponibles();
    this.actualizarInterfazJugador();
    this.renderTableroDelJugadorActual();

    // Deshabilitar "siguiente turno" hasta que coloque+descarte
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Siguiente turno';
    }
  },

  finalizarRonda() {
    console.log(`=== FIN DE RONDA ${estadoJuego.rondaActual} ===`);
    this.calcularPuntosRonda();

    if (estadoJuego.rondaActual === 1) {
      // SIEMPRE mostrar el resumen al finalizar la primera ronda
      this.mostrarResumenRonda();
    } else {
      // En la ronda 2, mostrar la pantalla final
      this.mostrarPantallaFinal();
    }
  },

  calcularPuntosRonda() {
    estadoJuego.jugador1.puntosRonda = GameLogic.calcularPuntos(estadoJuego.jugador1.recintos);
    estadoJuego.jugador2.puntosRonda = GameLogic.calcularPuntos(estadoJuego.jugador2.recintos);

    estadoJuego.jugador1.puntos += estadoJuego.jugador1.puntosRonda;
    estadoJuego.jugador2.puntos += estadoJuego.jugador2.puntosRonda;

    console.log('Puntos ronda J1:', estadoJuego.jugador1.puntosRonda);
    console.log('Puntos ronda J2:', estadoJuego.jugador2.puntosRonda);
    console.log('Puntos totales J1:', estadoJuego.jugador1.puntos);
    console.log('Puntos totales J2:', estadoJuego.jugador2.puntos);
  },

  /* --- Resumen de Ronda --- */
  mostrarResumenRonda() {
    this.configurarResumenRonda();

    // Mostrar la pantalla de resumen usando app.js si está disponible
    if (window.app && typeof window.app.showScreen === 'function') {
      window.app.showScreen('resumen-ronda');
    } else {
      // Fallback manual
      document.querySelectorAll('.pantalla').forEach(p => {
        p.style.display = 'none';
        p.classList.add('hidden');
      });

      const resumen = document.getElementById('pantalla-resumen-ronda');
      if (resumen) {
        resumen.classList.remove('hidden');
        resumen.style.display = 'block';
      }
    }

    // Configurar eventos del botón (por si el DOM se inyecta tarde)
    setTimeout(() => {
      const btnSiguiente = document.getElementById('btn-siguiente-ronda');
      if (btnSiguiente && !btnSiguiente.dataset.bound) {
        btnSiguiente.addEventListener('click', () => this.iniciarSiguienteRonda());
        btnSiguiente.dataset.bound = '1';
      }
    }, 100);
  },

  configurarResumenRonda() {
    const n1 = document.getElementById('nombre-resumen-j1');
    const n2 = document.getElementById('nombre-resumen-j2');
    if (n1) n1.textContent = (estadoJuego.jugador1.nombre || 'JUGADOR 1').toUpperCase();
    if (n2) n2.textContent = (estadoJuego.jugador2.nombre || 'JUGADOR 2').toUpperCase();

    const p1 = document.getElementById('puntos-resumen-j1');
    const p2 = document.getElementById('puntos-resumen-j2');
    if (p1) p1.textContent = `${estadoJuego.jugador1.puntosRonda} puntos`;
    if (p2) p2.textContent = `${estadoJuego.jugador2.puntosRonda} puntos`;

    const a1 = document.getElementById('avatar-resumen-j1');
    const a2 = document.getElementById('avatar-resumen-j2');
    if (a1) a1.src = 'img/foto_usuario-1.png';
    if (a2) {
      const tipoJ2 = window.app?.jugador2Info?.tipo || 'invitado';
      a2.src = (tipoJ2 === 'invitado') ? 'img/invitado.png' : 'img/foto_usuario-2.png';
    }
  },

  iniciarSiguienteRonda() {
    // Setear ronda 2 y cambiar el jugador inicial (empieza el que NO empezó la ronda 1)
    estadoJuego.rondaActual = 2;
    estadoJuego.jugadorActual = (estadoJuego.primerJugador === 1) ? 2 : 1;
    estadoJuego.turnoEnRonda = 1;
    estadoJuego.puedePasarTurno = false;
    estadoJuego.yaColocoEnTurno = false;
    estadoJuego.restriccionActual = null;

    // Transición a la pantalla de partida
    if (window.app && typeof window.app.showScreen === 'function') {
      window.app.showScreen('partida');
    } else {
      // Fallback manual
      const resumen = document.getElementById('pantalla-resumen-ronda');
      const partida = document.getElementById('pantalla-partida');
      if (resumen) {
        resumen.style.display = 'none';
        resumen.classList.add('hidden');
      }
      if (partida) {
        partida.classList.remove('hidden');
        partida.style.display = 'block';
      }
    }

    // Arrancar la ronda 2
    this.iniciarRonda();
  },/* --- Pantalla Final / Ganadores --- */
  mostrarPantallaFinal() {
    this.configurarPantallaFinal();

    if (window.app && typeof window.app.showScreen === 'function') {
      window.app.showScreen('resultados'); // id: pantalla-resultados en app.js
    } else {
      document.querySelectorAll('.pantalla').forEach(p => {
        p.style.display = 'none';
        p.classList.add('hidden');
      });
      const final = document.getElementById('pantalla-resultados');
      if (final) {
        final.classList.remove('hidden');
        final.style.display = 'block';
      }
    }

    // Configurar eventos de los botones finales
    setTimeout(() => {
      const btnRevancha = document.getElementById('btn-revancha');
      const btnNuevaPartida = document.getElementById('btn-nueva-partida');
      const btnVolver = document.getElementById('btn-volver-inicio-final');

      if (btnRevancha && !btnRevancha.dataset.bound) {
        btnRevancha.addEventListener('click', () => {
          this.reiniciarJuegoCompleto();
          if (window.app && typeof window.app.showScreen === 'function') {
            window.app.showScreen('partida');
          }
        });
        btnRevancha.dataset.bound = '1';
      }

      if (btnNuevaPartida && !btnNuevaPartida.dataset.bound) {
        btnNuevaPartida.addEventListener('click', () => {
          if (window.app && typeof window.app.showScreen === 'function') {
            window.app.showScreen('jugadores');
          }
        });
        btnNuevaPartida.dataset.bound = '1';
      }

      if (btnVolver && !btnVolver.dataset.bound) {
        btnVolver.addEventListener('click', () => {
          if (window.app && typeof window.app.showScreen === 'function') {
            window.app.showScreen('lobby');
          }
        });
        btnVolver.dataset.bound = '1';
      }
    }, 100);
  },

  configurarPantallaFinal() {
    const j1 = estadoJuego.jugador1;
    const j2 = estadoJuego.jugador2;
    const ganador = j1.puntos >= j2.puntos ? j1 : j2;
    const perdedor = j1.puntos >= j2.puntos ? j2 : j1;

    // Configurar avatares del podio
    const avatarPrimero = document.getElementById('avatar-primero');
    const avatarSegundo = document.getElementById('avatar-segundo');
    
    if (avatarPrimero) {
      if (ganador === estadoJuego.jugador1) {
        avatarPrimero.src = 'img/foto_usuario-1.png';
      } else {
        const tipoJ2 = window.app?.jugador2Info?.tipo || 'invitado';
        avatarPrimero.src = (tipoJ2 === 'invitado') ? 'img/invitado.png' : 'img/foto_usuario-2.png';
      }
    }
    
    if (avatarSegundo) {
      if (perdedor === estadoJuego.jugador1) {
        avatarSegundo.src = 'img/foto_usuario-1.png';
      } else {
        const tipoJ2 = window.app?.jugador2Info?.tipo || 'invitado';
        avatarSegundo.src = (tipoJ2 === 'invitado') ? 'img/invitado.png' : 'img/foto_usuario-2.png';
      }
    }

    // Configurar resultados detallados
    const nombreJ1 = document.getElementById('nombre-final-j1');
    const nombreJ2 = document.getElementById('nombre-final-j2');
    const avatarJ1 = document.getElementById('avatar-final-j1');
    const avatarJ2 = document.getElementById('avatar-final-j2');
    
    if (nombreJ1) nombreJ1.textContent = (estadoJuego.jugador1.nombre || 'JUGADOR 1').toUpperCase();
    if (nombreJ2) nombreJ2.textContent = (estadoJuego.jugador2.nombre || 'JUGADOR 2').toUpperCase();
    
    if (avatarJ1) avatarJ1.src = 'img/foto_usuario-1.png';
    if (avatarJ2) {
      const tipoJ2 = window.app?.jugador2Info?.tipo || 'invitado';
      avatarJ2.src = (tipoJ2 === 'invitado') ? 'img/invitado.png' : 'img/foto_usuario-2.png';
    }

    const puntosJ1 = document.getElementById('puntos-final-j1');
    const puntosJ2 = document.getElementById('puntos-final-j2');
    if (puntosJ1) puntosJ1.textContent = `${estadoJuego.jugador1.puntos} puntos`;
    if (puntosJ2) puntosJ2.textContent = `${estadoJuego.jugador2.puntos} puntos`;
  },

  /* --- Reset total (revancha) --- */
  reiniciarJuegoCompleto() {
    // Resetear estado del juego
    estadoJuego.rondaActual = 1;
    estadoJuego.turnoEnRonda = 1;
    estadoJuego.jugadorActual = estadoJuego.primerJugador;
    estadoJuego.restriccionActual = null;
    estadoJuego.puedePasarTurno = false;
    estadoJuego.yaColocoEnTurno = false;

    // Resetear puntos
    estadoJuego.jugador1.puntos = 0;
    estadoJuego.jugador1.puntosRonda = 0;
    estadoJuego.jugador2.puntos = 0;
    estadoJuego.jugador2.puntosRonda = 0;

    // Limpiar recintos
    Object.keys(estadoJuego.jugador1.recintos).forEach(recinto => {
      estadoJuego.jugador1.recintos[recinto] = [];
    });
    Object.keys(estadoJuego.jugador2.recintos).forEach(recinto => {
      estadoJuego.jugador2.recintos[recinto] = [];
    });

    // Limpiar visual del tablero
    document.querySelectorAll('.dinosaurio-colocado').forEach(el => el.remove());

    // Regenerar pool y comenzar
    this.generarPoolDinosaurios();
    this.iniciarRonda();

    console.log('Revancha iniciada - Juego reiniciado completamente');
  }
};

/* ==================== INICIALIZACIÓN DEL JUEGO ==================== */
const GameInitializer = {
  init() {
    console.log('Draftosaurus Tablero iniciado');

    DragDropManager.init();
    PopupManager.setupEventListeners();
    Utils.setupDragPrevention();
    Utils.setupVerMapa();
    this.setupEventListeners();   // bind de botones de resumen

    // Hacer accesible globalmente
    window.JuegoManager = JuegoManager;

    // Estado inicial de UI (puntos/pesos)
    GameLogic.actualizarPuntos();
    GameLogic.actualizarPesos();
  },

  setupEventListeners() {
    // Botón de la pantalla de resumen para iniciar ronda 2 (IDs alternativos)
    ['btn-empezar-siguiente-ronda', 'btn-siguiente-ronda'].forEach(id => {
      const b = document.getElementById(id);
      if (b && !b.dataset.bound) {
        b.addEventListener('click', () => JuegoManager.iniciarSiguienteRonda());
        b.dataset.bound = '1';
      }
    });

    // Comando debug
    window.debugGame = () => Utils.debugEstadoJuego();
    console.log('Tip: Usa debugGame() en la consola para ver el estado del juego');
  }
};

/* ==================== FUNCIONES GLOBALES (para HTML onclick) ==================== */
function mostrarReglas() { PopupManager.mostrarReglas(); }
function mostrarPesos() { PopupManager.mostrarPesos(); }
function mostrarMapa() { MapaOponente.mostrar(); }
function cerrarPopup(popupId) { PopupManager.cerrar(popupId); }

/* ==================== INICIALIZACIÓN AUTOMÁTICA ==================== */
document.addEventListener('DOMContentLoaded', () => {
  GameInitializer.init();
});