import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListadoProyectos } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { NodeCompatibleEventEmitter } from 'rxjs/internal/observable/fromEvent';



@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(public http: HttpClient) { }


  /**
   * 
   * @param pagina 
   * @param proyectosPorPagina 
   * @returns 
   */
  getProyectosGestor(pagina: number, proyectosPorPagina: number) : Observable<ListadoProyectos> {
    return this.http.get<ListadoProyectos>('/gestorProyectos?pagina=' + pagina +'&proyectosPorPagina=' + proyectosPorPagina).pipe();
  }

  /**
   * 
   * @param pagina 
   * @param proyectosPorPagina 
   * @returns 
   */
  getProyectosTraductor(pagina: number, proyectosPorPagina: number) : Observable<ListadoProyectos> {
    return this.http.get<ListadoProyectos>('/traductorProyectos?pagina=' + pagina +'&proyectosPorPagina=' + proyectosPorPagina).pipe();
  }

  /**
   * 
   * @param pagina 
   * @param proyectosPorPagina 
   * @returns 
   */
  getProyectosTraductorUrgentes(pagina: number, proyectosPorPagina: number) : Observable<ListadoProyectos> {
    return this.http.get<ListadoProyectos>('/traductorProyectosUrgentes?pagina=' + pagina +'&proyectosPorPagina=' + proyectosPorPagina).pipe();
  }

  /**
   * 
   * @param idProyecto 
   * @returns 
   */
   getProyectoById(idProyecto: number) : Observable<any> {
    return this.http.get<any>('/proyectoById?idProyecto=' + idProyecto).pipe();
  }
  
  /**
   * 
   * @param idProyecto 
   * @returns 
   */
  eliminarProyecto(idProyecto: number) : Observable<any> {
    return this.http.get<any>('/eliminarProyecto?idProyecto=' + idProyecto).pipe();
  }

  /**
   * Método para crear
   * @param traductor 
   * @param gestor 
   * @param idLo 
   * @param idLm 
   * @param fechaEntrega 
   * @param desc 
   * @param comm 
   * @param titulo 
   */
  crearNuevoProyecto(titulo: string, traductor: number, gestor: number, idLo: number, idLm: number, fechaEntrega: string, desc: string,
     comm: string){
      let jsonObject = {
        titulo : titulo,
        idTraductor : traductor,
        idGestor : gestor,
        idLo : idLo,
        idLm : idLm,
        deadline : fechaEntrega,
        descripcion : desc,
        comentarios : comm,
      }
      // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
    return this.http.post<any>('/newProject', jsonObject).toPromise();
     }
}
