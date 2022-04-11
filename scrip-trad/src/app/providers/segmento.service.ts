import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SegmentoService {

  constructor(public http: HttpClient) { }


  /**
   * 
   * @param idProyecto 
   */
  getAllSegmentosProyecto(idProyecto: number) : Observable <any> {
    return this.http.get<any>('/getSegmentosProyecto?idProyecto=' + idProyecto).pipe();
  }

  /**
   * 
   * @param texto 
   * @param proyecto 
   * @returns 
   */
  insertarSegmentos(texto : string, proyecto: number) {
    let jsonObject = {
      textoCompleto : texto,
      proyecto : proyecto,
    }
    // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
  return this.http.post<any>('/addSegmentosProyecto', jsonObject).toPromise();
   
  }

  /**
   * 
   * @param texto 
   * @param id 
   */
  insertarTraduccion(texto: string, id: number) {
    let jsonObject = {
      idSegmento : id,
      textoLM : texto,
    }
    // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
  return this.http.post<any>('/addTraduccion', jsonObject).toPromise();
  }

}
