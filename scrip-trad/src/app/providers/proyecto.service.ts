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
   * @param email 
   */
  getProyectosGestor(pagina: number, proyectosPorPagina: number) : Observable<ListadoProyectos> {
    console.log("entra en getProyectosGestor")
    return this.http.get<ListadoProyectos>('/gestorProyectos?pagina=' + pagina +'&proyectosPorPagina=' + proyectosPorPagina).pipe();

  }
  

}
