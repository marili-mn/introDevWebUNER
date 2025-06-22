// Configuración de la API
const API_URL = {
    LOGIN: 'https://dummyjson.com/auth/login',
    USERS: 'https://dummyjson.com/users',
    SALONS: {
        LIST: 'https://dummyjson.com/products',
        CREATE: 'https://dummyjson.com/products/add',
        UPDATE: 'https://dummyjson.com/products',
        DELETE: 'https://dummyjson.com/products'
    }
};

// Exponer la configuración globalmente
window.API_URL = API_URL;
