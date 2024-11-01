import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/user-auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit {
  email : string = '';
  password : string = '';
  constructor(private auth : AuthService){}
  ngOnInit(): void {
  }
  login(){
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
      
    this.auth.login(this.email, this.password);
    this.email='';
    this.password='';
  }

}