import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoProyectosGestorPageRoutingModule } from './listado-proyectos-gestor-routing.module';

import { ListadoProyectosGestorPage } from './listado-proyectos-gestor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoProyectosGestorPageRoutingModule
  ],
  declarations: [ListadoProyectosGestorPage]
})
export class ListadoProyectosGestorPageModule {}
