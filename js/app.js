const INITIAL_SALONES = window.INITIAL_SALONES;
const INITIAL_SERVICIOS = window.INITIAL_SERVICIOS;
const INITIAL_IMAGENES = window.INITIAL_IMAGENES;

// Fetch all users from the API
async function fetchUsers() {
  try {
    const response = await fetch(window.API_URL.USERS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    mostrarMensaje('No se pudieron cargar los usuarios. Inténtalo de nuevo.');
    throw error;
  }
}

// Render users table
function renderUsersTable() {
  const tbody = document.getElementById("usuariosTableBody");
  if (!tbody) {
    console.error("Element #usuariosTableBody not found. Check HTML structure.");
    return;
  }

  fetchUsers().then(users => {
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
    console.error('Error rendering users:', error);
    mostrarMensaje('Error al cargar los usuarios. Por favor, inténtalo nuevamente.');
  });
}

// Initialize localStorage
function initLocalStorage() {
  if (!localStorage.getItem("salones")) {
    localStorage.setItem("salones", JSON.stringify(INITIAL_SALONES));
    console.log("Initializing salones from data.js");
  } else {
    console.log("Salones already exist in localStorage");
  }

  if (!localStorage.getItem("servicios")) {
    localStorage.setItem("servicios", JSON.stringify(INITIAL_SERVICIOS));
  }

  if (!localStorage.getItem("imagenes")) {
    localStorage.setItem("imagenes", JSON.stringify(INITIAL_IMAGENES));
  }
}

// LocalStorage utilities
function getSalones() {
  const salones = JSON.parse(localStorage.getItem("salones")) || [];
  console.log("Salones obtained:", salones);
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

// Cart functions
function getCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

function saveCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(item) {
  const carrito = getCarrito();
  carrito.push({ ...item, id: item.id.toString() }); // Ensure ID is string
  saveCarrito(carrito);
  mostrarMensaje(`¡${item.nombre} agregado al carrito!`);
}

function removerDelCarrito(id) {
  const carrito = getCarrito();
  const nuevoCarrito = carrito.filter(item => item.id !== id.toString());
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

  if (!carritoContenido || !carritoTotal) {
    console.error("Cart elements (#carrito-contenido or #carrito-total) not found.");
    return;
  }

  // Cache current items
  const currentItems = new Set(Array.from(carritoContenido.children).map(el => el.dataset.id));
  const newItems = new Set(carrito.map(item => item.id.toString()));

  // Remove items no longer in cart
  currentItems.forEach(id => {
    if (!newItems.has(id)) {
      const el = carritoContenido.querySelector(`[data-id="${id}"]`);
      if (el) el.remove();
    }
  });

  // Add or update items
  carrito.forEach(item => {
    const id = item.id.toString();
    let el = carritoContenido.querySelector(`[data-id="${id}"]`);
    if (!el) {
      el = document.createElement('div');
      el.dataset.id = id;
      carritoContenido.appendChild(el);
    }
    el.outerHTML = `
      <div class="card mb-2" data-id="${id}">
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
    `;
  });

  // Show empty message if needed
  if (carrito.length === 0) {
    carritoContenido.innerHTML = '<p class="text-muted">El carrito está vacío</p>';
  }

  // Update total
  const total = carrito.reduce((sum, item) => sum + (item.precio || 0), 0);
  carritoTotal.textContent = `$${total.toLocaleString('es-AR')}`;
}

function procesarCompra() {
  const carrito = getCarrito();
  if (carrito.length === 0) {
    mostrarMensaje('El carrito está vacío');
    return;
  }
  mostrarMensaje('¡Compra procesada exitosamente!');
  vaciarCarrito();
  actualizarCarrito();
}

function getServicioById(id) {
  const servicios = getServicios();
  return servicios.find(servicio => servicio.id.toString() === id.toString());
}

// Show toast message
function mostrarMensaje(mensaje) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// CRUD Salones
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

// Render venues table
function renderSalonesTable() {
  const tbody = document.getElementById("salonesTableBody");
  if (!tbody) {
    console.error("Element #salonesTableBody not found. Check HTML structure.");
    return;
  }
  const salones = getSalones();
  tbody.innerHTML = salones.map(salon => `
    <tr>
      <td>${salon.id}</td>
      <td>${salon.nombre}</td>
      <td>${salon.ubicacion}</td>
      <td>${salon.capacidad}</td>
      <td>$${salon.precio.toLocaleString('es-AR')}</td>
      <td>${Array.isArray(salon.servicios) ? salon.servicios.join(', ') : salon.servicios || 'None'}</td>
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

// Save venue from form
function saveSalonFromForm(event) {
  event.preventDefault();
  const serviciosSeleccionados = Array.from(
    document.querySelectorAll('input[name="servicios"]:checked')
  ).map(checkbox => checkbox.value);

  if (!serviciosSeleccionados.length) {
    mostrarMensaje('Por favor, selecciona al menos un servicio.');
    return;
  }

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
    mostrarMensaje('Salón actualizado exitosamente.');
  } else {
    createSalon(salonData);
    mostrarMensaje('Salón creado exitosamente.');
  }

  document.getElementById('salonForm').reset();
  document.getElementById('salonId').value = '';
  renderSalonesTable();
  renderSalonesEnCatalogo();

  const modal = bootstrap.Modal.getInstance(document.getElementById('salonModal'));
  if (modal) modal.hide();
}

// Edit venue
function editSalon(id) {
  const salon = getSalonById(id);
  if (!salon) {
    mostrarMensaje('Salón no encontrado.');
    return;
  }

  document.getElementById('salonId').value = salon.id;
  document.getElementById('nombre').value = salon.nombre;
  document.getElementById('ubicacion').value = salon.ubicacion;
  document.getElementById('capacidad').value = salon.capacidad;
  document.getElementById('precio').value = salon.precio;
  document.getElementById('descripcion').value = salon.descripcion || '';
  document.getElementById('imagenes').value = 
    Array.isArray(salon.imagenes) ? salon.imagenes[0] : salon.imagenes || '';

  const serviciosCheckboxes = document.querySelectorAll('input[name="servicios"]');
  serviciosCheckboxes.forEach(checkbox => {
    checkbox.checked = Array.isArray(salon.servicios) ? 
      salon.servicios.includes(checkbox.value) : false;
  });

  const modal = new bootstrap.Modal(document.getElementById('salonModal'));
  modal.show();
}

// View venue
function viewSalon(id) {
  const salon = getSalonById(id);
  if (!salon) {
    mostrarMensaje('Salón no encontrado.');
    return;
  }

  const modalBody = document.getElementById('viewSalonModalBody');
  if (!modalBody) {
    console.error("Element #viewSalonModalBody not found.");
    return;
  }

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
            `<li>${salon.servicios || 'None'}</li>`}
        </ul>
        <h5>Imágenes</h5>
        <img src="${Array.isArray(salon.imagenes) ? salon.imagenes[0] : salon.imagenes || '/images/default-salon.jpg'}" 
             class="img-fluid rounded" alt="${salon.nombre}">
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('viewSalonModal'));
  modal.show();
}

// Confirm delete venue
function confirmDeleteSalon(id) {
  if (confirm('¿Está seguro de que desea eliminar este salón?')) {
    deleteSalon(id);
    renderSalonesTable();
    renderSalonesEnCatalogo();
    mostrarMensaje('Salón eliminado exitosamente.');
  }
}

// Render catalog
function renderSalonesEnCatalogo() {
  const currentPath = window.location.pathname;
  if (!(currentPath === '/' || currentPath.endsWith('/index.html'))) {
    return;
  }

  const grid = document.querySelector('.salones-grid');
  if (!grid) {
    console.error("Element .salones-grid not found. Check HTML structure.");
    return;
  }

  const salones = getSalones();
  const servicios = getServicios();

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

  const salonesHtml = salones.map(salon => {
    const imagenUrl = salon.imagenes && salon.imagenes[0] ? salon.imagenes[0] : '/images/default-salon.jpg';
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
                Reservar salón ($${salon.precio?.toLocaleString('es-AR') || '0'})
              </label>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = serviciosHtml + salonesHtml;
}

// Populate services checkboxes in form
function populateServiciosCheckboxes() {
  const serviciosContainer = document.getElementById('servicios-container');
  if (!serviciosContainer) return;

  const servicios = getServicios();
  serviciosContainer.innerHTML = servicios.map(servicio => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" name="servicios" 
             value="${servicio.nombre}" id="servicio${servicio.id}">
      <label class="form-check-label" for="servicio${servicio.id}">
        ${servicio.nombre} ($${servicio.precio.toLocaleString('es-AR')})
      </label>
    </div>
  `).join('');
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initLocalStorage();

  if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
    renderSalonesEnCatalogo();

    const grid = document.querySelector('.salones-grid');
    if (grid) {
      grid.addEventListener('change', (e) => {
        const checkbox = e.target;
        if (checkbox.matches('input[name="salones"], input[name="servicios"]')) {
          const isSalon = checkbox.name === 'salones';
          const item = {
            id: checkbox.dataset.id,
            nombre: checkbox.dataset.nombre,
            precio: parseFloat(checkbox.dataset.precio),
            tipo: isSalon ? 'salon' : 'servicio'
          };
          if (checkbox.checked) {
            agregarAlCarrito(item);
          } else {
            removerDelCarrito(item.id);
          }
          actualizarCarrito();
        }
      });
    }

    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    if (vaciarCarritoBtn) {
      vaciarCarritoBtn.addEventListener('click', () => {
        vaciarCarrito();
        actualizarCarrito();
        mostrarMensaje('Carrito vaciado.');
      });
    }

    const procesarCompraBtn = document.getElementById('procesar-compra');
    if (procesarCompraBtn) {
      procesarCompraBtn.addEventListener('click', () => {
        procesarCompra();
      });
    }

    actualizarCarrito();
  }

  const tbody = document.getElementById("salonesTableBody");
  if (tbody) {
    renderSalonesTable();
    populateServiciosCheckboxes();

    const salonForm = document.getElementById("salonForm");
    if (salonForm) {
      salonForm.addEventListener("submit", saveSalonFromForm);
    }
  }

  const usuariosTbody = document.getElementById("usuariosTableBody");
  if (usuariosTbody) {
    renderUsersTable();
  }
});

// Expose functions globally
window.editSalon = editSalon;
window.viewSalon = viewSalon;
window.confirmDeleteSalon = confirmDeleteSalon;