import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TravelNotificationService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) { }
  getUpcomingTrips(): Observable<any[]> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (!user) return [];
        
        return this.firestore
          .collection('users')
          .doc(user.uid)
          .collection('purchasedTrips')
          .valueChanges()
          .pipe(
            map(trips => trips.map(trip => {
              if (!trip['tripDeparture']) return null;

              const departure = trip['tripDeparture']?.seconds ? 
                new Date(trip['tripDeparture'].seconds * 1000) : 
                new Date(trip['tripDeparture']);
              
              const daysUntilDeparture = Math.ceil(
                (departure.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
              );

              return {
                ...trip,
                daysUntilDeparture,
                shouldNotify: daysUntilDeparture <= 30 && daysUntilDeparture > 0
              };
            })),
            map(trips => trips.filter(trip => trip && trip.shouldNotify))
          );
      })
    );
  }
}
