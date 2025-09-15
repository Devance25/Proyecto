/*
=============================================================================
APLICACIÓN PRINCIPAL - GESTIÓN DE ESTADO Y NAVEGACIÓN
=============================================================================
*/

/**
 * Clase principal que maneja todo el estado y flujo de la aplicación
 * Controla navegación entre pantallas, validaciones, autenticación y 
 * coordinación con el sistema de juego (tablero.js)
 */
class AppState {
  constructor() {
    // En qué pantalla estamos actualmente
    this.currentScreen = 'carga';          // Pantalla que se está mostrando
    this.user = null;                      // Información del usuario que inició sesión
    this.loading = false;                  // Si algo se está cargando
    
    // Información sobre la partida
    this.players = [];                     // Nombres de los dos jugadores
    this.jugador2Info = null;              // Datos del segundo jugador
    this.dadoSeleccionado = null;          // Número que salió en el dado
    this.modoSeguimiento = false;          // Si el juego es manual o automático
    
    // Reglas para los formularios
    // Cuántos caracteres mínimo y máximo puede tener cada campo
    this.validationConfig = {
      username: { min: 3, max: 15 },       // Límites para nombres de usuario
      playerName: { min: 2, max: 12 },     // Límites para nombres de jugadores
      password: { min: 6, max: 50 },       // Límites para contraseñas
      minAge: 8                            // Edad mínima para registrarse
    };
    
    this.init();
  }

  /**
   * Inicialización principal de la aplicación
   * Configura sistemas de eventos, validaciones y determina pantalla inicial
   */
  init() {
    // Configurar todas las funciones importantes de la aplicación
    this.bindEvents();                  // Responder a clicks, envíos de formularios y teclas
    this.setupFormValidation();         // Revisar que los formularios estén bien llenados
    this.setupAccessibility();          // Hacer la app más fácil de usar para todos
    this.setupBirthdateField();         // Configurar el campo de fecha de nacimiento
    this.setupFormClickHandlers();      // Responder a clicks en los formularios
    this.setupRealTimeValidation();     // Revisar formularios mientras el usuario escribe
    
    // Decidir qué pantalla mostrar al usuario cuando abre la aplicación
    // Ver si el usuario ya había iniciado sesión antes
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      // El usuario ya estaba logueado - llevarlo directo al menú principal
      this.user = JSON.parse(usuarioGuardado);
      this.showScreen('lobby');
    } else {
      // No hay sesión guardada - mostrar pantalla de inicio de sesión
      setTimeout(() => this.showScreen('login'), 1000);
    }
  }

  /*
  =============================================================================
  SISTEMA DE EVENTOS GLOBALES
  =============================================================================
  */

  /**
   * Configura todas las funciones que escuchan clicks y teclas en la aplicación
   * Esto permite que toda la aplicación responda a las acciones del usuario
   */
  bindEvents() {
    // Escuchar cuando el usuario hace algo en la aplicación
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('submit', this.handleSubmit.bind(this));
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Comportamiento especial cuando presiona Enter en los formularios
    // No envía el formulario si hay errores
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.matches('input:not([type="submit"])')) {
        const form = e.target.closest('form');
        if (form && !this.isFormValid(form)) {
          e.preventDefault();
        }
      }
    });
  }

  /**
   * Decide qué hacer cuando el usuario hace clic en algún botón o elemento
   * Busca el ID del elemento clicado y ejecuta la acción correspondiente
   * @param {Event} e - Información del clic que hizo el usuario
   */
  handleClick(e) {
    const target = e.target.closest('[id]');
    if (!target) return;
    
    // Lista que conecta cada botón (por su ID) con lo que debe hacer
    const actions = {
      // Cambiar entre las pantallas de login y registro
      'link-registro': () => {
        e.preventDefault();
        this.showScreen('registro');
      },
      'link-login': () => {
        e.preventDefault();
        this.showScreen('login');
      },
      
      // Cerrar sesión del usuario
      'btn-logout': () => this.logout(),
      'btn-salir-admin': () => this.logout(),
      
      // Formas de jugar
      'btn-jugar-app': () => {
        this.modoSeguimiento = false;
        this.showScreen('jugadores');
      },
      'btn-modo-asistente': () => this.iniciarModoSeguimiento(),
      
      // Volver a pantallas anteriores
      'btn-volver-jugadores': () => this.showScreen('lobby'),
      'btn-volver-seleccion': () => this.showScreen('jugadores'),
      
      // Elegir quién juega primero
      'btn-seleccionar-j1': () => {
        if (!this.seleccionEnCurso) {
          this.seleccionEnCurso = true;
          this.iniciarPartidaConJugador(1);
        }
      },
      'btn-seleccionar-j2': () => {
        if (!this.seleccionEnCurso) {
          this.seleccionEnCurso = true;
          this.iniciarPartidaConJugador(2);
        }
      },
      'btn-seleccion-aleatoria': () => this.seleccionAleatoria(),
      
      // Controlar la partida
      'btn-empezar-turno': () => this.empezarTurnoSeguimiento(),
      'btn-comenzar-juego': () => this.comenzarJuego(),
      'btn-siguiente-ronda': () => this.siguienteRonda(),
      'btn-revancha': () => this.revancha(),
      'btn-nueva-partida': () => this.nuevaPartida(),
      'btn-volver-inicio-final': () => this.showScreen('lobby')
    };
    
    // Ejecutar la función correspondiente si encontramos el botón en nuestra lista
    if (actions[target.id]) {
      actions[target.id]();
    }
  }

  /**
   * Maneja todos los eventos de envío de formularios
   * Previene comportamiento por defecto y delega a funciones específicas
   * @param {Event} e - Evento de envío del formulario
   */
  handleSubmit(e) {
    e.preventDefault();
    const formActions = {
      'login-form': () => this.handleLogin(e.target),
      'register-form': () => this.handleRegister(e.target),
      'form-jugadores': () => this.handleJugadoresSubmit(e.target)
    };
    
    if (formActions[e.target.id]) {
      formActions[e.target.id]();
    }
  }

  /**
   * Maneja eventos globales de teclado
   * @param {KeyboardEvent} e - Evento de teclado
   */
  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.hideToasts(); // Cerrar notificaciones con Esc
    }
  }

  /*
  =============================================================================
  SISTEMA DE VALIDACIÓN EN TIEMPO REAL
  =============================================================================
  */

  /**
   * Configura validación instantánea mientras el usuario escribe
   */
  setupRealTimeValidation() {
    document.addEventListener('input', e => {
      // Revisar nombres de jugadores mientras escriben
      if (e.target.matches('#jugador-1, #jugador-2')) {
        this.validatePlayerNameRealTime(e.target);
      }
      // Revisar nombres de usuario mientras escriben
      if (e.target.matches('#register-username')) {
        this.validateUsernameRealTime(e.target);
      }
    });
  }

  /**
   * Valida nombres de jugadores en tiempo real
   * Aplica filtros de caracteres, longitud y formatea automáticamente
   * @param {HTMLInputElement} input - Campo de entrada del nombre
   */
  validatePlayerNameRealTime(input) {
    const value = input.value;
    const { max, min } = this.validationConfig.playerName;
    
    // Mostrar cuántos caracteres ha escrito de los permitidos
    this.updateCharacterCounter(input, value.length, max);
    
    // Si escribió demasiado, cortar el texto
    if (value.length > max) {
      input.value = value.substring(0, max);
      this.showToast(`Nombre máximo ${max} caracteres`, 'warning');
    }
    
    // Solo permitir letras, espacios y acentos (ñ, á, é, etc.)
    if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/.test(value)) {
      input.value = value.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
      this.showToast('Solo se permiten letras y espacios', 'warning');
    }
    
    // Si hay varios espacios seguidos, cambiarlos por uno solo
    if (/\s{2,}/.test(value)) {
      input.value = value.replace(/\s+/g, ' ');
    }
    
    // Revisar si ya se puede habilitar el botón de comenzar
    this.actualizarBotonComenzar();
    
    // Quitar el color rojo si ya está bien escrito
    if (value.length >= min && value.length <= max && value.trim() !== '') {
      this.clearFieldError(input);
    }
  }

  /**
   * Valida nombres de usuario para registro en tiempo real
   * Permite solo caracteres alfanuméricos y guión bajo
   * @param {HTMLInputElement} input - Campo de entrada del usuario
   */
  validateUsernameRealTime(input) {
    const value = input.value;
    const max = this.validationConfig.username.max;
    
    // Mostrar cuántos caracteres lleva escritos
    this.updateCharacterCounter(input, value.length, max);
    
    // Si escribió demasiado, cortar el texto
    if (value.length > max) {
      input.value = value.substring(0, max);
      this.showToast(`Usuario máximo ${max} caracteres`, 'warning');
    }
    
    // Solo permitir letras, números y guión bajo (_)
    if (!/^[a-zA-Z0-9_]*$/.test(value)) {
      input.value = value.replace(/[^a-zA-Z0-9_]/g, '');
      this.showToast('Solo letras, números y guión bajo', 'warning');
    }
  }

  /**
   * Actualiza el contador visual de caracteres en campos de entrada
   * Proporciona feedback visual sobre límites de caracteres con colores
   * @param {HTMLInputElement} input - Campo de entrada
   * @param {number} currentLength - Longitud actual del texto
   * @param {number} maxLength - Longitud máxima permitida
   */
  updateCharacterCounter(input, currentLength, maxLength) {
    let counter = input.parentElement.querySelector('.character-counter');
    
    // Si no existe el contador, crearlo
    if (!counter) {
      counter = document.createElement('div');
      counter.className = 'character-counter';
      input.parentElement.appendChild(counter);
    }
    
    // Escribir cuántos caracteres lleva de los totales permitidos
    counter.textContent = `${currentLength}/${maxLength}`;
    
    // Cambiar el color según qué tan cerca esté del límite
    if (maxLength - currentLength < 3) {
      // Muy cerca del límite - rojo
      counter.className = 'character-counter character-counter--warning';
    } else if (maxLength - currentLength < 6) {
      // Acercándose al límite - amarillo
      counter.className = 'character-counter character-counter--attention';
    } else {
      // Seguro - sin color especial
      counter.className = 'character-counter';
    }
  }

  /**
   * Controla el estado del botón para iniciar partida
   * Valida que ambos jugadores tengan nombres válidos y diferentes
   */
  actualizarBotonComenzar() {
    const j1 = document.getElementById('jugador-1');
    const j2 = document.getElementById('jugador-2');
    const btn = document.getElementById('btn-comenzar-partida');
    
    if (!j1 || !j2 || !btn) return;
    
    // Validar criterios para habilitar el botón
    const j1Valid = j1.value.trim().length >= this.validationConfig.playerName.min;
    const j2Valid = j2.value.trim().length >= this.validationConfig.playerName.min && 
                    j2.value.trim().length <= this.validationConfig.playerName.max;
    const namesAreDifferent = j1.value.trim().toLowerCase() !== j2.value.trim().toLowerCase();
    
    // Solo habilitar si todos los criterios se cumplen
    btn.disabled = !(j1Valid && j2Valid && namesAreDifferent);
    
    // Cambiar el texto del botón dependiendo del tipo de juego
    const btnText = btn.querySelector('.btn-text');
    if (btnText) {
      btnText.textContent = this.modoSeguimiento ? 'Modo seguimiento' : 'Jugar en la app';
    }
    
    // Feedback visual en campo del jugador 2
    if (j2.value.trim() && !j2Valid) {
      j2.classList.add('error');
    } else if (j2Valid && namesAreDifferent) {
      j2.classList.remove('error');
    }
  }

  /*
  =============================================================================
  SISTEMA DE VALIDACIÓN DE FORMULARIOS
  =============================================================================
  */

  /**
   * Valida los campos del formulario de login
   * @param {string} nombreUsuario - Nombre de usuario o correo
   * @param {string} contraseña - Contraseña
   * @param {HTMLFormElement} form - Formulario de login
   * @returns {boolean} - true si es válido
   */
  validateLoginForm(username, password, form) {
    // Validaciones básicas de campos requeridos
    const validations = [
      [!username, '#login-username', 'Por favor ingresa tu usuario'],
      [!password, '#login-password', 'Por favor ingresa tu contraseña']
    ];
    
    // Revisar cada campo uno por uno hasta encontrar un error
    for (const [condition, field, message] of validations) {
      if (condition) {
        this.showFieldError(form, field, message);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Valida todos los campos del formulario de registro
   * Aplica múltiples reglas: longitud, formato, edad, etc.
   * @param {Object} data - Datos del formulario de registro
   * @param {HTMLFormElement} form - Formulario de registro
   * @returns {boolean} - true si todos los campos son válidos
   */
  validateRegisterForm(data, form) {
    const { username: { min: userMin, max: userMax }, password: { min: passMin } } = this.validationConfig;
    
    // Lista de todas las cosas que hay que revisar en el formulario
    const validations = [
      // Revisar datos del usuario
      [!data.username, '#register-username', 'Por favor ingresa tu nombre de usuario'],
      [data.username.length < userMin || data.username.length > userMax, 
       '#register-username', `El usuario debe tener entre ${userMin} y ${userMax} caracteres`],
      
      // Validaciones de email
      [!data.email, '#register-email', 'Por favor ingresa tu email'],
      [!this.validateEmail(data.email), '#register-email', 'Ingresa un email válido'],
      
      // Validaciones de fecha de nacimiento
      [!data.birthdate, '#register-fecha', 'Por favor ingresa tu fecha de nacimiento'],
      [this.isFutureDate(data.birthdate), '#register-fecha', 'La fecha de nacimiento no puede ser futura'],
      [this.isUnderAge(data.birthdate, this.validationConfig.minAge), 
       '#register-fecha', `Debes tener al menos ${this.validationConfig.minAge} años para registrarte`],
      
      // Validaciones de contraseña
      [!data.password, '#register-password', 'Por favor ingresa tu contraseña'],
      [data.password.length < passMin, 
       '#register-password', `La contraseña debe tener al menos ${passMin} caracteres`],
      [!/^(?=.*[A-Za-z])(?=.*\d)/.test(data.password), 
       '#register-password', 'La contraseña debe contener al menos una letra y un número'],
      
      // Validaciones de confirmación de contraseña
      [!data.passwordConfirm, '#register-password-confirm', 'Por favor confirma tu contraseña'],
      [data.password !== data.passwordConfirm, 
       '#register-password-confirm', 'Las contraseñas no coinciden']
    ];
    
    // Revisar todo hasta encontrar algo mal
    for (const [condition, field, message] of validations) {
      if (condition) {
        this.showFieldError(form, field, message);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Valida que los nombres de los jugadores cumplan con las reglas establecidas
   * Verifica longitud, caracteres permitidos y que sean diferentes entre sí
   * @param {HTMLInputElement} j1 - Campo del primer jugador
   * @param {HTMLInputElement} j2 - Campo del segundo jugador
   * @returns {boolean} - true si ambos nombres son válidos
   */
  validatePlayersForm(j1, j2) {
    // Obtener límites de caracteres para nombres de jugadores
    const { min, max } = this.validationConfig.playerName;
    const j2Name = j2.value.trim();
    const j1Name = j1.value.trim();
    
    // Lista de validaciones que debe pasar el segundo jugador
    const validations = [
      // Verificar que el campo no esté vacío
      [!j2 || !j2Name, '#jugador-2', 'Ingresa el nombre del segundo jugador'],
      // Verificar longitud mínima
      [j2Name.length < min, '#jugador-2', `El nombre debe tener al menos ${min} caracteres`],
      // Verificar longitud máxima
      [j2Name.length > max, '#jugador-2', `El nombre no puede exceder ${max} caracteres`],
      // Verificar que solo contenga letras y espacios (incluye acentos y ñ)
      [!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(j2Name), 
       '#jugador-2', 'El nombre solo puede contener letras y espacios'],
      // Verificar que los nombres sean diferentes (comparación sin mayúsculas)
      [j1Name.toLowerCase() === j2Name.toLowerCase(), 
       '#jugador-2', 'Los jugadores deben tener nombres diferentes']
    ];
    
    // Revisar cada validación y mostrar error si alguna falla
    for (const [condition, field, message] of validations) {
      if (condition) {
        this.showFieldError(document.getElementById('form-jugadores'), field, message);
        return false;
      }
    }
    
    return true;
  }

  /*
  =============================================================================
  UTILIDADES DE VALIDACIÓN
  =============================================================================
  */

  /**
   * Verifica si un formulario completo es válido
   * @param {HTMLFormElement} form - Formulario a validar
   * @returns {boolean} - true si todos los campos requeridos son válidos
   */
  isFormValid(form) {
    const fields = form.querySelectorAll('input[required], input.form-input');
    return Array.from(fields).every(field => {
      return field.value.trim() !== '' && !field.classList.contains('error');
    });
  }

  /**
   * Limpia nombres de jugadores removiendo espacios extra y limitando longitud
   * @param {string} name - Nombre a limpia
   * @returns {string} - Nombre limpio y dentro de límites
   */
  sanitizePlayerName(name) {
    return name.trim().replace(/\s+/g, ' ').substring(0, this.validationConfig.playerName.max);
  }

  /**
   * Valida que el formato del correo electrónico sea correcto
   * Usa expresión regular RFC 5322 para validación completa
   * @param {string} email - Correo electrónico a validar
   * @returns {boolean} - true si el formato es válido
   */
  validateEmail(email) {
    // Expresión regular que sigue el estándar RFC 5322 para emails
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    // Verificar formato y longitud máxima permitida
    return re.test(email) && email.length <= 254;
  }

  /**
   * Verifica si una fecha es futura (después de hoy)
   * Útil para validar fechas de nacimiento que no pueden ser futuras
   * @param {string} dateString - Fecha en formato string
   * @returns {boolean} - true si la fecha es futura
   */
  isFutureDate(dateString) {
    if (!dateString) return false;
    
    // Crear fecha de hoy sin horas para comparación exacta
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(dateString);
    
    return inputDate > today;
  }

  /**
   * Calcula si una persona es menor de edad según su fecha de nacimiento
   * Considera años, meses y días para cálculo preciso de edad
   * @param {string} dateString - Fecha de nacimiento en formato string
   * @param {number} minAge - Edad mínima requerida
   * @returns {boolean} - true si es menor de la edad mínima
   */
  isUnderAge(dateString, minAge) {
    if (!dateString) return false;
    
    const today = new Date();
    const birthDate = new Date(dateString);
    
    // Calcular edad básica por diferencia de años
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Ajustar edad si aún no ha cumplido años este año
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age < minAge;
  }

  /*
  =============================================================================
  SISTEMA DE NAVEGACIÓN ENTRE PANTALLAS
  =============================================================================
  */

  /**
   * Cambia la pantalla visible de la aplicación
   * Maneja transiciones, animaciones y configuración específica de cada pantalla
   * @param {string} screenName - Nombre de la pantalla sin prefijo 'pantalla-'
   */
  showScreen(screenName) {
    const targetScreen = document.getElementById(`pantalla-${screenName}`);
    if (!targetScreen) {
      console.error(`Pantalla no encontrada: pantalla-${screenName}`);
      return;
    }

    // Quitar la pantalla de carga si está visible
    const loadingScreen = document.getElementById('pantalla-carga');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }

    // Mostrar la pantalla que queremos con efectos
    targetScreen.classList.remove('hidden');
    targetScreen.style.opacity = '1';
    targetScreen.style.transition = '';
    
    // Esconder todas las otras pantallas
    document.querySelectorAll('.pantalla, .pantalla-inicio').forEach(s => {
      if (s !== targetScreen) {
        s.classList.add('hidden');
        s.style.opacity = '';
        s.style.transition = '';
      }
    });
    
    // Hacer que los elementos aparezcan con efecto
    this.animateScreenElements(targetScreen);
    
    // Actualizar estado interno y configurar pantalla
    this.currentScreen = screenName;
    this.handleScreenSpecificSetup(screenName, targetScreen);
  }

  /**
   * Aplica animaciones de entrada a elementos de una pantalla
   * Crea efecto escalonado donde los elementos aparecen uno tras otro
   * @param {HTMLElement} screen - Pantalla que contiene los elementos a animar
   */
  animateScreenElements(screen) {
    // Buscar todos los elementos que tienen clases de animación
    const elements = screen.querySelectorAll('.fade-in, .fade-in-up');
    
    // Aplicar delay progresivo a cada elemento para efecto escalonado
    elements.forEach((el, index) => {
      setTimeout(() => {
        // Cada elemento aparece 100ms después del anterior
        el.style.animationDelay = `${index * 100}ms`;
        el.classList.add('animated');
      }, 100);
    });
  }

  /**
   * Configura elementos específicos según la pantalla que se está mostrando
   * Cada pantalla puede necesitar configuración especial al aparecer
   * @param {string} screenName - Nombre de la pantalla actual
   * @param {HTMLElement} screen - Elemento DOM de la pantalla
   */
  handleScreenSpecificSetup(screenName, screen) {
    switch(screenName) {
      case 'jugadores':
        // Configurar formulario de selección de jugadores
        this.setupPantallaJugadores();
        break;
      case 'seleccion-inicial':
        // Configurar eventos para selección de quién empieza
        this.setupSeleccionInicialEvents();
        break;
      case 'lobby':
        // Mostrar nombre del usuario en el lobby
        if (this.user && screen) {
          const titulo = screen.querySelector('.titulo--lg');
          if (titulo) titulo.textContent = this.user.name;
        }
        break;
      case 'partida':
        // Mostrar la pantalla de juego principal
        const pantallaPartida = document.getElementById('pantalla-partida');
        if (pantallaPartida) {
          pantallaPartida.classList.remove('hidden');
        }
        break;
    }
  }

  /**
   * Configura todos los elementos necesarios para la pantalla de selección de jugadores
   * Carga datos del usuario, configura controles y eventos específicos
   */
  setupPantallaJugadores() {
    // Verificar que la pantalla existe antes de configurarla
    if (!document.getElementById('lista-jugadores')) return;
    
    // Configurar todos los componentes de la pantalla
    this.loadUserData();              // Cargar datos del usuario logueado
    this.setupGameControls();         // Configurar botones y controles
    this.setupTipoJugadorChange();    // Configurar cambio entre invitado/usuario
    this.actualizarBotonComenzar();  // Actualizar estado del botón principal
  }

  /**
   * Carga automáticamente el nombre del usuario logueado en el campo del primer jugador
   * Facilita la experiencia del usuario al no tener que escribir su nombre nuevamente
   */
  loadUserData() {
    const input = document.getElementById('jugador-1');
    if (input && this.user?.username) {
      input.value = this.user.username;
    }
  }

  /**
   * Configura los controles principales del juego
   * Deshabilita el botón de comenzar inicialmente y configura eventos de validación
   */
  setupGameControls() {
    // Deshabilitar botón de comenzar hasta que se completen los datos
    const btn = document.getElementById('btn-comenzar-partida');
    if (btn) btn.disabled = true;
    
    // Escuchar cambios en los campos para validar en tiempo real
    const container = document.getElementById('lista-jugadores');
    if (container) {
      container.addEventListener('input', () => this.actualizarBotonComenzar());
    }
  }

  /**
   * Configura los eventos para cambiar entre tipo de jugador (invitado/usuario)
   * Maneja tanto clicks en radio buttons como en sus labels asociados
   */
  setupTipoJugadorChange() {
    const radioInvitado = document.getElementById('radio-invitado');
    const radioUsuario = document.getElementById('radio-usuario');
    
    // Configurar eventos para los radio buttons
    [radioInvitado, radioUsuario].forEach(radio => {
      if (radio) {
        radio.addEventListener('change', () => {
          if (radio.checked) {
            this.updatePlayerType(radio.value);
          }
        });
      }
    });
    
    // Configurar eventos para clicks en los labels (mejora UX)
    document.querySelectorAll('.radio-option').forEach(label => {
      label.addEventListener('click', (e) => {
        e.stopPropagation();
        const input = label.querySelector('input[type="radio"]');
        if (input) {
          input.checked = true;
          this.updatePlayerType(input.value);
          // Disparar evento change para activar otros listeners
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
  }

  /**
   * Actualiza la interfaz cuando cambia el tipo de segundo jugador
   * Cambia avatar, placeholder, campos requeridos y validaciones según el tipo
   * @param {string} tipo - Tipo de jugador: 'invitado' o 'usuario'
   */
  updatePlayerType(tipo) {
    const avatar = document.getElementById('avatar-jugador-2');
    const nombre = document.getElementById('jugador-2');
    const grupoPassword = document.getElementById('grupo-password-jugador2');
    const passwordInput = document.getElementById('password-jugador-2');
    
    // Actualizar avatar según el tipo de jugador
    if (avatar) {
      avatar.src = tipo === 'invitado' ? 'img/invitado.png' : 'img/foto_usuario-2.png';
      avatar.alt = tipo === 'invitado' ? 'Invitado' : 'Usuario existente';
    }
    
    // Actualizar placeholder y limpiar campo de nombre
    if (nombre) {
      nombre.placeholder = tipo === 'invitado' ? 
        'Ingrese nombre de jugador #2' : 
        'Nombre de usuario existente';
      nombre.value = '';
    }

    // Mostrar/ocultar campo de contraseña según el tipo
    if (grupoPassword && passwordInput) {
      if (tipo === 'usuario') {
        // Usuario existente necesita contraseña
        grupoPassword.classList.remove('hidden');
        passwordInput.required = true;
      } else {
        // Invitado no necesita contraseña
        grupoPassword.classList.add('hidden');
        passwordInput.required = false;
        passwordInput.value = '';
      }
    }
    
    // Revalidar el formulario con los nuevos campos
    this.actualizarBotonComenzar();
  }

  /**
   * Configura los eventos para la pantalla de selección de quién empieza la partida
   * Maneja efectos visuales, selección única y transición al juego
   */
  setupSeleccionInicialEvents() {
    // Limpiar eventos anteriores clonando los elementos
    document.querySelectorAll('.jugador-opcion').forEach(opcion => {
      const newOpcion = opcion.cloneNode(true);
      opcion.parentNode.replaceChild(newOpcion, opcion);
    });
    
    // Configurar eventos para cada opción de jugador
    document.querySelectorAll('.jugador-opcion').forEach(opcion => {
      // Efecto hover: elevar y sombrear al pasar el mouse
      opcion.addEventListener('mouseenter', () => {
        opcion.style.transform = 'translateY(-5px)';
        opcion.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      });
      
      // Efecto hover: restaurar posición al salir del mouse (si no está seleccionado)
      opcion.addEventListener('mouseleave', () => {
        if (!opcion.classList.contains('seleccionado')) {
          opcion.style.transform = '';
          opcion.style.boxShadow = '';
        }
      });
      
      // Selección de jugador: solo uno puede estar seleccionado
      opcion.addEventListener('click', () => {
        // Deseleccionar todas las opciones anteriores
        document.querySelectorAll('.jugador-opcion').forEach(opt => {
          opt.classList.remove('seleccionado');
          opt.style.transform = '';
          opt.style.boxShadow = '';
        });
        
        // Seleccionar la opción actual con efectos visuales
        opcion.classList.add('seleccionado');
        opcion.style.transform = 'translateY(-5px)';
        opcion.style.boxShadow = '0 0 20px rgba(98,129,7,0.4)';
        
        // Determinar qué jugador empieza y iniciar partida
        const jugadorNum = opcion.id === 'opcion-jugador-2' ? 2 : 1;
        
        // Prevenir múltiples clicks durante la transición
        if (!this.seleccionEnCurso) {
          this.seleccionEnCurso = true;
          setTimeout(() => this.iniciarPartidaConJugador(jugadorNum), 250);
        }
      });
    });
  }

  /*
  =============================================================================
  MODO SEGUIMIENTO MANUAL
  =============================================================================
  */

  /**
   * Activa el modo seguimiento para partidas manuales
   * En este modo, los jugadores seleccionan sus dinosaurios manualmente
   */
  iniciarModoSeguimiento() {
    this.modoSeguimiento = true;
    this.showScreen('jugadores');
    this.showToast('Modo seguimiento activado', 'success');
  }

  /**
   * Muestra la pantalla de turno con información del jugador actual
   * @param {string} nombreJugador - Nombre del jugador actual
   * @param {string} avatarSrc - Ruta de la imagen del avatar
   */
  mostrarTurnoJugadorConSeleccion(nombreJugador, avatarSrc) {
    const nombreElement = document.getElementById('nombre-turno-jugador');
    const avatarElement = document.getElementById('avatar-turno-actual');
    
    if (nombreElement) nombreElement.textContent = nombreJugador.toUpperCase();
    if (avatarElement) avatarElement.src = avatarSrc;
    
    this.showScreen('turno-jugador');
  }

  /**
   * Inicia el turno en modo seguimiento
   * Muestra el popup para selección manual de dinosaurios
   */
  empezarTurnoSeguimiento() {
    this.showScreen('partida');
    setTimeout(() => {
      if (window.ModoSeguimiento) {
        window.ModoSeguimiento.mostrarPopupSeleccionDinosaurios();
      }
    }, 100);
  }

  /*
  =============================================================================
  GESTIÓN DE JUGADORES Y CONFIGURACIÓN DE PARTIDA
  =============================================================================
  */

  /**
   * Procesa el formulario de configuración de jugadores
   * Valida nombres, depura datos y prepara la información para iniciar partida
   * @param {HTMLFormElement} form - Formulario de jugadores
   */
  handleJugadoresSubmit(form) {
    const j1 = form.querySelector('#jugador-1');
    const j2 = form.querySelector('#jugador-2');
    const tipoJugador = form.querySelector('input[name="tipo-jugador-2"]:checked');
    
    // Limpiar nombres para prevenir problemas de formato
    if (j1) j1.value = this.sanitizePlayerName(j1.value);
    if (j2) j2.value = this.sanitizePlayerName(j2.value);
    
    // Validar formulario antes de proceder
    if (!this.validatePlayersForm(j1, j2)) return;
    
    // Preparar datos de jugadores para la partida
    const nombres = [j1.value.trim(), j2.value.trim()];
    const jugador2Info = {
      nombre: j2.value.trim(),
      tipo: tipoJugador ? tipoJugador.value : 'invitado'
    };
    
    // Proceder a selección de quién empieza
    this.mostrarSelectorQuienEmpieza(nombres, jugador2Info);
  }

  /**
   * Muestra la pantalla de selección de jugador inicial
   * Actualiza la UI con nombres y avatares de los jugadores
   * @param {Array} nombres - Array con nombres de los dos jugadores
   * @param {Object} jugador2Info - Información del segundo jugador
   */
  mostrarSelectorQuienEmpieza(nombres, jugador2Info) {
    // Actualizar nombres en la interfaz
    const n1 = document.querySelector('.nombre-jugador-1');
    const n2 = document.querySelector('.nombre-jugador-2');
    
    if (n1) n1.textContent = nombres[0].toUpperCase();
    if (n2) n2.textContent = nombres[1].toUpperCase();
    
    // Actualizar avatar del segundo jugador según su tipo
    const avatar = document.getElementById('avatar-seleccion-j2');
    if (avatar && jugador2Info) {
      avatar.src = jugador2Info.tipo === 'invitado' ? 
        'img/invitado.png' : 'img/foto_usuario-2.png';
    }
    
    // Navegar a pantalla de selección inicial
    this.showScreen('seleccion-inicial');
  }

  /**
   * Ejecuta selección aleatoria de jugador inicial
   * Aplica efectos visuales y procede automáticamente
   */
  seleccionAleatoria() {
    // Elegir jugador aleatoriamente (50/50)
    const elegido = Math.random() < 0.5 ? 1 : 2;
    const card = document.getElementById(`opcion-jugador-${elegido}`);
    
    // Hacer que se vea cual fue elegido
    if (card) {
      card.classList.add('seleccionado');
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 0 20px rgba(98,129,7,0.4)';
    }
    
    // Iniciar partida con el jugador elegido tras pausa
    setTimeout(() => this.iniciarPartidaConJugador(elegido), 300);
  }

  /**
   * Inicia una nueva partida con los datos de los jugadores y quién empieza
   * Recopila información del formulario y prepara los datos para el juego
   * @param {number} primerJugador - Número del jugador que inicia (1 o 2)
   */
  iniciarPartidaConJugador(primerJugador) {
    // Obtener nombres de los campos del formulario con valores por defecto
    const j1 = document.getElementById('jugador-1')?.value?.trim() || 'Jugador 1';
    const j2 = document.getElementById('jugador-2')?.value?.trim() || 'Jugador 2';
    
    // Crear array con los nombres de ambos jugadores
    const nombres = [j1, j2];
    
    // Recopilar información específica del segundo jugador
    const jugador2Info = {
      nombre: j2,
      tipo: document.querySelector('input[name="tipo-jugador-2"]:checked')?.value || 'invitado'
    };
    
    // Delegar la inicialización al método principal
    this.iniciarPartida(nombres, jugador2Info, primerJugador);
    
    // Permitir nueva selección después de un breve delay
    setTimeout(() => {
      this.seleccionEnCurso = false;
    }, 1000);
  }

  /**
   * Inicializa una nueva partida con todos los parámetros necesarios
   * Coordina entre la interfaz (app.js) y la lógica del juego (tablero.js)
   * @param {Array} nombres - Array con nombres de ambos jugadores
   * @param {Object} jugador2Info - Información del segundo jugador (nombre y tipo)
   * @param {number} primerJugador - Número del jugador que inicia (1 o 2)
   */
  iniciarPartida(nombres, jugador2Info, primerJugador) {
    // Guardar información de los jugadores en el estado de la aplicación
    this.players = nombres.slice(0, 2);
    this.jugador2Info = jugador2Info;
    
    // Delegar la inicialización del juego al sistema de tablero
    if (window.JuegoManager?.inicializarPartida) {
      window.JuegoManager.inicializarPartida(nombres, jugador2Info, primerJugador, this.modoSeguimiento);
    } else {
      console.error('JuegoManager no disponible');
    }
    
    // Configurar la pantalla inicial según el modo de juego
    if (this.modoSeguimiento) {
      // Modo seguimiento: mostrar pantalla de selección manual
      const nombreJugador = nombres[primerJugador - 1];
      const avatarSrc = primerJugador === 1 ? 
        'img/foto_usuario-1.png' : 
        (jugador2Info.tipo === 'invitado' ? 'img/invitado.png' : 'img/foto_usuario-2.png');
      
      this.mostrarTurnoJugadorConSeleccion(nombreJugador, avatarSrc);
    } else {
      // Modo normal: determinar si necesita dado o no
      if (window.estadoJuego?.turnoEnRonda === 1 && window.estadoJuego?.rondaActual === 1) {
        // Primer turno de la primera ronda: sin restricción
        this.mostrarPantallaSinRestriccion();
      } else {
        // Otros turnos: lanzar dado para obtener restricción
        this.showScreen('dado-animacion');
        setTimeout(() => this.iniciarAnimacionDado(), 400);
      }
    }
  }

  /**
   * Muestra la pantalla de juego sin restricciones del dado
   * Se usa en el primer turno de la primera ronda donde no hay limitaciones
   */
  mostrarPantallaSinRestriccion() {
    // Cambiar a la pantalla de partida principal
    this.showScreen('partida');
    
    // Obtener elementos de la interfaz de restricciones
    const infoRestriccion = document.querySelector('.info-restriccion');
    const textoRestriccion = document.querySelector('.texto-restriccion');
    
    // Hacer visible el panel de información de restricción
    if (infoRestriccion) {
      infoRestriccion.style.visibility = 'visible';
    }
    
    // Mostrar mensaje de "Sin restricción" en la interfaz
    if (textoRestriccion) {
      textoRestriccion.innerHTML = '<div>Sin restricción</div>';
    }
    
    // Actualizar la interfaz del juego y dinosaurios disponibles
    if (window.JuegoManager) {
      window.JuegoManager.actualizarInterfaz();
      window.RenderManager?.actualizarDinosauriosDisponibles();
    }
  }

  /**
   * Inicia el juego principal después de la configuración inicial
   * Determina si mostrar pantalla sin restricción o procesar resultado del dado
   */
  comenzarJuego() {
    // Verificar si es el primer turno de la primera ronda
    if (window.estadoJuego?.turnoEnRonda === 1 && window.estadoJuego?.rondaActual === 1) {
      // Primer turno: mostrar pantalla sin restricciones del dado
      this.mostrarPantallaSinRestriccion();
    } else {
      // Otros turnos: mostrar pantalla de partida y aplicar restricción del dado
      this.showScreen('partida');
      
      // Procesar el resultado del dado si está disponible
      if (window.JuegoManager?.procesarResultadoDado) {
        // Usar dado seleccionado o valor por defecto (1 = sin restricción)
        window.JuegoManager.procesarResultadoDado(this.dadoSeleccionado || 1);
      }
    }
  }

  /*
  =============================================================================
  SISTEMA DE ANIMACIÓN DEL DADO
  =============================================================================
  */

  /**
   * Inicia la animación del dado con efecto de giro rápido
   * Simula el lanzamiento real de un dado físico
   */
  iniciarAnimacionDado() {
    const img = document.getElementById('dado-imagen');
    const cont = document.getElementById('dado-animado');
    
    if (!img || !cont) return;
    
    // Array con todas las caras posibles del dado
    const dados = [
      'img/dado-banos.png',
      'img/dado-bosque.png',
      'img/dado-cafe.png',
      'img/dado-huella.png',
      'img/dado-no-trex.png',
      'img/dado-rocas.png'
    ];
    
    let contador = 0;
    cont.classList.add('spinning');
    
    // Fase 1: Animación rápida inicial
    const intervalo = setInterval(() => {
      img.src = dados[Math.floor(Math.random() * dados.length)];
      contador++;
      
      if (contador > 10) {
        clearInterval(intervalo);
        this.ralentizarAnimacionDado(dados, contador, 15);
      }
    }, 150);
  }

  /**
   * Segunda fase de la animación: ralentización progresiva
   * Simula la física real del dado perdiendo velocidad
   * @param {Array} dados - Array de imágenes del dado
   * @param {number} contadorInicial - Contador inicial de cambios
   * @param {number} maxCambios - Máximo de cambios antes de finalizar
   */
  ralentizarAnimacionDado(dados, contadorInicial, maxCambios) {
    const img = document.getElementById('dado-imagen');
    let contador = contadorInicial;
    let intervaloActual = 200;
    
    // Fase 2: Animación que se ralentiza progresivamente
    const intervaloLento = setInterval(() => {
      img.src = dados[Math.floor(Math.random() * dados.length)];
      contador++;
      
      if (contador >= maxCambios) {
        clearInterval(intervaloLento);
        this.finalizarAnimacionDado(dados);
      }
      
      // Aumentar intervalo para ralentizar
      intervaloActual += 50;
    }, intervaloActual);
  }

  /**
   * Finaliza la animación del dado y determina el resultado
   * Selecciona aleatoriamente la cara final y actualiza la UI
   * @param {Array} dados - Array de imágenes del dado
   */
  finalizarAnimacionDado(dados) {
    const img = document.getElementById('dado-imagen');
    const cont = document.getElementById('dado-animado');
    const texto = document.querySelector('.dado-texto');
    
    // Determinar resultado final del dado (1-6)
    this.dadoSeleccionado = Math.floor(Math.random() * dados.length) + 1;
    img.src = dados[this.dadoSeleccionado - 1];
    
    // Aplicar estilos finales
    cont.classList.remove('spinning');
    cont.classList.add('final');
    
    if (texto) texto.textContent = '¡Dado lanzado!';
    
    // Mostrar resultado tras breve pausa
    setTimeout(() => this.mostrarResultadoDado(this.dadoSeleccionado), 800);
  }

  /**
   * Muestra el resultado del dado con su restricción correspondiente
   * Configura la pantalla de resultado con información detallada de la restricción
   * @param {number} dadoNumero - Número del dado (1-6) que determina la restricción
   */
  mostrarResultadoDado(dadoNumero) {
    // Configuración completa de todas las caras del dado con sus restricciones
    const config = {
      1: {
        titulo: 'Huella (libre)',
        descripcion: '¡Tablero completamente libre! Podés colocar el dinosaurio en cualquier recinto sin restricciones. Es la cara más flexible del dado.',
        imagen: 'img/dado-huella.png'
      },
      2: {
        titulo: 'No T-Rex',
        descripcion: 'El Rey de la Jungla está bloqueado. Podés colocar en cualquier otro recinto: Bosque de la Semejanza, Prado de la Diferencia, Pradera del Amor, Trío Frondoso, Isla Solitaria o el Río.',
        imagen: 'img/dado-no-trex.png'
      },
      3: {
        titulo: 'Lado Cafetería',
        descripcion: 'Recintos disponibles: Bosque de la Semejanza, Trío Frondoso, Pradera del Amor. Los recintos del lado izquierdo del tablero están abiertos. Si no podés cumplir, poné el dinosaurio en el río.',
        imagen: 'img/dado-cafe.png'
      },
      4: {
        titulo: 'Lado Baños',
        descripcion: 'Recintos disponibles: Rey de la Jungla, Prado de la Diferencia, Isla Solitaria. Los recintos del lado derecho del tablero están abiertos. Si no podés cumplir, poné el dinosaurio en el río.',
        imagen: 'img/dado-banos.png'
      },
      5: {
        titulo: 'Bosque',
        descripcion: 'Recintos disponibles: Trío Frondoso, Bosque de la Semejanza, Rey de la Jungla. Los recintos con temática de bosque están abiertos. Si no podés cumplir, poné el dinosaurio en el río.',
        imagen: 'img/dado-bosque.png'
      },
      6: {
        titulo: 'Rocas / Pradera',
        descripcion: 'Recintos disponibles: Prado de la Diferencia, Isla Solitaria, Pradera del Amor. Los recintos con temática de pradera y rocas están abiertos. Si no podés cumplir, poné el dinosaurio en el río.',
        imagen: 'img/dado-rocas.png'
      }
    };
    
    // Actualizar contenido del popup con la configuración del dado obtenido
    this.updatePopupContent(config[dadoNumero]);
    
    // Mostrar la pantalla de resultado del dado
    this.showScreen('dado-resultado');
    
    // Configurar botón para continuar al juego
    const btn = document.getElementById('btn-comenzar-juego');
    if (btn) {
      btn.textContent = 'Continuar';
      btn.onclick = () => this.comenzarJuego();
    }
  }

  /**
   * Modifica imagen, título y descripción según la configuración proporcionada
   * @param {Object} config - Objeto con imagen, título y descripción del dado
   */
  updatePopupContent(config) {
    // Obtener elementos del DOM del popup de resultado
    const img = document.getElementById('dado-resultado-img');
    const titulo = document.getElementById('titulo-dado');
    const desc = document.getElementById('descripcion-dado');
    
    // Actualizar imagen del dado si el elemento existe
    if (img) img.src = config.imagen;
    
    // Actualizar título de la restricción si el elemento existe
    if (titulo) titulo.textContent = config.titulo;
    
    // Actualizar descripción detallada si el elemento existe
    if (desc) desc.textContent = config.descripcion;
  }

  /*
  =============================================================================
  SISTEMA DE AUTENTICACIÓN Y MANEJO DE FORMULARIOS
  =============================================================================
  */

  /**
   * Procesa el formulario de login y autentica al usuario
   * Maneja tanto usuarios normales como administradores
   * @param {HTMLFormElement} form - Formulario de login
   */
  async handleLogin(form) {
    const identificador = form.querySelector('#login-username').value.trim();
    const password = form.querySelector('#login-password').value.trim();

    // Limpiar errores previos del formulario
    this.clearFormErrors(form);

    // Validar datos antes de enviar
    if (!this.validateLoginForm(identificador, password, form)) return;

    // Mostrar estado de carga
    this.setLoading(true);

    try {
      // Enviar datos de usuario al servidor para verificar login
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificador, password })
      });

      const result = await response.json();

      // Verificar respuesta del servidor
      if (!response.ok || !result.success) {
        this.showToast(result.message || 'Credenciales inválidas', 'error');
        return;
      }

      // Guardar información del usuario que acaba de iniciar sesión
      this.user = {
        id: result.user.id,
        email: result.user.email,
        username: result.user.nombreUsuario,
        name: result.user.nombreUsuario.toUpperCase(),
        isAdmin: result.user.esAdmin || false
      };

      // Persistir sesión en localStorage
      localStorage.setItem('usuario', JSON.stringify(this.user));

      // Navegar según tipo de usuario
      if (this.user.isAdmin) {
        // Usuario administrador - mostrar panel de admin
        window.adminManager?.mostrarPerfilAdmin(this.user);
        this.showToast('¡Bienvenido, Administrador!', 'success');
      } else {
        // Usuario normal - ir al lobby principal
        this.showScreen('lobby');
        this.showToast('¡Bienvenido de vuelta!', 'success');
      }

    } catch (error) {
      // Si algo sale mal durante el proceso de login (red, servidor, etc.)
      console.error(error);
      // Mostrar mensaje de error
      this.showToast('Error al conectar con el servidor', 'error');
    } finally {
      // Quita el indicador de carga para que el usuario pueda intentar nuevamente
      this.setLoading(false);
    }
  }



  /**
   * Procesa el formulario de registro de nuevos usuarios
   * Valida datos, envía información al servidor y configura sesión automáticamente
   * @param {HTMLFormElement} form - Formulario de registro
   */
  async handleRegister(form) {
    // Extraer y preparar datos del formulario
    const formData = this.getRegisterFormData(form);

    // Limpiar errores previos
    this.clearFormErrors(form);

    // Validar todos los campos antes de enviar
    if (!this.validateRegisterForm(formData, form)) return;

    // Mostrar estado de carga durante proceso
    this.setLoading(true);

    try {
      // Enviar datos al endpoint de registro
      const response = await fetch('http://127.0.0.1:8000/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreUsuario: formData.username,
          email: formData.email,
          nacimiento: formData.birthdate,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm
        })
      });

      const result = await response.json();

      // Verificar respuesta del servidor
      if (!response.ok || !result.success) {
        this.showToast(result.message || 'Error al registrarse', 'error');
        return;
      }

      // Configurar usuario recién registrado en sesión
      this.user = {
        id: result.usuario.id,
        email: result.usuario.email,
        username: result.usuario.nombreUsuario,
        name: result.usuario.nombreUsuario.toUpperCase()
      };

      // Persistir sesión automáticamente
      localStorage.setItem('usuario', JSON.stringify(this.user));

      // Navegar al lobby y mostrar mensaje de éxito
      this.showScreen('lobby');
      this.showToast('¡Cuenta creada exitosamente!', 'success');
      
    } catch (error) {
      console.error(error);
      this.showToast('Error al conectar con el servidor', 'error');
    } finally {
      this.setLoading(false);
    }
  }



  /**
   * Extrae datos del formulario de registro de manera segura
   * Maneja casos donde los elementos no existen
   * @param {HTMLFormElement} form - Formulario de registro
   * @returns {Object} - Objeto con datos del formulario
   */
  getRegisterFormData(form) {
    return {
      username: form.querySelector('#register-username')?.value?.trim() || '',
      email: form.querySelector('#register-email')?.value?.trim() || '',
      birthdate: form.querySelector('#register-fecha')?.value?.trim() || '',
      password: form.querySelector('#register-password')?.value?.trim() || '',
      passwordConfirm: form.querySelector('#register-password-confirm')?.value?.trim() || ''
    };
  }

  /*
  =============================================================================
  CONFIGURACIÓN AVANZADA DE FORMULARIOS
  =============================================================================
  */

  /**
   * Configura validación automática en todos los formularios
   * Establece limpieza de errores en tiempo real y validación de contraseñas
   */
  setupFormValidation() {
    document.querySelectorAll('.form-input').forEach(input => {
      // Limpiar errores automáticamente cuando el usuario corrige
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.clearFieldError(input);
        }
      });
      
      // Configurar validación especial para contraseñas en registro
      if (input.type === 'password' && input.closest('#register-form')) {
        input.addEventListener('input', () => {
          this.validatePasswordStrength(input);
        });
      }
    });
  }

  /**
   * Valida y muestra la fortaleza de contraseña en tiempo real
   * Proporciona feedback visual sobre seguridad de la contraseña
   * @param {HTMLInputElement} campoContraseña - Campo de contraseña
   */
  validatePasswordStrength(passwordInput) {
    const password = passwordInput.value;
    let indicator = passwordInput.parentElement.querySelector('.password-strength');
    
    // Crear indicador si no existe
    if (!indicator) {
      indicator = this.createPasswordStrengthIndicator(passwordInput);
    }
    
    // Ver qué tan segura es la contraseña
    const strength = this.calculatePasswordStrength(password);
    
    // Limpiar el aspecto visual anterior
    indicator.className = 'password-strength';
    
    // Cambiar los colores según qué tan segura sea
    if (password.length === 0) {
      indicator.textContent = '';
    } else if (strength < 2) {
      indicator.classList.add('weak');
      indicator.textContent = 'Débil';
    } else if (strength < 4) {
      indicator.classList.add('medium');
      indicator.textContent = 'Media';
    } else {
      indicator.classList.add('strong');
      indicator.textContent = 'Fuerte';
    }
  }

  /**
   * Calcula la fortaleza de una contraseña basada en múltiples criterios
   * @param {string} contraseña - Contraseña a evaluar
   * @returns {number} - Nivel de fortaleza (0-5)
   */
  calculatePasswordStrength(password) {
    let strength = 0;
    
    // Criterios de evaluación
    if (password.length >= 6) strength++;        // Longitud mínima
    if (/[a-z]/.test(password)) strength++;      // Minúsculas
    if (/[A-Z]/.test(password)) strength++;      // Mayúsculas
    if (/\d/.test(password)) strength++;         // Números
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++; // Símbolos especiales
    
    return strength;
  }

  /**
   * Crea el elemento visual para mostrar fortaleza de contraseña
   * @param {HTMLInputElement} campoContraseña - Campo de contraseña
   * @returns {HTMLElement} - Elemento indicador creado
   */
  createPasswordStrengthIndicator(passwordInput) {
    const indicator = document.createElement('div');
    indicator.className = 'password-strength';
    passwordInput.parentElement.appendChild(indicator);
    return indicator;
  }

  /**
   * Configura eventos de clic para mejorar la experiencia del usuario
   * Permite hacer clic en cualquier parte del grupo de formulario para enfocar el input
   */
  setupFormClickHandlers() {
    // Configurar clicks en grupos de formulario para enfocar automáticamente el input
    document.querySelectorAll('.form-group').forEach(group => {
      const input = group.querySelector('.form-input');
      const tipoJugadorSelector = group.querySelector('.tipo-jugador-selector');
      
      // Solo agregar evento si el input no es de solo lectura y no es un selector de tipo
      if (input && !input.hasAttribute('readonly') && !tipoJugadorSelector) {
        group.addEventListener('click', e => {
          // Si el clic no fue directamente en el input, enfocarlo
          if (e.target !== input) {
            input.focus();
          }
        });
      }
    });
    
    // Configurar clicks en opciones de radio button para mejor usabilidad
    document.querySelectorAll('.radio-option').forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const radio = this.querySelector('input[type="radio"]');
        if (radio) {
          // Marcar el radio button como seleccionado
          radio.checked = true;
          // Disparar evento change para activar otros listeners
          radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
  }

  /**
   * Configura características de accesibilidad para mejorar la experiencia de todos los usuarios
   * Incluye soporte para navegación por teclado, movimiento reducido y indicadores visuales
   */
  setupAccessibility() {
    // Configurar indicadores visuales de foco para navegación por teclado
    document.addEventListener('focusin', e => {
      if (e.target.matches('.btn, .form-input, .btn-icon')) {
        e.target.classList.add('focus-visible');
      }
    });
    
    document.addEventListener('focusout', e => {
      e.target.classList.remove('focus-visible');
    });
    
    // Respetar preferencia de movimiento reducido del usuario
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Desactivar todas las transiciones para usuarios sensibles al movimiento
      document.documentElement.style.setProperty('--transition-base', '0ms');
      document.documentElement.style.setProperty('--transition-fast', '0ms');
    }
    
    // Detectar cuando el usuario navega con teclado para mostrar indicadores apropiados
    document.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });
    
    // Detectar cuando el usuario usa mouse para ocultar indicadores de teclado
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }

  /**
   * Configura el campo de fecha de nacimiento con validaciones y restricciones
   * Establece límites de fecha y valida la edad mínima requerida
   */
  setupBirthdateField() {
    const fechaInput = document.querySelector('#register-fecha');
    if (!fechaInput) return;
    
    // Establecer fecha máxima como hoy (no se puede nacer en el futuro)
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    fechaInput.max = `${yyyy}-${mm}-${dd}`;
    
    // Establecer fecha mínima hasta hace 100 años (límite razonable de edad)
    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 100);
    fechaInput.min = `${fechaMinima.getFullYear()}-${String(fechaMinima.getMonth() + 1).padStart(2, '0')}-${String(fechaMinima.getDate()).padStart(2, '0')}`;
    
    // Validar edad cuando el usuario cambie la fecha
    fechaInput.addEventListener('change', () => {
      const birthDate = new Date(fechaInput.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      // Verificar si cumple con la edad mínima requerida
      if (age < this.validationConfig.minAge) {
        this.showToast(`Debes tener al menos ${this.validationConfig.minAge} años`, 'warning');
        fechaInput.classList.add('error');
      } else {
        fechaInput.classList.remove('error');
      }
    });
  }

  /*
  =============================================================================
  SISTEMA DE NOTIFICACIONES (TOASTS)
  =============================================================================
  */

  /**
   * Muestra una notificación temporal al usuario
   * Previene duplicados y maneja auto-ocultado
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de notificación que determina el estilo e icono
   * @param {number} duration - Duración en milisegundos antes de auto-ocultar
   */
  showToast(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    // Prevenir notificaciones duplicadas
    const existingToasts = Array.from(container.querySelectorAll('.toast'));
    const isDuplicate = existingToasts.some(toast => {
      const msgElement = toast.querySelector('.toast__message');
      return msgElement && msgElement.textContent === message;
    });
    
    if (isDuplicate) return;
    
    // Crear y mostrar nueva notificación
    const toast = this.createToastElement(message, type);
    container.appendChild(toast);
    
    // Auto-remover después del tiempo especificado
    setTimeout(() => {
      if (toast.parentNode) {
        this.removeToast(toast);
      }
    }, duration);
  }

  /**
   * Crea un elemento de notificación con interactividad
   * @param {string} message - Mensaje de la notificación
   * @param {string} type - Tipo para estilo y icono
   * @returns {HTMLElement} - Elemento toast creado
   */
  createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type} fade-in`;
    
    // Iconos para cada tipo de notificación
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };
    
    // Estructura HTML de la notificación
    toast.innerHTML = `
      <div class="toast__content">
        <span class="toast__icon">${icons[type] || icons.info}</span>
        <span class="toast__message">${message}</span>
        <button class="toast__close" aria-label="Cerrar notificación">&times;</button>
      </div>
    `;
    
    // Event listeners para interacción
    const closeBtn = toast.querySelector('.toast__close');
    // Escuchar clicks en el botón de cerrar para eliminar la notificación
    closeBtn.addEventListener('click', () => this.removeToast(toast));
    
    // Cerrar al hacer click en cualquier parte del toast
    toast.addEventListener('click', e => {
      if (!e.target.matches('.toast__close')) {
        this.removeToast(toast);
      }
    });
    
    return toast;
  }

  /**
   * Remueve una notificación con animación de salida
   * @param {HTMLElement} toast - Elemento toast a remover
   */
  removeToast(toast) {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }

  /**
   * Oculta todas las notificaciones visibles
   */
  hideToasts() {
    document.querySelectorAll('.toast').forEach(toast => {
      this.removeToast(toast);
    });
  }

  /*
  =============================================================================
  UTILIDADES DE INTERFAZ Y ESTADO
  =============================================================================
  */

  /**
   * Muestra error en un campo específico del formulario
   * Aplica estilos de error, accesibilidad y scroll automático
   * @param {HTMLFormElement} form - Formulario contenedor
   * @param {string} selector - Selector CSS del campo
   * @param {string} message - Mensaje de error a mostrar
   */
  showFieldError(form, selector, message) {
    const field = form.querySelector(selector);
    if (field) {
      // Aplicar estilo visual de error al campo
      field.classList.add('error');
      // Marcar como inválido para lectores de pantalla
      field.setAttribute('aria-invalid', 'true');
      // Hacer scroll suave hasta el campo con error
      field.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      // Enfocar el campo después de un breve delay
      setTimeout(() => field.focus(), 300);
    }
    // Mostrar notificación de error al usuario
    this.showToast(message, 'error');
  }

  /**
   * Restaura el estado normal de todos los campos y contadores
   * @param {HTMLFormElement} form - Formulario a limpiar
   */
  clearFormErrors(form) {
    // Limpiar errores de todos los campos de entrada
    form.querySelectorAll('.form-input').forEach(input => {
      this.clearFieldError(input);
    });
    
    // Restaurar contadores de caracteres a estado normal
    form.querySelectorAll('.character-counter--warning, .character-counter--attention')
      .forEach(counter => {
        counter.className = 'character-counter';
      });
  } 


  /**
   * Limpia el estado de error de un campo individual
   * Restaura el estilo normal y la accesibilidad del campo
   * @param {HTMLInputElement} input - Campo a limpiar
   */
  clearFieldError(input) {
    // Quitar estilo visual de error
    input.classList.remove('error');
    // Marcar como válido para lectores de pantalla
    input.setAttribute('aria-invalid', 'false');
    
    // Limpiar contador de caracteres si existe
    const counter = input.parentElement.querySelector('.character-counter');
    if (counter) {
      counter.classList.remove('character-counter--warning', 'character-counter--attention');
    }
  }

  /**
   * Controla el estado de carga de la aplicación
   * Deshabilita botones y muestra indicadores de carga durante operaciones
   * @param {boolean} isLoading - true para activar estado de carga, false para desactivar
   */
  setLoading(isLoading) {
    this.loading = isLoading;
    
    // Aplicar cambios a todos los botones de la página
    document.querySelectorAll('.btn').forEach(btn => {
      if (isLoading) {
        // Activar estado de carga: deshabilitar botón y cambiar texto
        btn.classList.add('btn--loading');
        btn.disabled = true;
        
        // Guardar texto original si no está guardado
        if (!btn.dataset.originalText) {
          btn.dataset.originalText = btn.textContent;
        }
        btn.textContent = 'Cargando...';
      } else {
        // Desactivar estado de carga: restaurar botón y texto original
        btn.classList.remove('btn--loading');
        btn.disabled = false;
        
        // Restaurar texto original si existe
        if (btn.dataset.originalText) {
          btn.textContent = btn.dataset.originalText;
          delete btn.dataset.originalText;
        }
      }
    });
  }

  /*
  =============================================================================
  ACCIONES DE CONTROL DEL JUEGO
  =============================================================================
  */

  /**
   * Avanza a la siguiente ronda del juego
   * Coordina con el JuegoManager para mantener continuidad
   */
  siguienteRonda() {
    if (window.JuegoManager?._prepararSiguienteRonda) {
      window.JuegoManager._prepararSiguienteRonda();
    }
  }

  /**
   * Inicia una revancha con los mismos jugadores
   * Reinicia el estado del juego pero mantiene configuración de jugadores
   */
  revancha() {
    if (window.JuegoManager?.reiniciarJuegoCompleto) {
      window.JuegoManager.reiniciarJuegoCompleto();
    }
    this.showScreen('seleccion-inicial');
  }

  /**
   * Inicia una partida completamente nueva
   * Limpia configuración de jugadores y vuelve a configuración inicial
   */
  nuevaPartida() {
    // Resetear a modo automático
    this.modoSeguimiento = false;
    this.showScreen('jugadores');
    
    // Limpiar configuración del segundo jugador
    const j2 = document.getElementById('jugador-2');
    if (j2) j2.value = '';
    
    // Restaurar configuración por defecto (invitado)
    const radioInvitado = document.getElementById('radio-invitado');
    if (radioInvitado) radioInvitado.checked = true;
    
    this.updatePlayerType('invitado');
  }

  /**
   * Cierra sesión del usuario actual
   * Maneja confirmación si hay partida en curso y limpia todo el estado
   */
  logout() {
    // Confirmar si hay partida en curso
    const confirmLogout = this.currentScreen === 'partida' ? 
      confirm('¿Estás seguro de que quieres cerrar sesión? Se perderá el progreso de la partida actual.') : 
      true;

    if (!confirmLogout) return;

    // Limpieza completa de datos persistentes
    localStorage.clear();

    // Resetear estado de la aplicación
    this.user = null;
    this.players = [];
    this.jugador2Info = null;
    this.dadoSeleccionado = null;
    this.modoSeguimiento = false;

    // Limpiar todos los formularios
    document.querySelectorAll('form').forEach(form => form.reset());

    // Navegar a login y notificar
    this.showScreen('login');
    this.showToast('Sesión cerrada', 'info');
  }

  /**
   * Resetea completamente el estado de la aplicación
   * Utilizado para limpiezas profundas o recuperación de errores
   */
  resetAppState() {
    // Resetear estado interno
    this.currentScreen = 'login';
    this.user = null;
    this.loading = false;
    this.players = [];
    this.jugador2Info = null;
    this.dadoSeleccionado = null;
    this.modoSeguimiento = false;
    
    // Limpiar datos persistentes
    localStorage.clear();
    
    // Limpiar notificaciones activas
    this.hideToasts();
    
    // Resetear y limpiar todos los formularios
    document.querySelectorAll('form').forEach(form => {
      form.reset();
      this.clearFormErrors(form);
    });
  }

}

/*
=============================================================================
INICIALIZACIÓN Y MANEJO DE ERRORES GLOBALES
=============================================================================
*/

/**
 * Inicialización principal de la aplicación
 * Se ejecuta cuando la página web está completamente cargada
 */
if (!window.app) {
  document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia principal de la aplicación
    const tempApp = new AppState();
    
    // Exponer globalmente para acceso desde otros módulos
    window.app = tempApp;
    window.adminManager = new AdminManager();
  });
}

/**
 * Sistema de manejo de errores globales
 * Captura errores no manejados y los reporta al usuario
 */
window.addEventListener('error', e => {
  console.error('Error global capturado:', e.error);
  if (window.app) {
    window.app.showToast('Ha ocurrido un error inesperado', 'error');
  }
});

/**
 * Manejo de promesas rechazadas sin catch
 * Previene que errores asincrónicos pasen desapercibidos
 */
window.addEventListener('unhandledrejection', e => {
  console.error('Promesa rechazada sin manejar:', e.reason);
  if (window.app) {
    window.app.showToast('Error en operación asíncrona', 'error');
  }
});

/*
=============================================================================
SISTEMA DE ADMINISTRACIÓN DE USUARIOS
=============================================================================
*/

/**
 * Gestor del panel de administración para usuarios con privilegios de admin
 * Permite edición completa de usuarios: crear, leer, actualizar y eliminar
 * Se integra con el backend para operaciones de base de datos
 */
class AdminManager {
  constructor() {
    this.currentUser = null;           // Usuario admin actualmente logueado
    this.currentEditingUser = null;    // Usuario siendo editado
    this.usuariosData = [];            // Cache de usuarios cargados desde backend
    this.init();
  }

  init() {
    this.setupAdminEvents();
    this.fetchUsers();
    this.asegurarPopupOculto();
  }

  asegurarPopupOculto() {
    const popup = document.getElementById('popup-eliminar-usuario');
    if (popup) {
      popup.classList.add('hidden');
      popup.style.display = 'none';
    }
  }

  setupAdminEvents() {
    // Botones principales del perfil admin
    const btnModificarUsuarios = document.getElementById('btn-modificar-usuarios');
    const btnNuevoUsuario = document.getElementById('btn-nuevo-usuario');
    const btnSalirAdmin = document.getElementById('btn-salir-admin');

    // Botones de navegación
    const btnVolverAdmin = document.getElementById('btn-volver-admin');
    const btnVolverListado = document.getElementById('btn-volver-listado');
    const btnVolverAdminNuevo = document.getElementById('btn-volver-admin-nuevo');

    // Botones de popup
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');

    // Formularios
    const formEditarUsuario = document.getElementById('form-editar-usuario');
    const formNuevoUsuario = document.getElementById('form-nuevo-usuario');

    // Búsqueda
    const buscarUsuario = document.getElementById('buscar-usuario');

    // Event listeners
    if (btnModificarUsuarios) {
      btnModificarUsuarios.addEventListener('click', () => this.mostrarListadoUsuarios());
    }

    if (btnNuevoUsuario) {
      btnNuevoUsuario.addEventListener('click', () => this.mostrarNuevoUsuario());
    }

    if (btnSalirAdmin) {
      btnSalirAdmin.addEventListener('click', () => this.salirModoAdmin());
    }

    if (btnVolverAdmin) {
      btnVolverAdmin.addEventListener('click', () => this.volverPerfilAdmin());
    }

    if (btnVolverListado) {
      btnVolverListado.addEventListener('click', () => this.mostrarListadoUsuarios());
    }

    if (btnVolverAdminNuevo) {
      btnVolverAdminNuevo.addEventListener('click', () => this.volverPerfilAdmin());
    }

    if (btnConfirmarEliminar) {
      btnConfirmarEliminar.addEventListener('click', () => this.confirmarEliminarUsuario());
    }

    if (btnCancelarEliminar) {
      btnCancelarEliminar.addEventListener('click', () => this.cerrarPopupEliminar());
    }

    if (formEditarUsuario) {
      formEditarUsuario.addEventListener('submit', (e) => this.handleEditarUsuario(e));
    }

    if (formNuevoUsuario) {
      formNuevoUsuario.addEventListener('submit', (e) => this.handleNuevoUsuario(e));
    }

    if (buscarUsuario) {
      buscarUsuario.addEventListener('input', (e) => this.filtrarUsuarios(e.target.value));
    }
  }

  /**
   * Obtiene la lista completa de usuarios desde el servidor
   * Maneja errores de conexión y valida la estructura de datos recibida
   * @returns {Promise<void>} - Promesa que se resuelve cuando los datos están listos
   */
  async fetchUsers() {
    console.log('Iniciando fetchUsers...');
    
    try {
      // Realizar petición GET al endpoint de usuarios
      const url = 'http://127.0.0.1:8000/getUsuarios';
      console.log('Haciendo petición a:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Status de respuesta:', response.status);

      // Verificar que la respuesta sea exitosa
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en respuesta:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);

      // Verificar que el servidor responda con éxito
      if (!data.success) {
        throw new Error(data.message || 'No se pudieron obtener los usuarios');
      }

      // Validar estructura de datos y asignar usuarios
      if (data && Array.isArray(data.usuarios)) {
        this.usuariosData = data.usuarios;
        console.log('✅ usuariosData asignado correctamente:', this.usuariosData);
      } else {
        console.error('❌ Datos de usuarios inválidos:', data);
        this.usuariosData = [];
      }

      console.log('Usuarios cargados:', this.usuariosData.length);

      // Renderizar lista si la pantalla está visible
      if (document.getElementById('pantalla-listado-usuarios')?.classList.contains('hidden') === false) {
        console.log('Renderizando lista inmediatamente...');
        this.renderizarListaUsuarios();
      }

    } catch (error) {
      console.error('Error completo:', error);
      this.usuariosData = [];
      throw error;
    }
  }

  /**
   * Configura y muestra el perfil del administrador
   * Actualiza la interfaz con los datos del usuario administrador
   * @param {Object} usuario - Datos del usuario administrador
   */
  mostrarPerfilAdmin(usuario) {
    // Guardar usuario actual para referencia
    this.currentUser = usuario;
    
    // Actualizar nombre de usuario en la interfaz
    const adminUsername = document.getElementById('admin-username');
    if (adminUsername) {
      adminUsername.textContent = usuario.username;
    }

    // Actualizar todos los elementos que muestran el nombre del admin
    document.querySelectorAll('.admin-name').forEach(el => {
      el.textContent = usuario.username;
    });

    // Mostrar la pantalla principal de administración
    this.mostrarPantalla('pantalla-admin');
  }

  /**
   * Muestra la pantalla de listado de usuarios con carga asíncrona
   * Maneja estados de carga y errores de conexión
   * @returns {Promise<void>} - Promesa que se resuelve cuando la lista está lista
   */
  async mostrarListadoUsuarios() 
  {
    console.log('Iniciando mostrarListadoUsuarios...');
    
    // Mostrar pantalla primero con mensaje de carga
    this.mostrarPantalla('pantalla-listado-usuarios');
    
    // Mostrar indicador de carga mientras se obtienen los datos
    const container = document.getElementById('lista-usuarios-admin');
    if (container) {
      container.innerHTML = '<div class="titulo-seccion">Cargando usuarios...</div>';
    }
    
    try {
      // Obtener usuarios desde el servidor
      await this.fetchUsers();
      console.log('Usuarios cargados, renderizando lista...');
      this.renderizarListaUsuarios();
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      // Mostrar mensaje de error si falla la carga
      if (container) {
        container.innerHTML = `
          <div class="titulo-seccion">Error al cargar usuarios</div>
          <div class="usuario-item">
            <span>No se pudieron cargar los usuarios. Verifica la conexión con el servidor.</span>
          </div>
        `;
      }
    }
  }

  /**
   * Prepara y muestra el formulario para crear un nuevo usuario
   * Limpia el formulario y cambia a la pantalla correspondiente
   */
  mostrarNuevoUsuario() {
    // Limpiar formulario para evitar datos previos
    const form = document.getElementById('form-nuevo-usuario');
    if (form) form.reset();
    
    // Mostrar pantalla de creación de usuario
    this.mostrarPantalla('pantalla-nuevo-usuario');
  }

  /**
   * Prepara y muestra el formulario de edición con los datos del usuario
   * Llena automáticamente los campos con la información existente
   * @param {Object} usuario - Usuario a editar con todos sus datos
   */
  mostrarEditarUsuario(usuario) {
    // Guardar referencia al usuario que se está editando
    this.currentEditingUser = usuario;
    
    // Llenar formulario con datos actuales del usuario
    document.getElementById('edit-username').value = usuario.nombreUsuario;
    document.getElementById('edit-email').value = usuario.email;
    document.getElementById('edit-birthdate').value = usuario.nacimiento;
    
    // Limpiar campo de contraseña (opcional para edición)
    const passwordField = document.getElementById('edit-password');
    if (passwordField) passwordField.value = '';

    // Mostrar pantalla de edición
    this.mostrarPantalla('pantalla-editar-usuario');
  }

  /**
   * Renderiza la lista de usuarios en la interfaz de administración
   * Aplica filtros de búsqueda y genera la estructura HTML dinámicamente
   * @param {string} filtro - Texto para filtrar usuarios por nombre
   */
  renderizarListaUsuarios(filtro = '') {
    console.log('renderizarListaUsuarios llamado, usuariosData:', this.usuariosData);
    
    const container = document.getElementById('lista-usuarios-admin');
    if (!container) {
      console.error('Container lista-usuarios-admin no encontrado');
      return;
    }

    // Validar que los datos de usuarios sean válidos
    if (!Array.isArray(this.usuariosData)) {
      console.warn('usuariosData no es un array válido:', this.usuariosData);
      container.innerHTML = `
        <div class="titulo-seccion">Error</div>
        <div class="usuario-item">
          <span>Los datos de usuarios no están disponibles.</span>
        </div>
      `;
      return;
    }

    // Filtrar usuarios: excluir admins y aplicar filtro de búsqueda
    const usuariosFiltrados = this.usuariosData.filter(user => 
      !user.admin && user.nombreUsuario && user.nombreUsuario.toLowerCase().includes(filtro.toLowerCase())
    );

    console.log(`Mostrando ${usuariosFiltrados.length} usuarios filtrados`);

    // Mostrar mensaje si no hay usuarios
    if (usuariosFiltrados.length === 0) {
      container.innerHTML = `
        <div class="titulo-seccion">Usuarios registrados</div>
        <div class="usuario-item">
          <span>No se encontraron usuarios${filtro ? ' que coincidan con la búsqueda' : ''}.</span>
        </div>
      `;
      return;
    }

    // Generar HTML dinámico para cada usuario con botones de acción
    container.innerHTML = `
      <div class="titulo-seccion">Usuarios registrados (${usuariosFiltrados.length})</div>
      ${usuariosFiltrados.map(user => `
        <div class="usuario-item">
          <span class="usuario-nombre">${user.nombreUsuario}</span>
          <div class="usuario-acciones">
            <button class="btn-accion btn-editar" data-user-id="${user.id}" data-action="editar">
              <img src="img/lapiz.svg" alt="Editar">
            </button>
            <button class="btn-accion btn-eliminar" data-user-id="${user.id}" data-username="${user.nombreUsuario}" data-action="eliminar">
              <img src="img/Cruz.svg" alt="Eliminar">
            </button>
          </div>
        </div>
      `).join('')}
    `;

    // Configurar eventos para los botones de acción
    this.setupUserActionListeners();
}

  /**
   * Configura los event listeners para los botones de acción de usuarios
   * Maneja clicks en botones de editar y eliminar usando delegación de eventos
   */
  setupUserActionListeners() {
    const container = document.getElementById('lista-usuarios-admin');
    if (!container) return;

    // Usar delegación de eventos para manejar clicks en botones dinámicos
    container.addEventListener('click', (e) => {
      const button = e.target.closest('[data-action]');
      if (!button) return;

      // Extraer datos del botón clickeado
      const action = button.dataset.action;
      const userId = parseInt(button.dataset.userId);
      const username = button.dataset.username;

      // Ejecutar acción según el tipo de botón
      if (action === 'eliminar') {
        this.mostrarPopupEliminar(username, userId);
      } else if (action === 'editar') {
        // Buscar usuario completo en los datos para edición
        const user = this.usuariosData.find(u => u.id === userId);
        if (user) {
          this.mostrarEditarUsuario(user);
        }
      }
    });
  }

  /**
   * Filtra la lista de usuarios según el texto de búsqueda
   * @param {string} filtro - Texto para filtrar usuarios por nombre
   */
  filtrarUsuarios(filtro) {
    this.renderizarListaUsuarios(filtro);
  }

  /**
   * Muestra el popup de confirmación para eliminar un usuario
   * Configura la interfaz con los datos del usuario a eliminar
   * @param {string} username - Nombre del usuario a eliminar
   * @param {number} userId - ID del usuario a eliminar
   */
  mostrarPopupEliminar(username, userId) {
    const popup = document.getElementById('popup-eliminar-usuario');
    const usernameSpan = document.getElementById('usuario-a-eliminar');
    
    // Fallback si el popup no existe
    if (!popup) {
      alert(`¿Desea eliminar el usuario ${username}?`); // Fallback
      return;
    }
    
    // Actualizar nombre del usuario en el popup
    if (usernameSpan) {
      usernameSpan.textContent = username;
    }
    
    // Mostrar popup con alta prioridad visual
    popup.classList.remove('hidden');
    popup.style.zIndex = '10000';
    popup.dataset.userId = userId;
    
    // Forzar actualización del DOM para asegurar que el popup sea visible
    popup.offsetHeight;
  }

  /**
   * Confirma y ejecuta la eliminación del usuario seleccionado
   * Envía petición al servidor y actualiza la lista tras eliminación exitosa
   * @returns {Promise<void>} - Promesa que se resuelve cuando la eliminación termina
   */
  async confirmarEliminarUsuario() {
    const popup = document.getElementById('popup-eliminar-usuario');
    const userId = parseInt(popup.dataset.userId);
    
    try {
      // Enviar petición de eliminación al servidor
      const response = await fetch('http://127.0.0.1:8000/eliminarUsuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId })
      });

      const result = await response.json();

      // Verificar que la eliminación fue exitosa
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al eliminar usuario');
      }

      // Recargar lista de usuarios desde el servidor actualizado
      await this.fetchUsers();
      window.app?.showToast('Usuario eliminado correctamente', 'success');
      
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      window.app?.showToast('Error al eliminar usuario', 'error');
    } finally {
      // Cerrar popup independientemente del resultado
      this.cerrarPopupEliminar();
    }
  }

  /**
   * Cierra el popup de confirmación de eliminación
   * Oculta el popup y limpia los datos temporales
   */
  cerrarPopupEliminar() {
    const popup = document.getElementById('popup-eliminar-usuario');
    if (popup) {
      popup.classList.add('hidden');
    }
  }

  /**
   * Maneja el envío del formulario de edición de usuario
   * Recopila datos del formulario y envía actualización al servidor
   * @param {Event} e - Evento de envío del formulario
   * @returns {Promise<void>} - Promesa que se resuelve cuando la edición termina
   */
  async handleEditarUsuario(e) {
    e.preventDefault();

    // Verificar que hay un usuario siendo editado
    if (!this.currentEditingUser) return;

    // Recopilar datos del formulario de edición
    const username = document.getElementById('edit-username').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const birthdate = document.getElementById('edit-birthdate').value.trim();
    const password = document.getElementById('edit-password').value.trim();

    try {
      // Preparar datos para envío al servidor
      const payload = {
        id: this.currentEditingUser.id,
        nombreUsuario: username,
        email: email,
        nacimiento: birthdate
      };

      // Incluir contraseña solo si el usuario escribió una nueva
      if (password) {
        payload.password = password;
      }

      // Enviar datos de modificación al servidor
      const response = await fetch('http://127.0.0.1:8000/modificarUsuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      // Verificar que la modificación fue exitosa
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al modificar el usuario');
      }

      // Actualizar lista de usuarios y mostrar confirmación
      await this.fetchUsers();
      this.mostrarListadoUsuarios();
      window.app?.showToast('Usuario modificado correctamente', 'success');

    } catch (error) {
      console.error('Error al modificar usuario:', error);
      window.app?.showToast('Error al modificar usuario', 'error');
    }
  }

  /**
   * Maneja la creación de un nuevo usuario desde el panel de administración
   * Valida datos, comunica con backend y actualiza la interfaz
   * @param {Event} e - Evento submit del formulario
   */
  async handleNuevoUsuario(e) {
    e.preventDefault();
    
    // Extraer datos del formulario de manera segura
    const username = document.getElementById('new-username').value.trim();
    const email = document.getElementById('new-email').value.trim();
    const birthdate = document.getElementById('new-birthdate').value.trim();
    const password = document.getElementById('new-password').value.trim();
    
    try {
      // Enviar datos al endpoint específico de registro admin
      const response = await fetch('http://127.0.0.1:8000/registroAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreUsuario: username,
          email: email,
          nacimiento: birthdate,
          password: password,
        })
      });

      const result = await response.json();

      // Verificar respuesta del servidor
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error al crear usuario');
      }

      // Recargar lista completa desde backend para mantener sincronización
      await this.fetchUsers();
      this.volverPerfilAdmin();
      window.app?.showToast('Usuario creado correctamente', 'success');

    } catch (error) {
      console.error('Error al crear usuario:', error);
      window.app?.showToast('Error al crear usuario', 'error');
    }
  }

  /**
   * Navega de vuelta al perfil principal de administración
   * Oculta formularios y muestra pantalla principal del admin
   */
  volverPerfilAdmin() {
    this.mostrarPantalla('pantalla-admin');
  }

  /**
   * Sale del modo administración y cierra sesión completamente
   * Limpia estado del admin y redirige al login
   */
  salirModoAdmin() {
    this.currentUser = null;
    if (window.app) {
      window.app.logout();
    }
  }

  /**
   * Maneja la navegación entre pantallas del panel de administración
   * Oculta todas las pantallas y muestra solo la solicitada
   * @param {string} pantallaId - ID de la pantalla a mostrar
   */
  mostrarPantalla(pantallaId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.pantalla').forEach(pantalla => {
      pantalla.classList.add('hidden');
    });

    // Mostrar solo la pantalla solicitada
    const pantalla = document.getElementById(pantallaId);
    if (pantalla) {
      pantalla.classList.remove('hidden');
    }

    // Asegurar que popups no interfieran
    this.asegurarPopupOculto();
  }
}
