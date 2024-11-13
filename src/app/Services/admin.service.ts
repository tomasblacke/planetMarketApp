import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminsCollection = 'admins'; // Nombre de la colección en Firestore
  private purchasesCollection = 'purchases';

  constructor(private firestore: AngularFirestore) {
    this.initializeAdminsCollection();
  }

  // Inicializar la colección de administradores
  private initializeAdminsCollection() {
    const defaultAdmins = ['admin@example.com']; // Correo por defecto

    this.firestore.collection(this.adminsCollection).get().subscribe(snapshot => {
      if (snapshot.empty) {
        // Si la colección está vacía, la inicializamos
        defaultAdmins.forEach(email => {
          this.firestore.collection(this.adminsCollection).add({ email });
        });
      }
    });
  }

  // Obtener la lista de correos de administradores
  getAdmins(): Observable<string[]> {
    return this.firestore.collection<{ email: string }>(this.adminsCollection).valueChanges().pipe(
      map(admins => admins.map(admin => admin.email)) // Extraer solo los correos
    );
  }

  // Verificar si un correo es de un administrador
  isAdmin(email: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.getAdmins().subscribe(admins => {
        const isAdmin = admins.includes(email);
        observer.next(isAdmin);
        observer.complete();
      });
    });
  }

  // Agregar un nuevo administrador
  addAdmin(email: string): Promise<void> {
    return this.firestore.collection(this.adminsCollection).doc(email).set({ email })
      .then(() => console.log(`Administrador ${email} agregado.`))
      .catch(error => {
        console.error("Error al agregar el administrador: ", error);
        throw error; // Propagar el error para manejarlo en el componente
      });
  }

  // Eliminar un administrador
  deleteAdmin(email: string): Promise<void> {
    return this.firestore.collection(this.adminsCollection).doc(email).delete()
      .then(() => console.log(`Administrador ${email} eliminado.`))
      .catch(error => {
        console.error("Error al eliminar el administrador: ", error);
        throw error; // Propagar el error para manejarlo en el componente
      });
  }
  getPurchases(): Observable<any[]> {
    return this.firestore.collection<any>(this.purchasesCollection).valueChanges();
  }
}