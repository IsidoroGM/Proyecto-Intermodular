// --- VARIABLES GLOBALES ---
let ultimoResultado = null; // Guardará el último cálculo hecho

/**
 * 1. SIMULADOR: Ejecuta la simulación enviando los datos al backend
 */
async function ejecutarSimulacion() {
    // Recolección de datos del formulario principal
    const payload = {
        numAtaques: parseInt(document.getElementById('numAtaques').value) || 0,
        dañoPorAtaque: parseInt(document.getElementById('dañoPorAtaque').value) || 0,
        impactoX: parseInt(document.getElementById('impactoX').value) || 0,
        repeticionImpacto: document.getElementById('repeticionImpacto').value,
        especialSeisImpacto: document.getElementById('especialSeisImpacto').value,
        herirX: parseInt(document.getElementById('herirX').value) || 0,
        repeticionHerir: document.getElementById('repeticionHerir').value, 
        seisHeridaInsalvable: document.getElementById('seisHeridaInsalvable').checked,
        salvacionX: parseInt(document.getElementById('salvacionX').value) || 0,
        noHayDolorX: parseInt(document.getElementById('noHayDolorX').value || 0)
    };

    const contenedor = document.getElementById('contenedorResultados');

    try {
        // CORRECCIÓN: Usamos la constante API_BASE con comillas invertidas
        const response = await fetch(`${API_BASE}/v1/combate/simular`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json(); 
        
        // Persistencia temporal para el guardado posterior
        ultimoResultado = {
            dañoAleatorio: data.heridasFinalesAleatorias || data.dañoAleatorio,
            dañoMedioEstadistico: data.heridasFinalesEstadisticas || data.dañoMedioEstadistico
        };

        // Actualización de la Interfaz (Resultados Centrales)
        contenedor.style.display = 'flex';
        contenedor.innerHTML = `
            <div class="caja-resultado aleatorio">
                🎲 Tirada de dados: <strong>${ultimoResultado.dañoAleatorio}</strong> daños realizados
            </div>
            <div class="caja-resultado estadistica">
                📊 Media (MathHammer): <strong>${ultimoResultado.dañoMedioEstadistico}</strong> daños esperados
            </div>
        `;

        actualizarResumenRapido(payload, ultimoResultado);
        gestionarPanelGuardado();

    } catch (error) {
        console.error('Error durante la simulación:', error);
        contenedor.style.display = 'flex';
        contenedor.innerHTML = `<div class="caja-resultado error">⚠️ Error de conexión con el motor de combate.</div>`;
    }
}

/**
 * 2. FUNCIONES AUXILIARES DEL SIMULADOR
 */
function gestionarPanelGuardado() {
    // Validamos que usuarioActual exista y esté logueado
    if (typeof usuarioActual !== 'undefined' && usuarioActual !== null) {
        const panelGuardar = document.getElementById('panel-guardar-tirada');
        if (panelGuardar) {
            panelGuardar.classList.remove('pantalla-oculta');
            panelGuardar.classList.add('pantalla-activa');
            panelGuardar.style.display = 'block'; 
        }
    }
}

function actualizarResumenRapido(payload, resultado) {
    const quickStats = document.getElementById('quick-stats');
    if (quickStats) {
        const nuevaEntrada = document.createElement('div');
        nuevaEntrada.className = "resumen-entrada"; 
        nuevaEntrada.style.padding = "10px";
        nuevaEntrada.style.borderBottom = "1px solid var(--border-dark)";
        nuevaEntrada.style.fontSize = "0.85rem";
        nuevaEntrada.innerHTML = `
            <strong>Ataque:</strong> ${payload.numAtaques} dados<br>
            <strong>Resultado:</strong> <span style="color:var(--accent)">${resultado.dañoAleatorio}</span> | <strong>Media:</strong> ${resultado.dañoMedioEstadistico}
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
        // CORRECCIÓN: Usamos la constante API_BASE
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
 * 4. NAVEGACIÓN ENTRE PANTALLAS (GUARDIA DE NAVEGACIÓN AÑADIDO)
 */
function cambiarPantalla(destino) {
    // 1. Verificar si la pantalla es protegida
    const pantallasProtegidas = ['unidades', 'historial'];
    const estaLogueado = (typeof usuarioActual !== 'undefined' && usuarioActual !== null && usuarioActual.id !== undefined);

    if (pantallasProtegidas.includes(destino) && !estaLogueado) {
        alert("⚠️ Acceso denegado. Debes iniciar sesión para acceder a la Armería o al Historial.");
        // Redirigimos al simulador si intenta entrar sin permiso
        return cambiarPantalla('simulador'); 
    }

    console.log("Navegando hacia:", destino); 

    // Ocultar todas las pantallas
    const pantallas = ['pantalla-simulador', 'pantalla-unidades', 'pantalla-historial'];
    pantallas.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('pantalla-activa');
            el.classList.add('pantalla-oculta');
        }
    });

    // Desactivar botones del menú
    document.querySelectorAll('.sidebar ul li a').forEach(el => {
        el.classList.remove('active');
    });

    // Activar pantalla destino
    const pantallaDestino = document.getElementById(`pantalla-${destino}`);
    const menuDestino = document.getElementById(`menu-${destino}`);

    if (pantallaDestino) {
        pantallaDestino.classList.remove('pantalla-oculta');
        pantallaDestino.classList.add('pantalla-activa');
    }

    if (menuDestino) {
        menuDestino.classList.add('active');
    }

    // Cargar datos si el usuario está logueado
    if (estaLogueado) {
        if (destino === 'unidades') cargarTarjetasUnidad();
        if (destino === 'historial' && typeof cargarHistorialDefinitivo === 'function') {
            cargarHistorialDefinitivo(); // NUEVO NOMBRE
        }
    }
}

