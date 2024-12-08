import { Routes } from '@angular/router';
import { authGuard } from './utils/auth.guard';

export const routes: Routes = [
    {
        path: 'signIn',
        title: 'SignIn',
        loadComponent: () => import('./components/auth/sign-in/sign-in.component')
    },
    {
        path: 'login',
        title: 'Login',
        loadComponent: () => import('./components/auth/login/login.component')
    },
    {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component'),
        canActivate:[authGuard],
        children: [
            {
                path: 'register',
                title: 'Registrar Expediente',
                loadComponent: () => import('./components/dashboard/pages/register/register.component'),
                canActivate:[authGuard],
            },
            {
                path: 'viewLogs',
                title: 'Logs Sistema',
                loadComponent: () => import('./components/dashboard/pages/logsScraper/logsScraper.component'),
                canActivate:[authGuard]
            },
            {
                path: 'vidoc/:noExpediente',
                title: 'Vidoc de expediente',
                loadComponent: () => import('./components/dashboard/pages/vidoc/vidoc.component'),
                canActivate:[authGuard]
            },
            {
                path: 'inventors',
                title: 'Inventores',
                loadComponent: () => import('./components/dashboard/pages/inventors/inventors.component'),
                canActivate:[authGuard]
            },
            {
              path: 'notifications',
              title: 'Notificaciones',
              loadComponent: () => import('./components/dashboard/pages/vista/vista.component'),
              canActivate: [authGuard],
              children: [
                {
                    path: 'allNotifications/:noExpediente',
                    title: 'Notificaciones',
                    loadComponent: () => import('./components/dashboard/pages/vista/notificationsExpediente/notificationsExpediente.component')
                }
              ]
            },
            {
                path: '**',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            }
        ]
    },
    {
        path: 'confirmed',
        loadComponent: () => import('./resource/confirmed/confirmed.component')
    },
    {
        path: 'noConfirmed',
        loadComponent: () => import('./resource/noConfirmed/noConfirmed.component')
    },
    {
        path:'**',
        redirectTo:'login',
        pathMatch:'full'
    }
];
