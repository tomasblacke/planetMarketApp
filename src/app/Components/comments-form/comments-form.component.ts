import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommentServiceService } from '../../Services/comment-service.service';
import { Comment } from '../../Interfaces/coments.interface';
import { environment } from 'src/app/Environments/environments';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-comments-form',
  templateUrl: './comments-form.component.html',
  styleUrls: ['./comments-form.component.css']
})
export class CommentsFormComponent {
  @Input() itemId!: number;
  @Input() itemType!: 'planet' | 'trip';
  @Output() commentAdded = new EventEmitter<Comment>();

  userName: string = '';
  commentText: string = '';

  constructor(private commentServiceService: CommentServiceService) {}

  async onSubmit() {
    if (this.userName && this.commentText) {
      const newComment: Comment = {
        id: '', 
        itemId: this.itemId,
        itemType: this.itemType,
        userName: this.userName,
        text: this.commentText,
        date: new Date()
      };

      this.commentServiceService.addComment(newComment).subscribe(
        (comment) => {
          this.commentAdded.emit(comment); // Emitir el nuevo comentario
          this.userName = '';
          this.commentText = '';
        },
        (error) => {
          console.error('Error al enviar comentario:', error);
        }
      );
    }
  }

  // Método para validar el formulario
  isFormValid(): boolean {
    return this.userName.trim().length > 0 && this.commentText.trim().length > 0;
  }
}
