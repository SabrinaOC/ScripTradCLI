import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActionSheetController, IonInfiniteScroll, NavController, ToastController } from '@ionic/angular';


import { ProyectoService } from '../../providers/proyecto.service';
import { UsuarioService } from '../../providers/usuario.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { Usuario, ProyectoG } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-listado-proyectos-traductor',
  templateUrl: './listado-proyectos-traductor.page.html',
  styleUrls: ['./listado-proyectos-traductor.page.scss'],
})
export class ListadoProyectosTraductorPage implements OnInit {
 // Utilizamos ViewChild para obtener una referencia al control de scroll infinito
 @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
 //cargamos usuario autenticado para realizar búsqueda de proyectos
 usuarioAutenticado: Usuario;
 //listaProyectos: ListadoProyectos;
 proyectos: ProyectoG[]= [];
 totalProyectos: number;
 pagina = 0;
 proyectosPorPagina = 25;


  constructor(private proyectoService: ProyectoService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private navController: NavController,
    private usuarioService: UsuarioService,
    private actionSheetController: ActionSheetController,
    private autenticacionPorJWT: AutenticadorJwtService,
    private toast: ToastController) { }

  ngOnInit() {
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      this.usuarioAutenticado = usuAutenticado;
    });
    //cargamos proyectos
    //this.cargarProyectosUrgentes();
    this.cargarProyectos()
  }

  /**
   * Metodo para cargar todos los proyectos del traductor
   */
  cargarProyectos(){
    console.log('cargando proyectos');
    
    //mostramos spinner carga
    this.comunicacionAlertas.mostrarCargando();
    
    this.proyectoService.getProyectosTraductor(this.pagina, this.proyectosPorPagina).subscribe(data => {
      //ocultamos carga
      this.comunicacionAlertas.ocultarCargando();
      if(data["result"] == 'fail'){
        this.comunicacionAlertas.mostrarAlerta('No se ha podido obtener la lista de proyectos.')
      } else {
        this.totalProyectos = data.totalProyectos;
        data.proyectos.forEach(proyecto => this.proyectos.push(proyecto));
        // La próxima vez que se carguen mensajes se cargará la siguiente "página"
        this.pagina++;
        console.log(this.proyectos);
        
      }

    });
  }

  /**
   * Metodo para cargar todos los proyectos urgentes (1 semana) del traductor logueado
   */
  cargarProyectosUrgentes(){
    //mostramos spinner carga
    this.comunicacionAlertas.mostrarCargando();
    //limpiamos lista de proyectos para meter los urgentes
    //this.proyectos.splice(0, this.proyectos.length);
    this.proyectoService.getProyectosTraductorUrgentes(this.pagina, this.proyectosPorPagina).subscribe(data => {
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

  segmentChanged(){
    console.log(event.target);
    //si urgente esta a true cargamos todos, si no, cargamos urgentes
   if(document.getElementsByTagName('ion-segment-button')[0].ariaSelected == "true"){
      this.cargarProyectos();
      
    } else {
      console.log('Urgente seleccionado');
      this.cargarProyectosUrgentes();
    }
    
    
  }

  /**
   * Metodo para mostrar informacion de proyecto al hacer clic sobre el
   * @param proyecto 
   */
   mostrarInformacion(proyecto : ProyectoG){
    this.comunicacionAlertas.mostrarAlerta("Encargo: " + proyecto.descripcion + "<br>Traductor: " + proyecto.traductor.nombre
    + "<br>Combinación lingüística: " + proyecto.lo.nombre + "-" + proyecto.lm.nombre)
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
 * Metodo para ir a pantalla de inicio de vista traductor
 */
 irInicioTraductor(){
  this.navController.navigateForward('/listado-proyectos-traductor');
}

irEditor(){
  this.navController.navigateForward('/editor')
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
