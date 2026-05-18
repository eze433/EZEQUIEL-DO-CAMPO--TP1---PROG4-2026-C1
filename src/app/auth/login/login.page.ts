import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink, MatButtonModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  traducirError(mensaje: string): string {
    if (mensaje.includes('Invalid login credentials'))
      return 'Email o contraseña incorrectos';

    return 'Ocurrió un error, intentá de nuevo';
}

  async onLogin() {
    this.errorMessage = '';
    try {

      if (!this.email || !this.password) {
        this.errorMessage = 'Completá todos los campos';
        return;
      }
      
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/home']);
    } 
    
    catch (error: any) {
      this.errorMessage = this.traducirError(error.message);
    }
  }
  aRegistro() {
    this.router.navigate(['/registro']);
  }
  ingresoRapido() {
    this.email = 'usuario1@ejemplo.com';
    this.password = 'Ejemplo123';
  }
}