import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:8081/api';

@Injectable({ providedIn: 'root' })
export class TrasladoService {
  constructor(private http: HttpClient) {}

  procesar(body: any)       { return this.http.post<any>(`${API}/traslados`, body); }
  kardexProducto(id: number){ return this.http.get<any[]>(`${API}/traslados/kardex/producto/${id}`); }
  kardexAlmacen(id: number) { return this.http.get<any[]>(`${API}/traslados/kardex/almacen/${id}`); }
  crearSolicitud(body: any) { return this.http.post<any>(`${API}/solicitudes`, body); }
  pendientes()              { return this.http.get<any[]>(`${API}/solicitudes/pendientes`); }
  misSolicitudes()          { return this.http.get<any[]>(`${API}/solicitudes/mis`); }
  aprobar(id: number)       { return this.http.put<any>(`${API}/solicitudes/${id}/aprobar`, {}); }
  rechazar(id: number)      { return this.http.put<any>(`${API}/solicitudes/${id}/rechazar`, {}); }
}
