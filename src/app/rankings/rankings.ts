import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../auth/auth.service';
import { NgTemplateOutlet } from '@angular/common';

interface IPuntaje {
  id: number;
  usuario: string;
  puntaje: number;
  created_at: Date;
}

type IJuego = 'puntajes_preguntados' | 'puntajes_mayoromenor' | 'puntajes_ahorcado' | 'puntajes_buscaminas';

@Component({
  selector: 'app-leaderboard',
  imports: [RouterLink, MatButtonModule, MatTabsModule, DatePipe, NgTemplateOutlet],
  templateUrl: './rankings.html',
  styleUrl: './rankings.css',
})

export class Rankings implements OnInit {
  auth = inject(AuthService);

  puntajes = signal<IPuntaje[]>([]);
  juegoSeleccionado = signal<IJuego>('puntajes_preguntados');

  async ngOnInit() {
    await this.cargarPuntajes();
  }


  get esBuscaminas() {
    return this.juegoSeleccionado() === 'puntajes_buscaminas';
  }
  
  async cargarPuntajes() {
    const data = await this.auth.traerPuntajes(this.juegoSeleccionado()) as IPuntaje[];
    const esBuscaminas = this.juegoSeleccionado() === 'puntajes_buscaminas';


    const mapaUsuarios = new Map<string, IPuntaje>();
    for (const puntaje of data ?? []) {

      const existe = mapaUsuarios.get(puntaje.usuario);
      if (!existe || (esBuscaminas ? puntaje.puntaje < existe.puntaje : puntaje.puntaje > existe.puntaje)) {
        mapaUsuarios.set(puntaje.usuario, puntaje);
      }
    }

    const unicos = Array.from(mapaUsuarios.values()).sort((a, b) => esBuscaminas ? a.puntaje - b.puntaje : b.puntaje - a.puntaje);

    this.puntajes.set(unicos);
  }

  async cambiarTab(indice: number) {

    const juegos: IJuego[] = ['puntajes_preguntados', 'puntajes_mayoromenor', 'puntajes_ahorcado', 'puntajes_buscaminas'];
    this.juegoSeleccionado.set(juegos[indice]);
    await this.cargarPuntajes();
  }
}