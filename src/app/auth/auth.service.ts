import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    console.log('data:', data);
    console.log('error:', error);
    if (error) throw error;
      return data;
  }
  
  async registro(email: string, usuario: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { usuario }
      }
    });

    if (error) throw error;
      return data;
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.router.navigate(['/login']);
  }

  getSession() {
    return this.supabase.auth.getSession();
  }
}