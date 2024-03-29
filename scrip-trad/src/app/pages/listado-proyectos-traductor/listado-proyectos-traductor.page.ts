import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActionSheetController, IonInfiniteScroll, isPlatform, NavController } from '@ionic/angular';


import { ProyectoService } from '../../providers/proyecto.service';
import { UsuarioService } from '../../providers/usuario.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { Usuario, Proyecto } from 'src/app/interfaces/interfaces';
import axios from 'axios';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

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
 proyectos: Proyecto[] = [];
 totalProyectos: number;
 pagina = 0;
 proyectosPorPagina = 25;
 tipoProyecto = 1; //1 urgente, 0 todos
 selected = 1; //1 urgente, 0 todos

 quote: string;
 author: string;


  constructor(private proyectoService: ProyectoService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private navController: NavController,
    private usuarioService: UsuarioService,
    private actionSheetController: ActionSheetController,
    private autenticacionPorJWT: AutenticadorJwtService,
    private router: Router) { }

  ngOnInit() {
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      if(usuAutenticado.id) {
        this.usuarioAutenticado = usuAutenticado;
      } else {
        this.navController.navigateForward('');
      }
    });
    //cargamos proyectos
    this.cargarProyectosUrgentes()

    if(!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }
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
    this.proyectoService.getProyectosTraductorUrgentes(this.pagina, this.proyectosPorPagina).subscribe(data => {
      //ocultamos carga
      this.comunicacionAlertas.ocultarCargando();
      if(data["result"] == 'fail'){
        this.comunicacionAlertas.mostrarAlerta('No se ha podido obtener la lista de proyectos.')
      } else {
        this.totalProyectos = data.totalProyectos;
        data.proyectos.forEach(proyecto => this.proyectos.push(proyecto));

        if(this.totalProyectos == 0){
          console.log('Si noy pendientes llamamos api quote of the day');
          this.quoteOfTheDay();
          
        }
        // La próxima vez que se carguen mensajes se cargará la siguiente "página"
        this.pagina++;
      }

    });
  }

  /**
   * Recarga de los proyectosal cambiar el segment seleccionado
   * @param nuevoTipo 
   */
   recargarListadoProyectos(tipo: number) {
    this.tipoProyecto = tipo;
    this.proyectos = [];
    this.pagina = 0;
    if(this.tipoProyecto == 1){
      this.cargarProyectosUrgentes();
    } 
    if(this.tipoProyecto == 0) {
      this.cargarProyectos();
    }
    
  }

  /**
   * Metodo para ver segment seleccionado y actuar al respecto
   */
  segmentChanged(){
    console.log(event.target);
    //si urgente esta a true cargamos todos, si no, cargamos urgentes
   if(document.getElementsByTagName('ion-segment-button')[0].ariaSelected == "true"){
      this.recargarListadoProyectos(0);
      this.selected = 0;
      
    } else {
      console.log('Urgente seleccionado');
      this.recargarListadoProyectos(1);
      this.selected = 1;
    }
    
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


async quoteOfTheDay(){
  //hacemos consulta a api
  try{
    let response = await axios.get('https://quotes15.p.rapidapi.com/quotes/random/', 
    {
      headers: {
        'X-RapidAPI-Host': 'quotes15.p.rapidapi.com',
        'X-RapidAPI-Key': '8e1ab3a4famshcdbf49ea6b00c54p11230ejsnfb424bda1424'
      }},
    );

    let jsonResult = await response.data;
     this.quote = jsonResult.content;
     this.author = jsonResult.originator.name;
    //console.log(jsonResult);
    console.log(jsonResult);
     
    

    
  }catch{
    console.log('No se ha podido conectar con quote of the day.')
    
  }



} 

refreshGoogle() {
  GoogleAuth.signOut().then(data => {
    this.navController.navigateForward('');
  })
}

/**
 * Metodo para ir a pantalla de inicio de vista traductor
 */
 irInicioTraductor(){
  this.navController.navigateForward('/listado-proyectos-traductor');
}

/**
 * Metodo para abrir el editor de traduccion cargando los segmentos del proyecto seleccionado
 * @param proyeto 
 */
irEditor(proyecto: Proyecto){
  //navegamos hasta el editor pasando como paramtero el id del proyecto seleccionado
  console.log(proyecto)
  this.router.navigate(['/editor', proyecto.id]);

}

/**
 * Metodo para abrir editor con primer proyecto de lista
 */
irEditorConPrimerProyectoDeLista(){
  //navegamos hasta el editor pasando como paramtero el id del primer proyecto de la lista
  this.router.navigate(['/editor', this.proyectos[0].id]);
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
