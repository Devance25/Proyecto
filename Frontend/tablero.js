// ============================================================================
// CONFIGURACIÓN CENTRALIZADA DEL JUEGO
// ============================================================================

/**
 * CONFIGURACIÓN GLOBAL - DRAFTOSAURUS DIGITAL
 * 
 * Esta configuración es transversal a ambos modos de juego:
 * - MODO JUEGO DIGITAL COMPLETO: Usa esta configuración para generar automáticamente
 * - MODO SEGUIMIENTO: Usa esta configuración para validar selecciones manuales
 */
const CONFIG = {
  // Dinosaurios
  IMAGENES_DINOSAURIOS: {
    't-rex': { disponible: 'img/dino-t-rex.png', colocado: 'img/dino-t-rex-arriba.png' },
    'triceratops': { disponible: 'img/dino-triceratops.png', colocado: 'img/dino-triceratops-arriba.png' },
    'diplodocus': { disponible: 'img/dino-diplodocus.png', colocado: 'img/dino-diplodocus-arriba.png' },
    'stegosaurus': { disponible: 'img/dino-stegosaurus.png', colocado: 'img/dino-stegosaurus-arriba.png' },
    'parasaurolophus': { disponible: 'img/dino-parasaurolophus.png', colocado: 'img/dino-parasaurolophus-arriba.png' },
    'pterodactilo': { disponible: 'img/dino-velociraptor.png', colocado: 'img/dino-velociraptor-arriba.png' }
  },

  // Pesos y masas de dinosaurios
  MASAS_DINOSAURIOS: { 't-rex': 7000, 'triceratops': 7000, 'diplodocus': 15000, 'stegosaurus': 5000, 'parasaurolophus': 2500, 'pterodactilo': 2000 }, // kg

  GRAVEDAD: 9.8, // m/s²
  TIPOS_DINOSAURIOS: ['t-rex', 'triceratops', 'diplodocus', 'stegosaurus', 'parasaurolophus', 'pterodactilo'],
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
      descripcion: 'Bloquea recintos que contengan T-Rex',
      recintosBloqueados: [] // Se calcula dinámicamente
    },
    3: {
      tipo: 'lado-cafeteria',
      titulo: 'Lado Cafetería',
      imagen: 'dado-cafe',
      descripcion: 'Rey de la Jungla, Prado de la Diferencia, Isla Solitaria',
      recintosBloqueados: ['rey-jungla', 'prado-diferencia', 'isla-solitaria']
    },
    4: {
      tipo: 'lado-banos',
      titulo: 'Lado Baños',
      imagen: 'dado-banos',
      descripcion: 'Bosque de la Semejanza, Trío Frondoso, Pradera del Amor',
      recintosBloqueados: ['bosque-semejanza', 'woody-trio', 'pradera-amor']
    },
    5: {
      tipo: 'bosque',
      titulo: 'Bosque',
      imagen: 'dado-bosque',
      descripcion: 'Prado de la Diferencia, Isla Solitaria, Pradera del Amor',
      recintosBloqueados: ['prado-diferencia', 'isla-solitaria', 'pradera-amor']
    },
    6: {
      tipo: 'rocas',
      titulo: 'Rocas / Pradera',
      imagen: 'dado-rocas',
      descripcion: 'Bosque de la Semejanza, Rey de la Jungla, Trío Frondoso',
      recintosBloqueados: ['bosque-semejanza', 'rey-jungla', 'woody-trio']
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

// ============================================================================
// REGLAS DE RECINTOS (TRANSVERSAL - Común a ambos modos)
// ============================================================================

/**
 * REGLAS DE RECINTOS - DRAFTOSAURUS DIGITAL
 * 
 * Define las reglas de puntuación y validación para cada recinto.
 * Estas reglas son transversales a ambos modos de juego:
 * - MODO JUEGO DIGITAL COMPLETO: Usa estas reglas para calcular puntajes automáticamente
 * - MODO SEGUIMIENTO: Usa estas reglas para validar colocaciones manuales
 */
const REGLAS_RECINTOS = {
  'bosque-semejanza': {
    validar: (recinto, nuevoDino) => recinto.length === 0 || recinto.every(d => d === nuevoDino),
    maxDinos: 6,
    puntos: [0, 2, 4, 8, 12, 18, 24],
    nombre: 'Bosque de la Semejanza',
    descripcion: 'Todos los dinosaurios iguales. Puntos: 2, 4, 8, 12, 18, 24'
  },
  'pradera-amor': {
    validar: () => true,
    maxDinos: 6,
    puntos: (recinto) => {
      const conteos = {};
      recinto.forEach(d => conteos[d] = (conteos[d] || 0) + 1);
      return Object.values(conteos).reduce((parejas, count) => parejas + Math.floor(count / 2), 0) * 6;
    },
    nombre: 'Pradera del Amor',
    descripcion: 'Deben ir en parejas del mismo tipo. 6 puntos por cada pareja'
  },
  'woody-trio': {
    validar: () => true,
    maxDinos: 3,
    puntos: cant => cant === 3 ? 7 : 0,
    nombre: 'Trío Frondoso',
    descripcion: 'Exactamente 3 dinosaurios del mismo tipo. 7 puntos por cada trío completo'
  },
  'prado-diferencia': {
    validar: (recinto, nuevoDino) => !recinto.includes(nuevoDino),
    maxDinos: 6,
    puntos: [0, 1, 3, 6, 10, 15, 21],
    nombre: 'Prado de la Diferencia',
    descripcion: 'Todos los dinosaurios diferentes. Puntos: 1, 3, 6, 10, 15, 21'
  },
  'rey-jungla': {
    validar: () => true, // Permite cualquier tipo de dinosaurio
    maxDinos: 1,
    puntos: (recinto) => {
      // Por ahora, simplificado: 7 puntos si hay 1 dinosaurio
      // La lógica completa de comparación con el oponente se implementará después
      return recinto.length === 1 ? 7 : 0;
    },
    nombre: 'Rey de la Jungla',
    descripcion: 'Solo 1 dinosaurio. 7 puntos si tienes más de esa especie que el oponente'
  },
  'isla-solitaria': {
    validar: () => true,
    maxDinos: 1,
    puntos: (recinto) => recinto.length === 1 ? 7 : 0,
    nombre: 'Isla Solitaria',
    descripcion: 'Solo se permite 1 dinosaurio. 7 puntos fijos'
  },
  'rio': {
    validar: () => true,
    maxDinos: 20,
    puntos: cant => cant,
    nombre: 'Río',
    descripcion: 'En el río vale 1 punto. Siempre se puede colocar'
  }
};

// ============================================================================
// UTILIDADES GENERALES (TRANSVERSAL - Común a ambos modos)
// ============================================================================

/**
 * UTILIDADES GENERALES - DRAFTOSAURUS DIGITAL
 * 
 * Funciones de utilidad que son transversales a ambos modos de juego:
 * - Manipulación de arrays
 * - Manejo de popups
 * - Creación de elementos DOM
 * - Validaciones comunes
 */
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

    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      const hayOtrosPopups = Array.from(document.querySelectorAll(CONFIG.SELECTORS.popupOverlay))
        .some(p => !p.classList.contains('hidden'));
      if (!hayOtrosPopups) {
        document.body.style.overflow = '';
      }
    }
  },

  hayPopupAbierto: () => Array.from(document.querySelectorAll(CONFIG.SELECTORS.popupOverlay))
    .some(p => !p.classList.contains('hidden')),

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

// ============================================================================
// ESTADO DEL JUEGO (TRANSVERSAL - Común a ambos modos)
// ============================================================================

/**
 * ESTADO DEL JUEGO - DRAFTOSAURUS DIGITAL
 * 
 * Maneja el estado global del juego que es transversal a ambos modos:
 * - MODO JUEGO DIGITAL COMPLETO: Estado controlado automáticamente por el sistema
 * - MODO SEGUIMIENTO: Estado controlado manualmente por el usuario
 * 
 * Ambos modos comparten la misma estructura de estado pero con diferentes flujos de control
 */
class EstadoJuego {
  constructor() { this.reset(); }


  _crearJugador() {
    return {
      nombre: '',
      dinosauriosDisponibles: [],
      puntos: 0,
      puntosRonda: 0,
      recintos: {
        'bosque-semejanza': [], 'pradera-amor': [], 'woody-trio': [],
        'prado-diferencia': [], 'rey-jungla': [], 'isla-solitaria': [], 'rio': []
      }
    };
  }


  // FASE 1: Inicializa todas las propiedades del estado del juego, incluyendo nuevas propiedades para integración con backend
  reset() {
    Object.assign(this, {
      jugadorActual: 1,
      primerJugador: 1,
      primerJugadorOriginal: 1,
      rondaActual: 1,
      turnoEnRonda: 1,
      modoSeguimiento: false,
      restriccionActual: null,
      puedePasarTurno: false,
      yaColocoEnTurno: false,
      dinosaurioColocadoEnTurno: null,
      recintoColocadoEnTurno: null,

      // NUEVAS PROPIEDADES FASE 1
      partidaId: (() => {
        const datos = localStorage.getItem('datosJuego');
        if (datos) {
          const parsed = JSON.parse(datos);
          return parsed?.partida?.id || null;
        }
        return null;
      })(),
      sincronizandoConBackend: false,
      dinosaurioDescartadoEnTurno: null,
      yaDescarto: false,
      // CONTINUA IGUAL
      dadoNumero: null,
      repartosDisponibles: [],
      dinosauriosDescartados: [],
      dinosauriosRondaJ1: [],
      dinosauriosRondaJ2: [],
      descartadosJ1: [],
      descartadosJ2: [],
      turnosCompletadosJ1: 0,
      turnosCompletadosJ2: 0,
      jugador1: this._crearJugador(), jugador2: this._crearJugador()
    });
  }

  getJugadorActual() { return this[`jugador${this.jugadorActual}`]; }
  getOponente() { return this[`jugador${this.jugadorActual === 1 ? 2 : 1}`]; }
  getTodosJugadores() { return [this.jugador1, this.jugador2]; }

  // FASE 3: Resetea estados de colocación y descarte al cambiar turno para nuevos estados del botón
  cambiarTurno() {
    if (this.modoSeguimiento) this[`turnosCompletadosJ${this.jugadorActual}`]++;

    this.jugadorActual = this.jugadorActual === 1 ? 2 : 1;
    
    // En modo seguimiento, el backend ya incrementó el turno, NO lo incrementamos aquí
    if (!this.modoSeguimiento) {
      this.turnoEnRonda++;
    }
    
    this.yaColocoEnTurno = false;
    this.puedePasarTurno = false;
    this.dinosaurioColocadoEnTurno = null;
    this.recintoColocadoEnTurno = null;

    // FASE 3: Resetear también estado de descarte
    this.dinosaurioDescartadoEnTurno = null;
    this.yaDescarto = false;

    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      btn.disabled = true;
      // Actualizar el botón para el nuevo turno usando JuegoManager
      if (window.JuegoManager?.actualizarBotonSiguiente) {
        window.JuegoManager.actualizarBotonSiguiente();
      }
    }
  }

  esFinDeRonda() {
    // En modo seguimiento, el turno 6 es el último (6 turnos por ronda)
    // En modo digital, el turno 7 indica que se procesó el turno 6
    if (this.modoSeguimiento) {
      // En modo seguimiento, el turno 7 o más es fin de ronda (después de procesar turno 6)
      if (this.turnoEnRonda >= 7) {
        return true;
      }
    } else {
      // En modo digital, turno 7 significa que se procesó el turno 6
      if (this.turnoEnRonda >= 7) {
        return true;
      }
    }
    
    // Verificar si ambos jugadores ya no tienen dinosaurios (han colocado sus 3 dinosaurios)
    const sinDinosaurios = this.jugador1.dinosauriosDisponibles.length === 0 &&
      this.jugador2.dinosauriosDisponibles.length === 0;
    
    // Si no hay dinosaurios disponibles, es fin de ronda
    if (sinDinosaurios) {
      return true;
    }
    
    return false;
  }

  esPrimerTurnoDeRonda() { return this.turnoEnRonda === 1; }
  esPrimerTurnoAbsoluto() { 
    // Solo es el primer turno absoluto si es ronda 1, turno 1 Y no hay restricción activa del dado
    return this.turnoEnRonda === 1 && this.rondaActual === 1 && !this.restriccionActual; 
  }
  necesitaRestriccion() { return !this.esPrimerTurnoDeRonda(); }
  puedeMoverDinosaurios() { return this.rondaActual >= 1; }
}

const estadoJuego = new EstadoJuego();

// ============================================================================
// LÓGICA DEL JUEGO (TRANSVERSAL - Común a ambos modos)
// ============================================================================

/**
 * LÓGICA DEL JUEGO - DRAFTOSAURUS DIGITAL
 * 
 * Contiene la lógica central del juego que es transversal a ambos modos:
 * - Validación de colocaciones
 * - Cálculo de puntajes
 * - Aplicación de restricciones del dado
 * - Manejo de pesos y masas
 * 
 * Esta lógica es compartida entre ambos modos de juego
 */
const GameLogic = {
  puedeColocarDinosaurio(recinto, tipoDino) {
    if (estadoJuego.yaColocoEnTurno) return false;

    // El río SIEMPRE está disponible (no se bloquea nunca)
    if (recinto === 'rio') return true;

    const jugador = estadoJuego.getJugadorActual();
    const recintoActual = jugador.recintos[recinto];
    const reglas = REGLAS_RECINTOS[recinto];

    if (!reglas || recintoActual.length >= reglas.maxDinos) return false;

    if (estadoJuego.restriccionActual && this.estaRecintoBloqueado(recinto)) return false;

    return reglas.validar(recintoActual, tipoDino);
  },

  estaRecintoBloqueado(recinto) {
    // Si no hay restricción actual, no hay bloqueos
    if (!estadoJuego.restriccionActual) return false;

    // Caso especial: no-trex - bloquea recintos que contengan t-rex
    if (estadoJuego.restriccionActual === 'no-t-rex') {
      const jugadorActual = estadoJuego.getJugadorActual();
      const dinosEnRecinto = jugadorActual.recintos[recinto] || [];
      return dinosEnRecinto.includes('t-rex');
    }

    // Caso especial: huella libre - solo permite recintos vacíos (excepto el río)
    if (estadoJuego.restriccionActual === 'huella-libre') {
      // El río siempre está disponible con huella libre (es el descarte forzado)
      if (recinto === 'rio') {
        return false; // No bloquear el río
      }
      const jugadorActual = estadoJuego.getJugadorActual();
      return jugadorActual.recintos[recinto] && jugadorActual.recintos[recinto].length > 0;
    }

    // Buscar la configuración de la restricción actual
    const restriccionConfig = Object.values(CONFIG.RESTRICCIONES_DADO)
      .find(r => r.tipo === estadoJuego.restriccionActual);

    // Si no se encuentra la configuración o no tiene recintos bloqueados, no bloquear
    if (!restriccionConfig || !restriccionConfig.recintosBloqueados) return false;

    return restriccionConfig.recintosBloqueados.includes(recinto);
  },

  // FASE 2: Coloca un dinosaurio en un recinto y muestra popup de descarte inmediatamente (no al presionar siguiente turno)
  colocarDinosaurio(recinto, tipoDino, area) {
    if (estadoJuego.yaColocoEnTurno) return false;

    const jugador = estadoJuego.getJugadorActual();
    const idx = jugador.dinosauriosDisponibles.indexOf(tipoDino);
    if (idx === -1) return false;

    const puntosAntes = jugador.puntosRonda || 0;

    jugador.dinosauriosDisponibles.splice(idx, 1);
    jugador.recintos[recinto].push(tipoDino);

    RenderManager.agregarDinosaurioVisual(tipoDino, recinto, area);
    estadoJuego.yaColocoEnTurno = true;
    estadoJuego.dinosaurioColocadoEnTurno = tipoDino;
    estadoJuego.recintoColocadoEnTurno = recinto;

    this.actualizarPuntos();
    this.actualizarPesos();
    // No actualizar interfaz aquí - los avatares no deben cambiar al colocar

    setTimeout(() => {
      RenderManager.actualizarDinosauriosDisponibles();
      DragDropManager.reinitDinosauriosColocados();
    }, 50);

    const puntosDesues = jugador.puntosRonda || 0;
    const puntosObtenidos = puntosDesues - puntosAntes;

    estadoJuego.puedePasarTurno = true;
    JuegoManager.actualizarBotonSiguiente();

    // FASE 2: MOSTRAR POPUP INMEDIATAMENTE
    setTimeout(() => JuegoManager.mostrarPopupDescarte(), 300);

    setTimeout(() => {
      JuegoManager.mostrarAlertaPuntos(puntosObtenidos, tipoDino, recinto);
    }, 350);

    if (typeof limpiarTooltips === 'function') {
      limpiarTooltips();
    }

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
        if (nombre === 'prado-diferencia') {
          // Para prado-diferencia, contar especies únicas, no cantidad total
          const especiesUnicas = new Set(dinosaurios).size;
          puntos = reglas.puntos[especiesUnicas] || 0;
        } else if (nombre === 'bosque-semejanza') {
          if (dinosaurios.length > 0 && dinosaurios.every(d => d === dinosaurios[0])) {
            // Usar valor directo del array: 1 dino=2, 2 dinos=4, 3 dinos=8, etc.
            puntos = reglas.puntos[dinosaurios.length] || 0;
          } else {
            puntos = 0;
          }
        } else {
          // Para otros recintos con array de puntos, usar cantidad total
          puntos = reglas.puntos[dinosaurios.length] || 0;
        }
      }
      total += puntos;
    });

    // Bonus T-Rex eliminado - ahora se maneja en el Recinto del T-Rex
    return total;
  },

  actualizarPuntos() {
    // Calcular puntos localmente solo para el popup de colocación
    // El puntaje general del jugador viene del backend
    const todosJugadores = estadoJuego.getTodosJugadores();
    
    estadoJuego.jugador1.puntosRonda = GameLogic.calcularPuntos(estadoJuego.jugador1.recintos, estadoJuego.jugador1, todosJugadores);
    estadoJuego.jugador2.puntosRonda = GameLogic.calcularPuntos(estadoJuego.jugador2.recintos, estadoJuego.jugador2, todosJugadores);
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

      const elemMasa = document.getElementById(`masa-${recinto}`);
      if (elemMasa) elemMasa.textContent = masa.toFixed(0);

      const elemPeso = document.getElementById(`peso-${recinto}`);
      if (elemPeso) elemPeso.textContent = peso.toFixed(0);
    });

    const elemMasaTotal = document.getElementById('masa-total');
    if (elemMasaTotal) elemMasaTotal.textContent = masaTotal.toFixed(0);

    const elemPesoTotal = document.getElementById('peso-total');
    if (elemPesoTotal) elemPesoTotal.textContent = pesoTotal.toFixed(0);
  }
};

// ============================================================================
// SISTEMA DE RENDERIZADO (TRANSVERSAL - Común a ambos modos)
// ============================================================================

/**
 * SISTEMA DE RENDERIZADO - DRAFTOSAURUS DIGITAL
 * 
 * Maneja la visualización del tablero y dinosaurios que es transversal a ambos modos:
 * - Renderizado del tablero
 * - Actualización de dinosaurios disponibles
 * - Creación de elementos visuales
 * - Manejo de posiciones
 * 
 * Ambos modos comparten la misma interfaz visual
 */
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

        if (estadoJuego.rondaActual >= 2) {
          img.draggable = true;
          img.classList.add('dino-arrastreable');

          // Agregar datos necesarios
          Object.assign(img.dataset, { recinto, tipo, jugador: estadoJuego.jugadorActual.toString() });
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
      dataset: { jugador: jugadorActual.toString(), tipo, recinto }
    });

    img.style.top = pos.top;
    img.style.left = pos.left;
    img.style.pointerEvents = 'auto';

    area.appendChild(img);

    if (jugadorActual === estadoJuego.jugadorActual) {
      img.draggable = true;
      img.classList.add('dino-arrastreable');


      img.addEventListener('dragstart', (e) => {
        DragDropManager.dinosaurioArrastrado = e.target;
        DragDropManager.esCorreccion = true;
        DragDropManager.recintoOrigen = recinto;


        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tipo);
        e.dataTransfer.setData('tipo', tipo);
        e.dataTransfer.setData('recinto-origen', recinto);
        e.dataTransfer.setData('correccion', 'true');
      });

      img.addEventListener('dragend', DragDropManager._handleDragEnd.bind(DragDropManager));
    }

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

    if (jugador.dinosauriosDisponibles.length === 0) {
      const mensaje = Utils.crearElemento('div', {
        className: 'mensaje-sin-dinosaurios',
        textContent: 'No hay dinosaurios disponibles'
      });
      contenedor.appendChild(mensaje);
      return;
    }

    jugador.dinosauriosDisponibles.forEach((tipo, index) => {
      // Verificar que el tipo de dinosaurio esté definido en la configuración
      if (!CONFIG.IMAGENES_DINOSAURIOS[tipo]) {
        return; // Saltar este dinosaurio si no está definido
      }
      
      const img = Utils.crearElemento('img', {
        src: CONFIG.IMAGENES_DINOSAURIOS[tipo].disponible,
        className: 'dino',
        draggable: true,
        alt: tipo,
        dataset: { tipo, index: index.toString() }
      });

      contenedor.appendChild(img);
    });

    DragDropManager.init();
    // FASE 3: Actualizar estado del botón cuando cambian dinosaurios disponibles
    JuegoManager.actualizarBotonSiguiente();
  }
};

// ============================================================================
// SISTEMA DE DRAG & DROP (TRANSVERSAL - Común a ambos modos)
// ============================================================================

/**
 * SISTEMA DE DRAG & DROP - DRAFTOSAURUS DIGITAL
 * 
 * Maneja la interacción de arrastrar y soltar dinosaurios que es transversal a ambos modos:
 * - Arrastre de dinosaurios disponibles
 * - Corrección de dinosaurios colocados
 * - Soporte táctil para dispositivos móviles
 * - Validación visual de zonas de drop
 * 
 * Ambos modos comparten la misma interfaz de interacción
 */
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
    setTimeout(() => this._initDinosauriosColocados(), 100);
  },

  reinitDinosauriosColocados() {
    setTimeout(() => this._initDinosauriosColocados(), 50);
  },

  _initDinosaurios() {
    document.querySelectorAll(CONFIG.SELECTORS.dino).forEach(dino => {
      // No procesar dinosaurios ya colocados
      if (dino.classList.contains('dinosaurio-colocado')) return;

      const newDino = dino.cloneNode(true);
      dino.parentNode.replaceChild(newDino, dino);

      newDino.addEventListener('dragstart', this._handleDragStart.bind(this));
      newDino.addEventListener('dragend', this._handleDragEnd.bind(this));

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

    // Zones de recintos
    document.querySelectorAll(CONFIG.SELECTORS.dropZones).forEach(zone => {
      const newZone = zone.cloneNode(true);
      zone.parentNode.replaceChild(newZone, zone);

      Object.entries(eventHandlers).forEach(([event, handler]) => {
        newZone.addEventListener(event, handler.bind(this));
      });
    });

    const zonaDisponibles = document.querySelector('.dinosaurios-disponibles');
    if (zonaDisponibles) {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        zonaDisponibles.addEventListener(event, handler.bind(this));
      });
    } else {
    }
  },

  _initDinosauriosColocados() {
    const dinosaurios = document.querySelectorAll('.dinosaurio-colocado');
  },

  _handleDragStartCorreccion(e) {
    this.dinosaurioArrastrado = e.target;
    this.esCorreccion = true;

    // Buscar el recinto de manera más robusta
    let recintoOrigen = e.target.dataset.recinto;
    if (!recintoOrigen) {
      const area = e.target.closest('[data-recinto]');
      recintoOrigen = area?.dataset.recinto;
    }
    if (!recintoOrigen) {
      // Buscar en el estado del juego
      const jugador = estadoJuego.getJugadorActual();
      const tipo = e.target.dataset.tipo;
      for (const [recintoId, dinosaurios] of Object.entries(jugador.recintos)) {
        if (dinosaurios.includes(tipo)) {
          recintoOrigen = recintoId;
          break;
        }
      }
    }

    this.recintoOrigen = recintoOrigen;


    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.tipo);
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


    let tipoDino;
    if (e.dataTransfer && e.dataTransfer.getData) {
      tipoDino = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('tipo');
    } else if (this.dinosaurioArrastrado) {
      tipoDino = this.dinosaurioArrastrado.dataset.tipo;
    }


    // Manejar devolución a zona de disponibles
    if (area.classList.contains('dinosaurios-disponibles') && this.esCorreccion) {
      this._devolverDinosaurioABase(tipoDino);
      this._limpiarIndicadores();
      if (this.isDragging) this._cleanupTouch();
      return;
    }

    if (!recinto || !tipoDino) {
      this._limpiarIndicadores();
      if (this.isDragging) this._cleanupTouch();
      return;
    }

    if (this.esCorreccion) {
      this._manejarCorreccion(recinto, tipoDino, area);
    } else if (GameLogic.puedeColocarDinosaurio(recinto, tipoDino)) {
      GameLogic.colocarDinosaurio(recinto, tipoDino, area);
    }

    this._limpiarIndicadores();
    if (this.isDragging) this._cleanupTouch();
  },

  _devolverDinosaurioABase(tipoDino) {
    const jugador = estadoJuego.getJugadorActual();
    const recintoOrigenId = this.recintoOrigen;

    if (recintoOrigenId && jugador.recintos[recintoOrigenId]) {
      // Remover del recinto
      const index = jugador.recintos[recintoOrigenId].indexOf(tipoDino);
      if (index > -1) {
        jugador.recintos[recintoOrigenId].splice(index, 1);

        jugador.dinosauriosDisponibles.push(tipoDino);

        RenderManager.actualizarDinosauriosDisponibles();
        RenderManager.actualizarTablero();
        GameLogic.actualizarPuntos();
        GameLogic.actualizarPesos();

        const tieneAlgunDino = Object.values(jugador.recintos).some(recinto => recinto.length > 0);
        if (!tieneAlgunDino) {
          estadoJuego.yaColocoEnTurno = false;
          estadoJuego.puedePasarTurno = false;
        }

        JuegoManager.actualizarBotonSiguiente();
        mostrarAlertaJuego(`Dinosaurio devuelto a disponibles`, 'info', 2000);
      }
    }

    this.esCorreccion = false;
    this.recintoOrigen = null;
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
      const fakeEvent = {
        preventDefault: () => { },
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

// ============================================================================
// SISTEMA DE POPUPS (TRANSVERSAL - Común a ambos modos)
// ============================================================================

/**
 * SISTEMA DE POPUPS - DRAFTOSAURUS DIGITAL
 * 
 * Maneja la visualización de popups que es transversal a ambos modos:
 * - Popup de reglas del juego
 * - Popup de pesos y masas
 * - Popup de descarte de dinosaurios
 * - Manejo de eventos de cierre
 * 
 * Ambos modos comparten el mismo sistema de popups
 */
const PopupManager = {
  mostrarReglas: () => Utils.togglePopup(document.getElementById('popup-reglas'), true),
  mostrarPesos: () => { GameLogic.actualizarPesos(); Utils.togglePopup(document.getElementById('popup-pesos'), true); },

  cerrar(popupId) {
    const puedeSerCerrado = (popup) => {
      return !(popup.id === 'popup-descarte' && estadoJuego.yaColocoEnTurno && !estadoJuego.yaDescarto) &&
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
        if (popup.id === 'popup-descarte' && estadoJuego.yaColocoEnTurno && !estadoJuego.yaDescarto) return;
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
        if (popup?.id === 'popup-descarte' && estadoJuego.yaColocoEnTurno && !estadoJuego.yaDescarto) return;
        if (popup?.id === 'popup-seleccion-dinosaurios') return;
        if (popup?.id === 'popup-seleccion-dado') return;
        Utils.togglePopup(popup, false);
      });
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.popup-overlay:not(.hidden)').forEach(popup => {
          if (popup.id === 'popup-descarte' && estadoJuego.yaColocoEnTurno && !estadoJuego.yaDescarto) return;
          if (popup.id === 'popup-seleccion-dinosaurios') return;
          if (popup.id === 'popup-seleccion-dado') return;
          Utils.togglePopup(popup, false);
        });
      }
    });
  }
};

// ============================================================================
// SISTEMA DE MAPAS (TRANSVERSAL - Común a ambos modos)
// ============================================================================

/**
 * SISTEMA DE MAPAS - DRAFTOSAURUS DIGITAL
 * 
 * Maneja la visualización del mapa del oponente que es transversal a ambos modos:
 * - Renderizado del mini tablero del oponente
 * - Cálculo de puntuación del oponente
 * - Visualización de dinosaurios colocados
 * 
 * Ambos modos comparten la misma funcionalidad de mapas
 */
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

// ============================================================================
// MODO SEGUIMIENTO (ESPECÍFICO - Solo para modo seguimiento)
// ============================================================================

/**
 * MODO SEGUIMIENTO - DRAFTOSAURUS DIGITAL
 * 
 * Maneja específicamente el modo seguimiento para seguir partidas físicas reales:
 * - Selección manual de dinosaurios por el usuario
 * - Selección manual del resultado del dado
 * - Validación de selecciones del usuario
 * - Gestión de turnos en modo seguimiento
 * 
 * Esta funcionalidad es específica del modo seguimiento y no se usa en modo digital completo
 */
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

  async _confirmarSeleccionDinosaurios() {
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

    // ============================================================================
    // ENVIAR BOLSA AL BACKEND EN MODO SEGUIMIENTO
    // Solo enviar en turnos específicos:
    // - Turno 1 de cada ronda: El primer jugador envía su bolsa
    // - Turno 2 de cada ronda: El segundo jugador envía su bolsa
    // No importa el jugadorNum porque puede estar intercambiado por las rondas
    // ============================================================================
    const debeEnviarBolsa = estadoJuego.modoSeguimiento && 
                            (estadoJuego.turnoEnRonda === 1 || estadoJuego.turnoEnRonda === 2);

    if (debeEnviarBolsa && window.app?.partidaInfo?.id) {
      try {
        const jugadorId = jugadorNum === 1 ? 
          (window.app?.jugador1Info?.id) : 
          (window.app?.jugador2Info?.id);

        const endpoint = window.app?.getEndpoint('crearBolsa') || 'http://127.0.0.1:8000/crearBolsaSeguimiento';
        
        console.log('Enviando bolsa al backend:', {
          turnoEnRonda: estadoJuego.turnoEnRonda,
          jugadorNum,
          jugadorId,
          dinosaurios
        });
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partida_id: window.app.partidaInfo.id,
            jugador_id: jugadorId,
            dinos: dinosaurios
          })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.error('Error al crear bolsa en backend:', result);
          window.app?.showToast?.('Error al guardar bolsa en el servidor', 'error');
          return;
        }

        console.log('Bolsa creada en backend:', result);
      } catch (error) {
        console.error('Error al enviar bolsa al backend:', error);
        window.app?.showToast?.('Error de conexión con el servidor', 'error');
        return;
      }
    }

    estadoJuego.getJugadorActual().dinosauriosDisponibles = [...dinosaurios];
    Utils.togglePopup(document.getElementById('popup-seleccion-dinosaurios'), false);
    this._resetearContadores();

    RenderManager.actualizarDinosauriosDisponibles();
    JuegoManager.actualizarInterfaz();

    // En modo seguimiento, ir directo a la pantalla de juego sin animación del dado
    if (estadoJuego.modoSeguimiento) {
      window.app?.showScreen?.('partida');
      RenderManager.actualizarDinosauriosDisponibles();
      JuegoManager.actualizarInterfaz();
      JuegoManager.actualizarBotonSiguiente();
      RenderManager.renderizarTablero();
      setTimeout(() => DragDropManager.init(), 100);
      // NO mostrar popup del dado aquí, se mostrará después de colocar y descartar
    } else if (estadoJuego.necesitaRestriccion()) {
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

  _mostrarPopupRestriccionDado(callback) {
    // Mostrar un popup informativo con la restricción del dado que salió
    const restriccion = CONFIG.RESTRICCIONES_DADO[estadoJuego.dadoNumero];
    if (!restriccion) {
      // Si no hay restricción, llamar al callback directamente
      if (callback) callback();
      return;
    }

    // Crear popup temporal para mostrar la restricción
    const mensaje = `🎲 Restricción del dado: ${restriccion.titulo}`;
    mostrarAlertaJuego(mensaje, 'info', 3000);

    // Después de mostrar la alerta, ejecutar el callback
    setTimeout(() => {
      if (callback) callback();
    }, 3000);
  },

  async _seleccionarCaraDado(cara) {
    document.querySelectorAll('.cara-dado-opcion').forEach(c => c.classList.remove('seleccionada'));
    cara.classList.add('seleccionada');

    const caraSeleccionada = parseInt(cara.dataset.cara);
    estadoJuego.dadoNumero = caraSeleccionada;

    // ============================================================================
    // EN MODO SEGUIMIENTO: NO ENVIAR EL TURNO AQUÍ
    // El turno se enviará cuando el usuario presione "Tirar dado"
    // Solo guardamos el valor del dado y habilitamos el botón
    // ============================================================================
    if (estadoJuego.modoSeguimiento) {
      // Cerrar el popup del dado
      const popup = document.getElementById('popup-seleccion-dado');
      popup.classList.remove('obligatorio');
      Utils.togglePopup(popup, false);
      
      // Procesar el dado para actualizar las restricciones visuales
      this._procesarDadoSeleccionado(caraSeleccionada);
      
      // Marcar que ya no puede seguir jugando (los flags previenen nuevas acciones)
      estadoJuego.yaColocoEnTurno = true;
      estadoJuego.yaDescarto = true;
      estadoJuego.puedePasarTurno = true;
      
      // Actualizar el botón según el estado (esto evaluará si debe decir "Enviar turno" o "Finalizar ronda")
      JuegoManager.actualizarBotonSiguiente();
      
      const btn = document.getElementById('btn-siguiente-turno');
      console.log('Flags configurados:', {
        yaColocoEnTurno: estadoJuego.yaColocoEnTurno,
        yaDescarto: estadoJuego.yaDescarto,
        dadoNumero: estadoJuego.dadoNumero,
        turnoEnRonda: estadoJuego.turnoEnRonda,
        rondaActual: estadoJuego.rondaActual,
        'btn.textContent': btn?.textContent,
        'btn.disabled': btn?.disabled
      });
      
      return; // No continuar con la lógica del modo digital
    }

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

    // En modo seguimiento, NO resetear los flags ni deshabilitar el botón
    if (estadoJuego.modoSeguimiento) {
      return;
    }

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

// ============================================================================
// GESTOR PRINCIPAL DEL JUEGO (TRANSVERSAL - Común a ambos modos)
// ============================================================================

/**
 * GESTOR PRINCIPAL DEL JUEGO - DRAFTOSAURUS DIGITAL
 * 
 * Coordina todas las operaciones del juego que son transversales a ambos modos:
 * - Inicialización de partidas
 * - Procesamiento de turnos
 * - Manejo de rondas
 * - Cálculo de puntajes
 * - Gestión de interfaz
 * 
 * Este gestor funciona tanto para modo digital completo como para modo seguimiento
 */
const JuegoManager = {
  dinoSeleccionadoDescarte: null, tipoSeleccionadoDescarte: null,

  inicializarPartida(jugadores, jugador2Info, primerJugador, modoSeguimiento = false) {
    estadoJuego.reset();

    // Actualizar partidaId desde localStorage si está disponible
    const datos = localStorage.getItem('datosJuego');
    if (datos) {
      const parsed = JSON.parse(datos);
      if (parsed?.partida?.id) {
        estadoJuego.partidaId = parsed.partida.id;
      }
    }

    Object.assign(estadoJuego, {
      modoSeguimiento,
      primerJugador, primerJugadorOriginal: primerJugador, jugadorActual: primerJugador,
      turnosCompletadosJ1: 0, turnosCompletadosJ2: 0, descartadosJ1: [], descartadosJ2: []
    });

    estadoJuego.jugador1.nombre = jugadores[0] || 'Jugador 1';
    estadoJuego.jugador2.nombre = jugadores[1] || 'Jugador 2';

    if (window.app) window.app.jugador2Info = jugador2Info;

    if (modoSeguimiento) {
      estadoJuego.turnoEnRonda = 1;
      estadoJuego.rondaActual = 1;
    } else {
      this._generarPoolDinosaurios();
      this._iniciarRonda();
      // La pantalla se muestra desde app.js, no aquí
    }
  },

  _generarPoolDinosaurios() {
    estadoJuego.repartosDisponibles = Utils.mezclarArray(
      CONFIG.TIPOS_DINOSAURIOS.flatMap(tipo => Array(CONFIG.MAX_DINOSAURIOS_POOL).fill(tipo))
    );
  },

  _iniciarRonda() {
    // Evitar doble inicialización de la misma ronda
    if (estadoJuego.ultimaRondaInicializada === estadoJuego.rondaActual) {
      return;
    }
    estadoJuego.ultimaRondaInicializada = estadoJuego.rondaActual;
    
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
    // Verificar si hay bolsas del backend disponibles
    if (window.app?.partidaInfo?.bolsas) {
      
      // Verificar que las bolsas sean arrays válidos
      const bolsaJugador1 = window.app.partidaInfo.bolsas.jugador1;
      const bolsaJugador2 = window.app.partidaInfo.bolsas.jugador2;
      
      if (Array.isArray(bolsaJugador1) && Array.isArray(bolsaJugador2)) {
        console.log('DEBUG _repartirDinosaurios - bolsas recibidas del backend:', {
          bolsaJugador1,
          bolsaJugador2,
          'jugador1Info.id': window.app?.jugador1Info?.id,
          'partidaInfo.jugador1_id': window.app?.partidaInfo?.jugador1_id
        });
        
        // IMPORTANTE: Mapear bolsas basándose en quién REALMENTE está en cada posición de la ronda actual
        // estadoJuego.jugador1 = quien comienza esta ronda (primerJugador)
        // estadoJuego.jugador2 = el otro jugador
        
        // En rondas impares: jugador1 (frontend) = jugador que empezó la partida
        // En rondas pares: jugador1 (frontend) = el otro jugador
        
        // Determinar el ID real del jugador que está en la posición jugador1 del frontend
        const idRealJugador1Frontend = estadoJuego.primerJugador === 1 ? 
          (window.app?.jugador1Info?.id || 1) : 
          (window.app?.jugador2Info?.id || 2);
        
        const idRealJugador2Frontend = estadoJuego.primerJugador === 1 ? 
          (window.app?.jugador2Info?.id || 2) : 
          (window.app?.jugador1Info?.id || 1);
        
        // Asignar bolsas según los IDs reales
        if (idRealJugador1Frontend === window.app?.partidaInfo?.jugador1_id) {
          estadoJuego.jugador1.dinosauriosDisponibles = [...bolsaJugador1];
          estadoJuego.jugador2.dinosauriosDisponibles = [...bolsaJugador2];
        } else {
          estadoJuego.jugador1.dinosauriosDisponibles = [...bolsaJugador2];
          estadoJuego.jugador2.dinosauriosDisponibles = [...bolsaJugador1];
        }
        
        // Actualizar la interfaz visual con las nuevas bolsas
        RenderManager.actualizarDinosauriosDisponibles();
        
      } else {
        console.warn('Las bolsas del backend no son arrays válidos, generando dinosaurios aleatorios');
        // Continuar con la lógica de generación aleatoria
        this._generarDinosauriosAleatorios();
      }
    } else {
      this._generarDinosauriosAleatorios();
    }
  },

  _generarDinosauriosAleatorios() {
    // Lógica original para generar dinosaurios aleatorios
    const dinosauriosNecesarios = CONFIG.DINOSAURIOS_POR_RONDA * 2; // 6 por cada jugador
    if (estadoJuego.repartosDisponibles.length < dinosauriosNecesarios) {
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
  },

  _configurarTurnoInicial() {
    Object.assign(estadoJuego, { puedePasarTurno: false, yaColocoEnTurno: false });

    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) btn.disabled = true;

    // Solo establecer sin restricción si es el primer turno absoluto (ronda 1, turno 1)
    // y no hay una restricción activa del dado
    if (estadoJuego.esPrimerTurnoAbsoluto() && !estadoJuego.restriccionActual) {
      this.establecerSinRestriccion();
    }
    // No ocultar restricción automáticamente - dejar que se mantenga si ya está activa

    RenderManager.actualizarDinosauriosDisponibles();
    this.actualizarInterfaz();
    RenderManager.renderizarTablero();
    this.actualizarBotonSiguiente();
  },

  // FASE 4: Procesa turno enviando datos al backend en lugar de generar dados localmente
  async procesarSiguienteTurno() {
    const btn = document.getElementById('btn-siguiente-turno');
    
    // Si el botón dice "Tirar dado", significa que es el siguiente turno
    // Procesar el turno según el estado del botón
    
    const jugadorActual = estadoJuego.getJugadorActual();
    const tienenDinosaurios = jugadorActual.dinosauriosDisponibles.length > 0;

    // Verificar que colocación y descarte estén completos
    if (!estadoJuego.yaColocoEnTurno) {
      window.app?.showToast?.('Debes colocar un dinosaurio primero', 'warning');
      return;
    }

    if (!estadoJuego.yaDescarto && tienenDinosaurios) {
      window.app?.showToast?.('Debes descartar un dinosaurio primero', 'warning');
      return;
    }

    // No hacer return aquí - permitir que el flujo continúe al backend
    // El backend se encargará de calcular puntajes y cambiar de ronda

    // FASE 4: Enviar datos al backend en lugar de cambiar turno localmente
    if (window.app?.showScreen) {
      this.limpiarIndicadoresTurno();

      // Mostrar animación de dado mientras se envía al backend (solo si no es finalizar ronda ni partida)
      if (btn.textContent !== 'Finalizar ronda' && btn.textContent !== 'Finalizar partida') {
        window.app.showScreen('dado-animacion');
        setTimeout(() => window.app.iniciarAnimacionDado(), 400);
      }

      // Determinar qué endpoint usar según el estado del botón
      let backendResponse;
      if (btn.textContent === 'Finalizar ronda') {
        // En modo seguimiento, usar endpoint específico
        if (estadoJuego.modoSeguimiento) {
          backendResponse = await JuegoManager.enviarFinalizarRondaSeguimientoAlBackend();
        } else {
          backendResponse = await JuegoManager.enviarFinalizarRondaAlBackend();
        }
        // Procesar fin de ronda usando la lógica original del frontend
        if (backendResponse && backendResponse.success) {
          // En modo seguimiento, NO hay bolsas en la respuesta (se crean manualmente)
          // En modo digital, sí hay bolsas que deben guardarse
          if (!estadoJuego.modoSeguimiento && backendResponse.bolsa_jugador1 && backendResponse.bolsa_jugador2) {
            if (window.app?.partidaInfo) {
              // IMPORTANTE: Crear un objeto NUEVO para que las referencias no se compartan
              window.app.partidaInfo.bolsas = {
                jugador1: [...backendResponse.bolsa_jugador1],
                jugador2: [...backendResponse.bolsa_jugador2]
              };
              console.log('DEBUG - Bolsas guardadas en partidaInfo:', window.app.partidaInfo.bolsas);
            }
          }
          
          // En modo seguimiento, resetear las bolsas para que se creen manualmente en la siguiente ronda
          if (estadoJuego.modoSeguimiento) {
            estadoJuego.dinosauriosRondaJ1 = [];
            estadoJuego.dinosauriosRondaJ2 = [];
            console.log('DEBUG - Bolsas reseteadas para modo seguimiento');
          }
          
          // Actualizar ronda y turno desde el backend
          if (backendResponse.ronda !== undefined) {
            estadoJuego.rondaActual = backendResponse.ronda;
          }
          if (backendResponse.turno !== undefined) {
            estadoJuego.turnoEnRonda = backendResponse.turno;
          }
          
          // Actualizar puntos desde el backend
          const esJugador1Frontend = (window.app?.jugador1Info?.id || 1) === (window.app?.partidaInfo?.jugador1_id || 1);
          if (backendResponse.puntaje_jugador1 !== undefined) {
            if (esJugador1Frontend) {
              estadoJuego.jugador1.puntos = backendResponse.puntaje_jugador1;
            } else {
              estadoJuego.jugador2.puntos = backendResponse.puntaje_jugador1;
            }
          }
          if (backendResponse.puntaje_jugador2 !== undefined) {
            if (esJugador1Frontend) {
              estadoJuego.jugador2.puntos = backendResponse.puntaje_jugador2;
            } else {
              estadoJuego.jugador1.puntos = backendResponse.puntaje_jugador2;
            }
          }
          
          // Llamar a la función original de finalizar ronda para mostrar resumen
          // Pasar los puntajes del backend
          const puntajesBackend = {
            jugador1: backendResponse.puntaje_jugador1,
            jugador2: backendResponse.puntaje_jugador2
          };
          this._finalizarRonda(puntajesBackend);
        } else {
          // Error: volver a pantalla de partida
          window.app.showScreen('partida');
          mostrarAlertaJuego('Error al procesar fin de ronda. Intenta nuevamente.', 'error', 3000);
        }
      } else if (btn.textContent === 'Finalizar partida') {
        backendResponse = await JuegoManager.enviarFinalizarPartidaAlBackend();
        if (backendResponse && backendResponse.success) {
          // Procesar fin de partida - mostrar pantalla final con puntajes del backend
          const puntajesBackend = {
            puntajes: {
              jugador1: backendResponse.puntaje_jugador1,
              jugador2: backendResponse.puntaje_jugador2
            }
          };
          this._mostrarPantallaFinal(puntajesBackend);
        } else {
          // Error: volver a pantalla de partida
          window.app.showScreen('partida');
          mostrarAlertaJuego('Error al procesar fin de partida. Intenta nuevamente.', 'error', 3000);
        }
      } else {
        backendResponse = await enviarTurnoAlBackend();
        
        if (backendResponse) {
          // Procesar respuesta del backend
          this.procesarRespuestaBackend(backendResponse);
        } else {
          // Error: volver a pantalla de partida
          window.app.showScreen('partida');
          mostrarAlertaJuego('Error al procesar turno. Intenta nuevamente.', 'error', 3000);
        }
      }
    } else {
      // Fallback para modo sin app
      const backendResponse = await enviarTurnoAlBackend();
      if (backendResponse) {
        this.procesarRespuestaBackend(backendResponse);
      }
    }
  },

  // Función para enviar finalizar ronda al backend con datos válidos del localStorage
  async enviarFinalizarRondaAlBackend() {
    if (estadoJuego.sincronizandoConBackend) {
      return null;
    }

    estadoJuego.sincronizandoConBackend = true;

    // Deshabilitar botón durante request
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) btn.disabled = true;

    try {
      // Obtener datos del localStorage
      const datosJuego = JSON.parse(localStorage.getItem('datosJuego') || '{}');
      
      // Usar datos reales del último turno para finalizar la ronda
      const requestData = {
        partida_id: estadoJuego.partidaId,
        jugador_id: estadoJuego.jugadorActual === 1 ? 
          (window.app?.jugador1Info?.id || 1) : 
          (window.app?.jugador2Info?.id || 2),
        recinto: estadoJuego.recintoColocadoEnTurno || 'woody-trio',
        tipoDino: estadoJuego.dinosaurioColocadoEnTurno || 'stegosaurus',
        tipoDinoDescarte: estadoJuego.dinosaurioDescartadoEnTurno || 'stegosaurus'
      };

      const endpoint = window.app?.getEndpoint('finalizarRonda') || 'http://127.0.0.1:8000/finalizarRonda';
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });

        const result = await response.json();

        // Verificar status HTTP
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // VALIDACIÓN ROBUSTA DE RESPUESTA
        if (!result || typeof result !== 'object') {
          throw new Error('Respuesta inválida del servidor');
        }

        if (!result.success) {
          const mensajes = {
            'invalid': 'Movimiento inválido',
            'duplicate': 'Acción ya realizada',
            'error': 'Error interno del servidor'
          };

          const mensaje = mensajes[result.code] || result.message || 'Error desconocido';
          mostrarAlertaJuego(mensaje, 'error', 4000);
          return null;
        }

        // VALIDAR CAMPOS REQUERIDOS EN RESPUESTA
        if (!result.turno || !result.ronda) {
          mostrarAlertaJuego('Respuesta incompleta del servidor', 'warning', 3000);
        }

        estadoJuego.sincronizandoConBackend = false;
        return result;

      } catch (fetchError) {
        console.error('DEBUG - Error en fetch:', fetchError);
        throw fetchError;
      }

    } catch (error) {
      // Diferentes tipos de errores
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        mostrarAlertaJuego('Error de conexión - Verifica tu internet', 'error', 5000);
      } else if (error.message.includes('HTTP')) {
        mostrarAlertaJuego('Error del servidor - Intenta nuevamente', 'error', 4000);
      } else {
        mostrarAlertaJuego('Error inesperado - Contacta soporte', 'error', 5000);
      }

      estadoJuego.sincronizandoConBackend = false;
      return null;

    } finally {
      // Siempre rehabilitar botón
      if (btn) {
        btn.disabled = false;
        JuegoManager.actualizarBotonSiguiente();
      }
    }
  },

  // Función para enviar finalizar ronda en modo seguimiento al backend
  async enviarFinalizarRondaSeguimientoAlBackend() {
    if (estadoJuego.sincronizandoConBackend) {
      return null;
    }

    estadoJuego.sincronizandoConBackend = true;

    // Deshabilitar botón durante request
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) btn.disabled = true;

    try {
      // En modo seguimiento, enviar los datos del último turno (turno 5)
      const requestData = {
        partida_id: estadoJuego.partidaId,
        jugador_id: estadoJuego.jugadorActual === 1 ? 
          (window.app?.jugador1Info?.id || 1) : 
          (window.app?.jugador2Info?.id || 2),
        recinto: estadoJuego.recintoColocadoEnTurno,
        tipoDino: estadoJuego.dinosaurioColocadoEnTurno,
        tipoDinoDescarte: estadoJuego.dinosaurioDescartadoEnTurno
        // NO enviar caraDado - el backend lo lee de la BD
      };

      console.log('Enviando finalizar ronda seguimiento al backend:', requestData);

      const endpoint = window.app?.getEndpoint('finalizarRondaSeguimiento') || 'http://127.0.0.1:8000/finalizarRondaSeguimiento';
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });

        const result = await response.json();
        console.log('Respuesta de finalizar ronda seguimiento:', result);

        // Verificar status HTTP
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // VALIDACIÓN ROBUSTA DE RESPUESTA
        if (!result || typeof result !== 'object') {
          throw new Error('Respuesta inválida del servidor');
        }

        if (!result.success) {
          const mensaje = result.message || 'Error desconocido';
          mostrarAlertaJuego(mensaje, 'error', 4000);
          return null;
        }

        estadoJuego.sincronizandoConBackend = false;
        return result;

      } catch (fetchError) {
        console.error('DEBUG - Error en fetch finalizar ronda seguimiento:', fetchError);
        throw fetchError;
      }

    } catch (error) {
      // Diferentes tipos de errores
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        mostrarAlertaJuego('Error de conexión - Verifica tu internet', 'error', 5000);
      } else if (error.message.includes('HTTP')) {
        mostrarAlertaJuego('Error del servidor - Intenta nuevamente', 'error', 4000);
      } else {
        mostrarAlertaJuego('Error inesperado - Contacta soporte', 'error', 5000);
      }

      estadoJuego.sincronizandoConBackend = false;
      return null;

    } finally {
      // Siempre rehabilitar botón
      if (btn) {
        btn.disabled = false;
        JuegoManager.actualizarBotonSiguiente();
      }
    }
  },

  // Función para enviar finalizar partida al backend con datos válidos del localStorage
  async enviarFinalizarPartidaAlBackend() {
    if (estadoJuego.sincronizandoConBackend) {
      return null;
    }

    estadoJuego.sincronizandoConBackend = true;

    // Deshabilitar botón durante request
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) btn.disabled = true;

    try {
      // Obtener datos del localStorage
      const datosJuego = JSON.parse(localStorage.getItem('datosJuego') || '{}');
      
      // Usar datos reales del último turno para finalizar la partida
      const requestData = {
        partida_id: estadoJuego.partidaId,
        jugador_id: estadoJuego.jugadorActual === 1 ? 
          (window.app?.jugador1Info?.id || 1) : 
          (window.app?.jugador2Info?.id || 2),
        recinto: estadoJuego.recintoColocadoEnTurno || 'woody-trio',
        tipoDino: estadoJuego.dinosaurioColocadoEnTurno || 'stegosaurus',
        tipoDinoDescarte: estadoJuego.dinosaurioDescartadoEnTurno || 'stegosaurus'
      };

      const endpoint = window.app?.getEndpoint('finalizarPartida') || 'http://127.0.0.1:8000/finalizarPartida';
      
      console.log('Enviando finalizar partida al backend:', requestData);
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Respuesta del backend (finalizar partida):', result);

        // Verificar status HTTP
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // VALIDACIÓN ROBUSTA DE RESPUESTA
        if (!result || typeof result !== 'object') {
          throw new Error('Respuesta inválida del servidor');
        }

        if (!result.success) {
          const mensajes = {
            'invalid': 'Movimiento inválido',
            'duplicate': 'Acción ya realizada',
            'error': 'Error interno del servidor'
          };

          const mensaje = mensajes[result.code] || result.message || 'Error desconocido';
          mostrarAlertaJuego(mensaje, 'error', 4000);
          return null;
        }

        estadoJuego.sincronizandoConBackend = false;
        return result;

      } catch (fetchError) {
        console.error('DEBUG - Error en fetch:', fetchError);
        throw fetchError;
      }

    } catch (error) {
      // Diferentes tipos de errores
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        mostrarAlertaJuego('Error de conexión - Verifica tu internet', 'error', 5000);
      } else if (error.message.includes('HTTP')) {
        mostrarAlertaJuego('Error del servidor - Intenta nuevamente', 'error', 4000);
      } else {
        mostrarAlertaJuego('Error inesperado - Contacta soporte', 'error', 5000);
      }

      estadoJuego.sincronizandoConBackend = false;
      return null;

    } finally {
      // Siempre rehabilitar botón
      if (btn) {
        btn.disabled = false;
        JuegoManager.actualizarBotonSiguiente();
      }
    }
  },

  // FASE 7: Procesa respuesta del backend con validaciones adicionales
  procesarRespuestaBackend(backendResponse) {
    // VALIDACIÓN ADICIONAL
    if (!backendResponse) {
      mostrarAlertaJuego('Error procesando respuesta del servidor', 'error', 3000);
      return;
    }


    try {
      // Sincronizar estado con backend PRIMERO
      sincronizarConBackend(backendResponse);

      console.log('DEBUG - Estado después de sincronizar:', {
        modoSeguimiento: estadoJuego.modoSeguimiento,
        turnoEnRonda: estadoJuego.turnoEnRonda,
        jugadorActual: estadoJuego.jugadorActual,
        esFinDeRonda: estadoJuego.esFinDeRonda()
      });

      // Cambiar turno localmente después de sincronizar (solo si no es fin de ronda)
      if (!estadoJuego.esFinDeRonda()) {
        estadoJuego.cambiarTurno();
        // Actualizar interfaz después de cambiar turno para reflejar los avatares correctos
        this.actualizarInterfaz();
        
        console.log('DEBUG - Después de cambiar turno:', {
          modoSeguimiento: estadoJuego.modoSeguimiento,
          turnoEnRonda: estadoJuego.turnoEnRonda,
          rondaActual: estadoJuego.rondaActual,
          jugadorActual: estadoJuego.jugadorActual
        });
      }

      // En modo seguimiento, verificar si el jugador actual necesita crear su bolsa
      // Esto ocurre en los turnos 1 y 2 de cada ronda (los primeros 2 turnos)
      if (estadoJuego.modoSeguimiento && 
          (estadoJuego.turnoEnRonda === 1 || estadoJuego.turnoEnRonda === 2) && 
          !estadoJuego.esFinDeRonda()) {
        
        const jugadorNum = estadoJuego.jugadorActual;
        
        // Verificar si este jugador ya creó su bolsa en esta ronda
        const yaCreoBolsa = (jugadorNum === 1 && estadoJuego.dinosauriosRondaJ1.length > 0) ||
                            (jugadorNum === 2 && estadoJuego.dinosauriosRondaJ2.length > 0);
        
        console.log('DEBUG - Verificando bolsa:', {
          turnoEnRonda: estadoJuego.turnoEnRonda,
          jugadorNum,
          yaCreoBolsa,
          dinosauriosRondaJ1: estadoJuego.dinosauriosRondaJ1.length,
          dinosauriosRondaJ2: estadoJuego.dinosauriosRondaJ2.length,
          caraDado: backendResponse.caraDado
        });
        
        // Si no tiene bolsa, primero mostrar restricción del dado (si existe) y luego popup de creación
        if (!yaCreoBolsa) {
          // Procesar dado del backend PRIMERO si existe
          if (backendResponse.caraDado) {
            const numeroDado = this.mapearCaraDadoBackend(backendResponse.caraDado);
            console.log(`Mostrando restricción del dado antes de crear bolsa: "${backendResponse.caraDado}" -> número: ${numeroDado}`);
            
            // Guardar el dado en estadoJuego
            estadoJuego.dadoNumero = numeroDado;
            const restriccion = CONFIG.RESTRICCIONES_DADO[numeroDado || 1];
            if (restriccion) {
              this.establecerRestriccion(restriccion.tipo, restriccion.titulo);
            }
            
            // Actualizar el dado en app.js para la animación
            if (window.app?.actualizarDadoDesdeBackend) {
              window.app.actualizarDadoDesdeBackend(backendResponse.caraDado);
            }
            
            // Mostrar popup de restricción del dado PRIMERO
            setTimeout(() => {
              ModoSeguimiento._mostrarPopupRestriccionDado(() => {
                // Después de cerrar el popup de restricción, mostrar el de selección de dinos
                console.log(`Mostrando popup de selección de dinosaurios para jugador ${jugadorNum} (turno ${estadoJuego.turnoEnRonda})`);
                setTimeout(() => {
                  ModoSeguimiento.mostrarPopupSeleccionDinosaurios();
                }, 200);
              });
            }, 300);
          } else {
            // Si no hay dado, ir directo al popup de selección de dinosaurios
            console.log(`Mostrando popup de selección de dinosaurios para jugador ${jugadorNum} (turno ${estadoJuego.turnoEnRonda})`);
            setTimeout(() => {
              ModoSeguimiento.mostrarPopupSeleccionDinosaurios();
            }, 500);
          }
          return; // No continuar procesando hasta que el jugador ingrese sus dinosaurios
        }
      }

      // Procesar dado del backend DESPUÉS de cambiar turno (solo si no se procesó arriba)
      if (backendResponse.caraDado) {
        // El backend devuelve nombres de caras, necesitamos mapearlos a números
        const numeroDado = this.mapearCaraDadoBackend(backendResponse.caraDado);
        console.log(`Cara del dado del backend: "${backendResponse.caraDado}" -> número: ${numeroDado}`);
        
        // Procesar el dado automáticamente ya que viene del backend
        this.procesarResultadoDado(numeroDado);
        
        // Actualizar el dado en app.js para la animación
        if (window.app?.actualizarDadoDesdeBackend) {
          window.app.actualizarDadoDesdeBackend(backendResponse.caraDado);
        }
      } else {
        // Si no hay caraDado (null), limpiar restricción
        estadoJuego.restriccionActual = null;
        estadoJuego.dadoNumero = null;
        estadoJuego.tituloRestriccion = null;
      }

      // Mostrar pantalla de partida
      const partida = document.getElementById('pantalla-partida');
      if (partida) partida.classList.add('pantalla-partida-visible');

      RenderManager.actualizarDinosauriosDisponibles();
      RenderManager.renderizarTablero();


    } catch (error) {
      console.error('Error procesando respuesta del backend:', error);
      mostrarAlertaJuego('Error procesando datos del servidor', 'error', 3000);
    }
  },


  // FASE 5: Procesa cara del dado que viene del backend (como string "1"-"6")
  procesarResultadoDado(numeroDado) {
    estadoJuego.dadoNumero = numeroDado;
    const restriccion = CONFIG.RESTRICCIONES_DADO[numeroDado || 1];
    if (restriccion) {
      this.establecerRestriccion(restriccion.tipo, restriccion.titulo);
    }

    const partida = document.getElementById('pantalla-partida');
    if (partida) partida.classList.add('pantalla-partida-visible');
    
    // Deshabilitar botón siguiente hasta que el usuario confirme que vio la restricción
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Tirar dado';
    }

    RenderManager.actualizarDinosauriosDisponibles();
    // No actualizar interfaz aquí para mantener el estado de restricción
    RenderManager.renderizarTablero();
    // No actualizar botón aquí para mantener el estado de restricción
  },

  // Mapea nombres de caras del backend a números del frontend
  mapearCaraDadoBackend(caraNombre) {
    const mapeo = {
      'bosque': 5,        // Bosque
      'roca': 6,          // Rocas / Pradera  
      'baño': 4,          // Lado Baños
      'cafeteria': 3,     // Lado Cafetería
      'no-trex': 2,       // No T-Rex
      'vacio': 1          // Huella (libre)
    };
    
    return mapeo[caraNombre] || 1; // Default a huella libre si no se encuentra
  },

  // Mapea números del frontend de vuelta a nombres de caras del backend
  obtenerCaraDadoDesdeNumero(numero) {
    const mapeo = {
      1: 'vacio',         // Huella Libre
      2: 'no-trex',       // No T-Rex
      3: 'cafeteria',     // Lado Cafetería
      4: 'baño',          // Lado Baños
      5: 'bosque',        // Bosque
      6: 'roca'           // Rocas / Pradera
    };
    
    return mapeo[numero] || 'vacio'; // Default a huella libre si no se encuentra
  },

  establecerRestriccion(tipo, titulo) {
    estadoJuego.restriccionActual = tipo;
    estadoJuego.dadoNumero = estadoJuego.dadoNumero || 1;

    const info = document.querySelector('.info-restriccion');
    const icono = document.querySelector('.icono-restriccion-footer');
    const texto = document.querySelector('.texto-restriccion');

    
    if (info) {
      info.classList.remove('restriccion-oculta');
      info.classList.add('restriccion-visible');
    }
    if (icono && tipo) {
      const restriccion = Object.values(CONFIG.RESTRICCIONES_DADO).find(r => r.tipo === tipo);
      if (restriccion) {
        icono.src = `img/${restriccion.imagen}.png`;
        icono.classList.remove('icono-restriccion-ocultar');
        icono.classList.add('icono-restriccion-mostrar');
      }
    }

    if (texto) {
      const restriccionConfig = Object.values(CONFIG.RESTRICCIONES_DADO).find(r => r.tipo === tipo);
      let mensaje = `<div>Restricción Actual</div><div>${titulo}</div>`;

      // Casos especiales que se calculan dinámicamente
      if (estadoJuego.restriccionActual === 'no-t-rex') {
        mensaje += `<div class="texto-restriccion-bloqueados">Bloquea recintos con T-Rex</div>`;
      } else if (estadoJuego.restriccionActual === 'huella-libre') {
        mensaje += `<div class="texto-restriccion-bloqueados">Solo recintos vacíos</div>`;
      } else if (restriccionConfig && restriccionConfig.recintosBloqueados.length > 0) {
        mensaje += `<div class="texto-restriccion-bloqueados">Recintos bloqueados: ${restriccionConfig.recintosBloqueados.length}</div>`;
      } else {
        mensaje += `<div class="texto-sin-restriccion">Todos los recintos disponibles</div>`;
      }

      texto.innerHTML = mensaje;
    }
  },

  establecerSinRestriccion() {
    // Limpiar restricción del estado
    estadoJuego.restriccionActual = null;
    estadoJuego.dadoNumero = null;

    const info = document.querySelector('.info-restriccion');
    const texto = document.querySelector('.texto-restriccion');
    const icono = document.querySelector('.icono-restriccion-footer');

    if (info) {
      info.classList.remove('restriccion-oculta');
      info.classList.add('restriccion-visible');
    }
    if (texto) {
      texto.innerHTML = `<div>Sin restricción</div><div class="texto-sin-restriccion">Todos los recintos disponibles</div>`;
    }
    if (icono) {
      icono.classList.remove('icono-restriccion-mostrar');
      icono.classList.add('icono-restriccion-ocultar');
    }
  },

  _ocultarRestriccion() {
    // Solo ocultar si no hay una restricción activa del dado
    if (!estadoJuego.restriccionActual) {
      estadoJuego.restriccionActual = null;
      const info = document.querySelector('.info-restriccion');
      const icono = document.querySelector('.icono-restriccion-footer');

      if (info) {
        info.classList.add('restriccion-oculta');
        info.classList.remove('restriccion-visible');
      }
      if (icono) {
        icono.classList.remove('icono-restriccion-mostrar');
        icono.classList.add('icono-restriccion-ocultar');
      }
    }
  },

  // FASE 3: Muestra popup de descarte y actualiza estado del botón inmediatamente
  mostrarPopupDescarte() {
    const jugador = estadoJuego.getJugadorActual();

    if (jugador.dinosauriosDisponibles.length === 0) {
      estadoJuego.puedePasarTurno = true;
      estadoJuego.yaDescarto = true; // FASE 3: Marcar como descartado si no hay dinosaurios
      this.actualizarBotonSiguiente();
      return;
    }

    const popup = document.getElementById('popup-descarte');
    const contenedor = document.getElementById('dinosaurios-descarte');

    if (!popup || !contenedor) return;

    contenedor.innerHTML = '';
    this.dinoSeleccionadoDescarte = null;
    this.tipoSeleccionadoDescarte = null;

    jugador.dinosauriosDisponibles.forEach((tipo, index) => {
      // Verificar que el tipo de dinosaurio esté definido en la configuración
      if (!CONFIG.IMAGENES_DINOSAURIOS[tipo]) {
        return; // Saltar este dinosaurio si no está definido
      }
      
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

    // FASE 3: Actualizar botón inmediatamente al mostrar popup
    this.actualizarBotonSiguiente();
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

  // FASE 2: Solo confirma descarte y habilita botón - NO procesa turno automáticamente como antes
  _confirmarDescarte() {
    if (this.dinoSeleccionadoDescarte === null || !this.tipoSeleccionadoDescarte) return;

    const jugador = estadoJuego.getJugadorActual();

    if (this.dinoSeleccionadoDescarte >= 0 &&
      this.dinoSeleccionadoDescarte < jugador.dinosauriosDisponibles.length) {

      const dinoEliminado = jugador.dinosauriosDisponibles.splice(this.dinoSeleccionadoDescarte, 1)[0];
      estadoJuego.dinosauriosDescartados.push(dinoEliminado);

      // FASE 1: Guardar dinosaurio descartado para backend
      estadoJuego.dinosaurioDescartadoEnTurno = dinoEliminado;
      estadoJuego.yaDescarto = true;

      if (estadoJuego.jugadorActual === 1) {
        estadoJuego.descartadosJ1.push(dinoEliminado);
      } else {
        estadoJuego.descartadosJ2.push(dinoEliminado);
      }
    }

    // FASE 2: Solo cerrar popup y habilitar botón (NO procesar turno automáticamente)
    Utils.togglePopup(document.getElementById('popup-descarte'), false);
    this.dinoSeleccionadoDescarte = null;
    this.tipoSeleccionadoDescarte = null;

    estadoJuego.puedePasarTurno = true;
    this.actualizarBotonSiguiente();
    RenderManager.actualizarDinosauriosDisponibles();
    
    // En modo seguimiento, mostrar popup del dado DESPUÉS de colocar y descartar
    // PERO NO en el turno 6 (último turno de la ronda, no necesita dado)
    if (estadoJuego.modoSeguimiento && 
        estadoJuego.yaColocoEnTurno && 
        estadoJuego.yaDescarto && 
        estadoJuego.turnoEnRonda !== 6) {
      setTimeout(() => ModoSeguimiento._mostrarPopupSeleccionDado(), 200);
    }
  },

  _habilitarBotonSiguiente() {
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      const jugador = estadoJuego.getJugadorActual();
      const sinDinosaurios = jugador.dinosauriosDisponibles.length === 0;

      btn.disabled = !(sinDinosaurios || (estadoJuego.yaColocoEnTurno && estadoJuego.puedePasarTurno));
      this.actualizarBotonSiguiente();
    }
  },

  // FASE 3: Actualiza el texto del botón según el estado actual: "Arrastra dinosaurio", "Descarta dinosaurio", "Tirar dado", "Finalizar ronda", "Finalizar partida"
  actualizarBotonSiguiente() {
    const btn = document.getElementById('btn-siguiente-turno');
    if (!btn) return;


    // Validar que el botón solo tenga textos válidos
    const textosValidos = ['Arrastra un dinosaurio', 'Descarta dinosaurio', 'Tirar dado', 'Enviar turno', 'Finalizar ronda', 'Finalizar partida'];
    if (!textosValidos.includes(btn.textContent)) {
      btn.textContent = 'Arrastra un dinosaurio';
      btn.disabled = true;
    }

    const jugador = estadoJuego.getJugadorActual();
    const sinDinosaurios = jugador.dinosauriosDisponibles.length === 0;

    // FASE 3: ESTADOS DINÁMICOS
    if (!estadoJuego.yaColocoEnTurno) {
      btn.textContent = 'Arrastra un dinosaurio';
      btn.disabled = true;
    } else if (!estadoJuego.yaDescarto) {
      btn.textContent = 'Descarta dinosaurio';
      btn.disabled = true;
    } else {
      // Después de colocar y descartar, verificar primero si es fin de ronda
      const esFinDeRonda = estadoJuego.esFinDeRonda();
      console.log('DEBUG actualizarBotonSiguiente:', {
        esFinDeRonda,
        rondaActual: estadoJuego.rondaActual,
        turnoEnRonda: estadoJuego.turnoEnRonda,
        modoSeguimiento: estadoJuego.modoSeguimiento,
        dadoNumero: estadoJuego.dadoNumero,
        yaColocoEnTurno: estadoJuego.yaColocoEnTurno,
        yaDescarto: estadoJuego.yaDescarto,
        evaluacion: `${estadoJuego.rondaActual} === 4 && ${estadoJuego.turnoEnRonda} >= 6 = ${estadoJuego.rondaActual === 4 && estadoJuego.turnoEnRonda >= 6}`,
        esTurno6: estadoJuego.turnoEnRonda === 6
      });
      
      if (esFinDeRonda) {
        // Es fin de ronda (turno 6 completado o más)
        // Solo finalizar partida si estamos en ronda 4 Y en el turno 6 o más
        if (estadoJuego.rondaActual === 4 && estadoJuego.turnoEnRonda >= 6) {
          btn.textContent = 'Finalizar partida';
          console.log('→ Botón configurado como: Finalizar partida');
        } else {
          btn.textContent = 'Finalizar ronda';
          console.log('→ Botón configurado como: Finalizar ronda (esFinDeRonda)');
        }
        btn.disabled = false;
      } else if (estadoJuego.modoSeguimiento) {
        // En modo seguimiento, el turno 6 es el último turno de la ronda
        // Si es turno 6 y ya colocó/descartó, mostrar "Finalizar ronda" (sin necesidad de dado)
        if (estadoJuego.turnoEnRonda === 6) {
          if (estadoJuego.rondaActual === 4) {
            btn.textContent = 'Finalizar partida';
            console.log('→ Botón configurado como: Finalizar partida (turno 6 - último turno)');
          } else {
            btn.textContent = 'Finalizar ronda';
            console.log('→ Botón configurado como: Finalizar ronda (turno 6 - último turno)');
          }
          btn.disabled = false; // Habilitar inmediatamente después de colocar y descartar
        } else if (estadoJuego.dadoNumero) {
          // Turnos normales en modo seguimiento: si ya seleccionó el dado, habilitar "Enviar turno"
          btn.textContent = 'Enviar turno';
          btn.disabled = false;
          console.log('→ Botón configurado como: Enviar turno');
        } else {
          // Aún no seleccionó el dado
          btn.textContent = 'Enviar turno';
          btn.disabled = true;
          console.log('→ Botón configurado como: Enviar turno (deshabilitado, esperando dado)');
        }
      } else {
        // Turnos normales: tirar dado
        btn.textContent = 'Tirar dado';
        btn.disabled = false;
        console.log('→ Botón configurado como: Tirar dado');
      }
    }
  },

  limpiarIndicadoresTurno() {
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

    // Actualizar nombre del oponente (arriba) - solo nombre, sin puntos
    const nombreOponente = document.querySelector('.nombre-puntos:not(.texto-jugador)');
    if (nombreOponente) {
      nombreOponente.textContent = oponente.nombre.toUpperCase();
    }

    // Actualizar nombre del jugador actual (abajo) - solo nombre, sin puntos
    const nombreJugador = document.querySelector('.texto-jugador');
    if (nombreJugador) {
      nombreJugador.textContent = jugador.nombre.toUpperCase();
    }

    // Actualizar puntos usando los datos del BACKEND (estadoJuego.jugador1.puntos / jugador2.puntos)
    // Estos se actualizan en mapearBackendAEstadoLocal() con puntaje_jugador1 y puntaje_jugador2 del backend
    // Solo mostrar puntos del jugador de abajo (jugador actual)
    const puntosJugador1Elem = document.getElementById('puntos-jugador1');
    const puntosJugador2Elem = document.getElementById('puntos-jugador2');

    if (estadoJuego.jugadorActual === 1) {
      // Jugador 1 está jugando: Jugador 1 abajo (mostrar puntos), Jugador 2 arriba (ocultar puntos)
      if (puntosJugador1Elem) {
        puntosJugador1Elem.textContent = `${parseInt(estadoJuego.jugador1.puntos) || 0} PUNTOS`;
      }
      if (puntosJugador2Elem) {
        puntosJugador2Elem.textContent = ''; // Ocultar puntos del oponente
      }
    } else {
      // Jugador 2 está jugando: Jugador 2 abajo (mostrar puntos), Jugador 1 arriba (ocultar puntos)
      if (puntosJugador1Elem) {
        puntosJugador1Elem.textContent = `${parseInt(estadoJuego.jugador2.puntos) || 0} PUNTOS`;
      }
      if (puntosJugador2Elem) {
        puntosJugador2Elem.textContent = ''; // Ocultar puntos del oponente
      }
    }

    // Si hay una restricción activa, no actualizar el resto de la interfaz para evitar interferencias
    if (estadoJuego.restriccionActual && estadoJuego.restriccionActual !== 'huella-libre') {
      return;
    }

    const infoJugador2 = document.querySelector('.info-jugador2');
    const verMapa = document.querySelector('.ver-mapa');

    // INTERFAZ UNIFICADA: Modo seguimiento y modo normal tienen EXACTAMENTE la misma interfaz
    if (infoJugador2) infoJugador2.classList.add('info-jugador-visible');
    if (verMapa) verMapa.classList.add('ver-mapa-visible');

    // INTERFAZ UNIFICADA: Aplicar indicadores de turno activo SOLO cuando estamos en la pantalla de partida
    const pantallaPartida = document.getElementById('pantalla-partida');
    const esPantallaPartidaVisible = pantallaPartida && !pantallaPartida.classList.contains('hidden');

    const infoJugador = document.querySelector('.info-jugador');
    if (infoJugador && infoJugador2) {
      if (esPantallaPartidaVisible) {
        // El jugador activo siempre está abajo (.info-jugador), independientemente de cuál jugador sea
        infoJugador.classList.add('turno-activo');
        // El oponente siempre está arriba (.info-jugador2) y nunca debe tener estilo activo
        infoJugador2.classList.remove('turno-activo');
      } else {
        infoJugador.classList.remove('turno-activo');
        infoJugador2.classList.remove('turno-activo');
      }
    }

    const avatarJugador2Top = document.getElementById('avatar-jugador2-top');
    const avatarJugador1Bottom = document.querySelector('.info-jugador .avatar-circular');

    // Usar la MISMA lógica que los nombres: jugador (abajo) y oponente (arriba)
    // jugador y oponente ya están definidos arriba en actualizarInterfaz()
    
    // Obtener el ID del backend para el jugador actual (abajo)
    const jugadorId = jugador === estadoJuego.jugador1 ? 
      (window.app?.jugador1Info?.id) : 
      (window.app?.jugador2Info?.id);
    
    // Obtener el ID del backend para el oponente (arriba)
    const oponenteId = oponente === estadoJuego.jugador1 ? 
      (window.app?.jugador1Info?.id) : 
      (window.app?.jugador2Info?.id);
    
    // Determinar si cada uno es jugador1_id o jugador2_id del backend
    const esJugador1BackendAbajo = jugadorId === (window.app?.partidaInfo?.jugador1_id);
    const esJugador1BackendArriba = oponenteId === (window.app?.partidaInfo?.jugador1_id);
    
    console.log('DEBUG AVATARES:', {
      'jugador.nombre': jugador.nombre,
      'oponente.nombre': oponente.nombre,
      jugadorId,
      oponenteId,
      'jugador1Info.id': window.app?.jugador1Info?.id,
      'jugador2Info.id': window.app?.jugador2Info?.id,
      'partidaInfo.jugador1_id': window.app?.partidaInfo?.jugador1_id,
      'partidaInfo.jugador2_id': window.app?.partidaInfo?.jugador2_id,
      esJugador1BackendAbajo,
      esJugador1BackendArriba,
      imagenAbajo: esJugador1BackendAbajo ? 'foto_usuario-1.png' : 'foto_usuario-2.png',
      imagenArriba: esJugador1BackendArriba ? 'foto_usuario-1.png' : 'foto_usuario-2.png'
    });
    
    // Avatar de abajo (jugador actual) - debe seguir al mismo jugador que el nombre
    if (avatarJugador1Bottom) {
      const infoJugadorAbajo = (window.app?.jugador1Info?.id === jugadorId) ?
        window.app?.jugador1Info :
        window.app?.jugador2Info;
      
      if (infoJugadorAbajo?.tipo === 'invitado') {
        avatarJugador1Bottom.src = 'img/invitado.png';
      } else {
        // Jugador 1 (logueado) siempre usa foto_usuario-1.png, Jugador 2 usa foto_usuario-2.png
        avatarJugador1Bottom.src = (infoJugadorAbajo === window.app?.jugador1Info) ? 
          'img/foto_usuario-1.png' : 'img/foto_usuario-2.png';
      }
    }

    // Avatar de arriba (oponente) - debe seguir al mismo jugador que el nombre
    if (avatarJugador2Top) {
      const infoJugadorArriba = (window.app?.jugador1Info?.id === oponenteId) ?
        window.app?.jugador1Info :
        window.app?.jugador2Info;
      
      if (infoJugadorArriba?.tipo === 'invitado') {
        avatarJugador2Top.src = 'img/invitado.png';
      } else {
        // Jugador 1 (logueado) siempre usa foto_usuario-1.png, Jugador 2 usa foto_usuario-2.png
        avatarJugador2Top.src = (infoJugadorArriba === window.app?.jugador1Info) ? 
          'img/foto_usuario-1.png' : 'img/foto_usuario-2.png';
      }
    }

    const iconoRestriccion = document.querySelector('.icono-restriccion-footer');
    if (iconoRestriccion) {
      
      // Verificar si ya hay una restricción visible
      const infoRestriccion = document.querySelector('.info-restriccion');
      const yaVisible = infoRestriccion && infoRestriccion.classList.contains('restriccion-visible');
      
      if (estadoJuego.dadoNumero && estadoJuego.restriccionActual) {
        const restriccion = CONFIG.RESTRICCIONES_DADO[estadoJuego.dadoNumero];
        if (restriccion) {
          iconoRestriccion.src = `img/${restriccion.imagen}.png`;
          iconoRestriccion.classList.remove('icono-restriccion-ocultar');
          iconoRestriccion.classList.add('icono-restriccion-mostrar');
        }
      } else if (!yaVisible) {
        // Solo ocultar si no hay una restricción ya visible
        iconoRestriccion.classList.remove('icono-restriccion-mostrar');
        iconoRestriccion.classList.add('icono-restriccion-ocultar');
      } else {
      }
    }

    const puntosActuales = parseInt(jugador.puntosRonda) || 0;
    const puntosFooter = document.querySelector('.info-jugador .puntos-jugador span');
    if (puntosFooter) {
      puntosFooter.textContent = `${puntosActuales} PUNTOS`;
    }

    GameLogic.actualizarPuntos();
  },

  _finalizarRonda(puntajesBackend = null) {
    this._calcularPuntosRonda();

    // Solo finalizar partida si estamos en ronda 4 Y en el turno 6 o más
    if (estadoJuego.rondaActual === 4 && estadoJuego.turnoEnRonda >= 6) {
      this._mostrarPantallaFinal();
    } else {
      this._mostrarResumenRonda(puntajesBackend);
    }
  },

  _calcularPuntosRonda() {
    // Los puntos generales vienen del backend, no se calculan localmente
    // Solo calculamos puntosRonda para el popup de colocación
    const todosJugadores = estadoJuego.getTodosJugadores();

    estadoJuego.jugador1.puntosRonda = GameLogic.calcularPuntos(estadoJuego.jugador1.recintos, estadoJuego.jugador1, todosJugadores);
    estadoJuego.jugador2.puntosRonda = GameLogic.calcularPuntos(estadoJuego.jugador2.recintos, estadoJuego.jugador2, todosJugadores);
  },

  // FASE 6: Muestra resumen de ronda usando puntajes que vienen del backend
  _mostrarResumenRonda(puntajesBackend) {
    if (window.app?.showScreen) {
      this.limpiarIndicadoresTurno();
      window.app.showScreen('resumen-ronda');

      // Usar puntajes del backend en lugar de calcular localmente
      if (puntajesBackend && puntajesBackend.jugadores) {
        const jugador1Data = puntajesBackend.jugadores.find(j => j.id == estadoJuego.jugador1.id) || puntajesBackend.jugadores[0];
        const jugador2Data = puntajesBackend.jugadores.find(j => j.id == estadoJuego.jugador2.id) || puntajesBackend.jugadores[1];

        // Actualizar puntos con datos del backend
        estadoJuego.jugador1.puntosRonda = jugador1Data.puntaje;
        estadoJuego.jugador2.puntosRonda = jugador2Data.puntaje;
        estadoJuego.jugador1.puntos += jugador1Data.puntaje;
        estadoJuego.jugador2.puntos += jugador2Data.puntaje;
      }

      this._actualizarResumenRonda();

      // NO asignar onclick aquí - ya está manejado por app.js
    }
  },

  _actualizarResumenRonda() {
    const elementos = {
      'puntos-resumen-j1': `${estadoJuego.jugador1.puntos} puntos totales`,
      'puntos-resumen-j2': `${estadoJuego.jugador2.puntos} puntos totales`,
      'nombre-resumen-j1': estadoJuego.jugador1.nombre.toUpperCase(),
      'nombre-resumen-j2': estadoJuego.jugador2.nombre.toUpperCase(),
      'numero-ronda-resumen': `#${estadoJuego.rondaActual}`
    };

    Object.entries(elementos).forEach(([id, valor]) => {
      const elem = document.getElementById(id);
      if (elem) elem.textContent = valor;
    });

    // Actualizar avatares dinámicamente - Jugador 1 siempre usa foto_usuario-1.png, Jugador 2 usa foto_usuario-2.png
    const avatarJugador1 = document.getElementById('avatar-resumen-j1');
    const avatarJugador2 = document.getElementById('avatar-resumen-j2');
    
    if (avatarJugador1) {
      avatarJugador1.style.backgroundImage = window.app?.jugador1Info?.tipo === 'invitado' ?
        'url("img/invitado.png")' : 'url("img/foto_usuario-1.png")';
    }
    
    if (avatarJugador2) {
      avatarJugador2.style.backgroundImage = window.app?.jugador2Info?.tipo === 'invitado' ?
        'url("img/invitado.png")' : 'url("img/foto_usuario-2.png")';
    }
  },

  _prepararSiguienteRonda() {
    // Evitar doble ejecución
    if (estadoJuego.preparandoRonda) {
      console.log('DEBUG _prepararSiguienteRonda - YA SE ESTÁ PREPARANDO, saliendo');
      return;
    }
    estadoJuego.preparandoRonda = true;
    
    // Vaciar las bolsas INMEDIATAMENTE para que no se puedan arrastrar dinosaurios viejos
    estadoJuego.jugador1.dinosauriosDisponibles = [];
    estadoJuego.jugador2.dinosauriosDisponibles = [];
    
    // Actualizar interfaz para mostrar bolsas vacías
    RenderManager.actualizarDinosauriosDisponibles();
    
    console.log('DEBUG _prepararSiguienteRonda - ANTES de limpiar:', {
      dinosaurioColocadoEnTurno: estadoJuego.dinosaurioColocadoEnTurno,
      recintoColocadoEnTurno: estadoJuego.recintoColocadoEnTurno,
      dinosaurioDescartadoEnTurno: estadoJuego.dinosaurioDescartadoEnTurno
    });
    
    // rondaActual viene del backend, pero turnoEnRonda necesita resetearse
    estadoJuego.turnoEnRonda = 1;
    // Resetear el flag para permitir que _iniciarRonda se ejecute
    estadoJuego.ultimaRondaInicializada = null;
    
    // Alternar quién empieza cada ronda:
    const quienEmpezoRonda1 = estadoJuego.primerJugadorOriginal || 1;
    const esRondaImpar = estadoJuego.rondaActual % 2 === 1;
    estadoJuego.primerJugador = esRondaImpar ? quienEmpezoRonda1 : (quienEmpezoRonda1 === 1 ? 2 : 1);
    estadoJuego.jugadorActual = estadoJuego.primerJugador;
    
    // Actualizar interfaz para reflejar el cambio de jugador
    this.actualizarInterfaz();

    Object.assign(estadoJuego, {
      turnosCompletadosJ1: 0, turnosCompletadosJ2: 0, descartadosJ1: [], descartadosJ2: [],
      dinosauriosRondaJ1: [], dinosauriosRondaJ2: [], dinosauriosDescartados: [],
      // Limpiar datos del turno anterior
      dinosaurioColocadoEnTurno: null,
      recintoColocadoEnTurno: null,
      dinosaurioDescartadoEnTurno: null,
      yaColocoEnTurno: false,
      yaDescarto: false,
      puedePasarTurno: false,
      // Limpiar restricción del dado de la ronda anterior
      restriccionActual: null,
      dadoNumero: null,
      tituloRestriccion: null
    });
    
    // Actualizar la UI para mostrar "Sin restricción" / "Libre colocación"
    this.establecerSinRestriccion();

    console.log('DEBUG _prepararSiguienteRonda - DESPUÉS de limpiar:', {
      dinosaurioColocadoEnTurno: estadoJuego.dinosaurioColocadoEnTurno,
      recintoColocadoEnTurno: estadoJuego.recintoColocadoEnTurno,
      dinosaurioDescartadoEnTurno: estadoJuego.dinosaurioDescartadoEnTurno
    });

    // NO limpiar las bolsas aquí - _repartirDinosaurios las sobrescribirá con copias frescas


    if (estadoJuego.modoSeguimiento) {
      const jugador = estadoJuego[`jugador${estadoJuego.primerJugador}`];
      
      // Determinar qué jugadorInfo corresponde al jugador actual
      const jugadorInfo = (jugador.id === window.app?.jugador1Info?.id) ? 
        window.app?.jugador1Info : window.app?.jugador2Info;
      
      // Asignar avatar correcto: Jugador 1 siempre usa foto_usuario-1.png, Jugador 2 usa foto_usuario-2.png
      let avatarSrc;
      if (jugadorInfo?.tipo === 'invitado') {
        avatarSrc = 'img/invitado.png';
      } else {
        avatarSrc = (jugadorInfo === window.app?.jugador1Info) ? 
          'img/foto_usuario-1.png' : 'img/foto_usuario-2.png';
      }

      if (window.app?.mostrarTurnoJugadorConSeleccion) {
        window.app.mostrarTurnoJugadorConSeleccion(jugador.nombre, avatarSrc);
      } else {
        setTimeout(() => ModoSeguimiento.mostrarPopupSeleccionDinosaurios(), 500);
      }
    } else {
      this._iniciarRonda();
      // Mostrar pantalla DESPUÉS de inicializar para que se muestren los dinosaurios correctos
      window.app?.showScreen?.('partida');
    }
    
    // Resetear el flag al final
    estadoJuego.preparandoRonda = false;
  },

  // FASE 6: Muestra pantalla final usando datos que vienen del backend
  _mostrarPantallaFinal(backendData = {}) {
    if (window.app?.showScreen) {
      this.limpiarIndicadoresTurno();
      window.app.showScreen('resultados');

      // Usar datos del backend
      if (backendData.puntajes) {
        estadoJuego.jugador1.puntos = backendData.puntajes.jugador1 || 0;
        estadoJuego.jugador2.puntos = backendData.puntajes.jugador2 || 0;
      }

      this._actualizarPantallaFinal();
    }
  },

  _actualizarPantallaFinal() {
    const j1 = estadoJuego.jugador1;
    const j2 = estadoJuego.jugador2;

    // Determinar quién es el ganador (mayor puntaje)
    const esJ1Ganador = j1.puntos >= j2.puntos;
    const ganador = esJ1Ganador ? j1 : j2;
    const perdedor = esJ1Ganador ? j2 : j1;

    // Actualizar elementos del ganador (primera posición)
    const nombreGanador = document.getElementById('nombre-final-j1');
    const puntosGanador = document.getElementById('puntos-final-j1');
    const avatarGanador = document.getElementById('avatar-final-j1');

    if (nombreGanador) nombreGanador.textContent = ganador.nombre.toUpperCase();
    if (puntosGanador) puntosGanador.textContent = `${ganador.puntos} puntos`;
    if (avatarGanador) {
      // Determinar qué jugadorInfo corresponde al ganador
      const ganadorInfo = (ganador.id === window.app?.jugador1Info?.id) ? 
        window.app?.jugador1Info : window.app?.jugador2Info;
      
      if (ganadorInfo?.tipo === 'invitado') {
        avatarGanador.style.backgroundImage = 'url("img/invitado.png")';
      } else {
        // Jugador 1 siempre usa foto_usuario-1.png, Jugador 2 usa foto_usuario-2.png
        avatarGanador.style.backgroundImage = (ganadorInfo === window.app?.jugador1Info) ?
          'url("img/foto_usuario-1.png")' : 'url("img/foto_usuario-2.png")';
      }
    }

    // Actualizar elementos del perdedor (segunda posición)
    const nombrePerdedor = document.getElementById('nombre-final-j2');
    const puntosPerdedor = document.getElementById('puntos-final-j2');
    const avatarPerdedor = document.getElementById('avatar-final-j2');

    if (nombrePerdedor) nombrePerdedor.textContent = perdedor.nombre.toUpperCase();
    if (puntosPerdedor) puntosPerdedor.textContent = `${perdedor.puntos} puntos`;
    if (avatarPerdedor) {
      // Determinar qué jugadorInfo corresponde al perdedor
      const perdedorInfo = (perdedor.id === window.app?.jugador1Info?.id) ? 
        window.app?.jugador1Info : window.app?.jugador2Info;
      
      if (perdedorInfo?.tipo === 'invitado') {
        avatarPerdedor.style.backgroundImage = 'url("img/invitado.png")';
      } else {
        // Jugador 1 siempre usa foto_usuario-1.png, Jugador 2 usa foto_usuario-2.png
        avatarPerdedor.style.backgroundImage = (perdedorInfo === window.app?.jugador1Info) ?
          'url("img/foto_usuario-1.png")' : 'url("img/foto_usuario-2.png")';
      }
    }

    // Actualizar podio
    const avatarPrimero = document.getElementById('avatar-primero');
    const avatarSegundo = document.getElementById('avatar-segundo');

    if (avatarPrimero) {
      // Determinar qué jugadorInfo corresponde al ganador
      const ganadorInfo = (ganador.id === window.app?.jugador1Info?.id) ? 
        window.app?.jugador1Info : window.app?.jugador2Info;
      
      if (ganadorInfo?.tipo === 'invitado') {
        avatarPrimero.style.backgroundImage = 'url("img/invitado.png")';
      } else {
        // Jugador 1 siempre usa foto_usuario-1.png, Jugador 2 usa foto_usuario-2.png
        avatarPrimero.style.backgroundImage = (ganadorInfo === window.app?.jugador1Info) ?
          'url("img/foto_usuario-1.png")' : 'url("img/foto_usuario-2.png")';
      }
    }

    if (avatarSegundo) {
      // Determinar qué jugadorInfo corresponde al perdedor
      const perdedorInfo = (perdedor.id === window.app?.jugador1Info?.id) ? 
        window.app?.jugador1Info : window.app?.jugador2Info;
      
      if (perdedorInfo?.tipo === 'invitado') {
        avatarSegundo.style.backgroundImage = 'url("img/invitado.png")';
      } else {
        // Jugador 1 siempre usa foto_usuario-1.png, Jugador 2 usa foto_usuario-2.png
        avatarSegundo.style.backgroundImage = (perdedorInfo === window.app?.jugador1Info) ?
          'url("img/foto_usuario-1.png")' : 'url("img/foto_usuario-2.png")';
      }
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
    } else {
      mensaje = `<div class="puntos-enfasis">0 PUNTOS</div>`;
      tipoAlerta = 'info';
    }

    // Agregar información de ayuda
    mensaje += `<div style="font-size: 12px; margin-top: 6px; font-weight: 500; color: var(--color-primario);">Doble click en dinosaurio para devolverlo</div>`;

    mostrarAlertaJuego(mensaje, tipoAlerta, 3500);
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

// ============================================================================
// FUNCIONES DE REGLAS INTERACTIVAS (TRANSVERSAL - Común a ambos modos)
// ============================================================================

/**
 * FUNCIONES DE REGLAS INTERACTIVAS - DRAFTOSAURUS DIGITAL
 * 
 * Funciones que manejan la interacción con las reglas del juego que son transversales a ambos modos:
 * - Mostrar detalles de consejos
 * - Alertas contextuales del juego
 * - Consejos estratégicos
 * - Alertas de restricciones del dado
 * 
 * Estas funciones son compartidas entre ambos modos de juego
 */

function mostrarDetalleConsejo(elemento) {
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

function mostrarConsejoContextual(recinto, accion) {
  const consejos = {
    'bosque-semejanza': {
      'colocar': 'Recordá: solo podés poner dinosaurios de la misma especie, llenando de izquierda a derecha sin espacios.',
      'puntos': 'Puntos: 2, 4, 8, 12, 18, 24 según cantidad de dinos iguales'
    },
    'prado-diferencia': {
      'colocar': 'Recordá: solo podés poner dinosaurios de especies distintas, llenando de izquierda a derecha sin espacios.',
      'puntos': 'Puntos: 1, 3, 6, 10, 15, 21 según cantidad de especies distintas'
    },
    'pradera-amor': {
      'colocar': 'Recordá: formá parejas del mismo tipo para obtener 6 puntos por cada pareja.',
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

// ============================================================================
// INICIALIZACIÓN DEL JUEGO (TRANSVERSAL - Común a ambos modos)
// ============================================================================

/**
 * INICIALIZACIÓN DEL JUEGO - DRAFTOSAURUS DIGITAL
 * 
 * Configuración inicial que es transversal a ambos modos de juego:
 * - Configuración de event listeners
 * - Inicialización de sistemas
 * - Configuración de funciones globales
 * - Manejo de errores globales
 * 
 * Esta inicialización es compartida entre ambos modos
 */
document.addEventListener('DOMContentLoaded', () => {
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



  document.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('dinosaurio-colocado')) {

      const tipo = e.target.dataset.tipo;

      if (!tipo) {
        return;
      }

      const jugadorActual = estadoJuego.getJugadorActual();

      if (!estadoJuego.yaColocoEnTurno || !estadoJuego.dinosaurioColocadoEnTurno) {
        return;
      }

      if (tipo !== estadoJuego.dinosaurioColocadoEnTurno) {
        return;
      }

      const recintoEsperado = estadoJuego.recintoColocadoEnTurno;
      const dinosauriosEnRecinto = jugadorActual.recintos[recintoEsperado];
      const index = dinosauriosEnRecinto.indexOf(tipo);

      if (index === -1) {
        return;
      }

      // Remover el dinosaurio del recinto
      jugadorActual.recintos[recintoEsperado].splice(index, 1);

      jugadorActual.dinosauriosDisponibles.push(tipo);

      RenderManager.actualizarDinosauriosDisponibles();
      RenderManager.renderizarTablero();
      GameLogic.actualizarPuntos();
      GameLogic.actualizarPesos();

      limpiarTooltips();

      DragDropManager._initDinosaurios();
      DragDropManager._initDropZones();

      estadoJuego.yaColocoEnTurno = false;
      estadoJuego.puedePasarTurno = false;
      estadoJuego.dinosaurioColocadoEnTurno = null;
      estadoJuego.recintoColocadoEnTurno = null;

      JuegoManager.actualizarBotonSiguiente();
      mostrarAlertaJuego(`Dinosaurio devuelto a disponibles`, 'success', 2000);
    }
  });

  // Sistema de tooltips para mobile (click en recintos)
  let tooltipActivo = null;

  function limpiarTooltips() {
    if (tooltipActivo) {
      tooltipActivo.elemento.remove();
      tooltipActivo = null;
    }
    document.querySelectorAll('.tooltip-click').forEach(tooltip => tooltip.remove());
  }

  // ============================================================================
  // COMUNICACIÓN CON BACKEND (TRANSVERSAL - Común a ambos modos)
  // ============================================================================
  
  /**
   * Envía datos del turno al backend con manejo robusto de errores
   * Esta función es transversal a ambos modos de juego
   */
  async function enviarTurnoAlBackend() {
    if (estadoJuego.sincronizandoConBackend) {
      return null;
    }

    estadoJuego.sincronizandoConBackend = true;

    // Deshabilitar botón durante request
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) btn.disabled = true;

    try {
      // Obtener el ID real del usuario actual
      const jugadorActual = estadoJuego.getJugadorActual();
      const jugadorIdReal = estadoJuego.jugadorActual === 1 ? 
        (window.app?.jugador1Info?.id || 1) : 
        (window.app?.jugador2Info?.id || 2);

      const requestData = {
        partida_id: estadoJuego.partidaId,
        jugador_id: jugadorIdReal,
        recinto: estadoJuego.recintoColocadoEnTurno,
        tipoDino: estadoJuego.dinosaurioColocadoEnTurno,
        tipoDinoDescarte: estadoJuego.dinosaurioDescartadoEnTurno
      };

      // Solo agregar caraDado en modo seguimiento
      if (estadoJuego.modoSeguimiento) {
        requestData.caraDado = JuegoManager.obtenerCaraDadoDesdeNumero(estadoJuego.dadoNumero);
        console.log('DEBUG - caraDado para backend:', {
          dadoNumero: estadoJuego.dadoNumero,
          caraDado: requestData.caraDado
        });
      }

      console.log('DEBUG enviarTurnoAlBackend - ronda:', estadoJuego.rondaActual, 'turno:', estadoJuego.turnoEnRonda);
      console.log('DEBUG - Bolsa actual del jugador:', jugadorActual.dinosauriosDisponibles);
      console.log('Enviando turno al backend:', requestData);

      // ============================================================================
      // DISCRIMINACIÓN DE ENDPOINTS SEGÚN EL MODO DE JUEGO
      // ============================================================================
      const endpoint = estadoJuego.modoSeguimiento ? 
        'http://127.0.0.1:8000/turnoSeguimiento' : 
        'http://127.0.0.1:8000/turno';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);

      // Verificar status HTTP
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del backend:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Respuesta del backend:', result);

      // VALIDACIÓN ROBUSTA DE RESPUESTA
      if (!result || typeof result !== 'object') {
        throw new Error('Respuesta inválida del servidor');
      }

      if (!result.success) {
        const mensajes = {
          'invalid': 'Movimiento inválido',
          'duplicate': 'Acción ya realizada',
          'error': 'Error interno del servidor'
        };

        const mensaje = mensajes[result.code] || result.message || 'Error desconocido';
        mostrarAlertaJuego(mensaje, 'error', 4000);

        console.error('Error del backend:', result);
        return null;
      }

      // VALIDAR CAMPOS REQUERIDOS EN RESPUESTA
      if (!result.turno || !result.ronda) {
        console.warn('Respuesta incompleta del backend:', result);
        mostrarAlertaJuego('Respuesta incompleta del servidor', 'warning', 3000);
      }

      estadoJuego.sincronizandoConBackend = false;
      return result;

    } catch (error) {
      console.error('Error completo:', error);

      // Diferentes tipos de errores
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        mostrarAlertaJuego('Error de conexión - Verifica tu internet', 'error', 5000);
      } else if (error.message.includes('HTTP')) {
        mostrarAlertaJuego('Error del servidor - Intenta nuevamente', 'error', 4000);
      } else {
        mostrarAlertaJuego('Error inesperado - Contacta soporte', 'error', 5000);
      }

      estadoJuego.sincronizandoConBackend = false;
      return null;

    } finally {
      // Siempre rehabilitar botón
      if (btn) {
        btn.disabled = false;
        JuegoManager.actualizarBotonSiguiente();
      }
    }
  }

  /**
   * Sincroniza el estado local con los datos que devuelve el backend
   * Detecta automáticamente fin de ronda/partida desde backend
   * Esta función es transversal a ambos modos de juego
   */
  function sincronizarConBackend(backendData) {
    const estadoMapeado = mapearBackendAEstadoLocal(backendData);
    Object.assign(estadoJuego, estadoMapeado);

    // FASE 6: DETECTAR FIN DE RONDA/PARTIDA AUTOMÁTICAMENTE
    if (backendData.puntajes) {
      // Backend incluye puntajes = fin de ronda
      JuegoManager._mostrarResumenRonda(backendData.puntajes);
      return; // No continuar con interfaz normal
    }

    if (backendData.ganador_id !== undefined) {
      // Backend incluye ganador_id = fin de partida
      JuegoManager._mostrarPantallaFinal(backendData);
      return; // No continuar con interfaz normal
    }

    // Turno normal: actualizar localStorage
    actualizarLocalStorage();
    // NO actualizar interfaz aquí - se hará al final del procesamiento del turno
  }

  /**
   * Guarda el estado actual del juego en localStorage para persistencia
   * Esta función es transversal a ambos modos de juego
   */
  function actualizarLocalStorage() {
    const datosActualizados = {
      jugador1: window.app?.jugador1Info || {},
      jugador2: window.app?.jugador2Info || {},
      partida: {
        ...(window.app?.partidaInfo || {}),
        turno: estadoJuego.turnoEnRonda,
        ronda: estadoJuego.rondaActual,
        estado: estadoJuego.estadoPartida
      }
    };
    localStorage.setItem('datosJuego', JSON.stringify(datosActualizados));
  }

  /**
   * Convierte la respuesta del backend al formato que entiende el estado local del frontend
   * Esta función es transversal a ambos modos de juego
   */
  function mapearBackendAEstadoLocal(backendResponse) {
    // Mostrar respuesta del backend en el mismo orden que la devuelve
    console.log('Backend Response:', {
      success: backendResponse.success,
      message: backendResponse.message,
      partida_id: backendResponse.partida_id,
      jugador_id: backendResponse.jugador_id,
      recinto: backendResponse.recinto,
      tipoDino: backendResponse.tipoDino,
      tipoDinoDescarte: backendResponse.tipoDinoDescarte,
      turno: backendResponse.turno,
      ronda: backendResponse.ronda,
      caraDado: backendResponse.caraDado,
      puntaje_jugador1: backendResponse.puntaje_jugador1,
      puntaje_jugador2: backendResponse.puntaje_jugador2,
      bolsa_jugador1: backendResponse.bolsa_jugador1,
      bolsa_jugador2: backendResponse.bolsa_jugador2,
      httpCode: backendResponse.httpCode
    });
    
    const mapeado = {
      turnoEnRonda: backendResponse.turno || estadoJuego.turnoEnRonda,
      rondaActual: backendResponse.ronda || estadoJuego.rondaActual,
      // NUNCA sobrescribir restriccionActual desde el backend - mantener el valor local
      restriccionActual: estadoJuego.restriccionActual,
      dadoNumero: backendResponse.caraDado ? JuegoManager.mapearCaraDadoBackend(backendResponse.caraDado) : estadoJuego.dadoNumero
    };

    // Actualizar puntos desde el backend
    // IMPORTANTE: El backend devuelve puntajes basados en los IDs fijos de la partida (jugador1_id, jugador2_id)
    // pero el frontend usa posiciones relativas (estadoJuego.jugador1, estadoJuego.jugador2) que pueden cambiar
    if (backendResponse.puntaje_jugador1 !== undefined) {
      const esJugador1Frontend = (window.app?.jugador1Info?.id || 1) === (window.app?.partidaInfo?.jugador1_id || 1);
      if (esJugador1Frontend) {
        estadoJuego.jugador1.puntos = backendResponse.puntaje_jugador1;
      } else {
        estadoJuego.jugador2.puntos = backendResponse.puntaje_jugador1;
      }
    }
    if (backendResponse.puntaje_jugador2 !== undefined) {
      const esJugador1Frontend = (window.app?.jugador1Info?.id || 1) === (window.app?.partidaInfo?.jugador1_id || 1);
      if (esJugador1Frontend) {
        estadoJuego.jugador2.puntos = backendResponse.puntaje_jugador2;
      } else {
        estadoJuego.jugador1.puntos = backendResponse.puntaje_jugador2;
      }
    }

    // Actualizar bolsas desde el backend SOLO si vienen bolsas nuevas
    // IMPORTANTE: El backend devuelve bolsas basadas en los IDs fijos de la partida (jugador1_id, jugador2_id)
    // pero el frontend usa posiciones relativas (estadoJuego.jugador1, estadoJuego.jugador2) que pueden cambiar
    
    if (backendResponse.bolsa_jugador1 && Array.isArray(backendResponse.bolsa_jugador1)) {
      // Determinar qué jugador del frontend corresponde al jugador1_id del backend
      const esJugador1Frontend = (window.app?.jugador1Info?.id || 1) === (window.app?.partidaInfo?.jugador1_id || 1);
      
      if (esJugador1Frontend) {
        estadoJuego.jugador1.dinosauriosDisponibles = [...backendResponse.bolsa_jugador1];
      } else {
        estadoJuego.jugador2.dinosauriosDisponibles = [...backendResponse.bolsa_jugador1];
      }
      
      // Actualizar también la variable bolsas en partidaInfo
      if (window.app?.partidaInfo?.bolsas) {
        window.app.partidaInfo.bolsas.jugador1 = [...backendResponse.bolsa_jugador1];
      }
    }
    
    if (backendResponse.bolsa_jugador2 && Array.isArray(backendResponse.bolsa_jugador2)) {
      // Determinar qué jugador del frontend corresponde al jugador2_id del backend
      const esJugador1Frontend = (window.app?.jugador1Info?.id || 1) === (window.app?.partidaInfo?.jugador1_id || 1);
      
      if (esJugador1Frontend) {
        estadoJuego.jugador2.dinosauriosDisponibles = [...backendResponse.bolsa_jugador2];
      } else {
        estadoJuego.jugador1.dinosauriosDisponibles = [...backendResponse.bolsa_jugador2];
      }
      
      // Actualizar también la variable bolsas en partidaInfo
      if (window.app?.partidaInfo?.bolsas) {
        window.app.partidaInfo.bolsas.jugador2 = [...backendResponse.bolsa_jugador2];
      }
    }
    
    // Solo actualizar interfaz visual si se actualizaron las bolsas
    if ((backendResponse.bolsa_jugador1 && Array.isArray(backendResponse.bolsa_jugador1)) || 
        (backendResponse.bolsa_jugador2 && Array.isArray(backendResponse.bolsa_jugador2))) {
      RenderManager.actualizarDinosauriosDisponibles();
    }
    
    return mapeado;
  }

  document.addEventListener('click', (e) => {
    const recinto = e.target.closest('.cuadro, .rectangulo');

    if (tooltipActivo && !recinto) {
      tooltipActivo.elemento.remove();
      tooltipActivo = null;
      return;
    }

    if (tooltipActivo && recinto && recinto !== tooltipActivo.recinto) {
      tooltipActivo.elemento.remove();
      tooltipActivo = null;
    }

    if (e.target.classList.contains('dino') || e.target.closest('.dinosaurio-colocado') || e.target.tagName === 'BUTTON') {
      return;
    }

    if (recinto) {
      const titulo = recinto.getAttribute('title');
      if (titulo && !tooltipActivo) {
        // Crear tooltip visual
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-click';
        tooltip.textContent = titulo;

        recinto.style.position = 'relative';
        recinto.appendChild(tooltip);

        tooltipActivo = { elemento: tooltip, recinto: recinto };

        setTimeout(() => {
          if (tooltipActivo && tooltipActivo.elemento === tooltip) {
            tooltip.remove();
            tooltipActivo = null;
          }
        }, 3000);
      }
    }
  });

  // ============================================================================
  // EXPOSICIÓN DE FUNCIONES GLOBALES (TRANSVERSAL - Común a ambos modos)
  // ============================================================================
  
  // Exponer funciones globales
  Object.assign(window, {
    JuegoManager, estadoJuego, ModoSeguimiento, RenderManager,
    mostrarReglas: () => PopupManager.mostrarReglas(),
    limpiarTooltips,
    mostrarPesos: () => PopupManager.mostrarPesos(),
    mostrarMapa: () => MapaOponente.mostrar(),
    cerrarPopup: (id) => PopupManager.cerrar(id),
    limpiarIndicadoresTurno: () => JuegoManager.limpiarIndicadoresTurno(),
    cancelarPartida: () => {
      if (confirm('¿Estás seguro de que quieres cancelar la partida actual?')) {
        estadoJuego.reset();
        window.app?.showScreen?.('lobby');
        mostrarAlertaJuego('Partida cancelada', 'info', 2000);
      }
    },
    mostrarDetalleConsejo,
    mostrarAlertaJuego,
    mostrarConsejoContextual,
    mostrarAlertaRestriccionDado,
    mostrarConsejoEstrategia,
    // AGREGAR ESTAS 4 LÍNEAS:
    sincronizarConBackend,
    actualizarLocalStorage,
    mapearBackendAEstadoLocal,
    enviarTurnoAlBackend
  });

  // ============================================================================
  // CONFIGURACIÓN ESPECÍFICA DEL MODO SEGUIMIENTO
  // ============================================================================
  
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
