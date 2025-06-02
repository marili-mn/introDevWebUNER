export const INITIAL_SALONES = [
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

export const INITIAL_SERVICIOS = [
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

export const INITIAL_IMAGENES = [
  { id: 1, nombre: "Salón Monster - Principal", url: "images/ado3.jpg", salonId: 1 },
  { id: 2, nombre: "Salón del Bosque - Principal", url: "images/genial.jpg", salonId: 2 },
  { id: 3, nombre: "Salón Pekes - Principal", url: "images/infa4.jpg", salonId: 3 },
  { id: 4, nombre: "Salón Rubí - Principal", url: "images/salonMesaExterior.jpg", salonId: 4 },
  { id: 5, nombre: "Salón Monster Oeste - Principal", url: "images/ado4.jpg", salonId: 5 },
  { id: 6, nombre: "Salón Coder - Principal", url: "images/ado5.jpg", salonId: 6 }
];
