import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { AuthLoginComponent } from './pages/auth-login/auth-login';
import { InventarioResumenComponent } from './pages/inventario-resumen/inventario-resumen';
import { TrasladoMovimientoComponent } from './pages/traslado-movimiento/traslado-movimiento';
import { SolicitudGestionComponent } from './pages/solicitud-gestion/solicitud-gestion';

export const routes: Routes = [
  { path: 'login',       component: AuthLoginComponent },
  { path: 'inventario',  component: InventarioResumenComponent,  canActivate: [authGuard] },
  { path: 'traslados',   component: TrasladoMovimientoComponent,  canActivate: [authGuard] },
  { path: 'solicitudes', component: SolicitudGestionComponent,    canActivate: [authGuard] },
  { path: '',            redirectTo: 'login', pathMatch: 'full' }
];
