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

/**
 * 5. GESTIÓN DE LA ARMERÍA (TARJETAS DE UNIDAD)
 */

// Guardar nueva unidad
async function guardarNuevaUnidad() {
    if (typeof usuarioActual === 'undefined' || !usuarioActual) return alert("Debes iniciar sesión para guardar unidades.");

    const nombre = document.getElementById('nueva-unidad-nombre').value;
    if (!nombre) return alert("El nombre de la unidad es obligatorio para los archivos.");

    const payload = {
        usuarioId: usuarioActual.id,
        nombre: nombre,
        numAtaques: parseInt(document.getElementById('nueva-unidad-ataques').value) || 0,
        impactoX: parseInt(document.getElementById('nueva-unidad-impacto').value) || 0,
        repeticionImpacto: document.getElementById('nueva-unidad-rep-impacto').value,
        especialSeisImpacto: document.getElementById('nueva-unidad-esp-impacto').value,
        herirX: parseInt(document.getElementById('nueva-unidad-herir').value) || 0,
        repeticionHerir: document.getElementById('nueva-unidad-rep-herir').value,
        seisHeridaInsalvable: document.getElementById('nueva-unidad-devastadoras').checked,
        salvacionX: parseInt(document.getElementById('nueva-unidad-salvacion').value) || 7,
        danoPorAtaque: parseInt(document.getElementById('nueva-unidad-dano').value) || 1,
        noHayDolorX: parseInt(document.getElementById('nueva-unidad-fnp').value) || 0,
        notas: document.getElementById('nueva-unidad-notas').value || ""
    };

    try {
        // CORRECCIÓN: Usamos la constante API_BASE
        const response = await fetch(`${API_BASE}/tarjetas/guardar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("¡Unidad guardada con éxito en la armería!");
            
            // Limpiar formulario tras guardar
            document.getElementById('nueva-unidad-nombre').value = '';
            document.getElementById('nueva-unidad-notas').value = '';
            document.getElementById('nueva-unidad-rep-impacto').value = 'NONE';
            document.getElementById('nueva-unidad-esp-impacto').value = 'NONE';
            document.getElementById('nueva-unidad-rep-herir').value = 'NONE';
            document.getElementById('nueva-unidad-devastadoras').checked = false;
            
            cargarTarjetasUnidad(); // Recargar la lista visual
        } else {
            alert("Error al guardar la unidad. Verifica el servidor.");
        }
    } catch (e) {
        console.error("Error de conexión al guardar unidad:", e);
    }
}

// Variable global para no perder los datos de las tarjetas
let misTarjetasGlobal = []; 

// 1. Cargar las unidades del usuario (Versión a prueba de fallos)
async function cargarTarjetasUnidad() {
    if (typeof usuarioActual === 'undefined' || !usuarioActual) return;
    
    const contenedor = document.getElementById('lista-tarjetas-unidad');
    if (!contenedor) return; 

    try {
        // CORRECCIÓN: Usamos la constante API_BASE
        const response = await fetch(`${API_BASE}/tarjetas/usuario/${usuarioActual.id}`);
        const tarjetas = await response.json();
        
        // Guardamos las tarjetas en la variable global
        misTarjetasGlobal = tarjetas;

        if (tarjetas.length === 0) {
            contenedor.innerHTML = '<p style="color: var(--text-muted);">No tienes unidades guardadas. Crea una arriba.</p>';
            return;
        }

        // Dibujar las tarjetas dinámicamente PASANDO SOLO EL ID (Mucho más seguro)
        contenedor.innerHTML = tarjetas.map(t => `
            <div class="tarjeta-unidad" style="background: var(--bg-panels); border: 1px solid var(--border-dark); padding: 15px; border-radius: 5px; cursor: pointer; transition: 0.3s;" 
                 onclick="prepararEquiparUnidad(${t.id})"
                 onmouseover="this.style.borderColor='var(--accent)'" 
                 onmouseout="this.style.borderColor='var(--border-dark)'">
                <h4 style="color: var(--accent); margin: 0 0 10px 0;">${t.nombre}</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0 0 10px 0;">${t.notas || 'Sin notas tácticas'}</p>
                <div style="font-size: 0.85rem; color: #ccc;">
                    Ataques: <strong>${t.numAtaques}</strong> | Impacto: <strong>${t.impactoX}+</strong><br>
                    Herir: <strong>${t.herirX}+</strong> | Daño: <strong>${t.danoPorAtaque}</strong>
                </div>
                <div style="margin-top: 15px; text-align: right;">
                    <button onclick="event.stopPropagation(); borrarTarjeta(${t.id})" style="background: rgba(231, 76, 60, 0.1); border: 1px solid #e74c3c; color: #e74c3c; padding: 5px 10px; border-radius: 3px; font-size: 0.75rem; cursor: pointer;">Eliminar</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error al cargar las tarjetas de unidad:", e);
    }
}

// 2. Función intermedia para equipar (Busca los datos de forma segura)
function prepararEquiparUnidad(idTarjeta) {
    const tarjeta = misTarjetasGlobal.find(t => t.id === idTarjeta);
    if (tarjeta) {
        equiparUnidad(tarjeta);
    } else {
        alert("Error al intentar recuperar los datos de la unidad.");
    }
}

// Equipar la unidad en el simulador
function equiparUnidad(tarjeta) {
    const setValor = (id, valor) => {
        const elemento = document.getElementById(id);
        if (elemento && valor !== undefined && valor !== null) elemento.value = valor;
    };
    
    const setCheck = (id, checkValue) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.checked = checkValue;
    }

    setValor('numAtaques', tarjeta.numAtaques);
    setValor('impactoX', tarjeta.impactoX);
    setValor('herirX', tarjeta.herirX);
    setValor('salvacionX', tarjeta.salvacionX);
    setValor('dañoPorAtaque', tarjeta.danoPorAtaque);
    setValor('noHayDolorX', tarjeta.noHayDolorX || 0);
    
    // Selects
    if (tarjeta.repeticionImpacto) setValor('repeticionImpacto', tarjeta.repeticionImpacto);
    if (tarjeta.especialSeisImpacto) setValor('especialSeisImpacto', tarjeta.especialSeisImpacto);
    if (tarjeta.repeticionHerir) setValor('repeticionHerir', tarjeta.repeticionHerir);
    
    // Checkbox
    if (tarjeta.seisHeridaInsalvable !== undefined) setCheck('seisHeridaInsalvable', tarjeta.seisHeridaInsalvable);

    alert(`¡Unidad "${tarjeta.nombre}" lista para el combate!`);
    cambiarPantalla('simulador');
}

// Eliminar una tarjeta (Nueva función implementada)
async function borrarTarjeta(id) {
    if (!confirm("Comandante, ¿está seguro de que desea eliminar esta unidad de los registros?")) return;
    
    try {
        // CORRECCIÓN: Usamos la constante API_BASE
        const response = await fetch(`${API_BASE}/tarjetas/${id}`, { 
            method: 'DELETE' 
        });
        
        if (response.ok) {
            cargarTarjetasUnidad(); // Recargamos para que desaparezca
        } else {
            alert("Los servidores de la armería denegaron la solicitud de borrado.");
        }
    } catch (e) {
        console.error("Error de conexión al intentar borrar tarjeta:", e);
    }
}