import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  waiting: boolean = false;
  loginForm: FormGroup;

  constructor() { }

  ngOnInit() {
    //Formgroup para formulario reactivo (validacion)
    this.loginForm = new FormGroup({
      //aqui ponemos los campos del formulario
      usuario: new FormControl([Validators.required]), //lo marcamos como campo obligatorio
      pass: new FormControl([Validators.required])
    });
  }

}
