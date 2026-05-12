import { Component, OnDestroy, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface ICelda {
  mina: boolean;
  revelada: boolean;
  marcada: boolean;
  minasAdyacentes: number;
}

@Component({
  selector: 'app-buscaminas',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './buscaminas.html',
  styleUrl: './buscaminas.css',
})

export class Buscaminas implements OnDestroy {
  auth = inject(AuthService);

  readonly FILAS = 9;
  readonly COLUMNAS = 9;
  readonly MINAS = 10;

  estado: 'menu' | 'jugando' | 'ganaste' | 'perdiste' = 'menu';
  tablero: ICelda[][] = [];
  tiempo = signal(0);
  marcadas = signal(0);
  intervalo: any = null;

  get minasRestantes(): number {
    return this.MINAS - this.marcadas();
  }

  ngOnDestroy() {
    this.detenerTemporizador();
  }

  iniciarTemporizador() {
    this.intervalo = setInterval(() => {this.tiempo.update(t => t + 1);}, 1000);
  }

  detenerTemporizador() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  empezar() {
    this.tiempo.set(0);
    this.marcadas.set(0);
    this.detenerTemporizador();
    this.crearTablero();
    this.colocarMinas();
    this.calcularAdyacentes();
    this.iniciarTemporizador();
    this.estado = 'jugando';
  }

  crearTablero() {
    this.tablero = Array.from({ length: this.FILAS }, () =>
      Array.from({ length: this.COLUMNAS }, () => ({
        mina: false,
        revelada: false,
        marcada: false,
        minasAdyacentes: 0,
      }))
    );
  }

  colocarMinas() {
    let minasColocadas = 0;

    while (minasColocadas < this.MINAS) {
      const fila = Math.floor(Math.random() * this.FILAS);
      const col = Math.floor(Math.random() * this.COLUMNAS);
      if (!this.tablero[fila][col].mina) {
        this.tablero[fila][col].mina = true;
        minasColocadas++;
      }
    }
  }

  calcularAdyacentes() {
    for (let f = 0; f < this.FILAS; f++) {
      for (let c = 0; c < this.COLUMNAS; c++) {
        if (!this.tablero[f][c].mina) {
          this.tablero[f][c].minasAdyacentes = this.contarMinasAdyacentes(f, c);
        }
      }
    }
  }

  contarMinasAdyacentes(fila: number, col: number): number {
    let contador = 0;
    for (let checkFila = -1; checkFila <= 1; checkFila++) {
      for (let checkCol = -1; checkCol <= 1; checkCol++) {
        const filaAdyacente = fila + checkFila;
        const colAdyacente = col + checkCol;
        if (filaAdyacente >= 0 && filaAdyacente < this.FILAS && colAdyacente >= 0 && colAdyacente < this.COLUMNAS) {
          if (this.tablero[filaAdyacente][colAdyacente].mina) contador++;
        }
      }
    }
    
    return contador;
  }

  revelar(fila: number, col: number) {
    const celda = this.tablero[fila][col];
    if (celda.revelada || celda.marcada) return;

    celda.revelada = true;

    if (celda.mina) {
      this.revelarTodasLasMinas();
      this.detenerTemporizador();
      this.estado = 'perdiste';
      return;
    }

    if (celda.minasAdyacentes === 0) {
      this.revelarVecinos(fila, col);
    }

    this.verificarVictoria();
  }

  revelarVecinos(fila: number, col: number) {

    for (let checkFila = -1; checkFila <= 1; checkFila++) {
      for (let checkCol = -1; checkCol <= 1; checkCol++) {

        const filaAdyacente = fila + checkFila;
        const colAdyacente = col + checkCol;

        if (filaAdyacente >= 0 && filaAdyacente < this.FILAS && colAdyacente >= 0 && colAdyacente < this.COLUMNAS) {
          const vecino = this.tablero[filaAdyacente][colAdyacente];
          if (!vecino.revelada && !vecino.mina && !vecino.marcada) {
            vecino.revelada = true;
            if (vecino.minasAdyacentes === 0) {
              this.revelarVecinos(filaAdyacente, colAdyacente);
            }
          }
        }
      }
    }
  }

  revelarTodasLasMinas() {
    for (let f = 0; f < this.FILAS; f++) {
      for (let c = 0; c < this.COLUMNAS; c++) {
        if (this.tablero[f][c].mina) {
          this.tablero[f][c].revelada = true;
        }
      }
    }
  }

  marcar(evento: MouseEvent, fila: number, col: number) {
    evento.preventDefault();

    const celda = this.tablero[fila][col];
    if (celda.revelada) return;
    celda.marcada = !celda.marcada;
    this.marcadas.update(m => celda.marcada ? m + 1 : m - 1);
  }

  verificarVictoria() {
    const todasReveladas = this.tablero.every(fila => fila.every(celda => celda.revelada || celda.mina));

    if (todasReveladas) {
      this.detenerTemporizador();
      this.guardarPuntaje();
      this.estado = 'ganaste';
    }
  }

  async guardarPuntaje() {
    await this.auth.guardarPuntaje('puntajes_buscaminas', this.tiempo());
  }

  obtenerColor(n: number): string {
    const colores: Record<number, string> = {
      1: '#0000FF',
      2: '#008000 ',
      3: '#FF0000',
      4: '#00008B',
      5: '#800000',
      6: '#00FFFF',
      7: '#000000',
      8: '#808080',
    };
    return colores[n] || 'white';
  }

  filas(): number[] {
    return Array.from({ length: this.FILAS }, (_, i) => i);
  }

  columnas(): number[] {
    return Array.from({ length: this.COLUMNAS }, (_, i) => i);
  }
}