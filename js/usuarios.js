// Verificar que la configuración esté disponible
if (!window.API_URL) {
    throw new Error('La configuración de la API no está disponible. Asegúrate de que config.js se cargue primero.');
}

// Función para obtener todos los usuarios
async function fetchUsers() {
    try {
        const response = await fetch(window.API_URL.USERS);
        if (!response.ok) {
            throw new Error('Error al obtener usuarios: ' + response.statusText);
        }
        const data = await response.json();
        return data.users || [];
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Error al obtener usuarios: ' + (error.message || 'Error desconocido'));
    }
}

// Función para renderizar la tabla de usuarios
function renderUsersTable() {
    fetchUsers().then(users => {
        const tbody = document.getElementById("usuariosTableBody");
        if (!tbody) return;

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>
                    <span class="badge bg-${user.isActive ? 'success' : 'danger'}">
                        ${user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="viewUser(${user.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    }).catch(error => {
        console.error('Error al renderizar usuarios:', error);
        showAlert('Error al cargar usuarios', 'danger');
    });
}

// Función para mostrar alertas
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
}

// Función para crear/actualizar usuario
document.getElementById('usuarioForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        id: document.getElementById('usuarioId').value,
        firstName: document.getElementById('nombre').value,
        lastName: document.getElementById('apellido').value,
        email: document.getElementById('correo').value,
        phone: document.getElementById('telefono').value,
        isActive: document.getElementById('estado').value === 'activo'
    };

    try {
        // Aquí iría la lógica para crear/actualizar en la API
        // Por ahora solo mostramos un mensaje de éxito
        showAlert('Usuario guardado exitosamente', 'success');
        document.getElementById('nuevoUsuarioModal').querySelector('.btn-close').click();
        renderUsersTable();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error al guardar el usuario', 'danger');
    }
});

// Función para cargar datos de usuario
async function cargarUsuario(userId) {
    // Verificar autenticación
    if (!window.isAuthenticated()) {
        throw new Error('No autorizado');
    }

    try {
        const response = await fetch(`${window.API_URL.USERS}/${userId}`);
        if (!response.ok) throw new Error('Error al obtener el usuario');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para editar usuario
function editUser(userId) {
    // Obtener el modal
    const modal = new bootstrap.Modal(document.getElementById('nuevoUsuarioModal'));
    
    // Cargar datos del usuario
    cargarUsuario(userId).then(user => {
        // Poblar el formulario con los datos del usuario
        document.getElementById('usuarioId').value = user.id;
        document.getElementById('nombre').value = user.firstName;
        document.getElementById('apellido').value = user.lastName;
        document.getElementById('correo').value = user.email;
        document.getElementById('telefono').value = user.phone;
        document.getElementById('estado').value = user.isActive ? 'activo' : 'inactivo';
        
        // Mostrar el modal
        modal.show();
    }).catch(error => {
        showAlert('Error al cargar el usuario: ' + error.message, 'danger');
    });
}

// Función para ver usuario
function viewUser(userId) {
    // Obtener el modal
    const modal = new bootstrap.Modal(document.getElementById('nuevoUsuarioModal'));
    
    // Cargar datos del usuario
    cargarUsuario(userId).then(user => {
        // Poblar el formulario con los datos del usuario
        document.getElementById('usuarioId').value = user.id;
        document.getElementById('nombre').value = user.firstName;
        document.getElementById('apellido').value = user.lastName;
        document.getElementById('correo').value = user.email;
        document.getElementById('telefono').value = user.phone;
        document.getElementById('estado').value = user.isActive ? 'activo' : 'inactivo';
        
        // Deshabilitar el formulario para ver solo
        document.getElementById('usuarioForm').querySelectorAll('input, select').forEach(input => {
            input.disabled = true;
        });
        
        // Mostrar el modal
        modal.show();
    }).catch(error => {
        showAlert('Error al cargar el usuario: ' + error.message, 'danger');
    });
}

// Función para confirmar eliminación de usuario
function confirmDeleteUser(userId) {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
        // Aquí iría la lógica para eliminar el usuario
        // Por ahora solo mostramos un mensaje de éxito
        showAlert('Usuario eliminado exitosamente', 'success');
        renderUsersTable();
    }
}

// Función para eliminar usuario
function confirmDeleteUser(userId) {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
        // Aquí iría la lógica para eliminar el usuario
        // Por ahora solo mostramos un mensaje de éxito
        showAlert('Usuario eliminado exitosamente', 'success');
        renderUsersTable();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    window.checkAuth();
    renderUsersTable();
});
