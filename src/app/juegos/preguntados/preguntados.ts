import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface IPregunta {
  pregunta: string;
  respuestaCorrecta: string;
  respuestas: string[];
}

@Component({
  selector: 'app-preguntados',
  imports: [MatButtonModule],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados {
  router = inject(Router);
  auth = inject(AuthService);

  estado: 'menu' | 'jugando' | 'respondida' | 'finJuego' | 'volver' = 'menu';
  preguntas: IPregunta[] = [];
  indiceActual = 0;
  respuestaSeleccionada: string = '';
  correcta: boolean = false;
  puntaje: number = 0;
  cargando = signal(false);

  get preguntaActual(): IPregunta {
    return this.preguntas[this.indiceActual];
  }

  decodificarHtml(texto: string): string {
    const parser = new DOMParser();
    return parser.parseFromString(texto, 'text/html').body.textContent || '';
  }

  mezclar(arr: string[]): string[] {
    return arr.sort(() => Math.random() - 0.5);
  }

  async empezar() {
    this.cargando.set(true);
    this.puntaje = 0;
    this.indiceActual = 0;
    this.respuestaSeleccionada = '';

    const respuesta = await fetch('https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple');
    const datos = await respuesta.json();

    this.preguntas = datos.results.map((p: any) => ({
      pregunta: this.decodificarHtml(p.question),
      respuestaCorrecta: this.decodificarHtml(p.correct_answer),
      respuestas: this.mezclar([...p.incorrect_answers.map((r: string) => this.decodificarHtml(r)),
      this.decodificarHtml(p.correct_answer),
      ]),
    }));

    this.cargando.set(false);
    this.estado = 'jugando';
  }

  responder(respuesta: string) {
    if (this.estado !== 'jugando') return;
    this.respuestaSeleccionada = respuesta;
    this.correcta = respuesta === this.preguntaActual.respuestaCorrecta;
    

    if (this.correcta) {
      this.puntaje++;
    }
    
    this.estado = 'respondida';
  }

  siguiente() {
    
    if (this.indiceActual < this.preguntas.length - 1) {
      this.indiceActual++;
      this.respuestaSeleccionada = '';
      this.estado = 'jugando';
    }
    

    else {
      this.estado = 'finJuego';
      this.auth.guardarPuntaje('puntajes_preguntados', this.puntaje);
    }
  }

  volverAlMenu() {
    if (this.estado === 'jugando' && this.puntaje > 0) {
      this.estado = 'volver';
    } 
    
    else {
      this.router.navigate(['/home']);
    }
  }
}