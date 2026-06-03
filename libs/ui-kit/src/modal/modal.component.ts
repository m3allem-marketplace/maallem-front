import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="modal-backdrop"
      (click)="close()"
    >
      <div
        #modalContainer
        class="modal"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title"
        (click)="$event.stopPropagation()"
      >
        <div class="modal-header">
          <h2 class="modal-title">
            {{ title }}
          </h2>

          <button
            type="button"
            class="modal-close"
            (click)="close()"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div class="modal-body">
          <ng-content select="[modal-body]"></ng-content>
        </div>

        <div class="modal-footer">
          <ng-content select="[modal-footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;

      background: var(--bg-overlay);

      display: flex;
      align-items: center;
      justify-content: center;

      padding: var(--space-6);

      z-index: var(--z-modal);

      backdrop-filter: blur(4px);
    }

    .modal {
      width: 100%;
      max-width: var(--modal-max-width);

      background: var(--bg-surface);

      border-radius: var(--modal-radius);

      box-shadow: var(--modal-shadow);

      overflow: hidden;

      animation: modal-enter 200ms ease;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: var(--space-6);

      border-bottom: 1px solid var(--border-color);
    }

    .modal-title {
      margin: 0;

      font-size: var(--text-xl);
      font-weight: var(--font-bold);

      color: var(--text-primary);
    }

    .modal-close {
      border: none;
      background: transparent;

      cursor: pointer;

      color: var(--text-secondary);

      font-size: var(--text-xl);

      padding: var(--space-1);
    }

    .modal-body {
      padding: var(--space-6);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);

      padding: var(--space-6);

      border-top: 1px solid var(--border-color);
    }

    @keyframes modal-enter {
      from {
        opacity: 0;
        transform: translateY(12px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ModalComponent implements OnChanges, OnDestroy {

  @Input() isOpen = false;
  @Input() title = '';

  @Output() closed = new EventEmitter<void>();

  @ViewChild('modalContainer')
  modalContainer?: ElementRef<HTMLElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.toggleBodyScroll();

      if (this.isOpen) {
        setTimeout(() => this.focusFirstElement());
      }
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  close(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  trapFocus(event: KeyboardEvent): void {

    if (event.key !== 'Tab') {
      return;
    }

    if (!this.isOpen || !this.modalContainer) {
      return;
    }

    const focusable = Array.from(
      this.modalContainer.nativeElement.querySelectorAll<HTMLElement>(
        'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
      )
    );

    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === first
    ) {
      event.preventDefault();
      last.focus();
    }

    if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  }

  private toggleBodyScroll(): void {
    document.body.style.overflow =
      this.isOpen ? 'hidden' : '';
  }

  private focusFirstElement(): void {

    if (!this.modalContainer) {
      return;
    }

    const firstFocusable =
      this.modalContainer.nativeElement.querySelector<HTMLElement>(
        'button, input, textarea, select, a[href]'
      );

    firstFocusable?.focus();
  }
}