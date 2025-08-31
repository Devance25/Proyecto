// ==================== SISTEMA DE MANEJO DE ESTADOS ==================== 
class AppState {
    constructor() {
        this.currentScreen = 'carga';
        this.user = null;
        this.loading = false;
        this.players = [];
        this.jugador2Info = null;
        this.dadoSeleccionado = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFormValidation();
        this.setupAccessibility();
        this.setupBirthdateField();
        this.setupFormClickHandlers();

        // Simular carga inicial y luego ir a login
        setTimeout(() => this.showScreen('login'), 1000);
    }

    // ==================== EVENT BINDING ==================== 
    bindEvents() {
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('submit', this.handleSubmit.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
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
            'btn-jugar-app': () => this.showScreen('jugadores'),
            'btn-agregar-jugador': () => this.showToast('Solo se permiten 2 jugadores', 'info'),
            'btn-volver-jugadores': () => this.showScreen('lobby'),
            'btn-modo-asistente': () => this.showToast('Modo asistente activado', 'info'),
            'btn-comenzar-juego': () => {
                // Aplica la restricción del dado al volver al tablero
                if (window.JuegoManager?.procesarResultadoDado) {
                    window.JuegoManager.procesarResultadoDado(this.dadoSeleccionado || 1);
                } else {
                    this.showScreen('partida');
                }
            },
            'btn-siguiente-ronda': () => {
                if (window.JuegoManager?.iniciarSiguienteRonda) {
                    window.JuegoManager.iniciarSiguienteRonda();
                }
            },
            'btn-revancha': () => {
                if (window.JuegoManager?.reiniciarJuegoCompleto) {
                    window.JuegoManager.reiniciarJuegoCompleto();
                    this.showScreen('partida');
                }
            },
            'btn-nueva-partida': () => this.showScreen('jugadores'),
            'btn-volver-inicio-final': () => this.showScreen('lobby'),
            'btn-seleccionar-j1': () => this.iniciarPartidaConJugador(1),
            'btn-seleccionar-j2': () => this.iniciarPartidaConJugador(2),
            'btn-seleccion-aleatoria': () => this.iniciarPartidaConJugador(Math.random() < 0.5 ? 1 : 2)
        };

        if (actions[target.id]) {
            actions[target.id]();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;

        const formActions = {
            'login-form': () => this.handleLogin(form),
            'register-form': () => this.handleRegister(form),
            'form-jugadores': () => this.handleJugadoresSubmit(form)
        };

        if (formActions[form.id]) {
            formActions[form.id]();
        }
    }

    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.hideToasts();
        }
    }

    // ==================== MANEJO DE LOGIN ==================== 
    async handleLogin(form) {
        const username = form.querySelector('#login-username').value.trim();
        const password = form.querySelector('#login-password').value.trim();

        // Limpiar errores visuales previos
        this.clearFormErrors(form);

        // Validaciones
        if (!this.validateLoginForm(username, password, form)) {
            return;
        }

        this.setLoading(true);

        try {
            await this.delay(800);
            this.user = { username, name: username.toUpperCase() };
            this.showScreen('lobby');
            this.showToast('¡Bienvenido de vuelta!', 'success');
        } catch (error) {
            this.showToast('Error al iniciar sesión', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    validateLoginForm(username, password, form) {
        if (!username) {
            this.showFieldError(form, '#login-username', 'Por favor ingresa tu usuario');
            return false;
        }

        if (username.length < 3 || username.length > 20) {
            this.showFieldError(form, '#login-username', 'El usuario debe tener entre 3 y 20 caracteres');
            return false;
        }

        if (!password) {
            this.showFieldError(form, '#login-password', 'Por favor ingresa tu contraseña');
            return false;
        }

        return true;
    }

    // ==================== MANEJO DE REGISTRO ==================== 
    async handleRegister(form) {
        const formData = this.getRegisterFormData(form);

        // Limpiar errores visuales previos
        this.clearFormErrors(form);

        // Validaciones
        if (!this.validateRegisterForm(formData, form)) {
            return;
        }

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
            username: form.querySelector('#register-username').value.trim(),
            email: form.querySelector('#register-email').value.trim(),
            birthdate: form.querySelector('#register-fecha')?.value || '',
            password: form.querySelector('#register-password').value.trim(),
            passwordConfirm: form.querySelector('#register-password-confirm').value.trim()
        };
    }

    validateRegisterForm(data, form) {
        const validations = [
            { condition: !data.username, field: '#register-username', message: 'Por favor ingresa tu nombre de usuario' },
            { condition: data.username.length < 3 || data.username.length > 20, field: '#register-username', message: 'El nombre debe tener entre 3 y 20 caracteres' },
            { condition: !data.email, field: '#register-email', message: 'Por favor ingresa tu email' },
            { condition: !this.validateEmail(data.email), field: '#register-email', message: 'Ingresa un email válido' },
            { condition: !data.birthdate, field: '#register-fecha', message: 'Por favor ingresá tu fecha de nacimiento' },
            { condition: this.isFutureDate(data.birthdate), field: '#register-fecha', message: 'La fecha de nacimiento no puede ser futura' },
            { condition: this.isUnderAge(data.birthdate, 8), field: '#register-fecha', message: 'Debes tener al menos 8 años para registrarte' },
            { condition: !data.password, field: '#register-password', message: 'Por favor ingresa tu contraseña' },
            { condition: data.password.length < 6, field: '#register-password', message: 'La contraseña debe tener al menos 6 caracteres' },
            { condition: !data.passwordConfirm, field: '#register-password-confirm', message: 'Por favor confirma tu contraseña' },
            { condition: data.password !== data.passwordConfirm, field: '#register-password-confirm', message: 'Las contraseñas no coinciden' }
        ];

        for (const validation of validations) {
            if (validation.condition) {
                this.showFieldError(form, validation.field, validation.message);
                return false;
            }
        }

        return true;
    }

    // ==================== NAVEGACIÓN DE PANTALLAS ==================== 
    showScreen(screenName) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.pantalla, .pantalla-inicio').forEach(screen => {
            screen.style.display = 'none';
        });

        // Mostrar la pantalla solicitada
        const screen = document.getElementById(`pantalla-${screenName}`);
        if (screen) {
            screen.style.display = screenName === 'carga' ? 'flex' : 'block';
            this.animateScreenElements(screen);
        }

        this.currentScreen = screenName;

        // Configuraciones específicas por pantalla
        this.handleScreenSpecificSetup(screenName, screen);
    }

    animateScreenElements(screen) {
        const animatedElements = screen.querySelectorAll('.fade-in, .fade-in-up');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animationDelay = `${index * 100}ms`;
                el.classList.add('animated');
            }, 100);
        });
    }


handleScreenSpecificSetup(screenName, screen) {
        if (screenName === 'jugadores') {
            this.setupPantallaJugadores();
        }

        if (screenName === 'seleccion-inicial') {
            // Configurar eventos de hover para la selección
            this.setupSeleccionInicialEvents();
        }

        if (screenName === 'lobby' && this.user) {
            const nameElement = screen.querySelector('.titulo--lg');
            if (nameElement) {
                nameElement.textContent = this.user.name;
            }
        }
    }

    setupSeleccionInicialEvents() {
        // Efectos hover para las opciones de jugador
        document.querySelectorAll('.jugador-opcion').forEach(opcion => {
            opcion.addEventListener('mouseenter', () => {
                opcion.style.transform = 'translateY(-5px)';
                opcion.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
            });
            
            opcion.addEventListener('mouseleave', () => {
                if (!opcion.classList.contains('seleccionado')) {
                    opcion.style.transform = '';
                    opcion.style.boxShadow = '';
                }
            });

            opcion.addEventListener('click', () => {
                // Remover selección previa
                document.querySelectorAll('.jugador-opcion').forEach(opt => {
                    opt.classList.remove('seleccionado');
                    opt.style.transform = '';
                    opt.style.boxShadow = '';
                });
                
                // Aplicar selección actual
                opcion.classList.add('seleccionado');
                opcion.style.transform = 'translateY(-5px)';
                opcion.style.boxShadow = '0 0 20px rgba(98, 129, 7, 0.4)';
            });
        });
    }
    // ==================== CONFIGURACIÓN DE JUGADORES ==================== 
    setupPantallaJugadores() {
        const cont = document.getElementById('lista-jugadores');
        if (!cont) return;

        // Cargar nombre del usuario logueado
        this.loadUserData();

        // Configurar controles
        this.setupGameControls();

        // Configurar eventos de radio buttons
        this.setupTipoJugadorChange();

        // Validación inicial
        this.actualizarBotonComenzar();
    }

    loadUserData() {
        const input1 = document.getElementById('jugador-1');
        if (input1 && this.user?.username) {
            input1.value = this.user.username;
        }
    }

    setupGameControls() {
        const btn = document.getElementById('btn-comenzar-partida');
        if (btn) btn.disabled = true;

        const cont = document.getElementById('lista-jugadores');
        if (cont) {
            cont.addEventListener('input', () => this.actualizarBotonComenzar());
        }
    }

    setupTipoJugadorChange() {
        const radioInvitado = document.getElementById('radio-invitado');
        const radioUsuario = document.getElementById('radio-usuario');

        // Event listeners para cambios
        [radioInvitado, radioUsuario].forEach(radio => {
            if (radio) {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        this.updatePlayerType(radio.value);
                    }
                });
            }
        });

        // Event listeners para clicks en labels
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
        const avatarImg = document.getElementById('avatar-jugador-2');
        const nombreInput = document.getElementById('jugador-2');

        if (tipo === 'invitado') {
            if (avatarImg) avatarImg.src = 'img/invitado.png';
            if (nombreInput) {
                nombreInput.placeholder = 'Ingrese nombre de jugador #2';
                nombreInput.value = '';
            }
        } else if (tipo === 'usuario') {
            if (avatarImg) avatarImg.src = 'img/foto_usuario-2.png';
            if (nombreInput) {
                nombreInput.placeholder = 'Nombre de usuario existente';
                nombreInput.value = '';
            }
        }

        this.actualizarBotonComenzar();
    }

    actualizarBotonComenzar() {
        const j2 = document.getElementById('jugador-2');
        const btn = document.getElementById('btn-comenzar-partida');

        if (!j2 || !btn) return;

        btn.disabled = j2.value.trim() === '';
    }

    // ==================== MANEJO DE JUGADORES ==================== 
    handleJugadoresSubmit(form) {
        const j1 = form.querySelector('#jugador-1');
        const j2 = form.querySelector('#jugador-2');
        const tipoJugador = form.querySelector('input[name="tipo-jugador-2"]:checked');

        // Validar datos
        if (!this.validatePlayersForm(j1, j2)) {
            return;
        }

        // Preparar datos de jugadores
        const nombres = [j1.value.trim(), j2.value.trim()];
        const jugador2Info = {
            nombre: j2.value.trim(),
            tipo: tipoJugador ? tipoJugador.value : 'invitado'
        };

        // Mostrar selector de quién empieza
        this.mostrarSelectorQuienEmpieza(nombres, jugador2Info);
    }

    validatePlayersForm(j1, j2) {
        if (!j2 || !j2.value.trim()) {
            this.showFieldError(document.getElementById('form-jugadores'), '#jugador-2', 'Ingresa el nombre del segundo jugador');
            return false;
        }
        return true;
    }

    // ==================== QUIÉN EMPIEZA ====================
    mostrarSelectorQuienEmpieza(nombres, jugador2Info) {
        // Creamos un modal simple sin depender de HTML existente
        let modal = document.getElementById('popup-quien-empieza');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'popup-quien-empieza';
            modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999;';
            modal.innerHTML = `
                <div style="background:#fff;border-radius:12px;max-width:520px;width:92%;padding:24px;font-family:inherit;box-shadow:0 20px 60px rgba(0,0,0,.35)">
                    <h3 style="margin:0 0 12px 0;font-size:22px;">¿Quién empieza?</h3>
                    <p style="margin:0 0 16px 0;color:#444">Elegí el jugador que comienza la ronda 1.</p>
                    <div style="display:flex;gap:12px;flex-wrap:wrap">
                        <button id="btn-empieza-j1" class="btn" style="flex:1;padding:12px 14px;border-radius:10px;border:none;background:#2e7d32;color:#fff;cursor:pointer">${nombres[0] || 'Jugador 1'}</button>
                        <button id="btn-empieza-j2" class="btn" style="flex:1;padding:12px 14px;border-radius:10px;border:none;background:#1565c0;color:#fff;cursor:pointer">${nombres[1] || 'Jugador 2'}</button>
                    </div>
                    <div style="display:flex;justify-content:flex-end;margin-top:10px">
                        <button id="btn-empieza-aleatorio" class="btn" style="padding:8px 12px;border-radius:8px;border:1px solid #ccc;background:#fafafa;cursor:pointer">Aleatorio</button>
                    </div>
                </div>`;
            document.body.appendChild(modal);
        } else {
            modal.querySelector('#btn-empieza-j1').textContent = nombres[0] || 'Jugador 1';
            modal.querySelector('#btn-empieza-j2').textContent = nombres[1] || 'Jugador 2';
        }

        const iniciar = (primerJugador) => {
            modal.remove();
            this.iniciarPartida(nombres, jugador2Info, primerJugador);
        };

        modal.querySelector('#btn-empieza-j1').onclick = () => iniciar(1);
        modal.querySelector('#btn-empieza-j2').onclick = () => iniciar(2);
        modal.querySelector('#btn-empieza-aleatorio').onclick = () => iniciar(Math.random() < 0.5 ? 1 : 2);
    }

    iniciarPartida(nombres, jugador2Info, primerJugador) {
        this.players = nombres.slice(0, 2);
        this.jugador2Info = jugador2Info;

        // Mostrar el tablero
        this.showScreen('partida');

        // Inicializar la lógica del juego (definida en tablero.js)
        const elegido = primerJugador || (Math.random() < 0.5 ? 1 : 2);
        if (window.JuegoManager && typeof window.JuegoManager.inicializarPartida === 'function') {
            window.JuegoManager.inicializarPartida(nombres, jugador2Info, elegido);
        } else {
            console.error('JuegoManager no disponible');
        }
    }

    // ==================== LÓGICA DEL DADO ==================== 
    iniciarAnimacionDado() {
        const dadoImg = document.getElementById('dado-imagen');
        const dadoContainer = document.getElementById('dado-animado');
        const dadoTexto = document.querySelector('.dado-texto');

        if (!dadoImg || !dadoContainer) return;

        const dados = [
            'img/dado-baños.png', 'img/dado-bosque.png', 'img/dado-cafe.png',
            'img/dado-huella.png', 'img/dado-no-trex.png', 'img/dado-rocas.png'
        ];

        let contador = 0;
        const maxCambios = 15;
        const intervaloInicial = 150;

        dadoContainer.classList.add('spinning');

        const intervalo = setInterval(() => {
            const indiceAleatorio = Math.floor(Math.random() * dados.length);
            dadoImg.src = dados[indiceAleatorio];
            contador++;

            if (contador > maxCambios * 0.7) {
                clearInterval(intervalo);
                this.ralentizarAnimacionDado(dados, contador, maxCambios);
            }
        }, intervaloInicial);
    }

    ralentizarAnimacionDado(dados, contadorInicial, maxCambios) {
        const dadoImg = document.getElementById('dado-imagen');
        let contador = contadorInicial;
        let intervaloActual = 200;

        const intervaloLento = setInterval(() => {
            const indiceAleatorio = Math.floor(Math.random() * dados.length);
            dadoImg.src = dados[indiceAleatorio];

            contador++;
            intervaloActual += 50;

            if (contador >= maxCambios) {
                clearInterval(intervaloLento);
                this.finalizarAnimacionDado(dados);
            }
        }, intervaloActual);
    }

    finalizarAnimacionDado(dados) {
        const dadoImg = document.getElementById('dado-imagen');
        const dadoContainer = document.getElementById('dado-animado');
        const dadoTexto = document.querySelector('.dado-texto');

        // Seleccionar dado final
        const dadoFinal = Math.floor(Math.random() * dados.length) + 1;
        this.dadoSeleccionado = dadoFinal;

        // Mostrar dado final
        dadoImg.src = dados[dadoFinal - 1];
        dadoContainer.classList.remove('spinning');
        dadoContainer.classList.add('final');

        if (dadoTexto) {
            dadoTexto.textContent = '¡Dado lanzado!';
        }

        setTimeout(() => {
            this.mostrarResultadoDado(dadoFinal);
        }, 800);
    }

    mostrarResultadoDado(dadoNumero) {
        const configuracionDados = {
            1: { titulo: "Lugar vacío", descripcion: "Poné el dinosaurio en un lugar donde no haya ningún otro. Si no podés cumplir la consigna, poné el dinosaurio en el río.", imagen: "img/dado-huella.png" },
            2: { titulo: "Sin T-Rex", descripcion: "Poné el dinosaurio en un lugar donde no esté el T-Rex. Si no podés cumplir la consigna, poné el dinosaurio en el río.", imagen: "img/dado-no-trex.png" },
3: { titulo: "Lado cafetería (izquierda)", descripcion: "Poné el dinosaurio en el lado izquierdo del tablero, donde está la cafetería. Si no podés cumplir la consigna, poné el dinosaurio en el río.", imagen: "img/dado-cafe.png" },
            4: { titulo: "Bosque", descripcion: "Poné el dinosaurio en un lugar del bosque. Si no podés cumplir la consigna, poné el dinosaurio en el río.", imagen: "img/dado-bosque.png" },
            5: { titulo: "Rocas", descripcion: "Poné el dinosaurio en un lugar de rocas. Si no podés cumplir la consigna, poné el dinosaurio en el río.", imagen: "img/dado-rocas.png" },
            6: { titulo: "Lado baños (derecha)", descripcion: "Poné el dinosaurio en el lado derecho del tablero, donde están los baños. Si no podés cumplir la consigna, poné el dinosaurio en el río.", imagen: "img/dado-baños.png" }
        };

        const config = configuracionDados[dadoNumero];

        // Actualizar elementos del popup
        this.updatePopupContent(config);

        // Mostrar pantalla de resultado
        this.showScreen('dado-resultado');

        // Botón para continuar (si existe). Si no, fallback automático.
        const btn = document.getElementById('btn-dado-continuar');
        const continuar = () => {
            this.showScreen('partida');
            if (window.JuegoManager && typeof window.JuegoManager.procesarResultadoDado === 'function') {
                window.JuegoManager.procesarResultadoDado(this.dadoSeleccionado);
            }
        };
        if (btn) {
            btn.onclick = continuar;
        } else {
            setTimeout(continuar, 1200);
        }
    }

    updatePopupContent(config) {
        const dadoResultadoImg = document.getElementById('dado-resultado-img');
        const tituloDado = document.getElementById('titulo-dado');
        const descripcionDado = document.getElementById('descripcion-dado');

        if (dadoResultadoImg) dadoResultadoImg.src = config.imagen;
        if (tituloDado) tituloDado.textContent = config.titulo;
        if (descripcionDado) descripcionDado.textContent = config.descripcion;
    }

    // ==================== SISTEMA DE FORMULARIOS ==================== 
    setupFormValidation() {
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.clearFieldError(input);
                }
            });
        });
    }

    setupFormClickHandlers() {
        document.querySelectorAll('.form-group').forEach(group => {
            const input = group.querySelector('.form-input');
            const tipoJugadorSelector = group.querySelector('.tipo-jugador-selector');

            // Solo agregar funcionalidad de click si NO contiene radio buttons
            if (input && !input.hasAttribute('readonly') && !tipoJugadorSelector) {
                group.addEventListener('click', function (e) {
                    if (e.target !== input) {
                        input.focus();
                    }
                });
            }
        });

        // Manejar clicks en radio buttons específicamente
        document.querySelectorAll('.radio-option').forEach(option => {
            option.addEventListener('click', function (e) {
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
        // Focus states mejorados
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('.btn, .form-input, .btn-icon')) {
                e.target.classList.add('focus-visible');
            }
        });

        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('focus-visible');
        });

        // Soporte para motion reducido
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-base', '0ms');
            document.documentElement.style.setProperty('--transition-fast', '0ms');
        }
    }

    setupBirthdateField() {
        const fechaInput = document.querySelector('#register-fecha');
        if (!fechaInput) return;

        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');

        fechaInput.max = `${yyyy}-${mm}-${dd}`;

        // Fecha mínima (100 años atrás)
        const fechaMinima = new Date();
        fechaMinima.setFullYear(fechaMinima.getFullYear() - 100);
        const yyyyMin = fechaMinima.getFullYear();
        const mmMin = String(fechaMinima.getMonth() + 1).padStart(2, '0');
        const ddMin = String(fechaMinima.getDate()).padStart(2, '0');

        fechaInput.min = `${yyyyMin}-${mmMin}-${ddMin}`;
    }

    // ==================== MANEJO DE ERRORES ==================== 
    clearFormErrors(form) {
        form.querySelectorAll('.form-input').forEach(input => {
            this.clearFieldError(input);
        });
    }

    clearFieldError(input) {
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
    }

    showFieldError(form, selector, message) {
        const field = form.querySelector(selector);
        if (field) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            field.focus();
        }
        this.showToast(message, 'error');
    }

    // ==================== SISTEMA DE LOADING ==================== 
    setLoading(isLoading) {
        this.loading = isLoading;
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(btn => {
            if (isLoading) {
                btn.classList.add('btn--loading');
                btn.disabled = true;
            } else {
                btn.classList.remove('btn--loading');
                btn.disabled = false;
            }
        });
    }

    // ==================== SISTEMA DE TOASTS ==================== 
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = this.createToastElement(message, type);
        container.appendChild(toast);

        // Auto-hide después de 5 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                this.removeToast(toast);
            }
        }, 5000);
    }

    createToastElement(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type} fade-in`;
        toast.innerHTML = `
            <div class="toast__content">
                <span class="toast__message">${message}</span>
                <button class="toast__close" aria-label="Cerrar notificación">&times;</button>
            </div>
        `;

        // Event listener para cerrar
        toast.querySelector('.toast__close').addEventListener('click', () => {
            this.removeToast(toast);
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
    logout() {
        this.user = null;
        this.showScreen('login');
        this.showToast('Sesión cerrada', 'info');
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isFutureDate(dateString) {
        if (!dateString) return false;
        const hoy = new Date();
        const fechaNac = new Date(dateString);
        return fechaNac > new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    }

    isUnderAge(dateString, minAge) {
        if (!dateString) return false;
        const fechaMinima = new Date();
        fechaMinima.setFullYear(fechaMinima.getFullYear() - minAge);
        const fechaNac = new Date(dateString);
        return fechaNac > fechaMinima;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==================== INICIALIZACIÓN ==================== 
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppState();
});

// ==================== PWA FEATURES ==================== 
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}