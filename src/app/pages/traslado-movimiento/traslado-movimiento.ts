import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto';
import { TrasladoService } from '../../services/traslado';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-traslado-movimiento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './traslado-movimiento.html',
  styleUrl: './traslado-movimiento.css'
})
export class TrasladoMovimientoComponent implements OnInit {
  almacenes:  any[] = [];
  productos:  any[] = [];
  carrito:    any[] = [];
  origenId  = 0;
  destinoId = 0;
  referencia  = '';
  observacion = '';
  cantidades: { [key: number]: number } = {};
  mensaje = '';
  error   = '';

  constructor(
    private productoSvc: ProductoService,
    private trasladoSvc: TrasladoService,
    public  auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productoSvc.almacenes().subscribe(r => this.almacenes = r);
  }

  cargarProductos() {
    if (!this.origenId) return;
    this.productoSvc.listar(this.origenId).subscribe(r => {
      this.productos = r;
      this.cantidades = {};
      this.carrito = [];
    });
  }

  agregar(p: any) {
    const cant = this.cantidades[p.productoId] || 0;
    if (cant <= 0) { this.error = 'Ingresa una cantidad'; return; }
    const stock = p.stockAlmacen ?? p.stockTotal ?? 0;
    if (cant > stock) { this.error = `Stock insuficiente. Disponible: ${stock}`; return; }
    const existe = this.carrito.find(c => c.productoId === p.productoId);
    if (existe) { existe.cantidad = cant; }
    else { this.carrito.push({ productoId: p.productoId, nombre: p.nombre, cantidad: cant, stock }); }
    this.error = '';
  }

  quitar(productoId: number) {
    this.carrito = this.carrito.filter(c => c.productoId !== productoId);
  }

  confirmar() {
    this.error = ''; this.mensaje = '';
    if (!this.origenId || !this.destinoId) { this.error = 'Selecciona origen y destino'; return; }
    if (this.origenId === this.destinoId)  { this.error = 'Origen y destino deben ser distintos'; return; }
    if (!this.carrito.length)              { this.error = 'Agrega al menos un producto'; return; }

    const body = {
      origenId: this.origenId, destinoId: this.destinoId,
      referencia: this.referencia || null, observacion: this.observacion || null,
      items: this.carrito.map(c => ({ productoId: c.productoId, cantidad: c.cantidad }))
    };

    const accion = this.auth.isAdmin()
      ? this.trasladoSvc.procesar(body)
      : this.trasladoSvc.crearSolicitud({ ...body, observacion: this.observacion });

    accion.subscribe({
      next: () => {
        this.mensaje = this.auth.isAdmin() ? '✅ Traslado realizado' : '✅ Solicitud enviada';
        this.carrito = []; this.referencia = ''; this.observacion = '';
        this.cargarProductos();
      },
      error: e => this.error = e.error?.error || 'Error al procesar'
    });
  }

  ir(ruta: string) { this.router.navigate([ruta]); }
  logout() { this.auth.logout(); }
}
