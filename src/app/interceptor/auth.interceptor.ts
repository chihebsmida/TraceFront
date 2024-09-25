import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { KeycloakOperationService } from "../services/keycloak.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: KeycloakOperationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Transformer la promesse getToken en un observable avec 'from'
    return from(this.authService.getToken()).pipe(
      switchMap((token: string) => {
        if (token) {
          // Cloner la requête pour ajouter l'en-tête Authorization
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        // Passer la requête au gestionnaire suivant
        return next.handle(request);
      })
    );
  }
}
