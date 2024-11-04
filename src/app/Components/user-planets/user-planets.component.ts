import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/user-auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface UserPlanet {
  planetId: string;
  planetName: string;
  totalKilometers: number;
  planetType: string;
  planetImage: string;
  lastPurchaseDate: Date;
  lastPurchaseAmount: number;
  totalInvested: number;
  purchases: {
    date: Date;
    kilometers: number;
    price: number;
  }[];
}

@Component({
  selector: 'app-user-planets',
  templateUrl: './user-planets.component.html',
  styleUrls: ['./user-planets.component.css']
})
export class UserPlanetsComponent implements OnInit {
  userPlanets: UserPlanet[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.loadUserPlanets();
  }

  private loadUserPlanets(): void {
    console.log('Iniciando carga de planetas del usuario');
    this.authService.getCurrentUser().then(user => {
      if (user) {
        console.log('Usuario autenticado:', user.uid);
        this.firestore
          .collection('users')
          .doc(user.uid)
          .collection<UserPlanet>('purchasedPlanets')
          .valueChanges({ idField: 'planetId' })
          .subscribe(
            planets => {
              console.log('Planetas cargados:', planets);
              this.userPlanets = planets;
              this.loading = false;
            },
            error => {
              console.error('Error cargando planetas:', error);
              this.error = 'Error cargando los planetas';
              this.loading = false;
            }
          );
      }
    });
  }
}