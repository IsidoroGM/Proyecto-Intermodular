async function ejecutarSimulacion() {
        const payload = {
            numAtaques: parseInt(document.getElementById('numAtaques').value),
            dañoPorAtaque: parseInt(document.getElementById('dañoPorAtaque').value),
            impactoX: parseInt(document.getElementById('impactoX').value),
            repeticionImpacto: document.getElementById('repeticionImpacto').value,
            especialSeisImpacto: document.getElementById('especialSeisImpacto').value,
            herirX: parseInt(document.getElementById('herirX').value),
            repeticionHerir: "NONE", // Por ahora estático, se puede añadir un select en el futuro
            seisHeridaInsalvable: document.getElementById('seisHeridaInsalvable').checked,
            salvacionX: parseInt(document.getElementById('salvacionX').value),
            noHayDolorX: parseInt(document.getElementById('noHayDolorX').value || 0)
        };

        const contenedor = document.getElementById('contenedorResultados');

        try {
            // Fíjate en la nueva URL versionada
            const response = await fetch('http://localhost:8080/api/v1/combate/simular', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Error en el servidor: " + response.status);
            }

            // Ya no leemos texto, leemos el JSON de ResultadoResponse
            const data = await response.json();
            
            contenedor.style.display = 'flex';
            contenedor.innerHTML = `
                <div class="caja-resultado aleatorio">
                    🎲 Tirada de dados: <strong>${data.dañoAleatorio}</strong> daños realizados
                </div>
                <div class="caja-resultado estadistica">
                    📊 Media (MathHammer): <strong>${data.dañoMedioEstadistico}</strong> daños esperados
                </div>
            `;

        } catch (error) {
            contenedor.style.display = 'flex';
            contenedor.innerHTML = `
                <div class="caja-resultado error">
                    ⚠️ Error de conexión: Comprueba que Spring Boot está corriendo.
                </div>
            `;
        }
    }

// Al cargar la página, verificamos si el backend está vivo
window.onload = async function() {
    try {
        // Realizamos la petición al endpoint de status que creamos en el Paso 4 [cite: 1148, 1150]
        const response = await fetch('http://localhost:8080/api/v1/combate/status'); 
        
        if (response.ok) {
            const statusElement = document.getElementById('motor-status');
            statusElement.innerText = "ONLINE";
            statusElement.style.color = "#2ecc71";
        }
    } catch (error) {
        // Si el servidor no responde, mostramos el estado OFFLINE
        const statusElement = document.getElementById('motor-status');
        if (statusElement) {
            statusElement.innerText = "OFFLINE";
            statusElement.style.color = "#e74c3c";
        }
        console.error("Error al conectar con el motor:", error);
    }
};

// ... después de mostrar los resultados en el contenedor central ...

// Añadir al Resumen Rápido (Sidebar Derecha)
const quickStats = document.getElementById('quick-stats');
const nuevaEntrada = document.createElement('div');
nuevaEntrada.style.padding = "10px";
nuevaEntrada.style.borderBottom = "1px solid #eee";
nuevaEntrada.style.fontSize = "0.85rem";
nuevaEntrada.innerHTML = `
    <strong>Ataque:</strong> ${payload.numAtaques} dados<br>
    <strong>Resultado:</strong> ${data.dañoAleatorio} | <strong>Media:</strong> ${data.dañoMedioEstadistico}
`;
// Insertar al principio de la lista
quickStats.prepend(nuevaEntrada);