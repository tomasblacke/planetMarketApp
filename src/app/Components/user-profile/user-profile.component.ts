import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/user-auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userName: string = '';
  userData: any = null;
  user$: Observable<any> | undefined;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private router: Router  
  ) {}

  ngOnInit() {
    this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.userName = user.displayName || 'Usuario';
        this.user$ = this.firestore.collection('users').doc(user.uid).valueChanges();
        this.user$.subscribe(data => {
          console.log('User  data:', data);
          this.userData = data;
        });
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate(['profile', route]);
  }

  isActive(route: string): boolean {
    return this.router.url.includes(`/profile/${route}`);
  }
}