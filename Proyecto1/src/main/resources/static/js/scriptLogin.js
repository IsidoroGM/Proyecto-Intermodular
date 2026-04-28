// --- VARIABLES GLOBALES DE USUARIO ---
let usuarioActual = null; 
const API_BASE = "http://localhost:8080/api"; 

// 1. Alternar entre Login y Registro
let modoRegistro = false;
function toggleModoAuth() {
    modoRegistro = !modoRegistro;
    document.getElementById('campo-email').style.display = modoRegistro ? 'block' : 'none';
    document.getElementById('btn-login').style.display = modoRegistro ? 'none' : 'block';
    document.getElementById('btn-registro').style.display = modoRegistro ? 'block' : 'none';
    document.getElementById('texto-toggle-auth').innerText = modoRegistro ? '¿Ya tienes cuenta? Entra aquí' : '¿No tienes cuenta? Regístrate';
    document.getElementById('auth-mensaje').innerText = ''; 
}

// 2. Hacer Login (VERSIÓN LIMPIA SIN JWT)
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
            
            // Verificamos que el backend nos ha devuelto al menos el ID y el nombre
            if(!usuarioActual.id) {
                throw new Error("El servidor no devolvió un usuario válido.");
            }
            
            // Guardamos sesión correctamente (ahora solo guardamos ID y Username)
            localStorage.setItem('warmetrics_user', JSON.stringify(usuarioActual)); 
            localStorage.setItem('usuarioId', usuarioActual.id); 
            // ELIMINADO: Ya no guardamos ningún token
            
            actualizarInterfazAuth();
            msj.innerText = '';

            if (typeof gestionarPanelGuardado === 'function') {
                gestionarPanelGuardado();
            }

        } else {
            msj.innerText = "Credenciales incorrectas. Revisa tu usuario/password.";
        }
        
    } catch (e) {
        console.error(e);
        msj.innerText = "⚠️ Error: " + e.message;
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
            toggleModoAuth();
        } else {
            msj.style.color = "#e74c3c";
            msj.innerText = texto;
        }
    } catch (e) {
        msj.innerText = "⚠️ Error de conexión con el servidor.";
    }
}

// 4. Cerrar Sesión 
function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('warmetrics_user');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('token'); // Lo dejamos por seguridad para borrar rastros de pruebas anteriores

    window.location.reload();
}

// 5. Actualizar la interfaz 
function actualizarInterfazAuth() {
    const authPanel = document.getElementById('auth-panel');
    const userPanel = document.getElementById('user-panel');
    const bienvenidaUsuario = document.getElementById('bienvenida-usuario');

    if (usuarioActual) {
        authPanel.classList.remove('pantalla-activa');
        authPanel.classList.add('pantalla-oculta');
        
        userPanel.classList.remove('pantalla-oculta');
        userPanel.classList.add('pantalla-activa');
        
        if (bienvenidaUsuario) {
            bienvenidaUsuario.innerText = `Hola, ${usuarioActual.username}`;
        }
        
        if (typeof cargarTarjetasUnidad === 'function') cargarTarjetasUnidad();
        if (typeof cargarHistorialVisual === 'function') cargarHistorialVisual();

    } else {
        authPanel.classList.remove('pantalla-oculta');
        authPanel.classList.add('pantalla-activa');
        
        userPanel.classList.remove('pantalla-activa');
        userPanel.classList.add('pantalla-oculta');
    }
}

// 6. Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const guardado = localStorage.getItem('warmetrics_user');
    if (guardado) {
        usuarioActual = JSON.parse(guardado);
        actualizarInterfazAuth();
    }
});

// --- VISIBILIDAD DE CONTRASEÑA ---
function togglePasswordVisibility() {
    const passInput = document.getElementById('auth-password');
    const eyeIcon = document.getElementById('toggle-eye');
    
    if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeIcon.innerText = '🙈';
    } else {
        passInput.type = 'password';
        eyeIcon.innerText = '👁️';
    }
}