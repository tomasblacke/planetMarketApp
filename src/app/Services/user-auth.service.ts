import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '@firebase/auth-types';
import { Observable } from 'rxjs';

//import { AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { }
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
  //register method
  // register(email: string, password: string, name: string, lastname: string) {
  //   this.fireauth.createUserWithEmailAndPassword(email, password).then(() => {
  //     this
  //     this.router.navigate(['/login']);
  //   }, err => {
  //     alert(err.message)
  //     this.router.navigate(['/register']);
  //   })

  // }


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

