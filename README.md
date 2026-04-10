********************
* WAR - METRICS *
********************

WAR - METRICS (V1.0) es una aplicación web *Full Stack* diseñada para actuar como un motor de resolución estadística y simulador de combate para juegos de miniaturas y *wargames*.

La herramienta permite introducir perfiles de ataque complejos y devuelve tanto el resultado de una simulación aleatoria (tirada de dados virtual) como la media estadística real (conocida en la comunidad como *MathHammer*).

## ✨ Características Principales

* **Secuencia de Combate Completa**: Simula de forma concatenada las fases de Impactar, Herir, Salvación por Armadura y No Hay Dolor (FNP).
* **Motor Dual de Cálculo**: 
  * *Simulación Aleatoria*: Utiliza `ThreadLocalRandom` para tirar dados virtuales.
  * *Media Matemática*: Calcula la esperanza matemática exacta basada en probabilidades ponderadas.
* **Reglas Especiales Integradas**:
  * Repeticiones al impactar/herir (repetir los 1s o repetir todos los fallos).
  * Reglas de críticos (6s naturales): Generar impactos adicionales, herir automáticamente o ignorar la salvación por armadura (heridas insalvables).
* **Interfaz de Usuario (UI)**: Dashboard responsivo construido en HTML/CSS y Vanilla JavaScript que interactúa de forma asíncrona con el servidor.

## 🛠️ Stack Tecnológico

**Backend:**
* Java (JDK 17/21)
* Spring Boot (Web, REST API)
* Maven (Gestor de dependencias)

**Frontend:**
* HTML5 & CSS3 (Diseño responsivo con CSS Grid/Flexbox)
* Vanilla JavaScript (Fetch API para peticiones asíncronas)

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una estructura limpia basada en capas (MVC/REST):

* `Controller` (`AtaqueController`): Expone la API REST, versionada en `v1`, configurada con `@CrossOrigin` para permitir la comunicación fluida con el cliente.
* `Service` (`SimuladorService`): El "cerebro" de la aplicación. Contiene la lógica de negocio, bucles de simulación y las matemáticas de probabilidad.
* `DTO` (`AtaqueRequest`, `ResultadoResponse`): Objetos de transferencia de datos para tipar fuertemente las entradas y salidas de la API.


## 📡 API REST Endpoints
La aplicación expone los siguientes endpoints:

### 1. Comprobación de Estado (Health Check)
```http
GET /api/v1/combate/status

### 2. Simulación de Combate
```http
POST /api/v1/combate/simular

Cuerpo de la petición (JSON):

{
    "numAtaques": 10,
    "dañoPorAtaque": 2,
    "impactoX": 3,
    "repeticionImpacto": "ONES", 
    "especialSeisImpacto": "AUTO_WOUND", 
    "herirX": 4,
    "repeticionHerir": "NONE",
    "seisHeridaInsalvable": true,
    "salvacionX": 4,
    "noHayDolorX": 6
}

## Notas sobre parámetros: repeticion acepta "NONE", "ONES" o "ALL". especialSeisImpacto acepta "NONE", "EXTRA_HIT" o "AUTO_WOUND".

Respuesta (JSON):

{
    "dañoAleatorio": 8,
    "dañoMedioEstadistico": 7.41
}

🚀 Instalación y Ejecución Local
1. Clona este repositorio en tu máquina local.

2. Asegúrate de tener Java y Maven instalados.

3. Abre una terminal en la raíz del proyecto y ejecuta:

    ./mvnw spring-boot:run

4. Una vez que la consola indique que la aplicación ha arrancado (Started Proyecto1Application), abre tu navegador web favorito.

5. Navega a la siguiente dirección para usar la interfaz gráfica:

    http://localhost:8080/index.html


🗺️ Roadmap (Próximos Pasos)
La versión actual es puramente computacional. Las futuras iteraciones de WarMetrics incluirán:

[ ] Capa de Persistencia: Integración de Base de Datos (MySQL/PostgreSQL) mediante Spring Data JPA.

[ ] Sistema de Usuarios: Registro, Autenticación y Autorización mediante Spring Security y JWT.

[ ] Historial: Capacidad para guardar los resultados de las simulaciones asociadas a un usuario con títulos y notas personalizadas.

------------------------------------------------------

Desarrollado con pasión para la comunidad de Wargames.

------------------------------------------------------

***

Con este documento, cualquier persona (o reclutador) que visite tu código entenderá perfectamente la magnitud del trabajo, las decisiones técnicas que has tomado y hacia dónde se dirige el proyecto.