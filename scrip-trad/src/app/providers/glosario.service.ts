import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlosarioService {

  constructor(public http: HttpClient) { }

  /**
   * 
   * @param terminoO 
   * @param terminoM 
   * @param proyecto 
   * @returns 
   */
  insertarTraduccion(terminoO: string, terminoM: string, proyecto: number) : Promise <any>{
    let jsonObject = {
      terminoLO : terminoO,
      terminoLM : terminoM,
      proyecto : proyecto
    }
    // Envío la petición http y devuelvo el Observable, para que cualquiera pueda subscribirse.
  return this.http.post<any>('/addEquivalencias', jsonObject).toPromise();
  }

  /**
   * 
   * @param termino 
   * @returns 
   */
  buscarCoincidencias(idProyecto: number, termino: string) : Promise <any> {
    return this.http.get<any>('/getEquivalencias?idProyecto=' + idProyecto + '&termino=' + termino).toPromise();
  }
}
