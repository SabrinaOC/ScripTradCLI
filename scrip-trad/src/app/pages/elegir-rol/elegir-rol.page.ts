import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/interfaces';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { ComunicacionDeAlertasService } from 'src/app/providers/comunicacion-de-alertas.service';
import { UsuarioService } from 'src/app/providers/usuario.service';

@Component({
  selector: 'app-elegir-rol',
  templateUrl: './elegir-rol.page.html',
  styleUrls: ['./elegir-rol.page.scss'],
})
export class ElegirRolPage implements OnInit {

  usuAutenticado: Usuario;
  waiting: boolean = false;
  registerForm: FormGroup; //para comprobaciones formulario html
  user : any;
  constructor(private usuarioService: UsuarioService,
    private router: Router,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private navControler: NavController,
    private route: ActivatedRoute,
    private autenticadorJwtService: AutenticadorJwtService) { }

  ngOnInit() {
    // Comprobamos que no hay un usuairo ya autenticado, si es as'i, redirigimos
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      if(usuAutenticado.id) {
        this.usuAutenticado = usuAutenticado;
        if(this.usuAutenticado.idTipoUsuario == 1) this.navControler.navigateForward('/listado-proyectos-traductor');
        if(this.usuAutenticado.idTipoUsuario == 2) this.navControler.navigateForward('/listado-proyectos-gestor');
      } 
    });

    this.route.queryParams.subscribe(params => {
      let data = this.router.getCurrentNavigation().extras.state;
      console.log('data: ', data) 
      if(data === undefined){
        this.navControler.navigateForward('');
      } else if (data.user) {
          this.user = data.user;
      } 
    });

    //formulario reactivo
    this.registerForm = new FormGroup({  
      usuario: new FormControl('', Validators.required),
      idTipoProfesional: new FormControl()
    })
  

  }

  /**
   * Metodo para registrar usuario con datos google
   */
  registrarUsuario(){
    console.log('Nombre: ', this.user.givenName, ' ', this.user.familyName)
    console.log('Datos google: ', this.user.imageUrl)
    let nombre = this.user.givenName + ' ' + this.user.familyName
    
    console.log('DATOS FORM:\n usuario:', this.registerForm.controls.usuario.value, '\n rol: ', this.registerForm.controls.idTipoProfesional.value)
    
    /*registramos usuario con estos datos*/
    this.usuarioService.registroUsuarioGoogle(nombre, this.user.email, this.registerForm.controls.usuario.value, this.registerForm.controls.idTipoProfesional.value).then(data => {
      if(data["result"] === "success") {
        this.usuarioService.signInGoogle(this.user.email).then(data => {
          if (data.jwt != undefined) {
            this.autenticadorJwtService.almacenaJWT(data.jwt); // Almaceno un nuevo JWT
            
              if(this.registerForm.controls.idTipoProfesional.value===1){
                this.navControler.navigateForward('/listado-proyectos-traductor'); // Navego hasta el listado de mensajes
              } else {
                this.navControler.navigateForward('/listado-proyectos-gestor'); // Navego hasta el listado de mensajes
              }
            
            
            }
          })
        
      } else {
        //ha habido un error
        this.comunicacionAlertas.mostrarAlerta('Ha habido un error en el registro. Vuelve a intentarlo en unos minutos.')
      }
    
    }) 
  
      
  }

  /**
   * Metodo para cancelar proceso de registro y volver a login
   */
  irALogin() {
    this.navControler.navigateForward('')
  }

}

