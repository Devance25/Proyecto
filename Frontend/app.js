// ==================== CONFIGURACIÓN GLOBAL ====================
class AppState {
  constructor() {
    this.currentScreen = 'carga';
    this.user = null;
    this.loading = false;
    this.players = [];
    this.jugador2Info = null;
    this.dadoSeleccionado = null;
    this.tempNombres = null;
    this.tempJugador2Info = null;
    this.modoSeguimiento = false;
    
    this.validationConfig = {
      username: { min: 3, max: 15 },
      playerName: { min: 2, max: 12 },
      password: { min: 6, max: 50 },
      minAge: 8
    };
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupFormValidation();
    this.setupAccessibility();
    this.setupBirthdateField();
    this.setupFormClickHandlers();
    this.setupRealTimeValidation();
    
    // Pantalla de carga inicial
    setTimeout(() => this.showScreen('login'), 1000);
  }

  // ==================== EVENTOS ====================
  bindEvents() {
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('submit', this.handleSubmit.bind(this));
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Prevenir submit con Enter si el form no es válido
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.matches('input:not([type="submit"])')) {
        const form = e.target.closest('form');
        if (form && !this.isFormValid(form)) {
          e.preventDefault();
        }
      }
    });
  }

  handleClick(e) {
    const target = e.target.closest('[id]');
    if (!target) return;
    
    const actions = {
      'link-registro': () => {
        e.preventDefault();
        this.showScreen('registro');
      },
      'link-login': () => {
        e.preventDefault();
        this.showScreen('login');
      },
      'btn-logout': () => this.logout(),
      'btn-jugar-app': () => {
        this.modoSeguimiento = false;
        this.showScreen('jugadores');
      },
      'btn-modo-asistente': () => this.iniciarModoSeguimiento(),
      'btn-volver-jugadores': () => this.showScreen('lobby'),
      'btn-volver-seleccion': () => this.showScreen('jugadores'),
      'btn-seleccionar-j1': () => this.iniciarPartidaConJugador(1),
      'btn-seleccionar-j2': () => this.iniciarPartidaConJugador(2),
      'btn-seleccion-aleatoria': () => this.seleccionAleatoria(),
      'btn-empezar-turno': () => this.empezarTurnoSeguimiento(),
      'btn-comenzar-juego': () => this.comenzarJuego(),
      'btn-siguiente-ronda': () => this.siguienteRonda(),
      'btn-revancha': () => this.revancha(),
      'btn-nueva-partida': () => this.nuevaPartida(),
      'btn-volver-inicio-final': () => this.showScreen('lobby')
    };
    
    if (actions[target.id]) {
      actions[target.id]();
    }
  }

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

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.hideToasts();
    }
  }

  // ==================== VALIDACIÓN EN TIEMPO REAL ====================
  setupRealTimeValidation() {
    document.addEventListener('input', e => {
      if (e.target.matches('#jugador-1, #jugador-2')) {
        this.validatePlayerNameRealTime(e.target);
      }
      if (e.target.matches('#register-username')) {
        this.validateUsernameRealTime(e.target);
      }
    });
  }

  validatePlayerNameRealTime(input) {
    const value = input.value;
    const { max, min } = this.validationConfig.playerName;
    
    this.updateCharacterCounter(input, value.length, max);
    
    // Limitar longitud
    if (value.length > max) {
      input.value = value.substring(0, max);
      this.showToast(`Nombre máximo ${max} caracteres`, 'warning');
    }
    
    // Solo letras y espacios
    if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/.test(value)) {
      input.value = value.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
      this.showToast('Solo se permiten letras y espacios', 'warning');
    }
    
    // Evitar espacios múltiples
    if (/\s{2,}/.test(value)) {
      input.value = value.replace(/\s+/g, ' ');
    }
    
    this.actualizarBotonComenzar();
    
    // Clear error si es válido
    if (value.length >= min && value.length <= max && value.trim() !== '') {
      this.clearFieldError(input);
    }
  }

  validateUsernameRealTime(input) {
    const value = input.value;
    const max = this.validationConfig.username.max;
    
    this.updateCharacterCounter(input, value.length, max);
    
    if (value.length > max) {
      input.value = value.substring(0, max);
      this.showToast(`Usuario máximo ${max} caracteres`, 'warning');
    }
    
    if (!/^[a-zA-Z0-9_]*$/.test(value)) {
      input.value = value.replace(/[^a-zA-Z0-9_]/g, '');
      this.showToast('Solo letras, números y guión bajo', 'warning');
    }
  }

  updateCharacterCounter(input, currentLength, maxLength) {
    let counter = input.parentElement.querySelector('.character-counter');
    
    if (!counter) {
      counter = document.createElement('div');
      counter.className = 'character-counter';
      input.parentElement.appendChild(counter);
    }
    
    counter.textContent = `${currentLength}/${maxLength}`;
    
    if (maxLength - currentLength < 3) {
      counter.className = 'character-counter character-counter--warning';
    } else if (maxLength - currentLength < 6) {
      counter.className = 'character-counter character-counter--attention';
    } else {
      counter.className = 'character-counter';
    }
  }

  // ==================== ACTUALIZACIÓN BOTÓN COMENZAR ====================
  actualizarBotonComenzar() {
    const j1 = document.getElementById('jugador-1');
    const j2 = document.getElementById('jugador-2');
    const btn = document.getElementById('btn-comenzar-partida');
    
    if (!j1 || !j2 || !btn) return;
    
    const j1Valid = j1.value.trim().length >= this.validationConfig.playerName.min;
    const j2Valid = j2.value.trim().length >= this.validationConfig.playerName.min && 
                   j2.value.trim().length <= this.validationConfig.playerName.max;
    const namesAreDifferent = j1.value.trim().toLowerCase() !== j2.value.trim().toLowerCase();
    
    btn.disabled = !(j1Valid && j2Valid && namesAreDifferent);
    
    // Actualizar texto del botón según el modo
    const btnText = btn.querySelector('.btn-text');
    if (btnText) {
      btnText.textContent = this.modoSeguimiento ? 'Modo seguimiento' : 'Jugar en la app';
    }
    
    // Visual feedback
    if (j2.value.trim() && !j2Valid) {
      j2.classList.add('error');
    } else if (j2Valid && namesAreDifferent) {
      j2.classList.remove('error');
    }
  }

  // ==================== VALIDACIÓN DE FORMULARIOS ====================
  validateLoginForm(username, password, form) {
    const validations = [
      [!username, '#login-username', 'Por favor ingresa tu usuario'],
      [!password, '#login-password', 'Por favor ingresa tu contraseña']
    ];
    
    for (const [condition, field, message] of validations) {
      if (condition) {
        this.showFieldError(form, field, message);
        return false;
      }
    }
    
    return true;
  }

  validateRegisterForm(data, form) {
    const { username: { min: userMin, max: userMax }, password: { min: passMin } } = this.validationConfig;
    
    const validations = [
      [!data.username, '#register-username', 'Por favor ingresa tu nombre de usuario'],
      [data.username.length < userMin || data.username.length > userMax, 
       '#register-username', `El usuario debe tener entre ${userMin} y ${userMax} caracteres`],
      [!/^[a-zA-Z0-9_]+$/.test(data.username), 
       '#register-username', 'El usuario solo puede contener letras, números y guión bajo'],
      [!data.email, '#register-email', 'Por favor ingresa tu email'],
      [!this.validateEmail(data.email), '#register-email', 'Ingresa un email válido'],
      [!data.birthdate, '#register-fecha', 'Por favor ingresa tu fecha de nacimiento'],
      [this.isFutureDate(data.birthdate), '#register-fecha', 'La fecha de nacimiento no puede ser futura'],
      [this.isUnderAge(data.birthdate, this.validationConfig.minAge), 
       '#register-fecha', `Debes tener al menos ${this.validationConfig.minAge} años para registrarte`],
      [!data.password, '#register-password', 'Por favor ingresa tu contraseña'],
      [data.password.length < passMin, 
       '#register-password', `La contraseña debe tener al menos ${passMin} caracteres`],
      [!/^(?=.*[A-Za-z])(?=.*\d)/.test(data.password), 
       '#register-password', 'La contraseña debe contener al menos una letra y un número'],
      [!data.passwordConfirm, '#register-password-confirm', 'Por favor confirma tu contraseña'],
      [data.password !== data.passwordConfirm, 
       '#register-password-confirm', 'Las contraseñas no coinciden']
    ];
    
    for (const [condition, field, message] of validations) {
      if (condition) {
        this.showFieldError(form, field, message);
        return false;
      }
    }
    
    return true;
  }

  validatePlayersForm(j1, j2) {
    const { min, max } = this.validationConfig.playerName;
    const j2Name = j2.value.trim();
    const j1Name = j1.value.trim();
    
    const validations = [
      [!j2 || !j2Name, '#jugador-2', 'Ingresa el nombre del segundo jugador'],
      [j2Name.length < min, '#jugador-2', `El nombre debe tener al menos ${min} caracteres`],
      [j2Name.length > max, '#jugador-2', `El nombre no puede exceder ${max} caracteres`],
      [!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(j2Name), 
       '#jugador-2', 'El nombre solo puede contener letras y espacios'],
      [j1Name.toLowerCase() === j2Name.toLowerCase(), 
       '#jugador-2', 'Los jugadores deben tener nombres diferentes']
    ];
    
    for (const [condition, field, message] of validations) {
      if (condition) {
        this.showFieldError(document.getElementById('form-jugadores'), field, message);
        return false;
      }
    }
    
    return true;
  }

  // ==================== UTILIDADES DE VALIDACIÓN ====================
  isFormValid(form) {
    const fields = form.querySelectorAll('input[required], input.form-input');
    return Array.from(fields).every(field => {
      return field.value.trim() !== '' && !field.classList.contains('error');
    });
  }

  sanitizePlayerName(name) {
    return name.trim().replace(/\s+/g, ' ').substring(0, this.validationConfig.playerName.max);
  }

  validateEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(email) && email.length <= 254;
  }

  isFutureDate(dateString) {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(dateString);
    return inputDate > today;
  }

  isUnderAge(dateString, minAge) {
    if (!dateString) return false;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age < minAge;
  }

  // ==================== MANEJO DE PANTALLAS ====================
  showScreen(screenName) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.pantalla, .pantalla-inicio').forEach(s => {
      s.style.display = 'none';
    });
    
    // Mostrar la pantalla solicitada
    const screen = document.getElementById(`pantalla-${screenName}`);
    if (screen) {
      screen.style.display = screenName === 'carga' ? 'flex' : 'block';
      this.animateScreenElements(screen);
    }
    
    this.currentScreen = screenName;
    this.handleScreenSpecificSetup(screenName, screen);
  }

  animateScreenElements(screen) {
    const elements = screen.querySelectorAll('.fade-in, .fade-in-up');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.animationDelay = `${index * 100}ms`;
        el.classList.add('animated');
      }, 100);
    });
  }

  handleScreenSpecificSetup(screenName, screen) {
    switch(screenName) {
      case 'jugadores':
        this.setupPantallaJugadores();
        break;
      case 'seleccion-inicial':
        this.setupSeleccionInicialEvents();
        break;
      case 'lobby':
        if (this.user && screen) {
          const titulo = screen.querySelector('.titulo--lg');
          if (titulo) titulo.textContent = this.user.name;
        }
        break;
      case 'partida':
        // Asegurar que el tablero está visible
        const pantallaPartida = document.getElementById('pantalla-partida');
        if (pantallaPartida) {
          pantallaPartida.style.display = 'block';
        }
        break;
    }
  }

  setupPantallaJugadores() {
    if (!document.getElementById('lista-jugadores')) return;
    
    this.loadUserData();
    this.setupGameControls();
    this.setupTipoJugadorChange();
    this.actualizarBotonComenzar();
  }

  loadUserData() {
    const input = document.getElementById('jugador-1');
    if (input && this.user?.username) {
      input.value = this.user.username;
    }
  }

  setupGameControls() {
    const btn = document.getElementById('btn-comenzar-partida');
    if (btn) btn.disabled = true;
    
    const container = document.getElementById('lista-jugadores');
    if (container) {
      container.addEventListener('input', () => this.actualizarBotonComenzar());
    }
  }

  setupTipoJugadorChange() {
    const radioInvitado = document.getElementById('radio-invitado');
    const radioUsuario = document.getElementById('radio-usuario');
    
    [radioInvitado, radioUsuario].forEach(radio => {
      if (radio) {
        radio.addEventListener('change', () => {
          if (radio.checked) {
            this.updatePlayerType(radio.value);
          }
        });
      }
    });
    
    // Click en los labels
    document.querySelectorAll('.radio-option').forEach(label => {
      label.addEventListener('click', (e) => {
        e.stopPropagation();
        const input = label.querySelector('input[type="radio"]');
        if (input) {
          input.checked = true;
          this.updatePlayerType(input.value);
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
  }

  updatePlayerType(tipo) {
    const avatar = document.getElementById('avatar-jugador-2');
    const nombre = document.getElementById('jugador-2');
    
    if (avatar) {
      avatar.src = tipo === 'invitado' ? 'img/invitado.png' : 'img/foto_usuario-2.png';
    }
    
    if (nombre) {
      nombre.placeholder = tipo === 'invitado' ? 
        'Ingrese nombre de jugador #2' : 
        'Nombre de usuario existente';
      nombre.value = '';
    }
    
    this.actualizarBotonComenzar();
  }

  setupSeleccionInicialEvents() {
    // Limpiar eventos anteriores
    document.querySelectorAll('.jugador-opcion').forEach(opcion => {
      const newOpcion = opcion.cloneNode(true);
      opcion.parentNode.replaceChild(newOpcion, opcion);
    });
    
    // Configurar nuevos eventos
    document.querySelectorAll('.jugador-opcion').forEach(opcion => {
      opcion.addEventListener('mouseenter', () => {
        opcion.style.transform = 'translateY(-5px)';
        opcion.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      });
      
      opcion.addEventListener('mouseleave', () => {
        if (!opcion.classList.contains('seleccionado')) {
          opcion.style.transform = '';
          opcion.style.boxShadow = '';
        }
      });
      
      opcion.addEventListener('click', () => {
        // Deseleccionar todas
        document.querySelectorAll('.jugador-opcion').forEach(opt => {
          opt.classList.remove('seleccionado');
          opt.style.transform = '';
          opt.style.boxShadow = '';
        });
        
        // Seleccionar actual
        opcion.classList.add('seleccionado');
        opcion.style.transform = 'translateY(-5px)';
        opcion.style.boxShadow = '0 0 20px rgba(98,129,7,0.4)';
        
        // Iniciar partida
        const jugadorNum = opcion.id === 'opcion-jugador-2' ? 2 : 1;
        setTimeout(() => this.iniciarPartidaConJugador(jugadorNum), 250);
      });
    });
  }

  // ==================== MODO SEGUIMIENTO ====================
  iniciarModoSeguimiento() {
    this.modoSeguimiento = true;
    this.showScreen('jugadores');
    this.showToast('Modo seguimiento activado', 'success');
  }

  mostrarTurnoJugadorConSeleccion(nombreJugador, avatarSrc) {
    const nombreElement = document.getElementById('nombre-turno-jugador');
    const avatarElement = document.getElementById('avatar-turno-actual');
    
    if (nombreElement) nombreElement.textContent = nombreJugador.toUpperCase();
    if (avatarElement) avatarElement.src = avatarSrc;
    
    this.showScreen('turno-jugador');
  }

  empezarTurnoSeguimiento() {
    this.showScreen('partida');
    setTimeout(() => {
      if (window.ModoSeguimiento) {
        window.ModoSeguimiento.mostrarPopupSeleccionDinosaurios();
      }
    }, 100);
  }

  // ==================== MANEJO DE JUGADORES ====================
  handleJugadoresSubmit(form) {
    const j1 = form.querySelector('#jugador-1');
    const j2 = form.querySelector('#jugador-2');
    const tipoJugador = form.querySelector('input[name="tipo-jugador-2"]:checked');
    
    // Sanitizar nombres
    if (j1) j1.value = this.sanitizePlayerName(j1.value);
    if (j2) j2.value = this.sanitizePlayerName(j2.value);
    
    if (!this.validatePlayersForm(j1, j2)) return;
    
    const nombres = [j1.value.trim(), j2.value.trim()];
    const jugador2Info = {
      nombre: j2.value.trim(),
      tipo: tipoJugador ? tipoJugador.value : 'invitado'
    };
    
    this.mostrarSelectorQuienEmpieza(nombres, jugador2Info);
  }

  mostrarSelectorQuienEmpieza(nombres, jugador2Info) {
    this.tempNombres = nombres;
    this.tempJugador2Info = jugador2Info;
    
    // Actualizar nombres en la pantalla
    const n1 = document.querySelector('.nombre-jugador-1');
    const n2 = document.querySelector('.nombre-jugador-2');
    
    if (n1) n1.textContent = nombres[0].toUpperCase();
    if (n2) n2.textContent = nombres[1].toUpperCase();
    
    // Actualizar avatar jugador 2
    const avatar = document.getElementById('avatar-seleccion-j2');
    if (avatar && jugador2Info) {
      avatar.src = jugador2Info.tipo === 'invitado' ? 
        'img/invitado.png' : 'img/foto_usuario-2.png';
    }
    
    this.showScreen('seleccion-inicial');
  }

  seleccionAleatoria() {
    const elegido = Math.random() < 0.5 ? 1 : 2;
    const card = document.getElementById(`opcion-jugador-${elegido}`);
    
    if (card) {
      card.classList.add('seleccionado');
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 0 20px rgba(98,129,7,0.4)';
    }
    
    setTimeout(() => this.iniciarPartidaConJugador(elegido), 300);
  }

  iniciarPartidaConJugador(primerJugador) {
    // Verificar datos temporales
    if (!this.tempNombres || !this.tempJugador2Info) {
      const j1 = document.getElementById('jugador-1')?.value?.trim() || 'Jugador 1';
      const j2 = document.getElementById('jugador-2')?.value?.trim() || 'Jugador 2';
      
      this.tempNombres = [j1, j2];
      this.tempJugador2Info = {
        nombre: j2,
        tipo: document.querySelector('input[name="tipo-jugador-2"]:checked')?.value || 'invitado'
      };
    }
    
    this.iniciarPartida(this.tempNombres, this.tempJugador2Info, primerJugador);
    
    // Limpiar datos temporales
    this.tempNombres = null;
    this.tempJugador2Info = null;
  }

  iniciarPartida(nombres, jugador2Info, primerJugador) {
    this.players = nombres.slice(0, 2);
    this.jugador2Info = jugador2Info;
    
    // Inicializar el juego
    if (window.JuegoManager?.inicializarPartida) {
      window.JuegoManager.inicializarPartida(nombres, jugador2Info, primerJugador, this.modoSeguimiento);
    } else {
      console.error('JuegoManager no disponible');
    }
    
    if (this.modoSeguimiento) {
      // Modo seguimiento: mostrar pantalla de turno
      const nombreJugador = nombres[primerJugador - 1];
      const avatarSrc = primerJugador === 1 ? 
        'img/foto_usuario-1.png' : 
        (jugador2Info.tipo === 'invitado' ? 'img/invitado.png' : 'img/foto_usuario-2.png');
      
      this.mostrarTurnoJugadorConSeleccion(nombreJugador, avatarSrc);
    } else {
      // Modo normal: verificar restricción del primer turno
      if (window.estadoJuego?.turnoEnRonda === 1 && window.estadoJuego?.rondaActual === 1) {
        // Primer turno de la primera ronda: sin restricción
        this.mostrarPantallaSinRestriccion();
      } else {
        // Otros turnos: lanzar dado
        this.showScreen('dado-animacion');
        setTimeout(() => this.iniciarAnimacionDado(), 400);
      }
    }
  }

  mostrarPantallaSinRestriccion() {
    // Ir directo a la pantalla de partida sin dado
    this.showScreen('partida');
    
    // Establecer "Sin restricción" en el footer
    const infoRestriccion = document.querySelector('.info-restriccion');
    const textoRestriccion = document.querySelector('.texto-restriccion');
    
    if (infoRestriccion) {
      infoRestriccion.style.visibility = 'visible';
    }
    
    if (textoRestriccion) {
      textoRestriccion.innerHTML = '<div>Sin restricción</div>';
    }
    
    // Actualizar interfaz
    if (window.JuegoManager) {
      window.JuegoManager.actualizarInterfaz();
      window.RenderManager?.actualizarDinosauriosDisponibles();
    }
  }

  comenzarJuego() {
    // Verificar si es el primer turno
    if (window.estadoJuego?.turnoEnRonda === 1 && window.estadoJuego?.rondaActual === 1) {
      this.mostrarPantallaSinRestriccion();
    } else {
      this.showScreen('partida');
      if (window.JuegoManager?.procesarResultadoDado) {
        window.JuegoManager.procesarResultadoDado(this.dadoSeleccionado || 1);
      }
    }
  }

  // ==================== ANIMACIÓN DE DADOS ====================
  iniciarAnimacionDado() {
    const img = document.getElementById('dado-imagen');
    const cont = document.getElementById('dado-animado');
    
    if (!img || !cont) return;
    
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
    
    const intervalo = setInterval(() => {
      img.src = dados[Math.floor(Math.random() * dados.length)];
      contador++;
      
      if (contador > 10) {
        clearInterval(intervalo);
        this.ralentizarAnimacionDado(dados, contador, 15);
      }
    }, 150);
  }

  ralentizarAnimacionDado(dados, contadorInicial, maxCambios) {
    const img = document.getElementById('dado-imagen');
    let contador = contadorInicial;
    let intervaloActual = 200;
    
    const intervaloLento = setInterval(() => {
      img.src = dados[Math.floor(Math.random() * dados.length)];
      contador++;
      
      if (contador >= maxCambios) {
        clearInterval(intervaloLento);
        this.finalizarAnimacionDado(dados);
      }
      
      intervaloActual += 50;
    }, intervaloActual);
  }

  finalizarAnimacionDado(dados) {
    const img = document.getElementById('dado-imagen');
    const cont = document.getElementById('dado-animado');
    const texto = document.querySelector('.dado-texto');
    
    this.dadoSeleccionado = Math.floor(Math.random() * dados.length) + 1;
    img.src = dados[this.dadoSeleccionado - 1];
    
    cont.classList.remove('spinning');
    cont.classList.add('final');
    
    if (texto) texto.textContent = '¡Dado lanzado!';
    
    setTimeout(() => this.mostrarResultadoDado(this.dadoSeleccionado), 800);
  }

  mostrarResultadoDado(dadoNumero) {
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
    
    this.updatePopupContent(config[dadoNumero]);
    this.showScreen('dado-resultado');
    
    const btn = document.getElementById('btn-comenzar-juego');
    if (btn) {
      btn.textContent = 'Continuar';
      btn.onclick = () => this.comenzarJuego();
    }
  }

  updatePopupContent(config) {
    const img = document.getElementById('dado-resultado-img');
    const titulo = document.getElementById('titulo-dado');
    const desc = document.getElementById('descripcion-dado');
    
    if (img) img.src = config.imagen;
    if (titulo) titulo.textContent = config.titulo;
    if (desc) desc.textContent = config.descripcion;
  }

  // ==================== MANEJO DE FORMULARIOS ====================
  async handleLogin(form) {
    const username = form.querySelector('#login-username').value.trim();
    const password = form.querySelector('#login-password').value.trim();
    
    this.clearFormErrors(form);
    
    if (!this.validateLoginForm(username, password, form)) return;
    
    this.setLoading(true);
    
    try {
      await this.delay(800);
      
      this.user = {
        username: username,
        name: username.toUpperCase()
      };
      
      this.showScreen('lobby');
      this.showToast('¡Bienvenido de vuelta!', 'success');
    } catch (error) {
      this.showToast('Error al iniciar sesión', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  async handleRegister(form) {
    const formData = this.getRegisterFormData(form);
    
    this.clearFormErrors(form);
    
    if (!this.validateRegisterForm(formData, form)) return;
    
    this.setLoading(true);
    
    try {
      await this.delay(2000);
      
      this.user = {
        username: formData.username,
        name: formData.username.toUpperCase(),
        email: formData.email,
        birthdate: formData.birthdate
      };
      
      this.showScreen('lobby');
      this.showToast('¡Cuenta creada exitosamente!', 'success');
    } catch (error) {
      this.showToast('Error al crear la cuenta', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  getRegisterFormData(form) {
    return {
      username: form.querySelector('#register-username')?.value?.trim() || '',
      email: form.querySelector('#register-email')?.value?.trim() || '',
      birthdate: form.querySelector('#register-fecha')?.value?.trim() || '',
      password: form.querySelector('#register-password')?.value?.trim() || '',
      passwordConfirm: form.querySelector('#register-password-confirm')?.value?.trim() || ''
    };
  }

  // ==================== CONFIGURACIÓN DE FORMULARIOS ====================
  setupFormValidation() {
    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.clearFieldError(input);
        }
      });
      
      // Validación de fuerza de contraseña
      if (input.type === 'password' && input.closest('#register-form')) {
        input.addEventListener('input', () => {
          this.validatePasswordStrength(input);
        });
      }
    });
  }

  validatePasswordStrength(passwordInput) {
    const password = passwordInput.value;
    let indicator = passwordInput.parentElement.querySelector('.password-strength');
    
    if (!indicator) {
      indicator = this.createPasswordStrengthIndicator(passwordInput);
    }
    
    const strength = this.calculatePasswordStrength(password);
    
    indicator.className = 'password-strength';
    
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

  calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return strength;
  }

  createPasswordStrengthIndicator(passwordInput) {
    const indicator = document.createElement('div');
    indicator.className = 'password-strength';
    passwordInput.parentElement.appendChild(indicator);
    return indicator;
  }

  setupFormClickHandlers() {
    document.querySelectorAll('.form-group').forEach(group => {
      const input = group.querySelector('.form-input');
      const tipoJugadorSelector = group.querySelector('.tipo-jugador-selector');
      
      if (input && !input.hasAttribute('readonly') && !tipoJugadorSelector) {
        group.addEventListener('click', e => {
          if (e.target !== input) {
            input.focus();
          }
        });
      }
    });
    
    // Radio buttons
    document.querySelectorAll('.radio-option').forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const radio = this.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
  }

  setupAccessibility() {
    // Focus visible
    document.addEventListener('focusin', e => {
      if (e.target.matches('.btn, .form-input, .btn-icon')) {
        e.target.classList.add('focus-visible');
      }
    });
    
    document.addEventListener('focusout', e => {
      e.target.classList.remove('focus-visible');
    });
    
    // Reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-base', '0ms');
      document.documentElement.style.setProperty('--transition-fast', '0ms');
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }

  setupBirthdateField() {
    const fechaInput = document.querySelector('#register-fecha');
    if (!fechaInput) return;
    
    // Establecer fecha máxima (hoy)
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    fechaInput.max = `${yyyy}-${mm}-${dd}`;
    
    // Establecer fecha mínima (100 años atrás)
    const fechaMinima = new Date();
    fechaMinima.setFullYear(fechaMinima.getFullYear() - 100);
    fechaInput.min = `${fechaMinima.getFullYear()}-${String(fechaMinima.getMonth() + 1).padStart(2, '0')}-${String(fechaMinima.getDate()).padStart(2, '0')}`;
    
    // Validar edad al cambiar
    fechaInput.addEventListener('change', () => {
      const birthDate = new Date(fechaInput.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < this.validationConfig.minAge) {
        this.showToast(`Debes tener al menos ${this.validationConfig.minAge} años`, 'warning');
        fechaInput.classList.add('error');
      } else {
        fechaInput.classList.remove('error');
      }
    });
  }

  // ==================== SISTEMA DE TOASTS ====================
  showToast(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    // Evitar duplicados
    const existingToasts = Array.from(container.querySelectorAll('.toast'));
    const isDuplicate = existingToasts.some(toast => {
      const msgElement = toast.querySelector('.toast__message');
      return msgElement && msgElement.textContent === message;
    });
    
    if (isDuplicate) return;
    
    const toast = this.createToastElement(message, type);
    container.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        this.removeToast(toast);
      }
    }, duration);
  }

  createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type} fade-in`;
    
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };
    
    toast.innerHTML = `
      <div class="toast__content">
        <span class="toast__icon">${icons[type] || icons.info}</span>
        <span class="toast__message">${message}</span>
        <button class="toast__close" aria-label="Cerrar notificación">&times;</button>
      </div>
    `;
    
    // Eventos
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => this.removeToast(toast));
    
    toast.addEventListener('click', e => {
      if (!e.target.matches('.toast__close')) {
        this.removeToast(toast);
      }
    });
    
    return toast;
  }

  removeToast(toast) {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }

  hideToasts() {
    document.querySelectorAll('.toast').forEach(toast => {
      this.removeToast(toast);
    });
  }

  // ==================== UTILIDADES ====================
  showFieldError(form, selector, message) {
    const field = form.querySelector(selector);
    if (field) {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');
      field.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      setTimeout(() => field.focus(), 300);
    }
    this.showToast(message, 'error');
  }

  clearFormErrors(form) {
    form.querySelectorAll('.form-input').forEach(input => {
      this.clearFieldError(input);
    });
    
    form.querySelectorAll('.character-counter--warning, .character-counter--attention')
      .forEach(counter => {
        counter.className = 'character-counter';
      });
  } 


  clearFieldError(input) {
    input.classList.remove('error');
    input.setAttribute('aria-invalid', 'false');
    
    const counter = input.parentElement.querySelector('.character-counter');
    if (counter) {
      counter.classList.remove('character-counter--warning', 'character-counter--attention');
    }
  }

  setLoading(isLoading) {
    this.loading = isLoading;
    
    document.querySelectorAll('.btn').forEach(btn => {
      if (isLoading) {
        btn.classList.add('btn--loading');
        btn.disabled = true;
        
        if (!btn.dataset.originalText) {
          btn.dataset.originalText = btn.textContent;
        }
        btn.textContent = 'Cargando...';
      } else {
        btn.classList.remove('btn--loading');
        btn.disabled = false;
        
        if (btn.dataset.originalText) {
          btn.textContent = btn.dataset.originalText;
          delete btn.dataset.originalText;
        }
      }
    });
  }

  // ==================== ACCIONES DE JUEGO ====================
  siguienteRonda() {
    if (window.JuegoManager?.prepararSiguienteRonda) {
      window.JuegoManager.prepararSiguienteRonda();
    }
  }

  revancha() {
    if (window.JuegoManager?.reiniciarJuegoCompleto) {
      window.JuegoManager.reiniciarJuegoCompleto();
    }
    this.showScreen('seleccion-inicial');
  }

  nuevaPartida() {
    this.modoSeguimiento = false;
    this.showScreen('jugadores');
    
    // Limpiar campos
    const j2 = document.getElementById('jugador-2');
    if (j2) j2.value = '';
    
    const radioInvitado = document.getElementById('radio-invitado');
    if (radioInvitado) radioInvitado.checked = true;
    
    this.updatePlayerType('invitado');
  }

  logout() {
    const confirmLogout = this.currentScreen === 'partida' ? 
      confirm('¿Estás seguro de que quieres cerrar sesión? Se perderá el progreso de la partida actual.') : 
      true;
    
    if (!confirmLogout) return;
    
    // Limpiar estado
    this.user = null;
    this.players = [];
    this.jugador2Info = null;
    this.dadoSeleccionado = null;

    
    this.tempNombres = null;
    this.tempJugador2Info = null;
    this.modoSeguimiento = false;
    
    // Limpiar formularios
    document.querySelectorAll('form').forEach(form => form.reset());
    
    this.showScreen('login');
    this.showToast('Sesión cerrada', 'info');
  }

  // ==================== UTILIDADES AUXILIARES ====================
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getDebugInfo() {
    return {
      currentScreen: this.currentScreen,
      user: this.user,
      players: this.players,
      loading: this.loading,
      modoSeguimiento: this.modoSeguimiento,
      tempData: {
        nombres: this.tempNombres,
        jugador2Info: this.tempJugador2Info
      },
      validationConfig: this.validationConfig
    };
  }

  resetAppState() {
    this.currentScreen = 'login';
    this.user = null;
    this.loading = false;
    this.players = [];
    this.jugador2Info = null;
    this.dadoSeleccionado = null;
    this.tempNombres = null;
    this.tempJugador2Info = null;
    this.modoSeguimiento = false;
    
    this.hideToasts();
    
    document.querySelectorAll('form').forEach(form => {
      form.reset();
      this.clearFormErrors(form);
    });
  }

  validateDOMIntegrity() {
    const required = [
      'pantalla-login',
      'pantalla-registro',
      'pantalla-lobby',
      'pantalla-jugadores',
      'pantalla-seleccion-inicial',
      'pantalla-partida',
      'toast-container'
    ];
    
    const missing = required.filter(id => !document.getElementById(id));
    
    if (missing.length > 0) {
      console.error('Elementos DOM faltantes:', missing);
      return false;
    }
    
    return true;
  }
}

// ==================== INICIALIZACIÓN ====================
if (!window.app) {
  document.addEventListener('DOMContentLoaded', () => {
    const tempApp = new AppState();
    
    if (tempApp.validateDOMIntegrity()) {
      window.app = tempApp;
      console.log('App inicializada correctamente');
    } else {
      console.error('Error: DOM incompleto, no se puede inicializar la aplicación');
    }
  });
}

// ==================== MANEJO DE ERRORES GLOBALES ====================
window.addEventListener('error', e => {
  console.error('Error global capturado:', e.error);
  if (window.app) {
    window.app.showToast('Ha ocurrido un error inesperado', 'error');
  }
});

window.addEventListener('unhandledrejection', e => {
  console.error('Promesa rechazada sin manejar:', e.reason);
  if (window.app) {
    window.app.showToast('Error en operación asíncrona', 'error');
  }
});