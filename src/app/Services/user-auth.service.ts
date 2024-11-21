import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '@firebase/auth-types';
import { map, Observable, of, switchMap } from 'rxjs';

//import { AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {
    this.user$ = this.fireauth.authState.pipe(
      switchMap(user => {
        if (user && user.email) { // user email no tiene que ser null
          //Ver si el mail esta en la base admi
          return this.firestore.collection('admins').doc(user.email).valueChanges().pipe(
            map((adminData: any) => ({
              uid: user.uid,
              email: user.email,
              isAdmin: adminData !== undefined // Si existe, el usuario es admin
            }))
          );
        }
        return of(null); // Si no hay usuario, retorna null
      })
    );
  }
  //login method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(() => {
        localStorage.setItem('token', 'true');
        this.router.navigate(['']);
      }, err => {
        alert(err.message)
        this.router.navigate(['/login']);
      })
  }


  // Método de registro modificado

  register(email: string, password: string, name: string, lastname: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // Actualizar el perfil del usuario
        result.user?.updateProfile({
          displayName: `${name} ${lastname}`
        }).then(() => {
          // Guardar en Firestore
          const userId = result.user?.uid;
          this.firestore.collection('users').doc(userId).set({
            uid: userId,
            email: email,
            name: name,
            lastname: lastname
          }).then(() => {
            this.router.navigate(['/login']);
          }).catch((error) => {
            alert('Error al guardar en Firestore: ' + error.message);
          });
        }).catch((error) => {
          alert('Error al actualizar el perfil: ' + error.message);
        });
      })
      .catch((err) => {
        alert(err.message);
        this.router.navigate(['/register']);
      });
  }
  

  //logout method

  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      this.router.navigate(['']);
    })
  }

  isAdmin(email: string): Observable<boolean> {
    return this.firestore.collection('admins').doc(email).valueChanges().pipe(
      map(admin => admin !== undefined) // Devuelve true si el documento existe
    );
  }
  
  //FOR STATE MANAGEMENT
  // Nuevo método para observar el estado de autenticación
  getAuthState(): Observable<any> {
    return this.fireauth.authState;
  }

  // Método para obtener el usuario actual
  getCurrentUser() {
    return this.fireauth.currentUser;
  }
}

