import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class IdiomaService {

  constructor(public http: HttpClient) { }


  /**
   * 
   * 
   */
  getAllIdiomas() : Observable <any> {
    return this.http.get<any>('/getIdiomas').pipe();
  }

}
