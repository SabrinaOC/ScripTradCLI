import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearProyectoPageRoutingModule } from './crear-proyecto-routing.module';

import { CrearProyectoPage } from './crear-proyecto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearProyectoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrearProyectoPage]
})
export class CrearProyectoPageModule {}
