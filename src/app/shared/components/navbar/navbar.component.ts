import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarComponent],
  templateUrl: './navbar.component.html',
  styles: [`
    /* ── Import Crest Typography Fonts & Cairo for Arabic ── */
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Onest:wght@400;500;600;700&family=Rethink+Sans:wght@400;600;700;800&display=swap');

    .navbar-main {
      font-family: 'Onest', var(--font-sans);
      background: var(--color-neutral-0);
      border-bottom: 1px solid var(--border-color);
      transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
                  backdrop-filter 300ms cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
                  box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .navbar-main.scrolled {
      background: rgba(255, 255, 255, 0.85) !important;
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      border-color: rgba(27, 43, 110, 0.05) !important;
      box-shadow: 0 10px 30px -10px rgba(27, 43, 110, 0.08);
    }

    /* Support Arabic language elements */
    [style*="direction: rtl"], .arabic-text {
      font-family: 'Cairo', var(--font-arabic) !important;
    }

    /* ── Crest-inspired Navigation Links ── */
    .nav-link {
      position: relative;
      font-family: 'Rethink Sans', var(--font-sans);
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--color-primary-900) !important;
      padding: var(--space-2) var(--space-4);
      transition: color 250ms ease;
      border-radius: var(--radius-sm);
    }

    .nav-link:hover {
      color: var(--color-accent) !important;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: var(--space-4);
      right: var(--space-4);
      height: 2px;
      background: var(--color-accent);
      transform: scaleX(0);
      transition: transform 300ms cubic-bezier(0.76, 0, 0.24, 1);
      transform-origin: right;
    }

    .nav-link:hover::after,
    .nav-link.active::after {
      transform: scaleX(1);
      transform-origin: left;
    }

    .nav-link.active {
      color: var(--color-accent) !important;
      font-weight: 700;
    }

    /* ── Logo ── */
    .logo-wrap {
      transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .logo-wrap:hover {
      transform: translateY(-1px) scale(1.01);
    }

    .logo-icon {
      transition: transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1),
                  box-shadow 300ms ease;
    }

    .logo-wrap:hover .logo-icon {
      transform: rotate(8deg) scale(1.04);
      box-shadow: 0 8px 20px rgba(255, 180, 0, 0.35) !important;
    }

    /* ── Crest-inspired CTA Button ── */
    .cta-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 13px 26px;
      background: var(--color-primary-dark) !important;
      color: var(--color-neutral-0) !important;
      border-radius: var(--radius-sm);
      font-family: 'Rethink Sans', var(--font-sans);
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 12px rgba(27, 43, 110, 0.15);
      border: none;
      cursor: pointer;
      overflow: hidden;
      transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .cta-btn:hover {
      background: var(--color-accent) !important;
      color: var(--color-primary-dark) !important;
      box-shadow: 0 6px 20px rgba(255, 180, 0, 0.35);
      transform: translateY(-2px);
    }

    .cta-btn:active {
      transform: translateY(0);
    }

    .cta-btn-text-wrapper {
      position: relative;
      display: block;
      height: 18px;
      overflow: hidden;
    }

    .cta-btn-text {
      display: block;
      transition: transform 300ms cubic-bezier(0.76, 0, 0.24, 1);
      line-height: 18px;
    }

    .cta-btn-text.hover-text {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
    }

    .cta-btn:hover .cta-btn-text {
      transform: translateY(-100%);
    }

    .cta-arrow {
      transition: transform 300ms cubic-bezier(0.76, 0, 0.24, 1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .cta-btn:hover .cta-arrow {
      transform: translateX(4px);
    }

    /* ── Phone Ring ── */
    .phone-ring {
      animation: ring-pulse 3s cubic-bezier(0.24, 0, 0.38, 1) infinite;
      transition: all 250ms ease;
    }

    .phone-ring:hover {
      background: var(--color-accent) !important;
      color: var(--color-primary-dark) !important;
      transform: scale(1.08) rotate(-8deg);
      border-color: var(--color-accent) !important;
    }

    @keyframes ring-pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 180, 0, 0.45);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(255, 180, 0, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255, 180, 0, 0);
      }
    }

    /* ── Notification Bell ── */
    .bell-btn {
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .bell-btn:hover {
      background: var(--color-primary-muted) !important;
      transform: scale(1.05);
    }

    .bell-btn:hover svg {
      animation: bell-swing 650ms ease-in-out;
    }

    @keyframes bell-swing {
      0%, 100% { transform: rotate(0); }
      15% { transform: rotate(15deg); }
      30% { transform: rotate(-15deg); }
      45% { transform: rotate(10deg); }
      60% { transform: rotate(-10deg); }
      75% { transform: rotate(4deg); }
      90% { transform: rotate(-4deg); }
    }

    .pulse-dot {
      animation: dot-pulse 2s infinite;
    }

    @keyframes dot-pulse {
      0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.6); }
      70% { box-shadow: 0 0 0 6px rgba(220, 53, 69, 0); }
      100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
    }

    /* ── Dropdown ── */
    .dropdown-btn {
      border: 1px solid transparent !important;
      transition: all 250ms ease;
    }

    .dropdown-btn:hover {
      background: var(--color-primary-subtle) !important;
      border-color: rgba(27, 43, 110, 0.06) !important;
    }

    .dropdown-menu {
      visibility: hidden;
      opacity: 0;
      transform: translateY(12px) scale(0.96);
      pointer-events: none;
      transition: opacity 250ms cubic-bezier(0.16, 1, 0.3, 1),
                  transform 250ms cubic-bezier(0.16, 1, 0.3, 1),
                  visibility 250ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .dropdown-menu.show {
      visibility: visible;
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .dropdown-item {
      transition: all 200ms ease;
      position: relative;
    }

    .dropdown-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%) scaleX(0);
      width: 3px;
      height: 60%;
      background: var(--color-accent);
      border-radius: 0 4px 4px 0;
      transition: transform 200ms ease;
      transform-origin: left;
    }

    .dropdown-item:hover {
      background-color: var(--color-primary-subtle) !important;
      color: var(--color-primary) !important;
      padding-left: 1.5rem !important;
    }

    .dropdown-item:hover::before {
      transform: translateY(-50%) scaleX(1);
    }

    .dropdown-item svg {
      transition: transform 200ms ease;
    }

    .dropdown-item:hover svg {
      transform: scale(1.1) translateX(3px);
    }

    .dropdown-logout:hover {
      background-color: var(--color-error-light) !important;
      color: var(--color-error-dark) !important;
    }

    .dropdown-logout::before {
      background: var(--color-error);
    }

    /* ── Mobile Menu ── */
    .mobile-menu {
      visibility: hidden;
      opacity: 0;
      transform: translateY(-12px);
      pointer-events: none;
      transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1),
                  transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
                  visibility 300ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .mobile-menu.show {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    /* ── Hamburger Menu Bar Animations ── */
    .menu-bar {
      transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
                  opacity 300ms cubic-bezier(0.16, 1, 0.3, 1),
                  width 300ms cubic-bezier(0.16, 1, 0.3, 1),
                  background-color 300ms ease;
    }

    /* ── Global Page Curved Canvas Layout (Crest-inspired Nesting) ── */
    ::ng-deep body {
      background-color: var(--bg-page) !important;
    }

    ::ng-deep .main-content {
      background-color: var(--color-primary) !important;
      border-radius: 24px 24px 0 0 !important;
      margin: 16px 16px 0 16px !important;
      box-shadow: 0 15px 40px rgba(27, 43, 110, 0.08) !important;
      overflow: hidden !important;
      position: relative;
      z-index: 10;
    }
  `]
})
export class NavbarComponent {
  currentUser: any = null;
  isMenuOpen     = false;
  isDropdownOpen = false;
  isScrolled     = false;

  @HostListener('window:scroll')
  onScroll(): void { this.isScrolled = window.scrollY > 20; }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!(e.target as HTMLElement).closest('.avatar-wrap')) {
      this.isDropdownOpen = false;
    }
  }

  get isGuest(): boolean { return !this.currentUser; }
  get isUser(): boolean { return this.currentUser?.role === 'user'; }
  get isWorker(): boolean {
    return ['individual_worker', 'company_worker'].includes(this.currentUser?.role);
  }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  toggleDropdown(): void { this.isDropdownOpen = !this.isDropdownOpen; }
  closeDropdown(): void { this.isDropdownOpen = false; }
  logout(): void { this.currentUser = null; this.isDropdownOpen = false; }
}