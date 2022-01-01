import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../providers/usuario.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AutenticadorJwtService } from '../../providers/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  waiting: boolean = false;
  loginForm: FormGroup; //para comprobaciones formulario html

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
    //Formgroup para formulario reactivo (validacion)
    this.loginForm = new FormGroup({
      //aqui ponemos los campos del formulario
      usuario: new FormControl('Sab94', [Validators.required]), //lo marcamos como campo obligatorio
      pass: new FormControl('sabrina', [Validators.required])
    });
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
          this.navControler.navigateForward('/listado-proyectos-gestor'); // Navego hasta el listado de mensajes
        }
        else {
          this.comunicacionAlertas.mostrarAlerta("Usuario y/o contraseña incorrecta");
        }
      }).catch(error => { // Se ha producido algún tipo de error en el acceso al servidor o el servidor ha devuelto un error.
        this.waiting = false;
        this.comunicacionAlertas.mostrarAlerta('Error en acceso al servidor');
      });


  }
}
