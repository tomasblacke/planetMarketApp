import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/user-auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface UserPlanet {
  id?: string;
  userId: string;
  name: string;
  imageUrl: string;
  purchaseDate: Date;
  price: number;
}


@Component({
  selector: 'app-user-planets',
  templateUrl: './user-planets.component.html',
  styleUrl: './user-planets.component.css'
})
export class UserPlanetsComponent implements OnInit {

  userPlanets: UserPlanet[] = [];

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.loadUserPlanets();
  }

  private loadUserPlanets(): void {
    console.log('Se empiezan a cargar los planetas del usuario');
    this.authService.getCurrentUser().then(user => {
      console.log('Se recibe el planete', user?.uid);
      if (user) {
        console.log('Se verifico el usuario')
        this.firestore
          .collection<UserPlanet>('userPlanets', ref => 
            ref.where('userId', '==', user.uid)
          )
          .valueChanges({ idField: 'id' })
          .subscribe(planets => {
            this.userPlanets = planets;
            console.log('Planets loaded:', planets);
          }, error => {
            console.error('Error loading planets:', error);
          });
      }
    }).catch(error => {
      console.error('Error getting current user:', error);
    });
  }
}
