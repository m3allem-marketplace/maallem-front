import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="modal-backdrop" (click)="onBackdropClick($event)">
      <div
        class="modal-dialog"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title"
        #modalDialog
      >
        <!-- Header -->
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" (click)="close()" aria-label="Close modal">
            <span aria-hidden="true">&#x2715;</span>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <ng-content select="[modal-body]" />
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <ng-content select="[modal-footer]" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ── Backdrop ── */
    .modal-backdrop {
      position:         fixed;
      inset:            0;
      z-index:          var(--z-overlay);
      background-color: var(--bg-overlay);
      display:          flex;
      align-items:      center;
      justify-content:  center;
      padding:          var(--space-4);
      animation:        fadeIn var(--transition-base) ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* ── Dialog ── */
    .modal-dialog {
      background:    var(--bg-surface);
      border-radius: var(--modal-radius);
      box-shadow:    var(--modal-shadow);
      width:         100%;
      max-width:     var(--modal-max-width);
      max-height:    90vh;
      overflow-y:    auto;
      z-index:       var(--z-modal);
      animation:     slideUp var(--transition-slow) ease;
    }

    @keyframes slideUp {
      from { transform: translateY(24px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }

    /* ── Header ── */
    .modal-header {
      display:         flex;
      align-items:     center;
      justify-content: space-between;
      padding:         var(--space-6) var(--modal-padding) var(--space-4);
      border-bottom:   var(--border-width) solid var(--border-color);
    }

    .modal-title {
      font-size:   var(--text-xl);
      font-weight: var(--font-semibold);
      color:       var(--text-primary);
      margin:      0;
    }

    .modal-close {
      display:          flex;
      align-items:      center;
      justify-content:  center;
      width:            32px;
      height:           32px;
      border:           none;
      background:       transparent;
      color:            var(--text-secondary);
      font-size:        var(--text-lg);
      border-radius:    var(--radius-sm);
      cursor:           pointer;
      transition:       var(--transition-color);
    }

    .modal-close:hover {
      background-color: var(--color-neutral-100);
      color:            var(--text-primary);
    }

    .modal-close:focus-visible {
      box-shadow: var(--shadow-focus);
      outline:    none;
    }

    /* ── Body ── */
    .modal-body {
      padding: var(--space-6) var(--modal-padding);
    }

    /* ── Footer ── */
    .modal-footer {
      display:         flex;
      justify-content: flex-end;
      gap:             var(--space-3);
      padding:         var(--space-4) var(--modal-padding) var(--space-6);
      border-top:      var(--border-width) solid var(--border-color);
    }
  `]
})
export class ModalComponent implements OnChanges, AfterViewInit {
  @Input()  isOpen: boolean = false;
  @Input()  title:  string  = '';
  @Output() closed  = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.isOpen) this.trapFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.trapFocus(), 50);
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }

  private trapFocus(): void {
    const dialog = this.el.nativeElement.querySelector('.modal-dialog');
    if (!dialog) return;

    const focusable = Array.from(
      dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    first.focus();

    dialog.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
}