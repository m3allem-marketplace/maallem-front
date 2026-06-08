import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.css']
})
export class BookingSuccessComponent implements OnInit {
  bookingId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookingId = params.get('bookingId') || '';
    });
  }

  goToBookings(): void {
    // Navigates to the bookings dashboard page
    this.router.navigate(['/customer/bookings']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
