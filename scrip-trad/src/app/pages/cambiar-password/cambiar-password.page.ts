import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/interfaces';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from 'src/app/providers/comunicacion-de-alertas.service';
import { TipoUsuarioService } from 'src/app/providers/tipo-usuario.service';
import { UsuarioService } from 'src/app/providers/usuario.service';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
})
export class CambiarPasswordPage implements OnInit {
  usuarioAutenticado: Usuario;
  passForm: FormGroup;

  constructor(private usuarioService: UsuarioService,
    private tipoUsuarioService: TipoUsuarioService,
    private actionSheetController: ActionSheetController,
    private navController: NavController,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private autenticacionPorJWT: AutenticadorJwtService) { }

  ngOnInit() {
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      if(usuAutenticado.id) {
        this.usuarioAutenticado = usuAutenticado;
                
      } else {
        this.navController.navigateForward('');
      }
    });

    this.formulario();
  }

  /**
   * Formulario reactivo
   */
   formulario(){
    this.passForm = new FormGroup({
      oldPass: new FormControl('', Validators['required']),
      newPass: new FormControl('', Validators['required']),
    });
  
  }

  /**
   * Metodo para actualizar contrasenna
   */
  update() {
    //primero comprobamos que la contraseña actual es correcta
    this.usuarioService.checkCurrentPass(this.passForm.controls.oldPass.value).then(data => {
      if(data["result"] == "fail") {
        this.comunicacionAlertas.mostrarAlertaAccionOk('La contraseña actual intorudica no es la correcta.',
        ()=> {
          this.passForm.reset();
        })
      } else { //si no ha dado error significa que coincide y podemos proceder a cambiarla
        this.usuarioService.updatePass(this.passForm.controls.newPass.value).then(data => {
          if(data["result"] == "fail") {
            this.comunicacionAlertas.mostrarAlerta('Ha sucedido un error al intentar actualizar la contraseña. Vuelve a intentarlo en unos minutos.')
          } else {
            this.comunicacionAlertas.mostrarAlertaAccionOk('Contraseña actualizada con éxito.', 
            ()=>{
              this.irInicio();
            })
          }
        })
      }
    })

  }

  /**
   * Metodo para navegar a inicio
   */
   irInicio() {
    //dependiendo del tipo de usuario navegamos a un sito u otro
    if(this.usuarioAutenticado.idTipoUsuario == 1) {
      this.navController.navigateForward('/listado-proyectos-traductor');
    }
    if(this.usuarioAutenticado.idTipoUsuario == 2) {
      this.navController.navigateForward('/listado-proyectos-gestor');
    }
  }

  /**
   * Cierra la sesión de usuario, se llega aquí tras la correspondiente opción del menú lateral
   */
 cerrarSesion() {
  this.comunicacionAlertas.mostrarConfirmacion("¿Cerrar sesión?", () => {
    console.log('ok')
    this.autenticacionPorJWT.eliminaJWT();
    //Redirigimos a login
    this.navController.navigateForward('/login'); 
  }, () => {
    console.log('cancel');
  });
}

 /**
 * Metodo para mostrar menu de opciones con action sheet al clicar sobre la imagen de usuario
 */
  async mostrarMenu(){
    const actionSheet = await this.actionSheetController.create({
      header: this.usuarioAutenticado.email,
      //cssClass: 'my-action-sheet-class',
      buttons: [{
        text: 'Perfil',
        icon: 'person-outline',
        handler: () => {
          this.navController.navigateForward('/perfil');
        }
      }, {
        text: 'Cambiar contraseña',
        icon: 'key-outline',
        handler: () => {
          this.navController.navigateForward('/cambiar-password');
        }
      }, {
        text: 'Cerrar sesión',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          this.cerrarSesion();
        }
      }]
    });
    await actionSheet.present();
  
  }
}
