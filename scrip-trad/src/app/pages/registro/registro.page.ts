import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  waiting: boolean = false;
  registerForm: FormGroup; //para comprobaciones formulario html

  constructor(private router: Router,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private navControler: NavController) { }

  ngOnInit() {
    //formulario reactivo
    this.registerForm = new FormGroup({
      nombre: new FormControl('',[Validators.required]),
      usuario: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email])
    })
  }

  volverLogin(){
    this.navControler.navigateForward('login');
  }
}
