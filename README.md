# Escenarios para aprender con IA - Último encuentro

Una experiencia web interactiva para el curso "Escenarios para aprender con IA", diseñada para facilitar el último encuentro del programa educativo.

## 🚀 Características

### ✨ Diseño Moderno
- **Interfaz atractiva** con gradientes y animaciones suaves
- **Responsive design** optimizado para móvil, tablet y desktop
- **Paleta de colores educativa** cuidadosamente seleccionada
- **Tipografía profesional** con Inter y Roboto

### 🎯 Funcionalidades Interactivas

#### 📊 Sistema de Progreso
- Checkboxes interactivos para marcar momentos completados
- Barra de progreso visual con porcentaje
- Persistencia de datos en localStorage
- Celebración con confetis al completar 100%

#### 🎲 Tragamonedas de Grupos
- Selección aleatoria de grupos del 1 al 18
- Animaciones de giro realistas
- Eliminación automática de números ya utilizados
- Generación de parejas para presentaciones
- Persistencia de selecciones

#### ⏱️ Cronómetro de Presentación
- Cuenta regresiva de 5 minutos
- Diseño circular con progreso visual
- Controles de iniciar, pausar y reiniciar
- Cambio de color según tiempo restante
- Efectos de confetis y sonido al finalizar

#### 🧭 Navegación Inteligente
- Menú sticky con indicador de sección activa
- Scroll suave entre secciones
- Menú hamburguesa responsive
- Botón "volver arriba"

### 📚 Contenido Educativo

#### 🌀 Apertura: Recuperar el trayecto
- Timeline interactivo de encuentros anteriores
- Enlaces a recursos previos
- Reflexión sobre el recorrido de aprendizaje

#### 🧠 Momento 1: Modelo de aproximación
- Visualización del modelo TPACK
- Enfoque crítico sobre tecnología educativa
- Enlace a ficha técnica Genially

#### 🎲 Momento 2: Puesta en común lúdica
- Herramientas interactivas para dinámicas grupales
- Análisis desde tres escenarios de IA
- Gamificación del proceso de aprendizaje

#### 🔁 Momento 3: Los 5 diálogos del trayecto
- Tarjetas interactivas de diálogos clave
- Modales con reflexiones expandidas
- Recuperación colectiva de aprendizajes

#### 🎓 Momento 4: Reflexión pedagógica
- Referentes pedagógicos (Sócrates, Freire, Lion)
- Enfoque en la pregunta como motor del aprendizaje
- Perspectiva crítica sobre IA en educación

#### 🏛️ Footer Inspiracional
- Imagen de "La escuela de Atenas" de Rafael Sanzio
- Pregunta reflexiva final
- Conexión con la nueva era digital

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS, gradientes y animaciones
- **JavaScript ES6+** - Funcionalidad interactiva avanzada
- **Font Awesome** - Iconografía profesional
- **Google Fonts** - Tipografía web optimizada

## 📱 Responsive Design

El sitio está optimizado para:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎨 Paleta de Colores

- **Azul Educativo**: `#2E86AB` - Navegación y elementos principales
- **Magenta Cálido**: `#A23B72` - Acentos y elementos destacados
- **Naranja Energético**: `#F18F01` - Elementos interactivos
- **Rojo Educativo**: `#C73E1D` - Alertas y llamadas a la acción

## 🚀 Instalación y Uso

### Opción 1: Clonar repositorio
```bash
git clone https://github.com/tu-usuario/escenarios-ia-web.git
cd escenarios-ia-web
```

### Opción 2: Descargar ZIP
1. Descarga el archivo ZIP del repositorio
2. Extrae los archivos en tu directorio local
3. Abre `index.html` en tu navegador

### Estructura de archivos
```
escenarios-ia-web/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos completos
├── js/
│   └── main.js         # Funcionalidad JavaScript
├── images/
│   ├── escuela-atenas.jpg
│   └── [otros recursos visuales]
└── README.md           # Este archivo
```

## 🌐 Demo en Vivo

Visita la demo en: [https://tu-usuario.github.io/escenarios-ia-web](https://tu-usuario.github.io/escenarios-ia-web)

## 📖 Guía de Uso para Docentes

### Preparación de la clase
1. Abrir el sitio web en el navegador
2. Verificar que todas las funcionalidades estén operativas
3. Preparar los enlaces a encuentros anteriores

### Durante la clase
1. **Apertura**: Revisar el trayecto recorrido
2. **Momento 1**: Reflexionar sobre el modelo TPACK
3. **Momento 2**: Usar el tragamonedas para formar grupos y cronómetro para presentaciones
4. **Momento 3**: Explorar los 5 diálogos del trayecto
5. **Momento 4**: Reflexión final con referentes pedagógicos

### Funcionalidades clave
- Marcar checkboxes conforme se completan actividades
- Usar tragamonedas para selección aleatoria de grupos
- Activar cronómetro durante presentaciones de 5 minutos
- Navegar fluidamente entre secciones

## 🔧 Personalización

### Modificar colores
Edita las variables CSS en `css/styles.css`:
```css
:root {
    --primary-blue: #2E86AB;
    --primary-magenta: #A23B72;
    --primary-orange: #F18F01;
    --primary-red: #C73E1D;
}
```

### Cambiar contenido
Modifica el HTML en `index.html` manteniendo la estructura de clases CSS.

### Ajustar funcionalidades
Personaliza el comportamiento en `js/main.js` modificando las constantes de configuración:
```javascript
const CONFIG = {
    TIMER_DURATION: 300, // 5 minutos en segundos
    GROUPS_TOTAL: 18,    // Número total de grupos
    CONFETTI_COUNT: 100  // Cantidad de confetis
};
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Créditos

- **Diseño y Desarrollo**: Equipo de desarrollo
- **Contenido Educativo**: Programa "Escenarios para aprender con IA"
- **Imagen**: "La escuela de Atenas" por Rafael Sanzio
- **Iconografía**: Font Awesome
- **Tipografía**: Google Fonts (Inter, Roboto)

## 📞 Soporte

Para soporte técnico o preguntas sobre el contenido educativo, contacta a través de:
- Issues de GitHub
- Email: [tu-email@ejemplo.com]

---

**Desarrollado con ❤️ para la educación del futuro**

