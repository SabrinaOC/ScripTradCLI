import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/interfaces';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from 'src/app/providers/comunicacion-de-alertas.service';
import { UsuarioService } from 'src/app/providers/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuarioAutenticado: Usuario;

  constructor(private usuarioService: UsuarioService,
              private actionSheetController: ActionSheetController,
              private navController: NavController,
              private comunicacionAlertas: ComunicacionDeAlertasService,
              private autenticacionPorJWT: AutenticadorJwtService,) { }

  ngOnInit() {
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      if(usuAutenticado.id) {
        this.usuarioAutenticado = usuAutenticado;
      } else {
        this.navController.navigateForward('');
      }
    });
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
    header: 'Menú',
//      cssClass: 'my-custom-class',
    buttons: [{
      text: 'Gestionar cuenta',
      icon: 'settings',
      handler: () => {
        this.navController.navigateForward('/perfil');
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
