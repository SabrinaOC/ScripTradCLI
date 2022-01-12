import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ProyectoService } from '../../providers/proyecto.service';
import { UsuarioService } from '../../providers/usuario.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { Usuario, ProyectoG, Idioma, UsuarioMinimo } from 'src/app/interfaces/interfaces';
import { IdiomaService } from 'src/app/providers/idioma.service';




@Component({
  selector: 'app-crear-proyecto',
  templateUrl: './crear-proyecto.page.html',
  styleUrls: ['./crear-proyecto.page.scss'],
})
export class CrearProyectoPage implements OnInit {

  //cargamos usuario autenticado para realizar búsqueda de proyectos
  usuarioAutenticado: Usuario;
  //waiting: boolean = false;
  newProjectForm: FormGroup; //para comprobaciones formulario html
  idiomas: Idioma[]=[];
  traductores: UsuarioMinimo[]=[];

  constructor(private navController: NavController,
   private usuarioService: UsuarioService,
   private idiomaService: IdiomaService,
   private autenticacionPorJWT: AutenticadorJwtService,
   private comunicacionAlertas: ComunicacionDeAlertasService,
   private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      this.usuarioAutenticado = usuAutenticado;
    });

    //cargamos opciones select
    this.cargarAllIdiomas();
    this.cargarAllTraductores();

    this.newProjectForm = new FormGroup({
      //aqui ponemos los campos del formulario
      nombreProyecto: new FormControl(' ', [Validators.required]), //lo marcamos como campo obligatorio
      lenguaOrigen: new FormControl,
      lenguaMeta: new FormControl,
      trad: new FormControl,
    });
   
  }
  
  /**
   * Metodo para cargar todos los idiomas de la bbdd para select
   */
  cargarAllIdiomas(){
    this.idiomaService.getAllIdiomas().subscribe(data => {
      if(data["result"] == 'fail'){
        this.comunicacionAlertas.mostrarAlerta('No se ha podido obtener la lista de idiomas.')
      } else {
        data.idiomas.forEach(idioma => this.idiomas.push(idioma));
      }
    })
  }

  /**
   * Metodo para cargar todos los traductores de bbdd para select
   */
  cargarAllTraductores(){
    this.usuarioService.getAllTraductores().subscribe(data => {
      if(data["result"] == 'fail'){
        this.comunicacionAlertas.mostrarAlerta('No se ha podido obtener la lista de traductores.')
      } else {
        data.traductores.forEach(traductor => this.traductores.push(traductor));
      }
    })
  }

  /**
   * Metodo para ir a pantalla de inicio de vista gestor
   */
  irInicioGestor(){
    this.navController.navigateForward('/listado-proyectos-gestor');
  }

  /**
   * Redireccionamiento
   */
  crearNuevoProyecto(){
    this.navController.navigateForward('crear-proyecto');
  }

  //Metodos para menu y cerrar sesion

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
}