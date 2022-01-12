import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearProyectoPage } from './crear-proyecto.page';

const routes: Routes = [
  {
    path: '',
    component: CrearProyectoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearProyectoPageRoutingModule {}
