// Manejo de eventos del carrito

document.addEventListener('DOMContentLoaded', () => {
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

    document.getElementById('procesar-compra')?.addEventListener('click', procesarCompra);
});
