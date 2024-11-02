import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/user-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  email : string = '';
  password : string = '';
  name: string = '';
  lastname: string = '';

  constructor(private auth: AuthService) { }
  ngOnInit(): void {}
  register(){
    if (!this.email || !this.password || !this.name || !this.lastname) {
      alert("Por favor complete todos los campos");
      return;
    }

    this.auth.register(this.email, this.password, this.name, this.lastname);//modificar campos para poder guardarlos
    this.email='';
    this.password='';
    this.name = '';
    this.lastname = '';
  }

}
