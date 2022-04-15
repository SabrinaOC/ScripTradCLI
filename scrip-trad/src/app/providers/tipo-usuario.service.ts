import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoUsuarioService {

  constructor(public http: HttpClient) { }

  getTipoUsuario(tipo: number) : Promise <any> {
    return this.http.get<any>('/getTipoUsuario?tipo=' +  tipo).toPromise();
  }
}
