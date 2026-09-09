import { Component, Input, OnInit } from '@angular/core';
import { CommentServiceService } from '../../Services/comment-service.service';
import { Comment } from '../../Interfaces/coments.interface';
import { AdminService } from 'src/app/Services/admin.service';
import { AuthService } from 'src/app/Services/user-auth.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  @Input() itemId!: number;
  @Input() itemType!: 'planet' | 'trip';
  
  comments: Comment[] = [];
  isAdmin: boolean = false;

  constructor(
    private commentServiceService: CommentServiceService,
    private adminService:AdminService,
    private authService: AuthService,  

  ) {}

  ngOnInit() {
    this.loadComments();
    this.checkIfUserIsAdmin();
  }

  loadComments() {
    this.commentServiceService.getComments(this.itemId, this.itemType)
      .subscribe(comments => this.comments = comments);
    console.log('Loading comments for:', this.itemId, this.itemType);
  }
  // Escuchamos el estado de la sesion como en el header, porque al recargar la pagina
  // el usuario actual todavia puede venir vacio y el admin no llegaba a ver el boton de borrar
  checkIfUserIsAdmin() {
    this.authService.getAuthState().subscribe(user => {
      if (user && user.email) {
        this.authService.isAdmin(user.email).subscribe(isAdmin => {
          this.isAdmin = isAdmin;
        });
      } else {
        this.isAdmin = false;
      }
    });
  }

    // Método para formatear la fecha
    formatDate(date: Date): string {
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      }
      return '';
    }

  onCommentAdded(comment: Comment) {
    this.comments.push(comment); // Agrega el nuevo comentario a la lista
  }
  deleteComment(commentId: string) {
    if (this.isAdmin) { // Verifica si el usuario es admin antes de eliminar
      if (!confirm('¿Seguro que querés eliminar este comentario?')) {
        return;
      }
      this.commentServiceService.deleteComment(commentId).subscribe(() => {
        this.comments = this.comments.filter(comment => comment.id !== commentId); // Elimina el comentario de la lista
      }, error => {
        console.error('Error al eliminar comentario:', error);
        alert('No se pudo eliminar el comentario.');
      });
    } else {
      console.error('No tienes permiso para eliminar comentarios.'); // Manejo de error si no es admin
    }
  }
}

