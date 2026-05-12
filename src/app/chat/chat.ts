import { Component, inject, OnInit, OnDestroy, signal, WritableSignal, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, IMensaje } from '../auth/auth.service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, MatButtonModule, DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {
  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;

  supabaseService = inject(AuthService);
  mensajes: WritableSignal<IMensaje[]> = signal([]);
  contenido: string = '';
  nombreUsuario: string = '';
  canal: RealtimeChannel | null = null;

  async ngOnInit() {
    await this.supabaseService.getUser();
    const usuario = this.supabaseService.usuarioActual();
    this.nombreUsuario = `${usuario?.nombre} ${usuario?.apellido}`.trim();

    const data = await this.supabaseService.traerMensajesYaExistentes() as IMensaje[];
    this.mensajes.set(data ?? []);
    this.scrollAbajo();

    this.canal = this.supabaseService.crearCanal();
    this.canal.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' },
        (payload) => {this.mensajes.update(anterior => [...anterior, payload.new as IMensaje]);this.scrollAbajo();}
      ).subscribe();
  }

  ngOnDestroy() {
    this.desuscribir();
  }

  desuscribir() {
    if (this.canal) {
      this.canal.unsubscribe();
      this.canal = null;
    }
  }

  async enviar() {
    if (!this.contenido.trim()) return;
    await this.supabaseService.enviarMensaje(this.nombreUsuario, this.contenido.trim());
    this.contenido = '';
  }

  scrollAbajo() {
    setTimeout(() => {
      if (this.mensajesContainer) {
        this.mensajesContainer.nativeElement.scrollTop =
          this.mensajesContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }
}