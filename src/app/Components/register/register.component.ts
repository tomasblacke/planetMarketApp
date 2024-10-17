import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { username: '', email: '', password: '', confirmPassword: '' };

  constructor(private authService: AuthService) { }

  register() {
    // Verificar si las contraseñas coinciden
    if (this.user.password !== this.user.confirmPassword) {
      console.error("Las contraseñas no coinciden!");
      return; 
    }
  
    // Preparar los datos del usuario para enviar
    const registrationData = {
      username: this.user.username,
      password: this.user.password,
      email: this.user.email // Si estás usando un email
    };
  
    // Llamar al servicio de autenticación para registrar al usuario
    this.authService.register(registrationData).subscribe(
      response => {
        console.log('Registro exitoso', response);
        //ACA TENGO QUE LLAMAR A LA PAGINA PRINCIPAL HELP
        // this.router.navigate(['/login']);
      },
      error => {
        console.error('Error durante el registro', error);
        // ACA HAY ERROR O SE PUEDE manejar el error de alguna forma
      }
    );
  }
}  
