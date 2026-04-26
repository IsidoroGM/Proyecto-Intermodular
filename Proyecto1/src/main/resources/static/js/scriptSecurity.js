/**
 * Función mágica para añadir el Token a cualquier petición
 */
function getAuthHeaders() {
    const user = JSON.parse(localStorage.getItem('warmetrics_user'));
    const headers = { 'Content-Type': 'application/json' };
    
    if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`; // Añadimos el pase VIP
    }
    return headers;
}

// EJEMPLO DE USO en ejecutarSimulacion():
async function ejecutarSimulacion() {
    // ... payload ...
    try {
        const response = await fetch(`${API_BASE}/v1/combate/simular`, {
            method: 'POST',
            headers: getAuthHeaders(), // <-- Ahora usamos los headers con Token
            body: JSON.stringify(payload)
        });
        // ... resto de la lógica ...
    } catch (e) { /* ... */ }
}