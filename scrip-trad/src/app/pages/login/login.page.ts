import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../providers/usuario.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AutenticadorJwtService } from '../../providers/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { Usuario } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  waiting: boolean = false;
  loginForm: FormGroup; //para comprobaciones formulario html
  usu: Usuario;
  isHidden: boolean;
  /**
   * 
   * @param usuarioService 
   * @param router 
   * @param autenticadorJwtService 
   * @param comunicacionAlertas 
   * @param navControler 
   */
  constructor(private usuarioService: UsuarioService, private router: Router,
    private autenticadorJwtService: AutenticadorJwtService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private navControler: NavController
    ) { } 

  ngOnInit() {
     // Comprobamos que no hay un usuairo ya autenticado, si es as'i, redirigimos
     this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      if(usuAutenticado.id) {
        this.usu = usuAutenticado;
        if(this.usu.idTipoUsuario == 1) this.navControler.navigateForward('/listado-proyectos-traductor');
        if(this.usu.idTipoUsuario == 2) this.navControler.navigateForward('/listado-proyectos-gestor');
      } 
    });

    //Formgroup para formulario reactivo (validacion)
    this.loginForm = new FormGroup({
      //aqui ponemos los campos del formulario
      usuario: new FormControl('Sab94', Validators.required), //lo marcamos como campo obligatorio
      pass: new FormControl('sabrina', Validators.required)
    });

    //iniciamos boolean para ocultar o mostrar pass
    this.isHidden = true;
  }


  /**
   * Método que llama al servicio de los usuarios para autenticar los campos escritos en el formulario
   */
   autenticaUsuario() {
    this.waiting = true; // Para mostrar el "loading" del botón del formulario
    this.usuarioService.autenticaUsuario(this.loginForm.controls.usuario.value,
      this.loginForm.controls.pass.value).then(data => {
        this.waiting = false;
        if (data.jwt != undefined) {
          this.autenticadorJwtService.almacenaJWT(data.jwt); // Almaceno un nuevo JWT
          //dependiendo del tipo de usuario redirigiremos a un sitio u otro
          this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
            this.usu = usuAutenticado;
            console.log(this.usu);
            if(this.usu.idTipoUsuario===1){
              this.navControler.navigateForward('/listado-proyectos-traductor'); // Navego hasta el listado de mensajes
            } else {
              this.navControler.navigateForward('/listado-proyectos-gestor'); // Navego hasta el listado de mensajes
            }
          })
          
        }
        else {
          this.comunicacionAlertas.mostrarAlerta("Usuario y/o contraseña incorrecta");
        }
      }).catch(error => { // Se ha producido algún tipo de error en el acceso al servidor o el servidor ha devuelto un error.
        this.waiting = false;
        this.comunicacionAlertas.mostrarAlerta('Error en acceso al servidor');
      });


  }

  /**
   * Funcion para recuperar contrasena
   */
  passForgotten(){
    this.comunicacionAlertas.mostrarMensajeConInput("Introduce el mismo email que has usado para registrarte para cambiar tu contraseña.")
  }

  irRegistro(){
    this.navControler.navigateForward('registro');
  }

}