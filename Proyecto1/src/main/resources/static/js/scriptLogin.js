// --- VARIABLES GLOBALES DE USUARIO ---
let usuarioActual = null; // Guardará { id: 1, username: "Pepe" }

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
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        if (response.ok) {
            usuarioActual = await response.json();
            localStorage.setItem('warmetrics_user', JSON.stringify(usuarioActual)); // Guardamos sesión
            actualizarInterfazAuth();
            msj.innerText = '';
        } else {
            const errorText = await response.text();
            msj.innerText = errorText;
        }
    } catch (e) {
        msj.innerText = "Error de conexión con el servidor.";
    }
}

// 3. Hacer Registro
async function hacerRegistro() {
    const user = document.getElementById('auth-username').value;
    const pass = document.getElementById('auth-password').value;
    const email = document.getElementById('auth-email').value;
    const msj = document.getElementById('auth-mensaje');

    try {
        const response = await fetch('http://localhost:8080/api/auth/registro', {
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
        msj.innerText = "Error de conexión.";
    }
}

// 4. Cerrar Sesión
function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('warmetrics_user');
    actualizarInterfazAuth();
}

// 5. Actualizar la interfaz según si estamos logueados o no
function actualizarInterfazAuth() {
    const authPanel = document.getElementById('auth-panel');
    const userPanel = document.getElementById('user-panel');
    
    if (usuarioActual) {
        // Estamos logueados
        document.getElementById('bienvenida-usuario').innerText = `Hola, ${usuarioActual.username}`;
        authPanel.classList.remove('pantalla-activa');
        authPanel.classList.add('pantalla-oculta');
        userPanel.classList.remove('pantalla-oculta');
        userPanel.classList.add('pantalla-activa');
    } else {
        // No estamos logueados
        authPanel.classList.remove('pantalla-oculta');
        authPanel.classList.add('pantalla-activa');
        userPanel.classList.remove('pantalla-activa');
        userPanel.classList.add('pantalla-oculta');
        cambiarPantalla('simulador'); // Forzamos a ver el simulador si cierra sesión en otra pestaña
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