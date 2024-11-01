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

  constructor(private auth: AuthService) { }
  ngOnInit(): void {}
  register(){
    if (this.email == null)
    {
      alert("Please enter your email");
      return;
    }

    if (this.password == null)
      {
        alert("Please enter your password");
        return;
      }
      
    this.auth.register(this.email, this.password);
    this.email='';
    this.password='';
  }

}
