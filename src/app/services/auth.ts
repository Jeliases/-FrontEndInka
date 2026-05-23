import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

const API = 'http://localhost:8081/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${API}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('token',  res.token);
        localStorage.setItem('rol',    res.rol);
        localStorage.setItem('email',  res.email);
        localStorage.setItem('nombre', res.nombre);
      })
    );
  }

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
  getToken()  { return localStorage.getItem('token'); }
  getRol()    { return localStorage.getItem('rol'); }
  getEmail()  { return localStorage.getItem('email'); }
  getNombre() { return localStorage.getItem('nombre'); }
  isAdmin()   { return this.getRol() === 'ADMIN'; }
  isLoggedIn(){ return !!this.getToken(); }
}
