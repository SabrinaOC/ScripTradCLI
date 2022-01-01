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

}
