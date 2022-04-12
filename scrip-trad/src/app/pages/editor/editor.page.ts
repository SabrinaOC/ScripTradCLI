import { Component, ElementRef, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { SegmentoService } from '../../providers/segmento.service';
import { UsuarioService } from '../../providers/usuario.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { Usuario, Segmento, Proyecto, Glosario } from 'src/app/interfaces/interfaces';
import { ProyectoService } from 'src/app/providers/proyecto.service';
import axios from 'axios';
import { FormControl, FormGroup } from '@angular/forms';
import { GlosarioService } from 'src/app/providers/glosario.service';

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
  glosarioActual: Glosario;
  listaCoincidencias: Glosario [] = [];
  noCoincidencia: boolean;

  glosarioForm: FormGroup;

  //cargamos usuario autenticado para realizar búsqueda de proyectos
  usuarioAutenticado: Usuario;
  constructor(
    private segmentoService: SegmentoService,
    private proyectoService: ProyectoService,
    private glosarioService: GlosarioService,
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
      
      if(usuAutenticado.id) {
        this.usuarioAutenticado = usuAutenticado;
        if(this.usuarioAutenticado.idTipoUsuario == 2) this.navController.navigateForward('/listado-proyectos-gestor');
      } else {
        this.navController.navigateForward('');
      }
      
    });

    //cargamos parametros enviados
    this.route.paramMap.subscribe(params => {
      this.idPr = params.get('id');

    });


    //cargamos segmentos del proyecto  
    this.cargarSegmentosProyecto();

    this.cargarProyectoActual();

    //iniciamos formgroup
    this.glosarioForm = new FormGroup({
      terminoO: new FormControl(),
      terminoM: new FormControl()
    })
    
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
        this.proyectoActual = data['proyecto'];
        //this.cargarPrimerSegmentoSinTraduccion();
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
   //console.log('Segmentos list size= ' , this.segmentos.length, '\nSegmento: ' , this.segmentos);
   let isAllTranslated = true;
   
    for(let i = 0; i < this.segmentos.length; i++){
      //recorremos la lista de segmentos hasta encontrar el primero sin traduccion
      //y lo cargamos como actual
      if(this.segmentos[i].textoLM == null || this.segmentos[i].textoLM == ''){
        this.segmentoActual = this.segmentos[i];
        //guardamos posicion de i para calcular porcentaje de traduccion realizada
        this.porcentaje = i; // i+1
        isAllTranslated = false;
        //y salimos del bucle
        break;
      }
    }
    //si no hay ningun segmento pendiente de traduccion cargaremos como actual el ultimo
    if(isAllTranslated) this.segmentoActual = this.segmentos[this.segmentos.length-1];
        
    
  }

  /**
   * Metodo para navegar a segmento siguiente
   * @param segmento 
   */
  irASiguienteSegmento(){
    //antes de cambiar segmento en pantalla, guardamos traduccion (si se ha escrito)
    this.guardarTraduccionSegmento();
    
    for(let i = 0; i < this.segmentos.length; i++){
      //ultimo segmento
      if(i == this.segmentos.length-1){
        this.segmentoActual == this.segmentos[this.segmentos.length];
        this.porcentaje = this.segmentos.length-1;
        break;
      }

      if(this.segmentoActual.id == this.segmentos[i].id && i < this.segmentos.length) { 
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
    //antes de cambiar segmento en pantalla, guardamos traduccion
    this.guardarTraduccionSegmento();

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
   * Metodo para llamar al servicio para guardar traduccion del segmento actual
   */
  guardarTraduccionSegmento() {
    let t = (<HTMLTextAreaElement>document.getElementById('traduccion')).value;
    console.log(t)
    //si hay contenido en el text area lo ponemos como segmento actual
    if(t != "") {
      this.segmentoActual.textoLM = t;
    }

    //this.segmentoActual.textoLM = 
    if(this.segmentoActual.textoLM != null){
      console.log("Guardando traduccion")
      this.segmentoService.insertarTraduccion(this.segmentoActual.textoLM, this.segmentoActual.id).then(data => {
        if (data["result"] == "fail"){
          this.comunicacionAlertas.mostrarAlerta("Ha sucedido un error al guardar la traducción. Vuelve a intentarlo en unos minutos.")
        } 
      })
    }
    
  }

  /**
   * Metodo para generar traduccion automatica
   */
  async generarTraduccion(){

    //hacemos consulta a api
    try{
      let response = await axios.get('https://translated-mymemory---translation-memory.p.rapidapi.com/api/get', 
      {params: {langpair: `${this.proyectoActual.lo.nombre}|${this.proyectoActual.lm.nombre}`, q: this.segmentoActual.textoLO, mt: '1', onlyprivate: '0', de: 'a@b.c'},
      headers: {'x-rapidapi-host': 'translated-mymemory---translation-memory.p.rapidapi.com',
          'x-rapidapi-key': '8e1ab3a4famshcdbf49ea6b00c54p11230ejsnfb424bda1424'}},
      );

      let jsonResult = await response.data;
      console.log(jsonResult['responseData']['translatedText']);
      //guardamos traduccion proporcionada en segmento actual LM
      this.segmentoActual.textoLM = jsonResult['responseData']['translatedText'];

      
    }catch{
      this.comunicacionAlertas.mostrarAlerta('No se ha podido generar una traducción automática. Vuelve a intentarlo pasados unos instantes.')
      console.log('error traduccion automatica');
      
    }
    
  }

  /**
   * 
   */
   async buscarEnGlosario() {
    let input = (<HTMLInputElement>document.getElementById("inputBusquedaGlosario")).value;
    if(input != '') {
      this.glosarioService.buscarCoincidencias(this.proyectoActual.id, input).then(data => {
        if(data["result"]== "success"){
          console.log(data["equivalencias"])
          //si no hay coincidencias no mostramos 
          if(data["equivalencias"].length > 0) {
            //vaciamos posible lista para poner nuevos valores
            this.listaCoincidencias = [];
            data.equivalencias.forEach((g: Glosario) => {
              this.listaCoincidencias.push(g);
              this.glosarioActual = this.listaCoincidencias[0];
              this.noCoincidencia = false;
            });
          } else {
            this.glosarioActual = null;
            this.noCoincidencia = true;
          }
        }
      })
    } else {
      this.glosarioActual = null;
      this.noCoincidencia = null;
    }
  }

  /**
   * Alerta para confirmar insert terminos en glosario
   */
  glosarioConfirm() {
    console.log(this.glosarioForm.controls.terminoO.value)
    this.comunicacionAlertas.mostrarConfirmacion(`¿Guardar "${this.glosarioForm.controls.terminoO.value}" en el glosario del proyecto?`, 
    () => {
      this.insertarEquivalencias();
    }, () => console.log('cancel'));
  }

  /**
   * Llamada al servicio de glosario para hacer insert efectivo
   */
  insertarEquivalencias() {
    
    this.glosarioService.insertarTraduccion(this.glosarioForm.controls.terminoO.value, this.glosarioForm.controls.terminoM.value, this.proyectoActual.id).then(data => {
      if(data["result"] == "fail") {
        this.comunicacionAlertas.mostrarAlerta('Ha ocurrido un error al intentar guardar la entrada en el glosario. Vuelve a intentarlo pasados unos instantes.')
      } else {
        this.comunicacionAlertas.mostrarAlerta('Términos guardados con éxito.')
        this.glosarioForm.reset();
      }
    })
  }

  /**
   * Metodo que pide confirmacion para guardar comentario en bbdd
   */
  confirmCom() {
    let c = (<HTMLTextAreaElement>document.getElementById('textAreaComentarios')).value;
    console.log(`${this.proyectoActual.comentarios} \n - ${this.usuarioAutenticado.email}: ${c}.`)
    //pedimos confirmacion
    this.comunicacionAlertas.mostrarConfirmacion('¿Guardar comentario?', 
    () => {//mandamos comentario a bbdd
      this.proyectoService.addComentario(this.proyectoActual.id, `${this.proyectoActual.comentarios} - ${this.usuarioAutenticado.email}: ${c}\n`).then(data => {
        if(data["result"] == "fail") {
          this.comunicacionAlertas.mostrarAlerta('Ha ocurrido un error al intentar guardar el comentario. Vuelve a intentarlo pasados unos instantes.');
        } else {
          //recargamos datos proyecto
          this.cargarProyectoActual();
          
        }
      })
      //limpiamos input
      c = '';
    }, 
    () => {
      console.log('cancelar');
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
  //tomamos la precaucion de guardar traduccion de segmento actual
  
  this.guardarTraduccionSegmento();
  //y redirigimos a inicio
  this.navController.navigateForward('/listado-proyectos-traductor');
}


}

