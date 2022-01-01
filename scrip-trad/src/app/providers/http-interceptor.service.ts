import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, finalize} from 'rxjs/operators';
import { AutenticadorJwtService } from './autenticador-jwt.service'; 

// Al ser un servicio, esta clase debe ser Inyectable
@Injectable({
  providedIn: 'root'
})

/**
 * Un HttpInterceptor funciona, exactamente como indica su nombre, interceptando todas las peticiones web que salen desde 
 * la app Angular hacia el exterior. En concreto, en esta aplicación vamos a utilizar el HttpInterceptor para varias finalidades:
 * 1ª.- Todas las peticiones que salgan de la aplicación se van a dirigir hacia un servidor concreto. En este caso el servidor
 *      será 'http://localhost:8080', pero podría ser otro cualquiera.
 * 2ª.- Todas las peticiones web, antes de salir hacia su destino, realizarán los siguientes pasos:
 *         1.- Comprueban si el servicio 'AutenticadorJwtService' tiene un token JWT guardado.
 *         2.- En caso de que el token JWT exista, se incorpora a una cabecera (Authorization) del request, tras el texto 'Bearer '.
 * 3ª.- Estableceremos un único tipo de comunicaciones, será 'application/json', y una codificacion 'charset=utf-8'
 * 
 * Es siempre recomendable implementar un HttpInterceptor, las aplicaciones de esto ya se nos ocurrirán, son muchas.
 * 
 * Para que el HttpInterceptor funcione, debemos incluir una línea en los 'providers' del fichero app.module.ts:
 *               {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
 * 
 * Una clase que desee ser un HttpInterceptor debe implementar la interface HttpInterceptor, esto obliga a implementar el
 * método "intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>"
 */
export class HttpInterceptorService implements HttpInterceptor {
  urlWebAPI = 'http://localhost:8080';  // Especifico la dirección del servidor al que se van a conectar las peticiones http

  /**
   * Constructor que inyecta un objeto de tipo AutenticadorJwtService
   */
  constructor( private autenticadorJwt: AutenticadorJwtService) { }


  /**
   * El siguiente método es el que hace todo el trabajo de interceptar las peticiones http, es obligado implementarlo porque
   * está en la interface HttpInterceptor.
   * @param request Petición http que es interceptada
   * @param next Objeto que permite indicar a una petición que queremos que siga su curso
   * 
   * El método devuelve un Observable que devuelve un evento http. En el interior del evento http puede viajar cualquier tipo de dato
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Intento obtener el token JWT guardado en el AutenticadorJWT. Si ese token existe, lo meto en una cabecera de la petición que
    // va a salir hacia el servidor
    const token: string = this.autenticadorJwt.recuperaJWT();  
    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }  

    // Si no se ha especificado una cabecera 'Content-Type', introduzco una que indica que se envían datos JSON y se codifican con utf-8
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json; charset=utf-8') });
    }

    // Especifico que la petición http va a aceptar una respuesta en formato JSON.
    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    // Agrego, a la URL a la que viaja la petición web, el prefijo que indica la dirección del servidor.
    const newUrl = {url: this.urlWebAPI + request.url};
    request = Object.assign(request, newUrl);
    const newUrlWithParams = {urlWithParams: this.urlWebAPI + request.urlWithParams};
    request = Object.assign(request, newUrlWithParams);

    // Permito que la petición http continúe su curso.
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
//          console.log('event--->>>', event);  // Si utilizas esta línea obtendrás un log de todas las respuestas http recibidas en tu app
        }
        return event;
      }),
      finalize(() => {
       })
      );
  }
}
