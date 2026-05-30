import {
  Injectable,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';

/* ─────────────────────────────────────────
   Toast Model
───────────────────────────────────────── */
export interface Toast {
  id:       number;
  message:  string;
  type:     'success' | 'error' | 'info' | 'warning';
  duration: number;
}

/* ─────────────────────────────────────────
   Toast Service
───────────────────────────────────────── */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  readonly toasts$ = new Subject<Toast>();

  show(
    message: string,
    type: Toast['type'] = 'info',
    duration: number    = 4000
  ): void {
    this.toasts$.next({ id: ++this.counter, message, type, duration });
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }
}

/* ─────────────────────────────────────────
   Toast Container Component
   Add <app-toast-container> once in AppComponent
───────────────────────────────────────── */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      <div
        *ngFor="let toast of toasts; trackBy: trackById"
        class="toast"
        [class]="'toast toast--' + toast.type"
        role="alert"
      >
        <span class="toast__icon" aria-hidden="true">{{ iconFor(toast.type) }}</span>
        <span class="toast__message">{{ toast.message }}</span>
        <button class="toast__close" (click)="dismiss(toast.id)" aria-label="Close">
          &#x2715;
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* ── Container ── */
    .toast-container {
      position:       fixed;
      top:            var(--space-6);
      right:          var(--space-6);
      z-index:        var(--z-toast);
      display:        flex;
      flex-direction: column;
      gap:            var(--space-3);
      max-width:      var(--toast-width);
      width:          100%;
      pointer-events: none;
    }

    /* ── Single Toast ── */
    .toast {
      display:        flex;
      align-items:    center;
      gap:            var(--space-3);
      padding:        var(--space-3) var(--space-4);
      border-radius:  var(--toast-radius);
      box-shadow:     var(--toast-shadow);
      font-size:      var(--text-sm);
      font-weight:    var(--font-medium);
      pointer-events: all;
      animation:      toastIn var(--transition-slow) ease;
    }

    @keyframes toastIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }

    /* ── Types ── */
    .toast--success {
      background-color: var(--color-success-light);
      color:            var(--color-success-dark);
      border-left:      4px solid var(--color-success);
    }

    .toast--error {
      background-color: var(--color-error-light);
      color:            var(--color-error-dark);
      border-left:      4px solid var(--color-error);
    }

    .toast--warning {
      background-color: var(--color-warning-light);
      color:            var(--color-warning-dark);
      border-left:      4px solid var(--color-warning);
    }

    .toast--info {
      background-color: var(--color-info-light);
      color:            var(--color-info-dark);
      border-left:      4px solid var(--color-info);
    }

    /* ── Icon ── */
    .toast__icon {
      font-size:  var(--text-base);
      flex-shrink: 0;
    }

    /* ── Message ── */
    .toast__message {
      flex: 1;
      line-height: var(--leading-snug);
    }

    /* ── Close button ── */
    .toast__close {
      background:   transparent;
      border:       none;
      cursor:       pointer;
      font-size:    var(--text-sm);
      color:        inherit;
      opacity:      0.6;
      padding:      var(--space-1);
      border-radius: var(--radius-xs);
      transition:   var(--transition-base);
      flex-shrink:  0;
    }

    .toast__close:hover {
      opacity: 1;
    }
  `]
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private timers      = new Map<number, ReturnType<typeof setTimeout>>();
  private subscription!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      const timer = setTimeout(() => this.dismiss(toast.id), toast.duration);
      this.timers.set(toast.id, timer);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.timers.forEach(t => clearTimeout(t));
  }

  dismiss(id: number): void {
    this.toasts    = this.toasts.filter(t => t.id !== id);
    const timer    = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  trackById(_: number, toast: Toast): number {
    return toast.id;
  }

  iconFor(type: Toast['type']): string {
    const icons: Record<Toast['type'], string> = {
      success: '✓',
      error:   '✕',
      warning: '⚠',
      info:    'ℹ',
    };
    return icons[type];
  }
}