import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoProyectosGestorPage } from './listado-proyectos-gestor.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoProyectosGestorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoProyectosGestorPageRoutingModule {}
