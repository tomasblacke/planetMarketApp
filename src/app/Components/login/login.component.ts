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
    // Asegura de que las credenciales no estén vaacias
    if (!this.credentials.username || !this.credentials.password) {
      console.error("Por favor, completa ambos campos.");
      return; 
    }
  
    // Llamar al servicio de autenticación para iniciar sesión
    this.authService.login(this.credentials).subscribe(
      response => {
        console.log('Login exitoso', response);
        
        // Codigo para poder guardar token en la local storage IDEA GEPPETO
        //localStorage.setItem('token', response.token); // Suponiendo que la respuesta incluye un token
  
        // LLAMAR A LA LANDING PAGE
        // this.router.navigate(['/home']);
      },
      error => {
        console.error('Error en el login', error);
        // Aquí puedes manejar el error y mostrar un mensaje al usuario
        // Por ejemplo, mostrando un mensaje en la interfaz de usuario:
        alert("Nombre de usuario o contraseña incorrectos.");
      }
    );
  }
}  
