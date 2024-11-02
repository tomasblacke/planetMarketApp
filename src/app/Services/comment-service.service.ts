import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../Interfaces/coments.interface';
import { Firestore, collection, getDocs, addDoc, query, where, Timestamp, getFirestore } from 'firebase/firestore'; // Importa Timestamp aquí
import { initializeApp } from 'firebase/app';
import { environment } from 'src/app/Environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CommentServiceService {
  private db: Firestore;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  // Obtener comentarios desde Firestore
  getComments(itemId: number, itemType: 'planet' | 'trip'): Observable<Comment[]> {
    const commentsCollection = collection(this.db, 'comments');
    const q = query(
      commentsCollection,
      where('itemId', '==', itemId),
      where('itemType', '==', itemType)
    );

    return new Observable<Comment[]>(observer => {
      getDocs(q).then(querySnapshot => {
        const comments: Comment[] = [];
        querySnapshot.forEach(doc => {
          const commentData = doc.data() as Comment;
          
          // Verificación y conversión de fecha
          const date = commentData.date instanceof Timestamp
            ? commentData.date.toDate()
            : new Date();

          comments.push({
            ...commentData,
            date: date,
          });
        });
        observer.next(comments);
        observer.complete();
      }).catch(error => {
        console.error('Error al cargar comentarios:', error);
        observer.error(error);
      });
    });
  }

  // Agregar un nuevo comentario a Firestore
  addComment(comment: Comment): Observable<Comment> {
    const commentsCollection = collection(this.db, 'comments');

    return new Observable<Comment>(observer => {
      addDoc(commentsCollection, comment).then(docRef => {
        const newComment: Comment = {
          ...comment,
          id: docRef.id, // Convertir id a number, o asignar 0 como valor por defecto
        };

        observer.next(newComment);
        observer.complete();
      }).catch(error => {
        console.error('Error al agregar comentario:', error);
        observer.error(error);
      });
    });
  }
}
