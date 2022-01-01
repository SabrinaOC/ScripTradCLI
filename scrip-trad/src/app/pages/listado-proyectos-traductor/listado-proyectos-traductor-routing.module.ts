import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoProyectosTraductorPage } from './listado-proyectos-traductor.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoProyectosTraductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoProyectosTraductorPageRoutingModule {}
