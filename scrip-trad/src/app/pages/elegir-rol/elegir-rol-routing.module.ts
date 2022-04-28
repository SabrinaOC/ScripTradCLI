import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElegirRolPage } from './elegir-rol.page';

const routes: Routes = [
  {
    path: '',
    component: ElegirRolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElegirRolPageRoutingModule {}
