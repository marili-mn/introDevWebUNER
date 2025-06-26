// Verificar que la configuración esté disponible
if (!window.API_URL) {
    throw new Error('La configuración de la API no está disponible. Asegúrate de que config.js se cargue primero.');
}

// Función para verificar si el usuario está autenticado
window.isAuthenticated = function() {
    return sessionStorage.getItem('accessToken') !== null;
}

// Función para obtener el token de autenticación
window.getAccessToken = function() {
    return sessionStorage.getItem('accessToken');
}

// Función para iniciar sesión
window.login = async function(username, password) {
    try {
        const response = await fetch(window.API_URL.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            sessionStorage.setItem('accessToken', data.token);
            return true;
        } else {
            throw new Error(data.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Error al iniciar sesión: ' + (error.message || 'Error desconocido'));
    }
}

// Función para cerrar sesión
window.logout = function() {
    sessionStorage.removeItem('accessToken');
    window.location.href = 'login.html';
}

// Middleware para verificar autenticación
window.checkAuth = function() {
    if (!window.isAuthenticated()) {
        window.location.href = 'login.html';
    }
}
