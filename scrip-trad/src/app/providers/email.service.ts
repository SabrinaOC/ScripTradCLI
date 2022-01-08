import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(public http: HttpClient) { }


  /**
   * 
   * @param email 
   */
  sendEmailPassForgotten(email: string) : Promise<any> {

    let postData = {
      "email": email,
    }
    return this.http.post<any>('/emailSender', postData).toPromise();

  }

}
