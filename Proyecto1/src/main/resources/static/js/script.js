let ultimoResultado = null; // Guardará el último cálculo hecho

/**
 * Función principal para ejecutar la simulación de combate.
 */
async function ejecutarSimulacion() {
    const payload = {
        numAtaques: parseInt(document.getElementById('numAtaques').value),
        dañoPorAtaque: parseInt(document.getElementById('dañoPorAtaque').value),
        impactoX: parseInt(document.getElementById('impactoX').value),
        repeticionImpacto: document.getElementById('repeticionImpacto').value,
        especialSeisImpacto: document.getElementById('especialSeisImpacto').value,
        herirX: parseInt(document.getElementById('herirX').value),
        repeticionHerir: document.getElementById('repeticionHerir').value, 
        seisHeridaInsalvable: document.getElementById('seisHeridaInsalvable').checked,
        salvacionX: parseInt(document.getElementById('salvacionX').value),
        noHayDolorX: parseInt(document.getElementById('noHayDolorX').value || 0)
    };

    const contenedor = document.getElementById('contenedorResultados');

    try {
        const response = await fetch('http://localhost:8080/api/v1/combate/simular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Error en el servidor");

        const data = await response.json(); 
        
        // 1. GUARDAMOS EL RESULTADO EN LA MEMORIA
        ultimoResultado = data; 

        // 2. MOSTRAMOS EL PANEL DE GUARDAR (Solo si hay usuario conectado)
        if (typeof usuarioActual !== 'undefined' && usuarioActual !== null) {
            const panelGuardar = document.getElementById('panel-guardar-tirada');
            if (panelGuardar) {
                panelGuardar.classList.remove('pantalla-oculta');
                panelGuardar.classList.add('pantalla-activa');
            }
        }
        
        // 3. Mostramos resultados centrales
        contenedor.style.display = 'flex';
        contenedor.innerHTML = `
            <div class="caja-resultado aleatorio">
                🎲 Tirada de dados: <strong>${data.dañoAleatorio}</strong> daños realizados
            </div>
            <div class="caja-resultado estadistica">
                📊 Media (MathHammer): <strong>${data.dañoMedioEstadistico}</strong> daños esperados
            </div>
        `;

        // 4. Añadimos al Resumen Rápido
        const quickStats = document.getElementById('quick-stats');
        if (quickStats) {
            const nuevaEntrada = document.createElement('div');
            nuevaEntrada.style.padding = "10px";
            nuevaEntrada.style.borderBottom = "1px solid var(--border-dark)";
            nuevaEntrada.style.fontSize = "0.85rem";
            nuevaEntrada.innerHTML = `
                <strong>Ataque:</strong> ${payload.numAtaques} dados<br>
                <strong>Resultado:</strong> <span style="color:var(--accent)">${data.dañoAleatorio}</span> | <strong>Media:</strong> ${data.dañoMedioEstadistico}
            `;
            quickStats.prepend(nuevaEntrada);
            const placeholder = quickStats.querySelector('p');
            if (placeholder) placeholder.remove();
        }

    } catch (error) {
        contenedor.style.display = 'flex';
        contenedor.innerHTML = `<div class="caja-resultado error">⚠️ Error de conexión.</div>`;
    }
}

/**
 * Verificación del estado del servidor
 */
window.onload = async function() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/combate/status'); 
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
 * Función para alternar entre las diferentes pantallas centrales de la aplicación
 */
function cambiarPantalla(destino) {
    // 1. Ocultar todas las pantallas (Añade aquí más si creas nuevas)
    const simulador = document.querySelector('.content-area');
    const historial = document.getElementById('historial-completo'); // Si existe
    
    // Por ahora, como solo tenemos el simulador en el HTML principal, 
    // prepararemos la estructura. Si el destino es simulador, lo mostramos:
    if (destino === 'simulador') {
        if (simulador) simulador.style.display = 'block';
    } else {
        // Cuando creemos las otras pestañas (Unidades e Historial), 
        // aquí las mostraremos y ocultaremos el simulador.
        if (simulador) simulador.style.display = 'none';
        console.log("Navegando a la sección:", destino);
    }

    // 2. Cambiar el color del menú para saber dónde estamos
    document.querySelectorAll('.sidebar ul li a').forEach(enlace => {
        enlace.classList.remove('active');
    });
    
    const menuActivo = document.getElementById('menu-' + destino);
    if (menuActivo) {
        menuActivo.classList.add('active');
    }
}