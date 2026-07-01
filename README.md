# ✨ NetPulse | Suite de Infraestructura y Operaciones (SysOps & SecOps)

NetPulse es un **Dashboard Prototipo de Alta Fidelidad** diseñado para la monitorización e interacción con infraestructuras de red y servicios de sistemas ligeros. El proyecto fusiona una interfaz web moderna y minimalista con una lógica interactiva que simula las tareas del día a día en administración de redes, ciberseguridad perimetral y orquestación de sistemas.

Desarrollado de forma nativa (Vanilla Architecture) para garantizar la máxima ligereza, legibilidad de código y una experiencia de usuario fluida tanto en modo claro como oscuro.

---

## 🛠️ Características Principales y Funcionalidades

### 1. Monitorización de Nodos y Recursos (SysOps)
* **Estado en Tiempo Real:** Control visual del rendimiento crítico (CPU, Almacenamiento NAS) con componentes reactivos dinámicos.
* **Métrica de Red Activa:** Gráfica de líneas interactiva (desarrollada con *Chart.js*) que simula las fluctuaciones del tráfico de datos en Mbps.
* **Historial de Eventos:** Sistema centralizado de logs globales para la auditoría de acciones del sistema.

### 2. Orquestación y Control de Microservicios
* **Docker Engine Simulator:** Panel interactivo para el control de estados de contenedores (`running`, `starting`, `exited`). Permite aislar, apagar y reiniciar microservicios críticos como entornos web (`Nginx`) o réplicas de bases de datos (`MySQL`).
* **Systemd Daemon Control:** Gestión simulada de servicios nativos del sistema operativo de fondo (`ssh.service`, `isc-dhcp-server`).

### 3. Gestión de Red Local y Diagnóstico (LAN)
* **Mapeo de la VLAN:** Tabla dinámica con base de datos local que simula asignaciones DHCP Leases y tablas ARP (Direcciones IP y MAC Address). Incluye un **buscador predictivo en tiempo real**.
* **Simulador ICMP (Ping):** Herramienta integrada con manejo de asincronía para recrear peticiones eco-request y respuestas de consola de comandos con latencia realista.

### 4. Ciberseguridad y Resiliencia (SecOps)
* **Firewall Perimetral (Iptables/Fail2ban):** Módulo de mitigación que monitoriza IPs maliciosas detectadas en ataques de fuerza bruta o escaneos Nmap, permitiendo aplicar acciones `DROP` o levantamiento de bloqueos (`Unban`) desde la interfaz.
* **Políticas de Resguardo:** Automatización simulada de empaquetados del sistema de archivos (`/etc` y `/var` en formato `.tar.gz`) con barras de carga reactivas.
* **Lógica de Catástrofe (Botón de Pánico):** Simulación global de fallos en cascada. Al activarse, recrea un corte general de energía o ataque ransomware: tumba los demonios de Docker, los servicios del sistema, congela métricas y bloquea la interfaz mostrando errores de red tradicionales (`Network is unreachable`).

---

## 🎨 Decisiones de Diseño y Estética

El proyecto implementa una línea de diseño funcional con un enfoque visual limpio y minimalista:
* **Paleta de Colores Pastel:** Uso de tonos malvas, lilas suaves y detalles azul cielo y rosa para mitigar la carga visual de los paneles de administración tradicionales.
* **Diseño SPA (Single Page Application):** Navegación fluida entre módulos sin recarga de página mediante manipulación limpia del DOM.
* **Dual Theme:** Soporte completo para Modo Claro y Modo Oscuro con persistencia de datos local (`localStorage`).

---

## 🚀 Tecnologías Utilizadas

* **HTML5:** Estructuración semántica y accesible de la suite.
* **CSS3:** Maquetación basada en CSS Grid, Flexbox, variables dinámicas para temas y animaciones fluidas de estado.
* **JavaScript (Vanilla JS):** Arquitectura basada en eventos, manejo del DOM, control de temporizadores asíncronos y lógica de estado global.
* **Chart.js:** Biblioteca externa cargada vía CDN para el renderizado del tráfico de red.

---

## 📂 Estructura del Repositorio

```text
├── css/
│   └── style.css      # Estilos globales, variables pastel y animaciones
├── js/
│   └── main.js        # Lógica de estados, simulación de datos y eventos DOM
├── index.html         # Estructura principal de la SPA
└── README.md          # Documentación técnica del proyecto
