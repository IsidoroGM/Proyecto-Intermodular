// --- FUNCIONALIDAD: GUARDAR TARJETA DE UNIDAD ---
async function guardarNuevaUnidad() {
    // 1. Verificamos si hay usuario logueado
    if (!usuarioActual) {
        alert("Comandante, debe iniciar sesión para guardar unidades en la armería.");
        return;
    }

    // 2. Recogemos el nombre y las notas
    const nombre = document.getElementById('nueva-unidad-nombre').value; 
    const notas = document.getElementById('nueva-unidad-notas').value; 
    
    if (!nombre) {
        alert("La unidad necesita un nombre para ser identificada.");
        return;
    }

    // 3. Empaquetamos los datos usando los IDs del formulario "Registrar Nueva Unidad"
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
        salvacionX: parseInt(document.getElementById('nueva-unidad-salvacion').value) || 7, // 7 suele ser "sin salvación" en Warhammer
        danoPorAtaque: parseInt(document.getElementById('nueva-unidad-dano').value) || 1,
        noHayDolorX: parseInt(document.getElementById('nueva-unidad-fnp').value) || 0
    };

    // 4. Enviamos al Backend
    try {
        const response = await fetch('http://localhost:8080/api/tarjetas/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(`¡Unidad "${nombre}" guardada en la armería con éxito!`);
            
            // 5. Limpiamos los campos para que queden vacíos para la próxima vez
            document.getElementById('nueva-unidad-nombre').value = '';
            document.getElementById('nueva-unidad-notas').value = '';
            document.getElementById('nueva-unidad-rep-impacto').value = 'NONE';
            document.getElementById('nueva-unidad-esp-impacto').value = 'NONE';
            document.getElementById('nueva-unidad-rep-herir').value = 'NONE';
            document.getElementById('nueva-unidad-devastadoras').checked = false;
            
            // 6. Recargamos la vista usando el nombre correcto de la función
            if (typeof cargarTarjetasUnidad === 'function') {
                cargarTarjetasUnidad();
            }
        } else {
            alert("Hubo un error en los servidores de la armería.");
        }
    } catch (error) {
        console.error("Error al guardar tarjeta:", error);
    }
}