import {
  Injectable,
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  BehaviorSubject
} from 'rxjs';

export type ToastType =
  | 'success'
  | 'error'
  | 'info'
  | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private readonly toastsSubject =
    new BehaviorSubject<Toast[]>([]);

  readonly toasts$ =
    this.toastsSubject.asObservable();

  private id = 0;

  show(
    message: string,
    type: ToastType,
    duration = 4000
  ): void {

    const toast: Toast = {
      id: ++this.id,
      message,
      type
    };

    this.toastsSubject.next([
      ...this.toastsSubject.value,
      toast
    ]);

    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  remove(id: number): void {
    this.toastsSubject.next(
      this.toastsSubject.value.filter(
        toast => toast.id !== id
      )
    );
  }
}

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">

      <div
        *ngFor="let toast of toastService.toasts$ | async"
        class="toast"
        [class.toast-success]="toast.type === 'success'"
        [class.toast-error]="toast.type === 'error'"
        [class.toast-info]="toast.type === 'info'"
        [class.toast-warning]="toast.type === 'warning'"
      >

        <span>
          {{ toast.message }}
        </span>

        <button
          type="button"
          class="toast-close"
          (click)="toastService.remove(toast.id)"
        >
          ×
        </button>

      </div>

    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;

      top: 24px;
      right: 24px;

      display: flex;
      flex-direction: column;
      gap: 12px;

      z-index: 9999;

      max-width: 360px;
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;

      min-width: 280px;

      padding: 16px;

      border-radius: var(--radius-md);

      color: white;

      box-shadow: var(--shadow-lg);

      animation: toast-in 200ms ease;
    }

    .toast-success {
      background: #22c55e;
    }

    .toast-error {
      background: #ef4444;
    }

    .toast-info {
      background: #3b82f6;
    }

    .toast-warning {
      background: #f59e0b;
    }

    .toast-close {
      border: none;
      background: transparent;

      color: inherit;

      font-size: 20px;

      cursor: pointer;

      flex-shrink: 0;
    }

    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateX(20px);
      }

      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class ToastContainerComponent {

  constructor(
    public toastService: ToastService
  ) {}
}