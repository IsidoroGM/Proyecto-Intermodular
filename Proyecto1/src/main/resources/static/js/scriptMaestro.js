// --- VARIABLES GLOBALES ---
let ultimoResultado = null; // Guardará el último cálculo hecho

/**
 * 1. SIMULADOR: Ejecuta la simulación enviando los datos al backend
 */
async function ejecutarSimulacion() {
    // 1. Recogemos los valores con los nombres exactos que espera tu DTO de Java
    const datosSimulacion = {
        numAtaques: parseInt(document.getElementById('numAtaques')?.value) || 0,
        danoPorAtaque: parseInt(document.getElementById('dañoPorAtaque')?.value) || 1, // 'dano' sin ñ
        impactoX: parseInt(document.getElementById('impactoX')?.value) || 4,
        herirX: parseInt(document.getElementById('herirX')?.value) || 4, // Usamos herirX en lugar de fuerza
        salvacionX: parseInt(document.getElementById('salvacionX')?.value) || 7, 
        noHayDolorX: parseInt(document.getElementById('noHayDolorX')?.value) || 7,
        
        // Opciones de repetición y reglas especiales
        repeticionImpacto: document.getElementById('repeticionImpacto')?.value || 'NONE',
        especialSeisImpacto: document.getElementById('especialSeisImpacto')?.value || 'NONE',
        repeticionHerir: document.getElementById('repeticionHerir')?.value || 'NONE',
        seisHeridaInsalvable: document.getElementById('seisHeridaInsalvable')?.checked || false
    };

    try {
        const response = await fetch(`${API_BASE}/v1/combate/simular`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosSimulacion)
        });

        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        const resultado = await response.json();
        ultimoResultado = resultado; 

        // 3. Mostramos los resultados reales
        mostrarResultadosEnPantalla(resultado);
        
        // 4. Actualizamos el historial rápido de la derecha
        actualizarResumenRapido(datosSimulacion, resultado);
        gestionarPanelGuardado(); 

    } catch (error) {
        console.error("Error durante la simulación:", error);
        mostrarNotificacion("Error de cálculo: Verifica los datos introducidos", "error"); 
    }
}


/**
 * Pinta los números grandes en el centro de la pantalla
 */
function mostrarResultadosEnPantalla(res) {
    // 1. Hacemos visible el contenedor de resultados
    const contenedor = document.getElementById('contenedorResultados');
    if (contenedor) {
        contenedor.style.display = 'flex'; 
    }

    // 2. Localizamos las pantallas numéricas
    const divReal = document.getElementById('resultado-aleatorio');
    const divMedia = document.getElementById('resultado-estadistico');

    // 3. Pintamos los datos (Contemplamos "dano" y "daño" por compatibilidad con el backend)
    const valorReal = res.dañoAleatorio !== undefined ? res.dañoAleatorio : res.danoAleatorio;
    const valorMedia = res.dañoMedioEstadistico !== undefined ? res.dañoMedioEstadistico : res.danoMedioEstadistico;

    if (divReal) divReal.innerText = valorReal;
    if (divMedia) divMedia.innerText = valorMedia.toFixed(2);
    
    // 4. Animación de pulso neón
    const displays = document.querySelectorAll('.display-resultados');
    displays.forEach(display => {
        display.style.animation = 'none';
        display.offsetHeight; // Truco para reiniciar la animación
        display.style.animation = 'pulse-neon 0.5s ease-out';
    });
}

/**
 * 2. FUNCIONES AUXILIARES DEL SIMULADOR
 */
function gestionarPanelGuardado() {
    // Validamos que usuarioActual exista (viene de scriptLogin.js)
    if (typeof usuarioActual !== 'undefined' && usuarioActual !== null) {
        const panelGuardar = document.getElementById('panel-guardar-tirada');
        if (panelGuardar) {
            panelGuardar.classList.remove('pantalla-oculta');
            panelGuardar.style.display = 'block'; 
        }
    }
}

function actualizarResumenRapido(payload, resultado) {
    const quickStats = document.getElementById('quick-stats');
    if (quickStats) {
        const nuevaEntrada = document.createElement('div');
        nuevaEntrada.className = "resumen-entrada"; 
        nuevaEntrada.innerHTML = `
            <strong>${payload.numAtaques} Atqs:</strong> 
            <span style="color:var(--accent)">${resultado.dañoAleatorio}</span> 
            <small>(Med: ${resultado.dañoMedioEstadistico})</small>
        `;
        quickStats.prepend(nuevaEntrada);
        
        const placeholder = quickStats.querySelector('p');
        if (placeholder) placeholder.remove();
    }
}

/**
 * 3. VERIFICACIÓN DE ESTADO DEL SERVIDOR
 */
window.onload = async function() {
    try {
        const response = await fetch(`${API_BASE}/v1/combate/status`); 
        const statusElement = document.getElementById('motor-status');
        if (response.ok && statusElement) {
            statusElement.innerText = "ONLINE";
            statusElement.style.color = "#2ecc71";
        }
    } catch (error) {
        const statusElement = document.getElementById('motor-status');
        if (statusElement) {
            statusElement.innerText = "OFFLINE";
            statusElement.style.color = "#e74c3c";
        }
    }
};

/**
 * 4. NAVEGACIÓN ENTRE PANTALLAS
 */
function cambiarPantalla(destino) {
    const pantallasProtegidas = ['unidades', 'historial'];
    const estaLogueado = (typeof usuarioActual !== 'undefined' && usuarioActual !== null);

    if (pantallasProtegidas.includes(destino) && !estaLogueado) {
        mostrarNotificacion("⚠️ Debes iniciar sesión para acceder a esta sección.", "error");
        return; 
    }

    // Ocultar todas las pantallas
    document.querySelectorAll('.pantalla-seccion').forEach(el => {
        el.classList.remove('pantalla-activa');
        el.classList.add('pantalla-oculta');
    });

    // Activar pantalla destino
    const pantallaDestino = document.getElementById(`pantalla-${destino}`);
    if (pantallaDestino) {
        pantallaDestino.classList.remove('pantalla-oculta');
        pantallaDestino.classList.add('pantalla-activa');
    }

    // Actualizar menú activo
    document.querySelectorAll('.sidebar ul li a').forEach(el => el.classList.remove('active'));
    const menuDestino = document.getElementById(`menu-${destino}`);
    if (menuDestino) menuDestino.classList.add('active');

    // Cargar datos específicos si es necesario
    if (estaLogueado) {
        if (destino === 'unidades') cargarTarjetasUnidad();
        if (destino === 'historial') cargarHistorialVisual();
    }
}

// Integración con el menú móvil (Paso 19)
function toggleSidebar() {
    document.querySelector('.left-sidebar').classList.toggle('active');
}

/**
 * Utilidad para mostrar mensajes elegantes estilo Toast
 */
function mostrarNotificacion(mensaje, tipo) {
    console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
    const msjBox = document.getElementById('auth-mensaje');
    if (msjBox) {
        msjBox.innerText = mensaje;
        msjBox.style.color = tipo === 'error' ? '#ff4d4d' : 'var(--accent)';
    }
}