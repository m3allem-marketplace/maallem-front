import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { UserContextService } from '../../../core/services/user-context.service';

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
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  slides: HeroSlide[] = SLIDES;
  activeSlide = 0;
  prevSlide = -1;
  isAnimating = false;
  animationsEnabled = false;
  
  isLoggedIn = false;
  showBookingOptionsModal = false;

  navigateToStore(): void {
    window.location.href = 'http://localhost:4201';
  }

  // Direct Selection Modal States
  showDirectSelectionModal = false;
  currentStep = 1;
  selectedCategory = '';
  selectedLocation: any = null;

  categories: { value: string; label: string; icon: SafeHtml }[] = [
    { value: 'plumbing',     label: 'سباكة',     icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-blue-500"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>') },
    { value: 'electricity',  label: 'كهرباء',    icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-amber-500"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>') },
    { value: 'painting',     label: 'دهانات',    icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-purple-500"><path d="M18.3 12A6.7 6.7 0 0 1 12 18.7M12 22A10 10 0 1 1 22 12A10 10 0 0 1 12 22Z"/><circle cx="8" cy="15" r="1.5"/><circle cx="16" cy="15" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg>') },
    { value: 'carpentry',    label: 'نجارة',     icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-orange-600"><path d="m15.5 15.5 5.5-5.5M9.5 21.5l5.5-5.5M6 18l-4 4M22 2l-4 4M2 2l1.5 1.5M20.5 20.5 22 22M2 22l1.5-1.5M20.5 3.5 22 2M3.5 20.5 2 22"/></svg>') },
    { value: 'tiling',       label: 'سيراميك',   icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-teal-600"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>') },
    { value: 'hvac',         label: 'تكييفات',   icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-cyan-400"><path d="M12 2v20M17 5l-5 5-5-5M17 19l-5-5-5 5M2 12h20M5 7l5 5-5 5M19 7l-5 5 5 5"/></svg>') },
    { value: 'cleaning',     label: 'تنظيف',     icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-green-500"><path d="M12 2v8M12 10l4.5-4.5M12 10l-4.5-4.5M12 10a4 4 0 0 0-4 4v8h8v-8a4 4 0 0 0-4-4Z"/></svg>') },
    { value: 'welding',      label: 'حدادة',     icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-red-600"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>') },
    { value: 'moving',       label: 'نقل عفش',   icon: this.sanitizer.bypassSecurityTrustHtml('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-amber-700"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>') }
  ];

  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private readonly INTERVAL = 6000;
  private readonly COPY_ANIMATION_DURATION = 900;

  ngOnInit(): void {
    this.isLoggedIn = this.userContext.isLoggedIn;
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

  toggleBookingOptionsModal(show: boolean): void {
    this.showBookingOptionsModal = show;
  }

  openDirectSelectionModal(): void {
    this.showBookingOptionsModal = false;
    this.showDirectSelectionModal = true;
    this.currentStep = 1;
    this.selectedCategory = '';
    this.selectedLocation = null;
  }

  closeDirectSelectionModal(): void {
    this.showDirectSelectionModal = false;
  }

  selectCategory(val: string): void {
    this.selectedCategory = val;
  }

  goToStep2(): void {
    if (!this.selectedCategory) {
      return;
    }
    this.currentStep = 2;
  }

  goBackToStep1(): void {
    this.currentStep = 1;
  }

  onModalLocationChange(loc: any): void {
    this.selectedLocation = loc;
  }

  confirmDirectSelection(): void {
    if (!this.selectedCategory) return;
    
    const queryParams: any = {
      category: this.selectedCategory
    };

    if (this.selectedLocation) {
      queryParams.lat = this.selectedLocation.lat;
      queryParams.lng = this.selectedLocation.lng;
      queryParams.city = this.selectedLocation.city;
      queryParams.address = this.selectedLocation.address;

      // Save for pre-population in worker-detail booking modal
      localStorage.setItem('user_selected_location', JSON.stringify(this.selectedLocation));
    }

    this.showDirectSelectionModal = false;
    this.router.navigate(['/workers'], { queryParams });
  }
}