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
    private authService: AuthService,  // Agregado para obtener el usuario logeado

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
  async checkIfUserIsAdmin() {
    try {
      const user = await this.authService.getCurrentUser();
      if (user && user.email) {
        this.authService.isAdmin(user.email).subscribe(isAdmin => {
          this.isAdmin = isAdmin;
          // Aquí puedes realizar acciones adicionales si el usuario es admin
        });
      }
    } catch (error) {
      console.error('Error al verificar si el usuario es admin:', error);
    }
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
      this.commentServiceService.deleteComment(commentId).subscribe(() => {
        this.comments = this.comments.filter(comment => comment.id !== commentId); // Elimina el comentario de la lista
      });
    } else {
      console.error('No tienes permiso para eliminar comentarios.'); // Manejo de error si no es admin
    }
  }
}

