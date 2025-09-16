/*
=============================================================================
CONFIGURACIÓN GLOBAL DEL JUEGO DRAFTOSAURUS
=============================================================================
*/

/**
 * Configuración principal del juego - Tiene todos los valores y reglas
 * que necesita el tablero de Draftosaurus para funcionar
 */
const CONFIG = {
  // Imágenes de los dinosaurios en cada situación
  // 'disponible': cuando el dinosaurio está esperando para ser colocado
  // 'colocado': cuando ya está puesto en un lugar del tablero
  IMAGENES_DINOSAURIOS: {
    't-rex': { disponible: 'img/dino-t-rex.png', colocado: 'img/dino-t-rex-arriba.png' },
    'triceratops': { disponible: 'img/dino-triceratops.png', colocado: 'img/dino-triceratops-arriba.png' },
    'diplodocus': { disponible: 'img/dino-diplodocus.png', colocado: 'img/dino-diplodocus-arriba.png' },
    'stegosaurus': { disponible: 'img/dino-stegosaurus.png', colocado: 'img/dino-stegosaurus-arriba.png' },
    'parasaurolophus': { disponible: 'img/dino-parasaurolophus.png', colocado: 'img/dino-parasaurolophus-arriba.png' },
    'pterodáctilo': { disponible: 'img/dino-velociraptor.png', colocado: 'img/dino-velociraptor-arriba.png' }
  },
  
  // Cuánto pesan aproximadamente los dinosaurios en kilogramos
  // Se usan para calcular los pesos que aparecen en el juego
  MASAS_DINOSAURIOS: { 't-rex': 7000, 'triceratops': 7000, 'diplodocus': 15000, 'stegosaurus': 5000, 'parasaurolophus': 2500, 'pterodáctilo': 2000 },
  
  // Reglas básicas del juego
  GRAVEDAD: 9.8, // Número que se usa para calcular el peso de los dinosaurios
  TIPOS_DINOSAURIOS: ['t-rex', 'triceratops', 'diplodocus', 'stegosaurus', 'parasaurolophus', 'pterodáctilo'],
  DINOSAURIOS_POR_RONDA: 6, // Cuántos dinosaurios recibe cada jugador al empezar una ronda
  MAX_DINOSAURIOS_POOL: 8, // Máximo de dinosaurios de cada tipo en todo el juego
  TOTAL_RONDAS: 5, // Cuántas rondas tiene una partida completa

  // Dónde se colocan los dinosaurios en el tablero
  POSICIONES_DINOSAURIOS: [
    { top: '50%', left: '50%' }, { top: '30%', left: '30%' }, { top: '30%', left: '70%' }, 
    { top: '70%', left: '30%' }, { top: '70%', left: '70%' }, { top: '50%', left: '20%' },
    { top: '20%', left: '50%' }, { top: '80%', left: '50%' }
  ],
  
  // Posiciones más pequeñas para el mapa chiquito que muestra lo del oponente
  // Es igual al grande pero más chico
  POSICIONES_MINI: [
    { top: '50%', left: '50%' }, { top: '25%', left: '25%' }, { top: '25%', left: '75%' }, 
    { top: '75%', left: '25%' }, { top: '75%', left: '75%' }, { top: '50%', left: '15%' },
    { top: '15%', left: '50%' }, { top: '85%', left: '50%' }
  ],

  // Posiciones especiales para lugares que necesitan un orden determinado
  // Estos lugares se llenan de izquierda a derecha, uno por uno
  POSICIONES_NUMERADAS: {
    'bosque-semejanza': [
      { top: '50%', left: '16%' }, { top: '50%', left: '32%' }, { top: '50%', left: '48%' },
      { top: '50%', left: '64%' }, { top: '50%', left: '80%' }, { top: '50%', left: '96%' }
    ],
    'prado-diferencia': [
      { top: '50%', left: '16%' }, { top: '50%', left: '32%' }, { top: '50%', left: '48%' },
      { top: '50%', left: '64%' }, { top: '50%', left: '80%' }, { top: '50%', left: '96%' }
    ]
  },

  // Lo mismo pero para el mapa pequeño del oponente
  POSICIONES_NUMERADAS_MINI: {
    'bosque-semejanza': [
      { top: '50%', left: '16%' }, { top: '50%', left: '32%' }, { top: '50%', left: '48%' },
      { top: '50%', left: '64%' }, { top: '50%', left: '80%' }, { top: '50%', left: '96%' }
    ],
    'prado-diferencia': [
      { top: '50%', left: '16%' }, { top: '50%', left: '32%' }, { top: '50%', left: '48%' },
      { top: '50%', left: '64%' }, { top: '50%', left: '80%' }, { top: '50%', left: '96%' }
    ]
  },

  // Restricciones del dado de 6 caras
  // Cada número del dado hace que algunos lugares no se puedan usar
  RESTRICCIONES_DADO: {
    1: { tipo: 'huella-libre', titulo: 'Huella (libre)', imagen: 'dado-huella',
         descripcion: 'Tablero libre, sin restricción', recintosBloqueados: [] },
    2: { tipo: 'no-t-rex', titulo: 'No T-Rex', imagen: 'dado-no-trex',
         descripcion: 'Solo el Rey de la Jungla', recintosBloqueados: ['rey-jungla'] },
    3: { tipo: 'lado-cafeteria', titulo: 'Lado Cafetería', imagen: 'dado-cafe',
         descripcion: 'Bosque de la Semejanza, Trío Frondoso, Pradera del Amor',
         recintosBloqueados: ['bosque-semejanza', 'woody-trio', 'pradera-amor'] },
    4: { tipo: 'lado-banos', titulo: 'Lado Baños', imagen: 'dado-banos',
         descripcion: 'Rey de la Jungla, Prado de la Diferencia, Isla Solitaria',
         recintosBloqueados: ['rey-jungla', 'prado-diferencia', 'isla-solitaria'] },
    5: { tipo: 'bosque', titulo: 'Bosque', imagen: 'dado-bosque',
         descripcion: 'Trío Frondoso, Bosque de la Semejanza, Rey de la Jungla',
         recintosBloqueados: ['woody-trio', 'bosque-semejanza', 'rey-jungla'] },
    6: { tipo: 'rocas', titulo: 'Rocas / Pradera', imagen: 'dado-rocas',
         descripcion: 'Prado de la Diferencia, Isla Solitaria, Pradera del Amor',
         recintosBloqueados: ['prado-diferencia', 'isla-solitaria', 'pradera-amor'] }
  },

  // Referencias a elementos importantes de la página
  SELECTORS: {
    popupOverlay: '.popup-overlay',
    popupClose: '.popup-close',
    dinosaurioColocado: '.dinosaurio-colocado',
    dino: '.dino',
    dropZones: '.cuadro, .rectangulo',
    dinoDescarte: '.dino-descarte'
  }
};

/*
=============================================================================
SISTEMA DE REGLAS DE RECINTOS
=============================================================================
*/

/**
 * Define las reglas específicas de cada recinto del tablero
 * Cada recinto tiene su propia lógica de validación y sistema de puntuación
 */
const REGLAS_RECINTOS = {
  'bosque-semejanza': {
    // Solo acepta dinosaurios si está vacío O si todos son del mismo tipo
    validar: (recinto, nuevoDino) => recinto.length === 0 || recinto.every(d => d === nuevoDino),
    maxDinos: 6, puntos: [0, 2, 4, 8, 12, 18, 24], // Cuántos puntos da cada cantidad
    nombre: 'Bosque de la Semejanza',
    descripcion: 'Todos los dinosaurios iguales. Puntos: 2, 4, 8, 12, 18, 24'
  },
  
  'pradera-amor': {
    // Acepta cualquier dinosaurio
    validar: () => true, maxDinos: 6,
    // Cuenta las parejas del mismo tipo y da 6 puntos por cada pareja
    puntos: (recinto) => {
      const conteos = {};
      recinto.forEach(d => conteos[d] = (conteos[d] || 0) + 1);
      return Object.values(conteos).reduce((parejas, count) => parejas + Math.floor(count / 2), 0) * 6;
    },
    nombre: 'Pradera del Amor',
    descripcion: 'Deben ir en parejas del mismo tipo. 6 puntos por cada pareja'
  },
  
  'woody-trio': { 
    // Acepta cualquier dinosaurio hasta completar el máximo
    validar: () => true, maxDinos: 3, 
    // Solo da puntos si tiene exactamente 3 dinosaurios, si no, da cero
    puntos: cant => cant === 3 ? 7 : 0,
    nombre: 'Trío Frondoso',
    descripcion: 'Exactamente 3 dinosaurios del mismo tipo. 7 puntos por cada trío completo'
  },
  
  'prado-diferencia': {
    // Solo acepta dinosaurios si no hay otro igual ya puesto. No puede haber dinosaurios iguales en el recinto.
    validar: (recinto, nuevoDino) => !recinto.includes(nuevoDino),
    maxDinos: 6, puntos: [0, 1, 3, 6, 10, 15, 21], // Más puntos por más variedad
    nombre: 'Prado de la Diferencia',
    descripcion: 'Todos los dinosaurios diferentes. Puntos: 1, 3, 6, 10, 15, 21'
  },
  
  'rey-jungla': {
    // Solo acepta T-Rex, rechaza cualquier otro dinosaurio
    validar: (recinto, nuevoDino) => nuevoDino === 't-rex',
    maxDinos: 6, puntos: (recinto) => recinto.length * 7, // 7 puntos por cada T-Rex
    nombre: 'Recinto del T-Rex',
    descripcion: 'Solo T-Rex permitidos. 7 puntos por cada T-Rex'
  },
  
  'isla-solitaria': {
    // Acepta cualquier dinosaurio pero solo uno
    validar: () => true, maxDinos: 1,
    // Solo da puntos si realmente hay exactamente 1 dinosaurio
    puntos: (recinto) => recinto.length === 1 ? 7 : 0,
    nombre: 'Isla Solitaria',
    descripcion: 'Solo se permite 1 dinosaurio. 7 puntos fijos'
  },
  
  'rio': { 
    // El río siempre acepta dinosaurios cuando no hay donde más ponerlos
    validar: () => true, maxDinos: 20, // Número muy alto para que sea casi ilimitado
    puntos: cant => cant, // 1 punto por dinosaurio (lo mínimo)
    nombre: 'Río',
    descripcion: 'En el río vale 1 punto. Siempre se puede colocar'
  }
};

/*
=============================================================================
UTILIDADES GENERALES
=============================================================================
*/

const Utils = {
  /**
   * Mezcla una lista de elementos de forma aleatoria
   * Se usa para repartir dinosaurios al azar
   * @param {Array} arr - Array a mezclar
   * @returns {Array} - Nueva copia del array mezclado
   */
  mezclarArray: (arr) => {
    const copia = [...arr];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  },

  /**
   * Muestra u oculta ventanas emergentes y evita que se pueda hacer scroll
   * Cuando hay una ventana abierta, no se puede mover la página
   * @param {HTMLElement} popup - Elemento popup a mostrar/ocultar
   * @param {boolean} show - true para mostrar, false para ocultar
   */
  togglePopup: (popup, show) => {
    if (!popup) return;
    
    const method = show ? 'remove' : 'add';
    popup.classList[method]('hidden');
    
    if (show) {
      document.body.style.overflow = 'hidden'; // Bloquea scroll mientras modal está abierto
    } else {
      // Solo restaura scroll si no hay otros popups activos
      const hayOtrosPopups = Array.from(document.querySelectorAll(CONFIG.SELECTORS.popupOverlay))
        .some(p => !p.classList.contains('hidden'));
      if (!hayOtrosPopups) {
        document.body.style.overflow = ''; // Restaura scroll normal
      }
    }
  },

  /**
   * Verifica si existe algún popup actualmente visible
   * Usado para prevenir acciones durante estados de modal
   * @returns {boolean} - true si hay al menos un popup abierto
   */
  hayPopupAbierto: () => Array.from(document.querySelectorAll(CONFIG.SELECTORS.popupOverlay))
    .some(p => !p.classList.contains('hidden')),

  /**
   * Remueve todos los elementos que coincidan con el selector del DOM
   * Utilizado para limpiar dinosaurios cuando se cambia de ronda/turno
   * @param {string} selector - Selector CSS de elementos a eliminar
   */
  limpiarElementos: (selector) => document.querySelectorAll(selector).forEach(el => el.remove()),

  /**
   * Factory para crear elementos HTML con atributos y estilos de manera declarativa
   * Simplifica la creación de elementos dinámicos del juego
   * @param {string} tag - Nombre del tag HTML
   * @param {Object} attrs - Atributos del elemento (incluyendo dataset)
   * @param {Object} styles - Estilos CSS a aplicar
   * @returns {HTMLElement} - Elemento creado y configurado
   */
  crearElemento: (tag, attrs = {}, styles = {}) => {
    const el = document.createElement(tag);
    
    // Manejo especial para data attributes
    if (attrs.dataset) {
      Object.assign(el.dataset, attrs.dataset);
      delete attrs.dataset;
    }
    
    Object.assign(el, attrs);
    Object.assign(el.style, styles);
    return el;
  }
};

/*
=============================================================================
GESTIÓN DEL ESTADO DEL JUEGO
=============================================================================
*/

/**
 * Clase que guarda toda la información importante de la partida
 * Es el lugar donde se guarda quién juega, qué ronda es, etc.
 * Controla jugadores, turnos, rondas, restricciones y dinosaurios
 */
class EstadoJuego {
  constructor() { this.reset(); }

  /**
   * Vuelve todo a como estaba al principio
   * Se usa para empezar partidas nuevas o arreglar errores
   */
  reset() {
    Object.assign(this, {
      // Control de turnos y rondas
      jugadorActual: 1,           // Quién juega ahora (1 o 2)
      primerJugador: 1,           // Quién empezó esta ronda
      primerJugadorOriginal: 1,   // Quién empezó la partida (para alternar rondas)
      rondaActual: 1,             // Ronda actual (1-5)
      turnoEnRonda: 1,            // Turno dentro de la ronda actual
      
      // Tipo de juego (manual o automático)
      modoSeguimiento: false,     // true: manual, false: automático
      restriccionActual: null,    // Restricción activa del dado
      
      // Estado del turno actual
      puedePasarTurno: false,           // Si el botón "siguiente" está habilitado
      yaColocoEnTurno: false,           // Si ya colocó su dinosaurio este turno
      dinosaurioColocadoEnTurno: null,  // Qué dinosaurio colocó (para permitir devolverlo)
      recintoColocadoEnTurno: null,     // En qué recinto lo colocó
      
      // Sistema de dinosaurios y dado
      dadoNumero: null,               // Número del dado actual (1-6)
      repartosDisponibles: [],        // Pool general de dinosaurios sin repartir
      dinosauriosDescartados: [],     // Dinosaurios descartados durante la partida
      
      // Tracking por jugador (usado en modo seguimiento)
      dinosauriosRondaJ1: [],         // Dinosaurios que seleccionó J1 para esta ronda
      dinosauriosRondaJ2: [],         // Dinosaurios que seleccionó J2 para esta ronda
      descartadosJ1: [],              // Dinosaurios que descartó J1 esta ronda
      descartadosJ2: [],              // Dinosaurios que descartó J2 esta ronda
      turnosCompletadosJ1: 0,         // Turnos que ha jugado J1 en esta ronda
      turnosCompletadosJ2: 0,         // Turnos que ha jugado J2 en esta ronda
      
      // Los dos jugadores participantes
      jugador1: this._crearJugador(), 
      jugador2: this._crearJugador()
    });
  }

  /**
   * Crea una estructura inicial de un jugador
   * @returns {Object} Objeto jugador con propiedades inicializadas
   */
  _crearJugador() {
    return {
      nombre: '',
      dinosauriosDisponibles: [],   // Dinosaurios en la "mano" del jugador
      puntos: 0,                    // Puntos totales acumulados
      puntosRonda: 0,               // Puntos de la ronda actual
      recintos: {                   // Estado de cada recinto del tablero
        'bosque-semejanza': [], 'pradera-amor': [], 'woody-trio': [], 
        'prado-diferencia': [], 'rey-jungla': [], 'isla-solitaria': [], 'rio': []
      }
    };
  }

  // Métodos de acceso rápido al estado de jugadores
  getJugadorActual() { return this[`jugador${this.jugadorActual}`]; }
  getOponente() { return this[`jugador${this.jugadorActual === 1 ? 2 : 1}`]; }
  getTodosJugadores() { return [this.jugador1, this.jugador2]; }

  /**
   * Ejecuta el cambio de turno entre jugadores
   * Alterna control, resetea estado del turno y actualiza contadores
   */
  cambiarTurno() {
    // En modo seguimiento, trackear turnos completados por jugador
    if (this.modoSeguimiento) this[`turnosCompletadosJ${this.jugadorActual}`]++;
    
    // Alternar jugador activo y avanzar contador de turno
    this.jugadorActual = this.jugadorActual === 1 ? 2 : 1;
    this.turnoEnRonda++;
    
    // Resetear estado de turno para el nuevo jugador
    this.yaColocoEnTurno = false;
    this.puedePasarTurno = false;
    this.dinosaurioColocadoEnTurno = null;
    this.recintoColocadoEnTurno = null;
    
    // Deshabilitar botón hasta que se realice una acción válida
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) btn.disabled = true;
  }

  /**
   * Determina si la ronda actual ha finalizado
   * Las reglas cambian según el modo de juego (normal vs seguimiento)
   * @returns {boolean} - true si la ronda debe terminar
   */
  esFinDeRonda() {
    // MODO NORMAL: Automático basado en dinosaurios disponibles
    if (!this.modoSeguimiento) {
      // Ronda termina cuando ambos jugadores agotaron sus dinosaurios
      return this.jugador1.dinosauriosDisponibles.length === 0 && 
             this.jugador2.dinosauriosDisponibles.length === 0;
    }
    
    // MODO SEGUIMIENTO: Manual con validaciones especiales
    if (this.esPrimerTurnoDeRonda()) return false;
    
    // Después del primer turno, aplicar regla estándar
    const sinDinosaurios = this.jugador1.dinosauriosDisponibles.length === 0 && 
                          this.jugador2.dinosauriosDisponibles.length === 0;
    
    return sinDinosaurios;
  }

  // Métodos de utilidad para verificar estado del juego
  esPrimerTurnoDeRonda() { return this.turnoEnRonda === 1; }
  esPrimerTurnoAbsoluto() { return this.turnoEnRonda === 1 && this.rondaActual === 1; }
  necesitaRestriccion() { return !this.esPrimerTurnoDeRonda(); } // Primer turno siempre libre
  puedeMoverDinosaurios() { return this.rondaActual >= 1; } // Evitar errores revisando que haya empezado el juego
}

// Instancia global del estado del juego
const estadoJuego = new EstadoJuego();

/*
=============================================================================
LÓGICA CENTRAL DEL JUEGO
=============================================================================
*/

/**
 * Parte del juego que sabe todas las reglas y cómo funciona
 * Revisa si los movimientos están bien, cuenta puntos y controla restricciones
 */
const GameLogic = {
  /**
   * Revisa si se puede poner un dinosaurio en un lugar específico
   * Verifica todas las reglas: turno, espacio, restricciones del dado y reglas del lugar
   * @param {string} recinto - Lugar donde se quiere poner
   * @param {string} tipoDino - Tipo de dinosaurio que se quiere poner
   * @returns {boolean} - true si se puede hacer este movimiento
   */
  puedeColocarDinosaurio(recinto, tipoDino) {
    // REGLA: Solo un dinosaurio por turno
    if (estadoJuego.yaColocoEnTurno) return false;

    // EXCEPCIÓN: El río siempre acepta dinosaurios cuando no hay más opciones
    if (recinto === 'rio') return true;

    const jugador = estadoJuego.getJugadorActual();
    const recintoActual = jugador.recintos[recinto];
    const reglas = REGLAS_RECINTOS[recinto];

    // VALIDACIÓN: Verificar que el recinto exista y tenga capacidad
    if (!reglas || recintoActual.length >= reglas.maxDinos) return false;
    
    // VALIDACIÓN: Aplicar restricciones del dado si están activas
    if (estadoJuego.restriccionActual && this.estaRecintoBloqueado(recinto)) return false;

    // VALIDACIÓN: Aplicar reglas específicas del recinto
    return reglas.validar(recintoActual, tipoDino);
  },

  /**
   * Verifica si un recinto está bloqueado por la restricción actual del dado
   * @param {string} recinto - ID del recinto
   * @returns {boolean} - true si está bloqueado
   */
  estaRecintoBloqueado(recinto) {
    // Sin restricción = sin bloqueos
    if (!estadoJuego.restriccionActual) return false;
    
    // Buscar la configuración de la restricción actual
    const restriccionConfig = Object.values(CONFIG.RESTRICCIONES_DADO)
      .find(r => r.tipo === estadoJuego.restriccionActual);
    
    // Si no hay configuración, no bloquear
    if (!restriccionConfig || !restriccionConfig.recintosBloqueados) return false;
    
    // Verificar si el recinto está en la lista de bloqueados
    return restriccionConfig.recintosBloqueados.includes(recinto);
  },

  /**
   * Coloca un dinosaurio en el recinto especificado
   * @param {string} recinto - ID del recinto donde colocar
   * @param {string} tipoDino - Tipo de dinosaurio a colocar
   * @param {HTMLElement} area - Elemento DOM del área del recinto
   * @returns {boolean} - true si se colocó exitosamente
   */
  colocarDinosaurio(recinto, tipoDino, area) {
    // Verificar que no se haya colocado ya un dinosaurio este turno
    if (estadoJuego.yaColocoEnTurno) return false;

    const jugador = estadoJuego.getJugadorActual();
    const idx = jugador.dinosauriosDisponibles.indexOf(tipoDino);
    if (idx === -1) return false; // Dinosaurio no disponible

    // Captura de los puntos actuales para saber cuántos ganó después
    // Ejemplo: si tenía 5 puntos y ahora tiene 8, ganó 3 puntos nuevos
    const puntosAntes = jugador.puntosRonda || 0;

    // Mover dinosaurio de disponibles a recinto
    jugador.dinosauriosDisponibles.splice(idx, 1);
    jugador.recintos[recinto].push(tipoDino);

    // Hacer que se vea en la pantalla
    RenderManager.agregarDinosaurioVisual(tipoDino, recinto, area);
    
    // Marcar que ya se colocó en este turno
    estadoJuego.yaColocoEnTurno = true;
    estadoJuego.dinosaurioColocadoEnTurno = tipoDino;
    estadoJuego.recintoColocadoEnTurno = recinto;

    // Recalcular puntos y pesos
    this.actualizarPuntos();
    this.actualizarPesos();
    JuegoManager.actualizarInterfaz();
    
    // Efecto visual para mostrar los dinosaurios disponibles con suavidad
    setTimeout(() => {
      RenderManager.actualizarDinosauriosDisponibles();
      DragDropManager.reinitDinosauriosColocados();
    }, 50);
    
    // Ver cuántos puntos se ganaron y mostrárselo al jugador
    const puntosDesues = jugador.puntosRonda || 0;
    const puntosObtenidos = puntosDesues - puntosAntes;
    
    // Habilitar pasar turno
    estadoJuego.puedePasarTurno = true;
    JuegoManager.actualizarBotonSiguiente();
    
    // Mostrar puntos obtenidos con delay
    setTimeout(() => {
      JuegoManager.mostrarAlertaPuntos(puntosObtenidos, tipoDino, recinto);
    }, 350);
    
    // Limpiar tooltips si están disponibles
    if (typeof limpiarTooltips === 'function') {
      limpiarTooltips();
    }
    
    return true;
  },

  /**
   * Motor de cálculo de puntuación del juego
   * Evalúa todos los recintos de un jugador y aplica las reglas específicas de cada uno
   * Maneja tanto funciones dinámicas como tablas estáticas de puntos
   * @param {Object} recintos - Recintos del jugador con sus dinosaurios
   * @param {Object} jugadorActual - Datos del jugador (para reglas comparativas)
   * @param {Array} todosJugadores - Array con todos los jugadores (para competencias)
   * @returns {number} - Puntos totales calculados
   */
  calcularPuntos(recintos, jugadorActual = null, todosJugadores = null) {
    let total = 0;

    // Procesar cada recinto del jugador independientemente
    Object.entries(recintos).forEach(([nombre, dinosaurios]) => {
      const reglas = REGLAS_RECINTOS[nombre];
      if (!reglas) return; // Saltar recintos sin reglas definidas

      let puntos = 0;
      
      // TIPO 1: Recintos con lógica dinámica (funciones)
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
      } 
      // TIPO 2: Recintos con tabla de puntos predefinida (arrays)
      else if (Array.isArray(reglas.puntos)) {
        if (nombre === 'prado-diferencia') {
          const especiesUnicas = new Set(dinosaurios).size;
          puntos = reglas.puntos[especiesUnicas] || 0;
        } else if (nombre === 'bosque-semejanza') {
          if (dinosaurios.length > 0 && dinosaurios.every(d => d === dinosaurios[0])) {
            puntos = reglas.puntos[dinosaurios.length] || 0;
          } else {
            puntos = 0; 
          }
        } else {
          puntos = reglas.puntos[dinosaurios.length] || 0;
        }
      }
      total += puntos;
    });

    return total;
  },

  /**
   * Actualiza los puntos de ambos jugadores
   */
  actualizarPuntos() {
    const todosJugadores = estadoJuego.getTodosJugadores();
    estadoJuego.jugador1.puntosRonda = this.calcularPuntos(estadoJuego.jugador1.recintos, estadoJuego.jugador1, todosJugadores);
    estadoJuego.jugador2.puntosRonda = this.calcularPuntos(estadoJuego.jugador2.recintos, estadoJuego.jugador2, todosJugadores);
  },

  /**
   * Actualiza los cálculos de masa y peso físico de los dinosaurios
   * Utiliza las masas definidas en CONFIG y la gravedad terrestre
   */
  actualizarPesos() {
    const jugador = estadoJuego.getJugadorActual();
    let masaTotal = 0;
    let pesoTotal = 0;

    // Ver cuánto pesan los dinosaurios en cada lugar
    Object.entries(jugador.recintos).forEach(([recinto, dinosaurios]) => {
      // Ver cuánto pesan todos los dinosaurios del lugar (kg)
      const masa = dinosaurios.reduce((sum, dino) => sum + (CONFIG.MASAS_DINOSAURIOS[dino] || 0), 0);
      // Calcular el peso total multiplicando por la gravedad
      const peso = masa * CONFIG.GRAVEDAD;
      
      masaTotal += masa;
      pesoTotal += peso;
      
      // Actualizar lo que se ve en pantalla
      const elemMasa = document.getElementById(`masa-${recinto}`);
      if (elemMasa) elemMasa.textContent = masa.toFixed(0);
      
      const elemPeso = document.getElementById(`peso-${recinto}`);
      if (elemPeso) elemPeso.textContent = peso.toFixed(0);
    });

    // Actualizar totales en la interfaz
    const elemMasaTotal = document.getElementById('masa-total');
    if (elemMasaTotal) elemMasaTotal.textContent = masaTotal.toFixed(0);
    
    const elemPesoTotal = document.getElementById('peso-total');
    if (elemPesoTotal) elemPesoTotal.textContent = pesoTotal.toFixed(0);
  }
};

/*
=============================================================================
SISTEMA DE RENDERIZADO VISUAL
=============================================================================
*/

/**
 * Parte del juego que se encarga de mostrar todo en la pantalla
 * Dibuja los dinosaurios, los lugares del tablero y otros elementos visuales
 * Maneja tanto el tablero principal como el mapa pequeño del oponente
 */
const RenderManager = {
  /**
   * Dibuja todo el tablero del jugador que está jugando ahora
   * Borra lo que había antes y lo vuelve a dibujar
   */
  renderizarTablero() {
    // Quitar dinosaurios que estaban puestos antes
    Utils.limpiarElementos(CONFIG.SELECTORS.dinosaurioColocado);
    // Dibujar los lugares del jugador actual
    this._renderizarRecintos(estadoJuego.getJugadorActual().recintos);
    // Volver a activar arrastrar y soltar después de un momentito
    setTimeout(() => DragDropManager.init(), 50);
  },

  /**
   * Renderiza dinosaurios en cada recinto del jugador
   * @param {Object} recintos - Objeto con los recintos y sus dinosaurios
   */
  _renderizarRecintos(recintos) {
    Object.entries(recintos).forEach(([recinto, dinosaurios]) => {
      const area = document.querySelector(`[data-recinto="${recinto}"]`);
      if (!area) return; // Saltar si no existe el área

      // Crear visual para cada dinosaurio en el recinto
      dinosaurios.forEach((tipo, index) => {
        const img = this.crearDinosaurioVisual(tipo, index + 1, area);
        
        // Desde la ronda 2, los dinosaurios pueden moverse
        if (estadoJuego.rondaActual >= 2) {
          img.draggable = true;
          img.classList.add('dino-arrastreable');
          
          // Agregar datos para el drag & drop
          Object.assign(img.dataset, { recinto, tipo, jugador: estadoJuego.jugadorActual.toString() });
        }
      });
    });
  },

  /**
   * Crea la representación visual de un dinosaurio en el tablero
   * @param {string} tipo - Tipo de dinosaurio
   * @param {number} posicion - Posición dentro del recinto 
   * @param {HTMLElement} area - Elemento DOM del área del recinto
   * @returns {HTMLElement} - Elemento img del dinosaurio creado
   */
  crearDinosaurioVisual(tipo, posicion, area) {
    const jugadorActual = estadoJuego.jugadorActual;
    const recinto = area.dataset.recinto;
    
    // Determinar posición según el tipo de recinto
    let pos;
    if (CONFIG.POSICIONES_NUMERADAS[recinto]) {
      // Recintos que requieren orden específico (izquierda a derecha)
      pos = CONFIG.POSICIONES_NUMERADAS[recinto][(posicion - 1) % CONFIG.POSICIONES_NUMERADAS[recinto].length];
    } else {
      // Recintos con posiciones libres
      pos = CONFIG.POSICIONES_DINOSAURIOS[(posicion - 1) % CONFIG.POSICIONES_DINOSAURIOS.length];
    }
    
    // Crear elemento imagen
    const img = Utils.crearElemento('img', {
      src: CONFIG.IMAGENES_DINOSAURIOS[tipo].colocado, // Imagen de dinosaurio colocado
      className: `dinosaurio-colocado dinosaurio-j${jugadorActual}`,
      alt: tipo,
      dataset: { jugador: jugadorActual.toString(), tipo, recinto }
    });

    // Posicionar el dinosaurio
    img.style.top = pos.top;
    img.style.left = pos.left;
    img.style.pointerEvents = 'auto';

    area.appendChild(img);

    // Si es del jugador actual, habilitar arrastrar para correcciones
    if (jugadorActual === estadoJuego.jugadorActual) {
      img.draggable = true;
      img.classList.add('dino-arrastreable');
      
      // Event listeners para drag & drop de corrección
      img.addEventListener('dragstart', (e) => {
        DragDropManager.dinosaurioArrastrado = e.target;
        DragDropManager.esCorreccion = true; // Marcar como corrección
        DragDropManager.recintoOrigen = recinto;
        
        // Preparar información para arrastrar
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

  /**
   * Agrega un dinosaurio visual al tablero (usado al colocar uno nuevo)
   * @param {string} tipo - Tipo de dinosaurio
   * @param {string} recinto - ID del recinto
   * @param {HTMLElement} area - Elemento DOM del área del recinto
   */
  agregarDinosaurioVisual(tipo, recinto, area) {
    const cantidad = estadoJuego.getJugadorActual().recintos[recinto].length;
    this.crearDinosaurioVisual(tipo, cantidad, area);
  },

  /**
   * Actualiza la visualización de dinosaurios disponibles para arrastrar
   * Muestra los dinosaurios que el jugador actual puede colocar
   */
  actualizarDinosauriosDisponibles() {
    const contenedor = document.querySelector('.dinosaurios-disponibles');
    if (!contenedor) return;

    contenedor.innerHTML = ''; // Limpiar contenido anterior
    
    const jugador = estadoJuego.getJugadorActual();

    // Mostrar mensaje si no hay dinosaurios disponibles
    if (jugador.dinosauriosDisponibles.length === 0) {
      const mensaje = Utils.crearElemento('div', {
        className: 'mensaje-sin-dinosaurios',
        textContent: 'No hay dinosaurios disponibles'
      });
      contenedor.appendChild(mensaje);
      return;
    }

    // Crear elementos visuales para cada dinosaurio disponible
    jugador.dinosauriosDisponibles.forEach((tipo, index) => {
      const img = Utils.crearElemento('img', {
        src: CONFIG.IMAGENES_DINOSAURIOS[tipo].disponible, // Imagen de dinosaurio disponible
        className: 'dino', 
        draggable: true, 
        alt: tipo,
        dataset: { tipo, index: index.toString() }
      });
      
      contenedor.appendChild(img);
    });

    // Reinicializar eventos de drag & drop
    DragDropManager.init();
  }
};

/*
=============================================================================
SISTEMA DE ARRASTRAR Y SOLTAR (DRAG & DROP)
=============================================================================
*/

/**
 * Gestor completo del sistema de drag & drop del juego
 * Maneja tanto interacciones con mouse (desktop) como táctiles (mobile)
 * Controla el arrastre de dinosaurios disponibles y la corrección de movimientos
 */
const DragDropManager = {
  // Estado del sistema de arrastre
  dinosaurioArrastrado: null,         // Referencia al elemento siendo arrastrado
  esCorreccion: false,                // Si es movimiento de corrección (ya colocado)
  recintoOrigen: null,                // Recinto de origen para correcciones
  touchStartPosition: { x: 0, y: 0 }, // Posición inicial del toque (mobile)
  isDragging: false,                  // Flag de estado de arrastre activo
  ghostElement: null,                 // Elemento visual muestra el dinosaurio en el arrastre (mobile)

  /**
   * Inicializa todos los sistemas de drag & drop del juego
   * Configura eventos para dinosaurios disponibles, zonas de drop y dinosaurios colocados
   */
  init() {
    this._initDinosaurios();           // Preparar dinosaurios para poder arrastrarlos
    this._initDropZones();            // Preparar lugares donde se pueden soltar
    setTimeout(() => this._initDinosauriosColocados(), 100); // Preparar dinosaurios que ya están puestos
  },

  // Reinicia solo los dinosaurios que ya están en el tablero
  reinitDinosauriosColocados() {
    setTimeout(() => this._initDinosauriosColocados(), 50);
  },

  // Prepara los dinosaurios disponibles para arrastrar
  _initDinosaurios() {
    document.querySelectorAll(CONFIG.SELECTORS.dino).forEach(dino => {
      // Saltamos dinosaurios que ya están colocados en el tablero
      if (dino.classList.contains('dinosaurio-colocado')) return;
      
      // Creamos una copia nueva del dinosaurio para evitar conflictos
      const newDino = dino.cloneNode(true);
      dino.parentNode.replaceChild(newDino, dino);
      
      // Eventos para computadora (mouse)
      newDino.addEventListener('dragstart', this._handleDragStart.bind(this));
      newDino.addEventListener('dragend', this._handleDragEnd.bind(this));
      
      // Eventos para móvil (mobile)
      newDino.addEventListener('touchstart', this._handleTouchStart.bind(this), { passive: false });
      newDino.addEventListener('touchmove', this._handleTouchMove.bind(this), { passive: false });
      newDino.addEventListener('touchend', this._handleTouchEnd.bind(this), { passive: false });
    });
  },

  // Prepara los lugares donde se pueden soltar los dinosaurios
  _initDropZones() {
    // Lista de eventos que necesitamos saber cuando arrastramos
    const eventHandlers = {
      dragover: this._handleDragover,    // Cuando pasamos por encima de una zona
      drop: this._handleDrop,            // Cuando soltamos el dinosaurio
      dragenter: this._handleDragenter,  // Cuando entramos a una zona
      dragleave: this._handleDragleave   // Cuando salimos de una zona
    };

    // Preparamos todos los recintos para recibir dinosaurios
    document.querySelectorAll(CONFIG.SELECTORS.dropZones).forEach(zone => {
      // Creamos una copia nueva para evitar conflictos
      const newZone = zone.cloneNode(true);
      zone.parentNode.replaceChild(newZone, zone);
      
      // Agregamos todos los eventos de arrastrar a cada recinto
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        newZone.addEventListener(event, handler.bind(this));
      });
    });

    // Preparación de zona de dinosaurios disponibles (para devolverlos)
    const zonaDisponibles = document.querySelector('.dinosaurios-disponibles');
    if (zonaDisponibles) {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        zonaDisponibles.addEventListener(event, handler.bind(this));
      });
    }
  },

  // Prepara los dinosaurios que ya están colocados en el tablero
  _initDinosauriosColocados() {
    const dinosaurios = document.querySelectorAll('.dinosaurio-colocado');
  },

  // Cuando empezamos a arrastrar un dinosaurio que ya está colocado (corrección)
  _handleDragStartCorreccion(e) {
    this.dinosaurioArrastrado = e.target;
    this.esCorreccion = true;
    
    // Buscamos de qué recinto viene el dinosaurio (3 niveles de búsqueda)
    // Nivel 1: Buscar directamente en el dinosaurio (más rápido)
    let recintoOrigen = e.target.dataset.recinto;
    if (!recintoOrigen) {
      // Nivel 2: Buscar en el área cercana
      const area = e.target.closest('[data-recinto]');
      recintoOrigen = area?.dataset.recinto;
    }
    if (!recintoOrigen) {
      // Nivel 3: Buscar en el estado del juego (último recurso)
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
    
    // Preparamos el arrastre para poder corregir errores
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.tipo);
    e.dataTransfer.setData('tipo', e.target.dataset.tipo);
    e.dataTransfer.setData('recinto-origen', this.recintoOrigen);
    e.dataTransfer.setData('correccion', 'true');
  },

  // Cuando empezamos a arrastrar un dinosaurio disponible (movimiento normal)
  _handleDragStart(e) {
    // No permitir arrastrar si hay ventanas abiertas o ya se colocó un dinosaurio
    if (Utils.hayPopupAbierto() || estadoJuego.yaColocoEnTurno) {
      e.preventDefault();
      return;
    }

    this.dinosaurioArrastrado = e.target;
    this.esCorreccion = false;
    this.recintoOrigen = null;
    
    // Preparamos el arrastre normal
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.tipo);
  },

  // Cuando terminamos de arrastrar (limpiamos todo)
  _handleDragEnd(e) {
    e.target.classList.remove('dragging');
    this._limpiarIndicadores();
    Object.assign(this, { dinosaurioArrastrado: null, esCorreccion: false, recintoOrigen: null });
  },

  // Cuando pasamos por encima de una zona (permite soltar)
  _handleDragover(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  },

  // Cuando entramos a una zona (mostramos si se puede soltar)
  _handleDragenter(e) {
    e.preventDefault();
    const zona = e.currentTarget;
    const recinto = zona.dataset.recinto;

    if (!recinto || !this.dinosaurioArrastrado) return;

    const tipoDino = this.dinosaurioArrastrado.dataset.tipo;
    let puedeColocar = false;
    let claseEstilo = 'drop-zone-invalid';
    
    if (this.esCorreccion) {
      // CORRECCIÓN: Devolver un dinosaurio a la bolsa
      // Ejemplo: Devolver un T-Rex del "rio" a la bolsa de dinosaurios
      puedeColocar = true;
      claseEstilo = 'drop-zone-active';
    } else {
      // MOVIMIENTO NORMAL: Arrastras un dinosaurio disponible a los recintos
      // En este caso, debemos verificar todas las reglas del juego
      // Primero verificamos si el recinto está bloqueado por el dado
      const estaBloqueado = GameLogic.estaRecintoBloqueado(recinto);
      if (estaBloqueado) {
        claseEstilo = 'drop-zone-blocked'; // Recinto bloqueado por el dado
      } else {
        // Si no está bloqueado, verificamos las reglas del recinto
        puedeColocar = GameLogic.puedeColocarDinosaurio(recinto, tipoDino);
        claseEstilo = puedeColocar ? 'drop-zone-active' : 'drop-zone-invalid';
      }
    }

    zona.classList.add(claseEstilo);
  },

  // Saca los colores de la zona cuando salimos de ella
  _handleDragleave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drop-zone-active', 'drop-zone-invalid', 'drop-zone-blocked');
    }
  },

  // Cuando soltamos el dinosaurio (acción principal)
  _handleDrop(e) {
    e.preventDefault();
    const area = e.currentTarget;
    const recinto = area.dataset.recinto;
    
    // Obtenemos el tipo de dinosaurio que estamos soltando
    let tipoDino;
    if (e.dataTransfer && e.dataTransfer.getData) {
      tipoDino = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('tipo');
    } else if (this.dinosaurioArrastrado) {
      tipoDino = this.dinosaurioArrastrado.dataset.tipo;
    }

    // Si soltamos en la zona de disponibles y es una corrección, devolvemos el dinosaurio
    if (area.classList.contains('dinosaurios-disponibles') && this.esCorreccion) {
      this._devolverDinosaurioABase(tipoDino);
      this._limpiarIndicadores();
      if (this.isDragging) this._cleanupTouch();
      return;
    }

    // Si no hay recinto o tipo de dinosaurio, cancelamos
    if (!recinto || !tipoDino) {
      this._limpiarIndicadores();
      if (this.isDragging) this._cleanupTouch();
      return;
    }

    // Ejecutamos la acción según el tipo de movimiento
    if (this.esCorreccion) {
      this._manejarCorreccion(recinto, tipoDino, area);
    } else if (GameLogic.puedeColocarDinosaurio(recinto, tipoDino)) {
      GameLogic.colocarDinosaurio(recinto, tipoDino, area);
    }

    this._limpiarIndicadores();
    if (this.isDragging) this._cleanupTouch();
  },

  // Devuelve un dinosaurio del tablero a la zona de disponibles
  _devolverDinosaurioABase(tipoDino) {
    const jugador = estadoJuego.getJugadorActual();
    const recintoOrigenId = this.recintoOrigen;
    
    if (recintoOrigenId && jugador.recintos[recintoOrigenId]) {
      // Quitamos el dinosaurio del recinto
      const index = jugador.recintos[recintoOrigenId].indexOf(tipoDino);
      if (index > -1) {
        jugador.recintos[recintoOrigenId].splice(index, 1);
        
        // Lo devolvemos a la zona de disponibles
        jugador.dinosauriosDisponibles.push(tipoDino);
        
        // Actualizamos la pantalla y los cálculos
        RenderManager.actualizarDinosauriosDisponibles();
        RenderManager.actualizarTablero();
        GameLogic.actualizarPuntos();
        GameLogic.actualizarPesos();
        
        // Si no quedan dinosaurios en ningún recinto, permitimos pasar turno
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

  // Mueve un dinosaurio de un recinto a otro (corrección)
  _manejarCorreccion(recintoDestino, tipoDino, area) {
    if (!this.recintoOrigen || this.recintoOrigen === recintoDestino) return;

    const jugador = estadoJuego.getJugadorActual();
    const reglas = REGLAS_RECINTOS[recintoDestino];
    
    // Verificamos que el recinto destino no esté lleno
    if (reglas?.maxDinos && jugador.recintos[recintoDestino].length >= reglas.maxDinos) return;
    
    // Movemos el dinosaurio de un recinto a otro
    const idxOrigen = jugador.recintos[this.recintoOrigen].indexOf(tipoDino);
    if (idxOrigen !== -1) {
      jugador.recintos[this.recintoOrigen].splice(idxOrigen, 1);
      jugador.recintos[recintoDestino].push(tipoDino);

      // Actualizamos la pantalla y los cálculos
      RenderManager.renderizarTablero();
      GameLogic.actualizarPuntos();
      GameLogic.actualizarPesos();
    }
  },

  // Quita todos los indicadores visuales de las zonas
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
      // Mover el elemento el dinosaurio en el arrastre
      this.ghostElement.style.left = `${touch.clientX - 30}px`;
      this.ghostElement.style.top = `${touch.clientY - 30}px`;
      
      // Encontrar elemento debajo del dedo
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropZone = elementBelow?.closest('.cuadro, .rectangulo');
      
      this._updateDropZoneIndicators(dropZone);
    }
  },

  /**
   * Maneja el evento de fin de toque en dispositivos móviles
   * Determina si el dinosaurio se soltó en una zona válida y ejecuta el drop
   */
  _handleTouchEnd(e) {
    e.preventDefault();
    
    // Si no hay dinosaurio arrastrado o no se está arrastrando, limpiar y salir
    if (!this.dinosaurioArrastrado || !this.isDragging) {
      this._cleanupTouch();
      return;
    }

    // Obtener información del toque final
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('.cuadro, .rectangulo');

    // Si se soltó sobre una zona de drop válida, ejecutar el drop
    if (dropZone) {
      const fakeEvent = {
        preventDefault: () => {},
        currentTarget: dropZone,
        target: dropZone
      };
      this._handleDrop(fakeEvent);
    }

    // Limpiar el estado del arrastre
    this._cleanupTouch();
  },

  /**
   * Crea un dinosaurio transparente para mejorar la experiencia de arrastre en mobile
   * El dino transparente sigue el dedo del usuario y proporciona feedback visual
   */
  _createGhostElement(dino) {
    // Clonar el dinosaurio original para crear el dino transparente
    this.ghostElement = dino.cloneNode(true);
    
    // Configurar estilos del dino transparente
    this.ghostElement.style.position = 'fixed';        // Posición fija respecto al viewport
    this.ghostElement.style.zIndex = '10000';          // Aparecer encima de todos los elementos
    this.ghostElement.style.pointerEvents = 'none';    // No interferir con eventos de toque
    this.ghostElement.style.opacity = '0.8';          // Semi-transparente para indicar el arrastre
    this.ghostElement.style.transform = 'scale(1.1)'; // Ligeramente más grande para mejor visibilidad
    this.ghostElement.style.width = '60px';           // Tamaño fijo para consistencia
    this.ghostElement.style.height = '60px';          // Tamaño fijo para consistencia
    
    // Agregar el dino transparente al DOM
    document.body.appendChild(this.ghostElement);
  },

  /**
   * Actualiza los indicadores visuales de las zonas de drop durante el arrastre
   * Muestra diferentes colores según si la zona es válida, inválida o bloqueada
   */
  _updateDropZoneIndicators(dropZone) {
    // Limpiar indicadores anteriores
    this._limpiarIndicadores();
    
    // Si no hay zona de drop, no hacer nada
    if (!dropZone) return;

    // Obtener información del recinto y tipo de dinosaurio
    const recinto = dropZone.dataset.recinto;
    if (!recinto) return;

    const tipoDino = this.dinosaurioArrastrado.dataset.tipo;
    let puedeColocar = false;
    let claseEstilo = 'drop-zone-invalid'; // Por defecto, zona inválida
    
    // Determinar el tipo de indicador según el contexto
    if (this.esCorreccion) {
      // En correcciones, siempre permitir colocar
      puedeColocar = true;
      claseEstilo = 'drop-zone-active';
    } else {
      // En colocación normal, verificar reglas del juego
      const estaBloqueado = GameLogic.estaRecintoBloqueado(recinto);
      if (estaBloqueado) {
        claseEstilo = 'drop-zone-blocked'; // Zona bloqueada
      } else {
        puedeColocar = GameLogic.puedeColocarDinosaurio(recinto, tipoDino);
        claseEstilo = puedeColocar ? 'drop-zone-active' : 'drop-zone-invalid';
      }
    }

    // Aplicar la clase de estilo correspondiente
    dropZone.classList.add(claseEstilo);
  },

  /**
   * Limpia todos los elementos y estados relacionados con el arrastre táctil
   * Se ejecuta al finalizar cualquier operación de drag & drop en mobile
   */
  _cleanupTouch() {
    // Eliminar el dino transparente si existe
    if (this.ghostElement) {
      this.ghostElement.remove();
      this.ghostElement = null;
    }
    
    // Remover clase de arrastre del dinosaurio original
    if (this.dinosaurioArrastrado) {
      this.dinosaurioArrastrado.classList.remove('dragging');
    }
    
    // Limpiar indicadores visuales de zonas de drop
    this._limpiarIndicadores();
    
    // Resetear todas las variables de estado
    this.dinosaurioArrastrado = null;
    this.isDragging = false;
    this.esCorreccion = false;
    this.recintoOrigen = null;
  }
};

/* SISTEMA DE POPUPS */
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
          if (popup.id === 'popup-descarte' && !estadoJuego.puedePasarTurno) return;
          if (popup.id === 'popup-seleccion-dinosaurios') return;
          if (popup.id === 'popup-seleccion-dado') return;
          Utils.togglePopup(popup, false);
        });
      }
    });
  }
};

/* SISTEMA DE MAPAS */
/**
 * Maneja la visualización del mapa del oponente
 * Permite ver el estado actual del tablero del rival y su puntuación
 */
const MapaOponente = {
  /**
   * Actualiza título, renderiza mini tablero y calcula puntuación
   */
  mostrar() {
    const oponente = estadoJuego.getOponente();
    this._actualizarTitulo(oponente.nombre);
    this._renderizarMiniTablero(oponente.recintos);
    this._mostrarPuntuacion(oponente.recintos);
    Utils.togglePopup(document.getElementById('popup-mapa'), true);
  },

  /**
   * Actualiza el título del popup con el nombre del oponente
   * @param {string} nombre - Nombre del oponente
   */
  _actualizarTitulo(nombre) {
    const titulo = document.getElementById('titulo-mapa');
    if (titulo) {
      titulo.textContent = `MAPA DE ${(nombre || 'OPONENTE').toUpperCase()}`;
    }
  },

  /**
   * Renderiza el mini tablero mostrando los dinosaurios colocados por el oponente
   * @param {Object} recintos - Objeto con los recintos y sus dinosaurios
   */
  _renderizarMiniTablero(recintos) {
    // Limpiar todos los contenedores de mini dinosaurios
    document.querySelectorAll('.mini-dinosaurios').forEach(cont => cont.innerHTML = '');

    // Iterar sobre cada recinto y sus dinosaurios
    Object.entries(recintos).forEach(([recinto, dinosaurios]) => {
      const contenedor = document.getElementById(`mapa-${recinto}`);
      if (!contenedor || dinosaurios.length === 0) return;

      // Crear imagen para cada dinosaurio en el recinto
      dinosaurios.forEach((tipo, index) => {
        const img = this._crearMiniDinosaurio(tipo, index + 1, recinto);
        contenedor.appendChild(img);
      });
    });
  },

  /**
   * Crea un elemento imagen para representar un dinosaurio en el mini mapa
   * @param {string} tipo - Tipo de dinosaurio
   * @param {number} posicion - Posición del dinosaurio en el recinto
   * @param {string} recinto - Nombre del recinto
   * @returns {HTMLElement} Elemento imagen del mini dinosaurio
   */
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
    
    // Crear elemento imagen con estilos específicos para el mini mapa
    return Utils.crearElemento('img', {
      src: CONFIG.IMAGENES_DINOSAURIOS[tipo].colocado,
      className: 'mini-dinosaurio', alt: tipo
    }, {
      position: 'absolute', top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)',
      zIndex: '15', pointerEvents: 'none'
    });
  },

  /**
   * Calcula y muestra la puntuación del oponente en el popup del mapa
   * @param {Object} recintos - Objeto con los recintos y sus dinosaurios
   */
  _mostrarPuntuacion(recintos) {
    const detalles = {};
    let total = 0;
    const oponente = estadoJuego.getOponente();
    const todosJugadores = estadoJuego.getTodosJugadores();

    // Calcular puntos por cada recinto según sus reglas específicas
    Object.entries(recintos).forEach(([nombre, dinosaurios]) => {
      const reglas = REGLAS_RECINTOS[nombre];
      if (!reglas) return;

      let puntos = 0;
      if (typeof reglas.puntos === 'function') {
        // Aplicar función de puntuación específica según el tipo de recinto
        if (nombre === 'isla-solitaria') puntos = reglas.puntos(dinosaurios, recintos);
        else if (nombre === 'rey-jungla') puntos = reglas.puntos(dinosaurios, recintos, oponente, todosJugadores);
        else if (nombre === 'pradera-amor') puntos = reglas.puntos(dinosaurios);
        else puntos = reglas.puntos(dinosaurios.length);
      } else if (Array.isArray(reglas.puntos)) {
        // Usar array de puntos según cantidad de dinosaurios
        puntos = reglas.puntos[dinosaurios.length] || 0;
      }

      detalles[nombre] = puntos;
      total += puntos;
    });

    // Aplicar bonus por T-Rex (1 punto por cada recinto que contenga T-Rex)
    total += Object.values(recintos).filter(recinto => recinto.some(d => d === 't-rex')).length;

    // Actualizar elementos de puntuación individual por recinto
    Object.entries(detalles).forEach(([recinto, puntos]) => {
      const elem = document.getElementById(`puntos-${recinto}`);
      if (elem) elem.textContent = `${puntos} pts`;
    });

    // Actualizar puntuación total
    const totalElem = document.getElementById('puntos-total-oponente');
    if (totalElem) {
      totalElem.innerHTML = `<strong>${total} PUNTOS</strong>`;
    }
  }
};

/* MODO SEGUIMIENTO */
/**
 * Maneja el sistema de seguimiento de dinosaurios por ronda
 * Permite seleccionar dinosaurios al inicio de cada ronda y gestionar restricciones
 */
const ModoSeguimiento = {
  MAX_DINOSAURIOS: 6,        // Máximo de dinosaurios que se pueden seleccionar por ronda
  dinosauriosSeleccionados: [], // Array temporal para almacenar selección actual
  eventListeners: new Map(),    // Mapa para gestionar event listeners y poder removerlos

  /**
   * Muestra el popup para seleccionar dinosaurios al inicio de una ronda
   * Si ya se seleccionaron dinosaurios en esta ronda, restaura la selección anterior
   */
  mostrarPopupSeleccionDinosaurios() {
    const jugadorNum = estadoJuego.jugadorActual;
    const yaSeleccionoEnRonda = (jugadorNum === 1 && estadoJuego.dinosauriosRondaJ1.length > 0) ||
                               (jugadorNum === 2 && estadoJuego.dinosauriosRondaJ2.length > 0);

    // Si ya seleccionó dinosaurios en esta ronda, restaurar la selección anterior
    if (yaSeleccionoEnRonda) {
      this._restaurarDinosauriosGuardados();
      return;
    }

    // Configurar popup para nueva selección
    this._resetearContadores();
    const popup = document.getElementById('popup-seleccion-dinosaurios');
    if (!popup) return;

    // Actualizar título con nombre del jugador y número de ronda
    const titulo = popup.querySelector('h2');
    if (titulo) {
      const nombre = estadoJuego.getJugadorActual().nombre || `Jugador ${estadoJuego.jugadorActual}`;
      titulo.textContent = `${nombre.toUpperCase()} - Seleccionar dinosaurios para RONDA ${estadoJuego.rondaActual}`;
    }

    this._configurarSeleccionDinosaurios();
    Utils.togglePopup(popup, true);
  },

  /**
   * Restaura los dinosaurios previamente seleccionados para esta ronda
   * Elimina dinosaurios ya colocados o descartados de la selección
   */
  _restaurarDinosauriosGuardados() {
    const jugador = estadoJuego.getJugadorActual();
    const jugadorNum = estadoJuego.jugadorActual;
    
    // Obtener dinosaurios seleccionados para esta ronda y los descartados
    const dinosauriosRonda = jugadorNum === 1 ? estadoJuego.dinosauriosRondaJ1 : estadoJuego.dinosauriosRondaJ2;
    const descartados = jugadorNum === 1 ? estadoJuego.descartadosJ1 : estadoJuego.descartadosJ2;
    
    // Restaurar dinosaurios disponibles desde la selección de la ronda
    jugador.dinosauriosDisponibles = [...dinosauriosRonda];
    
    // Eliminar dinosaurios que ya fueron colocados o descartados
    [...descartados, ...Object.values(jugador.recintos).flat()].forEach(dino => {
      const idx = jugador.dinosauriosDisponibles.indexOf(dino);
      if (idx !== -1) jugador.dinosauriosDisponibles.splice(idx, 1);
    });

    // Actualizar interfaz con dinosaurios restaurados
    RenderManager.actualizarDinosauriosDisponibles();
    JuegoManager.actualizarInterfaz();
    
    // Renderizar tablero y reinicializar drag & drop
    setTimeout(() => {
      RenderManager.renderizarTablero();
      DragDropManager.init();
    }, 100);

    // Verificar si necesita restricción de dado
    if (estadoJuego.necesitaRestriccion()) {
      setTimeout(() => this._mostrarPopupSeleccionDado(), 200);
    } else {
      JuegoManager.establecerSinRestriccion();
      window.app?.showScreen?.('partida');
    }
  },

  /**
   * Configura los event listeners para los controles de selección de dinosaurios
   * Limpia listeners anteriores y configura nuevos para evitar duplicados
   */
  _configurarSeleccionDinosaurios() {
    const popup = document.getElementById('popup-seleccion-dinosaurios');
    if (!popup) return;

    // Limpiar event listeners anteriores para evitar duplicados
    this.eventListeners.forEach((listener, element) => {
      element.removeEventListener('click', listener);
    });
    this.eventListeners.clear();

    // Configurar controles para cada tipo de dinosaurio
    popup.querySelectorAll('.dino-selector').forEach(selector => {
      const contador = selector.querySelector('.contador-valor');
      const btnDecrease = selector.querySelector('[data-action="decrease"]');
      const btnIncrease = selector.querySelector('[data-action="increase"]');

      // Configurar botón de disminuir cantidad
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

      // Configurar botón de aumentar cantidad
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

    // Configurar botón de confirmación
    const btnConfirmar = document.getElementById('btn-confirmar-seleccion');
    if (btnConfirmar) btnConfirmar.onclick = () => this._confirmarSeleccionDinosaurios();
  },

  /**
   * Calcula el total de dinosaurios seleccionados sumando todos los contadores
   * @returns {number} Total de dinosaurios seleccionados
   */
  _calcularTotalSeleccionado() {
    return Array.from(document.querySelectorAll('.contador-valor'))
      .reduce((total, contador) => total + (parseInt(contador.textContent) || 0), 0);
  },

  /**
   * Actualiza la interfaz mostrando el total seleccionado y estado del botón de confirmación
   * Habilita/deshabilita el botón según si se alcanzó el máximo requerido
   */
  _actualizarTotalSeleccion() {
    const total = this._calcularTotalSeleccionado();
    const totalElement = document.getElementById('total-dinosaurios');

    // Actualizar elemento de total con estilo condicional
    if (totalElement) {
      totalElement.textContent = total;
      totalElement.classList.toggle('total-correcto', total === this.MAX_DINOSAURIOS);
    }

    // Actualizar estado y texto del botón de confirmación
    const btnConfirmar = document.getElementById('btn-confirmar-seleccion');
    if (btnConfirmar) {
      btnConfirmar.disabled = (total !== this.MAX_DINOSAURIOS);
      btnConfirmar.textContent = total < this.MAX_DINOSAURIOS ?
        `Selecciona ${this.MAX_DINOSAURIOS - total} más` : 'Confirmar selección';
    }
  },

  /**
   * Confirma la selección de dinosaurios y procede con la configuración del juego
   * Valida que se hayan seleccionado exactamente el máximo requerido
   */
  _confirmarSeleccionDinosaurios() {
    const dinosaurios = [];

    // Recopilar todos los dinosaurios seleccionados
    document.querySelectorAll('.dino-selector').forEach(selector => {
      const tipo = selector.dataset.tipo;
      const cantidad = parseInt(selector.querySelector('.contador-valor').textContent) || 0;
      for (let i = 0; i < cantidad; i++) dinosaurios.push(tipo);
    });

    // Validar que se seleccionó la cantidad exacta
    if (dinosaurios.length !== this.MAX_DINOSAURIOS) {
      window.app?.showToast?.(`Debes seleccionar exactamente ${this.MAX_DINOSAURIOS} dinosaurios`, 'error');
      return;
    }

    // Guardar selección según el jugador actual
    const jugadorNum = estadoJuego.jugadorActual;
    if (jugadorNum === 1) {
      estadoJuego.dinosauriosRondaJ1 = [...dinosaurios];
      if (estadoJuego.turnosCompletadosJ1 === 0) estadoJuego.descartadosJ1 = [];
    } else {
      estadoJuego.dinosauriosRondaJ2 = [...dinosaurios];
      if (estadoJuego.turnosCompletadosJ2 === 0) estadoJuego.descartadosJ2 = [];
    }

    // Actualizar dinosaurios disponibles del jugador y cerrar popup
    estadoJuego.getJugadorActual().dinosauriosDisponibles = [...dinosaurios];
    Utils.togglePopup(document.getElementById('popup-seleccion-dinosaurios'), false);
    this._resetearContadores();

    // Actualizar interfaz con la nueva selección
    RenderManager.actualizarDinosauriosDisponibles();
    JuegoManager.actualizarInterfaz();

    // Verificar si necesita restricción de dado o proceder directamente
    if (estadoJuego.necesitaRestriccion()) {
      setTimeout(() => this._mostrarPopupSeleccionDado(), 100);
    } else {
      // Configurar estado inicial del turno
      estadoJuego.yaColocoEnTurno = false;
      estadoJuego.puedePasarTurno = false;
      estadoJuego.dadoNumero = null;
      
      JuegoManager.establecerSinRestriccion();
      window.app?.showScreen?.('partida');

      // Actualizar interfaz completa y reinicializar sistemas
      RenderManager.actualizarDinosauriosDisponibles();
      JuegoManager.actualizarInterfaz();
      JuegoManager.actualizarBotonSiguiente();
      RenderManager.renderizarTablero();
      
      setTimeout(() => DragDropManager.init(), 100);
    }
  },

  /**
   * Resetea todos los contadores y elementos de la interfaz de selección
   * Vuelve al estado inicial para una nueva selección
   */
  _resetearContadores() {
    // Resetear todos los contadores a cero
    document.querySelectorAll('.contador-valor').forEach(contador => contador.textContent = '0');

    // Resetear elemento de total
    const totalElement = document.getElementById('total-dinosaurios');
    if (totalElement) {
      totalElement.textContent = '0';
      totalElement.classList.remove('total-correcto');
    }

    // Resetear botón de confirmación
    const btnConfirmar = document.getElementById('btn-confirmar-seleccion');
    if (btnConfirmar) {
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = `Selecciona ${this.MAX_DINOSAURIOS} dinosaurios`;
    }
  },

  /**
   * Muestra el popup para seleccionar una cara del dado
   * Configura los event listeners para cada opción de dado
   */
  _mostrarPopupSeleccionDado() {
    // Configurar opciones de dado
    document.querySelectorAll('.cara-dado-opcion').forEach(cara => {
      cara.classList.remove('seleccionada');
      cara.onclick = () => this._seleccionarCaraDado(cara);
    });

    // Mostrar popup como obligatorio
    const popup = document.getElementById('popup-seleccion-dado');
    popup.classList.add('obligatorio');
    Utils.togglePopup(popup, true);
  },

  /**
   * Maneja la selección de una cara del dado
   * @param {HTMLElement} cara - Elemento de la cara seleccionada
   */
  _seleccionarCaraDado(cara) {
    // Deseleccionar otras opciones y seleccionar la actual
    document.querySelectorAll('.cara-dado-opcion').forEach(c => c.classList.remove('seleccionada'));
    cara.classList.add('seleccionada');

    // Guardar número de dado seleccionado
    const caraSeleccionada = parseInt(cara.dataset.cara);
    estadoJuego.dadoNumero = caraSeleccionada;

    // Procesar selección después de un breve delay
    setTimeout(() => {
      this._procesarDadoSeleccionado(caraSeleccionada);
      const popup = document.getElementById('popup-seleccion-dado');
      popup.classList.remove('obligatorio');
      Utils.togglePopup(popup, false);
    }, 300);
  },

  /**
   * Procesa la cara del dado seleccionada y configura las restricciones correspondientes
   * @param {number} numeroDado - Número de la cara del dado seleccionada
   */
  _procesarDadoSeleccionado(numeroDado) {
    // Aplicar restricción correspondiente al número del dado
    const restriccion = CONFIG.RESTRICCIONES_DADO[numeroDado];
    if (restriccion) JuegoManager.establecerRestriccion(restriccion.tipo, restriccion.titulo);

    // Configurar estado inicial del turno
    estadoJuego.yaColocoEnTurno = false;
    estadoJuego.puedePasarTurno = false;
    
    // Deshabilitar botón de siguiente turno inicialmente
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) btn.disabled = true;

    // Cambiar a pantalla de partida y actualizar interfaz
    window.app?.showScreen?.('partida');
    RenderManager.actualizarDinosauriosDisponibles();
    JuegoManager.actualizarInterfaz();
    RenderManager.renderizarTablero();
    
    // Reinicializar sistema de drag & drop
    setTimeout(() => DragDropManager.init(), 100);
  }
};

/*
=============================================================================
GESTOR PRINCIPAL DEL JUEGO
=============================================================================
*/

/**
 * Controlador maestro que orquesta todo el flujo del juego
 * Maneja inicialización de partidas, progresión de turnos/rondas, 
 * descarte de dinosaurios, y finalización con resultados
 */
const JuegoManager = {
  // Variables para manejo de descarte
  dinoSeleccionadoDescarte: null, tipoSeleccionadoDescarte: null,

  /**
   * Inicializa una nueva partida con configuraciones específicas
   * @param {Array} jugadores - Array con nombres de los jugadores
   * @param {Object} jugador2Info - Información del segundo jugador
   * @param {number} primerJugador - Jugador que inicia (1 o 2)
   * @param {boolean} modoSeguimiento - Si usa modo seguimiento o normal
   */
  inicializarPartida(jugadores, jugador2Info, primerJugador, modoSeguimiento = false) {
    // Resetear todo el estado del juego
    estadoJuego.reset();

    // Configurar parámetros iniciales
    Object.assign(estadoJuego, {
      modoSeguimiento,
      primerJugador, primerJugadorOriginal: primerJugador, jugadorActual: primerJugador,
      turnosCompletadosJ1: 0, turnosCompletadosJ2: 0, descartadosJ1: [], descartadosJ2: []
    });

    // Asignar nombres de jugadores
    estadoJuego.jugador1.nombre = jugadores[0] || 'Jugador 1';
    estadoJuego.jugador2.nombre = jugadores[1] || 'Jugador 2';

    // Configurar información del segundo jugador si existe app
    if (window.app) window.app.jugador2Info = jugador2Info || { tipo: 'invitado' };

    // Configuración específica según el modo de juego
    if (modoSeguimiento) {
      // Modo seguimiento: configuración manual
      estadoJuego.turnoEnRonda = 1;
      estadoJuego.rondaActual = 1;
    } else {
      // Modo normal: configuración automática
      this._generarPoolDinosaurios();
      this._iniciarRonda();
    }
  },

  /**
   * Genera el conjunto general de dinosaurios disponibles para repartir
   * Crea múltiples copias de cada tipo según MAX_DINOSAURIOS_POOL
   */
  _generarPoolDinosaurios() {
    estadoJuego.repartosDisponibles = Utils.mezclarArray(
      CONFIG.TIPOS_DINOSAURIOS.flatMap(tipo => Array(CONFIG.MAX_DINOSAURIOS_POOL).fill(tipo))
    );
  },

  /**
   * Inicia una nueva ronda del juego
   * Reparte dinosaurios si no está en modo seguimiento y configura el turno inicial
   */
  _iniciarRonda() {
    if (!estadoJuego.modoSeguimiento) this._repartirDinosaurios();
    this._configurarTurnoInicial();
  },

  /**
   * Limpia completamente el tablero y resetea el estado de los jugadores
   * Elimina todos los dinosaurios colocados y resetea puntos de ronda
   */
  limpiarTablero() {
    // Limpiar elementos visuales de dinosaurios colocados
    Utils.limpiarElementos(CONFIG.SELECTORS.dinosaurioColocado);

    // Resetear recintos y puntos de ronda para ambos jugadores
    [estadoJuego.jugador1, estadoJuego.jugador2].forEach(jugador => {
      Object.keys(jugador.recintos).forEach(recinto => jugador.recintos[recinto] = []);
      jugador.puntosRonda = 0;
    });

    // Actualizar interfaz completa
    RenderManager.renderizarTablero();
    GameLogic.actualizarPuntos();
    GameLogic.actualizarPesos();
    this.actualizarInterfaz();
  },

  /**
   * Reparte dinosaurios aleatorios a ambos jugadores para la ronda actual
   * Genera nuevo conjunto si no hay suficientes dinosaurios disponibles
   */
  _repartirDinosaurios() {
    const dinosauriosNecesarios = CONFIG.DINOSAURIOS_POR_RONDA * 2; // 6 por cada jugador
    if (estadoJuego.repartosDisponibles.length < dinosauriosNecesarios) {
      this._generarPoolDinosaurios();
    }

    // Función auxiliar para tomar dinosaurios aleatorios del conjunto
    const tomarDinos = (cantidad) => {
      const dinos = [];
      for (let i = 0; i < cantidad && estadoJuego.repartosDisponibles.length > 0; i++) {
        const idx = Math.floor(Math.random() * estadoJuego.repartosDisponibles.length);
        dinos.push(estadoJuego.repartosDisponibles.splice(idx, 1)[0]);
      }
      return dinos;
    };

    // Repartir dinosaurios a ambos jugadores
    estadoJuego.jugador1.dinosauriosDisponibles = tomarDinos(CONFIG.DINOSAURIOS_POR_RONDA);
    estadoJuego.jugador2.dinosauriosDisponibles = tomarDinos(CONFIG.DINOSAURIOS_POR_RONDA);
    
  },

  /**
   * Configura el estado inicial de un turno
   * Establece restricciones según si es primer turno de ronda o no
   */
  _configurarTurnoInicial() {
    // Resetear estado del turno
    Object.assign(estadoJuego, { puedePasarTurno: false, yaColocoEnTurno: false });
    
    // Deshabilitar botón de siguiente turno inicialmente
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) btn.disabled = true;

    // Configurar restricciones según el turno
    if (estadoJuego.esPrimerTurnoDeRonda()) {
      this.establecerSinRestriccion();
    } else {
      this._ocultarRestriccion();
    }

    // Actualizar interfaz completa
    RenderManager.actualizarDinosauriosDisponibles();
    this.actualizarInterfaz();
    RenderManager.renderizarTablero();
    this.actualizarBotonSiguiente();
  },

  /**
   * Procesa la transición al siguiente turno
   * Maneja descarte, validaciones y cambio de turno según el modo de juego
   */
  procesarSiguienteTurno() {
    const jugadorActual = estadoJuego.getJugadorActual();
    const tienenDinosaurios = jugadorActual.dinosauriosDisponibles.length > 0;
    
    // Si ya colocó y tiene dinosaurios restantes, mostrar popup de descarte
    if (estadoJuego.yaColocoEnTurno && tienenDinosaurios) {
      this.mostrarPopupDescarte();
      return;
    }
    
    // Validar que haya colocado un dinosaurio si tiene disponibles
    if (tienenDinosaurios) {
      if (!estadoJuego.yaColocoEnTurno) {
        window.app?.showToast?.('Debes colocar un dinosaurio primero', 'warning');
        return;
      }
    }

    // Verificar si es fin de ronda
    if (estadoJuego.esFinDeRonda()) {
      this._finalizarRonda();
      return;
    }

    // Cambiar turno y procesar según el modo
    estadoJuego.cambiarTurno();

    if (estadoJuego.modoSeguimiento) {
      this._procesarTurnoSeguimiento();
    } else {
      this._procesarTurnoNormal();
    }
  },

  /**
   * Procesa el cambio de turno en modo seguimiento
   * Muestra la interfaz de selección de dinosaurios para el nuevo jugador
   */
  _procesarTurnoSeguimiento() {
    this.limpiarIndicadoresTurno();
    
    const jugador = estadoJuego.getJugadorActual();
    const avatarSrc = estadoJuego.jugadorActual === 1 ?
      'img/foto_usuario-1.png' :
      (window.app?.jugador2Info?.tipo === 'invitado' ? 'img/invitado.png' : 'img/foto_usuario-2.png');

    window.app?.mostrarTurnoJugadorConSeleccion?.(jugador.nombre, avatarSrc);
  },

  /**
   * Procesa el cambio de turno en modo normal
   * Muestra animación de dado o configura sin restricción según el turno
   */
  _procesarTurnoNormal() {
    if (window.app?.showScreen) {
      this.limpiarIndicadoresTurno();
      
      if (estadoJuego.esPrimerTurnoAbsoluto()) {
        // La pantalla ya se muestra desde app.js
        this.establecerSinRestriccion();
      } else {
        window.app.showScreen('dado-animacion');
        setTimeout(() => window.app.iniciarAnimacionDado(), 400);
      }
    } else {
      this._ocultarRestriccion();
      RenderManager.actualizarDinosauriosDisponibles();
      this.actualizarInterfaz();
      RenderManager.renderizarTablero();
    }
  },

  /**
   * Procesa el resultado del dado y aplica la restricción correspondiente
   * @param {number} numeroDado - Número obtenido en el dado
   */
  procesarResultadoDado(numeroDado) {
    estadoJuego.dadoNumero = numeroDado;
    const restriccion = CONFIG.RESTRICCIONES_DADO[numeroDado || 1];
    if (restriccion) this.establecerRestriccion(restriccion.tipo, restriccion.titulo);

    // Mostrar pantalla de partida
    const partida = document.getElementById('pantalla-partida');
    if (partida) partida.classList.add('pantalla-partida-visible');

    // Actualizar interfaz completa
    RenderManager.actualizarDinosauriosDisponibles();
    this.actualizarInterfaz();
    RenderManager.renderizarTablero();
    this.actualizarBotonSiguiente();
  },

  /**
   * Establece una restricción activa en el juego
   * @param {string} tipo - Tipo de restricción
   * @param {string} titulo - Título de la restricción
   */
  establecerRestriccion(tipo, titulo) {
    estadoJuego.restriccionActual = tipo;
    estadoJuego.dadoNumero = estadoJuego.dadoNumero || 1;

    const info = document.querySelector('.info-restriccion');
    const icono = document.querySelector('.icono-restriccion-footer');
    const texto = document.querySelector('.texto-restriccion');

    // Mostrar información de restricción
    if (info) info.classList.add('restriccion-visible');
    if (icono && tipo) {
      const restriccion = Object.values(CONFIG.RESTRICCIONES_DADO).find(r => r.tipo === tipo);
      if (restriccion) {
        icono.src = `img/${restriccion.imagen}.png`;
        icono.classList.remove('icono-restriccion-ocultar');
        icono.classList.add('icono-restriccion-mostrar');
      }
    }
    
    // Actualizar texto de restricción
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

  /**
   * Establece el juego sin restricciones activas
   * Todos los recintos quedan disponibles para colocar dinosaurios
   */
  establecerSinRestriccion() {
    estadoJuego.restriccionActual = null;

    const info = document.querySelector('.info-restriccion');
    const texto = document.querySelector('.texto-restriccion');
    const icono = document.querySelector('.icono-restriccion-footer');

    // Mostrar información de sin restricción
    if (info) info.classList.add('restriccion-visible');
    if (texto) {
      texto.innerHTML = `<div>Sin restricción</div><div class="texto-sin-restriccion">Todos los recintos disponibles</div>`;
    }
    if (icono) {
      icono.classList.remove('icono-restriccion-mostrar');
      icono.classList.add('icono-restriccion-ocultar');
    }
  },

  /**
   * Oculta la información de restricción en la interfaz
   * Se usa cuando no se debe mostrar información de restricción
   */
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

  /**
   * Muestra el popup para descartar un dinosaurio
   * Permite al jugador seleccionar qué dinosaurio descartar antes de pasar turno
   */
  mostrarPopupDescarte() {
    const jugador = estadoJuego.getJugadorActual();

    // Si no tiene dinosaurios, puede pasar turno directamente
    if (jugador.dinosauriosDisponibles.length === 0) {
      estadoJuego.puedePasarTurno = true;
      this._habilitarBotonSiguiente();
      return;
    }

    const popup = document.getElementById('popup-descarte');
    const contenedor = document.getElementById('dinosaurios-descarte');

    if (!popup || !contenedor) return;

    // Limpiar contenedor y resetear selección
    contenedor.innerHTML = '';
    this.dinoSeleccionadoDescarte = null;
    this.tipoSeleccionadoDescarte = null;

    // Crear imágenes para cada dinosaurio disponible
    jugador.dinosauriosDisponibles.forEach((tipo, index) => {
      const img = Utils.crearElemento('img', {
        src: CONFIG.IMAGENES_DINOSAURIOS[tipo].disponible,
        className: 'dino-descarte', alt: tipo,
        dataset: { tipo, index: index.toString() }
      });

      img.onclick = () => this._seleccionarParaDescarte(img, index, tipo);
      contenedor.appendChild(img);
    });

    // Configurar botón de confirmación
    const btnConfirmar = document.getElementById('btn-confirmar-descarte');
    if (btnConfirmar) {
      btnConfirmar.disabled = true;
      btnConfirmar.onclick = () => this._confirmarDescarte();
    }

    Utils.togglePopup(popup, true);
  },

  /**
   * Maneja la selección de un dinosaurio para descarte
   * @param {HTMLElement} elemento - Elemento imagen del dinosaurio
   * @param {number} index - Índice del dinosaurio en el array
   * @param {string} tipo - Tipo de dinosaurio
   */
  _seleccionarParaDescarte(elemento, index, tipo) {
    // Deseleccionar otros dinosaurios y seleccionar el actual
    document.querySelectorAll(CONFIG.SELECTORS.dinoDescarte).forEach(d => d.classList.remove('seleccionado'));
    elemento.classList.add('seleccionado');
    
    // Guardar selección
    this.dinoSeleccionadoDescarte = index;
    this.tipoSeleccionadoDescarte = tipo;

    // Habilitar botón de confirmación
    const btnConfirmar = document.getElementById('btn-confirmar-descarte');
    if (btnConfirmar) btnConfirmar.disabled = false;
  },

  /**
   * Confirma el descarte del dinosaurio seleccionado
   * Elimina el dinosaurio del jugador y procede automáticamente al siguiente turno
   */
  _confirmarDescarte() {
    if (this.dinoSeleccionadoDescarte === null || !this.tipoSeleccionadoDescarte) return;

    const jugador = estadoJuego.getJugadorActual();
    
    // Eliminar dinosaurio seleccionado
    if (this.dinoSeleccionadoDescarte >= 0 && 
        this.dinoSeleccionadoDescarte < jugador.dinosauriosDisponibles.length) {
      
      const dinoEliminado = jugador.dinosauriosDisponibles.splice(this.dinoSeleccionadoDescarte, 1)[0];
      estadoJuego.dinosauriosDescartados.push(dinoEliminado);
      
      // Registrar descarte según el jugador
      if (estadoJuego.jugadorActual === 1) {
        estadoJuego.descartadosJ1.push(dinoEliminado);
      } else {
        estadoJuego.descartadosJ2.push(dinoEliminado);
      }
    }

    // Cerrar popup y limpiar selección
    Utils.togglePopup(document.getElementById('popup-descarte'), false);
    this.dinoSeleccionadoDescarte = null;
    this.tipoSeleccionadoDescarte = null;

    // Resetear estado del turno
    estadoJuego.puedePasarTurno = false;
    estadoJuego.yaColocoEnTurno = false;
    
    RenderManager.actualizarDinosauriosDisponibles();
    
    // Procesar siguiente turno automáticamente
    setTimeout(() => {
      if (estadoJuego.esFinDeRonda()) {
        JuegoManager._finalizarRonda();
      } else {
        estadoJuego.cambiarTurno();
        if (estadoJuego.modoSeguimiento) {
          JuegoManager._procesarTurnoSeguimiento();
        } else {
          JuegoManager._procesarTurnoNormal();
        }
      }
    }, 500);
  },

  /**
   * Habilita el botón de siguiente turno según las condiciones del juego
   * Se habilita cuando el jugador no tiene dinosaurios o ya colocó y puede pasar turno
   */
  _habilitarBotonSiguiente() {
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      const jugador = estadoJuego.getJugadorActual();
      const sinDinosaurios = jugador.dinosauriosDisponibles.length === 0;
      
      btn.disabled = !(sinDinosaurios || (estadoJuego.yaColocoEnTurno && estadoJuego.puedePasarTurno));
      this.actualizarBotonSiguiente();
    }
  },

  /**
   * Actualiza el estado y texto del botón de siguiente turno
   * Cambia el texto según si es fin de ronda o fin de juego
   */
  actualizarBotonSiguiente() {
    const btn = document.getElementById('btn-siguiente-turno');
    if (!btn) return;

    const jugador = estadoJuego.getJugadorActual();
    const sinDinosaurios = jugador.dinosauriosDisponibles.length === 0;
    
    // Habilitar/deshabilitar según condiciones
    btn.disabled = !(sinDinosaurios || (estadoJuego.yaColocoEnTurno && estadoJuego.puedePasarTurno));

    // Cambiar texto según el estado del juego
    if (estadoJuego.esFinDeRonda()) {
      btn.textContent = estadoJuego.rondaActual < CONFIG.TOTAL_RONDAS ? 'Finalizar ronda' : 'Fin del juego';
    } else {
      btn.textContent = 'Siguiente turno';
    }
  },

  /**
   * Limpia los indicadores visuales de turno activo
   * Remueve las clases que indican qué jugador tiene el turno
   */
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

  /**
   * Actualiza todos los elementos de la interfaz de usuario
   * Incluye nombres, avatares, puntos, indicadores de turno y restricciones
   */
  actualizarInterfaz() {
    const jugador = estadoJuego.getJugadorActual();
    const oponente = estadoJuego.getOponente();

    // Actualizar nombre del jugador actual
    const textoJugador = document.querySelector('.texto-jugador');
    if (textoJugador) {
      textoJugador.textContent = jugador.nombre.toUpperCase();
    }

    // Actualizar información del oponente
    const nombrePuntos = document.querySelector('.nombre-puntos');
    if (nombrePuntos) {
      nombrePuntos.textContent = `${oponente.nombre.toUpperCase()} - ${parseInt(oponente.puntosRonda) || 0} PUNTOS`;
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

    // Obtener referencias a los elementos de avatar
    const avatarJugador2Top = document.getElementById('avatar-jugador2-top');
    const avatarJugador1Bottom = document.querySelector('.info-jugador .avatar-circular');

    // Configurar avatares según quién tiene el turno
    if (estadoJuego.jugadorActual === 1) {
      // Jugador 1 tiene el turno: su avatar abajo, jugador 2 arriba
      if (avatarJugador1Bottom) avatarJugador1Bottom.src = 'img/foto_usuario-1.png';
      if (avatarJugador2Top) {
        avatarJugador2Top.src = window.app?.jugador2Info?.tipo === 'invitado' ?
          'img/invitado.png' : 'img/foto_usuario-2.png';
      }
    } else {
      // Jugador 2 tiene el turno: su avatar abajo, jugador 1 arriba
      if (avatarJugador1Bottom) {
        avatarJugador1Bottom.src = window.app?.jugador2Info?.tipo === 'invitado' ?
          'img/invitado.png' : 'img/foto_usuario-2.png';
      }
      if (avatarJugador2Top) avatarJugador2Top.src = 'img/foto_usuario-1.png';
    }

    // Actualizar icono de restricción según el estado actual
    const iconoRestriccion = document.querySelector('.icono-restriccion-footer');
    if (iconoRestriccion) {
      if (estadoJuego.dadoNumero && estadoJuego.restriccionActual) {
        // Hay restricción activa: mostrar icono correspondiente
        const restriccion = CONFIG.RESTRICCIONES_DADO[estadoJuego.dadoNumero];
        if (restriccion) {
          iconoRestriccion.src = `img/${restriccion.imagen}.png`;
          iconoRestriccion.classList.remove('icono-restriccion-ocultar');
          iconoRestriccion.classList.add('icono-restriccion-mostrar');
        }
      } else {
        // No hay restricción: ocultar icono
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

    // Actualizar lógica de puntos
    GameLogic.actualizarPuntos();
  },

  /**
   * Finaliza la ronda actual y determina si mostrar resumen o pantalla final
   * Calcula puntos y decide si continuar con siguiente ronda o terminar el juego
   */
  _finalizarRonda() {
    this._calcularPuntosRonda();

    if (estadoJuego.rondaActual < CONFIG.TOTAL_RONDAS) {
      this._mostrarResumenRonda();
    } else {
      this._mostrarPantallaFinal();
    }
  },

  /**
   * Calcula los puntos obtenidos por cada jugador en la ronda actual
   * Actualiza tanto los puntos de ronda como los puntos totales
   */
  _calcularPuntosRonda() {
    const todosJugadores = estadoJuego.getTodosJugadores();
    
    // Calcular puntos para cada jugador
    const puntosRondaJ1 = GameLogic.calcularPuntos(estadoJuego.jugador1.recintos, estadoJuego.jugador1, todosJugadores);
    const puntosRondaJ2 = GameLogic.calcularPuntos(estadoJuego.jugador2.recintos, estadoJuego.jugador2, todosJugadores);

    // Actualizar puntos de ronda y totales
    estadoJuego.jugador1.puntosRonda = puntosRondaJ1;
    estadoJuego.jugador2.puntosRonda = puntosRondaJ2;
    estadoJuego.jugador1.puntos += puntosRondaJ1;
    estadoJuego.jugador2.puntos += puntosRondaJ2;
  },

  /**
   * Muestra la pantalla de resumen de ronda
   * Configura el botón para continuar a la siguiente ronda
   */
  _mostrarResumenRonda() {
    if (window.app?.showScreen) {
      this.limpiarIndicadoresTurno();
      window.app.showScreen('resumen-ronda');
      this._actualizarResumenRonda();

      const btnSiguiente = document.getElementById('btn-siguiente-ronda');
      if (btnSiguiente) btnSiguiente.onclick = () => this._prepararSiguienteRonda();
    }
  },

  /**
   * Actualiza los elementos de la pantalla de resumen de ronda
   * Muestra puntos totales, nombres de jugadores y número de ronda
   */
  _actualizarResumenRonda() {
    const elementos = {
      'puntos-resumen-j1': `${estadoJuego.jugador1.puntos} puntos totales`,
      'puntos-resumen-j2': `${estadoJuego.jugador2.puntos} puntos totales`,
      'nombre-resumen-j1': estadoJuego.jugador1.nombre.toUpperCase(),
      'nombre-resumen-j2': estadoJuego.jugador2.nombre.toUpperCase(),
      'numero-ronda-resumen': `#${estadoJuego.rondaActual}`
    };

    // Actualizar cada elemento con su valor correspondiente
    Object.entries(elementos).forEach(([id, valor]) => {
      const elem = document.getElementById(id);
      if (elem) elem.textContent = valor;
    });
  },

  /**
   * Prepara la siguiente ronda del juego
   * Incrementa número de ronda, alterna quién empieza y resetea estado
   */
  _prepararSiguienteRonda() {

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

    // Resetear estado de la nueva ronda
    Object.assign(estadoJuego, {
      turnosCompletadosJ1: 0, turnosCompletadosJ2: 0, descartadosJ1: [], descartadosJ2: [],
      dinosauriosRondaJ1: [], dinosauriosRondaJ2: [], dinosauriosDescartados: []
    });
    
    // Limpiar dinosaurios disponibles de ambos jugadores
    estadoJuego.jugador1.dinosauriosDisponibles = [];
    estadoJuego.jugador2.dinosauriosDisponibles = [];


    // Iniciar nueva ronda según el modo de juego
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

  /**
   * Muestra la pantalla final del juego con los resultados
   * Se ejecuta cuando se han completado todas las rondas
   */
  _mostrarPantallaFinal() {
    if (window.app?.showScreen) {
      this.limpiarIndicadoresTurno();
      window.app.showScreen('resultados');
      this._actualizarPantallaFinal();
    }
  },

  /**
   * Actualiza la pantalla final con los resultados del juego
   * Determina el ganador y actualiza todos los elementos visuales
   */
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
      if (ganador === j1) {
        avatarGanador.style.backgroundImage = 'url("img/foto_usuario-1.png")';
      } else {
        avatarGanador.style.backgroundImage = window.app?.jugador2Info?.tipo === 'invitado' ?
          'url("img/invitado.png")' : 'url("img/foto_usuario-2.png")';
      }
    }

    // Actualizar elementos del perdedor (segunda posición)
    const nombrePerdedor = document.getElementById('nombre-final-j2');
    const puntosPerdedor = document.getElementById('puntos-final-j2');
    const avatarPerdedor = document.getElementById('avatar-final-j2');

    if (nombrePerdedor) nombrePerdedor.textContent = perdedor.nombre.toUpperCase();
    if (puntosPerdedor) puntosPerdedor.textContent = `${perdedor.puntos} puntos`;
    if (avatarPerdedor) {
      if (perdedor === j1) {
        avatarPerdedor.style.backgroundImage = 'url("img/foto_usuario-1.png")';
      } else {
        avatarPerdedor.style.backgroundImage = window.app?.jugador2Info?.tipo === 'invitado' ?
          'url("img/invitado.png")' : 'url("img/foto_usuario-2.png")';
      }
    }

    // Actualizar podio
    const avatarPrimero = document.getElementById('avatar-primero');
    const avatarSegundo = document.getElementById('avatar-segundo');

    if (avatarPrimero) {
      if (ganador === j1) {
        avatarPrimero.style.backgroundImage = 'url("img/foto_usuario-1.png")';
      } else {
        avatarPrimero.style.backgroundImage = window.app?.jugador2Info?.tipo === 'invitado' ?
          'url("img/invitado.png")' : 'url("img/foto_usuario-2.png")';
      }
    }

    if (avatarSegundo) {
      if (perdedor === j1) {
        avatarSegundo.style.backgroundImage = 'url("img/foto_usuario-1.png")';
      } else {
        avatarSegundo.style.backgroundImage = window.app?.jugador2Info?.tipo === 'invitado' ?
          'url("img/invitado.png")' : 'url("img/foto_usuario-2.png")';
      }
    }
  },

  /**
   * Muestra una alerta con los puntos obtenidos al colocar un dinosaurio
   * @param {number} puntosObtenidos - Puntos obtenidos
   * @param {string} tipoDino - Tipo de dinosaurio colocado
   * @param {string} recinto - Recinto donde se colocó
   */
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


  /**
   * Convierte el identificador de recinto a su nombre legible
   * @param {string} recinto - Identificador del recinto
   * @returns {string} Nombre legible del recinto
   */
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

  /**
   * Convierte el identificador de dinosaurio a su nombre legible
   * @param {string} tipo - Identificador del dinosaurio
   * @returns {string} Nombre legible del dinosaurio
   */
  _obtenerNombreDinosaurio(tipo) {
    const nombres = {
      't-rex': 'T-Rex',
      'triceratops': 'Triceratops',
      'diplodocus': 'Diplodocus',
      'stegosaurus': 'Stegosaurus',
      'parasaurolophus': 'Parasaurolophus',
      'pterodáctilo': 'Pterodáctilo'
    };
    return nombres[tipo] || tipo;
  },

  /**
   * Reinicia completamente el juego
   * Resetea el estado y regenera el conjunto de dinosaurios
   */
  reiniciarJuegoCompleto() {
    estadoJuego.reset();
    this._generarPoolDinosaurios();
  },

  /**
   * Método público para preparar la siguiente ronda
   * @returns {void}
   */
  prepararSiguienteRonda() {
    return this._prepararSiguienteRonda();
  }
};

/*
=============================================================================
FUNCIONES DE INTERFAZ E INTERACCIONES
=============================================================================
*/

/**
 * Muestra u oculta el detalle de un consejo al hacer click
 * Implementa un sistema de acordeón para los consejos del juego
 * @param {HTMLElement} elemento - Elemento de consejo clickeado
 */
function mostrarDetalleConsejo(elemento) {
  // Colapsar otros consejos abiertos
  document.querySelectorAll('.consejo-item').forEach(item => {
    if (item !== elemento) {
      item.classList.remove('expandido');
    }
  });
  
  // Toggle del consejo actual (expandir/colapsar)
  elemento.classList.toggle('expandido');
  
  // Scroll suave al elemento si se expandió
  if (elemento.classList.contains('expandido')) {
    elemento.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest' 
    });
  }
}

/**
 * Muestra una alerta visual en la interfaz del juego
 * @param {string} mensaje - Mensaje a mostrar (puede incluir HTML)
 * @param {string} tipo - Tipo de alerta ('info', 'warning', 'success', 'error')
 * @param {number} duracion - Tiempo en milisegundos antes de auto-cerrar
 */
function mostrarAlertaJuego(mensaje, tipo = 'info', duracion = 5000) {
  // Determinar el icono según el tipo de alerta
  const iconos = {
    'info': 'img/icono_informacion.png',
    'warning': 'img/icono_informacion.png',
    'success': 'img/icono_ganador.png',
    'error': 'img/icono_informacion.png'
  };
  
  // Crear elemento de alerta
  const alerta = document.createElement('div');
  alerta.className = `alerta-juego alerta-${tipo}`;
  alerta.innerHTML = `
    <div class="alerta-contenido">
      <img src="${iconos[tipo] || iconos.info}" alt="${tipo}" class="alerta-icono">
      <span class="alerta-mensaje">${mensaje}</span>
      <button class="alerta-cerrar" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // Agregar al DOM (aparece en pantalla)
  document.body.appendChild(alerta);
  
  // Auto-remover después del tiempo especificado
  setTimeout(() => {
    if (alerta.parentElement) {
      alerta.remove();
    }
  }, duracion);
}

/**
 * Muestra ayuda específica sobre cómo funciona cada lugar del tablero
 * Explica las reglas y cómo se calculan los puntos de cada recinto
 */
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

/**
 * Muestra qué lugares están disponibles según el número del dado
 * Le dice al jugador dónde puede poner dinosaurios según la restricción
 */
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

/**
 * Muestra consejos de estrategia para ayudar al jugador
 * Da tips útiles sobre cómo jugar mejor según la situación
 */
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

/*
=============================================================================
INICIALIZACIÓN Y CONFIGURACIÓN DE EVENTOS DOM
=============================================================================
*/

/**
 * Configuración principal que se ejecuta cuando el DOM está completamente cargado
 * Establece todos los event listeners, inicializa sistemas y expone APIs globales
 * Es el punto de entrada principal para la funcionalidad del tablero
 */
document.addEventListener('DOMContentLoaded', () => {
  // Configuración del botón principal de progresión del juego
  const btnSiguiente = document.getElementById('btn-siguiente-turno');
  if (btnSiguiente) {
    btnSiguiente.addEventListener('click', () => JuegoManager.procesarSiguienteTurno());
  }

  // Inicialización del sistema de ventanas emergentes (popups/modales)
  PopupManager.setupEventListeners();

  // Configuración del botón para visualizar el tablero del oponente
  const verMapa = document.querySelector('.ver-mapa');
  if (verMapa) {
    verMapa.addEventListener('click', (e) => {
      e.preventDefault();
      MapaOponente.mostrar();
    });
  }



  // Sistema de "deshacer" mediante doble click en dinosaurios colocados
  // Permite al jugador corregir su último movimiento del turno actual
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

  // Sistema de ayuda emergente para móviles (tocar recintos)
  let tooltipActivo = null;
  
  /**
   * Quita todas las ayudas emergentes que estén abiertas
   * Limpia la pantalla de ventanitas de información
   */
  function limpiarTooltips() {
    if (tooltipActivo) {
      tooltipActivo.elemento.remove();
      tooltipActivo = null;
    }
    document.querySelectorAll('.tooltip-click').forEach(tooltip => tooltip.remove());
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

  // Hacer que todas las funciones importantes estén disponibles en toda la aplicación
  // Esto permite que otros archivos y el HTML puedan usar estas funciones
  Object.assign(window, {
    // Los controladores principales del juego
    JuegoManager, estadoJuego, ModoSeguimiento, RenderManager,
    
    // Funciones para mostrar ventanas y elementos de la interfaz
    mostrarReglas: () => PopupManager.mostrarReglas(),
    mostrarPesos: () => PopupManager.mostrarPesos(),
    mostrarMapa: () => MapaOponente.mostrar(),
    cerrarPopup: (id) => PopupManager.cerrar(id),
    limpiarIndicadoresTurno: () => JuegoManager.limpiarIndicadoresTurno(),
    limpiarTooltips,
    
    // Función para cancelar partida con confirmación
    cancelarPartida: () => {
      if (confirm('¿Estás seguro de que quieres cancelar la partida actual?')) {
        estadoJuego.reset();
        window.app?.showScreen?.('lobby');
        mostrarAlertaJuego('Partida cancelada', 'info', 2000);
      }
    },
    
    // Sistema de consejos y mensajes para el jugador
    mostrarDetalleConsejo,
    mostrarAlertaJuego,
    mostrarConsejoContextual,
    mostrarAlertaRestriccionDado,
    mostrarConsejoEstrategia
  });

  // Si existe la aplicación principal, conectar el modo seguimiento
  if (window.app) {
    /**
     * Función que inicia el turno en modo seguimiento
     * Permite al jugador elegir sus dinosaurios manualmente
     */
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


