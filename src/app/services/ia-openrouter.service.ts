import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IaOpenrouterService {
  // Reemplaza esto con la llave que acabas de generar
  private readonly API_KEY =
    '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';
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(private http: HttpClient) {}

  consultarOpenRouter(pregunta: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://smartharvest-frontend.onrender.com',
      'X-Title': 'SmartHarvest',
    });

    const body = {
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        {
          role: 'system',
          content:
            'Eres un experto en agricultura de precisión. Solo respondes temas agrícolas. Máximo 300 caracteres.',
        },
        { role: 'user', content: pregunta },
      ],
    };

    return this.http.post(this.API_URL, body, { headers }).pipe(
      // LÓGICA DE REINTENTO
      retry({
        count: 3, // Reintenta hasta 3 veces si falla
        delay: (error, retryCount) => {
          console.warn(
            `Intento de conexión a IA #${retryCount} fallido. Reintentando...`
          );
          // Espera progresiva: 2seg, 4seg, 6seg...
          return timer(retryCount * 2000);
        },
      }),
      // MANEJO DE ERROR FINAL
      catchError((err) => {
        console.error('Error definitivo tras 3 reintentos:', err);
        let mensajeFriendly =
          'La IA está saturada actualmente. Por favor, intenta de nuevo en unos segundos.';

        if (err.status === 401)
          mensajeFriendly = 'Error de autenticación (API Key inválida).';

        return throwError(() => new Error(mensajeFriendly));
      })
    );
  }
}
