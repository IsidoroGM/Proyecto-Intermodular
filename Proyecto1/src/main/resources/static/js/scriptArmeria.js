// --- VARIABLES GLOBALES DE ARMERÍA ---
let idTarjetaEditando = null; // Guardará el ID de la tarjeta que estamos modificando

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