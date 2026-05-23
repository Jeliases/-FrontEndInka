import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TrasladoService } from '../../services/traslado';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-solicitud-gestion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitud-gestion.html',
  styleUrl: './solicitud-gestion.css'
})
export class SolicitudGestionComponent implements OnInit {
  solicitudes: any[] = [];
  mensaje = '';
  error   = '';

  constructor(
    private trasladoSvc: TrasladoService,
    public  auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    const obs = this.auth.isAdmin()
      ? this.trasladoSvc.pendientes()
      : this.trasladoSvc.misSolicitudes();
    obs.subscribe({ next: r => this.solicitudes = r, error: () => this.solicitudes = [] });
  }

  aprobar(id: number) {
    this.trasladoSvc.aprobar(id).subscribe({
      next: () => { this.mensaje = '✅ Solicitud aprobada y traslado ejecutado'; this.cargar(); },
      error: e  => this.error = e.error?.error || 'Error al aprobar'
    });
  }

  rechazar(id: number) {
    this.trasladoSvc.rechazar(id).subscribe({
      next: () => { this.mensaje = 'Solicitud rechazada'; this.cargar(); },
      error: e  => this.error = e.error?.error || 'Error al rechazar'
    });
  }

  ir(ruta: string) { this.router.navigate([ruta]); }
  logout() { this.auth.logout(); }
}
