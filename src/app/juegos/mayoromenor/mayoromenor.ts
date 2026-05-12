import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-mayoromenor',
  imports: [FormsModule, MatButtonModule, RouterLink],
  templateUrl: './mayoromenor.html',
  styleUrl: './mayoromenor.css',
})
export class Mayoromenor {
  estado: 'menu' | 'jugando' | 'perdiste' | 'volver' | 'ganaste'  = 'menu';
  palos = ['hearts', 'diamonds', 'clubs', 'spades'];
  valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  mazo: string[] = [];
  valorActual: number = 0;
  cartaActual: string = '';
  racha: number = 0;
  animando = false;

  constructor(private cdr: ChangeDetectorRef, private router: Router, private auth: AuthService) {}

  obtenerValor(carta: string): number {
    return parseInt(carta.split('_')[1], 10);
  }

  armarMazo() {
    this.mazo = [];
    for (let palo of this.palos) {
      for (let num of this.valores) {
        this.mazo.push(`${palo}_${num}`);
      }
    }
    this.mezclar();
  }

  mezclar() {
    this.mazo.sort(() => Math.random() - 0.5);
  }

  darCarta() {
    if (this.mazo.length === 0) {
      this.estado = 'ganaste';
      return;
    }

    this.animando = false;
    this.cartaActual = this.mazo.shift()!;
    this.valorActual = this.obtenerValor(this.cartaActual);
    this.cdr.detectChanges();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.animando = true;
        this.cdr.detectChanges();
      });
    });
  }

  empezar() {
    this.racha = 0;
    this.armarMazo();
    this.estado = 'jugando';
    this.darCarta();
  }

  correcta() {
    this.racha++;
    this.darCarta();
  }

  async incorrecta(nuevaCarta: string) {
    this.cartaActual = nuevaCarta;
    this.estado = 'perdiste';
    await this.auth.guardarPuntaje('puntajes_mayoromenor', this.racha);
  }

  elegirMayor() {
    const nuevaCarta = this.mazo[0];
    const nuevoValor = this.obtenerValor(nuevaCarta);

    if (nuevoValor >= this.valorActual) {
      this.correcta();
    } 
    
    else {
      this.incorrecta(nuevaCarta);
    }
  }

  elegirMenor() {
    const nuevaCarta = this.mazo[0];
    const nuevoValor = this.obtenerValor(nuevaCarta);

    if (nuevoValor <= this.valorActual) {
      this.correcta();
    } 
    
    else {
      this.incorrecta(nuevaCarta);
    }
  }

  volverAlMenu() {
    if (this.racha > 0) {
      this.estado = 'volver';
    } 
    
    else {
      this.router.navigate(['/home']);
    }
  }
}