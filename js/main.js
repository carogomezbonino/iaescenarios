// ===== ESCENARIOS PARA APRENDER CON IA - JAVASCRIPT =====

// Variables globales
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
    const lights = document.querySelectorAll('.light');
    lights.forEach((light, index) => {
        setTimeout(() => {
            light.style.animationDelay = `${index * 0.2}s`;
        }, 100);
    });
}

function spinSector(sectorNumber) {
    const sector = document.getElementById(`sector${sectorNumber}`);
    const button = document.getElementById(`spin${sectorNumber}`);
    
    if (!sector || !button) return;
    
    // Deshabilitar botón durante la animación
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Girando...';
    
    // Animación de giro
    sector.classList.add('spinning');
    
    setTimeout(() => {
        const availableNumbers = [];
        for (let i = 1; i <= 18; i++) {
            if (!usedNumbers.includes(i)) {
                availableNumbers.push(i);
            }
        }
        
        if (availableNumbers.length === 0) {
            showNotification('¡Todos los grupos han sido seleccionados!');
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-play"></i> Girar Sector ${sectorNumber}`;
            sector.classList.remove('spinning');
            return;
        }
        
        const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        usedNumbers.push(randomNumber);
        selectedGroups[`sector${sectorNumber}`] = randomNumber;
        
        // Actualizar display
        sector.querySelector('.slot-number').textContent = randomNumber;
        sector.classList.remove('spinning');
        
        // Restaurar botón
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-play"></i> Girar Sector ${sectorNumber}`;
        
        updateGroupsList();
        
        // Mostrar notificación
        if (selectedGroups.sector1 && selectedGroups.sector2) {
            showNotification(`¡Pareja formada: Grupo ${selectedGroups.sector1} - Grupo ${selectedGroups.sector2}!`);
            showReplaceButtons();
        }
        
    }, 2000);
}

function replaceGroup(sectorNumber) {
    const currentGroup = selectedGroups[`sector${sectorNumber}`];
    
    // Devolver el número actual a la lista disponible
    if (currentGroup) {
        const index = usedNumbers.indexOf(currentGroup);
        if (index > -1) {
            usedNumbers.splice(index, 1);
        }
    }
    
    // Girar nuevamente el sector
    spinSector(sectorNumber);
}

function updateGroupsList() {
    const groupsList = document.getElementById('groupsList');
    
    if (selectedGroups.sector1 && selectedGroups.sector2) {
        groupsList.innerHTML = `
            <div class="group-pair">
                <i class="fas fa-users"></i>
                <span>Grupo ${selectedGroups.sector1} - Grupo ${selectedGroups.sector2}</span>
            </div>
        `;
    } else if (selectedGroups.sector1 || selectedGroups.sector2) {
        const selectedGroup = selectedGroups.sector1 || selectedGroups.sector2;
        groupsList.innerHTML = `
            <div class="group-single">
                <i class="fas fa-user"></i>
                <span>Grupo ${selectedGroup}</span>
                <small>Gira el otro sector para completar la pareja</small>
            </div>
        `;
    } else {
        groupsList.innerHTML = `
            <div class="no-groups">
                <i class="fas fa-dice"></i>
                <span>¡Gira los sectores para seleccionar grupos!</span>
            </div>
        `;
    }
}

function showReplaceButtons() {
    const replaceButtons = document.getElementById('replaceButtons');
    if (replaceButtons) {
        replaceButtons.style.display = 'block';
        
        // Actualizar textos de los botones
        document.getElementById('replace1').innerHTML = `
            <i class="fas fa-sync-alt"></i>
            Reemplazar Grupo ${selectedGroups.sector1}
        `;
        document.getElementById('replace2').innerHTML = `
            <i class="fas fa-sync-alt"></i>
            Reemplazar Grupo ${selectedGroups.sector2}
        `;
    }
}

// ===== CRONÓMETRO =====
function startTimer() {
    const startBtn = document.getElementById('startBtn');
    
    if (!isTimerRunning) {
        isTimerRunning = true;
        startBtn.innerHTML = '<i class="fas fa-pause"></i>';
        startBtn.classList.remove('start');
        startBtn.classList.add('pause');
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                finishTimer();
            }
        }, 1000);
    } else {
        pauseTimer();
    }
}

function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    
    const startBtn = document.getElementById('startBtn');
    startBtn.innerHTML = '<i class="fas fa-play"></i>';
    startBtn.classList.remove('pause');
    startBtn.classList.add('start');
}

function resetTimer() {
    pauseTimer();
    timeLeft = 300;
    updateTimerDisplay();
    
    const timerCircle = document.getElementById('timerCircle');
    if (timerCircle) {
        timerCircle.style.strokeDashoffset = '283';
        timerCircle.classList.remove('warning', 'danger');
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = display;
    }
    
    // Actualizar círculo de progreso
    const timerCircle = document.getElementById('timerCircle');
    if (timerCircle) {
        const progress = (300 - timeLeft) / 300;
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (progress * circumference);
        
        timerCircle.style.strokeDashoffset = offset;
        
        // Cambiar colores según el tiempo restante
        if (timeLeft <= 60) {
            timerCircle.classList.add('danger');
        } else if (timeLeft <= 120) {
            timerCircle.classList.add('warning');
        }
    }
}

function finishTimer() {
    pauseTimer();
    showConfetti();
    showNotification('¡Tiempo terminado! 🎉');
    
    // Resetear para la siguiente ronda
    setTimeout(() => {
        resetTimer();
    }, 3000);
}

// ===== MODALES TPACK =====
function showTPACKModal(type) {
    const modal = document.getElementById('tpackModal');
    const modalContent = document.getElementById('modalContent');
    
    const tpackContent = {
        technology: {
            title: 'Conocimiento Tecnológico (TK)',
            content: `
                <h3>Tecnología</h3>
                <p>Comprende el conocimiento sobre diversas tecnologías, desde las más básicas hasta las más avanzadas, incluyendo:</p>
                <ul>
                    <li>Herramientas digitales y software educativo</li>
                    <li>Plataformas de aprendizaje virtual</li>
                    <li>Inteligencia artificial y sus aplicaciones</li>
                    <li>Dispositivos y hardware educativo</li>
                </ul>
                <p><strong>En el contexto de IA:</strong> Conocimiento sobre chatbots, generadores de contenido, sistemas de tutoría inteligente, etc.</p>
            `
        },
        pedagogy: {
            title: 'Conocimiento Pedagógico (PK)',
            content: `
                <h3>Pedagogía</h3>
                <p>Incluye el conocimiento profundo sobre procesos y prácticas de enseñanza y aprendizaje:</p>
                <ul>
                    <li>Teorías del aprendizaje</li>
                    <li>Métodos de enseñanza</li>
                    <li>Evaluación y retroalimentación</li>
                    <li>Gestión del aula y motivación</li>
                </ul>
                <p><strong>Con IA:</strong> Cómo integrar la IA para personalizar el aprendizaje, fomentar la creatividad y desarrollar pensamiento crítico.</p>
            `
        },
        content: {
            title: 'Conocimiento del Contenido (CK)',
            content: `
                <h3>Contenido</h3>
                <p>Se refiere al conocimiento sobre la materia que se va a enseñar:</p>
                <ul>
                    <li>Conceptos fundamentales de la disciplina</li>
                    <li>Estructura y organización del conocimiento</li>
                    <li>Metodologías específicas del área</li>
                    <li>Actualización disciplinar constante</li>
                </ul>
                <p><strong>En la era de IA:</strong> Cómo la IA está transformando cada disciplina y qué nuevos contenidos emergen.</p>
            `
        },
        tpk: {
            title: 'Conocimiento Tecno-Pedagógico (TPK)',
            content: `
                <h3>Intersección Tecnología-Pedagogía</h3>
                <p>Comprende cómo la tecnología puede cambiar la enseñanza:</p>
                <ul>
                    <li>Selección de tecnologías apropiadas para objetivos pedagógicos</li>
                    <li>Adaptación de métodos de enseñanza con tecnología</li>
                    <li>Comprensión de affordances y limitaciones tecnológicas</li>
                </ul>
                <p><strong>Con IA:</strong> Saber cuándo y cómo usar IA para mejorar la enseñanza sin perder el enfoque pedagógico.</p>
            `
        },
        tck: {
            title: 'Conocimiento Tecno-Disciplinar (TCK)',
            content: `
                <h3>Intersección Tecnología-Contenido</h3>
                <p>Conocimiento sobre cómo la tecnología puede crear nuevas representaciones del contenido:</p>
                <ul>
                    <li>Herramientas específicas para la disciplina</li>
                    <li>Nuevas formas de representar conceptos</li>
                    <li>Simulaciones y modelado digital</li>
                </ul>
                <p><strong>Con IA:</strong> Cómo la IA puede generar, analizar o transformar contenido disciplinar específico.</p>
            `
        },
        pck: {
            title: 'Conocimiento Pedagógico del Contenido (PCK)',
            content: `
                <h3>Intersección Pedagogía-Contenido</h3>
                <p>Conocimiento sobre cómo enseñar contenido específico:</p>
                <ul>
                    <li>Estrategias de enseñanza específicas para la materia</li>
                    <li>Conocimiento de dificultades de aprendizaje típicas</li>
                    <li>Representaciones y analogías efectivas</li>
                </ul>
                <p><strong>Con IA:</strong> Cómo usar IA para identificar dificultades de aprendizaje y personalizar la enseñanza del contenido.</p>
            `
        },
        tpack: {
            title: 'TPACK + IA',
            content: `
                <h3>Integración Completa: TPACK + IA</h3>
                <p>La intersección de los tres conocimientos con IA representa:</p>
                <ul>
                    <li><strong>Uso reflexivo:</strong> No solo usar IA, sino reflexionar sobre su impacto</li>
                    <li><strong>Contextualización:</strong> Adaptar la IA al contexto específico de enseñanza</li>
                    <li><strong>Situación:</strong> Considerar el entorno social y cultural</li>
                    <li><strong>Ética:</strong> Uso responsable y crítico de la tecnología</li>
                </ul>
                <div class="highlight-box">
                    <p><strong>Enfoque clave:</strong> La herramienta no es neutra, ni el uso meramente funcional.</p>
                </div>
            `
        }
    };
    
    if (tpackContent[type]) {
        modalContent.innerHTML = `
            <h2>${tpackContent[type].title}</h2>
            ${tpackContent[type].content}
        `;
        modal.style.display = 'block';
    }
}

function closeTPACKModal() {
    const modal = document.getElementById('tpackModal');
    modal.style.display = 'none';
}

// ===== MODALES DIÁLOGOS =====
function showDialogueModal(type) {
    const modal = document.getElementById('dialogueModal');
    const modalContent = document.getElementById('dialogueModalContent');
    
    const dialogueContent = {
        continuum: {
            title: 'IA como continuum',
            image: 'images/insignia1-continuum.png',
            content: `
                <h3>La inteligencia artificial como espectro continuo</h3>
                <p>La IA no es una tecnología única, sino un continuum de capacidades que van desde:</p>
                <ul>
                    <li><strong>IA débil:</strong> Sistemas especializados en tareas específicas</li>
                    <li><strong>IA fuerte:</strong> Sistemas con capacidades cognitivas generales</li>
                    <li><strong>Automatización simple:</strong> Reglas predefinidas</li>
                    <li><strong>Aprendizaje automático:</strong> Sistemas que aprenden de datos</li>
                </ul>
                <div class="reflection-box">
                    <h4>💭 Reflexión pedagógica</h4>
                    <p>En educación, esto significa reconocer que diferentes herramientas de IA tienen diferentes capacidades y limitaciones. No todas las IA son iguales.</p>
                </div>
            `
        },
        generative: {
            title: 'Diálogos generativos con la IA',
            image: 'images/insignia-2dialogogenerativoconia.png',
            content: `
                <h3>Interacciones creativas con sistemas de IA</h3>
                <p>Los diálogos generativos implican:</p>
                <ul>
                    <li><strong>Co-creación:</strong> Humanos y IA trabajando juntos</li>
                    <li><strong>Iteración:</strong> Refinamiento continuo de ideas</li>
                    <li><strong>Creatividad aumentada:</strong> IA como catalizador de ideas</li>
                    <li><strong>Pensamiento crítico:</strong> Evaluación constante de resultados</li>
                </ul>
                <div class="reflection-box">
                    <h4>💭 En el aula</h4>
                    <p>Promover que los estudiantes vean la IA como un compañero de diálogo, no como una fuente de respuestas definitivas.</p>
                </div>
            `
        },
        teachers: {
            title: 'Diálogos entre docentes',
            image: 'images/insignia3-dialogogenerativoconpares.png',
            content: `
                <h3>Intercambio pedagógico sobre IA</h3>
                <p>La importancia del diálogo entre pares incluye:</p>
                <ul>
                    <li><strong>Experiencias compartidas:</strong> Qué funciona y qué no</li>
                    <li><strong>Reflexión colectiva:</strong> Construcción social del conocimiento</li>
                    <li><strong>Apoyo mutuo:</strong> Acompañamiento en la innovación</li>
                    <li><strong>Desarrollo profesional:</strong> Aprendizaje continuo</li>
                </ul>
                <div class="reflection-box">
                    <h4>💭 Comunidades de práctica</h4>
                    <p>Los espacios de intercambio entre docentes son fundamentales para una integración reflexiva de la IA en educación.</p>
                </div>
            `
        },
        ourselves: {
            title: 'Diálogo con nosotrxs mismxs',
            image: 'images/insignia4-dialogogenerativoconuno.png',
            content: `
                <h3>Reflexión personal y metacognición</h3>
                <p>El diálogo interno implica:</p>
                <ul>
                    <li><strong>Autoconocimiento:</strong> Reconocer nuestras creencias sobre tecnología</li>
                    <li><strong>Metacognición:</strong> Pensar sobre nuestro propio pensamiento</li>
                    <li><strong>Valores educativos:</strong> Qué consideramos importante en educación</li>
                    <li><strong>Resistencias y miedos:</strong> Identificar y abordar nuestras preocupaciones</li>
                </ul>
                <div class="reflection-box">
                    <h4>💭 Preguntas clave</h4>
                    <p>¿Cómo cambia mi rol docente con la IA? ¿Qué aspectos humanos de la educación quiero preservar?</p>
                </div>
            `
        },
        networks: {
            title: 'Diálogos en redes',
            image: 'images/insignia5-dialogoenredes.png',
            content: `
                <h3>Participación en comunidades virtuales</h3>
                <p>Los diálogos en red incluyen:</p>
                <ul>
                    <li><strong>Comunidades globales:</strong> Conexión con educadores de todo el mundo</li>
                    <li><strong>Intercambio de recursos:</strong> Compartir herramientas y experiencias</li>
                    <li><strong>Construcción colectiva:</strong> Conocimiento distribuido</li>
                    <li><strong>Diversidad de perspectivas:</strong> Enriquecimiento mutuo</li>
                </ul>
                <div class="reflection-box">
                    <h4>💭 Ciudadanía digital</h4>
                    <p>Participar responsablemente en redes educativas, contribuyendo al bien común del conocimiento.</p>
                </div>
            `
        }
    };
    
    if (dialogueContent[type]) {
        modalContent.innerHTML = `
            <div class="modal-header">
                <img src="${dialogueContent[type].image}" alt="${dialogueContent[type].title}" class="modal-image">
                <h2>${dialogueContent[type].title}</h2>
            </div>
            ${dialogueContent[type].content}
        `;
        modal.style.display = 'block';
    }
}

function closeDialogueModal() {
    const modal = document.getElementById('dialogueModal');
    modal.style.display = 'none';
}

// ===== EFECTOS VISUALES =====
function showConfetti() {
    // Crear elementos de confeti
    for (let i = 0; i < 100; i++) {
        createConfettiPiece();
    }
}

function createConfettiPiece() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    
    document.body.appendChild(confetti);
    
    // Remover después de la animación
    setTimeout(() => {
        confetti.remove();
    }, 5000);
}

function getRandomColor() {
    const colors = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== EVENT LISTENERS =====
// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const tpackModal = document.getElementById('tpackModal');
    const dialogueModal = document.getElementById('dialogueModal');
    
    if (event.target === tpackModal) {
        closeTPACKModal();
    }
    if (event.target === dialogueModal) {
        closeDialogueModal();
    }
}

// Cerrar modales con Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeTPACKModal();
        closeDialogueModal();
    }
});

// ===== INICIALIZACIÓN DEL CRONÓMETRO =====
document.addEventListener('DOMContentLoaded', function() {
    updateTimerDisplay();
});

