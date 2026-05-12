import { Routes } from '@angular/router';
import { logueadoGuard, sinLoginGuard } from './guards/guards';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },
    {
        path: 'auth/login',
        loadComponent: () =>
        import('./auth/login/login.page').then(
            (m) => m.LoginPage,
        ),
        canActivate: [logueadoGuard],
    },
    {
        path: 'home',
        loadComponent: () =>
        import('./home/home.page').then(
            (m) => m.HomePage,
        ),
        canActivate: [sinLoginGuard],
    },
    {
      path: 'auth/registro',
      loadComponent: () =>
        import('./auth/registro/registro.page').then(
          (m) => m.RegistroPage,
        ),
        canActivate: [logueadoGuard],
    },
    {
        path: 'mayoromenor',
        loadComponent: () =>
            import('./juegos/mayoromenor/mayoromenor').then(
                (m) => m.Mayoromenor
            )
    },
    {
        path: 'ahorcado',
        loadComponent: () =>
            import('./juegos/ahorcado/ahorcado').then(
                (m) => m.Ahorcado
            )
    },
    {
        path: 'buscaminas',
        loadComponent: () =>
            import('./juegos/buscaminas/buscaminas').then(
                (m) => m.Buscaminas
            )
    },
    {
        path: 'preguntados',
        loadComponent: () =>
            import('./juegos/preguntados/preguntados').then(
                (m) => m.Preguntados
            )
    },
    { path: 'quiensoy',
      loadComponent: () =>
        import('./informacion/quiensoy/quiensoy').then(
          (m) => m.QuiensoyPage
        )
    },
    {
        path: 'rankings',
        loadComponent: () =>
            import('./rankings/rankings').then(
                (m) => m.Rankings
            )
    }
];