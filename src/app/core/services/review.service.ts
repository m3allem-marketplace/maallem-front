import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviews: Review[] = [
    {
      id: 'rev-1',
      bookingId: 'book-1',
      authorId: 'cust-1',
      targetId: 'work-1',
      rating: 5,
      comment: 'ممتاز جداً وسريع في العمل',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rev-2',
      bookingId: 'book-2',
      authorId: 'cust-2',
      targetId: 'work-1',
      rating: 4,
      comment: 'شغل نظيف ومحترم',
      createdAt: new Date().toISOString(),
    },
  ];

  getReviewsForWorker(workerId: string): Observable<Review[]> {
    const filtered = this.reviews.filter((r) => r.targetId === workerId);
    return of(filtered);
  }

  submitReview(payload: any): Observable<Review> {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      bookingId: payload.bookingId,
      authorId: payload.authorId || 'me',
      targetId: payload.targetId,
      rating: payload.rating,
      comment: payload.comment || '',
      createdAt: new Date().toISOString(),
    };
    this.reviews.push(newReview);
    return of(newReview);
  }
}
