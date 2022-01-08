// Sólo usada para recibir un objeto que contenga un campo llamado "jwt". Usado en la autenticación del usuario
export interface DatosConJwt {
    jwt: string;
}



// Datos completos de un proyecto
export interface ProyectoG {
    id: number,
    traductor: Usuario,
    gestor: Usuario,
    lo: Idioma,
    lm: Idioma,
    fechaEntrega: Date,
    descripcion: string,
    //fechaEliminacion: Date,
    //comentarios: string,
    titulo: string
}

// Datos de un listado de proyectos, en el que se incluyen el listado y la cantidad total
export interface ListadoProyectos {
    proyectos: ProyectoG[];
    totalProyectos: number;
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


// Datos idiomas
export interface Idioma {
    id: number;
    nombre: string;
    img: string;
}
