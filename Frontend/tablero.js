/* ==================== CONFIGURACIÓN CENTRALIZADA ==================== */
const CONFIG = {
  // Dinosaurios
  IMAGENES_DINOSAURIOS: {
    't-rex': { disponible: 'img/dino-t-rex.png', colocado: 'img/dino-t-rex-arriba.png' },
    'triceratops': { disponible: 'img/dino-triceratops.png', colocado: 'img/dino-triceratops-arriba.png' },
    'diplodocus': { disponible: 'img/dino-diplodocus.png', colocado: 'img/dino-diplodocus-arriba.png' },
    'stegosaurus': { disponible: 'img/dino-stegosaurus.png', colocado: 'img/dino-stegosaurus-arriba.png' },
    'parasaurolophus': { disponible: 'img/dino-parasaurolophus.png', colocado: 'img/dino-parasaurolophus-arriba.png' }
  },
  
  // Pesos y masas de dinosaurios
  MASAS_DINOSAURIOS: { 't-rex': 7000, 'triceratops': 7000, 'diplodocus': 15000, 'stegosaurus': 5000, 'parasaurolophus': 2500 }, // kg
  PESOS_DINOSAURIOS: {
    't-rex': 7.0, 
    'triceratops': 7.0, 
    'diplodocus': 15.0,
    'stegosaurus': 5.0, 
    'parasaurolophus': 2.5
  },
  
  GRAVEDAD: 9.8, // m/s²
  TIPOS_DINOSAURIOS: ['t-rex', 'triceratops', 'diplodocus', 'stegosaurus', 'parasaurolophus'],
  DINOSAURIOS_POR_RONDA: 6,
  MAX_DINOSAURIOS_POOL: 8,
  TOTAL_RONDAS: 4,

  // Posiciones
  POSICIONES_DINOSAURIOS: [
    { top: '50%', left: '50%' }, { top: '30%', left: '30%' }, { top: '30%', left: '70%' }, 
    { top: '70%', left: '30%' }, { top: '70%', left: '70%' }, { top: '50%', left: '20%' },
    { top: '20%', left: '50%' }, { top: '80%', left: '50%' }
  ],
  POSICIONES_MINI: [
    { top: '50%', left: '50%' }, { top: '25%', left: '25%' }, { top: '25%', left: '75%' }, 
    { top: '75%', left: '25%' }, { top: '75%', left: '75%' }, { top: '50%', left: '15%' },
    { top: '15%', left: '50%' }, { top: '85%', left: '50%' }
  ],

  // Posiciones específicas para recintos numerados (de izquierda a derecha)
  POSICIONES_NUMERADAS: {
    'bosque-semejanza': [
      { top: '50%', left: '16%' },  // Posición 1 (casilla 2)
      { top: '50%', left: '32%' },  // Posición 2 (casilla 4)
      { top: '50%', left: '48%' },  // Posición 3 (casilla 8)
      { top: '50%', left: '64%' },  // Posición 4 (casilla 12)
      { top: '50%', left: '80%' },  // Posición 5 (casilla 18)
      { top: '50%', left: '96%' }   // Posición 6 (casilla 24)
    ],
    'prado-diferencia': [
      { top: '50%', left: '16%' },  // Posición 1 (casilla 1)
      { top: '50%', left: '32%' },  // Posición 2 (casilla 3)
      { top: '50%', left: '48%' },  // Posición 3 (casilla 6)
      { top: '50%', left: '64%' },  // Posición 4 (casilla 10)
      { top: '50%', left: '80%' },  // Posición 5 (casilla 15)
      { top: '50%', left: '96%' }   // Posición 6 (casilla 21)
    ]
  },

  POSICIONES_NUMERADAS_MINI: {
    'bosque-semejanza': [
      { top: '50%', left: '16%' },  // Posición 1 (casilla 2)
      { top: '50%', left: '32%' },  // Posición 2 (casilla 4)
      { top: '50%', left: '48%' },  // Posición 3 (casilla 8)
      { top: '50%', left: '64%' },  // Posición 4 (casilla 12)
      { top: '50%', left: '80%' },  // Posición 5 (casilla 18)
      { top: '50%', left: '96%' }   // Posición 6 (casilla 24)
    ],
    'prado-diferencia': [
      { top: '50%', left: '16%' },  // Posición 1 (casilla 1)
      { top: '50%', left: '32%' },  // Posición 2 (casilla 3)
      { top: '50%', left: '48%' },  // Posición 3 (casilla 6)
      { top: '50%', left: '64%' },  // Posición 4 (casilla 10)
      { top: '50%', left: '80%' },  // Posición 5 (casilla 15)
      { top: '50%', left: '96%' }   // Posición 6 (casilla 21)
    ]
  },

  // Restricciones del dado - Según el manual oficial del juego
  RESTRICCIONES_DADO: {
    1: { 
      tipo: 'huella-libre', 
      titulo: 'Huella (libre)', 
      imagen: 'dado-huella',
      descripcion: 'Tablero libre, sin restricción',
      recintosBloqueados: [] // No bloquea nada
    },
    2: { 
      tipo: 'no-t-rex', 
      titulo: 'No T-Rex', 
      imagen: 'dado-no-trex',
      descripcion: 'Solo el Rey de la Jungla',
      recintosBloqueados: ['rey-jungla'] // Solo bloquea el Rey de la Jungla
    },
    3: { 
      tipo: 'lado-cafeteria', 
      titulo: 'Lado Cafetería', 
      imagen: 'dado-cafe',
      descripcion: 'Bosque de la Semejanza, Trío Frondoso, Pradera del Amor',
      recintosBloqueados: ['bosque-semejanza', 'woody-trio', 'pradera-amor']
    },
    4: { 
      tipo: 'lado-banos', 
      titulo: 'Lado Baños', 
      imagen: 'dado-banos',
      descripcion: 'Rey de la Jungla, Prado de la Diferencia, Isla Solitaria',
      recintosBloqueados: ['rey-jungla', 'prado-diferencia', 'isla-solitaria']
    },
    5: { 
      tipo: 'bosque', 
      titulo: 'Bosque', 
      imagen: 'dado-bosque',
      descripcion: 'Trío Frondoso, Bosque de la Semejanza, Rey de la Jungla',
      recintosBloqueados: ['woody-trio', 'bosque-semejanza', 'rey-jungla']
    },
    6: { 
      tipo: 'rocas', 
      titulo: 'Rocas / Pradera', 
      imagen: 'dado-rocas',
      descripcion: 'Prado de la Diferencia, Isla Solitaria, Pradera del Amor',
      recintosBloqueados: ['prado-diferencia', 'isla-solitaria', 'pradera-amor']
    }
  },

  // Selectores DOM
  SELECTORS: {
    popupOverlay: '.popup-overlay',
    popupClose: '.popup-close',
    dinosaurioColocado: '.dinosaurio-colocado',
    dino: '.dino',
    dropZones: '.cuadro, .rectangulo',
    dinoDescarte: '.dino-descarte'
  }
};

/* ==================== REGLAS DE RECINTOS ==================== */
const REGLAS_RECINTOS = {
  'bosque-semejanza': {
    validar: (recinto, nuevoDino) => recinto.length === 0 || recinto.every(d => d === nuevoDino),
    maxDinos: 6,
    puntos: [0, 1, 3, 6, 10, 15, 21] // Según cantidad de dinos iguales (sin espacios)
  },
  'pradera-amor': {
    validar: () => true,
    maxDinos: 6,
    puntos: (recinto) => {
      const conteos = {};
      recinto.forEach(d => conteos[d] = (conteos[d] || 0) + 1);
      return Object.values(conteos).reduce((parejas, count) => parejas + Math.floor(count / 2), 0) * 5;
    }
  },
  'woody-trio': { 
    validar: () => true, 
    maxDinos: 3, 
    puntos: cant => cant === 3 ? 7 : 0 
  },
  'prado-diferencia': {
    validar: (recinto, nuevoDino) => !recinto.includes(nuevoDino),
    maxDinos: 6,
    puntos: [0, 1, 3, 6, 10, 15, 21] // Según cantidad de especies distintas (sin espacios)
  },
  'rey-jungla': {
    validar: () => true, 
    maxDinos: 1,
    puntos: (recinto, todosRecintos, jugadorActual, todosJugadores) => {
      if (recinto.length !== 1) return 0;
      const tipo = recinto[0];
      const miTotal = Object.values(todosRecintos).flat().filter(d => d === tipo).length;
      
      if (todosJugadores) {
        for (let oponente of todosJugadores) {
          if (oponente === jugadorActual) continue;
          const totalOponente = Object.values(oponente.recintos).flat().filter(d => d === tipo).length;
          if (totalOponente > miTotal) return 0;
        }
      }
      return 7;
    }
  },
  'isla-solitaria': {
    validar: () => true, 
    maxDinos: 1,
    puntos: (recinto, todosRecintos) => {
      if (recinto.length !== 1) return 0;
      const tipo = recinto[0];
      return Object.values(todosRecintos).flat().filter(d => d === tipo).length === 1 ? 7 : 0;
    }
  },
  'rio': { 
    validar: () => true, 
    maxDinos: 20, 
    puntos: cant => cant // 1 punto por cada dinosaurio
  }
};

/* ==================== UTILIDADES ==================== */
const Utils = {
  mezclarArray: (arr) => {
    const copia = [...arr];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  },

  togglePopup: (popup, show) => {
    if (!popup) return;
    const method = show ? 'remove' : 'add';
    popup.classList[method]('hidden');
    popup.style.display = show ? (popup.classList.contains('popup-overlay') ? 'flex' : 'block') : 'none';
    document.body.style.overflow = show ? 'hidden' : '';
  },

  hayPopupAbierto: () => Array.from(document.querySelectorAll(CONFIG.SELECTORS.popupOverlay))
    .some(p => !p.classList.contains('hidden') && p.style.display !== 'none'),

  limpiarElementos: (selector) => document.querySelectorAll(selector).forEach(el => el.remove()),

  crearElemento: (tag, attrs = {}, styles = {}) => {
    const el = document.createElement(tag);
    
    if (attrs.dataset) {
      Object.assign(el.dataset, attrs.dataset);
      delete attrs.dataset;
    }
    
    Object.assign(el, attrs);
    Object.assign(el.style, styles);
    return el;
  }
};

/* ==================== ESTADO DEL JUEGO ==================== */
class EstadoJuego {
  constructor() { this.reset(); }

  reset() {
    Object.assign(this, {
      jugadorActual: 1, primerJugador: 1, primerJugadorOriginal: 1, rondaActual: 1, turnoEnRonda: 1,
      modoSeguimiento: false, restriccionActual: null, puedePasarTurno: false, yaColocoEnTurno: false,
      dadoNumero: null, repartosDisponibles: [], dinosauriosDescartados: [],
      dinosauriosRondaJ1: [], dinosauriosRondaJ2: [], descartadosJ1: [], descartadosJ2: [],
      turnosCompletadosJ1: 0, turnosCompletadosJ2: 0,
      jugador1: this._crearJugador(), jugador2: this._crearJugador()
    });
  }

  _crearJugador() {
    return {
      nombre: '', dinosauriosDisponibles: [], puntos: 0, puntosRonda: 0,
      recintos: {
        'bosque-semejanza': [], 'pradera-amor': [], 'woody-trio': [], 
        'prado-diferencia': [], 'rey-jungla': [], 'isla-solitaria': [], 'rio': []
      }
    };
  }

  getJugadorActual() { return this[`jugador${this.jugadorActual}`]; }
  getOponente() { return this[`jugador${this.jugadorActual === 1 ? 2 : 1}`]; }
  getTodosJugadores() { return [this.jugador1, this.jugador2]; }

  cambiarTurno() {
    if (this.modoSeguimiento) this[`turnosCompletadosJ${this.jugadorActual}`]++;
    
    this.jugadorActual = this.jugadorActual === 1 ? 2 : 1;
    this.turnoEnRonda++;
    this.yaColocoEnTurno = false;
    this.puedePasarTurno = false;
    
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) btn.disabled = true;
  }

  esFinDeRonda() {
    if (!this.modoSeguimiento) {
      return this.jugador1.dinosauriosDisponibles.length === 0 && 
             this.jugador2.dinosauriosDisponibles.length === 0;
    }
    
    if (this.esPrimerTurnoDeRonda()) return false;
    
    const ambosCompletaronTresTurnos = this.turnosCompletadosJ1 >= 3 && this.turnosCompletadosJ2 >= 3;
    const sinDinosaurios = this.jugador1.dinosauriosDisponibles.length === 0 && 
                          this.jugador2.dinosauriosDisponibles.length === 0;
    
    return sinDinosaurios || ambosCompletaronTresTurnos;
  }

  esPrimerTurnoDeRonda() { return this.turnoEnRonda === 1; }
  esPrimerTurnoAbsoluto() { return this.turnoEnRonda === 1 && this.rondaActual === 1; }
  necesitaRestriccion() { return !this.esPrimerTurnoDeRonda(); }
}

const estadoJuego = new EstadoJuego();

/* ==================== LÓGICA DEL JUEGO ==================== */
const GameLogic = {
  puedeColocarDinosaurio(recinto, tipoDino) {
    if (estadoJuego.yaColocoEnTurno) return false;

    // El río SIEMPRE está disponible (no se bloquea nunca)
    if (recinto === 'rio') return true;

    const jugador = estadoJuego.getJugadorActual();
    const recintoActual = jugador.recintos[recinto];
    const reglas = REGLAS_RECINTOS[recinto];

    if (!reglas || recintoActual.length >= reglas.maxDinos) return false;
    
    // NUEVA LÓGICA: Verificar si el recinto está bloqueado por la restricción actual
    if (estadoJuego.restriccionActual && this.estaRecintoBloqueado(recinto)) return false;

    return reglas.validar(recintoActual, tipoDino);
  },

  estaRecintoBloqueado(recinto) {
    // Si no hay restricción actual, no hay bloqueos
    if (!estadoJuego.restriccionActual) return false;
    
    // Buscar la configuración de la restricción actual
    const restriccionConfig = Object.values(CONFIG.RESTRICCIONES_DADO)
      .find(r => r.tipo === estadoJuego.restriccionActual);
    
    // Si no se encuentra la configuración o no tiene recintos bloqueados, no bloquear
    if (!restriccionConfig || !restriccionConfig.recintosBloqueados) return false;
    
    // Verificar si el recinto está en la lista de bloqueados
    return restriccionConfig.recintosBloqueados.includes(recinto);
  },

  colocarDinosaurio(recinto, tipoDino, area) {
    if (estadoJuego.yaColocoEnTurno) return false;

    const jugador = estadoJuego.getJugadorActual();
    const idx = jugador.dinosauriosDisponibles.indexOf(tipoDino);
    if (idx === -1) return false;

    // Capturar puntos antes de colocar el dinosaurio
    const puntosAntes = jugador.puntosRonda || 0;

    jugador.dinosauriosDisponibles.splice(idx, 1);
    jugador.recintos[recinto].push(tipoDino);

    RenderManager.agregarDinosaurioVisual(tipoDino, recinto, area);
    estadoJuego.yaColocoEnTurno = true;

    this.actualizarPuntos();
    this.actualizarPesos();
    JuegoManager.actualizarInterfaz();
    RenderManager.actualizarDinosauriosDisponibles();
    
    // Capturar puntos después de colocar el dinosaurio y mostrar alerta
    const puntosDesues = jugador.puntosRonda || 0;
    const puntosObtenidos = puntosDesues - puntosAntes;
    
    // Mostrar alerta de puntos obtenidos
    setTimeout(() => {
      JuegoManager.mostrarAlertaPuntos(puntosObtenidos, tipoDino, recinto);
      setTimeout(() => JuegoManager.mostrarPopupDescarte(), 200);
    }, 350);
    
    return true;
  },

  calcularPuntos(recintos, jugadorActual = null, todosJugadores = null) {
    let total = 0;

    Object.entries(recintos).forEach(([nombre, dinosaurios]) => {
      const reglas = REGLAS_RECINTOS[nombre];
      if (!reglas) return;

      let puntos = 0;
      if (typeof reglas.puntos === 'function') {
        if (nombre === 'isla-solitaria') {
          puntos = reglas.puntos(dinosaurios, recintos);
        } else if (nombre === 'pradera-amor') {
          puntos = reglas.puntos(dinosaurios);
              } else if (nombre === 'rey-jungla') {
        puntos = reglas.puntos(dinosaurios, recintos, jugadorActual, todosJugadores);
      } else {
          puntos = reglas.puntos(dinosaurios.length);
        }
      } else if (Array.isArray(reglas.puntos)) {
        puntos = reglas.puntos[dinosaurios.length] || 0;
      }
      total += puntos;
    });

    // Bonus T-Rex: +1 punto por cada recinto que contenga al menos un T-Rex
    total += Object.values(recintos).filter(recinto => recinto.some(d => d === 't-rex')).length;
    return total;
  },

  actualizarPuntos() {
    const todosJugadores = estadoJuego.getTodosJugadores();
    estadoJuego.jugador1.puntosRonda = this.calcularPuntos(estadoJuego.jugador1.recintos, estadoJuego.jugador1, todosJugadores);
    estadoJuego.jugador2.puntosRonda = this.calcularPuntos(estadoJuego.jugador2.recintos, estadoJuego.jugador2, todosJugadores);
  },

  actualizarPesos() {
    const jugador = estadoJuego.getJugadorActual();
    let masaTotal = 0;
    let pesoTotal = 0;

    Object.entries(jugador.recintos).forEach(([recinto, dinosaurios]) => {
      // Calcular masa del recinto (kg)
      const masa = dinosaurios.reduce((sum, dino) => sum + (CONFIG.MASAS_DINOSAURIOS[dino] || 0), 0);
      // Calcular peso usando la primera ley de Newton: P = m × g (N)
      const peso = masa * CONFIG.GRAVEDAD;
      
      masaTotal += masa;
      pesoTotal += peso;
      
      // Actualizar elementos de masa
      const elemMasa = document.getElementById(`masa-${recinto}`);
      if (elemMasa) elemMasa.textContent = masa.toFixed(0);
      
      // Actualizar elementos de peso
      const elemPeso = document.getElementById(`peso-${recinto}`);
      if (elemPeso) elemPeso.textContent = peso.toFixed(0);
    });

    // Actualizar totales
    const elemMasaTotal = document.getElementById('masa-total');
    if (elemMasaTotal) elemMasaTotal.textContent = masaTotal.toFixed(0);
    
    const elemPesoTotal = document.getElementById('peso-total');
    if (elemPesoTotal) elemPesoTotal.textContent = pesoTotal.toFixed(0);
  }
};

/* ==================== RENDERIZADO ==================== */
const RenderManager = {
  renderizarTablero() {
    // INTERFAZ UNIFICADA: Siempre usar la misma lógica de renderizado
    Utils.limpiarElementos(CONFIG.SELECTORS.dinosaurioColocado);
    this._renderizarRecintos(estadoJuego.getJugadorActual().recintos);
    setTimeout(() => DragDropManager.init(), 50);
  },

  _renderizarRecintos(recintos) {
    Object.entries(recintos).forEach(([recinto, dinosaurios]) => {
      const area = document.querySelector(`[data-recinto="${recinto}"]`);
      if (!area) return;

      dinosaurios.forEach((tipo, index) => {
        const img = this.crearDinosaurioVisual(tipo, index + 1, area);
        
        // INTERFAZ UNIFICADA: Configurar arrastre desde la ronda 2 en adelante independientemente del modo
        if (estadoJuego.rondaActual >= 2) {
          // Configurar arrastre SIN sobrescribir los estilos de posición
          img.draggable = true;
          img.classList.add('dino-arrastreable');
          
          // Agregar datos necesarios
          Object.assign(img.dataset, { recinto, tipo, jugador: estadoJuego.jugadorActual });
        }
      });
    });
  },

  crearDinosaurioVisual(tipo, posicion, area) {
    const jugadorActual = estadoJuego.jugadorActual;
    const recinto = area.dataset.recinto;
    
    // Determinar las posiciones según el tipo de recinto
    let pos;
    if (CONFIG.POSICIONES_NUMERADAS[recinto]) {
      // Usar posiciones específicas para recintos numerados (de izquierda a derecha)
      pos = CONFIG.POSICIONES_NUMERADAS[recinto][(posicion - 1) % CONFIG.POSICIONES_NUMERADAS[recinto].length];
    } else {
      // Usar posiciones normales para otros recintos
      pos = CONFIG.POSICIONES_DINOSAURIOS[(posicion - 1) % CONFIG.POSICIONES_DINOSAURIOS.length];
    }
    
    const img = Utils.crearElemento('img', {
      src: CONFIG.IMAGENES_DINOSAURIOS[tipo].colocado,
      className: `dinosaurio-colocado dinosaurio-j${jugadorActual}`,
      alt: tipo,
      dataset: { jugador: jugadorActual.toString(), tipo }
    });

    // Solo aplicar posición - el resto está en CSS
    img.style.top = pos.top;
    img.style.left = pos.left;
    // INTERFAZ UNIFICADA: pointer-events basado solo en la ronda, no en el modo
    img.style.pointerEvents = estadoJuego.rondaActual >= 2 ? 'auto' : 'none';

    area.appendChild(img);
    return img;
  },

  agregarDinosaurioVisual(tipo, recinto, area) {
    const cantidad = estadoJuego.getJugadorActual().recintos[recinto].length;
    this.crearDinosaurioVisual(tipo, cantidad, area);
  },

  actualizarDinosauriosDisponibles() {
    const contenedor = document.querySelector('.dinosaurios-disponibles');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    const jugador = estadoJuego.getJugadorActual();

    jugador.dinosauriosDisponibles.forEach((tipo, index) => {
      const img = Utils.crearElemento('img', {
        src: CONFIG.IMAGENES_DINOSAURIOS[tipo].disponible,
        className: 'dino', draggable: true, alt: tipo,
        dataset: { tipo, index: index.toString() }
      });
      contenedor.appendChild(img);
    });

    DragDropManager.init();
  }
};

/* ==================== DRAG & DROP ==================== */
const DragDropManager = {
  dinosaurioArrastrado: null, 
  esCorreccion: false, 
  recintoOrigen: null,
  touchStartPosition: { x: 0, y: 0 },
  isDragging: false,
  ghostElement: null,

  init() {
    this._initDinosaurios();
    this._initDropZones();
    // INTERFAZ UNIFICADA: Inicializar dinosaurios colocados desde la ronda 2 en adelante independientemente del modo
    if (estadoJuego.rondaActual >= 2) {
      setTimeout(() => this._initDinosauriosColocados(), 100);
    }
  },

  _initDinosaurios() {
    document.querySelectorAll(CONFIG.SELECTORS.dino).forEach(dino => {
      const newDino = dino.cloneNode(true);
      dino.parentNode.replaceChild(newDino, dino);
      
      // Eventos de arrastre clásico
      newDino.addEventListener('dragstart', this._handleDragStart.bind(this));
      newDino.addEventListener('dragend', this._handleDragEnd.bind(this));
      
      // Eventos táctiles para móvil
      newDino.addEventListener('touchstart', this._handleTouchStart.bind(this), { passive: false });
      newDino.addEventListener('touchmove', this._handleTouchMove.bind(this), { passive: false });
      newDino.addEventListener('touchend', this._handleTouchEnd.bind(this), { passive: false });
    });
  },

  _initDropZones() {
    const eventHandlers = {
      dragover: this._handleDragover,
      drop: this._handleDrop,
      dragenter: this._handleDragenter,
      dragleave: this._handleDragleave
    };

    document.querySelectorAll(CONFIG.SELECTORS.dropZones).forEach(zone => {
      const newZone = zone.cloneNode(true);
      zone.parentNode.replaceChild(newZone, zone);
      
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        newZone.addEventListener(event, handler.bind(this));
      });
    });
  },

  _initDinosauriosColocados() {
    document.querySelectorAll(CONFIG.SELECTORS.dinosaurioColocado).forEach(dino => {
      // INTERFAZ UNIFICADA: Funcionalidad desde ronda 2 en adelante disponible independientemente del modo
      if (estadoJuego.rondaActual >= 2) {
        const jugadorDelDino = parseInt(dino.dataset.jugador);
        if (jugadorDelDino === estadoJuego.jugadorActual) {
          Object.assign(dino, { draggable: true });
          dino.classList.add('dino-arrastreable');
          
          if (!dino.dataset.tipo && dino.alt) dino.dataset.tipo = dino.alt;
          
          const area = dino.closest('[data-recinto]');
          if (area?.dataset.recinto) dino.dataset.recinto = area.dataset.recinto;
          
          dino.addEventListener('dragstart', this._handleDragStartCorreccion.bind(this));
          dino.addEventListener('dragend', this._handleDragEnd.bind(this));
          
          // Eventos táctiles para móvil
          dino.addEventListener('touchstart', this._handleTouchStartCorreccion.bind(this), { passive: false });
          dino.addEventListener('touchmove', this._handleTouchMove.bind(this), { passive: false });
          dino.addEventListener('touchend', this._handleTouchEnd.bind(this), { passive: false });
        }
      }
    });
  },

  _handleDragStartCorreccion(e) {
    this.dinosaurioArrastrado = e.target;
    this.esCorreccion = true;
    this.recintoOrigen = e.target.dataset.recinto;
    
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('tipo', e.target.dataset.tipo);
    e.dataTransfer.setData('recinto-origen', this.recintoOrigen);
    e.dataTransfer.setData('correccion', 'true');
  },

  _handleDragStart(e) {
    if (Utils.hayPopupAbierto() || estadoJuego.yaColocoEnTurno) {
      e.preventDefault();
      return;
    }

    this.dinosaurioArrastrado = e.target;
    this.esCorreccion = false;
    this.recintoOrigen = null;

    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.tipo);
  },

  _handleDragEnd(e) {
    e.target.classList.remove('dragging');
    this._limpiarIndicadores();
    Object.assign(this, { dinosaurioArrastrado: null, esCorreccion: false, recintoOrigen: null });
  },

  _handleDragover(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  },

  _handleDragenter(e) {
    e.preventDefault();
    const zona = e.currentTarget;
    const recinto = zona.dataset.recinto;

    if (!recinto || !this.dinosaurioArrastrado) return;

    const tipoDino = this.dinosaurioArrastrado.dataset.tipo;
    let puedeColocar = false;
    let claseEstilo = 'drop-zone-invalid';
    
    if (this.esCorreccion) {
      puedeColocar = true;
      claseEstilo = 'drop-zone-active';
    } else {
      // Verificar si está bloqueado por restricción
      const estaBloqueado = GameLogic.estaRecintoBloqueado(recinto);
      if (estaBloqueado) {
        claseEstilo = 'drop-zone-blocked'; // Nueva clase para recintos bloqueados
      } else {
        puedeColocar = GameLogic.puedeColocarDinosaurio(recinto, tipoDino);
        claseEstilo = puedeColocar ? 'drop-zone-active' : 'drop-zone-invalid';
      }
    }

    zona.classList.add(claseEstilo);
  },

  _handleDragleave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drop-zone-active', 'drop-zone-invalid', 'drop-zone-blocked');
    }
  },

  _handleDrop(e) {
    e.preventDefault();
    const area = e.currentTarget;
    const recinto = area.dataset.recinto;
    
    // Obtener tipo de dinosaurio: desde dataTransfer (drag normal) o desde elemento arrastrado (touch)
    let tipoDino;
    if (e.dataTransfer && e.dataTransfer.getData) {
      tipoDino = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('tipo');
    } else if (this.dinosaurioArrastrado) {
      tipoDino = this.dinosaurioArrastrado.dataset.tipo;
    }

    if (!recinto || !tipoDino) {
      this._limpiarIndicadores();
      // Limpiar estado de touch si aplica
      if (this.isDragging) {
        this._cleanupTouch();
      }
      return;
    }

    if (this.esCorreccion) {
      this._manejarCorreccion(recinto, tipoDino, area);
    } else if (GameLogic.puedeColocarDinosaurio(recinto, tipoDino)) {
      GameLogic.colocarDinosaurio(recinto, tipoDino, area);
    }

    this._limpiarIndicadores();
    
    // Limpiar estado de touch si aplica
    if (this.isDragging) {
      this._cleanupTouch();
    }
  },

  _manejarCorreccion(recintoDestino, tipoDino, area) {
    if (!this.recintoOrigen || this.recintoOrigen === recintoDestino) return;

    const jugador = estadoJuego.getJugadorActual();
    const reglas = REGLAS_RECINTOS[recintoDestino];
    
    if (reglas?.maxDinos && jugador.recintos[recintoDestino].length >= reglas.maxDinos) return;
    
    const idxOrigen = jugador.recintos[this.recintoOrigen].indexOf(tipoDino);
    if (idxOrigen !== -1) {
      jugador.recintos[this.recintoOrigen].splice(idxOrigen, 1);
      jugador.recintos[recintoDestino].push(tipoDino);

      RenderManager.renderizarTablero();
      GameLogic.actualizarPuntos();
      GameLogic.actualizarPesos();
    }
  },

  _limpiarIndicadores() {
    document.querySelectorAll('.drop-zone-active, .drop-zone-invalid, .drop-zone-blocked')
      .forEach(el => el.classList.remove('drop-zone-active', 'drop-zone-invalid', 'drop-zone-blocked'));
  },

  // ==================== EVENTOS TÁCTILES ==================== 
  _handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.touchStartPosition = { x: touch.clientX, y: touch.clientY };
    this.dinosaurioArrastrado = e.target;
    this.isDragging = false;
    this.esCorreccion = false;
  },

  _handleTouchStartCorreccion(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.touchStartPosition = { x: touch.clientX, y: touch.clientY };
    this.dinosaurioArrastrado = e.target;
    this.isDragging = false;
    this.esCorreccion = true;
    this.recintoOrigen = e.target.dataset.recinto;
  },

  _handleTouchMove(e) {
    e.preventDefault();
    if (!this.dinosaurioArrastrado) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - this.touchStartPosition.x);
    const deltaY = Math.abs(touch.clientY - this.touchStartPosition.y);
    
    // Comenzar arrastre si se movió suficiente
    if (!this.isDragging && (deltaX > 10 || deltaY > 10)) {
      this.isDragging = true;
      this._createGhostElement(this.dinosaurioArrastrado);
      this.dinosaurioArrastrado.classList.add('dragging');
    }

    if (this.isDragging && this.ghostElement) {
      // Mover el elemento fantasma
      this.ghostElement.style.left = `${touch.clientX - 30}px`;
      this.ghostElement.style.top = `${touch.clientY - 30}px`;
      
      // Encontrar elemento debajo del dedo
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropZone = elementBelow?.closest('.cuadro, .rectangulo');
      
      // Actualizar indicadores visuales
      this._updateDropZoneIndicators(dropZone);
    }
  },

  _handleTouchEnd(e) {
    e.preventDefault();
    if (!this.dinosaurioArrastrado || !this.isDragging) {
      this._cleanupTouch();
      return;
    }

    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('.cuadro, .rectangulo');

    if (dropZone) {
      // Simular evento drop
      const fakeEvent = {
        preventDefault: () => {},
        currentTarget: dropZone,
        target: dropZone
      };
      this._handleDrop(fakeEvent);
    }

    this._cleanupTouch();
  },

  _createGhostElement(dino) {
    this.ghostElement = dino.cloneNode(true);
    this.ghostElement.style.position = 'fixed';
    this.ghostElement.style.zIndex = '10000';
    this.ghostElement.style.pointerEvents = 'none';
    this.ghostElement.style.opacity = '0.8';
    this.ghostElement.style.transform = 'scale(1.1)';
    this.ghostElement.style.width = '60px';
    this.ghostElement.style.height = '60px';
    document.body.appendChild(this.ghostElement);
  },

  _updateDropZoneIndicators(dropZone) {
    // Limpiar indicadores anteriores
    this._limpiarIndicadores();
    
    if (!dropZone) return;

    const recinto = dropZone.dataset.recinto;
    if (!recinto) return;

    const tipoDino = this.dinosaurioArrastrado.dataset.tipo;
    let puedeColocar = false;
    let claseEstilo = 'drop-zone-invalid';
    
    if (this.esCorreccion) {
      puedeColocar = true;
      claseEstilo = 'drop-zone-active';
    } else {
      const estaBloqueado = GameLogic.estaRecintoBloqueado(recinto);
      if (estaBloqueado) {
        claseEstilo = 'drop-zone-blocked';
      } else {
        puedeColocar = GameLogic.puedeColocarDinosaurio(recinto, tipoDino);
        claseEstilo = puedeColocar ? 'drop-zone-active' : 'drop-zone-invalid';
      }
    }

    dropZone.classList.add(claseEstilo);
  },

  _cleanupTouch() {
    if (this.ghostElement) {
      this.ghostElement.remove();
      this.ghostElement = null;
    }
    
    if (this.dinosaurioArrastrado) {
      this.dinosaurioArrastrado.classList.remove('dragging');
    }
    
    this._limpiarIndicadores();
    this.dinosaurioArrastrado = null;
    this.isDragging = false;
    this.esCorreccion = false;
    this.recintoOrigen = null;
  }
};

/* ==================== SISTEMA DE POPUPS ==================== */
const PopupManager = {
  mostrarReglas: () => Utils.togglePopup(document.getElementById('popup-reglas'), true),
  mostrarPesos: () => { GameLogic.actualizarPesos(); Utils.togglePopup(document.getElementById('popup-pesos'), true); },

  cerrar(popupId) {
    const puedeSerCerrado = (popup) => {
      return !(popup.id === 'popup-descarte' && !estadoJuego.puedePasarTurno) &&
             popup.id !== 'popup-seleccion-dinosaurios' &&
             popup.id !== 'popup-seleccion-dado';
    };

    if (popupId) {
      const popup = document.getElementById(popupId);
      if (popup && puedeSerCerrado(popup)) Utils.togglePopup(popup, false);
    } else {
      document.querySelectorAll(CONFIG.SELECTORS.popupOverlay).forEach(popup => {
        if (puedeSerCerrado(popup)) Utils.togglePopup(popup, false);
      });
    }
  },

  setupEventListeners() {
    // Cerrar al hacer clic en el overlay
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('popup-overlay')) {
        const popup = e.target;
        if (popup.id === 'popup-descarte' && !estadoJuego.puedePasarTurno) return;
        if (popup.id === 'popup-seleccion-dinosaurios') return;
        if (popup.id === 'popup-seleccion-dado') return;
        Utils.togglePopup(popup, false);
      }
    });

    // Cerrar al hacer clic en botones de cierre
    document.querySelectorAll(CONFIG.SELECTORS.popupClose).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const popup = btn.closest('.popup-overlay');
        if (popup?.id === 'popup-descarte' && !estadoJuego.puedePasarTurno && estadoJuego.yaColocoEnTurno) return;
        if (popup?.id === 'popup-seleccion-dinosaurios') return;
        if (popup?.id === 'popup-seleccion-dado') return;
        Utils.togglePopup(popup, false);
      });
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.popup-overlay:not(.hidden)').forEach(popup => {
          if (popup.style.display !== 'none') {
            if (popup.id === 'popup-descarte' && !estadoJuego.puedePasarTurno) return;
            if (popup.id === 'popup-seleccion-dinosaurios') return;
            if (popup.id === 'popup-seleccion-dado') return;
            Utils.togglePopup(popup, false);
          }
        });
      }
    });
  }
};

/* ==================== SISTEMA DE MAPAS ==================== */
const MapaOponente = {
  mostrar() {
    const oponente = estadoJuego.getOponente();
    this._actualizarTitulo(oponente.nombre);
    this._renderizarMiniTablero(oponente.recintos);
    this._mostrarPuntuacion(oponente.recintos);
    Utils.togglePopup(document.getElementById('popup-mapa'), true);
  },

  _actualizarTitulo(nombre) {
    const titulo = document.getElementById('titulo-mapa');
    if (titulo) {
      titulo.textContent = `MAPA DE ${(nombre || 'OPONENTE').toUpperCase()}`;
    }
  },

  _renderizarMiniTablero(recintos) {
    document.querySelectorAll('.mini-dinosaurios').forEach(cont => cont.innerHTML = '');

    Object.entries(recintos).forEach(([recinto, dinosaurios]) => {
      const contenedor = document.getElementById(`mapa-${recinto}`);
      if (!contenedor || dinosaurios.length === 0) return;

      dinosaurios.forEach((tipo, index) => {
        const img = this._crearMiniDinosaurio(tipo, index + 1, recinto);
        contenedor.appendChild(img);
      });
    });
  },

  _crearMiniDinosaurio(tipo, posicion, recinto) {
    // Determinar las posiciones según el tipo de recinto para el mini mapa
    let pos;
    if (CONFIG.POSICIONES_NUMERADAS_MINI[recinto]) {
      // Usar posiciones específicas para recintos numerados (de izquierda a derecha)
      pos = CONFIG.POSICIONES_NUMERADAS_MINI[recinto][(posicion - 1) % CONFIG.POSICIONES_NUMERADAS_MINI[recinto].length];
    } else {
      // Usar posiciones normales para otros recintos
      pos = CONFIG.POSICIONES_MINI[(posicion - 1) % CONFIG.POSICIONES_MINI.length];
    }
    
    return Utils.crearElemento('img', {
      src: CONFIG.IMAGENES_DINOSAURIOS[tipo].colocado,
      className: 'mini-dinosaurio', alt: tipo
    }, {
      position: 'absolute', top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)',
      zIndex: '15', pointerEvents: 'none'
    });
  },

  _mostrarPuntuacion(recintos) {
    const detalles = {};
    let total = 0;
    const oponente = estadoJuego.getOponente();
    const todosJugadores = estadoJuego.getTodosJugadores();

    Object.entries(recintos).forEach(([nombre, dinosaurios]) => {
      const reglas = REGLAS_RECINTOS[nombre];
      if (!reglas) return;

      let puntos = 0;
      if (typeof reglas.puntos === 'function') {
        if (nombre === 'isla-solitaria') puntos = reglas.puntos(dinosaurios, recintos);
        else if (nombre === 'rey-jungla') puntos = reglas.puntos(dinosaurios, recintos, oponente, todosJugadores);
        else if (nombre === 'pradera-amor') puntos = reglas.puntos(dinosaurios);
        else puntos = reglas.puntos(dinosaurios.length);
      } else if (Array.isArray(reglas.puntos)) {
        puntos = reglas.puntos[dinosaurios.length] || 0;
      }

      detalles[nombre] = puntos;
      total += puntos;
    });

    // Bonus T-Rex
    total += Object.values(recintos).filter(recinto => recinto.some(d => d === 't-rex')).length;

    Object.entries(detalles).forEach(([recinto, puntos]) => {
      const elem = document.getElementById(`puntos-${recinto}`);
      if (elem) elem.textContent = `${puntos} pts`;
    });

    const totalElem = document.getElementById('puntos-total-oponente');
    if (totalElem) {
      totalElem.innerHTML = `<strong>${total} PUNTOS</strong>`;
    }
  }
};

/* ==================== MODO SEGUIMIENTO ==================== */
const ModoSeguimiento = {
  MAX_DINOSAURIOS: 6, dinosauriosSeleccionados: [], eventListeners: new Map(),

  mostrarPopupSeleccionDinosaurios() {
    const jugadorNum = estadoJuego.jugadorActual;
    const yaSeleccionoEnRonda = (jugadorNum === 1 && estadoJuego.dinosauriosRondaJ1.length > 0) ||
                               (jugadorNum === 2 && estadoJuego.dinosauriosRondaJ2.length > 0);

    if (yaSeleccionoEnRonda) {
      this._restaurarDinosauriosGuardados();
      return;
    }

    this._resetearContadores();
    const popup = document.getElementById('popup-seleccion-dinosaurios');
    if (!popup) return;

    const titulo = popup.querySelector('h2');
    if (titulo) {
      const nombre = estadoJuego.getJugadorActual().nombre || `Jugador ${estadoJuego.jugadorActual}`;
      titulo.textContent = `${nombre.toUpperCase()} - Seleccionar dinosaurios para RONDA ${estadoJuego.rondaActual}`;
    }

    this._configurarSeleccionDinosaurios();
    Utils.togglePopup(popup, true);
  },

  _restaurarDinosauriosGuardados() {
    const jugador = estadoJuego.getJugadorActual();
    const jugadorNum = estadoJuego.jugadorActual;
    
    const dinosauriosRonda = jugadorNum === 1 ? estadoJuego.dinosauriosRondaJ1 : estadoJuego.dinosauriosRondaJ2;
    const descartados = jugadorNum === 1 ? estadoJuego.descartadosJ1 : estadoJuego.descartadosJ2;
    
    jugador.dinosauriosDisponibles = [...dinosauriosRonda];
    
    // Eliminar descartados y colocados
    [...descartados, ...Object.values(jugador.recintos).flat()].forEach(dino => {
      const idx = jugador.dinosauriosDisponibles.indexOf(dino);
      if (idx !== -1) jugador.dinosauriosDisponibles.splice(idx, 1);
    });

    RenderManager.actualizarDinosauriosDisponibles();
    JuegoManager.actualizarInterfaz();
    
    setTimeout(() => {
      RenderManager.renderizarTablero();
      DragDropManager.init();
    }, 100);

    if (estadoJuego.necesitaRestriccion()) {
      setTimeout(() => this._mostrarPopupSeleccionDado(), 200);
    } else {
      JuegoManager.establecerSinRestriccion();
      window.app?.showScreen?.('partida');
    }
  },

  _configurarSeleccionDinosaurios() {
    const popup = document.getElementById('popup-seleccion-dinosaurios');
    if (!popup) return;

    this.eventListeners.forEach((listener, element) => {
      element.removeEventListener('click', listener);
    });
    this.eventListeners.clear();

    popup.querySelectorAll('.dino-selector').forEach(selector => {
      const contador = selector.querySelector('.contador-valor');
      const btnDecrease = selector.querySelector('[data-action="decrease"]');
      const btnIncrease = selector.querySelector('[data-action="increase"]');

      if (btnDecrease && contador) {
        const decreaseHandler = () => {
          const valor = parseInt(contador.textContent) || 0;
          if (valor > 0) {
            contador.textContent = valor - 1;
            this._actualizarTotalSeleccion();
          }
        };
        btnDecrease.addEventListener('click', decreaseHandler);
        this.eventListeners.set(btnDecrease, decreaseHandler);
      }

      if (btnIncrease && contador) {
        const increaseHandler = () => {
          const valorActual = parseInt(contador.textContent) || 0;
          const totalActual = this._calcularTotalSeleccionado();

          if (totalActual < this.MAX_DINOSAURIOS) {
            contador.textContent = valorActual + 1;
            this._actualizarTotalSeleccion();
          } else {
            window.app?.showToast?.(`Máximo ${this.MAX_DINOSAURIOS} dinosaurios`, 'warning');
          }
        };
        btnIncrease.addEventListener('click', increaseHandler);
        this.eventListeners.set(btnIncrease, increaseHandler);
      }
    });

    const btnConfirmar = document.getElementById('btn-confirmar-seleccion');
    if (btnConfirmar) btnConfirmar.onclick = () => this._confirmarSeleccionDinosaurios();
  },

  _calcularTotalSeleccionado() {
    return Array.from(document.querySelectorAll('.contador-valor'))
      .reduce((total, contador) => total + (parseInt(contador.textContent) || 0), 0);
  },

  _actualizarTotalSeleccion() {
    const total = this._calcularTotalSeleccionado();
    const totalElement = document.getElementById('total-dinosaurios');

    if (totalElement) {
      totalElement.textContent = total;
      totalElement.classList.toggle('total-correcto', total === this.MAX_DINOSAURIOS);
    }

    const btnConfirmar = document.getElementById('btn-confirmar-seleccion');
    if (btnConfirmar) {
      btnConfirmar.disabled = (total !== this.MAX_DINOSAURIOS);
      btnConfirmar.textContent = total < this.MAX_DINOSAURIOS ?
        `Selecciona ${this.MAX_DINOSAURIOS - total} más` : 'Confirmar selección';
    }
  },

  _confirmarSeleccionDinosaurios() {
    const dinosaurios = [];

    document.querySelectorAll('.dino-selector').forEach(selector => {
      const tipo = selector.dataset.tipo;
      const cantidad = parseInt(selector.querySelector('.contador-valor').textContent) || 0;
      for (let i = 0; i < cantidad; i++) dinosaurios.push(tipo);
    });

    if (dinosaurios.length !== this.MAX_DINOSAURIOS) {
      window.app?.showToast?.(`Debes seleccionar exactamente ${this.MAX_DINOSAURIOS} dinosaurios`, 'error');
      return;
    }

    const jugadorNum = estadoJuego.jugadorActual;
    if (jugadorNum === 1) {
      estadoJuego.dinosauriosRondaJ1 = [...dinosaurios];
      if (estadoJuego.turnosCompletadosJ1 === 0) estadoJuego.descartadosJ1 = [];
    } else {
      estadoJuego.dinosauriosRondaJ2 = [...dinosaurios];
      if (estadoJuego.turnosCompletadosJ2 === 0) estadoJuego.descartadosJ2 = [];
    }

    estadoJuego.getJugadorActual().dinosauriosDisponibles = [...dinosaurios];
    Utils.togglePopup(document.getElementById('popup-seleccion-dinosaurios'), false);
    this._resetearContadores();

    RenderManager.actualizarDinosauriosDisponibles();
    JuegoManager.actualizarInterfaz();

    if (estadoJuego.necesitaRestriccion()) {
      setTimeout(() => this._mostrarPopupSeleccionDado(), 100);
    } else {
      estadoJuego.yaColocoEnTurno = false;
      estadoJuego.puedePasarTurno = false;
      estadoJuego.dadoNumero = null;
      
      JuegoManager.establecerSinRestriccion();
      window.app?.showScreen?.('partida');

      RenderManager.actualizarDinosauriosDisponibles();
      JuegoManager.actualizarInterfaz();
      JuegoManager.actualizarBotonSiguiente();
      RenderManager.renderizarTablero();
      
      setTimeout(() => DragDropManager.init(), 100);
    }
  },

  _resetearContadores() {
    document.querySelectorAll('.contador-valor').forEach(contador => contador.textContent = '0');

    const totalElement = document.getElementById('total-dinosaurios');
    if (totalElement) {
      totalElement.textContent = '0';
      totalElement.classList.remove('total-correcto');
    }

    const btnConfirmar = document.getElementById('btn-confirmar-seleccion');
    if (btnConfirmar) {
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = `Selecciona ${this.MAX_DINOSAURIOS} dinosaurios`;
    }
  },

  _mostrarPopupSeleccionDado() {
    document.querySelectorAll('.cara-dado-opcion').forEach(cara => {
      cara.classList.remove('seleccionada');
      cara.onclick = () => this._seleccionarCaraDado(cara);
    });

    const popup = document.getElementById('popup-seleccion-dado');
    popup.classList.add('obligatorio');
    Utils.togglePopup(popup, true);
  },

  _seleccionarCaraDado(cara) {
    document.querySelectorAll('.cara-dado-opcion').forEach(c => c.classList.remove('seleccionada'));
    cara.classList.add('seleccionada');

    const caraSeleccionada = parseInt(cara.dataset.cara);
    estadoJuego.dadoNumero = caraSeleccionada;

    setTimeout(() => {
      this._procesarDadoSeleccionado(caraSeleccionada);
      const popup = document.getElementById('popup-seleccion-dado');
      popup.classList.remove('obligatorio');
      Utils.togglePopup(popup, false);
    }, 300);
  },

  _procesarDadoSeleccionado(numeroDado) {
    const restriccion = CONFIG.RESTRICCIONES_DADO[numeroDado];
    if (restriccion) JuegoManager.establecerRestriccion(restriccion.tipo, restriccion.titulo);

    estadoJuego.yaColocoEnTurno = false;
    estadoJuego.puedePasarTurno = false;
    
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) btn.disabled = true;

    window.app?.showScreen?.('partida');
    RenderManager.actualizarDinosauriosDisponibles();
    JuegoManager.actualizarInterfaz();
    RenderManager.renderizarTablero();
    
    setTimeout(() => DragDropManager.init(), 100);
  }
};

/* ==================== GESTOR PRINCIPAL ==================== */
const JuegoManager = {
  dinoSeleccionadoDescarte: null, tipoSeleccionadoDescarte: null,

  inicializarPartida(jugadores, jugador2Info, primerJugador, modoSeguimiento = false) {
    estadoJuego.reset();

    Object.assign(estadoJuego, {
      modoSeguimiento,
      primerJugador, primerJugadorOriginal: primerJugador, jugadorActual: primerJugador,
      turnosCompletadosJ1: 0, turnosCompletadosJ2: 0, descartadosJ1: [], descartadosJ2: []
    });

    estadoJuego.jugador1.nombre = jugadores[0] || 'Jugador 1';
    estadoJuego.jugador2.nombre = jugadores[1] || 'Jugador 2';

    if (window.app) window.app.jugador2Info = jugador2Info || { tipo: 'invitado' };

    if (modoSeguimiento) {
      estadoJuego.turnoEnRonda = 1;
      estadoJuego.rondaActual = 1;
    } else {
      this._generarPoolDinosaurios();
      this._iniciarRonda();
      setTimeout(() => window.app?.showScreen?.('partida'), 100);
    }
  },

  _generarPoolDinosaurios() {
    estadoJuego.repartosDisponibles = Utils.mezclarArray(
      CONFIG.TIPOS_DINOSAURIOS.flatMap(tipo => Array(CONFIG.MAX_DINOSAURIOS_POOL).fill(tipo))
    );
  },

  _iniciarRonda() {
    if (!estadoJuego.modoSeguimiento) this._repartirDinosaurios();
    this._configurarTurnoInicial();
  },

  limpiarTablero() {
    Utils.limpiarElementos(CONFIG.SELECTORS.dinosaurioColocado);

    [estadoJuego.jugador1, estadoJuego.jugador2].forEach(jugador => {
      Object.keys(jugador.recintos).forEach(recinto => jugador.recintos[recinto] = []);
      jugador.puntosRonda = 0;
    });

    RenderManager.renderizarTablero();
    GameLogic.actualizarPuntos();
    GameLogic.actualizarPesos();
    this.actualizarInterfaz();
  },

  _repartirDinosaurios() {
    // Verificar si hay suficientes dinosaurios en el pool
    const dinosauriosNecesarios = CONFIG.DINOSAURIOS_POR_RONDA * 2; // 6 por cada jugador
    if (estadoJuego.repartosDisponibles.length < dinosauriosNecesarios) {
      console.log('Regenerando pool de dinosaurios - Pool insuficiente');
      this._generarPoolDinosaurios();
    }

    const tomarDinos = (cantidad) => {
      const dinos = [];
      for (let i = 0; i < cantidad && estadoJuego.repartosDisponibles.length > 0; i++) {
        const idx = Math.floor(Math.random() * estadoJuego.repartosDisponibles.length);
        dinos.push(estadoJuego.repartosDisponibles.splice(idx, 1)[0]);
      }
      return dinos;
    };

    estadoJuego.jugador1.dinosauriosDisponibles = tomarDinos(CONFIG.DINOSAURIOS_POR_RONDA);
    estadoJuego.jugador2.dinosauriosDisponibles = tomarDinos(CONFIG.DINOSAURIOS_POR_RONDA);
    
    console.log(`Ronda ${estadoJuego.rondaActual}: Dinosaurios repartidos`);
    console.log('J1:', estadoJuego.jugador1.dinosauriosDisponibles);
    console.log('J2:', estadoJuego.jugador2.dinosauriosDisponibles);
    console.log('Pool restante:', estadoJuego.repartosDisponibles.length);
  },

  _configurarTurnoInicial() {
    Object.assign(estadoJuego, { puedePasarTurno: false, yaColocoEnTurno: false });
    
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) btn.disabled = true;

    if (estadoJuego.esPrimerTurnoDeRonda()) {
      this.establecerSinRestriccion();
    } else {
      this._ocultarRestriccion();
    }

    RenderManager.actualizarDinosauriosDisponibles();
    this.actualizarInterfaz();
    RenderManager.renderizarTablero();
    this.actualizarBotonSiguiente();
  },

  procesarSiguienteTurno() {
    const jugadorActual = estadoJuego.getJugadorActual();
    const tienenDinosaurios = jugadorActual.dinosauriosDisponibles.length > 0;
    
    if (tienenDinosaurios) {
      if (!estadoJuego.yaColocoEnTurno) {
        window.app?.showToast?.('Debes colocar un dinosaurio primero', 'warning');
        return;
      }
      
      if (!estadoJuego.puedePasarTurno) {
        window.app?.showToast?.('Debes descartar un dinosaurio primero', 'warning');
        return;
      }
    }

    if (estadoJuego.esFinDeRonda()) {
      this._finalizarRonda();
      return;
    }

    estadoJuego.cambiarTurno();

    if (estadoJuego.modoSeguimiento) {
      this._procesarTurnoSeguimiento();
    } else {
      this._procesarTurnoNormal();
    }
  },

  _procesarTurnoSeguimiento() {
    // Limpiar indicadores de turno antes de mostrar pantalla de selección
    this.limpiarIndicadoresTurno();
    
    const jugador = estadoJuego.getJugadorActual();
    const avatarSrc = estadoJuego.jugadorActual === 1 ?
      'img/foto_usuario-1.png' :
      (window.app?.jugador2Info?.tipo === 'invitado' ? 'img/invitado.png' : 'img/foto_usuario-2.png');

    window.app?.mostrarTurnoJugadorConSeleccion?.(jugador.nombre, avatarSrc);
  },

  _procesarTurnoNormal() {
    if (window.app?.showScreen) {
      // Limpiar indicadores de turno antes de cambiar de pantalla
      this.limpiarIndicadoresTurno();
      document.getElementById('pantalla-partida')?.setAttribute('style', 'display:none');
      window.app.showScreen('dado-animacion');
      setTimeout(() => window.app.iniciarAnimacionDado(), 400);
    } else {
      this._ocultarRestriccion();
      RenderManager.actualizarDinosauriosDisponibles();
      this.actualizarInterfaz();
      RenderManager.renderizarTablero();
    }
  },

  procesarResultadoDado(numeroDado) {
    estadoJuego.dadoNumero = numeroDado;
    const restriccion = CONFIG.RESTRICCIONES_DADO[numeroDado || 1];
    if (restriccion) this.establecerRestriccion(restriccion.tipo, restriccion.titulo);

    const partida = document.getElementById('pantalla-partida');
    if (partida) partida.classList.add('pantalla-partida-visible');

    RenderManager.actualizarDinosauriosDisponibles();
    this.actualizarInterfaz();
    RenderManager.renderizarTablero();
    this.actualizarBotonSiguiente();
  },

  establecerRestriccion(tipo, titulo) {
    estadoJuego.restriccionActual = tipo;
    estadoJuego.dadoNumero = estadoJuego.dadoNumero || 1;

    const info = document.querySelector('.info-restriccion');
    const icono = document.querySelector('.icono-restriccion-footer');
    const texto = document.querySelector('.texto-restriccion');

    if (info) info.classList.add('restriccion-visible');
    if (icono && tipo) {
      const restriccion = Object.values(CONFIG.RESTRICCIONES_DADO).find(r => r.tipo === tipo);
      if (restriccion) {
        icono.src = `img/${restriccion.imagen}.png`;
        icono.classList.remove('icono-restriccion-ocultar');
        icono.classList.add('icono-restriccion-mostrar');
      }
    }
    
    // Mostrar información de recintos bloqueados
    if (texto) {
      const restriccionConfig = Object.values(CONFIG.RESTRICCIONES_DADO).find(r => r.tipo === tipo);
      let mensaje = `<div>Restricción Actual</div><div>${titulo}</div>`;
      
      if (restriccionConfig && restriccionConfig.recintosBloqueados.length > 0) {
        mensaje += `<div class="texto-restriccion-bloqueados">Recintos bloqueados: ${restriccionConfig.recintosBloqueados.length}</div>`;
      } else {
        mensaje += `<div class="texto-sin-restriccion">Todos los recintos disponibles</div>`;
      }
      
      texto.innerHTML = mensaje;
    }
  },

  establecerSinRestriccion() {
    estadoJuego.restriccionActual = null;

    const info = document.querySelector('.info-restriccion');
    const texto = document.querySelector('.texto-restriccion');
    const icono = document.querySelector('.icono-restriccion-footer');

    if (info) info.classList.add('restriccion-visible');
    if (texto) {
      texto.innerHTML = `<div>Sin restricción</div><div class="texto-sin-restriccion">Todos los recintos disponibles</div>`;
    }
    if (icono) {
      icono.classList.remove('icono-restriccion-mostrar');
      icono.classList.add('icono-restriccion-ocultar');
    }
  },

  _ocultarRestriccion() {
    estadoJuego.restriccionActual = null;
    const info = document.querySelector('.info-restriccion');
    const icono = document.querySelector('.icono-restriccion-footer');

    if (info) info.classList.add('restriccion-oculta');
    if (icono) {
      icono.classList.remove('icono-restriccion-mostrar');
      icono.classList.add('icono-restriccion-ocultar');
    }
  },

  mostrarPopupDescarte() {
    const jugador = estadoJuego.getJugadorActual();

    if (jugador.dinosauriosDisponibles.length === 0) {
      estadoJuego.puedePasarTurno = true;
      this._habilitarBotonSiguiente();
      return;
    }

    const popup = document.getElementById('popup-descarte');
    const contenedor = document.getElementById('dinosaurios-descarte');

    if (!popup || !contenedor) return;

    contenedor.innerHTML = '';
    this.dinoSeleccionadoDescarte = null;
    this.tipoSeleccionadoDescarte = null;

    jugador.dinosauriosDisponibles.forEach((tipo, index) => {
      const img = Utils.crearElemento('img', {
        src: CONFIG.IMAGENES_DINOSAURIOS[tipo].disponible,
        className: 'dino-descarte', alt: tipo,
        dataset: { tipo, index: index.toString() }
      });

      img.onclick = () => this._seleccionarParaDescarte(img, index, tipo);
      contenedor.appendChild(img);
    });

    const btnConfirmar = document.getElementById('btn-confirmar-descarte');
    if (btnConfirmar) {
      btnConfirmar.disabled = true;
      btnConfirmar.onclick = () => this._confirmarDescarte();
    }

    Utils.togglePopup(popup, true);
  },

  _seleccionarParaDescarte(elemento, index, tipo) {
    document.querySelectorAll(CONFIG.SELECTORS.dinoDescarte).forEach(d => d.classList.remove('seleccionado'));
    elemento.classList.add('seleccionado');
    
    this.dinoSeleccionadoDescarte = index;
    this.tipoSeleccionadoDescarte = tipo;

    const btnConfirmar = document.getElementById('btn-confirmar-descarte');
    if (btnConfirmar) btnConfirmar.disabled = false;
  },

  _confirmarDescarte() {
    if (this.dinoSeleccionadoDescarte === null || !this.tipoSeleccionadoDescarte) return;

    const jugador = estadoJuego.getJugadorActual();
    
    if (this.dinoSeleccionadoDescarte >= 0 && 
        this.dinoSeleccionadoDescarte < jugador.dinosauriosDisponibles.length) {
      
      const dinoEliminado = jugador.dinosauriosDisponibles.splice(this.dinoSeleccionadoDescarte, 1)[0];
      estadoJuego.dinosauriosDescartados.push(dinoEliminado);
      
      if (estadoJuego.jugadorActual === 1) {
        estadoJuego.descartadosJ1.push(dinoEliminado);
      } else {
        estadoJuego.descartadosJ2.push(dinoEliminado);
      }
    }

    Utils.togglePopup(document.getElementById('popup-descarte'), false);
    this.dinoSeleccionadoDescarte = null;
    this.tipoSeleccionadoDescarte = null;

    estadoJuego.puedePasarTurno = true;
    this._habilitarBotonSiguiente();
    RenderManager.actualizarDinosauriosDisponibles();
  },

  _habilitarBotonSiguiente() {
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      const jugador = estadoJuego.getJugadorActual();
      const sinDinosaurios = jugador.dinosauriosDisponibles.length === 0;
      
      btn.disabled = !sinDinosaurios && (!estadoJuego.yaColocoEnTurno || !estadoJuego.puedePasarTurno);
      this.actualizarBotonSiguiente();
    }
  },

  actualizarBotonSiguiente() {
    const btn = document.getElementById('btn-siguiente-turno');
    if (!btn) return;

    const jugador = estadoJuego.getJugadorActual();
    const sinDinosaurios = jugador.dinosauriosDisponibles.length === 0;
    
    btn.disabled = !sinDinosaurios && (!estadoJuego.yaColocoEnTurno || !estadoJuego.puedePasarTurno);

    if (estadoJuego.esFinDeRonda()) {
      btn.textContent = estadoJuego.rondaActual < CONFIG.TOTAL_RONDAS ? 'Finalizar ronda' : 'Fin del juego';
    } else {
      btn.textContent = 'Siguiente turno';
    }
  },

  limpiarIndicadoresTurno() {
    // Remover todos los indicadores de turno activo
    const infoJugador = document.querySelector('.info-jugador');
    const infoJugador2 = document.querySelector('.info-jugador2');
    
    if (infoJugador) {
      infoJugador.classList.remove('turno-activo');
    }
    if (infoJugador2) {
      infoJugador2.classList.remove('turno-activo');
    }
  },

  actualizarInterfaz() {
    const jugador = estadoJuego.getJugadorActual();
    const oponente = estadoJuego.getOponente();

    // Actualizar nombre del jugador actual
    const textoJugador = document.querySelector('.texto-jugador');
    if (textoJugador) {
      textoJugador.textContent = jugador.nombre.toUpperCase();
    }

    // Actualizar nombre y puntos del oponente
    const nombrePuntos = document.querySelector('.nombre-puntos');
    if (nombrePuntos) {
      nombrePuntos.textContent = `${oponente.nombre.toUpperCase()} - ${parseInt(oponente.puntosRonda) || 0} PUNTOS`;
    }

    const infoJugador2 = document.querySelector('.info-jugador2');
    const verMapa = document.querySelector('.ver-mapa');

    // INTERFAZ UNIFICADA: Modo seguimiento y modo normal tienen EXACTAMENTE la misma interfaz
    // Todos los elementos UI están siempre visibles independientemente del modo de juego
    if (infoJugador2) infoJugador2.classList.add('info-jugador-visible');
    if (verMapa) verMapa.classList.add('ver-mapa-visible');

    // INTERFAZ UNIFICADA: Aplicar indicadores de turno activo SOLO cuando estamos en la pantalla de partida
    const pantallaPartida = document.getElementById('pantalla-partida');
    const esPantallaPartidaVisible = pantallaPartida && pantallaPartida.style.display !== 'none' && !pantallaPartida.hidden;
    
    const infoJugador = document.querySelector('.info-jugador');
    if (infoJugador && infoJugador2) {
      if (esPantallaPartidaVisible) {
        // El jugador activo siempre está abajo (.info-jugador), independientemente de cuál jugador sea
        infoJugador.classList.add('turno-activo');
        // El oponente siempre está arriba (.info-jugador2) y nunca debe tener estilo activo
        infoJugador2.classList.remove('turno-activo');
      } else {
        // Limpiar indicadores cuando no estamos en pantalla de partida
        infoJugador.classList.remove('turno-activo');
        infoJugador2.classList.remove('turno-activo');
      }
    }

    // Actualizar avatares
    const avatarJugador2Top = document.getElementById('avatar-jugador2-top');
    const avatarJugador1Bottom = document.querySelector('.info-jugador .avatar-circular');

    if (estadoJuego.jugadorActual === 1) {
      if (avatarJugador1Bottom) avatarJugador1Bottom.src = 'img/foto_usuario-1.png';
      if (avatarJugador2Top) {
        avatarJugador2Top.src = window.app?.jugador2Info?.tipo === 'invitado' ?
          'img/invitado.png' : 'img/foto_usuario-2.png';
      }
    } else {
      if (avatarJugador1Bottom) {
        avatarJugador1Bottom.src = window.app?.jugador2Info?.tipo === 'invitado' ?
          'img/invitado.png' : 'img/foto_usuario-2.png';
      }
      if (avatarJugador2Top) avatarJugador2Top.src = 'img/foto_usuario-1.png';
    }

    // Actualizar icono de restricción
    const iconoRestriccion = document.querySelector('.icono-restriccion-footer');
    if (iconoRestriccion) {
      if (estadoJuego.dadoNumero && estadoJuego.restriccionActual) {
        const restriccion = CONFIG.RESTRICCIONES_DADO[estadoJuego.dadoNumero];
        if (restriccion) {
          iconoRestriccion.src = `img/${restriccion.imagen}.png`;
          iconoRestriccion.classList.remove('icono-restriccion-ocultar');
          iconoRestriccion.classList.add('icono-restriccion-mostrar');
        }
      } else {
        iconoRestriccion.classList.remove('icono-restriccion-mostrar');
        iconoRestriccion.classList.add('icono-restriccion-ocultar');
      }
    }

    // Actualizar puntos del jugador actual
    const puntosActuales = parseInt(jugador.puntosRonda) || 0;
    const puntosFooter = document.querySelector('.info-jugador .puntos-jugador span');
    if (puntosFooter) {
      puntosFooter.textContent = `${puntosActuales} PUNTOS`;
    }

    GameLogic.actualizarPuntos();
  },

  _finalizarRonda() {
    this._calcularPuntosRonda();

    if (estadoJuego.rondaActual < CONFIG.TOTAL_RONDAS) {
      this._mostrarResumenRonda();
    } else {
      this._mostrarPantallaFinal();
    }
  },

  _calcularPuntosRonda() {
    const todosJugadores = estadoJuego.getTodosJugadores();
    
    const puntosRondaJ1 = GameLogic.calcularPuntos(estadoJuego.jugador1.recintos, estadoJuego.jugador1, todosJugadores);
    const puntosRondaJ2 = GameLogic.calcularPuntos(estadoJuego.jugador2.recintos, estadoJuego.jugador2, todosJugadores);

    estadoJuego.jugador1.puntosRonda = puntosRondaJ1;
    estadoJuego.jugador2.puntosRonda = puntosRondaJ2;
    estadoJuego.jugador1.puntos += puntosRondaJ1;
    estadoJuego.jugador2.puntos += puntosRondaJ2;
  },

  _mostrarResumenRonda() {
    if (window.app?.showScreen) {
      // Limpiar indicadores de turno al mostrar resumen
      this.limpiarIndicadoresTurno();
      window.app.showScreen('resumen-ronda');
      this._actualizarResumenRonda();

      const btnSiguiente = document.getElementById('btn-siguiente-ronda');
      if (btnSiguiente) btnSiguiente.onclick = () => this._prepararSiguienteRonda();
    }
  },

  _actualizarResumenRonda() {
    const elementos = {
      'puntos-resumen-j1': `${estadoJuego.jugador1.puntos} puntos totales`,
      'puntos-resumen-j2': `${estadoJuego.jugador2.puntos} puntos totales`,
      'nombre-resumen-j1': estadoJuego.jugador1.nombre.toUpperCase(),
      'nombre-resumen-j2': estadoJuego.jugador2.nombre.toUpperCase()
    };

    Object.entries(elementos).forEach(([id, valor]) => {
      const elem = document.getElementById(id);
      if (elem) elem.textContent = valor;
    });
  },

  _prepararSiguienteRonda() {
    // NO limpiar el tablero - los dinosaurios colocados se mantienen entre rondas
    // this.limpiarTablero();

    estadoJuego.rondaActual++;

    // Alternar quién empieza cada ronda:
    // Ronda 1: Jugador original
    // Ronda 2: El otro jugador  
    // Ronda 3: Jugador original
    // Ronda 4: El otro jugador
    const quienEmpezoRonda1 = estadoJuego.primerJugadorOriginal || 1;
    const esRondaImpar = estadoJuego.rondaActual % 2 === 1;
    estadoJuego.primerJugador = esRondaImpar ? quienEmpezoRonda1 : (quienEmpezoRonda1 === 1 ? 2 : 1);
    estadoJuego.jugadorActual = estadoJuego.primerJugador;
    estadoJuego.turnoEnRonda = 1;

    // Reset solo de variables de turno y dinosaurios disponibles para la nueva ronda
    Object.assign(estadoJuego, {
      turnosCompletadosJ1: 0, turnosCompletadosJ2: 0, descartadosJ1: [], descartadosJ2: [],
      dinosauriosRondaJ1: [], dinosauriosRondaJ2: [], dinosauriosDescartados: []
    });
    
    estadoJuego.jugador1.dinosauriosDisponibles = [];
    estadoJuego.jugador2.dinosauriosDisponibles = [];

    console.log(`=== INICIANDO RONDA ${estadoJuego.rondaActual} ===`);
    console.log(`Modo seguimiento: ${estadoJuego.modoSeguimiento}`);
    console.log(`Jugador que empieza: ${estadoJuego.primerJugador}`);

    if (estadoJuego.modoSeguimiento) {
      const jugador = estadoJuego[`jugador${estadoJuego.primerJugador}`];
      const avatarSrc = estadoJuego.primerJugador === 1 ?
        'img/foto_usuario-1.png' :
        (window.app?.jugador2Info?.tipo === 'invitado' ? 'img/invitado.png' : 'img/foto_usuario-2.png');

      if (window.app?.mostrarTurnoJugadorConSeleccion) {
        window.app.mostrarTurnoJugadorConSeleccion(jugador.nombre, avatarSrc);
      } else {
        setTimeout(() => ModoSeguimiento.mostrarPopupSeleccionDinosaurios(), 500);
      }
    } else {
      this._iniciarRonda();
      window.app?.showScreen?.('partida');
    }
  },

  _mostrarPantallaFinal() {
    if (window.app?.showScreen) {
      // Limpiar indicadores de turno al mostrar resultados finales
      this.limpiarIndicadoresTurno();
      window.app.showScreen('resultados');
      this._actualizarPantallaFinal();
    }
  },

  _actualizarPantallaFinal() {
    const j1 = estadoJuego.jugador1;
    const j2 = estadoJuego.jugador2;

    const elementos = {
      'nombre-final-j1': j1.nombre.toUpperCase(),
      'nombre-final-j2': j2.nombre.toUpperCase(),
      'puntos-final-j1': `${j1.puntos} puntos`,
      'puntos-final-j2': `${j2.puntos} puntos`
    };

    Object.entries(elementos).forEach(([id, valor]) => {
      const elem = document.getElementById(id);
      if (elem) elem.textContent = valor;
    });

    const avatarPrimero = document.getElementById('avatar-primero');
    const avatarSegundo = document.getElementById('avatar-segundo');

    if (j1.puntos >= j2.puntos) {
      if (avatarPrimero) avatarPrimero.src = 'img/foto_usuario-1.png';
      if (avatarSegundo) avatarSegundo.src = window.app?.jugador2Info?.tipo === 'invitado' ?
        'img/invitado.png' : 'img/foto_usuario-2.png';
    } else {
      if (avatarPrimero) avatarPrimero.src = window.app?.jugador2Info?.tipo === 'invitado' ?
        'img/invitado.png' : 'img/foto_usuario-2.png';
      if (avatarSegundo) avatarSegundo.src = 'img/foto_usuario-1.png';
    }
  },

  mostrarAlertaPuntos(puntosObtenidos, tipoDino, recinto) {
    const jugador = estadoJuego.getJugadorActual();
    const nombreRecinto = this._obtenerNombreRecinto(recinto);
    const nombreDino = this._obtenerNombreDinosaurio(tipoDino);
    
    let mensaje = '';
    let tipoAlerta = 'info';
    
    if (puntosObtenidos > 0) {
      mensaje = `<div class="puntos-enfasis">+${puntosObtenidos} PUNTO${puntosObtenidos !== 1 ? 'S' : ''}</div>`;
      tipoAlerta = 'success';
    } else if (puntosObtenidos === 0) {
      mensaje = `<div class="puntos-enfasis">0 PUNTOS</div>`;
      tipoAlerta = 'info';
    } else {
      mensaje = `<div class="puntos-enfasis">ESTRATÉGICO</div>`;
      tipoAlerta = 'info';
    }
    
    // Agregar información del total actual
    mensaje += `<div class="total-puntos">Total: ${jugador.puntosRonda || 0} puntos</div>`;
    
    mostrarAlertaJuego(mensaje, tipoAlerta, 2500);
  },

  _obtenerNombreRecinto(recinto) {
    const nombres = {
      'bosque-semejanza': 'Bosque de la Semejanza',
      'pradera-amor': 'Pradera del Amor',
      'woody-trio': 'Trío Frondoso',
      'prado-diferencia': 'Prado de la Diferencia',
      'rey-jungla': 'Rey de la Jungla',
      'isla-solitaria': 'Isla Solitaria',
      'rio': 'El Río'
    };
    return nombres[recinto] || recinto;
  },

  _obtenerNombreDinosaurio(tipo) {
    const nombres = {
      't-rex': 'T-Rex',
      'triceratops': 'Triceratops',
      'diplodocus': 'Diplodocus',
      'stegosaurus': 'Stegosaurus',
      'parasaurolophus': 'Parasaurolophus'
    };
    return nombres[tipo] || tipo;
  },

  reiniciarJuegoCompleto() {
    estadoJuego.reset();
    this._generarPoolDinosaurios();
  },

  prepararSiguienteRonda() {
    return this._prepararSiguienteRonda();
  }
};

/* ==================== FUNCIONES PARA REGLAS INTERACTIVAS ==================== */

// Función para expandir/contraer consejos
function mostrarDetalleConsejo(elemento) {
  // Cerrar todos los otros consejos
  document.querySelectorAll('.consejo-item').forEach(item => {
    if (item !== elemento) {
      item.classList.remove('expandido');
    }
  });
  
  // Toggle del consejo actual
  elemento.classList.toggle('expandido');
  
  // Scroll suave al elemento si se expandió
  if (elemento.classList.contains('expandido')) {
    elemento.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest' 
    });
  }
}

// Función para mostrar alertas durante el juego
function mostrarAlertaJuego(mensaje, tipo = 'info', duracion = 5000) {
  // Determinar el icono según el tipo de alerta
  const iconos = {
    'info': 'img/icono_informacion.png',
    'warning': 'img/icono_informacion.png',
    'success': 'img/icono_ganador.png',
    'error': 'img/icono_informacion.png'
  };
  
  const alerta = document.createElement('div');
  alerta.className = `alerta-juego alerta-${tipo}`;
  alerta.innerHTML = `
    <div class="alerta-contenido">
      <img src="${iconos[tipo] || iconos.info}" alt="${tipo}" class="alerta-icono">
      <span class="alerta-mensaje">${mensaje}</span>
      <button class="alerta-cerrar" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // Agregar al DOM
  document.body.appendChild(alerta);
  
  // Auto-remover después del tiempo especificado
  setTimeout(() => {
    if (alerta.parentElement) {
      alerta.remove();
    }
  }, duracion);
}

// Función para mostrar consejos contextuales
function mostrarConsejoContextual(recinto, accion) {
  const consejos = {
    'bosque-semejanza': {
      'colocar': 'Recordá: solo podés poner dinosaurios de la misma especie, llenando de izquierda a derecha sin espacios.',
      'puntos': 'Puntos: 1, 3, 6, 10, 15, 21 según cantidad de dinos iguales'
    },
    'prado-diferencia': {
      'colocar': 'Recordá: solo podés poner dinosaurios de especies distintas, llenando de izquierda a derecha sin espacios.',
      'puntos': 'Puntos: 1, 3, 6, 10, 15, 21 según cantidad de especies distintas'
    },
    'pradera-amor': {
      'colocar': 'Recordá: formá parejas del mismo tipo para obtener 5 puntos por cada pareja.',
      'puntos': 'Podés tener varias parejas de la misma especie'
    },
    'woody-trio': {
      'colocar': 'Recordá: podés poner hasta 3 dinosaurios de cualquier especie.',
      'puntos': '7 puntos si hay exactamente 3, 0 puntos si hay menos'
    },
    'rey-jungla': {
      'colocar': 'Recordá: solo podés poner 1 dinosaurio de cualquier especie.',
      'puntos': '7 puntos si tu zoo tiene al menos tantos de esa especie como cada oponente'
    },
    'isla-solitaria': {
      'colocar': 'Recordá: solo podés poner 1 dinosaurio.',
      'puntos': '7 puntos si es el único de su especie en todo tu zoo'
    },
    'rio': {
      'colocar': 'El Río siempre está disponible como salvavidas.',
      'puntos': 'Cada dinosaurio aquí vale 1 punto al final'
    }
  };
  
  const consejo = consejos[recinto]?.[accion];
  if (consejo) {
    mostrarAlertaJuego(consejo, 'info', 4000);
  }
}

// Función para mostrar alertas de restricción del dado
function mostrarAlertaRestriccionDado(cara) {
  const alertas = {
    1: '¡Tablero libre! Podés colocar el dinosaurio en cualquier recinto.',
    2: 'El Rey de la Jungla está bloqueado. Podés colocar en cualquier otro recinto.',
    3: 'Recintos disponibles: Bosque de la Semejanza, Trío Frondoso, Pradera del Amor.',
    4: 'Recintos disponibles: Rey de la Jungla, Prado de la Diferencia, Isla Solitaria.',
    5: 'Recintos disponibles: Trío Frondoso, Bosque de la Semejanza, Rey de la Jungla.',
    6: 'Recintos disponibles: Prado de la Diferencia, Isla Solitaria, Pradera del Amor.'
  };
  
  const alerta = alertas[cara];
  if (alerta) {
    mostrarAlertaJuego(alerta, 'warning', 5000);
  }
}

// Función para mostrar consejos de estrategia
function mostrarConsejoEstrategia(tipo) {
  const estrategias = {
    'primer-turno': '¡Primer turno sin restricción! Aprovechalo para colocar estratégicamente.',
    't-rex-bonus': 'Recordá: cada recinto con T-Rex da +1 punto extra al final.',
    'rio-salvavidas': 'Si no podés cumplir la restricción, usá el Río como salvavidas.',
    'observar-oponente': 'Observá el mapa del oponente para tomar decisiones inteligentes.',
    'llenado-consecutivo': 'En recintos grandes, llená de izquierda a derecha sin espacios.',
    'parejas-amor': 'En Pradera del Amor, concentráte en formar parejas del mismo tipo.'
  };
  
  const estrategia = estrategias[tipo];
  if (estrategia) {
    mostrarAlertaJuego(estrategia, 'success', 4000);
  }
}

/* ==================== INICIALIZACIÓN ==================== */
document.addEventListener('DOMContentLoaded', () => {
  // Los estilos de alertas ahora están en tablero.css
  const btnSiguiente = document.getElementById('btn-siguiente-turno');
  if (btnSiguiente) {
    btnSiguiente.addEventListener('click', () => JuegoManager.procesarSiguienteTurno());
  }

  PopupManager.setupEventListeners();

  const verMapa = document.querySelector('.ver-mapa');
  if (verMapa) {
    verMapa.addEventListener('click', (e) => {
      e.preventDefault();
      MapaOponente.mostrar();
    });
  }

  // Exponer funciones globales
  Object.assign(window, {
    JuegoManager, estadoJuego, ModoSeguimiento, RenderManager,
    mostrarReglas: () => PopupManager.mostrarReglas(),
    mostrarPesos: () => PopupManager.mostrarPesos(),
    mostrarMapa: () => MapaOponente.mostrar(),
    cerrarPopup: (id) => PopupManager.cerrar(id),
    limpiarIndicadoresTurno: () => JuegoManager.limpiarIndicadoresTurno(),
    // Funciones de reglas interactivas
    mostrarDetalleConsejo,
    mostrarAlertaJuego,
    mostrarConsejoContextual,
    mostrarAlertaRestriccionDado,
    mostrarConsejoEstrategia
  });

  if (window.app) {
    window.app.empezarTurnoSeguimiento = function () {
      window.app.showScreen('partida');

      const jugadorNum = estadoJuego.jugadorActual;
      const yaSeleccionoEnRonda = (jugadorNum === 1 && estadoJuego.dinosauriosRondaJ1.length > 0) ||
        (jugadorNum === 2 && estadoJuego.dinosauriosRondaJ2.length > 0);

      setTimeout(() => {
        if (!yaSeleccionoEnRonda) {
          ModoSeguimiento.mostrarPopupSeleccionDinosaurios();
        } else {
          ModoSeguimiento._restaurarDinosauriosGuardados();
        }
      }, 100);
    };
  }
});
