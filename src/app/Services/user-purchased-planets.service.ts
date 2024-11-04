import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './user-auth.service';
import { Observable, from, of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

export interface UserPlanet {
  planetId: string;
  planetName: string;
  totalKilometers: number;
  planetType: string;
  planetImage: string;
  totalInvested: number;
  lastPurchase: {
    purchaseDate: Date;
    kilometersPurchased: number;
    totalPrice: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserPurchasedPlanetsService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  getUserPlanets(): Observable<UserPlanet[]> {
    return this.authService.getAuthState().pipe(
      tap(user => console.log('Current user state:', user)),
      switchMap(user => {
        if (!user) {
          console.log('No user authenticated');
          return of([]);
        }

        console.log('Getting planets for user:', user.uid);
        return this.firestore
          .collection('users')
          .doc(user.uid)
          .collection<UserPlanet>('purchasedPlanets')
          .valueChanges()
          .pipe(
            tap(planets => console.log('Planets from Firestore:', planets))
          );
      }),
      catchError(error => {
        console.error('Error fetching user planets:', error);
        return of([]);
      })
    );
  }
}
