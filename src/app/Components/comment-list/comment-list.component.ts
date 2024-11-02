import { Component, Input, OnInit } from '@angular/core';
import { CommentServiceService } from '../../Services/comment-service.service';
import { Comment } from '../../Interfaces/coments.interface';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  @Input() itemId!: number;
  @Input() itemType!: 'planet' | 'trip';
  
  comments: Comment[] = [];

  constructor(private commentServiceService: CommentServiceService) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentServiceService.getComments(this.itemId, this.itemType)
      .subscribe(comments => this.comments = comments);
    console.log('Loading comments for:', this.itemId, this.itemType);
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
}

