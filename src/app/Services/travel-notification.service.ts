import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { combineLatest, Observable, of } from 'rxjs';//combineLatest escucha dos observables y muestra el ultimo valor de cada uno cada vez que cualquiera de los dos cambia
import { map, switchMap } from 'rxjs/operators';
import { TravelReservationsService } from './travel-reservations.service';

@Injectable({
  providedIn: 'root'
})
export class TravelNotificationService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private travelReservationsService: TravelReservationsService
  ) { }
  getUpcomingTrips(): Observable<any[]> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (!user) return of([]);

        // Cruza los viajes que compro el usuario con los viajes originales,
        // asi se puede saber si el admin dio de baja alguno
        return combineLatest([
          this.firestore
            .collection('users')
            .doc(user.uid)
            .collection('purchasedTrips')
            .valueChanges(),
          this.travelReservationsService.getAllTrips()
        ])
          .pipe(
            map(([trips, todosLosViajes]) => trips.map(trip => {
              if (!trip['tripDeparture']) return null;

              const departure = trip['tripDeparture']?.seconds ? 
                new Date(trip['tripDeparture'].seconds * 1000) : 
                new Date(trip['tripDeparture']);
              
              const daysUntilDeparture = Math.ceil(
                (departure.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
              );

              // Busca el viaje original para ver si sigue activo
              const original = todosLosViajes.find(viaje => viaje.docId === trip['tripId']);
              const cancelado = original ? original.active === false : false;

              return {
                ...trip,
                daysUntilDeparture,
                cancelado,
                shouldNotify: daysUntilDeparture > 0 && (cancelado || daysUntilDeparture <= 30)
              };//avisa si lo cancelaron, o si faltan 30 dias o menos
            })),
            map(trips => trips.filter(trip => trip && trip.shouldNotify))
          );
      })
    );
  }
}
