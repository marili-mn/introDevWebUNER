document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.main-nav');
  
    if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger--active');
        nav.classList.toggle('main-nav--open');
        document.body.style.overflow = nav.classList.contains('main-nav--open') ? 'hidden' : '';
      });
    }
  
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768 && nav.classList.contains('main-nav--open')) {
          hamburger.classList.remove('hamburger--active');
          nav.classList.remove('main-nav--open');
          document.body.style.overflow = '';
        }
      });
    });
  });