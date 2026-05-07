import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-ahorcado',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado {
  letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  palabra: string = '';
  letrasAdivinadas: string[] = [];
  intentosRestantes: number = 6;
  estado: 'menu' | 'jugando' | 'ganaste' | 'perdiste' | 'volver' = 'menu';

  posiblesPalabras = [
    'PERRO', 'GATO', 'CASA', 'LIBRO', 'MESA', 'SILLA', 'PUERTA', 'VENTANA', 'COCINA', 'JARDIN',
    'CIELO', 'TIERRA', 'AGUA', 'FUEGO', 'VIENTO', 'NIEVE', 'LLUVIA', 'ARGENTINA', 'LUNA', 'ESTRELLA',
    'MANZANA', 'NARANJA', 'PLATANO', 'FRUTILLA', 'SANDIA', 'LIMON', 'PERA', 'FRUTA  ', 'MANGO', 'CEREZA',
    'CABALLO', 'VACA', 'OVEJA', 'CERDO', 'GALLINA', 'PATO', 'CONEJO', 'TIGRE', 'LEON', 'ELEFANTE',
    'CAMISA', 'PANTALON', 'ZAPATO', 'SOMBRERO', 'BUFANDA', 'GUANTE', 'ABRIGO', 'VESTIDO', 'FALDA', 'CALCETÍN',
    'DOCTOR', 'MAESTRO', 'BOMBERO', 'POLICIA', 'COCINERO', 'PILOTO', 'PINTOR', 'MUSICO', 'ACTOR', 'ESCRITOR',
    'FUTBOL', 'TENIS', 'NATACION', 'CICLISMO', 'BOXEO', 'BAILE', 'BASQUET', 'GOLF', 'AJEDREZ', 'BEISBOL',
    'GUITARRA', 'PIANO', 'VIOLIN', 'FLAUTA', 'TAMBOR', 'TROMPETA', 'SAXOFON', 'ARPA', 'BATERIA', 'CLARINETE',
    'CALOR', 'FRIO', 'DESIERTO', 'OCEANO', 'BOSQUE', 'PRADERA', 'VOLCAN', 'CASCADA', 'LAGUNA', 'PANTANO', 'ACANTILADO',
    'AVION', 'BARCO', 'TREN', 'MOTO', 'BICICLETA', 'HELICOPTERO', 'COHETE', 'SUBMARINO', 'CAMION', 'AUTOBUS', 'JAZZ'
  ];
  racha: number = 0;

  constructor(private router: Router) {}

  get palabraMostrada(): string {
    return this.palabra.split('').map(l => this.letrasAdivinadas.includes(l.toUpperCase()) ? l : '_').join(' ');
  }

  get imagenAhorcado(): string {
    const estado = 6 - this.intentosRestantes + 1;
    return `/assets/ahorcado/estado_${estado}.png`;
  }

  get letraUsada() {
    return (letra: string) => this.letrasAdivinadas.includes(letra);
  }

  empezar() {
    this.palabra = this.posiblesPalabras[Math.floor(Math.random() * this.posiblesPalabras.length)];
    this.letrasAdivinadas = [];
    this.intentosRestantes = 6;
    this.estado = "jugando";
  }

  adivinarLetra(letra: string) {
    if (this.letrasAdivinadas.includes(letra))
      return;
    this.letrasAdivinadas.push(letra);

    if (!this.palabra.includes(letra)) {
      this.intentosRestantes--;
      if (this.intentosRestantes === 0) {
        this.estado = 'perdiste';
        this.racha = 0;
        return;
      }
    }

    if (this.palabra.split('').every(l => this.letrasAdivinadas.includes(l))) {
      this.estado = 'ganaste';
        this.racha++;
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