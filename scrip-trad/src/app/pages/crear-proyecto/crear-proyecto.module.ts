import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearProyectoPageRoutingModule } from './crear-proyecto-routing.module';

import { CrearProyectoPage } from './crear-proyecto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearProyectoPageRoutingModule
  ],
  declarations: [CrearProyectoPage]
})
export class CrearProyectoPageModule {}
