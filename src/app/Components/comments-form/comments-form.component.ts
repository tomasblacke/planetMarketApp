import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommentServiceService } from '../../Services/comment-service.service';;
import { Comment } from '../../Interfaces/coments.interface';


@Component({
  selector: 'app-comments-form',
  templateUrl: './comments-form.component.html',
  styleUrl: './comments-form.component.css'
})
export class CommentsFormComponent {
  @Input() itemId!: number;
  @Input() itemType!: 'planet' | 'trip';
  @Output() commentAdded = new EventEmitter<Comment>();

  userName: string = '';
  commentText: string = '';

  constructor(private commentServiceService: CommentServiceService) {}

  onSubmit() {
    if (this.userName && this.commentText) {
      const newComment: Comment = {
        itemId: this.itemId,
        itemType: this.itemType,
        userName: this.userName,
        text: this.commentText,
        date: new Date()
      };

      this.commentServiceService.addComment(newComment).subscribe(comment => {
        this.commentAdded.emit(comment);
        this.userName = '';
        this.commentText = '';
      });
    }
  }
}
