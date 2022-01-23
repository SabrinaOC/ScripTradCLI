import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { SegmentoService } from '../../providers/segmento.service';
import { UsuarioService } from '../../providers/usuario.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { Usuario, ProyectoG, Segmento } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.page.html',
  styleUrls: ['./editor.page.scss'],
})
export class EditorPage implements OnInit {

  idPr: string;
  segmentos: Segmento [] = [];
  segmentoActual: Segmento;
  ordenCarga;

  //cargamos usuario autenticado para realizar búsqueda de proyectos
  usuarioAutenticado: Usuario;
  constructor(
    private segmentoService: SegmentoService,
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
      this.idPr = params.get('id');
    });

    //cargamos segmentos del proyecto
    this.cargarSegmentosProyecto();
    
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
   
    for(let i = 0; i < this.segmentos.length; i++){
          //recorremos la lista de segmentos hasta encontrar el primero sin traduccion
          //y lo cargamos como actual
          if(this.segmentos[i].textoLM == null || this.segmentos[i].textoLM == ''){
            this.segmentoActual = this.segmentos[i];
            //y salimos del bucle
            break;
          }
        }
        console.log(this.segmentos);
    
    
    
  }

  /**
   * Metodo para navegar a segmento siguiente
   * @param segmento 
   */
  irASiguienteSegmento(segmento: Segmento){
    for(let i = 0; i < this.segmentos.length; i++){
      if(segmento.id == this.segmentos[i].id) this.segmentoActual = this.segmentos[i+1];
    }
  }

  /**
   * Metodo para navegar a segmento anterior
   * @param segmento
   */
  irASegmentoAnterior(segmento: Segmento){
    for(let i = 0; i < this.segmentos.length; i++){
      if(segmento.id == this.segmentos[i].id) this.segmentoActual = this.segmentos[i-1];
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
  this.navController.navigateForward('/listado-proyectos-traductor');
}

irEditor(){
  this.navController.navigateForward('/editor')
}
}

