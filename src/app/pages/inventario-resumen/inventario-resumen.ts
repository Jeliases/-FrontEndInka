import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


import { ProductoService } from '../../services/producto';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-inventario-resumen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario-resumen.html',
  styleUrl: './inventario-resumen.css'
})
export class InventarioResumenComponent implements OnInit, OnDestroy {
  // Al arreglar los imports de arriba, estos objetos dejarán de ser 'unknown'
  private productoSvc = inject(ProductoService);
  public  auth        = inject(AuthService);
  private router      = inject(Router);

  almacenes:  any[] = [];
  categorias: any[] = [];
  productos:  any[] = [];
  almacenId:  number = 0;
  categoriaId: number = 0;
  private intervalo: any;

  ngOnInit() {
    // Solución al ts(7006): Le decimos a TypeScript que 'r' es de tipo 'any[]'
    this.productoSvc.almacenes().subscribe((r: any[]) => this.almacenes = r);
    this.productoSvc.categorias().subscribe((r: any[]) => this.categorias = r);
    
    this.cargar();
    
    // Polling cada 5 segundos — actualización en tiempo real sin SSE
    this.intervalo = setInterval(() => this.cargar(), 5000);
  }

  cargar() {
    // Evaluamos los valores antes de enviarlos para evitar undefined ocultos
    const alm = this.almacenId > 0 ? this.almacenId : undefined;
    const cat = this.categoriaId > 0 ? this.categoriaId : undefined;

    this.productoSvc.listar(alm, cat).subscribe((r: any[]) => {
      this.productos = r;
    });
  }

  ngOnDestroy() { 
    if (this.intervalo) {
      clearInterval(this.intervalo); 
    }
  }

  ir(ruta: string) { 
    this.router.navigate([ruta]); 
  }

  logout() { 
    this.auth.logout(); 
  }
}