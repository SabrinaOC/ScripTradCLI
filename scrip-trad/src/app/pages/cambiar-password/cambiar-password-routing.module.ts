import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarPasswordPage } from './cambiar-password.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarPasswordPageRoutingModule {}
