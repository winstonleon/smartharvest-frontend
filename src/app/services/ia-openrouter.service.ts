import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IaOpenrouterService {
  // Usamos la URL de tu backend en Render
  private readonly URL_BACKEND = `${environment.base}/ia/consultar`;

  constructor(private http: HttpClient) {}

  consultarOpenRouter(pregunta: string): Observable<any> {
    // Solo enviamos la pregunta, el backend se encarga de la seguridad
    return this.http
      .post(this.URL_BACKEND, { pregunta })
      .pipe(retry({ count: 3, delay: 2000 }));
  }
}
