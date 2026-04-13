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
                panelGuardar.style.display = 'block'; // Aseguramos que se vea
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
 * GESTIÓN DE PANTALLAS: Navegación unificada y a prueba de errores
 */
function cambiarPantalla(destino) {
    // 1. Obtener los elementos principales del DOM
    const panelSimulador = document.getElementById('panel-simulador');
    const panelUnidades = document.getElementById('panel-unidades');
    const panelHistorial = document.getElementById('panel-historial');
    const resultados = document.getElementById('contenedorResultados');
    const guardarTirada = document.getElementById('panel-guardar-tirada');

    // 2. Apagar TODOS los paneles por defecto (Forzamos ocultarlos)
    if (panelSimulador) {
        panelSimulador.classList.remove('pantalla-activa');
        panelSimulador.classList.add('pantalla-oculta');
        panelSimulador.style.display = 'none'; 
    }
    if (panelUnidades) {
        panelUnidades.classList.remove('pantalla-activa');
        panelUnidades.classList.add('pantalla-oculta');
        panelUnidades.style.display = 'none';
    }
    if (panelHistorial) {
        panelHistorial.classList.remove('pantalla-activa');
        panelHistorial.classList.add('pantalla-oculta');
        panelHistorial.style.display = 'none';
    }
    
    // Ocultar también los resultados de los dados si cambiamos de pestaña
    if (resultados) resultados.style.display = 'none';
    if (guardarTirada) guardarTirada.style.display = 'none';

    // 3. Encender SOLO el panel al que queremos ir
    const panelDestino = document.getElementById(`panel-${destino}`);
    if (panelDestino) {
        panelDestino.classList.remove('pantalla-oculta');
        panelDestino.classList.add('pantalla-activa');
        panelDestino.style.display = 'block'; 
    }

    // 4. Acciones específicas si entramos a una pestaña concreta
    if (destino === 'unidades') {
        cargarTarjetasUnidad();
    }

    // 5. Cambiar el color "Activo" en el menú lateral izquierdo
    document.querySelectorAll('.sidebar ul li a').forEach(enlace => {
        enlace.classList.remove('active');
    });
    
    const menuActivo = document.getElementById('menu-' + destino);
    if (menuActivo) {
        menuActivo.classList.add('active');
    }
}

// --- GESTIÓN DE MIS UNIDADES (TARJETAS) ---

// 1. Guardar nueva unidad
async function guardarNuevaUnidad() {
    if (!usuarioActual) return alert("Debes iniciar sesión para guardar unidades.");

    const nombre = document.getElementById('nueva-unidad-nombre').value;
    if (!nombre) return alert("El nombre de la unidad es obligatorio.");

    const payload = {
        usuarioId: usuarioActual.id,
        nombre: nombre,
        numAtaques: parseInt(document.getElementById('nueva-unidad-ataques').value) || 0,
        impactoX: parseInt(document.getElementById('nueva-unidad-impacto').value) || 0,
        
        // NUEVAS REGLAS RECOGIDAS DEL FORMULARIO
        repeticionImpacto: document.getElementById('nueva-unidad-rep-impacto').value,
        especialSeisImpacto: document.getElementById('nueva-unidad-esp-impacto').value,
        
        herirX: parseInt(document.getElementById('nueva-unidad-herir').value) || 0,
        
        // NUEVAS REGLAS DE HERIDA RECOGIDAS
        repeticionHerir: document.getElementById('nueva-unidad-rep-herir').value,
        seisHeridaInsalvable: document.getElementById('nueva-unidad-devastadoras').checked,
        
        salvacionX: parseInt(document.getElementById('nueva-unidad-salvacion').value) || 7,
        danoPorAtaque: parseInt(document.getElementById('nueva-unidad-dano').value) || 1,
        noHayDolorX: parseInt(document.getElementById('nueva-unidad-fnp').value) || 0,
        notas: document.getElementById('nueva-unidad-notas').value || ""
    };

    try {
        const response = await fetch('http://localhost:8080/api/tarjetas/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Unidad guardada con éxito.");
            
            // Limpiar formulario tras guardar
            document.getElementById('nueva-unidad-nombre').value = '';
            document.getElementById('nueva-unidad-notas').value = '';
            document.getElementById('nueva-unidad-rep-impacto').value = 'NONE';
            document.getElementById('nueva-unidad-esp-impacto').value = 'NONE';
            document.getElementById('nueva-unidad-rep-herir').value = 'NONE';
            document.getElementById('nueva-unidad-devastadoras').checked = false;
            
            cargarTarjetasUnidad(); // Recargar la lista
        } else {
            alert("Error al guardar la unidad.");
        }
    } catch (e) {
        console.error("Error de conexión:", e);
    }
}

// 2. Cargar las unidades del usuario
async function cargarTarjetasUnidad() {
    if (!usuarioActual) return;
    const contenedor = document.getElementById('lista-tarjetas-unidad');
    
    if (!contenedor) return; // Por si el contenedor no existe aún

    try {
        const response = await fetch(`http://localhost:8080/api/tarjetas/usuario/${usuarioActual.id}`);
        const tarjetas = await response.json();

        if (tarjetas.length === 0) {
            contenedor.innerHTML = '<p style="color: var(--text-muted);">No tienes unidades guardadas. Crea una arriba.</p>';
            return;
        }

        // Dibujar las tarjetas
        contenedor.innerHTML = tarjetas.map(t => `
            <div class="tarjeta-unidad" style="background: #222; border: 1px solid var(--accent); padding: 15px; border-radius: 5px; cursor: pointer;" 
                 onclick='equiparUnidad(${JSON.stringify(t).replace(/'/g, "&#39;")})'>
                <h4 style="color: var(--accent); margin: 0 0 10px 0;">${t.nombre}</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 10px 0;">${t.notas || 'Sin notas tácticas'}</p>
                <div style="font-size: 0.85rem; color: #ccc;">
                    Ataques: <strong>${t.numAtaques}</strong> | Impacto: <strong>${t.impactoX}+</strong><br>
                    Herir: <strong>${t.herirX}+</strong> | Daño: <strong>${t.danoPorAtaque}</strong>
                </div>
                <div style="margin-top: 10px; text-align: right;">
                    <button onclick="event.stopPropagation(); borrarTarjeta(${t.id})" style="background: transparent; border: 1px solid #e74c3c; color: #e74c3c; padding: 3px 8px; border-radius: 3px; font-size: 0.75rem; cursor: pointer;">Borrar</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error al cargar tarjetas:", e);
    }
}

// 3. LA MAGIA: Equipar la unidad en el simulador
function equiparUnidad(tarjeta) {
    // Función auxiliar para asegurarnos de que el elemento existe antes de darle valor
    const setValor = (id, valor) => {
        const elemento = document.getElementById(id);
        if (elemento && valor !== undefined) elemento.value = valor;
    };

    // Usamos los IDs exactos de tu HTML
    setValor('numAtaques', tarjeta.numAtaques);
    setValor('impactoX', tarjeta.impactoX);
    setValor('herirX', tarjeta.herirX);
    setValor('salvacionX', tarjeta.salvacionX);
    setValor('dañoPorAtaque', tarjeta.danoPorAtaque);
    setValor('noHayDolorX', tarjeta.noHayDolorX || 0);
    
    // Si tienes inputs para repeticiones guardadas en BBDD, se aplicarían aquí
    if (tarjeta.repeticionImpacto) setValor('repeticionImpacto', tarjeta.repeticionImpacto);
    if (tarjeta.especialSeisImpacto) setValor('especialSeisImpacto', tarjeta.especialSeisImpacto);
    if (tarjeta.repeticionHerir) setValor('repeticionHerir', tarjeta.repeticionHerir);
}