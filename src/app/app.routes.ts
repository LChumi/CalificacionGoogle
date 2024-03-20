import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    title: 'Auth',
    loadComponent: () => import('./layouts/auth/auth.component'),
    children: [
      {
        path: ':id',
        title: 'Login',
        loadComponent: () => import('./views/login/login.component'),
      },
    ],
  },
  {
    path: 'cumple',
    title: 'Home',
    loadComponent: () => import('./layouts/home/home.component'),
    children: [
      {
        path: 'home',
        title: 'Home',
        loadComponent: () => import('./views/home/home.component'),
      },
      {
        path: 'inicio',
        title: 'Inicio',
        loadComponent: () => import('./views/index/index.component')
      },
      {
        path:'calificaciones',
        title: 'Calificaciones',
        loadComponent: () => import('./views/listado-calificacion/listado-calificacion.component')
      },
      {path:'', redirectTo:'inicio',pathMatch:'full'},
      {path:'**', redirectTo:'inicio',pathMatch:'full'},
    ],
  },
  {path:'',redirectTo:'cumple/inicio',pathMatch:'full'}

];
