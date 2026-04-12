// --- FUNCIONALIDAD DE GUARDADO ---

let ultimoResultado = null; // Guardará el último cálculo hecho

// Modifica tu función ejecutarSimulacion() para que al final asigne los datos:
// ... dentro del try de ejecutarSimulacion ...
const data = await response.json();
ultimoResultado = data; // Guardamos para poder salvarlo luego

if (usuarioActual) {
    document.getElementById('panel-guardar-tirada').classList.remove('pantalla-oculta');
    document.getElementById('panel-guardar-tirada').classList.add('pantalla-activa');
}
// ... resto de la función ...

async function enviarGuardado() {
    const titulo = document.getElementById('save-titulo').value;
    const notas = document.getElementById('save-notas').value;

    if (!titulo) {
        alert("Por favor, ponle un título a la tirada");
        return;
    }

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
            alert("¡Tirada guardada con éxito!");
            document.getElementById('panel-guardar-tirada').classList.add('pantalla-oculta');
            document.getElementById('save-titulo').value = '';
            document.getElementById('save-notas').value = '';
            cargarHistorialVisual(); // Refrescar la pantalla de historial
        }
    } catch (e) {
        alert("Error al guardar.");
    }
}

// Función para cargar el historial en la pestaña correspondiente
async function cargarHistorialVisual() {
    if (!usuarioActual) return;

    const lista = document.getElementById('historial-completo');
    try {
        const response = await fetch(`http://localhost:8080/api/historial/usuario/${usuarioActual.id}`);
        const tiradas = await response.json();

        if (tiradas.length === 0) {
            lista.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No hay tiradas guardadas.</p>';
            return;
        }

        lista.innerHTML = tiradas.map(t => `
            <div style="border: 1px solid var(--border-dark); padding: 15px; margin-bottom: 10px; border-radius: 5px; background: #222;">
                <div style="display: flex; justify-content: space-between;">
                    <strong style="color: var(--accent);">${t.titulo}</strong>
                    <span style="font-size: 0.7rem; color: var(--text-muted);">${new Date(t.fechaCreacion).toLocaleString()}</span>
                </div>
                <p style="font-size: 0.85rem; margin: 5px 0;">${t.notas || 'Sin notas'}</p>
                <div style="font-size: 0.9rem; margin-top: 10px; color: var(--text-main);">
                    🎲 Real: <strong>${t.danoAleatorio}</strong> | 📊 Media: <strong>${t.danoMedioEstadistico}</strong>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error al cargar historial", e);
    }
}