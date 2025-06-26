window.INITIAL_SALONES = [
  {
    id: 1,
    nombre: "Salón Monster Show",
    ubicacion: "Centro de la ciudad",
    capacidad: 150,
    precio: 1550000,
    servicios: ["Sonido básico", "Iluminación", "Mesas y sillas"],
    imagenes: ["images/ado3.jpg"],
    descripcion: "Salón ideal para eventos corporativos y celebraciones familiares"
  },
  {
    id: 2,
    nombre: "Salón del Bosque",
    ubicacion: "Zona norte",
    capacidad: 140,
    precio: 1935000,
    servicios: ["Animadoras", "Catering", "Pelotero"],
    imagenes: ["images/genial.jpg"],
    descripcion: "Perfecto para fiestas infantiles con ambiente natural"
  },
  {
    id: 3,
    nombre: "Salón Pekes!",
    ubicacion: "Zona este",
    capacidad: 50,
    precio: 1575000,
    servicios: ["Pelotero", "Sonido profesional", "Catering básico"],
    imagenes: ["images/infa4.jpg"],
    descripcion: "Especialmente diseñado para los más pequeños"
  },
  {
    id: 4,
    nombre: "Salón Rubí",
    ubicacion: "Zona sur",
    capacidad: 200,
    precio: 3550000,
    servicios: ["Sonido profesional", "Pantalla gigante", "Catering full"],
    imagenes: ["images/salonMesaExterior.jpg"],
    descripcion: "Salón premium para eventos de gran envergadura"
  },
  {
    id: 5,  
    nombre: "Salón Monster Show Oeste",
    ubicacion: "Zona Oeste",
    capacidad: 300,
    precio: 300000,
    servicios: ["Sonido profesional", "Iluminación", "Mesas y sillas"],
    imagenes: ["images/ado4.jpg"],
    descripcion: "Gran capacidad para eventos masivos"
  },
  {
    id: 6,
    nombre: "Salón Coder Show",
    ubicacion: "Centro de la ciudad",
    capacidad: 400,
    precio: 4000000,
    servicios: ["Sonido profesional", "Iluminación", "Mesas y sillas"],
    imagenes: ["images/ado5.jpg"],
    descripcion: "El salón más grande de nuestra cadena"
  }
];

window.INITIAL_SERVICIOS = [
  { id: 1, nombre: "Sonido básico", precio: 50000 },
  { id: 2, nombre: "Sonido profesional", precio: 120000 },
  { id: 3, nombre: "Iluminación", precio: 80000 },
  { id: 4, nombre: "Mesas y sillas", precio: 30000 },
  { id: 5, nombre: "Catering básico", precio: 200000 },
  { id: 6, nombre: "Catering full", precio: 500000 },
  { id: 7, nombre: "Animadoras", precio: 150000 },
  { id: 8, nombre: "Pelotero", precio: 100000 },
  { id: 9, nombre: "Pantalla gigante", precio: 180000 }
];

window.INITIAL_IMAGENES = [
  { id: 1, nombre: "Salón Monster - Principal", url: "images/ado3.jpg", salonId: 1 },
  { id: 2, nombre: "Salón del Bosque - Principal", url: "images/genial.jpg", salonId: 2 },
  { id: 3, nombre: "Salón Pekes - Principal", url: "images/infa4.jpg", salonId: 3 },
  { id: 4, nombre: "Salón Rubí - Principal", url: "images/salonMesaExterior.jpg", salonId: 4 },
  { id: 5, nombre: "Salón Monster Oeste - Principal", url: "images/ado4.jpg", salonId: 5 },
  { id: 6, nombre: "Salón Coder - Principal", url: "images/ado5.jpg", salonId: 6 }
];

// Función para actualizar un salón
function updateSalon(id, updatedData) {
    // Implementa la lógica para actualizar el salón en tu almacenamiento de datos
    // Esto puede ser localStorage, una API, etc.
    
    // Ejemplo con localStorage:
    const salones = JSON.parse(localStorage.getItem('salones')) || [];
    const index = salones.findIndex(s => s.id === id);
    
    if (index !== -1) {
        salones[index] = { ...salones[index], ...updatedData };
        localStorage.setItem('salones', JSON.stringify(salones));
        return true;
    }
    
    return false;
}

// Función para obtener un salón por ID
function getSalonById(id) {
    const salones = JSON.parse(localStorage.getItem('salones')) || [];
    return salones.find(s => s.id === id);
}

// Modificar la función saveSalonFromForm para que quede así:
function saveSalonFromForm(event) {
  event.preventDefault();

  // Obtener servicios seleccionados
  const serviciosSeleccionados = Array.from(
    document.querySelectorAll('#serviciosCheckboxes input[type="checkbox"]:checked')
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
  let success = false;

  if (salonId) {
    success = updateSalon(parseInt(salonId), salonData);
    mostrarMensaje(success ? 'Salón actualizado correctamente' : 'Error al actualizar el salón');
  } else {
    createSalon(salonData);
    mostrarMensaje('Salón creado correctamente');
  }

  if (success || !salonId) {
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
}

// Asegurarse que populateServiciosCheckboxes esté definida:
function populateServiciosCheckboxes() {
  const serviciosContainer = document.getElementById('serviciosCheckboxes');
  if (!serviciosContainer) return;

  const servicios = getServicios();
  serviciosContainer.innerHTML = servicios.map(servicio => `
    <div class="col">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" 
               value="${servicio.nombre}" 
               id="servicio-${servicio.id}"
               name="servicio">
        <label class="form-check-label" for="servicio-${servicio.id}">
          ${servicio.nombre}
        </label>
      </div>
    </div>
  `).join('');
}