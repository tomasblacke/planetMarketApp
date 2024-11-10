import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, interval, from, combineLatest } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { SpaceTrip } from './travel-reservations.service';

@Injectable({
  providedIn: 'root'
})
export class TripNotificationService {
  private readonly CHECK_INTERVAL = 1000 * 60 * 60; // Revisar cada hora
  private readonly TWO_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 2;
  private readonly COLLECTION_NAME = 'trips';
  private readonly NOTIFICATIONS_COLLECTION = 'trip_notifications';

  constructor(private firestore: AngularFirestore) {
    this.initNotificationCheck();
    this.requestNotificationPermission();
  }

  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notifications permission not granted');
      }
    }
  }

  private initNotificationCheck(): void {
    interval(this.CHECK_INTERVAL).pipe(
      switchMap(() => this.checkUpcomingTrips())
    ).subscribe();
  }

  private checkUpcomingTrips(): Observable<void> {
    const now = new Date().getTime();
    const twoDaysFromNow = now + this.TWO_DAYS_IN_MS;

    // Consulta Firebase usando where para optimizar la consulta
    return this.firestore.collection<SpaceTrip>(this.COLLECTION_NAME, ref => 
      ref.where('departure', '>', new Date(now))
         .where('departure', '<=', new Date(twoDaysFromNow))
    ).valueChanges({ idField: 'docId' }).pipe(
      switchMap(trips => {
        const notificationChecks = trips.map(trip => 
          this.checkAndCreateNotification(trip)
        );
        return combineLatest(notificationChecks);
      }),
      map(() => void 0)
    );
  }

  private checkAndCreateNotification(trip: SpaceTrip & { docId: string }): Observable<void> {
    
    return from(
      this.firestore
        .collection(this.NOTIFICATIONS_COLLECTION)
        .ref.where('tripId', '==', trip.docId)
        .where('type', '==', 'two_day_warning')
        .get()
    ).pipe(
      switchMap(snapshot => {
        if (snapshot.empty) {
          // No existe notificación previa para este viaje
          return from(this.createNotification(trip));
        }
        return from(Promise.resolve());
      })
    );
  }

  private async createNotification(trip: SpaceTrip & { docId: string }): Promise<void> {
    // Guardar registro de la notificación en Firebase
    await this.firestore.collection(this.NOTIFICATIONS_COLLECTION).add({
      tripId: trip.docId,
      type: 'two_day_warning',
      createdAt: new Date(),
      trip: trip
    });

    // Mostrar la notificación al usuario
    this.showNotification(trip);
  }

  private showNotification(trip: SpaceTrip): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const departureDate = new Date(trip.departure).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    new Notification('¡Próximo viaje espacial!', {
      body: `¡Prepárate para tu viaje a ${trip.destination}!\n` +
            `Salida: ${departureDate}\n` +
            `Asientos disponibles: ${trip.availableSeats}`,
      icon: trip.imageUrl,
      badge: trip.imageUrl,
      tag: `trip-${trip.id}`,
      requireInteraction: true
    });
  }

  // Método para obtener el historial de notificaciones de un viaje
  public getNotificationHistory(tripId: string): Observable<any[]> {
    return this.firestore
      .collection(this.NOTIFICATIONS_COLLECTION, ref => 
        ref.where('tripId', '==', tripId)
           .orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  // Método para verificar manualmente las notificaciones
  public forceCheck(): Promise<void> {
    return new Promise((resolve) => {
      this.checkUpcomingTrips()
        .pipe(take(1))
        .subscribe(() => resolve());
    });
  }

  // Método para marcar una notificación como leída
  public markNotificationAsRead(notificationId: string): Promise<void> {
    return this.firestore
      .collection(this.NOTIFICATIONS_COLLECTION)
      .doc(notificationId)
      .update({ read: true });
  }

  // Método para limpiar notificaciones antiguas
  public cleanOldNotifications(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return new Promise((resolve, reject) => {
      this.firestore
        .collection(this.NOTIFICATIONS_COLLECTION, ref =>
          ref.where('createdAt', '<', thirtyDaysAgo)
        )
        .get()
        .subscribe(
          snapshot => {
            const batch = this.firestore.firestore.batch();
            snapshot.docs.forEach(doc => {
              batch.delete(doc.ref);
            });
            batch.commit().then(() => resolve()).catch(reject);
          },
          error => reject(error)
        );
    });
  }
}