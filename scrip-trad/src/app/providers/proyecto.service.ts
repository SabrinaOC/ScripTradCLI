import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListadoProyectos } from '../interfaces/interfaces';
import { Observable } from 'rxjs';



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
  eliminarProyecto(idProyecto: number) : Observable<any> {
    return this.http.get<any>('/eliminarProyecto?idProyecto=' + idProyecto).pipe();
  }
}
