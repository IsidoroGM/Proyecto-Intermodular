/***********************************************
 * 5. GESTIÓN DE LA ARMERÍA (TARJETAS DE UNIDAD)
 **********************************************/

// --- VARIABLES GLOBALES DE ARMERÍA ---
let idTarjetaEditando = null; // Guardará el ID de la tarjeta que estamos modificando

// Variable global para no perder los datos de las tarjetas
let misTarjetasGlobal = []; 

// 1. Cargar las unidades del usuario (Versión a prueba de fallos)
async function cargarTarjetasUnidad() {
    if (typeof usuarioActual === 'undefined' || !usuarioActual) return;
    
    const contenedor = document.getElementById('lista-tarjetas-unidad');
    if (!contenedor) return; 

    try {
        // CORRECCIÓN: Usamos la constante API_BASE
        const response = await fetch(`${API_BASE}/tarjetas/usuario/${usuarioActual.id}`, {
            method: 'GET',
            headers: getAuthHeaders() // <-- ¡AQUÍ ESTÁ LA MAGIA QUE ENSEÑA EL TOKEN!
        });

        if (!response.ok) {
            throw new Error("Petición denegada por el servidor");
        }
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

// 2. Cargar las tarjetas al iniciar sesión (Llamada desde script.js tras login exitoso)
async function guardarNuevaUnidad() {
    // 1. Verificamos si hay usuario logueado de forma estricta
    if (!usuarioActual || !usuarioActual.id) {
        alert("⚠️ Comandante, debe iniciar sesión para guardar unidades en la armería.");
        return;
    }

    // 2. Recogemos el nombre y las notas
    const nombre = document.getElementById('nueva-unidad-nombre').value; 
    const notas = document.getElementById('nueva-unidad-notas').value; 
    
    if (!nombre) {
        alert("⚠️ La unidad necesita un nombre para ser identificada.");
        return;
    }

    // 3. Empaquetamos los datos usando los IDs del formulario
    const payload = {
        usuarioId: usuarioActual.id,
        nombre: nombre,
        notas: notas,
        numAtaques: parseInt(document.getElementById('nueva-unidad-ataques').value) || 0,
        impactoX: parseInt(document.getElementById('nueva-unidad-impacto').value) || 0,
        repeticionImpacto: document.getElementById('nueva-unidad-rep-impacto').value,
        especialSeisImpacto: document.getElementById('nueva-unidad-esp-impacto').value,
        herirX: parseInt(document.getElementById('nueva-unidad-herir').value) || 0,
        repeticionHerir: document.getElementById('nueva-unidad-rep-herir').value,
        seisHeridaInsalvable: document.getElementById('nueva-unidad-devastadoras').checked,
        salvacionX: parseInt(document.getElementById('nueva-unidad-salvacion').value) || 7,
        danoPorAtaque: parseInt(document.getElementById('nueva-unidad-dano').value) || 1,
        noHayDolorX: parseInt(document.getElementById('nueva-unidad-fnp').value) || 0
    };

    // 4. MAGIA CRUD: Decidimos la ruta y el método
    // Si tenemos un ID, sobrescribimos (PUT). Si no, creamos una nueva (POST).
    const url = idTarjetaEditando 
                ? `${API_BASE}/tarjetas/${idTarjetaEditando}` 
                : `${API_BASE}/tarjetas/guardar`;
                
    const metodo = idTarjetaEditando ? 'PUT' : 'POST';

    // 5. Enviamos al Backend con nuestra cabecera JWT
    try {
        const response = await fetch(url, {
            method: metodo,
            headers: getAuthHeaders(), // Pasaporte VIP siempre presente
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Mensaje dinámico según si hemos editado o creado
            alert(idTarjetaEditando ? `¡Unidad "${nombre}" actualizada con éxito!` : `¡Unidad "${nombre}" guardada en la armería!`);
            
            // Limpiamos los campos y el estado
            resetearFormularioArmeria();
            
            // Recargamos la vista de las tarjetas
            if (typeof cargarTarjetasUnidad === 'function') {
                cargarTarjetasUnidad();
            }
        } else {
            alert("❌ Hubo un error en los servidores de la armería al intentar guardar.");
        }
    } catch (error) {
        console.error("Error de conexión al guardar tarjeta:", error);
        alert("⚠️ Error de conexión: El motor de WarMetrics no responde.");
    }
}

// 3. Función intermedia para equipar (Busca los datos de forma segura)
function prepararEquiparUnidad(idTarjeta) {
    const tarjeta = misTarjetasGlobal.find(t => t.id === idTarjeta);
    if (tarjeta) {
        equiparUnidad(tarjeta);
    } else {
        alert("Error al intentar recuperar los datos de la unidad.");
    }
}

// 4. Equipar la unidad en el simulador
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

// 5. Edición de tarjetas 
function prepararEdicion(id) {
    // 1. Buscamos los datos de la tarjeta en nuestra lista global (cargada previamente en script.js)
    const tarjeta = misTarjetasGlobal.find(t => t.id === id);
    if (!tarjeta) return;

    // 2. Rellenamos el formulario de la Armería con los datos
    document.getElementById('nueva-unidad-nombre').value = tarjeta.nombre;
    document.getElementById('nueva-unidad-ataques').value = tarjeta.numAtaques;
    document.getElementById('nueva-unidad-dano').value = tarjeta.danoPorAtaque;
    document.getElementById('nueva-unidad-impacto').value = tarjeta.impactoX;
    document.getElementById('nueva-unidad-rep-impacto').value = tarjeta.repeticionImpacto;
    document.getElementById('nueva-unidad-esp-impacto').value = tarjeta.especialSeisImpacto;
    document.getElementById('nueva-unidad-herir').value = tarjeta.herirX;
    document.getElementById('nueva-unidad-rep-herir').value = tarjeta.repeticionHerir;
    document.getElementById('nueva-unidad-devastadoras').checked = tarjeta.seisHeridaInsalvable;
    document.getElementById('nueva-unidad-salvacion').value = tarjeta.salvacionX;
    document.getElementById('nueva-unidad-fnp').value = tarjeta.noHayDolorX;
    document.getElementById('nueva-unidad-notas').value = tarjeta.notas;

    // 3. Cambiamos el estado a "Editando"
    idTarjetaEditando = id;
    
    // 4. Feedback visual: Cambiamos el texto del botón de guardado
    const btnGuardar = document.querySelector('#pantalla-unidades .card-footer .btn-primary');
    if(btnGuardar) btnGuardar.innerText = "Actualizar Unidad en Armería";

    // 5. Scroll suave hasta el formulario para que el usuario sepa dónde ir
    document.querySelector('#pantalla-unidades .step-group').scrollIntoView({ behavior: 'smooth' });
}

// 6. Eliminar una tarjeta 
async function borrarTarjeta(id) {
    if (!confirm("Comandante, ¿está seguro de que desea eliminar esta unidad de los registros?")) return;
    
    try {
        const response = await fetch(`${API_BASE}/tarjetas/${id}`, { 
            method: 'DELETE',
            headers: getAuthHeaders() // <-- ¡AQUÍ ESTÁ LA CLAVE! Enseñamos el token
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

function resetearFormularioArmeria() {
    // 1. Dejamos de "editar"
    idTarjetaEditando = null;

    // 2. Vaciamos todos los campos visuales a sus valores por defecto
    document.getElementById('nueva-unidad-nombre').value = '';
    document.getElementById('nueva-unidad-notas').value = '';
    document.getElementById('nueva-unidad-ataques').value = 1;
    document.getElementById('nueva-unidad-dano').value = 1;
    document.getElementById('nueva-unidad-impacto').value = 3;
    document.getElementById('nueva-unidad-rep-impacto').value = 'NONE';
    document.getElementById('nueva-unidad-esp-impacto').value = 'NONE';
    document.getElementById('nueva-unidad-herir').value = 4;
    document.getElementById('nueva-unidad-rep-herir').value = 'NONE';
    document.getElementById('nueva-unidad-devastadoras').checked = false;
    document.getElementById('nueva-unidad-salvacion').value = 5;
    document.getElementById('nueva-unidad-fnp').value = 0;

    // 3. Devolvemos el botón a su texto original
    const btnGuardar = document.querySelector('#pantalla-unidades .card-footer .btn-primary');
    if(btnGuardar) btnGuardar.innerText = "Guardar en Armería";
}