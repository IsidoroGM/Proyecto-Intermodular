/**
 * Función principal para ejecutar la simulación de combate.
 * Envía los datos al servidor Spring Boot y actualiza la interfaz.
 */
async function ejecutarSimulacion() {
    // 1. Recogemos todos los valores actualizados de la interfaz
    const payload = {
        numAtaques: parseInt(document.getElementById('numAtaques').value),
        dañoPorAtaque: parseInt(document.getElementById('dañoPorAtaque').value),
        impactoX: parseInt(document.getElementById('impactoX').value),
        repeticionImpacto: document.getElementById('repeticionImpacto').value,
        especialSeisImpacto: document.getElementById('especialSeisImpacto').value,
        herirX: parseInt(document.getElementById('herirX').value),
        
        // MODIFICACIÓN: Ahora recogemos el valor del nuevo desplegable de heridas
        repeticionHerir: document.getElementById('repeticionHerir').value, 
        
        seisHeridaInsalvable: document.getElementById('seisHeridaInsalvable').checked,
        salvacionX: parseInt(document.getElementById('salvacionX').value),
        noHayDolorX: parseInt(document.getElementById('noHayDolorX').value || 0)
    };

    const contenedor = document.getElementById('contenedorResultados');

    try {
        // 2. Realizamos la petición POST al endpoint versionado [cite: 1153, 1154]
        const response = await fetch('http://localhost:8080/api/v1/combate/simular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Error en el servidor: " + response.status);
        }

        // 3. Procesamos la respuesta JSON del servidor [cite: 1316, 1321]
        const data = await response.json(); 
        
        // 4. Actualizamos el contenedor central de resultados [cite: 1324, 1325]
        contenedor.style.display = 'flex';
        contenedor.innerHTML = `
            <div class="caja-resultado aleatorio">
                🎲 Tirada de dados: <strong>${data.dañoAleatorio}</strong> daños realizados
            </div>
            <div class="caja-resultado estadistica">
                📊 Media (MathHammer): <strong>${data.dañoMedioEstadistico}</strong> daños esperados
            </div>
        `;

        // 5. ACTUALIZACIÓN: Añadir al Resumen Rápido (Sidebar Derecha)
        // Colocamos esto AQUÍ dentro para que tenga acceso a 'payload' y 'data'
        const quickStats = document.getElementById('quick-stats');
        if (quickStats) {
            const nuevaEntrada = document.createElement('div');
            nuevaEntrada.style.padding = "10px";
            nuevaEntrada.style.borderBottom = "1px solid #eee";
            nuevaEntrada.style.fontSize = "0.85rem";
            nuevaEntrada.style.backgroundColor = "#fff";
            nuevaEntrada.innerHTML = `
                <strong>Ataque:</strong> ${payload.numAtaques} dados<br>
                <strong>Resultado:</strong> ${data.dañoAleatorio} | <strong>Media:</strong> ${data.dañoMedioEstadistico}
            `;
            // Insertar al principio de la lista para ver siempre lo más reciente arriba
            quickStats.prepend(nuevaEntrada);
            
            // Si el mensaje de "No hay datos" existe, lo borramos
            const placeholder = quickStats.querySelector('p');
            if (placeholder) placeholder.remove();
        }

    } catch (error) {
        // En caso de error, mostramos el mensaje visual en el contenedor
        contenedor.style.display = 'flex';
        contenedor.innerHTML = `
            <div class="caja-resultado error">
                ⚠️ Error de conexión: Comprueba que Spring Boot está corriendo.
            </div>
        `;
        console.error("Error en la simulación:", error);
    }
}

/**
 * Verificación del estado del servidor al cargar la página.
 */
window.onload = async function() {
    try {
        // Petición al endpoint de salud del motor [cite: 1147, 1148]
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
        console.error("El servidor no responde:", error);
    }
};