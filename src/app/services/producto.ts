import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:8081/api';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  constructor(private http: HttpClient) {}

  listar(almacenId?: number, categoriaId?: number) {
    let params: any = {};
    if (almacenId)   params['almacenId']   = almacenId;
    if (categoriaId) params['categoriaId'] = categoriaId;
    return this.http.get<any[]>(`${API}/productos`, { params });
  }

  almacenes()  { return this.http.get<any[]>(`${API}/almacenes`); }
  categorias() { return this.http.get<any[]>(`${API}/categorias`); }
}
