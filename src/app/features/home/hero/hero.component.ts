import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';

export interface HeroSlide {
  image: string;
  badge: string;
  headline: string;
  sub: string;
}

const SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=85',
    badge: 'خدمة موثوقة دائماً',
    headline: 'لاقي الصنايعي الصح بسرعة وأمان',
    sub: 'منصة معلّم تربطك بأفضل الحرفيين في منطقتك — سباكة، كهرباء، نجارة، وأكتر.',
  },
  {
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=85',
    badge: 'صنايعية محترفين',
    headline: 'صلح بيتك مع أفضل الحرفيين',
    sub: 'أكتر من 10,000 صنايعي معتمد ومُقيَّم — احجز في دقيقة وادفع بأمان.',
  },
  {
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=85',
    badge: 'معلّمين على أعلى مستوى',
    headline: 'شغل نظيف من أول مرة',
    sub: 'كل صنايعي بيتحقق منه بدقة — تقييمات حقيقية وضمان على الشغل.',
  },
];

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html'
})
export class HeroComponent implements OnInit, OnDestroy {

  slides: HeroSlide[] = SLIDES;
  activeSlide = 0;
  prevSlide = -1;
  isAnimating = false;
  animationsEnabled = false;
  // TODO: Replace with UserContextService when available
  isLoggedIn = false;// or true for workers

  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private readonly INTERVAL = 6000;  private readonly COPY_ANIMATION_DURATION = 900;
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Disable animations for the very first paint so content appears in place
    setTimeout(() => { this.animationsEnabled = true; }, 50);
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  startAutoplay(): void {
    this.autoplayTimer = setInterval(() => this.nextSlideClick(), this.INTERVAL);
  }

  stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  goToSlide(index: number): void {
    if (index === this.activeSlide) return;
    // mark previous slide then reset animation flag so animation restarts reliably
    this.prevSlide = this.activeSlide;
    this.isAnimating = false;

    // small delay to ensure DOM/class toggles will retrigger CSS animation
    setTimeout(() => {
      this.activeSlide = index;
      this.isAnimating = true;

      setTimeout(() => {
        this.isAnimating = false;
        this.prevSlide = -1;
      }, this.COPY_ANIMATION_DURATION);
    }, 20);
  }

  nextSlideClick(): void {
    this.goToSlide((this.activeSlide + 1) % this.slides.length);
  }

  prevSlideClick(): void {
    this.goToSlide((this.activeSlide - 1 + this.slides.length) % this.slides.length);
  }

  onSearchChange(query: string): void {
    if (query?.trim()) {
      this.router.navigate(['/workers'], { queryParams: { q: query.trim() } });
    }
  }
}