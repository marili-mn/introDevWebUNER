// Manejo de eventos del carrito

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar carrito
    const carritoContenido = document.getElementById('carrito-contenido');
    const carritoTotal = document.getElementById('carrito-total');
    
    if (!carritoContenido || !carritoTotal) {
        console.error('Elementos del carrito no encontrados');
        return;
    }

    // Manejar eventos de checkboxes de salones
    document.addEventListener('change', (e) => {
        if (e.target.name === 'salones' && e.target.checked) {
            const salon = {
                id: e.target.dataset.id,
                nombre: e.target.dataset.nombre,
                precio: parseFloat(e.target.dataset.precio),
                tipo: 'salon'
            };
            agregarAlCarrito(salon);
        } else if (e.target.name === 'salones' && !e.target.checked) {
            removerDelCarrito(e.target.dataset.id);
        }
    });

    // Manejar eventos de checkboxes de servicios
    document.addEventListener('change', (e) => {
        if (e.target.name === 'servicios' && e.target.checked) {
            const servicio = {
                id: e.target.dataset.id,
                nombre: e.target.dataset.nombre,
                precio: parseFloat(e.target.dataset.precio),
                tipo: 'servicio'
            };
            agregarAlCarrito(servicio);
        } else if (e.target.name === 'servicios' && !e.target.checked) {
            removerDelCarrito(e.target.dataset.id);
        }
    });

    // Actualizar carrito inicialmente
    actualizarCarrito();

    // Manejar botones del carrito
    document.getElementById('vaciar-carrito')?.addEventListener('click', () => {
        vaciarCarrito();
        actualizarCarrito();
    });

    // Modificar procesarCompra para requerir login
    document.getElementById('procesar-compra')?.addEventListener('click', () => {
        if (!window.isAuthenticated()) {
            mostrarMensaje('Debes iniciar sesión para procesar la compra');
            return;
        }
        procesarCompra();
    });
});
