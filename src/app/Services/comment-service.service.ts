import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Comment } from '../Interfaces/coments.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentServiceService {

  private comments: Comment[] = [];

  getComments(itemId: number, itemType: 'planet' | 'trip'): Observable<Comment[]> {
    return of(this.comments.filter(comment => 
      comment.itemId === itemId && comment.itemType === itemType
    ));
  }

  addComment(comment: Comment): Observable<Comment> {
    const newComment = {
      ...comment,
      id: this.comments.length + 1,
      date: new Date()
    };
    this.comments.push(newComment);
    return of(newComment);
  }

}
