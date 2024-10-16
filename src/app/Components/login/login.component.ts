import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(private authService: AuthService) { }

  login() {
    this.authService.login(this.credentials).subscribe(
      response => {
        console.log('Login exitoso', response);
        // Puedes agregar lógica para redirigir al usuario a otra página
      },
      error => {
        console.error('Error en el login', error);
      }
    );
  }
}

