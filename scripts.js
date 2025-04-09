document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('hamburger--active');
        mainNav.classList.toggle('main-nav--open');
        
        // Bloquear scroll cuando el menú está abierto
        if (mainNav.classList.contains('main-nav--open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Cerrar menú al hacer clic en un enlace (en mobile)
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('hamburger--active');
                mainNav.classList.remove('main-nav--open');
                document.body.style.overflow = '';
            }
        });
    });
});