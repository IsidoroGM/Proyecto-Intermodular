# ⚡ WarMetrics: Precision Strike Simulator
> **Plataforma Full-Stack de simulación táctica y gestión de unidades para Wargames.**

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Estilo](https://img.shields.io/badge/UI/UX-Cyberpunk_Neon-00ff9f?style=for-the-badge)](#)

---

## 🎯 Visión General

**WarMetrics** no es solo una calculadora; es una Single Page Application (SPA) diseñada para optimizar la toma de decisiones estratégicas en juegos de miniaturas. Combina un **potente motor de cálculo probabilístico** con un sistema de gestión de inventario táctico, permitiendo a los comandantes prever resultados con precisión matemática antes de desplegar sus tropas.

### 🖼️ Preview del Campo de Batalla
> `![Simulador Principal](assets/simulador_view.png)`  
> `![Armería de Unidades](assets/armeria_view.png)`

---

## 🛠️ Ingeniería de Software (Core Features)

### 1. Motor de Simulación Dual (Double Engine)
A diferencia de simuladores básicos, WarMetrics implementa un sistema de análisis doble:
* **Algoritmo de Montecarlo (Random):** Simula tiradas de dados reales procesando cada fase del combate (Impacto, Herida, Salvación, No Hay Dolor).
* **Motor de MathHammer (Estadístico):** Ejecuta cálculos de probabilidad en cascada para devolver la esperanza matemática de daño, permitiendo comparar la "suerte" frente a la "media".

### 2. La Armería (CRUD & Persistent Data)
Gestión completa de hojas de datos con persistencia en base de datos relacional:
* **Perfil Táctico Completo:** Almacenamiento de atributos complejos (Nº ataques, Impacto a X+, reglas de repetición de 1s o fallos, reglas especiales en 6s como *Impactos Extra* o *Heridas Automáticas*).
* **Auto-Equipamiento (One-Click Deploy):** Integración fluida mediante JSON. Al seleccionar una unidad, el frontend inyecta instantáneamente el objeto de datos en el simulador, eliminando el error humano y acelerando el flujo de trabajo.

### 3. Ecosistema de Usuario & Seguridad
* **Autenticación de Sesión:** Sistema de login/registro con control de acceso a funciones persistentes.
* **Historial de Batalla:** Registro cronológico de simulaciones para análisis post-partida.

---

## 🏗️ Arquitectura Técnica

El proyecto sigue una arquitectura **Client-Server** limpia, separando responsabilidades para garantizar la escalabilidad:

### Backend (Spring Boot 3)
* **REST API:** Endpoints estructurados siguiendo el estándar de la industria.
* **Persistence Layer:** Spring Data JPA + Hibernate para una gestión eficiente de la base de datos.
* **Data Integrity:** Uso de **DTOs (Data Transfer Objects)** para la comunicación segura entre capas, protegiendo las entidades del dominio.
* **Lógica de Negocio:** Servicios desacoplados que procesan reglas de combate complejas (Heridas Devastadoras, Salvaciones Invulnerables, etc.).

### Frontend (SPA & Cyberpunk UI)
* **Vanilla Stack:** HTML5, CSS3 y JavaScript ES6+. Sin frameworks pesados para demostrar dominio absoluto del DOM.
* **Asynchronous UX:** Comunicación fluida con el servidor mediante `fetch()` y promesas, evitando recargas de página.
* **Custom UI:** Diseño de vanguardia con estética "Glow Neón" basado en variables CSS dinámicas y layouts de CSS Grid/Flexbox.

---

## 💻 Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Lenguaje** | Java 17, JavaScript (ES6) |
| **Frameworks** | Spring Boot 3.2, Spring Data JPA |
| **Base de Datos** | MySQL / PostgreSQL |
| **Herramientas** | Maven, Git, IntelliJ IDEA |
| **Frontend** | CSS Grid, Flexbox, UI Responsiva |

---

## 🚀 Guía de Despliegue Rápido

### Requisitos
* Java JDK 17 o superior.
* Maven 3.6+.
* MySQL 8.0.

### Instalación
1.  **Clonación del Cuartel General:**
    ```bash
    git clone [https://github.com/tu-usuario/WarMetrics.git](https://github.com/tu-usuario/WarMetrics.git)
    cd WarMetrics
    ```
2.  **Configuración de Suministros (BBDD):**
    Edita `src/main/resources/application.properties` con tus credenciales:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/warmetrics
    spring.datasource.username=tu_usuario
    spring.datasource.password=tu_contraseña
    ```
3.  **Despliegue del Servidor:**
    ```bash
    mvn spring-boot:run
    ```
4.  **Acceso:** Abre `http://localhost:8080` en tu navegador.

---

## 🗺️ Roadmap de Operaciones

- [x] **Fase 1:** Motor de cálculo básico y diseño UI neón.
- [x] **Fase 2:** Sistema de usuarios y persistencia de tiradas.
- [x] **Fase 3:** Armería interactiva con auto-equipamiento de unidades.
- [ ] **Fase 4 (Inminente):** Implementación de **JWT (JSON Web Tokens)** para seguridad de grado industrial.
- [ ] **Fase 5:** Sistema de notificaciones tipo Toast y animaciones de dados mediante Canvas/Three.js.

---

## 👤 Autor
**[TU NOMBRE]** *Full Stack Developer Junior* > Apasionado por la resolución de problemas lógicos y la creación de interfaces de usuario inmersivas.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](TU_LINKEDIN)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](TU_GITHUB)

---
*Construido con precisión estratégica. WarMetrics v1.0 - 2024.*
