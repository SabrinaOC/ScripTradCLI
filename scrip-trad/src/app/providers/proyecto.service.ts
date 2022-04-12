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
   * Metodo para recuperar lista con todos los proyectos de un gestor dado
   * @param pagina 
   * @param proyectosPorPagina 
   * @returns 
   */
  getProyectosGestor(pagina: number, proyectosPorPagina: number) : Observable<ListadoProyectos> {
    return this.http.get<ListadoProyectos>('/gestorProyectos?pagina=' + pagina +'&proyectosPorPagina=' + proyectosPorPagina).pipe();
  }

  /**
   * Metodo para recuperar lista con todos los proyectos de un traductor dado
   * @param pagina 
   * @param proyectosPorPagina 
   * @returns 
   */
  getProyectosTraductor(pagina: number, proyectosPorPagina: number) : Observable<ListadoProyectos> {
    return this.http.get<ListadoProyectos>('/traductorProyectos?pagina=' + pagina +'&proyectosPorPagina=' + proyectosPorPagina).pipe();
  }

  /**
   * Metodo para recuperar lista de proyectos con fecha de entrega en 7 dias
   * @param pagina 
   * @param proyectosPorPagina 
   * @returns 
   */
  getProyectosTraductorUrgentes(pagina: number, proyectosPorPagina: number) : Observable<ListadoProyectos> {
    return this.http.get<ListadoProyectos>('/traductorProyectosUrgentes?pagina=' + pagina +'&proyectosPorPagina=' + proyectosPorPagina).pipe();
  }

  /**
   * Metodo para poder recuperar datos de un proyecto por id
   * @param idProyecto 
   * @returns 
   */
   getProyectoById(idProyecto: number) : Observable<any> {
    return this.http.get<any>('/proyectoById?idProyecto=' + idProyecto).pipe();
  }
  
  /**
   * Metodo para eliminar proyecto
   * @param idProyecto 
   * @returns 
   */
  eliminarProyecto(idProyecto: number) : Observable<any> {
    return this.http.get<any>('/eliminarProyecto?idProyecto=' + idProyecto).pipe();
  }

  /**
   * Método para crear proyecto
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
    return this.http.post<any>('/nuevoProyecto', jsonObject).toPromise();
     }

  /**
   * 
   * @param idProyecto 
   * @param comm 
   * @returns 
   */
  addComentario(idProyecto: number, comm: string): Promise<any> {
    let jsonObject = {
      idProyecto : idProyecto,
      comentarios : comm
    }
    // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
  return this.http.post<any>('/addComentario', jsonObject).toPromise();
  }
}
