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

  async onRegister() {

    try {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Las contraseñas no coinciden";
        return;
      }

      await this.auth.registro(this.email, this.nombre, this.apellido, this.password);
      this.router.navigate(['/home']);
    }
    catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}