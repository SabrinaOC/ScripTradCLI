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
import { SegmentoService } from 'src/app/providers/segmento.service';






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

  textoDocumento: string;
  textoComm: string;
  hayCommentario = false;


  constructor(private navController: NavController,
   private usuarioService: UsuarioService,
   private proyectoService: ProyectoService,
   private idiomaService: IdiomaService,
   private segmentoService: SegmentoService,
   private autenticacionPorJWT: AutenticadorJwtService,
   private comunicacionAlertas: ComunicacionDeAlertasService,
   private actionSheetController: ActionSheetController,
   ) { }

  ngOnInit() {
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      console.log(usuAutenticado);
      
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
      descripcion: new FormControl('', [Validators.required]),
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

    //prueba para leer doc
    const inputDoc: any = document.getElementById('doc');

   
    
  }

  /**
   * 
   */
  leoFicheroTexto(){
    const inputNode: any = document.querySelector('#textFile'); // Obtengo el control etiquetado en Angular como #textFile

    if (typeof (FileReader) !== 'undefined') { // tomo una precaución para comprobar que puedo utilizar el tipo FileReader
      const reader = new FileReader(); // Instancio un FileReader()
      console.log("Hay FileReader. Siguiente: comprobamos que hay archivo")
      console.log("extension: ", inputNode.files[0].type)
      //comprobamos que es un archivo con formato correcto(txt)
      if(inputNode.files[0].type == "text/plain"){

        if (inputNode.files[0] != null) {
          reader.readAsText(inputNode.files[0]);
          console.log("Entra en primer if")
        }
  
        reader.onload = (e: any) => {
          //console.log(e.target.result);
          this.textoDocumento = e.target.result;
        };

      }else {
        this.comunicacionAlertas.mostrarAlerta("Formato no soportado, por favor, elija un .txt")
      }

      
    }
  }

  /**
   * Método para leer documento de comentarios
   */
  leoComentarios(){
    const inputNode: any = document.querySelector('#commFile'); // Obtengo el control etiquetado en Angular como #textFile

    if (typeof (FileReader) !== 'undefined') { // tomo una precaución para comprobar que puedo utilizar el tipo FileReader
      const reader = new FileReader(); // Instancio un FileReader()
     
      console.log("extension: ", inputNode.files[0].type)
      //comprobamos que es un archivo con formato correcto(txt)
      if(inputNode.files[0].type == "text/plain"){

        if (inputNode.files[0] != null) {
          reader.readAsText(inputNode.files[0]);
          console.log("Entra en primer if")
        }
  
        reader.onload = (e: any) => {
          //console.log(e.target.result);
          this.textoComm = e.target.result;
          //bandera para saber que tenemos que mandar comentario
          this.hayCommentario = true;
        };

      }else {
        this.comunicacionAlertas.mostrarAlerta("Formato no soportado, por favor, elija un .txt")
      }

      
    }
  }

  /**
   * Método para enviar datos de nuevo proyecto a back
   */
  crearProyecto(){
    console.log("Título: " + this.newProjectForm.controls.nombreProyecto.value)
    console.log("Traductor: " + this.newProjectForm.controls.trad.value)
    console.log("Gestor: " + this.usuarioAutenticado.id)
    console.log("LO: " + this.newProjectForm.controls.lenguaOrigen.value)
    console.log("LM: " + this.newProjectForm.controls.lenguaMeta.value)
    console.log("Fecha de entrega: " + this.fechaEntrega)
    console.log("Descripción: " + this.newProjectForm.controls.descripcion.value)
    console.log("Comentarios: " + this.textoComm)
    console.log("Texto LO: " + this.textoDocumento)

    //comprobamos que se ha subido un documento con comentarios
    if(!this.hayCommentario) this.textoComm = null;

    this.proyectoService.crearNuevoProyecto(this.newProjectForm.controls.nombreProyecto.value,
      this.newProjectForm.controls.trad.value, this.usuarioAutenticado.id, this.newProjectForm.controls.lenguaOrigen.value,
      this.newProjectForm.controls.lenguaMeta.value, this.fechaEntrega, this.newProjectForm.controls.descripcion.value,
      this.textoComm).then(data => {
        if(data["result"] == "success"){
          
          //si se ha creado el proyecto correctamente, insertamos los segmentos
          this.segmentoService.insertarSegmentos(this.textoDocumento, data["proyecto"]).then(data => {
            if(data["result"] == "success"){
              this.comunicacionAlertas.mostrarAlerta("Proyecto creado con éxito.");
            }
          })
          
        } else {
          this.comunicacionAlertas.mostrarAlerta("Se ha producido un error al crear el proyecto, por favor, vuelve a intentarlo más tarde.")
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
