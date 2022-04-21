import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/interfaces';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from 'src/app/providers/comunicacion-de-alertas.service';
import { TipoUsuarioService } from 'src/app/providers/tipo-usuario.service';
import { UsuarioService } from 'src/app/providers/usuario.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  usuarioAutenticado: Usuario;
  passForm: FormGroup;
  token: string;

  constructor(private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private navController: NavController,
    private comunicacionAlertas: ComunicacionDeAlertasService) { }

  ngOnInit() {
    //cargamos parametros enviados
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token');
    });
   

    this.formulario();
  }

  /**
   * Formulario reactivo
   */
   formulario(){
    this.passForm = new FormGroup({
      password: new FormControl('', Validators['required']),
      confirmPassword: new FormControl('', Validators['required']),
    },
    //this.passwordMatchValidator
    );
  
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['confirmPassword'].value ? null : {'mismatch': true};
  }

  /**
   * Metodo para actualizar contrasenna
   */
  update() {
    if(this.passForm.controls.password.value != this.passForm.controls.confirmPassword.value){
      this.comunicacionAlertas.mostrarAlerta('Las contraseñas no coinciden');
    } else {
      //guardamos nueva contrase;a en bbdd
      this.usuarioService.resetPass(this.token, this.passForm.controls.password.value).then(data => {
        if(data["result"] == "success") {
          this.comunicacionAlertas.mostrarAlertaAccionOk('Contraseña actualizada con éxito. Ya puedes iniciar sesión.', 
          ()=> {
            this.navController.navigateForward('');
          })
        } else {
          this.comunicacionAlertas.mostrarMensajeConInput("No tienes los derechos necesarios para actualizar contraseña. Volver a enviar email.")
        }
      })
    }

  }

  


}
