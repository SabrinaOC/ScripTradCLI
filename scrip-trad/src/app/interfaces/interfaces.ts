// Sólo usada para recibir un objeto que contenga un campo llamado "jwt". Usado en la autenticación del usuario
export interface DatosConJwt {
    jwt: string;
}



// Datos completos de un proyecto
export interface Proyecto {
    id: number;
    remitente: UsuarioMinimo,  // Sólo me interesa nombre e id
    
}

// Datos de un usuario
export interface Usuario {
    id: number;
    nombre: string;
    usuario: string;
    pass: string;
    email: string;
    idTipoUsuario: number;
    img: string;
}


// Mínimos datos sobre un usuario
export interface UsuarioMinimo {
    id: number;
    nombre: string;
}



// Datos sobre tipo de usuario, traductor o gestor
export interface TipoUsuario {
    id: number;
    descripcion: string;
}
