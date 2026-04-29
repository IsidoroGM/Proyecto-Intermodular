// =======================================================
// WAR-METRICS: SISTEMA DE ARCHIVOS Y RUTINAS DE HISTORIAL
// =======================================================

async function enviarGuardado() {
    const titulo = document.getElementById('save-titulo').value;
    const notas = document.getElementById('save-notas').value;

    if (!titulo) return alert("Comandante, por favor asigne un título al archivo de batalla.");
    if (!ultimoResultado) return alert("Error: No hay datos en el motor de simulación para guardar.");
    if (typeof usuarioActual === 'undefined' || !usuarioActual) return alert("Debes iniciar sesión para guardar en los archivos.");

    const payload = {
        usuarioId: usuarioActual.id,
        titulo: titulo,
        notas: notas,
        aleatorio: ultimoResultado.dañoAleatorio || ultimoResultado.danoAleatorio, 
        media: ultimoResultado.dañoMedioEstadistico || ultimoResultado.danoMedioEstadistico
    };

    try {
        // Usamos la constante API_BASE centralizada
        const response = await fetch(`${API_BASE}/historial/guardar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(`¡Archivo "${titulo}" guardado en los registros!`);
            
            const panelGuardar = document.getElementById('panel-guardar-tirada');
            if (panelGuardar) {
                panelGuardar.classList.remove('pantalla-activa');
                panelGuardar.classList.add('pantalla-oculta');
                panelGuardar.style.display = 'none'; 
            }
            
            document.getElementById('save-titulo').value = '';
            document.getElementById('save-notas').value = '';
            
            if (typeof cargarHistorialDefinitivo === 'function') cargarHistorialDefinitivo(); 
        } else {
            alert("Los servidores de registro han rechazado la petición. Revisa tu conexión.");
        }
    } catch (e) {
        console.error("Error de conexión al guardar historial:", e);
        alert("Fallo de comunicación con la base de datos imperial.");
    }
}

async function cargarHistorialDefinitivo() {
    if (typeof usuarioActual === 'undefined' || !usuarioActual) return;

    const lista = document.getElementById('historial-completo');
    if (!lista) return; 

    try {
        // Usamos la constante API_BASE centralizada
        const response = await fetch(`${API_BASE}/historial/usuario/${usuarioActual.id}`);
        
        if (!response.ok) throw new Error("Error al descargar los archivos");
        
        const tiradas = await response.json();

        if (tiradas.length === 0) {
            lista.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-style: italic;">El registro están vacíos. Realiza tu primera tirada en el simulador.</p>';
            return;
        }

        lista.innerHTML = tiradas.map(t => {
            const fechaString = new Date(t.fechaCreacion).toLocaleString();
            const notasHTML = t.notas ? 'Notas: <i>' + t.notas + '</i>' : 'Sin notas tácticas adjuntas.';
            
            return `
            <div class="historial-card" style="border: 1px solid var(--border-dark); padding: 15px; margin-bottom: 15px; border-radius: 5px; background: var(--bg-panels); transition: 0.3s;"
                 onmouseover="this.style.borderColor='var(--accent)'" 
                 onmouseout="this.style.borderColor='var(--border-dark)'">
                
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-dark); padding-bottom: 8px; margin-bottom: 10px;">
                    <strong style="color: var(--accent); font-size: 1.1em;">${t.titulo}</strong>
                    <span style="font-size: 0.75rem; color: var(--text-muted); background: var(--bg-main); padding: 2px 8px; border-radius: 10px;">${fechaString}</span>
                </div>
                
                <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 15px 0;">
                    ${notasHTML}
                </p>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 15px; font-size: 0.95rem; color: var(--text-main); background: rgba(0,0,0,0.2); padding: 10px; border-radius: 5px;">
                        <div>Dado: <strong style="color: #2ecc71;">${t.danoAleatorio}</strong></div>
                        <div>|</div>
                        <div>Media: <strong style="color: #3498db;">${t.danoMedioEstadistico}</strong></div>
                    </div>
                    
                    <button onclick="borrarTirada(${t.id})" style="background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; color: #e74c3c; padding: 5px 15px; border-radius: 3px; cursor: pointer; transition: 0.2s;">
                        Purgar Archivo
                    </button>
                </div>
            </div>
            `;
        }).join('');
        
    } catch (e) {
        console.error("Error al recuperar los archivos:", e);
        lista.innerHTML = '<p style="text-align:center; color:#e74c3c;">Error de conexión. No se pudo cargar el registro.</p>';
    }
}

async function borrarTirada(id) {
    if (!confirm("¿Confirma que desea purgar este registro de batalla permanentemente?")) return;
    
    try {
        // Usamos la constante API_BASE centralizada
        const response = await fetch(`${API_BASE}/historial/${id}`, { 
            method: 'DELETE' 
        });
        
        if (response.ok) {
            cargarHistorialDefinitivo();
        } else {
            alert("Los servidores imperiales denegaron la purga.");
        }
    } catch (e) {
        console.error("Error al intentar purgar el archivo:", e);
        alert("Fallo de conexión al intentar eliminar el archivo.");
    }
}