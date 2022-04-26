import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { UsuarioService } from '../../providers/usuario.service';
import { Usuario } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  usuAutenticado: Usuario;
  waiting: boolean = false;
  registerForm: FormGroup; //para comprobaciones formulario html
  isHidden1: boolean = true;
  isHidden2: boolean = true;

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
     // Comprobamos que no hay un usuairo ya autenticado, si es as'i, redirigimos
     this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      if(usuAutenticado.id) {
        this.usuAutenticado = usuAutenticado;
        if(this.usuAutenticado.idTipoUsuario == 1) this.navControler.navigateForward('/listado-proyectos-traductor');
        if(this.usuAutenticado.idTipoUsuario == 2) this.navControler.navigateForward('/listado-proyectos-gestor');
      } 
    });
    //formulario reactivo
    this.registerForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      usuario: new FormControl('', Validators.required),
      email: new FormControl('',[Validators.required, Validators.email]),
      pass: new FormControl('', [Validators.required]),
      confirmPass: new FormControl ('', Validators['required']),
      idTipoProfesional: new FormControl()
    })
  }

  /**
   * Metodo para llamar a servicio de usuario y registrar uno nuevo
   */
  registrarUsuario(){
    this.waiting = true;
   //comprobamos que las contrase;as coinciden
   if(this.registerForm.controls.pass.value == this.registerForm.controls.confirmPass.value) {
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
   } else {
     this.comunicacionAlertas.mostrarAlerta('Las contraseñas introducidas no coinciden.');
     this.waiting = false;
   }
    
  }

  /**
   * Metodo para volver a login
   */
  volverLogin(){
    this.navControler.navigateForward("login")
  }
}
