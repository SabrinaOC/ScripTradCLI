import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { UsuarioService } from '../../providers/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  waiting: boolean = false;
  registerForm: FormGroup; //para comprobaciones formulario html

  /**
   * 
   * @param router 
   * @param comunicacionAlertas 
   * @param navControler 
   */
  constructor(private usuarioService: UsuarioService,
    private router: Router,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private navControler: NavController) { }

  ngOnInit() {
    //formulario reactivo
    this.registerForm = new FormGroup({
      nombre: new FormControl('Rafael Muñoz',[Validators.required]),
      usuario: new FormControl('Rafa77',[Validators.required]),
      email: new FormControl('rafa@rafa.com',[Validators.required, Validators.email]),
      pass: new FormControl('1234', [Validators.required]),
      idTipoProfesional: new FormControl()
    })
  }

  registrarUsuario(){
    this.waiting = true;
   
    this.usuarioService.registroUsuario(this.registerForm.controls.nombre.value,
      this.registerForm.controls.email.value, this.registerForm.controls.pass.value,
      this.registerForm.controls.usuario.value, this.registerForm.controls.idTipoProfesional.value). then(data => {
        this.waiting = false;
        if(data.result == "success"){
          //si el resultado es success, se ha registrado el usuario correctamente
          this.comunicacionAlertas.mostrarAlerta('Registro realizado con éxito. Inicia sesión para acceder a la aplicación');
        }else{
          this.comunicacionAlertas.mostrarAlerta('Usuario ya registrado, elige otro nombre');
        }
      });
  }

  volverLogin(){
    this.navControler.navigateForward("login")
  }
}
