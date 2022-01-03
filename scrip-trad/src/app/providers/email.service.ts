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


    
    //Peticion a emailSender con email introducido por usuario
    //var url= '/emailSender?email=' + email;
    
/*
   this.http.post(`http://localhost:8080/emailSender?email=${email}`, postData)
      .subscribe(data => {
        if (data != undefined){
          console.log('correo enviado')
        }
       }, error => {
        console.log(error);
      });*/
  }

}
