// ===== ESCENARIOS PARA APRENDER CON IA - JAVASCRIPT =====

// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    TIMER_DURATION: 300, // 5 minutos en segundos
    GROUPS_TOTAL: 18,
    CONFETTI_COUNT: 100,
    ANIMATION_DURATION: 300,
    SCROLL_OFFSET: 100
};

// ===== ESTADO GLOBAL =====
const state = {
    timer: {
        duration: CONFIG.TIMER_DURATION,
        remaining: CONFIG.TIMER_DURATION,
        isRunning: false,
        interval: null
    },
    slots: {
        usedNumbers: new Set(),
        selectedGroups: []
    },
    progress: {
        completed: new Set(),
        percentage: 0
    },
    navigation: {
        currentSection: 'hero'
    }
};

// ===== UTILIDADES =====
const utils = {
    // Selector de elementos con validación
    $(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Elemento no encontrado: ${selector}`);
        }
        return element;
    },

    // Selector múltiple
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    // Formatear tiempo MM:SS
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // Generar número aleatorio
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Debounce para optimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para scroll
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Animación suave de números
    animateNumber(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
            element.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },

    // Función de easing
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    },

    // Guardar en localStorage
    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('No se pudo guardar en localStorage:', e);
        }
    },

    // Cargar de localStorage
    loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('No se pudo cargar de localStorage:', e);
            return defaultValue;
        }
    }
};

// ===== SISTEMA DE PROGRESO =====
const progressSystem = {
    init() {
        this.loadProgress();
        this.bindEvents();
        this.updateDisplay();
    },

    bindEvents() {
        const checkboxes = utils.$$('.progress-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxChange(e.target);
            });
        });
    },

    handleCheckboxChange(checkbox) {
        const section = checkbox.dataset.section;
        if (checkbox.checked) {
            state.progress.completed.add(section);
            this.animateCheckbox(checkbox);
        } else {
            state.progress.completed.delete(section);
        }
        this.updateProgress();
        this.saveProgress();
    },

    animateCheckbox(checkbox) {
        const label = checkbox.nextElementSibling;
        label.style.transform = 'scale(1.2)';
        setTimeout(() => {
            label.style.transform = 'scale(1)';
        }, 200);
    },

    updateProgress() {
        const total = utils.$$('.progress-checkbox').length;
        const completed = state.progress.completed.size;
        const percentage = Math.round((completed / total) * 100);
        
        state.progress.percentage = percentage;
        this.updateDisplay();
        
        if (percentage === 100) {
            this.celebrateCompletion();
        }
    },

    updateDisplay() {
        const progressFill = utils.$('#progressFill');
        const progressText = utils.$('#progressPercentage');
        
        if (progressFill) {
            progressFill.style.width = `${state.progress.percentage}%`;
        }
        
        if (progressText) {
            utils.animateNumber(progressText, 
                parseInt(progressText.textContent) || 0, 
                state.progress.percentage, 
                500
            );
        }
    },

    celebrateCompletion() {
        confettiSystem.burst();
        this.showCompletionMessage();
    },

    showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <div class="completion-content">
                <i class="fas fa-trophy"></i>
                <h3>¡Felicitaciones!</h3>
                <p>Has completado todos los momentos del encuentro</p>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('fade-in');
        }, 100);
        
        setTimeout(() => {
            message.remove();
        }, 4000);
    },

    saveProgress() {
        utils.saveToStorage('escenarios-ia-progress', Array.from(state.progress.completed));
    },

    loadProgress() {
        const saved = utils.loadFromStorage('escenarios-ia-progress', []);
        state.progress.completed = new Set(saved);
        
        // Aplicar estado guardado a los checkboxes
        saved.forEach(section => {
            const checkbox = utils.$(`#check-${section}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }
};

// ===== SISTEMA DE TRAGAMONEDAS =====
const slotMachine = {
    init() {
        this.bindEvents();
        this.loadState();
    },

    bindEvents() {
        const spin1Btn = utils.$('#spin1');
        const spin2Btn = utils.$('#spin2');
        
        if (spin1Btn) {
            spin1Btn.addEventListener('click', () => this.spin(1));
        }
        
        if (spin2Btn) {
            spin2Btn.addEventListener('click', () => this.spin(2));
        }
    },

    async spin(slotNumber) {
        const slotDisplay = utils.$(`#slot${slotNumber}`);
        const button = utils.$(`#spin${slotNumber}`);
        
        if (!slotDisplay || !button) return;
        
        // Deshabilitar botón durante animación
        button.disabled = true;
        slotDisplay.classList.add('spinning');
        
        // Animación de giro
        await this.animateSpin(slotDisplay);
        
        // Seleccionar número
        const number = this.selectRandomNumber();
        const numberElement = slotDisplay.querySelector('.slot-number');
        
        if (numberElement) {
            numberElement.textContent = number;
        }
        
        // Actualizar estado
        this.updateSelectedGroups(slotNumber, number);
        
        // Limpiar animación
        slotDisplay.classList.remove('spinning');
        button.disabled = false;
        
        this.saveState();
    },

    async animateSpin(slotDisplay) {
        return new Promise(resolve => {
            let spins = 0;
            const maxSpins = 20;
            const numberElement = slotDisplay.querySelector('.slot-number');
            
            const spinInterval = setInterval(() => {
                if (numberElement) {
                    numberElement.textContent = utils.randomInt(1, CONFIG.GROUPS_TOTAL);
                }
                spins++;
                
                if (spins >= maxSpins) {
                    clearInterval(spinInterval);
                    resolve();
                }
            }, 50);
        });
    },

    selectRandomNumber() {
        const availableNumbers = [];
        for (let i = 1; i <= CONFIG.GROUPS_TOTAL; i++) {
            if (!state.slots.usedNumbers.has(i)) {
                availableNumbers.push(i);
            }
        }
        
        if (availableNumbers.length === 0) {
            // Reiniciar si no hay números disponibles
            state.slots.usedNumbers.clear();
            state.slots.selectedGroups = [];
            this.updateGroupsList();
            return utils.randomInt(1, CONFIG.GROUPS_TOTAL);
        }
        
        const selectedNumber = availableNumbers[utils.randomInt(0, availableNumbers.length - 1)];
        state.slots.usedNumbers.add(selectedNumber);
        return selectedNumber;
    },

    updateSelectedGroups(slotNumber, number) {
        // Buscar si hay un grupo incompleto
        let incompleteGroup = state.slots.selectedGroups.find(group => group.length === 1);
        
        if (incompleteGroup) {
            incompleteGroup.push(number);
        } else {
            state.slots.selectedGroups.push([number]);
        }
        
        this.updateGroupsList();
    },

    updateGroupsList() {
        const groupsList = utils.$('#groupsList');
        if (!groupsList) return;
        
        if (state.slots.selectedGroups.length === 0) {
            groupsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-dice"></i>
                    <p>Gira los sectores para seleccionar grupos</p>
                </div>
            `;
            return;
        }
        
        const groupsHTML = state.slots.selectedGroups.map((group, index) => {
            if (group.length === 1) {
                return `
                    <div class="group-item">
                        <i class="fas fa-user"></i>
                        <span>Grupo ${group[0]} (esperando pareja)</span>
                    </div>
                `;
            } else {
                return `
                    <div class="group-item">
                        <i class="fas fa-users"></i>
                        <span>Grupo ${group[0]} - Grupo ${group[1]}</span>
                    </div>
                `;
            }
        }).join('');
        
        groupsList.innerHTML = groupsHTML;
    },

    saveState() {
        utils.saveToStorage('escenarios-ia-slots', {
            usedNumbers: Array.from(state.slots.usedNumbers),
            selectedGroups: state.slots.selectedGroups
        });
    },

    loadState() {
        const saved = utils.loadFromStorage('escenarios-ia-slots', {
            usedNumbers: [],
            selectedGroups: []
        });
        
        state.slots.usedNumbers = new Set(saved.usedNumbers);
        state.slots.selectedGroups = saved.selectedGroups;
        this.updateGroupsList();
    }
};

// ===== SISTEMA DE CRONÓMETRO =====
const timerSystem = {
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.loadState();
    },

    bindEvents() {
        const startBtn = utils.$('#startTimer');
        const pauseBtn = utils.$('#pauseTimer');
        const resetBtn = utils.$('#resetTimer');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pause());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    },

    start() {
        if (state.timer.isRunning) return;
        
        state.timer.isRunning = true;
        state.timer.interval = setInterval(() => {
            this.tick();
        }, 1000);
        
        this.updateButtons();
    },

    pause() {
        if (!state.timer.isRunning) return;
        
        state.timer.isRunning = false;
        clearInterval(state.timer.interval);
        this.updateButtons();
    },

    reset() {
        this.pause();
        state.timer.remaining = state.timer.duration;
        this.updateDisplay();
        this.updateButtons();
        this.saveState();
    },

    tick() {
        if (state.timer.remaining > 0) {
            state.timer.remaining--;
            this.updateDisplay();
            this.saveState();
            
            // Cambiar color según tiempo restante
            this.updateTimerColor();
            
            if (state.timer.remaining === 0) {
                this.onTimeUp();
            }
        }
    },

    updateDisplay() {
        const display = utils.$('#timerDisplay');
        const progress = utils.$('#timerProgress');
        
        if (display) {
            display.textContent = utils.formatTime(state.timer.remaining);
        }
        
        if (progress) {
            const percentage = (state.timer.remaining / state.timer.duration) * 100;
            const circumference = 2 * Math.PI * 45; // radio = 45
            const offset = circumference - (percentage / 100) * circumference;
            progress.style.strokeDashoffset = offset;
        }
    },

    updateTimerColor() {
        const display = utils.$('#timerDisplay');
        const progress = utils.$('#timerProgress');
        
        if (!display || !progress) return;
        
        const percentage = (state.timer.remaining / state.timer.duration) * 100;
        
        if (percentage <= 20) {
            display.style.color = '#C73E1D';
            progress.style.stroke = '#C73E1D';
        } else if (percentage <= 50) {
            display.style.color = '#F18F01';
            progress.style.stroke = '#F18F01';
        } else {
            display.style.color = '#A23B72';
            progress.style.stroke = '#A23B72';
        }
    },

    updateButtons() {
        const startBtn = utils.$('#startTimer');
        const pauseBtn = utils.$('#pauseTimer');
        const resetBtn = utils.$('#resetTimer');
        
        if (startBtn) {
            startBtn.disabled = state.timer.isRunning || state.timer.remaining === 0;
        }
        
        if (pauseBtn) {
            pauseBtn.disabled = !state.timer.isRunning;
        }
        
        if (resetBtn) {
            resetBtn.disabled = state.timer.remaining === state.timer.duration && !state.timer.isRunning;
        }
    },

    onTimeUp() {
        this.pause();
        confettiSystem.burst();
        this.showTimeUpMessage();
        
        // Reproducir sonido (si está disponible)
        this.playNotificationSound();
    },

    showTimeUpMessage() {
        const message = document.createElement('div');
        message.className = 'timer-message';
        message.innerHTML = `
            <div class="timer-message-content">
                <i class="fas fa-clock"></i>
                <h3>¡Tiempo terminado!</h3>
                <p>Los 5 minutos de presentación han finalizado</p>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('fade-in');
        }, 100);
        
        setTimeout(() => {
            message.remove();
        }, 4000);
    },

    playNotificationSound() {
        // Crear un beep simple usando Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio no disponible');
        }
    },

    saveState() {
        utils.saveToStorage('escenarios-ia-timer', {
            remaining: state.timer.remaining,
            isRunning: state.timer.isRunning
        });
    },

    loadState() {
        const saved = utils.loadFromStorage('escenarios-ia-timer', {
            remaining: CONFIG.TIMER_DURATION,
            isRunning: false
        });
        
        state.timer.remaining = saved.remaining;
        state.timer.isRunning = false; // Nunca cargar como running
        this.updateDisplay();
        this.updateButtons();
    }
};

// ===== SISTEMA DE CONFETIS =====
const confettiSystem = {
    burst() {
        const container = utils.$('#confetti-container');
        if (!container) return;
        
        for (let i = 0; i < CONFIG.CONFETTI_COUNT; i++) {
            this.createConfetti(container);
        }
    },

    createConfetti(container) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Colores aleatorios
        const colors = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#4A90E2', '#D63384'];
        confetti.style.backgroundColor = colors[utils.randomInt(0, colors.length - 1)];
        
        // Posición aleatoria
        confetti.style.left = utils.randomInt(0, 100) + '%';
        confetti.style.animationDelay = utils.randomInt(0, 1000) + 'ms';
        confetti.style.animationDuration = utils.randomInt(2000, 4000) + 'ms';
        
        // Forma aleatoria
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        container.appendChild(confetti);
        
        // Limpiar después de la animación
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
};

// ===== SISTEMA DE NAVEGACIÓN =====
const navigationSystem = {
    init() {
        this.bindEvents();
        this.updateActiveSection();
    },

    bindEvents() {
        // Enlaces de navegación
        const navLinks = utils.$$('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Toggle móvil
        const navToggle = utils.$('#nav-toggle');
        const navMenu = utils.$('#nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Scroll para actualizar navegación activa
        window.addEventListener('scroll', utils.throttle(() => {
            this.updateActiveSection();
        }, 100));

        // Botón back to top
        const backToTop = utils.$('#backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                this.scrollToSection('hero');
            });
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });
        }
    },

    scrollToSection(sectionId) {
        const section = utils.$(`#${sectionId}`);
        if (!section) return;
        
        const navbar = utils.$('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = section.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Cerrar menú móvil si está abierto
        const navMenu = utils.$('#nav-menu');
        const navToggle = utils.$('#nav-toggle');
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    },

    updateActiveSection() {
        const sections = utils.$$('section[id]');
        const navLinks = utils.$$('.nav-link');
        const navbar = utils.$('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        
        let currentSection = 'hero';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= navbarHeight + 50 && rect.bottom >= navbarHeight + 50) {
                currentSection = section.id;
            }
        });
        
        // Actualizar enlaces activos
        navLinks.forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            if (targetId === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        state.navigation.currentSection = currentSection;
    }
};

// ===== SISTEMA DE ANIMACIONES =====
const animationSystem = {
    init() {
        this.setupIntersectionObserver();
        this.bindHoverEffects();
    },

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, options);
        
        // Observar elementos animables
        const animatableElements = utils.$$('.section, .card, .timeline-item, .dialogue-card, .scenario-card');
        animatableElements.forEach(el => {
            observer.observe(el);
        });
    },

    bindHoverEffects() {
        // Efectos hover para tarjetas
        const cards = utils.$$('.info-card, .resource-card, .scenario-card, .dialogue-card, .referent-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
        
        // Efectos para botones
        const buttons = utils.$$('.btn, .slot-button, .timer-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.disabled) {
                    button.style.transform = 'translateY(-2px)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }
};

// ===== SISTEMA DE LOADING =====
const loadingSystem = {
    init() {
        this.showLoading();
        this.preloadResources();
    },

    showLoading() {
        const loadingScreen = utils.$('#loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    },

    hideLoading() {
        const loadingScreen = utils.$('#loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    },

    async preloadResources() {
        // Simular carga de recursos
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Precargar imágenes críticas
        const images = [
            'images/escuela-atenas.jpg'
        ];
        
        const imagePromises = images.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve; // Continuar aunque falle
                img.src = src;
            });
        });
        
        await Promise.all(imagePromises);
        this.hideLoading();
    }
};

// ===== SISTEMA DE DIÁLOGOS INTERACTIVOS =====
const dialogueSystem = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        const dialogueCards = utils.$$('.dialogue-card');
        dialogueCards.forEach(card => {
            card.addEventListener('click', () => {
                this.showDialogueDetail(card);
            });
        });
    },

    showDialogueDetail(card) {
        const dialogueNumber = card.dataset.dialogue;
        const title = card.querySelector('h4').textContent;
        const description = card.querySelector('p').textContent;
        
        const modal = document.createElement('div');
        modal.className = 'dialogue-modal';
        modal.innerHTML = `
            <div class="dialogue-modal-content">
                <div class="dialogue-modal-header">
                    <h3>${title}</h3>
                    <button class="dialogue-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="dialogue-modal-body">
                    <p>${description}</p>
                    <div class="dialogue-reflection">
                        <h4>Reflexión</h4>
                        <p>¿Cómo has experimentado este diálogo en tu trayecto de aprendizaje con IA?</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Eventos del modal
        const closeBtn = modal.querySelector('.dialogue-modal-close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Animación de entrada
        setTimeout(() => {
            modal.classList.add('fade-in');
        }, 10);
    }
};

// ===== INICIALIZACIÓN PRINCIPAL =====
class EscenariosIA {
    constructor() {
        this.init();
    }

    async init() {
        console.log('🚀 Iniciando Escenarios para aprender con IA...');
        
        // Verificar soporte del navegador
        this.checkBrowserSupport();
        
        // Inicializar sistemas
        loadingSystem.init();
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeSystems();
            });
        } else {
            this.initializeSystems();
        }
    }

    initializeSystems() {
        try {
            progressSystem.init();
            slotMachine.init();
            timerSystem.init();
            navigationSystem.init();
            animationSystem.init();
            dialogueSystem.init();
            
            console.log('✅ Todos los sistemas inicializados correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar sistemas:', error);
        }
    }

    checkBrowserSupport() {
        const features = {
            localStorage: typeof Storage !== 'undefined',
            intersectionObserver: 'IntersectionObserver' in window,
            customProperties: CSS.supports('color', 'var(--test)'),
            flexbox: CSS.supports('display', 'flex'),
            grid: CSS.supports('display', 'grid')
        };
        
        const unsupported = Object.entries(features)
            .filter(([feature, supported]) => !supported)
            .map(([feature]) => feature);
        
        if (unsupported.length > 0) {
            console.warn('⚠️ Características no soportadas:', unsupported);
        }
    }
}

// ===== ESTILOS DINÁMICOS PARA MODALES =====
const dynamicStyles = `
    .completion-message,
    .timer-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        text-align: center;
        opacity: 0;
        transition: opacity 0.3s ease-out;
    }
    
    .completion-message.fade-in,
    .timer-message.fade-in {
        opacity: 1;
    }
    
    .completion-content i,
    .timer-message-content i {
        font-size: 3rem;
        color: #F18F01;
        margin-bottom: 1rem;
    }
    
    .completion-content h3,
    .timer-message-content h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    
    .completion-content p,
    .timer-message-content p {
        color: #6b7280;
        font-size: 1rem;
    }
    
    .dialogue-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease-out;
    }
    
    .dialogue-modal.fade-in {
        opacity: 1;
    }
    
    .dialogue-modal-content {
        background: white;
        border-radius: 1rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .dialogue-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .dialogue-modal-header h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1f2937;
    }
    
    .dialogue-modal-close {
        background: none;
        border: none;
        font-size: 1.25rem;
        color: #6b7280;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: background-color 0.2s;
    }
    
    .dialogue-modal-close:hover {
        background: #f3f4f6;
    }
    
    .dialogue-modal-body {
        padding: 1.5rem;
    }
    
    .dialogue-reflection {
        margin-top: 1.5rem;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 0.5rem;
        border-left: 4px solid #F18F01;
    }
    
    .dialogue-reflection h4 {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    
    .dialogue-reflection p {
        color: #6b7280;
        font-style: italic;
    }
`;

// Inyectar estilos dinámicos
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// ===== INICIALIZAR APLICACIÓN =====
const app = new EscenariosIA();

// ===== EXPORTAR PARA DEBUGGING =====
if (typeof window !== 'undefined') {
    window.EscenariosIA = {
        app,
        state,
        utils,
        progressSystem,
        slotMachine,
        timerSystem,
        confettiSystem,
        navigationSystem
    };
}

