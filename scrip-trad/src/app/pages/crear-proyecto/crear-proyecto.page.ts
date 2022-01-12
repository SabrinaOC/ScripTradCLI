import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActionSheetController, IonInfiniteScroll, NavController, ToastController, MenuController  } from '@ionic/angular';


import { ProyectoService } from '../../providers/proyecto.service';
import { UsuarioService } from '../../providers/usuario.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { Router } from '@angular/router';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { Usuario, ProyectoG } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-crear-proyecto',
  templateUrl: './crear-proyecto.page.html',
  styleUrls: ['./crear-proyecto.page.scss'],
})
export class CrearProyectoPage implements OnInit {

  constructor(private navController: NavController) { }

  ngOnInit() {
  }

  /**
 * Metodo para ir a pantalla de inicio de vista gestor
 */
irInicioGestor(){
  this.navController.navigateForward('/listado-proyectos-gestor');
}

crearNuevoProyecto(){
  this.navController.navigateForward('crear-proyecto');
}

}
