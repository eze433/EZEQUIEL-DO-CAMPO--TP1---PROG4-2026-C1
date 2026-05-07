import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const sinLoginGuard = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario = await auth.getUser();

  if (usuario) {
    return true;
  }
  
  else {
    router.navigate(['/auth/login']);
    return false;
  }
};

export const logueadoGuard = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario = await auth.getUser();

  if (usuario) {
    router.navigate(['/home']);
    return false;
  }
  
  else {
    return true;
  }
};