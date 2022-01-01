import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoProyectosTraductorPageRoutingModule } from './listado-proyectos-traductor-routing.module';

import { ListadoProyectosTraductorPage } from './listado-proyectos-traductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoProyectosTraductorPageRoutingModule
  ],
  declarations: [ListadoProyectosTraductorPage]
})
export class ListadoProyectosTraductorPageModule {}
