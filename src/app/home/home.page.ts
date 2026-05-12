import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Chat } from '../chat/chat';
import { inject } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home.page',
  imports: [Chat, MatButtonModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  constructor(private router: Router, private authService: AuthService) {}

  private auth = inject(AuthService);
  salir = false;

  iraJuego(juego: string) {
    this.router.navigate([`/${juego}`]);
  }

  ngOnInit() {
    this.authService.getUser().then((user) => {
      console.log(user);
    });
  }

  async logout() {
    await this.auth.logout();
  }

  salirChat() {
    this.salir = true;
  }
}
