/* ==================== CONFIGURACIÓN Y ESTADO GLOBAL ==================== */
const CONFIG = {
  IMAGENES_DINOSAURIOS: {
    't-rex': { disponible: 'img/dino-t-rex.png', colocado: 'img/dino-t-rex-arriba.png' },
    'triceratops': { disponible: 'img/dino-triceratops.png', colocado: 'img/dino-triceratops-arriba.png' },
    'diplodocus': { disponible: 'img/dino-diplodocus.png', colocado: 'img/dino-diplodocus-arriba.png' },
    'stegosaurus': { disponible: 'img/dino-stegosaurus.png', colocado: 'img/dino-stegosaurus-arriba.png' },
    'parasaurolophus': { disponible: 'img/dino-parasaurolophus.png', colocado: 'img/dino-parasaurolophus-arriba.png' }
  },

  PESOS_DINOSAURIOS: {
    't-rex': 7.0, 
    'triceratops': 7.0, 
    'diplodocus': 15.0,
    'stegosaurus': 5.0, 
    'parasaurolophus': 2.5
  },

  TIPOS_DINOSAURIOS: ['t-rex', 'triceratops', 'diplodocus', 'stegosaurus', 'parasaurolophus'],
  DINOSAURIOS_POR_RONDA: 6,
  MAX_DINOSAURIOS_POOL: 8,

  POSICIONES_DINOSAURIOS: [
    { top: '50%', left: '50%' }, 
    { top: '30%', left: '30%' },
    { top: '30%', left: '70%' }, 
    { top: '70%', left: '30%' },
    { top: '70%', left: '70%' }, 
    { top: '50%', left: '20%' },
    { top: '20%', left: '50%' }, 
    { top: '80%', left: '50%' }
  ],

  POSICIONES_MINI: [
    { top: '50%', left: '50%' }, 
    { top: '25%', left: '25%' },
    { top: '25%', left: '75%' }, 
    { top: '75%', left: '25%' },
    { top: '75%', left: '75%' }, 
    { top: '50%', left: '15%' },
    { top: '15%', left: '50%' }, 
    { top: '85%', left: '50%' }
  ],

  RESTRICCIONES_DADO: {
    1: { tipo: 'lugar-vacio', titulo: 'Lugar vací­o', imagen: 'dado-huella' },
    2: { tipo: 'no-t-rex', titulo: 'Sin T-Rex', imagen: 'dado-no-trex' },
    3: { tipo: 'lado-cafeteria', titulo: 'Lado cafeterí­a', imagen: 'dado-cafe' },
    4: { tipo: 'bosque', titulo: 'Bosque', imagen: 'dado-bosque' },
    5: { tipo: 'rocas', titulo: 'Rocas', imagen: 'dado-rocas' },
    6: { tipo: 'lado-banos', titulo: 'Lado baí±os', imagen: 'dado-banos' }
  }
};

/* ==================== REGLAS DE RECINTOS ==================== */
const REGLAS_RECINTOS = {
  'bosque-semejanza': {
    validar: (recinto, nuevoDino) => {
      if (recinto.length === 0) return true;
      return recinto.every(d => d === nuevoDino);
    },
    maxDinos: 6,
    puntos: [0, 2, 4, 8, 12, 18, 24]
  },
  
  'pradera-amor': {
    validar: () => true,
    maxDinos: 6,
    puntos: recinto => {
      const conteos = {};
      recinto.forEach(d => conteos[d] = (conteos[d] || 0) + 1);
      let parejas = 0;
      Object.values(conteos).forEach(count => {
        parejas += Math.floor(count / 2);
      });
      return parejas * 5;
    }
  },
  
  'woody-trio': {
    validar: () => true,
    maxDinos: 3,
    puntos: cant => cant === 3 ? 7 : 0
  },
  
  'prado-diferencia': {
    validar: (recinto, nuevoDino) => {
      return !recinto.includes(nuevoDino);
    },
    maxDinos: 6,
    puntos: [0, 1, 3, 6, 10, 15, 21]
  },
  
  'rey-jungla': {
    validar: () => true,
    maxDinos: 1,
    puntos: (recinto, todosRecintos, jugadorActual, todosJugadores) => {
      if (recinto.length !== 1) return 0;
      const tipo = recinto[0];
      
      const miTotal = Object.values(todosRecintos)
        .flat()
        .filter(d => d === tipo).length;
      
      if (todosJugadores) {
        for (let oponente of todosJugadores) {
          if (oponente === jugadorActual) continue;
          const totalOponente = Object.values(oponente.recintos)
            .flat()
            .filter(d => d === tipo).length;
          
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
      
      const totalEnZoo = Object.values(todosRecintos)
        .flat()
        .filter(d => d === tipo).length;
      
      return totalEnZoo === 1 ? 7 : 0;
    }
  },
  
  'rio': {
    validar: () => true,
    maxDinos: 20,
    puntos: cant => cant
  }
};

/* ==================== ESTADO DEL JUEGO ==================== */
class EstadoJuego {
  constructor() {
    this.reset();
  }

  reset() {
    this.jugadores = [];
    this.jugadorActual = 1;
    this.primerJugador = 1;
    this.primerJugadorOriginal = 1;
    this.rondaActual = 1;
    this.turnoEnRonda = 1;
    this.modoSeguimiento = false;
    this.restriccionActual = null;
    this.repartosDisponibles = [];
    this.puedePasarTurno = false;
    this.yaColocoEnTurno = false;
    this.dadoNumero = null;
    this.dinosauriosDescartados = [];

    // Arrays para guardar los dinosaurios originales de la ronda
    this.dinosauriosRondaJ1 = [];
    this.dinosauriosRondaJ2 = [];
    
    // Arrays para tracking de dinosaurios descartados por jugador
    this.descartadosJ1 = [];
    this.descartadosJ2 = [];

    this.jugador1 = this.crearJugador();
    this.jugador2 = this.crearJugador();

    this.jugador1.puntos = 0;
    this.jugador1.puntosRonda = 0;
    this.jugador2.puntos = 0;
    this.jugador2.puntosRonda = 0;
    
    this.turnosCompletadosJ1 = 0;
    this.turnosCompletadosJ2 = 0;
  }

  crearJugador() {
    return {
      nombre: '',
      dinosauriosDisponibles: [],
      recintos: {
        'bosque-semejanza': [], 
        'pradera-amor': [],
        'woody-trio': [], 
        'prado-diferencia': [], 
        'rey-jungla': [], 
        'isla-solitaria': [], 
        'rio': []
      },
      puntos: 0,
      puntosRonda: 0
    };
  }

  getJugadorActual() {
    return this[`jugador${this.jugadorActual}`];
  }

  getOponente() {
    return this[`jugador${this.jugadorActual === 1 ? 2 : 1}`];
  }

  getTodosJugadores() {
    return [this.jugador1, this.jugador2];
  }

  cambiarTurno() {
    if (this.modoSeguimiento) {
      if (this.jugadorActual === 1) {
        this.turnosCompletadosJ1++;
      } else {
        this.turnosCompletadosJ2++;
      }
    }
    
    this.jugadorActual = this.jugadorActual === 1 ? 2 : 1;
    this.turnoEnRonda++;
    this.yaColocoEnTurno = false;
    this.puedePasarTurno = false;
    
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      btn.disabled = true;
    }
  }

  esFinDeRonda() {
    if (this.modoSeguimiento) {
      const ambosCompletaronTresTurnos = this.turnosCompletadosJ1 >= 3 && this.turnosCompletadosJ2 >= 3;
      
      // En el primer turno de cualquier ronda, no es fin de ronda
      if (this.esPrimerTurnoDeRonda()) {
        return false;
      }
      
      const sinDinosaurios = this.jugador1.dinosauriosDisponibles.length === 0 &&
        this.jugador2.dinosauriosDisponibles.length === 0;
      
      return sinDinosaurios || ambosCompletaronTresTurnos;
    }
    
    return this.jugador1.dinosauriosDisponibles.length === 0 &&
      this.jugador2.dinosauriosDisponibles.length === 0;
  }

  esPrimerTurnoDeRonda() {
    return this.turnoEnRonda === 1;
  }

  esPrimerTurnoAbsoluto() {
    return this.turnoEnRonda === 1 && this.rondaActual === 1;
  }

  necesitaRestriccion() {
    return !this.esPrimerTurnoDeRonda();
  }
}

const estadoJuego = new EstadoJuego();

/* ==================== UTILIDADES ==================== */
const Utils = {
  mezclarArray(arr) {
    const copia = [...arr];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  },

  abrirPopup(popup) {
    if (!popup) return;
    popup.classList.remove('hidden');
    popup.style.display = popup.classList.contains('popup-overlay') ? 'flex' : 'block';
    document.body.style.overflow = 'hidden';
  },

  cerrarPopup(popup) {
    if (!popup) return;
    popup.classList.add('hidden');
    popup.style.display = 'none';
    document.body.style.overflow = '';
  },

  hayPopupAbierto() {
    return Array.from(document.querySelectorAll('.popup-overlay'))
      .some(p => !p.classList.contains('hidden') && p.style.display !== 'none');
  },

  limpiarElementos(selector) {
    document.querySelectorAll(selector).forEach(el => el.remove());
  },

  crearElemento(tag, attrs = {}, styles = {}) {
    const el = document.createElement(tag);

    if (attrs.dataset) {
      Object.keys(attrs.dataset).forEach(key => {
        el.dataset[key] = attrs.dataset[key];
      });
      delete attrs.dataset;
    }

    Object.keys(attrs).forEach(key => {
      el[key] = attrs[key];
    });

    Object.assign(el.style, styles);

    return el;
  }
};

/* ==================== SISTEMA DE MAPAS ==================== */
const MapaOponente = {
  mostrar() {
    const oponente = estadoJuego.getOponente();

    this.actualizarTitulo(oponente.nombre);
    this.renderizarMiniTablero(oponente.recintos);
    this.mostrarPuntuacion(oponente.recintos);

    Utils.abrirPopup(document.getElementById('popup-mapa'));
  },

  actualizarTitulo(nombre) {
    const titulo = document.getElementById('titulo-mapa');
    if (titulo) {
      titulo.textContent = `MAPA DE ${(nombre || 'OPONENTE').toUpperCase()}`;
    }
  },

  renderizarMiniTablero(recintos) {
    document.querySelectorAll('.mini-dinosaurios').forEach(cont => {
      cont.innerHTML = '';
    });

    Object.entries(recintos).forEach(([recinto, dinosaurios]) => {
      const contenedor = document.getElementById(`mapa-${recinto}`);
      if (!contenedor || dinosaurios.length === 0) return;

      dinosaurios.forEach((tipo, index) => {
        const img = this.crearMiniDinosaurio(tipo, index + 1);
        contenedor.appendChild(img);
      });
    });
  },

  crearMiniDinosaurio(tipo, posicion) {
    const pos = CONFIG.POSICIONES_MINI[(posicion - 1) % CONFIG.POSICIONES_MINI.length];

    const img = Utils.crearElemento('img', {
      src: CONFIG.IMAGENES_DINOSAURIOS[tipo].colocado,
      className: 'mini-dinosaurio',
      alt: tipo
    }, {
      position: 'absolute',
      top: pos.top,
      left: pos.left,
      transform: 'translate(-50%, -50%)',
      zIndex: '15',
      pointerEvents: 'none'
    });

    return img;
  },

  mostrarPuntuacion(recintos) {
    const detalles = {};
    let total = 0;
    const oponente = estadoJuego.getOponente();
    const todosJugadores = estadoJuego.getTodosJugadores();

    Object.entries(recintos).forEach(([nombre, dinosaurios]) => {
      const reglas = REGLAS_RECINTOS[nombre];
      if (!reglas) return;

      let puntos = 0;

      if (typeof reglas.puntos === 'function') {
        if (nombre === 'isla-solitaria') {
          puntos = reglas.puntos(dinosaurios, recintos);
        } else if (nombre === 'rey-jungla') {
          puntos = reglas.puntos(dinosaurios, recintos, oponente, todosJugadores);
        } else if (nombre === 'pradera-amor') {
          puntos = reglas.puntos(dinosaurios);
        } else {
          puntos = reglas.puntos(dinosaurios.length);
        }
      } else if (Array.isArray(reglas.puntos)) {
        puntos = reglas.puntos[dinosaurios.length] || 0;
      }

      detalles[nombre] = puntos;
      total += puntos;
    });

    // Bonus T-Rex
    Object.values(recintos).forEach(recinto => {
      if (recinto.some(d => d === 't-rex')) {
        total += 1;
      }
    });

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

/* ==================== SISTEMA DE POPUPS ==================== */
const PopupManager = {
  mostrarReglas() {
    Utils.abrirPopup(document.getElementById('popup-reglas'));
  },

  mostrarPesos() {
    GameLogic.actualizarPesos();
    Utils.abrirPopup(document.getElementById('popup-pesos'));
  },

  cerrar(popupId) {
    if (popupId) {
      const popup = document.getElementById(popupId);

      if (popupId === 'popup-descarte') {
        if (estadoJuego.puedePasarTurno) {
          Utils.cerrarPopup(popup);
        } else {
          console.log('Debe seleccionar un dinosaurio para descartar');
          return;
        }
      } else {
        Utils.cerrarPopup(popup);
      }
    } else {
      document.querySelectorAll('.popup-overlay').forEach(popup => {
        if (popup.id === 'popup-descarte' && !estadoJuego.puedePasarTurno) {
          return;
        }
        Utils.cerrarPopup(popup);
      });
    }
  },

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('popup-overlay')) {
        const popup = e.target;

        if (popup.id === 'popup-descarte' && !estadoJuego.puedePasarTurno) {
          return;
        }

        if (popup.id === 'popup-seleccion-dinosaurios') {
          return; // No cerrar este popup al hacer clic fuera
        }

        Utils.cerrarPopup(popup);
      }
    });

    document.querySelectorAll('.popup-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const popup = btn.closest('.popup-overlay');

        if (popup?.id === 'popup-descarte') {
          if (!estadoJuego.puedePasarTurno && estadoJuego.yaColocoEnTurno) {
            console.log('Debe seleccionar un dinosaurio para descartar');
            return;
          }
        }

        Utils.cerrarPopup(popup);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const popups = document.querySelectorAll('.popup-overlay:not(.hidden)');
        popups.forEach(popup => {
          if (popup.style.display !== 'none') {
            if (popup.id === 'popup-descarte' && !estadoJuego.puedePasarTurno) {
              return;
            }
            if (popup.id === 'popup-seleccion-dinosaurios') {
              return; // No cerrar este popup con Escape
            }
            Utils.cerrarPopup(popup);
          }
        });
      }
    });
  }
};

/* ==================== LÓGICA DEL JUEGO ==================== */
const GameLogic = {
  puedeColocarDinosaurio(recinto, tipoDino) {
    if (estadoJuego.yaColocoEnTurno) return false;

    // El rí­o SIEMPRE está disponible
    if (recinto === 'rio') return true;

    const jugador = estadoJuego.getJugadorActual();
    const recintoActual = jugador.recintos[recinto];
    const reglas = REGLAS_RECINTOS[recinto];

    if (!reglas || recintoActual.length >= reglas.maxDinos) return false;

    if (estadoJuego.restriccionActual && !this.cumpleRestriccion(recinto, tipoDino)) {
      return false;
    }

    return reglas.validar(recintoActual, tipoDino);
  },

  cumpleRestriccion(recinto, tipoDino) {
    const recintos = estadoJuego.getJugadorActual().recintos;
    const restricciones = {
      'no-t-rex': () => {
        if (tipoDino === 't-rex') {
          return !recintos[recinto].some(d => d === 't-rex');
        } else {
          return !recintos[recinto].some(d => d === 't-rex');
        }
      },
      'lugar-vacio': () => recintos[recinto].length === 0,
      'lado-cafeteria': () => ['bosque-semejanza', 'pradera-amor', 'woody-trio'].includes(recinto),
      'bosque': () => ['bosque-semejanza', 'woody-trio'].includes(recinto),
      'rocas': () => ['rey-jungla', 'isla-solitaria'].includes(recinto),
      'lado-banos': () => ['prado-diferencia', 'rey-jungla', 'isla-solitaria'].includes(recinto)
    };
    return restricciones[estadoJuego.restriccionActual]?.() ?? true;
  },

  colocarDinosaurio(recinto, tipoDino, area) {
    if (estadoJuego.yaColocoEnTurno) return false;

    const jugador = estadoJuego.getJugadorActual();
    const idx = jugador.dinosauriosDisponibles.indexOf(tipoDino);
    if (idx === -1) return false;

    jugador.dinosauriosDisponibles.splice(idx, 1);
    jugador.recintos[recinto].push(tipoDino);

    RenderManager.agregarDinosaurioVisual(tipoDino, recinto, area);

    estadoJuego.yaColocoEnTurno = true;
    this.actualizarPuntos();
    this.actualizarPesos();

    JuegoManager.actualizarInterfaz();
    RenderManager.actualizarDinosauriosDisponibles();
    setTimeout(() => JuegoManager.mostrarPopupDescarte(), 350);

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
        const cantidad = dinosaurios.length;
        puntos = reglas.puntos[cantidad] || 0;
      }

      total += puntos;
    });

    // Bonus T-Rex
    let bonusTRex = 0;
    Object.entries(recintos).forEach(([nombre, dinosaurios]) => {
      if (dinosaurios.some(d => d === 't-rex')) {
        bonusTRex += 1;
      }
    });
    total += bonusTRex;

    return total;
  },

  actualizarPuntos() {
    const jugador1 = estadoJuego.jugador1;
    const jugador2 = estadoJuego.jugador2;
    const todosJugadores = estadoJuego.getTodosJugadores();
    
    jugador1.puntosRonda = this.calcularPuntos(jugador1.recintos, jugador1, todosJugadores);
    jugador2.puntosRonda = this.calcularPuntos(jugador2.recintos, jugador2, todosJugadores);
    
    console.log(`Puntos actualizados - J1: ${jugador1.puntosRonda}, J2: ${jugador2.puntosRonda}`);
  },

  actualizarPesos() {
    const jugador = estadoJuego.getJugadorActual();
    let pesoTotal = 0;

    Object.entries(jugador.recintos).forEach(([recinto, dinosaurios]) => {
      const peso = dinosaurios.reduce((sum, dino) =>
        sum + (CONFIG.PESOS_DINOSAURIOS[dino] || 0), 0);

      pesoTotal += peso;
      const elem = document.getElementById(`peso-${recinto}`);
      if (elem) elem.textContent = peso.toFixed(1);
    });

    const elemTotal = document.getElementById('peso-total');
    if (elemTotal) elemTotal.textContent = pesoTotal.toFixed(1);
  }
};

/* ==================== RENDERIZADO ==================== */
const RenderManager = {
  renderizarTablero() {
    estadoJuego.modoSeguimiento ?
      this.renderizarTableroSeguimiento() :
      this.renderizarTableroNormal();
  },

  renderizarTableroNormal() {
    Utils.limpiarElementos('.dinosaurio-colocado');
    const jugador = estadoJuego.getJugadorActual();

    Object.entries(jugador.recintos).forEach(([recinto, dinosaurios]) => {
      const area = document.querySelector(`[data-recinto="${recinto}"]`);
      if (!area) return;

      dinosaurios.forEach((tipo, index) => {
        this.crearDinosaurioVisual(tipo, index + 1, area);
      });
    });
    
    DragDropManager.init();
  },

  renderizarTableroSeguimiento() {
    Utils.limpiarElementos('.dinosaurio-colocado');
    const jugador = estadoJuego.getJugadorActual();

    Object.entries(jugador.recintos).forEach(([recinto, dinosaurios]) => {
      const area = document.querySelector(`[data-recinto="${recinto}"]`);
      if (!area) return;

      dinosaurios.forEach((tipo, index) => {
        const img = this.crearDinosaurioVisual(tipo, index + 1, area);
        
        // Habilitar drag para ronda 2 en modo seguimiento
        if (estadoJuego.modoSeguimiento && estadoJuego.rondaActual === 2) {
          img.draggable = true;
          img.style.cursor = 'move';
          img.style.pointerEvents = 'auto';
          img.dataset.recinto = recinto;
          img.dataset.tipo = tipo;
          img.dataset.jugador = estadoJuego.jugadorActual;
          // No agregar eventos aquí, se harán en DragDropManager.init()
        }
      });
    });
    
    // Llamar a init después de que todos los elementos estén en el DOM
    setTimeout(() => {
      DragDropManager.init();
    }, 50);
  },

  crearDinosaurioVisual(tipo, posicion, area) {
    const pos = CONFIG.POSICIONES_DINOSAURIOS[(posicion - 1) % CONFIG.POSICIONES_DINOSAURIOS.length];
    const img = Utils.crearElemento('img', {
      src: CONFIG.IMAGENES_DINOSAURIOS[tipo].colocado,
      className: 'dinosaurio-colocado',
      alt: tipo
    }, {
      position: 'absolute',
      top: pos.top,
      left: pos.left,
      transform: 'translate(-50%, -50%)',
      zIndex: '15',
      pointerEvents: estadoJuego.modoSeguimiento && estadoJuego.rondaActual === 2 ? 'auto' : 'none'
    });

    area.appendChild(img);
    return img;
  },

  agregarDinosaurioVisual(tipo, recinto, area) {
    const jugador = estadoJuego.getJugadorActual();
    const cantidad = jugador.recintos[recinto].length;
    this.crearDinosaurioVisual(tipo, cantidad, area);
  },

  agregarEventosCorreccion(img) {
    img.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('tipo', img.dataset.tipo);
      e.dataTransfer.setData('recinto-origen', img.dataset.recinto);
      e.dataTransfer.setData('correccion', 'true');
      img.classList.add('dragging');
    });

    img.addEventListener('dragend', () => {
      img.classList.remove('dragging');
    });
  },

  actualizarDinosauriosDisponibles() {
    const contenedor = document.querySelector('.dinosaurios-disponibles');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    const jugador = estadoJuego.getJugadorActual();

    jugador.dinosauriosDisponibles.forEach((tipo, index) => {
      const img = Utils.crearElemento('img', {
        src: CONFIG.IMAGENES_DINOSAURIOS[tipo].disponible,
        className: 'dino',
        draggable: true,
        alt: tipo,
        dataset: { tipo: tipo, index: index.toString() }
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

  init() {
    this.initDinosaurios();
    this.initDropZones();
    
    // Inicializar dinosaurios colocados para ronda 2 - MEJORADO
    if (estadoJuego.modoSeguimiento && estadoJuego.rondaActual === 2) {
      // Usar setTimeout para asegurar que el DOM esté completamente renderizado
      setTimeout(() => {
        this.initDinosauriosColocados();
      }, 100);
    }
  },
  
  initDinosauriosColocados() {
    // Limpiar event listeners previos
    document.querySelectorAll('.dinosaurio-colocado').forEach(dino => {
      // Clonar el elemento para eliminar todos los event listeners
      const newDino = dino.cloneNode(true);
      dino.parentNode.replaceChild(newDino, dino);
    });
    
    // Ahora agregar los nuevos event listeners
    document.querySelectorAll('.dinosaurio-colocado').forEach(dino => {
      if (estadoJuego.modoSeguimiento && estadoJuego.rondaActual === 2) {
        // SOLO habilitar drag para el jugador actual
        const jugadorDelDino = parseInt(dino.dataset.jugador);
        if (jugadorDelDino === estadoJuego.jugadorActual) {
          dino.draggable = true;
          dino.style.cursor = 'move';
          dino.style.pointerEvents = 'auto';
          
          if (!dino.dataset.tipo && dino.alt) {
            dino.dataset.tipo = dino.alt;
          }
          
          const area = dino.closest('[data-recinto]');
          if (area && area.dataset.recinto) {
            dino.dataset.recinto = area.dataset.recinto;
          }
          
          dino.addEventListener('dragstart', this.handleDragStartCorreccion.bind(this));
          dino.addEventListener('dragend', this.handleDragEnd.bind(this));
        }
      }
    });
  },

  initDinosaurios() {
    document.querySelectorAll('.dino').forEach(dino => {
      const newDino = dino.cloneNode(true);
      dino.parentNode.replaceChild(newDino, dino);

      newDino.addEventListener('dragstart', this.handleDragStart.bind(this));
      newDino.addEventListener('dragend', this.handleDragEnd.bind(this));
    });
  },

  initDropZones() {
    const dropZones = document.querySelectorAll('.cuadro, .rectangulo');

    dropZones.forEach(zone => {
      const newZone = zone.cloneNode(true);
      zone.parentNode.replaceChild(newZone, zone);
      
      ['dragover', 'drop', 'dragenter', 'dragleave'].forEach(event => {
        newZone.addEventListener(event, this[`handle${event.charAt(0).toUpperCase() + event.slice(1)}`].bind(this));
      });
    });
  },
  
  handleDragStartCorreccion(e) {
    this.dinosaurioArrastrado = e.target;
    this.esCorreccion = true;
    this.recintoOrigen = e.target.dataset.recinto;
    
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('tipo', e.target.dataset.tipo);
    e.dataTransfer.setData('recinto-origen', this.recintoOrigen);
    e.dataTransfer.setData('correccion', 'true');
  },

  handleDragStart(e) {
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

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    this.limpiarIndicadores();
    this.dinosaurioArrastrado = null;
    this.esCorreccion = false;
    this.recintoOrigen = null;
  },

  handleDragover(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  },

  handleDragenter(e) {
    e.preventDefault();
    const zona = e.currentTarget;
    const recinto = zona.dataset.recinto;

    if (!recinto || !this.dinosaurioArrastrado) return;

    const tipoDino = this.dinosaurioArrastrado.dataset.tipo;
    const puedeColocar = this.esCorreccion || GameLogic.puedeColocarDinosaurio(recinto, tipoDino);

    zona.classList.add(puedeColocar ? 'drop-zone-active' : 'drop-zone-invalid');
  },

  handleDragleave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drop-zone-active', 'drop-zone-invalid');
    }
  },

  handleDrop(e) {
    e.preventDefault();

    const area = e.currentTarget;
    const recinto = area.dataset.recinto;
    const tipoDino = e.dataTransfer.getData('text/plain') || 
                     e.dataTransfer.getData('tipo');

    if (!recinto || !tipoDino) {
      this.limpiarIndicadores();
      return;
    }

    if (this.esCorreccion) {
      this.manejarCorreccion(recinto, tipoDino, area);
    } else if (GameLogic.puedeColocarDinosaurio(recinto, tipoDino)) {
      GameLogic.colocarDinosaurio(recinto, tipoDino, area);
    }

    this.limpiarIndicadores();
  },

  manejarCorreccion(recintoDestino, tipoDino, area) {
    if (!this.recintoOrigen || this.recintoOrigen === recintoDestino) return;

    const jugador = estadoJuego.getJugadorActual();
    const reglas = REGLAS_RECINTOS[recintoDestino];
    
    if (reglas && reglas.maxDinos && jugador.recintos[recintoDestino].length >= reglas.maxDinos) {
      console.log('Recinto destino lleno');
      return;
    }
    
    const idxOrigen = jugador.recintos[this.recintoOrigen].indexOf(tipoDino);

    if (idxOrigen !== -1) {
      jugador.recintos[this.recintoOrigen].splice(idxOrigen, 1);
      jugador.recintos[recintoDestino].push(tipoDino);

      RenderManager.renderizarTableroSeguimiento();
      GameLogic.actualizarPuntos();
      GameLogic.actualizarPesos();
    }
  },

  limpiarIndicadores() {
    document.querySelectorAll('.drop-zone-active, .drop-zone-invalid')
      .forEach(el => el.classList.remove('drop-zone-active', 'drop-zone-invalid'));
  }
};

/* ==================== MODO SEGUIMIENTO ==================== */
const ModoSeguimiento = {
  MAX_DINOSAURIOS: 6,
  dinosauriosSeleccionados: [],
  eventListeners: new Map(),

  mostrarPopupSeleccionDinosaurios() {
    const jugadorNum = estadoJuego.jugadorActual;
    const yaSeleccionoEnRonda = (jugadorNum === 1 && estadoJuego.dinosauriosRondaJ1.length > 0) ||
      (jugadorNum === 2 && estadoJuego.dinosauriosRondaJ2.length > 0);

    console.log(`Jugador ${jugadorNum} - Ronda ${estadoJuego.rondaActual} - Ya seleccionó: ${yaSeleccionoEnRonda}`);

    if (yaSeleccionoEnRonda) {
      this.restaurarDinosauriosGuardados();
      return;
    }

    this.resetearContadores();
    const popup = document.getElementById('popup-seleccion-dinosaurios');
    if (!popup) return;

    const titulo = popup.querySelector('h2');
    if (titulo) {
      const nombre = estadoJuego.getJugadorActual().nombre || `Jugador ${estadoJuego.jugadorActual}`;
      titulo.textContent = `${nombre.toUpperCase()} - Seleccionar dinosaurios para RONDA ${estadoJuego.rondaActual}`;
    }

    this.configurarSeleccionDinosaurios();
    Utils.abrirPopup(popup);
  },

  restaurarDinosauriosGuardados() {
    const jugador = estadoJuego.getJugadorActual();
    const jugadorNum = estadoJuego.jugadorActual;
    
    if (jugadorNum === 1) {
      // Restaurar los dinosaurios originales de J1
      jugador.dinosauriosDisponibles = [...estadoJuego.dinosauriosRondaJ1];
      
      // Eliminar los dinosaurios ya colocados y descartados
      const dinosauriosUsados = estadoJuego.turnosCompletadosJ1 * 2;
      
      // Tambií©n eliminar especí­ficamente los descartados
      estadoJuego.descartadosJ1.forEach(descartado => {
        const idx = jugador.dinosauriosDisponibles.indexOf(descartado);
        if (idx !== -1) {
          jugador.dinosauriosDisponibles.splice(idx, 1);
        }
      });
      
      // Y eliminar los que ya están en recintos
      Object.values(jugador.recintos).flat().forEach(dinoColocado => {
        const idx = jugador.dinosauriosDisponibles.indexOf(dinoColocado);
        if (idx !== -1) {
          jugador.dinosauriosDisponibles.splice(idx, 1);
        }
      });
      
      console.log(`J1: Restaurando. Disponibles: ${jugador.dinosauriosDisponibles.length}`, jugador.dinosauriosDisponibles);
    } else {
      // Restaurar los dinosaurios originales de J2
      jugador.dinosauriosDisponibles = [...estadoJuego.dinosauriosRondaJ2];
      
      // Eliminar los dinosaurios ya colocados y descartados
      const dinosauriosUsados = estadoJuego.turnosCompletadosJ2 * 2;
      
      // Tambií©n eliminar especí­ficamente los descartados
      estadoJuego.descartadosJ2.forEach(descartado => {
        const idx = jugador.dinosauriosDisponibles.indexOf(descartado);
        if (idx !== -1) {
          jugador.dinosauriosDisponibles.splice(idx, 1);
        }
      });
      
      // Y eliminar los que ya están en recintos
      Object.values(jugador.recintos).flat().forEach(dinoColocado => {
        const idx = jugador.dinosauriosDisponibles.indexOf(dinoColocado);
        if (idx !== -1) {
          jugador.dinosauriosDisponibles.splice(idx, 1);
        }
      });
      
      console.log(`J2: Restaurando. Disponibles: ${jugador.dinosauriosDisponibles.length}`, jugador.dinosauriosDisponibles);
    }

    RenderManager.actualizarDinosauriosDisponibles();
    JuegoManager.actualizarInterfaz();
    
    // Renderizar tablero correctamente
    setTimeout(() => {
      RenderManager.renderizarTablero();
      DragDropManager.init();
    }, 100);

    if (estadoJuego.necesitaRestriccion()) {
      setTimeout(() => this.mostrarPopupSeleccionDado(), 200);
    } else {
      JuegoManager.establecerSinRestriccion();
      if (window.app?.showScreen) {
        window.app.showScreen('partida');
      }
    }
  },

  configurarSeleccionDinosaurios() {
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
            this.actualizarTotalSeleccion();
          }
        };
        btnDecrease.addEventListener('click', decreaseHandler);
        this.eventListeners.set(btnDecrease, decreaseHandler);
      }

      if (btnIncrease && contador) {
        const increaseHandler = () => {
          const valorActual = parseInt(contador.textContent) || 0;
          const totalActual = this.calcularTotalSeleccionado();

          if (totalActual < this.MAX_DINOSAURIOS) {
            contador.textContent = valorActual + 1;
            this.actualizarTotalSeleccion();
          } else {
            if (window.app?.showToast) {
              window.app.showToast(`Máximo ${this.MAX_DINOSAURIOS} dinosaurios`, 'warning');
            }
          }
        };
        btnIncrease.addEventListener('click', increaseHandler);
        this.eventListeners.set(btnIncrease, increaseHandler);
      }
    });

    const btnConfirmar = document.getElementById('btn-confirmar-seleccion');
    if (btnConfirmar) {
      btnConfirmar.onclick = () => this.confirmarSeleccionDinosaurios();
    }
  },

  calcularTotalSeleccionado() {
    return Array.from(document.querySelectorAll('.contador-valor'))
      .reduce((total, contador) => total + (parseInt(contador.textContent) || 0), 0);
  },

  actualizarTotalSeleccion() {
    const total = this.calcularTotalSeleccionado();
    const totalElement = document.getElementById('total-dinosaurios');

    if (totalElement) {
      totalElement.textContent = total;
      totalElement.style.color = total === this.MAX_DINOSAURIOS ? '#4CAF50' : '';
    }

    const btnConfirmar = document.getElementById('btn-confirmar-seleccion');
    if (btnConfirmar) {
      btnConfirmar.disabled = (total !== this.MAX_DINOSAURIOS);
      btnConfirmar.textContent = total < this.MAX_DINOSAURIOS ?
        `Selecciona ${this.MAX_DINOSAURIOS - total} más` : 'Confirmar selección';
    }
  },

  confirmarSeleccionDinosaurios() {
    const dinosaurios = [];

    document.querySelectorAll('.dino-selector').forEach(selector => {
      const tipo = selector.dataset.tipo;
      const cantidad = parseInt(selector.querySelector('.contador-valor').textContent) || 0;

      for (let i = 0; i < cantidad; i++) {
        dinosaurios.push(tipo);
      }
    });

    if (dinosaurios.length !== this.MAX_DINOSAURIOS) {
      if (window.app?.showToast) {
        window.app.showToast(`Debes seleccionar exactamente ${this.MAX_DINOSAURIOS} dinosaurios`, 'error');
      }
      return;
    }

    if (estadoJuego.jugadorActual === 1) {
      estadoJuego.dinosauriosRondaJ1 = [...dinosaurios];
      // Limpiar descartados al inicio de la ronda
      if (estadoJuego.turnosCompletadosJ1 === 0) {
        estadoJuego.descartadosJ1 = [];
      }
    } else {
      estadoJuego.dinosauriosRondaJ2 = [...dinosaurios];
      // Limpiar descartados al inicio de la ronda
      if (estadoJuego.turnosCompletadosJ2 === 0) {
        estadoJuego.descartadosJ2 = [];
      }
    }

    estadoJuego.getJugadorActual().dinosauriosDisponibles = [...dinosaurios];

    Utils.cerrarPopup(document.getElementById('popup-seleccion-dinosaurios'));
    this.resetearContadores();

    RenderManager.actualizarDinosauriosDisponibles();
    JuegoManager.actualizarInterfaz();

    if (estadoJuego.necesitaRestriccion()) {
      setTimeout(() => this.mostrarPopupSeleccionDado(), 100);
    } else {
      console.log('Primer turno de la ronda - Sin restricción');
      
      // Resetear estado del turno para el primer turno sin restricción
      estadoJuego.yaColocoEnTurno = false;
      estadoJuego.puedePasarTurno = false;
      estadoJuego.dadoNumero = null; // No hay dado en el primer turno
      
      JuegoManager.establecerSinRestriccion();
      if (window.app?.showScreen) {
        window.app.showScreen('partida');
      }

      RenderManager.actualizarDinosauriosDisponibles();
      JuegoManager.actualizarInterfaz();
      JuegoManager.actualizarBotonSiguiente();
      RenderManager.renderizarTablero();
      
      setTimeout(() => {
        DragDropManager.init();
      }, 100);
    }
  },

  resetearContadores() {
    document.querySelectorAll('.contador-valor').forEach(contador => {
      contador.textContent = '0';
    });

    const totalElement = document.getElementById('total-dinosaurios');
    if (totalElement) {
      totalElement.textContent = '0';
      totalElement.style.color = '';
    }

    const btnConfirmar = document.getElementById('btn-confirmar-seleccion');
    if (btnConfirmar) {
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = `Selecciona ${this.MAX_DINOSAURIOS} dinosaurios`;
    }
  },

  mostrarPopupSeleccionDado() {
    document.querySelectorAll('.cara-dado-opcion').forEach(cara => {
      cara.classList.remove('seleccionada');
      cara.onclick = () => this.seleccionarCaraDado(cara);
    });

    Utils.abrirPopup(document.getElementById('popup-seleccion-dado'));
  },

  seleccionarCaraDado(cara) {
    document.querySelectorAll('.cara-dado-opcion').forEach(c => {
      c.classList.remove('seleccionada');
    });
    cara.classList.add('seleccionada');

    const caraSeleccionada = parseInt(cara.dataset.cara);
    estadoJuego.dadoNumero = caraSeleccionada;

    setTimeout(() => {
      this.procesarDadoSeleccionado(caraSeleccionada);
      Utils.cerrarPopup(document.getElementById('popup-seleccion-dado'));
    }, 300);
  },

  procesarDadoSeleccionado(numeroDado) {
    const restriccion = CONFIG.RESTRICCIONES_DADO[numeroDado];

    if (restriccion) {
      JuegoManager.establecerRestriccion(restriccion.tipo, restriccion.titulo);
    }

    // CRíTICO: Resetear estado del turno despuí©s de seleccionar dado
    estadoJuego.yaColocoEnTurno = false;
    estadoJuego.puedePasarTurno = false;
    
    // Deshabilitar botón siguiente turno
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      btn.disabled = true;
    }

    if (window.app?.showScreen) {
      window.app.showScreen('partida');
    }

    RenderManager.actualizarDinosauriosDisponibles();
    JuegoManager.actualizarInterfaz();
    RenderManager.renderizarTablero();
    
    setTimeout(() => {
      DragDropManager.init();
    }, 100);
  }
};

/* ==================== GESTOR PRINCIPAL ==================== */
const JuegoManager = {
  dinoSeleccionadoDescarte: null,
  tipoSeleccionadoDescarte: null,
  
  inicializarPartida(jugadores, jugador2Info, primerJugador, modoSeguimiento = false) {
    estadoJuego.reset();

    estadoJuego.jugadores = jugadores;
    estadoJuego.jugador1.nombre = jugadores[0] || 'Jugador 1';
    estadoJuego.jugador2.nombre = jugadores[1] || 'Jugador 2';
    estadoJuego.primerJugador = primerJugador;
    estadoJuego.primerJugadorOriginal = primerJugador;
    estadoJuego.jugadorActual = primerJugador;
    estadoJuego.modoSeguimiento = modoSeguimiento;

    estadoJuego.turnosCompletadosJ1 = 0;
    estadoJuego.turnosCompletadosJ2 = 0;
    
    // Limpiar arrays de descarte
    estadoJuego.descartadosJ1 = [];
    estadoJuego.descartadosJ2 = [];

    if (window.app) {
      window.app.jugador2Info = jugador2Info || { tipo: 'invitado' };
    }

    console.log(`Partida iniciada - Modo: ${modoSeguimiento ? 'SEGUIMIENTO' : 'NORMAL'}`);
    console.log(`Primer jugador: ${primerJugador}`);

    if (modoSeguimiento) {
      estadoJuego.turnoEnRonda = 1;
      estadoJuego.rondaActual = 1;
    } else {
      this.generarPoolDinosaurios();
      this.iniciarRonda();
      if (window.app?.showScreen) {
        setTimeout(() => window.app.showScreen('partida'), 100);
      }
    }
  },

  generarPoolDinosaurios() {
    estadoJuego.repartosDisponibles = [];
    CONFIG.TIPOS_DINOSAURIOS.forEach(tipo => {
      for (let i = 0; i < CONFIG.MAX_DINOSAURIOS_POOL; i++) {
        estadoJuego.repartosDisponibles.push(tipo);
      }
    });
    estadoJuego.repartosDisponibles = Utils.mezclarArray(estadoJuego.repartosDisponibles);
  },

  iniciarRonda() {
    if (!estadoJuego.modoSeguimiento) {
      this.repartirDinosaurios();
    }
    this.configurarTurnoInicial();
  },

  limpiarTablero() {
    Utils.limpiarElementos('.dinosaurio-colocado');

    [estadoJuego.jugador1, estadoJuego.jugador2].forEach(jugador => {
      Object.keys(jugador.recintos).forEach(recinto => {
        jugador.recintos[recinto] = [];
      });
      jugador.puntosRonda = 0;
    });

    RenderManager.renderizarTablero();
    GameLogic.actualizarPuntos();
    GameLogic.actualizarPesos();
    this.actualizarInterfaz();

    console.log('Tablero limpiado completamente para nueva ronda');
  },

  repartirDinosaurios() {
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

  configurarTurnoInicial() {
    estadoJuego.puedePasarTurno = false;
    estadoJuego.yaColocoEnTurno = false;

    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      btn.disabled = true;
    }

    if (estadoJuego.esPrimerTurnoDeRonda()) {
      this.establecerSinRestriccion();
    } else {
      this.ocultarRestriccion();
    }

    RenderManager.actualizarDinosauriosDisponibles();
    this.actualizarInterfaz();
    RenderManager.renderizarTablero();
    this.actualizarBotonSiguiente();
  },

  procesarSiguienteTurno() {
    const jugadorActual = estadoJuego.getJugadorActual();
    const tienenDinosaurios = jugadorActual.dinosauriosDisponibles.length > 0;
    
    // CORRECIÓN CRíTICA: Solo validar si hay dinosaurios disponibles
    if (tienenDinosaurios) {
      if (!estadoJuego.yaColocoEnTurno) {
        console.log('Debe colocar un dinosaurio');
        if (window.app?.showToast) {
          window.app.showToast('Debes colocar un dinosaurio primero', 'warning');
        }
        return;
      }
      
      if (!estadoJuego.puedePasarTurno) {
        console.log('Debe descartar un dinosaurio');
        if (window.app?.showToast) {
          window.app.showToast('Debes descartar un dinosaurio primero', 'warning');
        }
        return;
      }
    }

    if (estadoJuego.esFinDeRonda()) {
      this.finalizarRonda();
      return;
    }

    estadoJuego.cambiarTurno();

    if (estadoJuego.modoSeguimiento) {
      this.procesarTurnoSeguimiento();
    } else {
      this.procesarTurnoNormal();
    }
  },

  procesarTurnoSeguimiento() {
    const jugador = estadoJuego.getJugadorActual();
    console.log(`Procesando turno seguimiento - Jugador ${estadoJuego.jugadorActual}, Turno ${estadoJuego.turnoEnRonda}, Ronda ${estadoJuego.rondaActual}`);

    const avatarSrc = estadoJuego.jugadorActual === 1 ?
      'img/foto_usuario-1.png' :
      (window.app?.jugador2Info?.tipo === 'invitado' ? 'img/invitado.png' : 'img/foto_usuario-2.png');

    if (window.app?.mostrarTurnoJugadorConSeleccion) {
      window.app.mostrarTurnoJugadorConSeleccion(jugador.nombre, avatarSrc);
    }
  },

  procesarTurnoNormal() {
    if (window.app?.showScreen) {
      document.getElementById('pantalla-partida')?.setAttribute('style', 'display:none');
      window.app.showScreen('dado-animacion');
      setTimeout(() => window.app.iniciarAnimacionDado(), 400);
    } else {
      this.ocultarRestriccion();
      RenderManager.actualizarDinosauriosDisponibles();
      this.actualizarInterfaz();
      RenderManager.renderizarTablero();
    }
  },

  procesarResultadoDado(numeroDado) {
    estadoJuego.dadoNumero = numeroDado;
    const restriccion = CONFIG.RESTRICCIONES_DADO[numeroDado || 1];
    if (restriccion) {
      this.establecerRestriccion(restriccion.tipo, restriccion.titulo);
    }

    const partida = document.getElementById('pantalla-partida');
    if (partida) partida.style.display = 'block';

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

    if (info) info.style.visibility = 'visible';
    if (icono && tipo) {
      const restriccion = Object.values(CONFIG.RESTRICCIONES_DADO)
        .find(r => r.tipo === tipo);
      if (restriccion) {
        icono.src = `img/${restriccion.imagen}.png`;
        icono.style.display = 'block';
      }
    }
    if (texto) {
      texto.innerHTML = `<div>Restricción</div><div>${titulo}</div>`;
    }
  },

  establecerSinRestriccion() {
    estadoJuego.restriccionActual = null;

    const info = document.querySelector('.info-restriccion');
    const texto = document.querySelector('.texto-restriccion');
    const icono = document.querySelector('.icono-restriccion-footer');

    if (info) info.style.visibility = 'visible';
    if (texto) texto.innerHTML = '<div>Sin restricción</div>';
    if (icono) icono.style.display = 'none';
  },

  ocultarRestriccion() {
    estadoJuego.restriccionActual = null;
    const info = document.querySelector('.info-restriccion');
    const icono = document.querySelector('.icono-restriccion-footer');

    if (info) info.style.visibility = 'hidden';
    if (icono) icono.style.display = 'block';
  },

  mostrarPopupDescarte() {
    const jugador = estadoJuego.getJugadorActual();

    if (jugador.dinosauriosDisponibles.length === 0) {
      estadoJuego.puedePasarTurno = true;
      this.habilitarBotonSiguiente();
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
        className: 'dino-descarte',
        alt: tipo,
        dataset: { 
          tipo: tipo, 
          index: index.toString()
        }
      }, {
        width: '64px',
        height: '64px',
        cursor: 'pointer'
      });

      img.onclick = () => this.seleccionarParaDescarte(img, index, tipo);
      contenedor.appendChild(img);
    });

    const btnConfirmar = document.getElementById('btn-confirmar-descarte');
    if (btnConfirmar) {
      btnConfirmar.disabled = true;
      btnConfirmar.onclick = () => this.confirmarDescarte();
    }

    Utils.abrirPopup(popup);
  },

  seleccionarParaDescarte(elemento, index, tipo) {
    document.querySelectorAll('.dino-descarte').forEach(d => {
      d.classList.remove('seleccionado');
    });

    elemento.classList.add('seleccionado');
    
    this.dinoSeleccionadoDescarte = index;
    this.tipoSeleccionadoDescarte = tipo;
    
    console.log(`Seleccionado para descarte: í­ndice ${index}, tipo ${tipo}`);

    const btnConfirmar = document.getElementById('btn-confirmar-descarte');
    if (btnConfirmar) btnConfirmar.disabled = false;
  },

  confirmarDescarte() {
    if (this.dinoSeleccionadoDescarte == null || !this.tipoSeleccionadoDescarte) {
      console.log('No hay dinosaurio seleccionado para descartar');
      return;
    }

    const jugador = estadoJuego.getJugadorActual();
    
    if (this.dinoSeleccionadoDescarte >= 0 && 
        this.dinoSeleccionadoDescarte < jugador.dinosauriosDisponibles.length) {
      
      const dinoEliminado = jugador.dinosauriosDisponibles.splice(this.dinoSeleccionadoDescarte, 1)[0];
      estadoJuego.dinosauriosDescartados.push(dinoEliminado);
      
      // CRíTICO: Guardar el descarte para el jugador especí­fico
      if (estadoJuego.jugadorActual === 1) {
        estadoJuego.descartadosJ1.push(dinoEliminado);
      } else {
        estadoJuego.descartadosJ2.push(dinoEliminado);
      }
      
      console.log(`Descartado correctamente: ${dinoEliminado} (í­ndice: ${this.dinoSeleccionadoDescarte})`);
    }

    Utils.cerrarPopup(document.getElementById('popup-descarte'));
    this.dinoSeleccionadoDescarte = null;
    this.tipoSeleccionadoDescarte = null;

    estadoJuego.puedePasarTurno = true;
    this.habilitarBotonSiguiente();
    RenderManager.actualizarDinosauriosDisponibles();
  },

  habilitarBotonSiguiente() {
    const btn = document.getElementById('btn-siguiente-turno');
    if (btn) {
      // Permitir el botón si no hay dinosaurios disponibles O si ya se descartó
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
    
    // Habilitar si no hay dinosaurios O si ya se completó el turno
    btn.disabled = !sinDinosaurios && (!estadoJuego.yaColocoEnTurno || !estadoJuego.puedePasarTurno);

    if (estadoJuego.esFinDeRonda()) {
      btn.textContent = estadoJuego.rondaActual === 1 ? 'Finalizar ronda' : 'Fin del juego';
    } else {
      btn.textContent = 'Siguiente turno';
    }
  },

  actualizarInterfaz() {
    const jugador = estadoJuego.getJugadorActual();
    const oponente = estadoJuego.getOponente();

    const textoJugador = document.querySelector('.texto-jugador');
    const nombrePuntos = document.querySelector('.nombre-puntos');

    if (textoJugador) {
      textoJugador.textContent = jugador.nombre.toUpperCase();
    }

    if (nombrePuntos) {
      const puntosOponente = parseInt(oponente.puntosRonda) || 0;
      nombrePuntos.textContent = `${oponente.nombre.toUpperCase()} - ${puntosOponente} PUNTOS`;
    }

    const infoJugador2 = document.querySelector('.info-jugador2');
    const verMapa = document.querySelector('.ver-mapa');

    if (estadoJuego.modoSeguimiento) {
      if (infoJugador2) infoJugador2.style.visibility = 'visible';
      if (verMapa) verMapa.style.display = 'none';
    } else {
      if (infoJugador2) infoJugador2.style.visibility = 'visible';
      if (verMapa) verMapa.style.display = 'block';
    }

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

    const iconoRestriccion = document.querySelector('.icono-restriccion-footer');
    if (iconoRestriccion) {
      if (estadoJuego.dadoNumero && estadoJuego.restriccionActual) {
        const restriccion = CONFIG.RESTRICCIONES_DADO[estadoJuego.dadoNumero];
        if (restriccion) {
          iconoRestriccion.src = `img/${restriccion.imagen}.png`;
          iconoRestriccion.style.display = 'block';
        }
      } else {
        iconoRestriccion.style.display = 'none';
      }
    }

    const puntosActuales = parseInt(jugador.puntosRonda) || 0;

    const puntosFooter = document.querySelector('.info-jugador .puntos-jugador span');
    if (puntosFooter) {
      puntosFooter.textContent = `${puntosActuales} PUNTOS`;
    }

    GameLogic.actualizarPuntos();
  },

  finalizarRonda() {
    this.calcularPuntosRonda();

    if (estadoJuego.rondaActual === 1) {
      this.mostrarResumenRonda();
    } else {
      this.mostrarPantallaFinal();
    }
  },

  calcularPuntosRonda() {
    const todosJugadores = estadoJuego.getTodosJugadores();
    
    const puntosRondaJ1 = GameLogic.calcularPuntos(
      estadoJuego.jugador1.recintos, 
      estadoJuego.jugador1, 
      todosJugadores
    );
    const puntosRondaJ2 = GameLogic.calcularPuntos(
      estadoJuego.jugador2.recintos, 
      estadoJuego.jugador2, 
      todosJugadores
    );

    estadoJuego.jugador1.puntosRonda = puntosRondaJ1;
    estadoJuego.jugador2.puntosRonda = puntosRondaJ2;

    estadoJuego.jugador1.puntos += puntosRondaJ1;
    estadoJuego.jugador2.puntos += puntosRondaJ2;

    console.log(`Ronda ${estadoJuego.rondaActual} finalizada`);
    console.log(`J1: ${puntosRondaJ1} puntos esta ronda, total: ${estadoJuego.jugador1.puntos}`);
    console.log(`J2: ${puntosRondaJ2} puntos esta ronda, total: ${estadoJuego.jugador2.puntos}`);
  },

  mostrarResumenRonda() {
    if (window.app?.showScreen) {
      window.app.showScreen('resumen-ronda');
      this.actualizarResumenRonda();

      const btnSiguiente = document.getElementById('btn-siguiente-ronda');
      if (btnSiguiente) {
        btnSiguiente.onclick = () => this.prepararSiguienteRonda();
      }
    }
  },

  actualizarResumenRonda() {
    const elementos = {
      'puntos-resumen-j1': `${estadoJuego.jugador1.puntosRonda} puntos`,
      'puntos-resumen-j2': `${estadoJuego.jugador2.puntosRonda} puntos`,
      'nombre-resumen-j1': estadoJuego.jugador1.nombre.toUpperCase(),
      'nombre-resumen-j2': estadoJuego.jugador2.nombre.toUpperCase()
    };

    Object.entries(elementos).forEach(([id, valor]) => {
      const elem = document.getElementById(id);
      if (elem) elem.textContent = valor;
    });
  },

  prepararSiguienteRonda() {
    this.limpiarTablero();

    estadoJuego.rondaActual = 2;

    const quienEmpezoRonda1 = estadoJuego.primerJugadorOriginal || 1;
    estadoJuego.primerJugador = quienEmpezoRonda1 === 1 ? 2 : 1;
    estadoJuego.jugadorActual = estadoJuego.primerJugador;
    estadoJuego.turnoEnRonda = 1;

    // Reset completo para ronda 2
    estadoJuego.turnosCompletadosJ1 = 0;
    estadoJuego.turnosCompletadosJ2 = 0;
    estadoJuego.descartadosJ1 = [];
    estadoJuego.descartadosJ2 = [];

    estadoJuego.dinosauriosRondaJ1 = [];
    estadoJuego.dinosauriosRondaJ2 = [];
    estadoJuego.jugador1.dinosauriosDisponibles = [];
    estadoJuego.jugador2.dinosauriosDisponibles = [];
    estadoJuego.dinosauriosDescartados = [];

    console.log(`=== INICIANDO RONDA 2 ===`);
    console.log(`Empezó Ronda 1: Jugador ${quienEmpezoRonda1}`);
    console.log(`Empieza Ronda 2: Jugador ${estadoJuego.primerJugador}`);

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
      this.iniciarRonda();
      if (window.app?.showScreen) {
        window.app.showScreen('partida');
      }
    }
  },

  mostrarPantallaFinal() {
    if (window.app?.showScreen) {
      window.app.showScreen('resultados');
      this.actualizarPantallaFinal();
    }
  },

  actualizarPantallaFinal() {
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

  reiniciarJuegoCompleto() {
    estadoJuego.reset();
    this.generarPoolDinosaurios();
  }
};


/* ==================== INICIALIZACIÓN ==================== */
document.addEventListener('DOMContentLoaded', () => {
  const btnSiguiente = document.getElementById('btn-siguiente-turno');
  if (btnSiguiente) {
    btnSiguiente.addEventListener('click', () => {
      JuegoManager.procesarSiguienteTurno();
    });
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
  window.JuegoManager = JuegoManager;
  window.estadoJuego = estadoJuego;
  window.ModoSeguimiento = ModoSeguimiento;
  window.RenderManager = RenderManager;

  window.mostrarReglas = () => PopupManager.mostrarReglas();
  window.mostrarPesos = () => PopupManager.mostrarPesos();
  window.mostrarMapa = () => MapaOponente.mostrar();
  window.cerrarPopup = (id) => PopupManager.cerrar(id);

  if (window.app) {
    window.app.empezarTurnoSeguimiento = function () {
      window.app.showScreen('partida');

      const jugadorNum = estadoJuego.jugadorActual;
      const yaSeleccionoEnRonda = (jugadorNum === 1 && estadoJuego.dinosauriosRondaJ1.length > 0) ||
        (jugadorNum === 2 && estadoJuego.dinosauriosRondaJ2.length > 0);

      console.log(`empezarTurnoSeguimiento - Jugador ${jugadorNum}, Ya seleccionó: ${yaSeleccionoEnRonda}`);

      setTimeout(() => {
        if (!yaSeleccionoEnRonda) {
          console.log(`Mostrando selección para jugador ${jugadorNum}`);
          ModoSeguimiento.mostrarPopupSeleccionDinosaurios();
        } else {
          console.log(`Restaurando dinosaurios para jugador ${jugadorNum}`);
          ModoSeguimiento.restaurarDinosauriosGuardados();
        }
      }, 100);
    };
  }
});