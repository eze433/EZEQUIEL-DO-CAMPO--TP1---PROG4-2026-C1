import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async obtenerMensajes() {
    const { data, error } = await this.supabase
      .from('mensajes')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);
    if (error) throw error;
    return data;
  }

  async enviarMensaje(usuario: string, contenido: string) {
    const { error } = await this.supabase.from('mensajes').insert({ usuario, contenido });
    if (error)
        throw error;
  }

  escucharMensajes(callback: (mensaje: any) => void) {
    return this.supabase.channel('mensajes').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, 
        payload => callback(payload.new)).subscribe();
  }
}