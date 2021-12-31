import { Injectable } from '@angular/core';

/**
 * Los servicios son, por defecto, inyectables
 */
@Injectable({
  providedIn: 'root'
})

/**
 * Esta clase permite gestionar un token JWT que se encuentre presente en nuestra aplicación. Se ha implementado
 * dos formas: por variable de sesión y por localStorage. 
 * - Si decidimos utilizar la variable de sesión el mismo usuario sólo se encuentra autenticado en la pestaña
 * del navegador en la que ha iniciado sesión.
 * - Si decidimos utilizar el "localStorage" el usuario se mantiene autenticado en todas las pestañas del mismo
 * navegador. "localStorage" es un espacio de almacenamiento que proporciona el navegador para nuestra app web.
 * 
 * La ventaja de utilizar la variable de sesión es la de que varias pestañas de un mismo navegador puedan
 * tener autenticados a varios usuarios, uno por cada
 */
export class AutenticadorJwtService {
  // La siguiente propiedad sólo estará activa por sesión de usuario.
  jwtPorSesion: string; // Sólo utilizada si se desea que un mismo navegador pueda tener varias sesiones

  constructor() { }

  /**
   * Permite guardar el jwt (token) recibido. Dejaremos comentada la línea que no queramos usar.
   * @param token 
   */
  almacenaJWT (token: string) {
//    this.jwtPorSesion = token;   // Almacenamiento en la variable
    localStorage.setItem("jwt", token);  // Guardo el JWT recibido del servidor, en el almacenamiento local
  }

  /**
   * Recupera el token (jwt). Puede hacerlo de una variable o del localStorage, según queramos.
   */
  recuperaJWT (): string {
//    return this.jwtPorSesion;
    return localStorage.getItem("jwt");
  }

  /**
   * Elimina el token (jwt) almacenado.
   */
  eliminaJWT () {
//    this.jwtPorSesion = null;
    localStorage.removeItem("jwt");
  }

}
