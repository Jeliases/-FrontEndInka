import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.css'
})
export class AuthLoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  email    = '';
  password = '';
  error    = '';
  loading  = false;

  login() {
    this.error   = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/inventario']),
      error: () => { this.error = 'Credenciales incorrectas'; this.loading = false; }
    });
  }
}