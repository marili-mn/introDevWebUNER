// js/app.js
// Usar variables globales en lugar de importaciones ES6
const INITIAL_SALONES = window.INITIAL_SALONES;
const INITIAL_SERVICIOS = window.INITIAL_SERVICIOS;
const INITIAL_IMAGENES = window.INITIAL_IMAGENES;

// Función para obtener todos los usuarios
// Usar la configuración global de API_URL

// Solo inicializar localStorage una vez
let isLocalStorageInitialized = false;
if (!isLocalStorageInitialized) {
  initLocalStorage();
  isLocalStorageInitialized = true;
}

// Función para obtener todos los usuarios
async function fetchUsers() {
    try {
        const response = await fetch(window.API_URL.USERS);
        if (!response.ok) throw new Error('Error al obtener usuarios');
        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error('Error:', error);
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
    });
}

/**************************
 * Inicialización de LocalStorage
 **************************/
function initLocalStorage() {
  // Inicializar salones
  if (!localStorage.getItem("salones")) {
    localStorage.setItem("salones", JSON.stringify(INITIAL_SALONES));
    console.log("Inicializando salones desde data.js");
  } else {
    console.log("Salones ya existen en localStorage");
  }
  
  // Inicializar servicios
  if (!localStorage.getItem("servicios")) {
    localStorage.setItem("servicios", JSON.stringify(INITIAL_SERVICIOS));
  }
  
  // Inicializar imágenes
  if (!localStorage.getItem("imagenes")) {
    localStorage.setItem("imagenes", JSON.stringify(INITIAL_IMAGENES));
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
 **************************/
function renderSalonesEnCatalogo() {
  // Solo renderizar en index.html
  if (document.title !== "IDW S.A. - Salones para Eventos") {
    return;
  }

  const grid = document.querySelector(".salones-grid");
  if (!grid) {
    console.error("No se encontró el contenedor de salones");
    return;
  }

  const salones = getSalones();
  console.log("Renderizando salones:", salones);
  grid.innerHTML = "";

  if (salones.length === 0) {
    console.error("No hay salones para mostrar");
    return;
  }

  salones.forEach(salon => {
    const serviciosText = Array.isArray(salon.servicios) ? 
      salon.servicios.join(', ') : salon.servicios;
    
    const imgSrc = Array.isArray(salon.imagenes) ? 
      salon.imagenes[0] : salon.imagenes || "images/placeholder.jpg";

    const card = document.createElement("article");
    card.className = "col salon-card";
    card.innerHTML = `
      <div class="card h-100">
        <img src="${imgSrc}" class="card-img-top salon-img" alt="${salon.nombre}" />
        <div class="card-body">
          <h3 class="card-title">${salon.nombre}</h3>
          <ul class="list-unstyled salon-info">
            <li><strong>Ubicación:</strong> ${salon.ubicacion}</li>
            <li><strong>Capacidad:</strong> ${salon.capacidad} personas</li>
            <li><strong>Precio:</strong> $${salon.precio.toLocaleString('es-AR')} por evento</li>
            <li><strong>Servicios incluidos:</strong> ${serviciosText}</li>
          </ul>
        </div>
        <div class="card-footer bg-transparent border-0">
          <button class="info-button" onclick="viewSalon(${salon.id})">Más información</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  console.log("Salones renderizados");
}

/**************************
 * Inicialización de servicios
 **************************/
function populateServiciosCheckboxes() {
  const container = document.getElementById('serviciosCheckboxes');
  if (!container) return;

  const servicios = getServicios();
  container.innerHTML = servicios.map(servicio => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" 
             name="servicios" value="${servicio.nombre}" 
             id="servicio${servicio.id}">
      <label class="form-check-label" for="servicio${servicio.id}">
        ${servicio.nombre} ${servicio.precio ? `($${servicio.precio.toLocaleString('es-AR')})` : ''}
      </label>
    </div>
  `).join('');
}

/**************************
 * Inicialización de la aplicación
 **************************/
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar localStorage si no está inicializado
    if (!localStorage.getItem("salones")) {
        initLocalStorage();
    }
    
    // Renderizar los salones en el catálogo
    renderSalonesEnCatalogo();
    
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

    // Configurar el botón de usuarios
    const usuariosButton = document.querySelector("a[href='usuarios.html']");
    if (usuariosButton) {
        usuariosButton.addEventListener("click", (e) => {
            e.preventDefault();
            const usuariosSection = document.getElementById("usuariosSection");
            usuariosSection.classList.toggle("d-none");
            renderUsersTable();
        });
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