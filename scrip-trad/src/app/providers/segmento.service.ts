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

}
