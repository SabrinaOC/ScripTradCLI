import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { ProyectoService } from '../../providers/proyecto.service';
import { UsuarioService } from '../../providers/usuario.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { Usuario, ProyectoG } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.page.html',
  styleUrls: ['./editor.page.scss'],
})
export class EditorPage implements OnInit {

  idPr: string;

  //cargamos usuario autenticado para realizar búsqueda de proyectos
  usuarioAutenticado: Usuario;
  constructor(
    private proyectoService: ProyectoService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private navController: NavController,
    private usuarioService: UsuarioService,
    private actionSheetController: ActionSheetController,
    private autenticacionPorJWT: AutenticadorJwtService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      this.usuarioAutenticado = usuAutenticado;
    });

    //cargamos parametros enviados
    this.route.paramMap.subscribe(params => {
      var idProyecto = params.get('id');
      this.idPr = idProyecto;
    })
  }




 /**
   * Cierra la sesión de usuario, se llega aquí tras la correspondiente opción del menú lateral
   */
  cerrarSesion() {
    this.comunicacionAlertas.mostrarConfirmacion("¿Cerrar sesión?", () => {
      console.log('ok')
      this.autenticacionPorJWT.eliminaJWT();
      //Redirigimos a login
      console.log('se ha eliminado el jwt y ahora tendria que ir al login')
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
  
/**
 * Metodo para ir a pantalla de inicio de vista traductor
 */
 irInicioTraductor(){
  this.navController.navigateForward('/listado-proyectos-traductor');
}

irEditor(){
  this.navController.navigateForward('/editor')
}
}

