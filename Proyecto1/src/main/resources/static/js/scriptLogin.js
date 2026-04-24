// --- VARIABLES GLOBALES DE USUARIO ---
let usuarioActual = null; // Guardará { id: 1, username: "Pepe" }
const API_BASE = "http://localhost:8080/api"; // Centralizamos la URL del servidor

// 1. Alternar entre Login y Registro en la interfaz
let modoRegistro = false;
function toggleModoAuth() {
    modoRegistro = !modoRegistro;
    document.getElementById('campo-email').style.display = modoRegistro ? 'block' : 'none';
    document.getElementById('btn-login').style.display = modoRegistro ? 'none' : 'block';
    document.getElementById('btn-registro').style.display = modoRegistro ? 'block' : 'none';
    document.getElementById('texto-toggle-auth').innerText = modoRegistro ? '¿Ya tienes cuenta? Entra aquí' : '¿No tienes cuenta? Regístrate';
    document.getElementById('auth-mensaje').innerText = ''; // Limpiar errores
}

// 2. Hacer Login
async function hacerLogin() {
    const user = document.getElementById('auth-username').value;
    const pass = document.getElementById('auth-password').value;
    const msj = document.getElementById('auth-mensaje');

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        if (response.ok) {
            usuarioActual = await response.json();
            
            // Verificación de integridad: el backend debe devolver el ID
            if(!usuarioActual.id) throw new Error("Datos de usuario incompletos.");
            
            // Guardamos sesión
            localStorage.setItem('warmetrics_user', JSON.stringify(usuarioActual)); 
            // Guardamos el ID suelto por compatibilidad con el script principal del historial
            localStorage.setItem('usuarioId', usuarioActual.id); 
            
            actualizarInterfazAuth();
            msj.innerText = '';

            // Refrescamos el panel de guardado si estamos en el simulador
            if (typeof gestionarPanelGuardado === 'function') {
                gestionarPanelGuardado();
            }

        } else {
            const errorText = await response.text();
            msj.innerText = "Credenciales incorrectas. Revisa tu usuario/password.";
        }
    } catch (e) {
        msj.innerText = "⚠️ El servidor de WarMetrics no responde. Inténtalo más tarde.";
    }
}

// 3. Hacer Registro
async function hacerRegistro() {
    const user = document.getElementById('auth-username').value;
    const pass = document.getElementById('auth-password').value;
    const email = document.getElementById('auth-email').value;
    const msj = document.getElementById('auth-mensaje');

    try {
        const response = await fetch(`${API_BASE}/auth/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, email: email, password: pass })
        });

        const texto = await response.text();
        if (response.ok && texto.includes("éxito")) {
            msj.style.color = "var(--accent)";
            msj.innerText = "¡Registro exitoso! Ya puedes iniciar sesión.";
            toggleModoAuth(); // Volvemos a la pantalla de login
        } else {
            msj.style.color = "#e74c3c";
            msj.innerText = texto;
        }
    } catch (e) {
        msj.innerText = "⚠️ Error de conexión con el servidor.";
    }
}

// 4. Cerrar Sesión (Versión Definitiva)
function cerrarSesion() {
    // 1. Borramos todo rastro del usuario en la memoria del navegador
    usuarioActual = null;
    localStorage.removeItem('warmetrics_user');
    localStorage.removeItem('usuarioId');

    // 2. Recargamos la página por completo (como pulsar F5)
    // Esto fuerza a la web a reiniciarse limpia y mostrará el Login por defecto
    window.location.reload();
}

// 5. Actualizar la interfaz 
function actualizarInterfazAuth() {
    // 1. Buscamos los elementos exactos que existen en tu HTML
    const authPanel = document.getElementById('auth-panel');
    const userPanel = document.getElementById('user-panel');
    const bienvenidaUsuario = document.getElementById('bienvenida-usuario');

    if (usuarioActual) {
        // --- ESTADO: LOGUEADO ---
        authPanel.classList.remove('pantalla-activa');
        authPanel.classList.add('pantalla-oculta');
        
        userPanel.classList.remove('pantalla-oculta');
        userPanel.classList.add('pantalla-activa');
        
        // 2. Cambiamos el texto del H3 con el nombre del usuario
        if (bienvenidaUsuario) {
            bienvenidaUsuario.innerText = `Hola, ${usuarioActual.username}`;
        }
        
        // 3. Guardamos sesión
        localStorage.setItem('warmetrics_user', JSON.stringify(usuarioActual));

        // 4. Cargamos los datos del backend
        if (typeof cargarTarjetasUnidad === 'function') cargarTarjetasUnidad();
        if (typeof cargarHistorialVisual === 'function') cargarHistorialVisual();

    } else {
        // --- ESTADO: NO LOGUEADO ---
        authPanel.classList.remove('pantalla-oculta');
        authPanel.classList.add('pantalla-activa');
        
        userPanel.classList.remove('pantalla-activa');
        userPanel.classList.add('pantalla-oculta');
    }
}

// 6. Al cargar la página, comprobar si ya estábamos logueados antes
document.addEventListener("DOMContentLoaded", () => {
    const guardado = localStorage.getItem('warmetrics_user');
    if (guardado) {
        usuarioActual = JSON.parse(guardado);
        actualizarInterfazAuth();
    }
});

// --- FUNCIONALIDAD: MOSTRAR/OCULTAR CONTRASEÑA ---
function togglePasswordVisibility() {
    const passInput = document.getElementById('auth-password');
    const eyeIcon = document.getElementById('toggle-eye');
    
    if (passInput.type === 'password') {
        passInput.type = 'text'; // Mostramos el texto
        eyeIcon.innerText = '🙈'; // Cambiamos el icono a un monito tapándose los ojos (o el que prefieras)
    } else {
        passInput.type = 'password'; // Ocultamos el texto
        eyeIcon.innerText = '👁️'; // Volvemos al ojo normal
    }
}