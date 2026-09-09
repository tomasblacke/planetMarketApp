import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../Interfaces/coments.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommentServiceService {

  // Usamos AngularFirestore como el resto de los servicios. Antes este servicio
  // se armaba su propia conexion con initializeApp/getFirestore y esa conexion no
  // tenia la sesion del usuario, asi que el borrado del admin llegaba sin identificar
  // y las reglas lo rechazaban.
  constructor(private firestore: AngularFirestore) { }

  // Obtener comentarios desde Firestore
  getComments(itemId: number, itemType: 'planet' | 'trip'): Observable<Comment[]> {
    const consulta = this.firestore.collection('comments', ref =>
      ref.where('itemId', '==', itemId)
         .where('itemType', '==', itemType)
    );

    return new Observable<Comment[]>(observer => {
      consulta.get().subscribe(querySnapshot => {
        const comments: Comment[] = [];
        querySnapshot.forEach(doc => {
          const commentData = doc.data() as Comment;

          // Verificación y conversión de fecha. El timestamp que devuelve
          // AngularFirestore no pasa el instanceof, asi que preguntamos si trae toDate().
          const fechaGuardada = commentData.date as any;
          const date = fechaGuardada && typeof fechaGuardada.toDate === 'function'
            ? fechaGuardada.toDate()
            : new Date(fechaGuardada);

          comments.push({
            ...commentData,
            id: doc.id, // el id no viene adentro de data(), lo sacamos del documento asi el admin lo puede borrar
            date: date,
          });
        });
        observer.next(comments);
        observer.complete();
      }, error => {
        console.error('Error al cargar comentarios:', error);
        observer.error(error);
      });
    });
  }

  // Agregar un nuevo comentario a Firestore
  addComment(comment: Comment): Observable<Comment> {
    return new Observable<Comment>(observer => {
        this.firestore.collection('comments').add({
            itemId: comment.itemId,
            itemType: comment.itemType,
            userName: comment.userName,
            text: comment.text,
            date: comment.date // Asegúrate de que esto esté en el formato correcto
        }).then(docRef => {
            const newComment: Comment = {
                ...comment,
                id: docRef.id, // Asigna el ID generado por Firestore
            };

            observer.next(newComment);
            observer.complete();
        }).catch(error => {
            console.error('Error al agregar comentario:', error);
            observer.error(error);
        });
    });
}


  deleteComment(commentId: string): Observable<void> {
    return new Observable<void>(observer => {
      this.firestore.collection('comments').doc(commentId).delete().then(() => {
        observer.next();
        observer.complete();
      }).catch(error => {
        console.error('Error al eliminar comentario:', error);
        observer.error(error);
      });
    });
  }
}
