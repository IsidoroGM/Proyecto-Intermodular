// =======================================================
// WAR-METRICS: SISTEMA DE ARCHIVOS Y RUTINAS DE HISTORIAL
// =======================================================

/**
 * 1. GUARDAR TIRADA EN EL SERVIDOR
 * Recoge los datos del panel, los cruza con el último cálculo
 * y los envía al HistorialController.
 */
async function enviarGuardado() {
    const titulo = document.getElementById('save-titulo').value;
    const notas = document.getElementById('save-notas').value;

    // Validaciones de seguridad
    if (!titulo) {
        alert("Comandante, por favor asigne un título al archivo de batalla.");
        return;
    }

    if (!ultimoResultado) {
        alert("Error: No hay datos en el motor de simulación para guardar.");
        return;
    }

    // Preparar el paquete de datos (Debe coincidir con GuardarTiradasRequest.java)
    const payload = {
        usuarioId: usuarioActual.id,
        titulo: titulo,
        notas: notas,
        aleatorio: ultimoResultado.dañoAleatorio,
        media: ultimoResultado.dañoMedioEstadistico
    };

    try {
        const response = await fetch('http://localhost:8080/api/historial/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(`¡Archivo "${titulo}" guardado en los registros!`);
            
            // Ocultamos el panel de guardado de forma robusta
            const panelGuardar = document.getElementById('panel-guardar-tirada');
            if (panelGuardar) {
                panelGuardar.classList.remove('pantalla-activa');
                panelGuardar.classList.add('pantalla-oculta');
                panelGuardar.style.display = 'none'; // Clave para evitar el bug visual
            }
            
            // Limpiamos los inputs
            document.getElementById('save-titulo').value = '';
            document.getElementById('save-notas').value = '';
            
            // Refrescamos la pestaña historial si el usuario decide ir allí
            if (typeof cargarHistorialVisual === 'function') {
                cargarHistorialVisual(); 
            }
        } else {
            alert("Los servidores de registro han rechazado la petición.");
        }
    } catch (e) {
        console.error("Error al guardar historial:", e);
        alert("Pérdida de conexión con el servidor. No se pudo guardar.");
    }
}

/**
 * 2. RECUPERAR Y PINTAR EL HISTORIAL DEL USUARIO
 * Llama al backend para traer los registros y genera las tarjetas.
 */
async function cargarHistorialVisual() {
    if (typeof usuarioActual === 'undefined' || !usuarioActual) return;

    const lista = document.getElementById('historial-completo');
    if (!lista) return; 

    try {
        const response = await fetch(`http://localhost:8080/api/historial/usuario/${usuarioActual.id}`);
        const tiradas = await response.json();

        // Si no hay tiradas, mostramos mensaje elegante
        if (tiradas.length === 0) {
            lista.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-style: italic;">Los archivos están vacíos. Realiza tu primera tirada en el simulador.</p>';
            return;
        }

        // Renderizado del historial (con clases dinámicas y coincidiendo con el modelo Java)
        lista.innerHTML = tiradas.map(t => {
            // Manejo de fecha seguro
            const fechaString = new Date(t.fechaCreacion).toLocaleString();
            
            return `
            <div class="historial-card" style="border: 1px solid var(--border-dark); padding: 15px; margin-bottom: 15px; border-radius: 5px; background: var(--bg-panels); transition: 0.3s;"
                 onmouseover="this.style.borderColor='var(--accent)'" 
                 onmouseout="this.style.borderColor='var(--border-dark)'">
                
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-dark); padding-bottom: 8px; margin-bottom: 10px;">
                    <strong style="color: var(--accent); font-size: 1.1em;">${t.titulo}</strong>
                    <span style="font-size: 0.75rem; color: var(--text-muted); background: var(--bg-main); padding: 2px 8px; border-radius: 10px;">${fechaString}</span>
                </div>
                
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 15px 0;">
                    ${t.notas ? `📝 <i>${t.notas}</i>` : 'Sin notas tácticas adjuntas.'}
                </p>
                
                <div style="display: flex; gap: 15px; font-size: 0.95rem; color: var(--text-main); background: rgba(0,0,0,0.2); padding: 10px; border-radius: 5px;">
                    <div>🎲 Resultado Real: <strong style="color: #2ecc71;">${t.danoAleatorio}</strong></div>
                    <div>|</div>
                    <div>📊 Media (MathHammer): <strong style="color: #3498db;">${t.danoMedioEstadistico}</strong></div>
                </div>
            </div>
            `;
        }).join('');
        
    } catch (e) {
        console.error("Error al recuperar los archivos de batalla:", e);
        lista.innerHTML = '<p style="text-align:center; color:#e74c3c;">Fallo en la conexión con los archivos imperiales.</p>';
    }
}