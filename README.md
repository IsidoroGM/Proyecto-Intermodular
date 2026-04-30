# ⚡ WarMetrics — Simulador Táctico de Combate
> **Single Page Application (SPA) Full-Stack | Java + Spring Boot | API RESTful | Vanilla JS**

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Estilo](https://img.shields.io/badge/UI/UX-Cyberpunk_Neon-00ff9f?style=for-the-badge)](#)

---

## 🎯 Sobre el Proyecto

**WarMetrics** es una aplicación web full-stack diseñada para resolver escenarios matemáticos y probabilísticos en juegos de mesa estratégicos (wargames). Su núcleo operativo combina la simulación empírica (basada en generación de números aleatorios) con la precisión estadística (cálculo de la esperanza matemática) para ofrecer predicciones de combate fiables.

Este proyecto ha sido desarrollado con un enfoque estricto en los principios de la ingeniería de software:
* Arquitectura backend limpia y escalable.
* Diseño riguroso de una API RESTful.
* Interfaz de usuario dinámica (SPA) renderizada y controlada exclusivamente mediante manipulación directa del DOM (sin frameworks), demostrando un dominio profundo del ecosistema web nativo.

---

## ⚙️ Características Principales y Lógica de Negocio

### 🎲 Motor de Combate Dual
El núcleo de procesamiento en el servidor implementa un pipeline de resolución de combate completo (Impacto ➔ Herida ➔ Salvación ➔ No Hay Dolor) a través de dos algoritmos paralelos:
* **Simulador Aleatorio (Montecarlo):** Emula la varianza de las tiradas de dados reales en cada fase, procesando reglas especiales y modificadores al vuelo.
* **Calculadora Estadística (MathHammer):** Ejecuta un árbol de probabilidades para determinar la media matemática del daño infligido, permitiendo contrastar resultados atípicos con la "media esperada".

### 🛡️ Sistema de Gestión de Armería (CRUD)
Gestión integral del estado de las unidades mediante persistencia en base de datos relacional:
* Creación, actualización y eliminación de perfiles tácticos complejos.
* Inyección automatizada (One-Click Deploy) de los objetos de datos (JSON) directamente en el motor de simulación del frontend.

### 💾 Persistencia de Historial Táctico
Trazabilidad completa de las operaciones de los usuarios:
* Registro transaccional de los resultados de cada simulación (tanto aleatorios como estadísticos).
* Consultas indexadas y ordenadas cronológicamente para análisis post-partida.

### 👤 Autenticación y Control de Sesión
* Flujo de registro y login de usuarios.
* Gestión de estado de sesión en el cliente a través de `localStorage` (actualmente en transición hacia un modelo robusto de tokens JWT para asegurar la capa de autorización en la API).

### 🖥️ Frontend SPA (Single Page Application)
* Experiencia de usuario ininterrumpida sin recargas de página mediante JavaScript ES6+ asíncrono y la API `fetch`.
* Actualizaciones reactivas del DOM basadas en las respuestas JSON del servidor.
* Diseño "Cyberpunk HUD", altamente responsivo y optimizado para dispositivos móviles mediante CSS Grid y Flexbox.

---

## 🏗️ Arquitectura Técnica

### Backend (Spring Boot 3 & Java 17)
Diseñado bajo el patrón de arquitectura por capas (N-Tier Architecture):
* **Controllers:** Exposición de endpoints REST, interceptación de peticiones HTTP y gestión de códigos de estado.
* **Services (Capa de Negocio):** Aislamiento de la lógica probabilística y matemática del combate.
* **Repositories (Capa de Acceso a Datos):** Interfaces de Spring Data JPA para la abstracción de consultas a la base de datos MySQL.
* **Data Transfer Objects (DTOs):** Mapeo de entidades para evitar la exposición del modelo de dominio y asegurar el payload.
* **Validación:** Uso de `Jakarta Validation` para garantizar la integridad de los datos en las peticiones entrantes.

### Frontend (Vanilla JS)
* Estructura modular basada en módulos ES6.
* Separación de responsabilidades en el cliente: Controladores de eventos (Event Listeners), Servicios de red (Fetch wrappers) y Renderizadores del DOM.

---

## 🔌 Especificaciones de la API REST

## API REST

### Motor de Simulación (`/api/v1/combate`)

```http
POST /api/v1/combate/simular  # Inyecta los perfiles y devuelve el cálculo de daño
GET  /api/v1/combate/status   # Healthcheck del servicio de simulación
```

---

### Armería - Gestión de Unidades (`/api/tarjetas`)

```http
POST   /api/tarjetas/guardar      # Persiste una nueva hoja de datos
GET    /api/tarjetas/usuario/{id} # Recupera todas las unidades asociadas a un usuario
PUT    /api/tarjetas/{id}         # Actualiza los modificadores/stats de una unidad
DELETE /api/tarjetas/{id}         # Elimina el registro
```

---

### Historial de Simulaciones (`/api/historial`)

```http
POST   /api/historial/guardar      # Almacena el resultado de una tirada/cálculo
GET    /api/historial/usuario/{id} # Retorna el log histórico del usuario
DELETE /api/historial/{id}         # Purga un registro específico
```

---

## Modelo de Datos Relacional

### Usuario (`User`)

Entidad principal del sistema: `id`, `username`, `password`, `email`.

Relación `1:N` con `Tarjetas` e `Historial`.

---

### Tarjeta de Unidad (`Unit Card`)

Entidad que almacena los atributos de la tropa: `HA`, `HP`, `F`, `R` y reglas especiales.

Foreign Key vinculada al usuario.

---

### Registro de Simulación (`Record`)

Entidad que encapsula un evento de cálculo: resultado aleatorio, resultado estadístico, timestamp y notas.

Foreign Key vinculada al usuario.

---

## Stack Tecnológico

| Capa | Tecnologías Clave |
|---|---|
| Backend Core | Java 17, Spring Boot 3 |
| Persistencia / ORM | Spring Data JPA, Hibernate |
| Base de Datos | MySQL 8.0 |
| Frontend | HTML5, CSS3, JavaScript ES6+ Vanilla |
| Build & Version Control | Maven, Git / GitHub |

---

## Guía de Instalación y Despliegue Local

Prerrequisitos del Entorno
Java Development Kit (JDK) 17 o superior.

Maven 3.8+ instalado en el PATH.

Servidor MySQL ejecutándose en el puerto 3306.

---

## Pasos de Configuración
### 1.Clonar el Repositorio:
git clone [https://github.com/tu-usuario/warmetrics.git](https://github.com/tu-usuario/warmetrics.git)
cd warmetrics

---

### 2.Configurar el DataSource:

Edita el archivo de configuración en `src/main/resources/application.properties` para enlazar tu base de datos local:

### Propierties
```spring.datasource.url=jdbc:mysql://localhost:3306/warmetrics```
```spring.datasource.username=tu_usuario_mysql```
```spring.datasource.password=tu_contraseña_mysql```
```spring.jpa.hibernate.ddl-auto=update```

### 3.Compilar y Levantar el Servidor:
```mvn spring-boot:run``` 

### 4.Acceso a la Aplicación: 
Abre `http://localhost:8080` en tu navegador web.

---

## Roadmap y Mejoras Futuras
- [x] Motor matemático y probabilístico de combate.

- [x] Sistema CRUD de perfiles y gestión de unidades.

- [x] Persistencia de historial de resultados.

- [x] Frontend SPA reactivo en Vanilla JS.

- [x] Diseño responsivo (Mobile-First UI).

- [ ] UX Enhancements: Sistema de notificaciones asíncronas (Toasts) para feedback de la API.

- [ ] Data Visualization: Motor gráfico ligero basado en Canvas o Three.js para renderizar animaciones de dados en 3D.

- [ ] Optimización Backend: Implementación de caché (Redis) para lecturas intensivas del historial.

---

## Objetivos Pedagógicos y Técnicos
Este proyecto ha sido concebido como un entorno de demostración técnica integral para mi desarrollo profesional como desarrollador Backend Java. Evidencia capacidades clave en:

Implementación y consumo de APIs REST siguiendo convenciones estándar.

Construcción de arquitecturas sólidas y desacopladas en el ecosistema Spring.

Manejo del ciclo de vida de los datos mediante mapeo objeto-relacional (ORM) con JPA.

Comprensión profunda del modelo cliente-servidor al prescindir de librerías frontend pesadas en favor del control directo del DOM.

Escritura de código limpio (Clean Code) y estructuras altamente escalables.



## 👤 Autor
**Isidoro Gordillo** *Full Stack Developer Junior* > Apasionado por la resolución de problemas lógicos y la creación de interfaces de usuario inmersivas.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](TU_LINKEDIN)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](TU_GITHUB)

---
*Construido con dedicación para la comunidad de Warhammer 40000. WarMetrics v1.0 - 2026.*
