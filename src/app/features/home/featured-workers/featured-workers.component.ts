import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { WorkerSummary } from '../../../shared/models/worker-summary.model';

@Component({
  selector: 'app-featured-workers',
  templateUrl: './featured-workers.component.html',
  styles: [`
    /* SECTION BASE */
    .workers-section {
      background: var(--color-primary-50);
      padding: var(--space-12) 0;
      overflow: hidden;
    }

    /* HEADER ARCHITECTURE */
    .workers-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: var(--space-8);
      direction: rtl;
      gap: var(--space-5);
    }

    .workers-header__text {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      align-items: center;
      text-align: center;
    }

    .section-header__label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      font-size: var(--text-sm);
      font-weight: var(--font-bold);
      color: var(--color-accent);
      background: none;
      padding: 0;
      margin-bottom: var(--space-1);
      font-family: var(--font-arabic);
    }

    .section-header__label svg {
      flex-shrink: 0;
    }

    .section-header__title {
      font-size: clamp(1.65rem, 3vw, 2.25rem);
      font-weight: var(--font-extrabold);
      color: var(--text-primary);
      font-family: var(--font-arabic);
      margin: 0;
    }

    .section-header__accent {
      color: var(--color-primary);
    }

    .section-header__sub {
      font-size: var(--text-base);
      color: var(--text-secondary);
      margin: 0;
      font-family: var(--font-arabic);
    }

    .workers-header__actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-4);
      width: 100%;
    }

    /* PREMIUM CONTROLS */
    .slider-controls {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .ctrl-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      color: var(--text-primary);
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      transition: all 200ms ease;
    }

    .ctrl-btn:hover {
      background: var(--color-primary);
      color: var(--text-inverse);
      border-color: var(--color-primary);
      transform: translateY(-1px);
    }

    .workers-header__cta {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--color-primary);
      font-weight: var(--font-bold);
      font-size: var(--text-sm);
      text-decoration: none;
      padding: 10px var(--space-5);
      border: 1.5px solid var(--color-primary-200);
      border-radius: var(--radius-full);
      transition: all 200ms ease;
      white-space: nowrap;
      background: var(--bg-surface);
      font-family: var(--font-arabic);
    }

    .workers-header__cta:hover {
      background: var(--color-primary);
      color: var(--text-inverse);
      border-color: var(--color-primary);
    }

    /*  SLIDER WRAPPERS WITH MANDATORY SNAPPING */
    .workers-scroll-wrapper {
      overflow-x: auto;
      padding-bottom: var(--space-4);
      scroll-behavior: smooth;
      scrollbar-width: none;
      direction: rtl;

      scroll-snap-type: x mandatory; 
    }

    .workers-scroll-wrapper::-webkit-scrollbar {
      display: none;
    }

    .workers-track {
      display: flex;
      gap: var(--space-6);
      width: max-content;
      padding: var(--space-3) var(--space-2);
    }


    app-worker-card {
      scroll-snap-align: start;
      scroll-snap-stop: always;
      display: block;
    }

    .workers-empty-state {
      padding: var(--space-8);
      text-align: center;
      color: var(--text-muted);
      font-family: var(--font-arabic);
    }

    /* RESPONSIVE BREAKPOINTS */
    @media (max-width: 768px) {
      .workers-header {
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      .workers-header__actions {
        justify-content: center;
      }

      .slider-controls {
        display: none;
      }

      .workers-header__cta {
        width: 100%;
        max-width: 280px;
        justify-content: center;
      }

      .workers-track {
        gap: var(--space-4);
        padding-left: var(--space-4);
      }
    }
  `]
})
export class FeaturedWorkersComponent implements OnChanges {
  @Input() workers: WorkerSummary[] = [];
  displayWorkers: WorkerSummary[] = [];

  @ViewChild('sliderContainerRef', { read: ElementRef }) sliderContainer!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workers']) {
      const gold = this.workers.filter(w => w.tier === 'gold');
      this.displayWorkers = gold.length ? gold : this.workers;
    }
  }

  /**
   * Slides the container intelligently matching the dynamic screen dimensions.
   * Snapping properties ensure clean alignment.
   */
  scrollSlider(direction: 'left' | 'right'): void {
    if (!this.sliderContainer) return;

    const container = this.sliderContainer.nativeElement as HTMLElement;
    

    const containerWidth = container.clientWidth;
    

    const scrollStep = containerWidth - 24; 
    
    if (direction === 'left') {
      container.scrollLeft -= scrollStep;
    } else {
      container.scrollLeft += scrollStep;
    }
  }
}