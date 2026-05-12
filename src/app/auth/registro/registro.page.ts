import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-registro-page',
  imports: [FormsModule, RouterLink, MatButtonModule],
  templateUrl: './registro.page.html',
  styleUrl: './registro.page.css',
})
export class RegistroPage {
  email = '';
  nombre = '';
  apellido = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  traducirError(mensaje: string): string {
    if (mensaje.includes('User already registered'))
      return 'Este email ya está registrado';

    if (mensaje.includes('Password should be at least'))
      return 'La contraseña debe tener al menos 6 caracteres';

    return 'Ocurrió un error, intentá de nuevo';
  }


  async onRegister() {

    try {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }

      if (!this.nombre || !this.apellido || !this.email || !this.password) {
        this.errorMessage = 'Completá todos los campos';
        return;
      }

      await this.auth.registro(this.email, this.nombre, this.apellido, this.password);
      this.router.navigate(['/home']);
    }
    catch (error: any) {
      this.errorMessage = this.traducirError(error.message);
    }
  }
}