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
    ],
  },
  {path: '',redirectTo: 'auth/:id',pathMatch:'full'},
  {path: '**',redirectTo: 'auth/:id',pathMatch: 'full',},
];
