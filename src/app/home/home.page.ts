import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home.page',
  imports: [],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  constructor(private router: Router, private authService: AuthService) {}

  iraJuego(juego: string) {
    console.log(juego);
    this.router.navigate([`/${juego}`]);

  }

  ngOnInit() {
    this.authService.getUser().then((user) => {
      console.log(user);
    });
  }
}
