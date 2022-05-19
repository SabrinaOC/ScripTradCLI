import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatosConJwt } from '../interfaces/interfaces'
import { Md5 } from 'ts-md5/dist/md5'; // Para codificar en MD5
import { Usuario } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

   /**
   * Método para autenticar al usuario, recibiendo su nombre y su contraseña.
   */
  autenticaUsuario (usuario: string, pass: string) : Promise<DatosConJwt> {
    const md5 = new Md5(); // Creo un objeto que permite codificar en MD5
    var jsonObject = {
      usuario: usuario,
      pass: md5.appendStr(pass).end().toString()  // Codifico en MD5 el password recibido
    };

    // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
    return this.http.post<DatosConJwt>('/usuario/autentica', jsonObject).toPromise();

  }

  /**
   * Metodo para comprobar si el correo proporcionado con google esta registrado
   * @param email 
   * @returns 
   */
  signInGoogle (email: string) : Promise<DatosConJwt> {
    var jsonObject = {
      email: email     
    };

    // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
    return this.http.post<DatosConJwt>('/usuario/signinGoogle', jsonObject).toPromise();

  }


  /**
   * Método para registrar nuevo usuario, recibiendo todos sus datos.
   */
   registroUsuario (nombre: string, email: string, pass: string, usuario: string, idTipoUsuario: number) : Promise<any> {
     
    const md5 = new Md5(); // Creo un objeto que permite codificar en MD5
    var jsonObject = {
      nombre: nombre,
      email: email,
      pass: md5.appendStr(pass).end().toString(),  // Codificamos en MD5 el password recibido
      usuario: usuario,
      idTipoUsuario: idTipoUsuario
    };

    // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
    return this.http.post<any>('/usuario/registro', jsonObject).toPromise();

  }

  /**
   * Metodo para registrar usuario con datos de google
   * @param nombre 
   * @param email 
   * @param usuario 
   * @param idTipoUsuario 
   * @returns 
   */
  registroUsuarioGoogle (nombre: string, email: string, usuario: string, idTipoUsuario: number) : Promise<any> {
    console.log('entra en usuario service registro Google')
   
   var jsonObject = {
     nombre: nombre,
     email: email,
     usuario: usuario,
     idTipoUsuario: idTipoUsuario
   };

   // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
   return this.http.post<any>('/usuario/registroGoogle', jsonObject).toPromise();

 }

  /**
   * 
   * @param nombre 
   * @param email 
   * @param usuario 
   * @param img 
   * @returns 
   */
  updateUsuario (nombre: string, email: string, usuario: string, img: string) : Promise<any> { 
   var jsonObject = {
     nombre: nombre,
     email: email,
     usuario: usuario,
     img: img
   };

   // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
   return this.http.post<any>('/usuario/update', jsonObject).toPromise();

 }

 /**
  * Metodo para comprobar si la pass actual es la correcta
  * @param pass 
  * @returns 
  */
 checkCurrentPass (pass: string) : Promise<any> { 
  const md5 = new Md5(); // Creo un objeto que permite codificar en MD5
  var jsonObject = {
    password: md5.appendStr(pass).end().toString(),
  };

  // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
  return this.http.post<any>('/usuario/ratificaPassword', jsonObject).toPromise();

}

/**
  * Metodo para comprobar si la pass actual es la correcta
  * @param pass 
  * @returns 
  */
 updatePass (pass: string) : Promise<any> { 
  const md5 = new Md5(); // Creo un objeto que permite codificar en MD5
  var jsonObject = {
    password: md5.appendStr(pass).end().toString(),
  };

  // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
  return this.http.post<any>('/usuario/modificaPassword', jsonObject).toPromise();

}

/**
 * Metodo para reestablecer pass con token temporal
 * @param token 
 * @param pass 
 * @returns 
 */
  resetPass (token: string, pass: string) : Promise<any> {
    const md5 = new Md5(); // Creo un objeto que permite codificar en MD5
    var jsonObject = {
      password: md5.appendStr(pass).end().toString(),
      resetPassToken: token
    };
  
    // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
    return this.http.post<any>('/usuario/resetPassword', jsonObject).toPromise();
  }


    /**
   * Obtiene los datos de un usuario a partir de su id y da la opción de traer, o no, su imagen
   */ 
  cacheUsuarios: Usuario[] = [];
  getUsuario(id: number, incluirImagen: boolean = false): Observable<Usuario> {
    // Intento encontrar el usuario en el array creado
    var encontrado: boolean = false;

    var usuEncontrado = this.getUsuarioFromCache(id);

    if (usuEncontrado != null) {
      return new Observable<Usuario>((observer) => {
        observer.next(usuEncontrado);
        observer.complete();
      });
    }
    else {
      var url= '/usuario/get?id=' + id + '&imagen=' + incluirImagen;
      return this.http.get<Usuario>(url).pipe(
        tap(dataUsuario => {
          if (dataUsuario != null) {
            if (this.getUsuarioFromCache(dataUsuario.id) == null) {
              this.cacheUsuarios.push(dataUsuario);
            }
          }
        })
      );
    }
  }


  /**
   * 
   * @param idUsuario 
   * @returns 
   */
  getUsuarioFromCache(idUsuario: number) {
    for (var i = 0; i < this.cacheUsuarios.length; i++) {
      if (idUsuario == this.cacheUsuarios[i].id) {
        return this.cacheUsuarios[i];
      }
    }
    return null;
  }

  

    /**
   * Permite obtener un usuario autenticado en el servidor.
   */
  getUsuarioAutenticado(incluirImagen: boolean = false): Observable<Usuario> {
    // Petición para obtener el usuario autenticado, funcionará porque se envía el JWT en 
    // cada petición, gracias al HttpInterceptor
    return this.http.get<Usuario>('/usuario/getAutenticado?imagen=' + incluirImagen);
  }

  /**
   * 
   * 
   */
   getAllTraductores() : Observable<any> {
    return this.http.get<any>('/getTraductores').pipe();
  }

}
