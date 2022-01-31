import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { SegmentoService } from '../../providers/segmento.service';
import { UsuarioService } from '../../providers/usuario.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { Usuario, Segmento, Proyecto } from 'src/app/interfaces/interfaces';
import { ProyectoService } from 'src/app/providers/proyecto.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.page.html',
  styleUrls: ['./editor.page.scss'],
})
export class EditorPage implements OnInit {

  idPr: string;
  segmentos: Segmento [] = [];
  segmentoActual: Segmento;
  porcentaje: number;
  proyectoActual: Proyecto;

  //cargamos usuario autenticado para realizar búsqueda de proyectos
  usuarioAutenticado: Usuario;
  constructor(
    private segmentoService: SegmentoService,
    private proyectoService: ProyectoService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private navController: NavController,
    private usuarioService: UsuarioService,
    private actionSheetController: ActionSheetController,
    private autenticacionPorJWT: AutenticadorJwtService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      this.usuarioAutenticado = usuAutenticado;
    });

    //cargamos parametros enviados
    this.route.paramMap.subscribe(params => {
      this.idPr = params.get('id');
    });

    //cargamos segmentos del proyecto
    this.cargarSegmentosProyecto();

    this.cargarProyectoActual();
    
  }

  /**
   * Metodo para cargar proyecto actual, comentarios
   */
  cargarProyectoActual(){
    this.comunicacionAlertas.mostrarCargando();
    this.proyectoService.getProyectoById(parseInt(this.idPr)).subscribe(data => {
      this.comunicacionAlertas.ocultarCargando();
      if(data["result"] == "fail"){
        this.comunicacionAlertas.mostrarAlerta("No se ha podido cargar el proyecto actual.")
      } else {
        this.proyectoActual = data.p;
        this.cargarPrimerSegmentoSinTraduccion();
      }
    })
  }

  /**
   * Metodo para cargar la lista de segmentos de un proyecto
   */
  cargarSegmentosProyecto(){
    this.comunicacionAlertas.mostrarCargando();
    this.segmentoService.getAllSegmentosProyecto(parseInt(this.idPr)).subscribe(data => {
      this.comunicacionAlertas.ocultarCargando();
      if(data["result"] == "fail"){
        this.comunicacionAlertas.mostrarAlerta("No se han podido cargar los segmentos de la lengua origen.")
      } else {
        data.segmentos.forEach(s => {
          this.segmentos.push(s);
        });
        this.cargarPrimerSegmentoSinTraduccion();
      }
    })
  }

  /**
   * Metodo para cargar segmento actual, es decir, primer segmento sin traduccion
   */
  cargarPrimerSegmentoSinTraduccion(){
   console.log('Segmentos list size= ' , this.segmentos.length, '\nSegmento: ' , this.segmentos);
   
    for(let i = 0; i < this.segmentos.length; i++){
          //recorremos la lista de segmentos hasta encontrar el primero sin traduccion
          //y lo cargamos como actual
          if(this.segmentos[i].textoLM == null || this.segmentos[i].textoLM == ''){
            this.segmentoActual = this.segmentos[i];
            //guardamos posicion de i para calcular porcentaje de traduccion realizada
            this.porcentaje = i; // i+1
            //y salimos del bucle
            break;
          }
        }
    
  }

  /**
   * Metodo para navegar a segmento siguiente
   * @param segmento 
   */
  irASiguienteSegmento(){
    for(let i = 0; i < this.segmentos.length; i++){
      //ultimo segmento
      if(i == this.segmentos.length-1){
        this.segmentoActual == this.segmentos[this.segmentos.length];
        this.porcentaje = this.segmentos.length-1;
        break;
      }

      if(this.segmentoActual.id == this.segmentos[i].id && i < this.segmentos.length) { //|| 
        this.segmentoActual = this.segmentos[i+1];
        this.porcentaje ++; 
        break;
      }
      
    }
  }

  /**
   * Metodo para navegar a segmento anterior
   * @param segmento
   */
  irASegmentoAnterior(){
    for(let i = 0; i < this.segmentos.length; i++){
      if(this.segmentoActual.id == this.segmentos[0].id){
        this.porcentaje = 0;
        break;
      } 
      if(this.segmentoActual.id == this.segmentos[i].id && i > 0) {
        this.segmentoActual = this.segmentos[i-1];
        this.porcentaje--;
        break;
      }
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
   console.log('atras');
   //this.router.navigate(['/listado-proyectos-traductor']);
  this.navController.navigateForward('');
  //this.navController.navigateForward('/listado-proyectos-traductor');
}


}

