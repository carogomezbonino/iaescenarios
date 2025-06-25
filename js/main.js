// ===== VARIABLES GLOBALES =====
let currentProgress = 0;
let timerInterval;
let timeLeft = 300; // 5 minutos en segundos
let isTimerRunning = false;
let usedNumbers = [];
let selectedGroups = { sector1: null, sector2: null };

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeProgress();
    initializeCasinoLights();
    loadProgress();
    updateTimerDisplay();
});

// ===== NAVEGACIÓN ACTIVA =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero-section');
    
    // Observador de intersección para navegación activa
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveNavLink(sectionId);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
    
    // Scroll suave para enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.sticky-nav').offsetHeight;
        const sectionTop = section.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// ===== SISTEMA DE PROGRESO =====
function initializeProgress() {
    updateProgressDisplay();
}

function updateProgress() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    currentProgress = Math.round((checkedBoxes.length / checkboxes.length) * 100);
    updateProgressDisplay();
    saveProgress();
    
    // Animación de confetis si se completa todo
    if (currentProgress === 100) {
        showConfetti();
        showNotification('¡Felicitaciones! Has completado todo el recorrido 🎉');
    }
}

function updateProgressDisplay() {
    const progressText = document.querySelector('.progress-text');
    const progressFill = document.querySelector('.progress-fill');
    
    if (progressText) progressText.textContent = `${currentProgress}% completado`;
    if (progressFill) progressFill.style.width = `${currentProgress}%`;
}

function saveProgress() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const progressData = {};
    
    checkboxes.forEach(checkbox => {
        progressData[checkbox.id] = checkbox.checked;
    });
    
    localStorage.setItem('escenarios-ia-progress', JSON.stringify(progressData));
}

function loadProgress() {
    const savedProgress = localStorage.getItem('escenarios-ia-progress');
    if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        
        Object.keys(progressData).forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                checkbox.checked = progressData[checkboxId];
            }
        });
        
        updateProgress();
    }
}

// ===== TRAGAMONEDAS =====
function initializeCasinoLights() {
    // Las luces ya están animadas con CSS
}

function spinSector(sectorNumber) {
    const sectorDisplay = document.getElementById(`sector${sectorNumber}`);
    const button = sectorDisplay.nextElementSibling;
    const replaceButton = button.nextElementSibling;
    
    // Deshabilitar botón durante la animación
    button.disabled = true;
    sectorDisplay.classList.add('spinning');
    
    // Simular animación de giro
    let spinCount = 0;
    const spinInterval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 18) + 1;
        sectorDisplay.textContent = randomNum;
        spinCount++;
        
        if (spinCount > 10) {
            clearInterval(spinInterval);
            
            // Seleccionar número final
            const finalNumber = getAvailableNumber();
            sectorDisplay.textContent = finalNumber;
            sectorDisplay.classList.remove('spinning');
            
            // Guardar selección
            selectedGroups[`sector${sectorNumber}`] = finalNumber;
            usedNumbers.push(finalNumber);
            
            // Habilitar botón de reemplazo
            button.style.display = 'none';
            replaceButton.style.display = 'inline-block';
            
            // Mostrar notificación
            showNotification(`¡Grupo ${finalNumber} seleccionado!`);
            
            // Si ambos sectores están completos, mostrar resultado
            if (selectedGroups.sector1 && selectedGroups.sector2) {
                showNotification(`¡Pareja formada: Grupo ${selectedGroups.sector1} VS Grupo ${selectedGroups.sector2}!`);
            }
        }
    }, 100);
}

function replaceSector(sectorNumber) {
    const sectorDisplay = document.getElementById(`sector${sectorNumber}`);
    const button = sectorDisplay.nextElementSibling;
    const replaceButton = button.nextElementSibling;
    
    // Liberar el número actual
    const currentNumber = selectedGroups[`sector${sectorNumber}`];
    if (currentNumber) {
        const index = usedNumbers.indexOf(currentNumber);
        if (index > -1) {
            usedNumbers.splice(index, 1);
        }
    }
    
    // Resetear sector
    selectedGroups[`sector${sectorNumber}`] = null;
    sectorDisplay.textContent = '?';
    
    // Cambiar botones
    button.style.display = 'inline-block';
    replaceButton.style.display = 'none';
    button.disabled = false;
    
    showNotification(`Sector ${sectorNumber} reseteado. ¡Puedes girar nuevamente!`);
}

function getAvailableNumber() {
    const availableNumbers = [];
    for (let i = 1; i <= 18; i++) {
        if (!usedNumbers.includes(i)) {
            availableNumbers.push(i);
        }
    }
    
    if (availableNumbers.length === 0) {
        // Si no hay números disponibles, resetear
        usedNumbers = [];
        for (let i = 1; i <= 18; i++) {
            availableNumbers.push(i);
        }
    }
    
    return availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
}

// ===== CRONÓMETRO =====
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    document.getElementById('timer-minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('timer-seconds').textContent = seconds.toString().padStart(2, '0');
    
    // Actualizar progreso circular
    const progress = ((300 - timeLeft) / 300) * 360;
    const timerCircle = document.querySelector('.timer-circle');
    if (timerCircle) {
        timerCircle.style.background = `conic-gradient(var(--azul-educativo) ${progress}deg, #e0e0e0 ${progress}deg)`;
    }
    
    // Cambiar color cuando queda poco tiempo
    if (timeLeft <= 60) {
        timerCircle.style.background = `conic-gradient(var(--rojo-educativo) ${progress}deg, #e0e0e0 ${progress}deg)`;
    } else if (timeLeft <= 120) {
        timerCircle.style.background = `conic-gradient(var(--naranja-energetico) ${progress}deg, #e0e0e0 ${progress}deg)`;
    }
}

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                showConfetti();
                showNotification('¡Tiempo terminado! 🎉');
                timeLeft = 300; // Reset para próximo uso
                updateTimerDisplay();
            }
        }, 1000);
        
        showNotification('¡Cronómetro iniciado!');
    }
}

function pauseTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        showNotification('Cronómetro pausado');
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeLeft = 300;
    updateTimerDisplay();
    showNotification('Cronómetro reiniciado');
}

// ===== MODALES TPACK =====
function openTPACKModal(type) {
    const modal = document.getElementById('tpack-modal');
    const content = document.getElementById('tpack-modal-content');
    
    const tpackContent = {
        technology: {
            title: 'Conocimiento Tecnológico (TK)',
            description: 'Comprensión de las tecnologías digitales, incluyendo IA, y cómo pueden ser utilizadas en contextos educativos.',
            examples: ['Herramientas de IA generativa', 'Plataformas educativas', 'Software especializado', 'Dispositivos digitales']
        },
        pedagogy: {
            title: 'Conocimiento Pedagógico (PK)',
            description: 'Comprensión profunda de los procesos y métodos de enseñanza y aprendizaje.',
            examples: ['Metodologías activas', 'Evaluación formativa', 'Gestión del aula', 'Teorías del aprendizaje']
        },
        content: {
            title: 'Conocimiento del Contenido (CK)',
            description: 'Dominio de la materia o disciplina que se enseña.',
            examples: ['Conceptos disciplinares', 'Estructura del conocimiento', 'Métodos de investigación', 'Actualización científica']
        },
        tpk: {
            title: 'Conocimiento Tecno-Pedagógico (TPK)',
            description: 'Comprensión de cómo la tecnología puede facilitar enfoques pedagógicos específicos.',
            examples: ['Gamificación digital', 'Aprendizaje colaborativo online', 'Evaluación automatizada', 'Personalización con IA']
        },
        tck: {
            title: 'Conocimiento Tecno-Disciplinar (TCK)',
            description: 'Comprensión de cómo la tecnología puede transformar el contenido disciplinar.',
            examples: ['Simulaciones científicas', 'Modelado matemático', 'Análisis de datos', 'Visualizaciones interactivas']
        },
        pck: {
            title: 'Conocimiento Pedagógico del Contenido (PCK)',
            description: 'Comprensión de cómo enseñar contenidos específicos de manera efectiva.',
            examples: ['Analogías disciplinares', 'Errores conceptuales comunes', 'Secuencias didácticas', 'Representaciones múltiples']
        },
        tpack: {
            title: 'TPACK + IA',
            description: 'Integración equilibrada de tecnología (incluyendo IA), pedagogía y contenido para crear experiencias de aprendizaje transformadoras.',
            examples: ['Diseño de actividades con IA', 'Evaluación inteligente', 'Tutorías personalizadas', 'Análisis predictivo del aprendizaje']
        }
    };
    
    const data = tpackContent[type];
    content.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.description}</p>
        <h3>Ejemplos:</h3>
        <ul>
            ${data.examples.map(example => `<li>${example}</li>`).join('')}
        </ul>
    `;
    
    modal.style.display = 'block';
}

// ===== MODALES DIÁLOGOS =====
function openDialogueModal(type) {
    const modal = document.getElementById('dialogue-modal');
    const content = document.getElementById('dialogue-modal-content');
    
    const dialogueContent = {
        continuum: {
            title: 'IA como continuum',
            description: 'La inteligencia artificial no es una tecnología binaria, sino un espectro continuo de capacidades que van desde herramientas simples hasta sistemas complejos.',
            details: 'Comprender la IA como un continuum nos ayuda a ubicar cada herramienta en su contexto apropiado y a tomar decisiones informadas sobre su uso educativo.'
        },
        generative: {
            title: 'Diálogos generativos con la IA',
            description: 'Las interacciones con sistemas de IA pueden ser creativas y productivas cuando se establecen como diálogos reflexivos.',
            details: 'El arte está en formular preguntas precisas, iterar sobre las respuestas y mantener una postura crítica ante los resultados generados.'
        },
        teachers: {
            title: 'Diálogos entre docentes',
            description: 'El intercambio de experiencias entre educadores es fundamental para construir conocimiento colectivo sobre el uso de IA.',
            details: 'Compartir casos, reflexiones y desafíos nos permite aprender unos de otros y construir mejores prácticas pedagógicas.'
        },
        self: {
            title: 'Diálogo con nosotros mismos',
            description: 'La reflexión personal sobre nuestras prácticas, creencias y resistencias es esencial en el proceso de integración de IA.',
            details: 'Cuestionar nuestros supuestos y estar abiertos al cambio nos permite crecer como educadores en la era digital.'
        },
        networks: {
            title: 'Diálogos en redes',
            description: 'La participación en comunidades de práctica y espacios virtuales amplía nuestras perspectivas sobre la IA educativa.',
            details: 'Las redes nos conectan con experiencias globales y nos permiten contribuir al conocimiento colectivo sobre educación e IA.'
        }
    };
    
    const data = dialogueContent[type];
    content.innerHTML = `
        <h2>${data.title}</h2>
        <p><strong>${data.description}</strong></p>
        <p>${data.details}</p>
    `;
    
    modal.style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const tpackModal = document.getElementById('tpack-modal');
    const dialogueModal = document.getElementById('dialogue-modal');
    
    if (event.target === tpackModal) {
        tpackModal.style.display = 'none';
    }
    if (event.target === dialogueModal) {
        dialogueModal.style.display = 'none';
    }
}

// ===== CONFETIS =====
function showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#FFD700'];
    
    // Crear confetis
    for (let i = 0; i < 100; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }
    
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = confetti.length - 1; i >= 0; i--) {
            const c = confetti[i];
            
            // Actualizar posición
            c.x += c.vx;
            c.y += c.vy;
            c.rotation += c.rotationSpeed;
            
            // Dibujar confeti
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation * Math.PI / 180);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size);
            ctx.restore();
            
            // Remover confetis que salen de pantalla
            if (c.y > canvas.height + 10) {
                confetti.splice(i, 1);
            }
        }
        
        if (confetti.length > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animateConfetti();
}

// ===== NOTIFICACIONES =====
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--azul-educativo);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== UTILIDADES =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Redimensionar canvas de confetis al cambiar tamaño de ventana
window.addEventListener('resize', debounce(() => {
    const canvas = document.getElementById('confetti-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}, 250));

