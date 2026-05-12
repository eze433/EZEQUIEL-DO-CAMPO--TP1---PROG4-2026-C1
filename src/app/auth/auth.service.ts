import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, RealtimeChannel, PostgrestQueryBuilder } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  supabase: SupabaseClient;
  tablaMensajes: PostgrestQueryBuilder<any, any, any, 'mensajes', unknown>;
  usuarioActual = signal<IUsuario | null>(null);

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.tablaMensajes = this.supabase.from('mensajes');
  }

  crearCanal(): RealtimeChannel {
    return this.supabase.channel('table-db-changes-' + Date.now());
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async registro(email: string, nombre: string, apellido: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, apellido } }
    });
    if (error) throw error;
      return data;
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.router.navigate(['/auth/login']);
  }

  getSession() {
    return this.supabase.auth.getSession();
  }

  async getUser() {
    const { data } = await this.supabase.auth.getUser();
    if (data.user) {
      this.usuarioActual.set({
        id: data.user.id,
        email: data.user.email || '',
        nombre: data.user.user_metadata['nombre'] || '',
        apellido: data.user.user_metadata['apellido'] || '',
      });
    }
    return data.user;
  }

  async enviarMensaje(usuario: string, contenido: string) {
    const { data } = await this.tablaMensajes.insert({ usuario, contenido });
    return data;
  }

  async traerMensajesYaExistentes() {
    const { data } = await this.tablaMensajes.select('*').order('id', { ascending: true });
    return data;
  }

    async guardarPuntaje(tabla: 'puntajes_preguntados' | 'puntajes_mayoromenor' | 'puntajes_ahorcado' | 'puntajes_buscaminas', puntaje: number) {

    const usuario = await this.getUser();
    const nombre = usuario?.user_metadata?.['nombre'] || '';
    const apellido = usuario?.user_metadata?.['apellido'] || '';

    const { error } = await this.supabase.from(tabla).insert({usuario_id: usuario?.id,
    usuario:`${nombre} ${apellido}`.trim(),puntaje,});

    if (error)
      throw error;
  }

  async traerPuntajes(tabla: 'puntajes_preguntados' | 'puntajes_mayoromenor' | 'puntajes_ahorcado' | 'puntajes_buscaminas') {
    const { data, error } = await this.supabase.from(tabla).select('*');

    if (error) throw error;
      return data;
  }
}

export interface IMensaje {
  id: number;
  usuario: string;
  contenido: string;
  created_at: Date;
}

export interface IUsuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
}