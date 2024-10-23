import { Component, Input, OnInit } from '@angular/core';
import { CommentServiceService } from '../../Services/comment-service.service';
import { Comment } from '../../Interfaces/coments.interface';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
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
      console.log('Loading comments for:', this.itemId, this.itemType)
  }
  onCommentAdded(comment: Comment) {
    this.comments.push(comment);
  }

}
