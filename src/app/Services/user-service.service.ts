import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';  
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(
    private fireauth: AngularFireAuth,   
    private firestore: AngularFirestore 
  ) { }

  
  getCurrentUserObservable(): Observable<any> {
    return this.fireauth.authState;  
  }

  // Método para obtener las reservas del usuario
  getUserReservations(): Observable<any[]> {
    return this.getCurrentUserObservable().pipe(
      switchMap(user => {
        if (user) {
          // Si hay un usuario autenticado, obtenemos sus reservas de Firestore
          return this.firestore
            .collection('users')
            .doc(user.uid)
            .collection('purchasedTrips')
            .valueChanges();  // Devuelve un observable con las reservas
        } else {
          // Si no hay usuario autenticado, devolvemos un observable vacío
          return of([]);  // Retorna un observable vacío
        }
      })
    );
  }
}

