import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, NavController } from '@ionic/angular';
import { TipoUsuario, Usuario } from 'src/app/interfaces/interfaces';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from 'src/app/providers/comunicacion-de-alertas.service';
import { TipoUsuarioService } from 'src/app/providers/tipo-usuario.service';
import { UsuarioService } from 'src/app/providers/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuarioAutenticado: Usuario;
  editForm: FormGroup;
  tipoUsuario: TipoUsuario;

  constructor(private usuarioService: UsuarioService,
              private tipoUsuarioService: TipoUsuarioService,
              private actionSheetController: ActionSheetController,
              private navController: NavController,
              private comunicacionAlertas: ComunicacionDeAlertasService,
              private autenticacionPorJWT: AutenticadorJwtService) { }

  ngOnInit() {
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      if(usuAutenticado.id) {
        this.usuarioAutenticado = usuAutenticado;
        //una vez tenemos usuario autenticado, cargamos resto de datos
        this.cargarTipoUsuario();
        
      } else {
        this.navController.navigateForward('');
      }
    });

    
  }

  /**
   * Formulario reactivo
   */
   formulario(){
    this.editForm = new FormGroup({
      nombre: new FormControl(this.usuarioAutenticado.nombre, Validators['required']),
      usuario: new FormControl(this.usuarioAutenticado.usuario, Validators['required']),
      tipoUsuario: new FormControl (this.tipoUsuario.descripcion, [Validators.required]),
      email: new FormControl (this.usuarioAutenticado.email, [Validators.required, Validators.email]),    
    });
  }

  /**
   * 
   */
  cargarTipoUsuario() {
    this.tipoUsuarioService.getTipoUsuario(this.usuarioAutenticado.idTipoUsuario).then(data => {
      if(data["result"] == "success") {
        this.tipoUsuario = data["tipoUsuario"];
        this.formulario();
      } else {
        this.comunicacionAlertas.mostrarAlerta("No se ha podido cargar el rol de usuario.")
      }
    })
  }

  /**
   * Metodo para cambiar imagen usuario de forma instantenea y cambiarla en objeto
   */
  seleccionarImagen(){
     //cojo input file
     const inputImg: any = document.getElementById('nuevaImg');

     //necesito leer la imagen
     const reader = new FileReader();
     reader.readAsArrayBuffer(inputImg.files[0]);

     //disparamos onload y cambiamos imagen de usuario
     reader.onload = (e : any) => {
       this.usuarioAutenticado.img = btoa(
         new Uint8Array(e.target.result).reduce((data, byte) => data + String.fromCharCode(byte), '')
       );
     };
  }

   /**
     * Metodo para controlar boton registro y proceder a la conexion con spring
     */
    editar(){
     
     //pedimos confirmacion
     this.comunicacionAlertas.mostrarConfirmacion('¿Confirmar cambios del perfil?', 
     () => {
      //llamamos a servicio de usuario
      this.usuarioService.updateUsuario(this.editForm.controls.nombre.value, this.editForm.controls.email.value, this.editForm.controls.usuario.value, this.usuarioAutenticado.img).then(data => {
        if(data["result"] == "success"){
          this.comunicacionAlertas.mostrarAlertaAccionOk('Datos de perfil actualizados con éxito.',
          ()=> {
            //this.irInicio();
            console.log("Datos perfil actualizados");
          });
        } else {
          this.comunicacionAlertas.mostrarAlerta('Se ha producido un error al intentar actualizar los datos de perfil. Vuelve a intentarlo en unos minutos.');
        }
      })
     }, () => {
       console.log('cancel');
     })
      
        
    }

  /**
   * Metodo para navegar a inicio
   */
  irInicio() {
    //dependiendo del tipo de usuario navegamos a un sito u otro
    if(this.usuarioAutenticado.idTipoUsuario == 1) {
      this.navController.navigateForward('/listado-proyectos-traductor');
    }
    if(this.usuarioAutenticado.idTipoUsuario == 2) {
      this.navController.navigateForward('/listado-proyectos-gestor');
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
