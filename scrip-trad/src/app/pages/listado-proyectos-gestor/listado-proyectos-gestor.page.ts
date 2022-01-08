import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ActionSheetController, IonInfiniteScroll, IonList, MenuController, NavController } from '@ionic/angular';

import { ProyectoService } from '../../providers/proyecto.service';
import { UsuarioService } from '../../providers/usuario.service';
import { ComunicacionDeAlertasService } from '../../providers/comunicacion-de-alertas.service';
import { NavigationExtras, Router } from '@angular/router';
import { AutenticadorJwtService } from 'src/app/providers/autenticador-jwt.service';
import { ListadoProyectos, Usuario, ProyectoG } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-listado-proyectos-gestor',
  templateUrl: './listado-proyectos-gestor.page.html',
  styleUrls: ['./listado-proyectos-gestor.page.scss'],
})
export class ListadoProyectosGestorPage implements OnInit {
  //cargamos usuario autenticado para realizar búsqueda de proyectos
  usuarioAutenticado: Usuario;
  //listaProyectos: ListadoProyectos;
  proyectos: ProyectoG[]= [];
  totalProyectos: number;
  pagina = 0;
  proyectosPorPagina = 25;

  constructor(private proyectoService: ProyectoService,
    private comunicacionAlertas: ComunicacionDeAlertasService,
    private navControler: NavController,
    private router: Router, private usuarioService: UsuarioService,
    private actionSheetController: ActionSheetController,
    private autenticacionPorJWT: AutenticadorJwtService) { }

  ngOnInit() {
    
    // Cargamos el usuario autenticado
    this.usuarioService.getUsuarioAutenticado(true).subscribe(usuAutenticado => {
      this.usuarioAutenticado = usuAutenticado;
    })

    this.cargarProyecto();
  }

  cargarProyecto(){
    //mostramos spinner carga
    //this.comunicacionAlertas.mostrarCargando();
    console.log(this.usuarioAutenticado)
    this.proyectoService.getProyectosGestor(this.pagina, this.proyectosPorPagina).subscribe(data => {
      //ocultamos carga
      //this.comunicacionAlertas.ocultarCargando();
      if(data["result"] == 'fail'){
        this.comunicacionAlertas.mostrarAlerta('No se ha podido obtener la lista de proyectos.')
      } else {
        this.totalProyectos = data.totalProyectos;
        data.proyectos.forEach(proyecto => this.proyectos.push(proyecto));
        // La próxima vez que se carguen mensajes se cargará la siguiente "página"
        this.pagina++;
      }

    })
  }

  mostrarInformacion(proyecto : ProyectoG){
    this.comunicacionAlertas.mostrarAlerta("Encargo: " + proyecto.descripcion + "<br>Traductor: " + proyecto.traductor.nombre
    + "<br>Combinación lingüística: " + proyecto.lo.nombre + "-" + proyecto.lm.nombre)
  }
}
