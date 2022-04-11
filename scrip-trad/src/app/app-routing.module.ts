import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CrearProyectoPage } from './pages/crear-proyecto/crear-proyecto.page';
import { EditorPage } from './pages/editor/editor.page';
import { ListadoProyectosGestorPage } from './pages/listado-proyectos-gestor/listado-proyectos-gestor.page';
import { ListadoProyectosTraductorPage } from './pages/listado-proyectos-traductor/listado-proyectos-traductor.page';
import { LoginPageModule } from './pages/login/login.module';
import { LoginPage } from './pages/login/login.page';
import { RegistroPage } from './pages/registro/registro.page';

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
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'crear-proyecto',
    loadChildren: () => import('./pages/crear-proyecto/crear-proyecto.module').then( m => m.CrearProyectoPageModule)
  },
  {
    path: 'editor/:id',
    loadChildren: () => import('./pages/editor/editor.module').then( m => m.EditorPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot( routes, { preloadingStrategy: PreloadAllModules}
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
