import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActionSheetController, IonInfiniteScroll, NavController, ToastController } from '@ionic/angular';


import { ProyectoService } from '../../providers/proyecto.service';
import { UsuarioService } from '../../providers/usuario.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { Usuario, Proyecto } from 'src/app/interfaces/interfaces';


@Component({
  selector: 'app-listado-proyectos-gestor',
  templateUrl: './listado-proyectos-gestor.page.html',
  styleUrls: ['./listado-proyectos-gestor.page.scss'],
})
export class ListadoProyectosGestorPage implements OnInit {
  // Utilizamos ViewChild para obtener una referencia al control de scroll infinito
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  //cargamos usuario autenticado para realizar búsqueda de proyectos
  usuarioAutenticado: Usuario;
  //listaProyectos: ListadoProyectos;
  proyectos: Proyecto[]= [];
  totalProyectos: number;
  pagina = 0;
  proyectosPorPagina = 25;

  /**
   * 
   * @param proyectoService 
   * @param comunicacionAlertas 
   * @param navController 
   * @param router 
   * @param usuarioService 
   * @param actionSheetController 
   * @param autenticacionPorJWT 
   */
  constructor(private proyectoService: ProyectoService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private navController: NavController,
    private usuarioService: UsuarioService,
    private actionSheetController: ActionSheetController,
    private autenticacionPorJWT: AutenticadorJwtService,
    private toast: ToastController) { }

  /**
   * 
   */
  ngOnInit() {
    this.cargarProyectos();
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      this.usuarioAutenticado = usuAutenticado;
    })
  }

  /**
   * Metodo para cargar proyectos de gestor de bbdd
   */
  cargarProyectos(){
    //mostramos spinner carga
    this.comunicacionAlertas.mostrarCargando();
    
    this.proyectoService.getProyectosGestor(this.pagina, this.proyectosPorPagina).subscribe(data => {
      //ocultamos carga
      this.comunicacionAlertas.ocultarCargando();
      if(data["result"] == 'fail'){
        this.comunicacionAlertas.mostrarAlerta('No se ha podido obtener la lista de proyectos.')
      } else {
        this.totalProyectos = data.totalProyectos;
        data.proyectos.forEach(proyecto => this.proyectos.push(proyecto));
        // La próxima vez que se carguen mensajes se cargará la siguiente "página"
        this.pagina++;
      }

    });
  }

  /**
   * Metodo para mostrar informacion de proyecto al hacer clic sobre el
   * @param proyecto 
   */
  mostrarInformacion(proyecto : Proyecto){
    this.comunicacionAlertas.mostrarAlerta("Encargo: " + proyecto.descripcion + "<br>Traductor: " + proyecto.traductor.nombre
    + "<br>Combinación lingüística: " + proyecto.lo.nombre + "-" + proyecto.lm.nombre)
  }

  /**
   * 
   * @param proyecto 
   */
  eliminarProytecto(proyecto : Proyecto){
    this.comunicacionAlertas.mostrarConfirmacion(`¿Quieres eliminar el proyecto ${proyecto.titulo}?`, () => {
      //ok function
      //mostramos spinner de carga
      this.comunicacionAlertas.mostrarCargando();
      this.proyectoService.eliminarProyecto(proyecto.id).subscribe(data => {
        //ocultamos spinner cuando obtenemos respuesta y la mostramos
        this.comunicacionAlertas.ocultarCargando();
        if(data["result"] == "fail") {
          this.comunicacionAlertas.mostrarAlerta('No se ha podido elimiinar el proyecto ' + proyecto.titulo + '. Vuelve a intentarlo pasados unos minutos');
        } else {
          //mostramos mensaje
          this.presentToast(proyecto);
          //recargamos pagina de proyectos
          this.cargarProyectos();
          //document.location.reload();
          
        }
      })
    }, () => {
      //cancel function
      console.log('cancelar')
    })
    
  }

  /**
   * Metodo para presentar informacion proyecto eliminado con toast
   * @param proyecto 
   */
  async presentToast(proyecto: Proyecto) {
    const toast = await this.toast.create({
      message: 'Proyecto ' + proyecto.titulo + ' eliminado correctamente.',
      duration: 2000
    });
    toast.present();
  }

  /**
   * Método llamado con el evento de scroll infinito
   * @param event 
   */
 scrollInfinito(event) {
  setTimeout(() => {
    event.target.complete();

    // Cargamos más mensajes en la lista
    this.cargarProyectos();
    // Si la cantidad de mensajes cargados, poco a poco, coincide con el total de mensajes
    // totales a mostrar, deshabilitamos los futuros eventos de scroll infinito
    if (this.proyectos.length == this.totalProyectos) {
      event.target.disabled = true;
    }
  }, 500); // Retardo de 500 milisegundos antes de cargar más mensajes.
}

/**
 * Metodo para ir a pantalla de inicio de vista gestor
 */
irInicioGestor(){
  this.navController.navigateForward('/listado-proyectos-gestor');
}

crearNuevoProyecto(){
  this.navController.navigateForward('crear-proyecto');
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



}


