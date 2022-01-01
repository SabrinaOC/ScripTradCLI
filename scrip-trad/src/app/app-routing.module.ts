import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'listado-proyectos-gestor',
    loadChildren: () => import('./pages/listado-proyectos-gestor/listado-proyectos-gestor.module').then( m => m.ListadoProyectosGestorPageModule)
  },
  {
    path: 'listado-proyectos-traductor',
    loadChildren: () => import('./pages/listado-proyectos-traductor/listado-proyectos-traductor.module').then( m => m.ListadoProyectosTraductorPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
