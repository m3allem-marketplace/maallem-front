import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly STORAGE_KEY = 'maallem_reviews';
  private reviews: Review[] = [];

  constructor() {
    this.loadReviews();
  }

  private loadReviews() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.reviews = JSON.parse(stored);
      } catch (e) {
        this.initializeDefaultReviews();
      }
    } else {
      this.initializeDefaultReviews();
    }
  }

  private initializeDefaultReviews() {
    this.reviews = [
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
    this.saveReviews();
  }

  private saveReviews() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reviews));
  }

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
    this.saveReviews();
    return of(newReview);
  }
}

