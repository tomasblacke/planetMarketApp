import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../app/Services/user-auth.service'; // Asegúrate de tener un servicio de autenticación
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.user$.pipe( // Suponiendo que tienes un observable para el usuario logueado
      map(user => {
        if (user && user.isAdmin) { // Verifica si el usuario es admin
          return true; // Permite el acceso
        }
        this.router.navigate(['']); // Redirige si no es admin
        return false; // Bloquea el acceso
      }),
      catchError(() => {
        this.router.navigate(['']); // Redirige en caso de error
        return [false]; // Bloquea el acceso
      })
    );
  }
}