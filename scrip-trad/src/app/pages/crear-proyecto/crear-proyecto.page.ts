import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ProyectoService } from '../../providers/proyecto.service';
import { UsuarioService } from '../../providers/usuario.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { Usuario, Proyecto, Idioma, UsuarioMinimo } from 'src/app/interfaces/interfaces';
import { IdiomaService } from 'src/app/providers/idioma.service';
import { format, parseISO } from 'date-fns';

import { getOriginPrivateDirectory, showSaveFilePicker } from 'native-file-system-adapter';




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
  mostrarCalendario = false;
  fechaEntrega = format(new Date(), 'yyyy-MM-dd');
  fechaMostrada = '';

  fileHandle;


  constructor(private navController: NavController,
   private usuarioService: UsuarioService,
   private idiomaService: IdiomaService,
   private autenticacionPorJWT: AutenticadorJwtService,
   private comunicacionAlertas: ComunicacionDeAlertasService,
   private actionSheetController: ActionSheetController,
   ) { }

  ngOnInit() {
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      this.usuarioAutenticado = usuAutenticado;
    });

    //cargamos opciones select
    this.cargarAllIdiomas();
    this.cargarAllTraductores();
    this.cargarHoy();

    this.newProjectForm = new FormGroup({
      //aqui ponemos los campos del formulario
      nombreProyecto: new FormControl('', [Validators.required]), //lo marcamos como campo obligatorio
      lenguaOrigen: new FormControl,
      lenguaMeta: new FormControl,
      trad: new FormControl,
      descrProyecto: new FormControl('', [Validators.required]),
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
   * Cargamos fecha de hoy en calendario
   */
  cargarHoy(){
    this.fechaMostrada = format(parseISO(format(new Date(), 'yyyy-MM-dd')), 'MM-d-yyyy');
  }

  /**
   * Metodo para elegir fecha en calendario y guardarlo en variable para mandarlo a bbdd
   * @param fecha 
   */
 elegirFecha(fecha){
    console.log(fecha)
    //this.fechaEntrega = format(fecha, 'MM-d-yyyy');
    this.fechaMostrada = format(parseISO(fecha), 'MM-d-yyyy');
    console.log('\nFecha para bbdd: ' + this.fechaEntrega)
    this.mostrarCalendario=false;
 }

  mostrarVistaPrevia(){
   
   /*
   //cuando detectemos cambio en iput file cargaremos vista previa de archivo seleccionado*/
   let vista = document.getElementById('vistaPrevia'); //.setAttribute('scr', './././assets/temp/pruebaTabla.pdf');
    vista.setAttribute('src', './././assets/temp/pruebaTabla.pdf');
   
  
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
