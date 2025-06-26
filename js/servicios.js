// servicios.js
import { 
  getServicios, 
  getServicioById, 
  addServicio, 
  updateServicio, 
  deleteServicio 
} from './data.js';

// Renderizar la tabla de servicios
function renderServicios() {
  const servicios = getServicios();
  const tableBody = document.getElementById('serviciosTableBody');
  
  tableBody.innerHTML = servicios.map(servicio => `
    <tr>
      <td>${servicio.id}</td>
      <td>${servicio.descripcion}</td>
      <td>$${servicio.valor.toLocaleString('es-AR')}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editarServicio(${servicio.id})">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-sm btn-danger" onclick="eliminarServicio(${servicio.id})">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  `).join('');
}


/*
function renderServicios() {
  const servicios = getServicios();
  const tableBody = document.getElementById('serviciosTableBody');
  
  tableBody.innerHTML = servicios.map(servicio => `
    <tr>
      <td>${servicio.id}</td>
      <td>${servicio.descripcion}</td>
      <td>$${servicio.valor.toLocaleString()}</td>
      <td>
        <span class="badge ${servicio.estado === 'activo' ? 'bg-success' : 'bg-secondary'}">
          ${servicio.estado === 'activo' ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editarServicio(${servicio.id})">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-sm btn-danger" onclick="eliminarServicio(${servicio.id})">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  `).join('');
}
  */

// Editar servicio
window.editarServicio = function(id) {
  const servicio = getServicioById(id);
  if (servicio) {
    document.getElementById('servicioId').value = servicio.id;
    document.getElementById('servicioDescripcion').value = servicio.descripcion;
    document.getElementById('servicioValor').value = servicio.valor;
    //document.getElementById('servicioEstado').value = servicio.estado;
    document.getElementById('servicioModalLabel').textContent = 'Editar Servicio';
    
    const modal = new bootstrap.Modal(document.getElementById('servicioModal'));
    modal.show();
  }
};

// Eliminar servicio
window.eliminarServicio = function(id) {
  if (confirm('¿Estás seguro de eliminar este servicio?')) {
    deleteServicio(id);
    renderServicios();
    alert('Servicio eliminado correctamente');
  }
};

// Manejar el formulario
document.getElementById('servicioForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const servicioData = {
    descripcion: document.getElementById('servicioDescripcion').value,
    valor: parseFloat(document.getElementById('servicioValor').value),
    estado: document.getElementById('servicioEstado').value
  };
  
  const id = document.getElementById('servicioId').value;
  
  if (id) {
    // Editar servicio existente
    updateServicio(parseInt(id), servicioData);
    alert('Servicio actualizado correctamente');
  } else {
    // Crear nuevo servicio
    addServicio(servicioData);
    alert('Servicio creado correctamente');
  }
  
  renderServicios();
  const modal = bootstrap.Modal.getInstance(document.getElementById('servicioModal'));
  modal.hide();
});

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('serviciosTableBody')) {
    renderServicios();
  }
});