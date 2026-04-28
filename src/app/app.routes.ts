import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () =>
        import('./auth/login/login.page').then(
            (m) => m.LoginPage,
        ),
    },
    {
        path: 'home',
        loadComponent: () =>
        import('./home/home.page').then(
            (m) => m.HomePage,
        ),
    },
    {
      path: 'registro',
      loadComponent: () =>
        import('./auth/registro/registro.page').then(
          (m) => m.RegistroPage,
        ),  
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
    }
];