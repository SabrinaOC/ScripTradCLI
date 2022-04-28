import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ElegirRolPageRoutingModule } from './elegir-rol-routing.module';

import { ElegirRolPage } from './elegir-rol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ElegirRolPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ElegirRolPage]
})
export class ElegirRolPageModule {}
