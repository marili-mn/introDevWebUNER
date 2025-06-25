// js/app.js
// Usar variables globales en lugar de importaciones ES6
const INITIAL_SALONES = window.INITIAL_SALONES;
const INITIAL_SERVICIOS = window.INITIAL_SERVICIOS;
const INITIAL_IMAGENES = window.INITIAL_IMAGENES;

// Función para obtener todos los usuarios
async function fetchUsers() {
    try {
        const response = await fetch(window.API_URL.USERS);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.users; // La API de dummyjson devuelve un objeto con la propiedad users
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
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
        mostrarMensaje('Error al cargar los usuarios. Por favor, inténtalo nuevamente.');
    });
}

/**************************
 * Inicialización de LocalStorage
 **************************/
function initLocalStorage() {
  // Inicializar salones
  const salones = localStorage.getItem('salones');
  if (!salones) {
    localStorage.setItem('salones', JSON.stringify(INITIAL_SALONES));
  }

  // Inicializar servicios
  const servicios = localStorage.getItem('servicios');
  if (!servicios) {
    localStorage.setItem('servicios', JSON.stringify(INITIAL_SERVICIOS));
  }

  // Inicializar carrito
  const carrito = localStorage.getItem('carrito');
  if (!carrito) {
    localStorage.setItem('carrito', JSON.stringify([]));
  }

  // Inicializar imágenes
  const imagenes = localStorage.getItem('imagenes');
  if (!imagenes) {
    localStorage.setItem('imagenes', JSON.stringify(INITIAL_IMAGENES));
  }
}

/**************************
 * Utilidades de LocalStorage
 **************************/
function getSalones() {
  const salones = JSON.parse(localStorage.getItem("salones")) || [];
  console.log("Salones obtenidos:", salones);
  return salones;
}

function saveSalones(salones) {
  localStorage.setItem("salones", JSON.stringify(salones));
}

function getServicios() {
  return JSON.parse(localStorage.getItem("servicios")) || [];
}

function generateId(items) {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

// Funciones del carrito
function getCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

function saveCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(item) {
  const carrito = getCarrito();
  carrito.push(item);
  saveCarrito(carrito);
  mostrarMensaje(`¡${item.nombre} agregado al carrito!`);
}

function removerDelCarrito(id) {
  const carrito = getCarrito();
  const nuevoCarrito = carrito.filter(item => item.id.toString() !== id.toString());
  saveCarrito(nuevoCarrito);
  actualizarCarrito();
  mostrarMensaje('Elemento removido del carrito');
}

function vaciarCarrito() {
  saveCarrito([]);
}

function actualizarCarrito() {
  const carrito = getCarrito();
  const carritoContenido = document.getElementById('carrito-contenido');
  const carritoTotal = document.getElementById('carrito-total');
  
  if (!carritoContenido || !carritoTotal) return;

  // Calcular total
  const total = carrito.reduce((sum, item) => sum + (item.precio || 0), 0);
  
  // Renderizar items
  carritoContenido.innerHTML = carrito.length > 0 ? carrito.map(item => `
      <div class="card mb-2">
          <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                  <div>
                      <h6 class="card-title mb-1">${item.nombre}</h6>
                      <p class="card-text small mb-0">${item.tipo === 'salon' ? 'Salón' : 'Servicio'}</p>
                      <p class="card-text small text-muted">$${item.precio?.toLocaleString('es-AR') || '0'}</p>
                  </div>
                  <button class="btn btn-sm btn-danger" onclick="removerDelCarrito('${item.id}')">Quitar</button>
              </div>
          </div>
      </div>
  `).join('') : '<p class="text-muted">El carrito está vacío</p>';

  // Actualizar total
  carritoTotal.textContent = `$${total.toLocaleString('es-AR')}`;
}

function procesarCompra() {
  const carrito = getCarrito();
  if (carrito.length === 0) {
    mostrarMensaje('El carrito está vacío');
    return;
  }

  // Aquí podrías implementar la lógica de procesamiento de compra
  mostrarMensaje('¡Compra procesada exitosamente!');
  vaciarCarrito();
  actualizarCarrito();
}

function getServicioById(id) {
  const servicios = getServicios();
  return servicios.find(servicio => servicio.id === parseInt(id));
}

function mostrarMensaje(mensaje) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function mostrarMensaje(mensaje) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/**************************
 * CRUD Salones
 **************************/
function createSalon(salonData) {
  const salones = getSalones();
  const newSalon = {
    id: generateId(salones),
    ...salonData
  };
  salones.push(newSalon);
  saveSalones(salones);
  return newSalon;
}

function updateSalon(id, salonData) {
  const salones = getSalones();
  const index = salones.findIndex(s => s.id === id);
  if (index !== -1) {
    salones[index] = { id, ...salonData };
    saveSalones(salones);
    return salones[index];
  }
  return null;
}

function deleteSalon(id) {
  const salones = getSalones().filter(s => s.id !== id);
  saveSalones(salones);
  return true;
}

function getSalonById(id) {
  return getSalones().find(s => s.id === id);
}

/**************************
 * Renderizado de Tablas HTML
 **************************/
function renderSalonesTable() {
  const tbody = document.getElementById("salonesTableBody");
  if (!tbody) return;

  const salones = getSalones();
  tbody.innerHTML = salones.map(salon => `
    <tr>
      <td>${salon.id}</td>
      <td>${salon.nombre}</td>
      <td>${salon.ubicacion}</td>
      <td>${salon.capacidad}</td>
      <td>$${salon.precio.toLocaleString('es-AR')}</td>
      <td>${Array.isArray(salon.servicios) ? salon.servicios.join(', ') : salon.servicios}</td>
      <td>
        <button class="btn btn-info btn-sm" onclick="viewSalon(${salon.id})">
          <i class="fas fa-eye"></i> Ver
        </button>
        <button class="btn btn-warning btn-sm" onclick="editSalon(${salon.id})">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-danger btn-sm" onclick="confirmDeleteSalon(${salon.id})">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  `).join("");
}



/**************************
 * Funciones de Formulario
 **************************/
function saveSalonFromForm(event) {
  event.preventDefault();

  // Obtener servicios seleccionados
  const serviciosSeleccionados = Array.from(
    document.querySelectorAll('input[name="servicios"]:checked')
  ).map(checkbox => checkbox.value);

  const salonData = {
    nombre: document.getElementById('nombre').value,
    ubicacion: document.getElementById('ubicacion').value,
    capacidad: parseInt(document.getElementById('capacidad').value),
    precio: parseFloat(document.getElementById('precio').value),
    servicios: serviciosSeleccionados,
    imagenes: [document.getElementById('imagenes').value],
    descripcion: document.getElementById('descripcion').value
  };

  const salonId = document.getElementById('salonId').value;

  if (salonId) {
    updateSalon(parseInt(salonId), salonData);
  } else {
    createSalon(salonData);
  }

  // Resetear formulario
  document.getElementById('salonForm').reset();
  document.getElementById('salonId').value = '';
  
  // Actualizar UI
  renderSalonesTable();
  renderSalonesEnCatalogo();
  
  // Cerrar modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('salonModal'));
  if (modal) modal.hide();
}

/**************************
 * Funciones de Edición
 **************************/
function editSalon(id) {
  const salon = getSalonById(id);
  if (!salon) return;

  document.getElementById('salonId').value = salon.id;
  document.getElementById('nombre').value = salon.nombre;
  document.getElementById('ubicacion').value = salon.ubicacion;
  document.getElementById('capacidad').value = salon.capacidad;
  document.getElementById('precio').value = salon.precio;
  document.getElementById('descripcion').value = salon.descripcion || '';
  
  // Imagen principal (primera imagen)
  document.getElementById('imagenes').value = 
    Array.isArray(salon.imagenes) ? salon.imagenes[0] : salon.imagenes || '';

  // Seleccionar servicios
  const serviciosCheckboxes = document.querySelectorAll('input[name="servicios"]');
  serviciosCheckboxes.forEach(checkbox => {
    checkbox.checked = Array.isArray(salon.servicios) ? 
      salon.servicios.includes(checkbox.value) : false;
  });

  // Abrir modal
  const modal = new bootstrap.Modal(document.getElementById('salonModal'));
  modal.show();
}

/**************************
 * Funciones de Visualización
 **************************/
function viewSalon(id) {
  const salon = getSalonById(id);
  if (!salon) return;

  const modalBody = document.getElementById('viewSalonModalBody');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <h5>Información del Salón</h5>
        <p><strong>Nombre:</strong> ${salon.nombre}</p>
        <p><strong>Ubicación:</strong> ${salon.ubicacion}</p>
        <p><strong>Capacidad:</strong> ${salon.capacidad} personas</p>
        <p><strong>Precio:</strong> $${salon.precio.toLocaleString('es-AR')}</p>
        <p><strong>Descripción:</strong> ${salon.descripcion || 'Sin descripción'}</p>
      </div>
      <div class="col-md-6">
        <h5>Servicios Incluidos</h5>
        <ul>
          ${Array.isArray(salon.servicios) ? 
            salon.servicios.map(s => `<li>${s}</li>`).join('') : 
            `<li>${salon.servicios}</li>`}
        </ul>
        <h5>Imágenes</h5>
        <img src="${Array.isArray(salon.imagenes) ? salon.imagenes[0] : salon.imagenes}" 
             class="img-fluid rounded" alt="${salon.nombre}">
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('viewSalonModal'));
  modal.show();
}

/**************************
 * Confirmación de Eliminación
 **************************/
function confirmDeleteSalon(id) {
  if (confirm('¿Está seguro de que desea eliminar este salón?')) {
    deleteSalon(id);
    renderSalonesTable();
    renderSalonesEnCatalogo();
  }
}

/**************************
 * Renderizado dinámico en el catálogo
 *************************/
function renderSalonesEnCatalogo() {
  // Solo renderizar en la página principal
  if (window.location.pathname !== '/index.html') {
    return;
  }

  const grid = document.querySelector('.salones-grid');
  if (!grid) {
    console.error("No se encontró el contenedor de salones");
    return;
  }

  const salones = getSalones();
  const servicios = getServicios();
  
  // Renderizar servicios
  const serviciosHtml = servicios.map(servicio => `
    <div class="col-12 mb-3">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${servicio.nombre}</h5>
          <p class="card-text">${servicio.descripcion || 'Descripción no disponible'}</p>
          <p class="card-text"><strong>Precio:</strong> $${servicio.precio.toLocaleString('es-AR')}</p>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" 
                   name="servicios" 
                   data-id="${servicio.id}" 
                   data-nombre="${servicio.nombre}"
                   data-precio="${servicio.precio}"
                   id="servicio${servicio.id}">
            <label class="form-check-label" for="servicio${servicio.id}">
              Agregar servicio ($${servicio.precio.toLocaleString('es-AR')})
            </label>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Renderizar salones
  const salonesHtml = salones.map(salon => {
    // Usar la primera imagen del array de imágenes del salón
    const imagenUrl = salon.imagenes ? salon.imagenes[0] : 'images/default-salon.jpg';
    
    return `
    <div class="col-12 mb-3">
      <div class="card">
        <img src="${imagenUrl}" class="card-img-top" alt="${salon.nombre}" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${salon.nombre}</h5>
          <p class="card-text">${salon.descripcion || 'Descripción no disponible'}</p>
          <p class="card-text"><strong>Capacidad:</strong> ${salon.capacidad} personas</p>
          <p class="card-text"><strong>Precio:</strong> $${salon.precio?.toLocaleString('es-AR') || '0'}</p>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" 
                   name="salones" 
                   data-id="${salon.id}"
                   data-nombre="${salon.nombre}"
                   data-precio="${salon.precio || 0}"
                   id="salon${salon.id}">
            <label class="form-check-label" for="salon${salon.id}">
              Reservar salon ($${salon.precio?.toLocaleString('es-AR') || '0'})
            </label>
          </div>
        </div>
      </div>
    </div>
  `}).join('');

  // Combinar servicios y salones
  grid.innerHTML = serviciosHtml + salonesHtml;
}

/**************************
 * Inicialización de la aplicación
 **************************/
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar LocalStorage
  initLocalStorage();

  // Inicializar autenticación
  window.initAuth();

  // Configurar eventos para la página principal
  if (window.location.pathname === '/index.html') {
    // Eventos para servicios
    const serviciosCheckboxes = document.querySelectorAll('input[name="servicios"]');
    serviciosCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          agregarAlCarrito({
            id: e.target.dataset.id,
            nombre: e.target.dataset.nombre,
            precio: parseFloat(e.target.dataset.precio),
            tipo: 'servicio'
          });
        } else {
          removerDelCarrito(e.target.dataset.id);
        }
        actualizarCarrito();
      });
    });

    // Eventos para salones
    const salonesCheckboxes = document.querySelectorAll('input[name="salones"]');
    salonesCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          agregarAlCarrito({
            id: e.target.dataset.id,
            nombre: e.target.dataset.nombre,
            precio: parseFloat(e.target.dataset.precio),
            tipo: 'salon'
          });
        } else {
          removerDelCarrito(e.target.dataset.id);
        }
        actualizarCarrito();
      });
    });

    // Eventos para el carrito
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    if (vaciarCarritoBtn) {
      vaciarCarritoBtn.addEventListener('click', () => {
        vaciarCarrito();
        actualizarCarrito();
      });
    }

    const procesarCompraBtn = document.getElementById('procesar-compra');
    if (procesarCompraBtn) {
      procesarCompraBtn.addEventListener('click', procesarCompra);
    }

    // Inicializar el carrito
    actualizarCarrito();

    // Asegurar que los datos estén disponibles
    setTimeout(() => {
      renderSalonesEnCatalogo();
    }, 1000);
  }

  // Configurar la tabla de salones si existe
  const tbody = document.getElementById("salonesTableBody");
  if (tbody) {
    renderSalonesTable();
    populateServiciosCheckboxes();
    
    // Event listener para formulario
    const salonForm = document.getElementById("salonForm");
    if (salonForm) {
      salonForm.addEventListener("submit", saveSalonFromForm);
    }
  }

  // Configurar la tabla de usuarios si existe
  const usuariosTbody = document.getElementById("usuariosTableBody");
  if (usuariosTbody) {
    renderUsersTable();
  }
});

// Función para renderizar la tabla de usuarios
function renderUsersTable() {
    const tbody = document.getElementById("usuariosTableBody");
    if (!tbody) return;

    // Obtener usuarios usando la API de dummyjson
    fetch(window.API_URL.USERS)
        .then(response => response.json())
        .then(data => {
            const users = data.users;
            tbody.innerHTML = users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
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
        })
        .catch(error => console.error('Error al cargar usuarios:', error));
}

// Exponer funciones globalmente para uso en HTML
window.editSalon = editSalon;
window.viewSalon = viewSalon;
window.confirmDeleteSalon = confirmDeleteSalon;