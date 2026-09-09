import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../app/Services/user-auth.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // Este es para el perfil del usuario comun, solo mira que haya sesion iniciada.
  // Aca no va el AdminGuard porque echaria a todos los que no son admin.
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getAuthState().pipe(
      map(user => {
        if (user) { // Si hay usuario logueado lo dejamos pasar
          return true; // Permite el acceso
        }
        this.router.navigate(['']); // Si no, lo mandamos al inicio
        return false; // Bloquea el acceso
      }),
      catchError(() => {
        this.router.navigate(['']); // Redirige en caso de error
        return [false]; // Bloquea el acceso
      })
    );
  }
}
