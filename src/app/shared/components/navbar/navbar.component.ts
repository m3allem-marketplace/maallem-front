import { Component, HostListener, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';
import { NotificationComponent } from '../notification/notification.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { HasRoleDirective } from '../../directives/has-role.directive';
import { UserContextService } from '../../../core/services/user-context.service';
import { ChatService } from '../../../core/services/chat.service';
import { PusherService } from '../../../core/services/pusher.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as AuthActions from '../../../../store/auth/auth.actions';
import { NotificationsActions } from '../../../store/notifications/notifications.actions';
import { selectUnreadCount } from '../../../store/notifications/notifications.selectors';
import { EcommerceService } from '../../../features/store/ecommerce/services/ecommerce.service';

// Standalone Navbar Component

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarComponent, NotificationComponent, ClickOutsideDirective, HasRoleDirective],
  templateUrl: './navbar.component.html',
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Onest:wght@400;500;600;700;800&display=swap');

    /* ════════════════════════════════════════════════
       NAVBAR ROOT (LIGHT THEME)
    ════════════════════════════════════════════════ */
    .nb-root {
      position: sticky;
      top: 0;
      width: 100%;
      z-index: 200;
      background: #ffffff;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      transition: background 350ms ease, border-color 350ms ease, box-shadow 350ms ease;
    }

    .nb-root.nb-scrolled {
      background: rgba(255, 255, 255, 0.92) !important;
      backdrop-filter: blur(20px) saturate(160%);
      -webkit-backdrop-filter: blur(20px) saturate(160%);
      border-bottom-color: rgba(27, 43, 110, 0.08) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }

    .nb-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
      height: 64px;
    }

    @media (min-width: 768px) {
      .nb-inner {
        padding: 0 2rem;
        height: 72px;
      }
    }

    /* ── Gold accent line at bottom ── */
    .nb-accent-line {
      height: 2px;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(255, 180, 0, 0.2) 15%,
        rgba(255, 180, 0, 0.8) 50%,
        rgba(255, 180, 0, 0.2) 85%,
        transparent 100%
      );
    }

    /* ════════════════════════════════════════════════
       LOGO
    ════════════════════════════════════════════════ */
    .nb-logo {
      display: flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      flex-shrink: 0;
      transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    @media (min-width: 768px) {
      .nb-logo {
        gap: 10px;
      }
    }

    .nb-logo:hover { transform: translateY(-1px) scale(1.015); }

    .nb-logo-emblem {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #1B2B6E, #0d153a);
      border: 1.5px solid rgba(255, 180, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 300ms ease, box-shadow 300ms ease, transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 3px 10px rgba(27, 43, 110, 0.15);
    }

    .nb-logo-emblem svg {
      width: 22px;
      height: 22px;
    }

    @media (min-width: 768px) {
      .nb-logo-emblem {
        width: 42px;
        height: 42px;
        border-radius: 10px;
      }
      .nb-logo-emblem svg {
        width: 26px;
        height: 26px;
      }
    }

    .nb-logo:hover .nb-logo-emblem {
      border-color: #FFB400;
      box-shadow: 0 4px 16px rgba(255, 180, 0, 0.3);
      transform: rotate(6deg) scale(1.05);
    }

    .nb-logo-text {
      display: flex;
      flex-direction: column;
    }

    .nb-logo-name {
      font-family: 'Cairo', sans-serif;
      font-size: 1.3rem;
      font-weight: 900;
      color: #1B2B6E;
      line-height: 1.1;
      letter-spacing: 0.01em;
      transition: color 250ms ease;
    }

    .nb-logo:hover .nb-logo-name { color: #FFB400; }

    .nb-logo-tagline {
      font-family: 'Cairo', sans-serif;
      font-size: 9.5px;
      font-weight: 700;
      color: #B99343;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      line-height: 1;
      margin-top: 2px;
    }

    /* ════════════════════════════════════════════════
       DESKTOP NAV LINKS
    ════════════════════════════════════════════════ */
    .nb-links {
      display: none;
    }

    @media (min-width: 1024px) {
      .nb-links {
        display: flex;
        align-items: center;
        gap: 4px;
        flex: 1;
        justify-content: center;
      }
    }

    .nb-link {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 8px 16px;
      font-family: 'Cairo', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #334155 !important;
      text-decoration: none !important;
      border-radius: 8px;
      transition: color 200ms ease, background 200ms ease;
      white-space: nowrap;
    }

    .nb-link-icon {
      color: #64748b;
      transition: color 200ms ease, transform 200ms ease;
      flex-shrink: 0;
    }

    .nb-link:hover {
      color: #1B2B6E !important;
      background: rgba(27, 43, 110, 0.04);
    }

    .nb-link:hover .nb-link-icon {
      color: #1B2B6E;
      transform: translateY(-1px);
    }

    /* Gold underline on hover & active */
    .nb-link::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 16px;
      right: 16px;
      height: 2.5px;
      border-radius: 2px;
      background: #FFB400;
      transform: scaleX(0);
      transition: transform 280ms cubic-bezier(0.76, 0, 0.24, 1);
      transform-origin: right;
    }

    .nb-link:hover::after,
    .nb-link--active::after {
      transform: scaleX(1);
      transform-origin: right;
    }

    .nb-link--active {
      color: #1B2B6E !important;
      background: rgba(255, 180, 0, 0.1) !important;
    }

    .nb-link--active .nb-link-icon { color: #1B2B6E; }

    /* ════════════════════════════════════════════════
       RIGHT ACTIONS AREA
    ════════════════════════════════════════════════ */
    .nb-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    @media (min-width: 768px) {
      .nb-actions {
        gap: 12px;
      }
    }

    /* Vertical divider */
    .nb-divider {
      width: 1px;
      height: 26px;
      background: rgba(0, 0, 0, 0.08);
      flex-shrink: 0;
    }

    /* ── Ghost login button ── */
    .nb-btn-ghost {
      display: none;
      align-items: center;
      padding: 9px 20px;
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      font-weight: 700;
      color: #1B2B6E !important;
      text-decoration: none !important;
      border: 1.5px solid rgba(27, 43, 110, 0.2);
      border-radius: 8px;
      transition: all 220ms ease;
      white-space: nowrap;
    }

    @media (min-width: 1024px) {
      .nb-btn-ghost {
        display: inline-flex;
      }
    }

    .nb-btn-ghost:hover {
      color: #1B2B6E !important;
      border-color: #1B2B6E;
      background: rgba(27, 43, 110, 0.04);
    }

    .nb-btn-gold {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 12px;
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      font-weight: 800;
      color: #0d153a !important;
      text-decoration: none !important;
      background: linear-gradient(135deg, #FFB400 0%, #FFC72C 100%);
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 14px rgba(255, 180, 0, 0.35);
      white-space: nowrap;
    }

    @media (min-width: 1024px) {
      .nb-btn-gold {
        padding: 10px 22px;
        font-size: 13.5px;
      }
    }

    .nb-btn-gold span {
      display: none;
    }

    @media (min-width: 500px) {
      .nb-btn-gold span {
        display: inline;
      }
    }

    .nb-btn-gold:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 180, 0, 0.5);
      background: linear-gradient(135deg, #FFC72C 0%, #FFB400 100%);
    }

    .nb-btn-gold:active { transform: translateY(0); }

    .nb-btn-gold svg {
      transition: transform 250ms ease;
    }

    .nb-btn-gold:hover svg { transform: translateX(3px); }

    /* ── Phone widget ── */
    .nb-phone {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nb-phone-icon {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 180, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1B2B6E;
      background: rgba(255, 180, 0, 0.1);
      cursor: pointer;
      transition: all 250ms ease;
      animation: phone-ring 3.5s ease infinite;
      flex-shrink: 0;
    }

    .nb-phone-icon:hover {
      background: #FFB400;
      color: #0d153a;
      border-color: #FFB400;
      transform: rotate(-10deg) scale(1.1);
      animation: none;
    }

    @keyframes phone-ring {
      0% { box-shadow: 0 0 0 0 rgba(255, 180, 0, 0.45); }
      70% { box-shadow: 0 0 0 8px rgba(255, 180, 0, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 180, 0, 0); }
    }

    .nb-phone-text { line-height: 1; }

    .nb-phone-label {
      display: block;
      font-size: 9.5px;
      font-weight: 800;
      color: #B99343;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 3px;
      font-family: 'Cairo', sans-serif;
    }

    .nb-phone-number {
      display: block;
      font-size: 14px;
      font-weight: 900;
      color: #1B2B6E;
      text-decoration: none;
      font-family: 'Onest', sans-serif;
      letter-spacing: 0.03em;
      transition: color 200ms ease;
    }

    .nb-phone-number:hover { color: #FFB400; }

    /* ════════════════════════════════════════════════
       BORDERLESS & CONTAINER-LESS ICON BUTTONS (Bell, Chat)
    ════════════════════════════════════════════════ */
    .nb-icon-wrap { position: relative; }

    .nb-icon-btn-clean {
      position: relative;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      outline: none !important;
      padding: 6px;
      border-radius: 8px;
      color: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: color 200ms ease, transform 200ms ease, background 200ms ease;
    }

    .nb-icon-btn-clean:hover {
      color: #1B2B6E;
      background: rgba(27, 43, 110, 0.05) !important;
      transform: scale(1.08);
    }

    .nb-icon-btn-clean:hover svg { animation: icon-bounce 450ms ease-in-out; }

    @keyframes icon-bounce {
      0%, 100% { transform: translateY(0) rotate(0); }
      30% { transform: translateY(-3px) rotate(-8deg); }
      60% { transform: translateY(1px) rotate(5deg); }
    }

    /* Badge on clean icon btn */
    .nb-badge {
      position: absolute;
      top: 0px;
      right: 0px;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      border-radius: 100px;
      background: #dc3545;
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      font-family: 'Onest', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      animation: badge-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .nb-badge--pulse {
      min-width: 10px;
      height: 10px;
      top: 3px;
      right: 3px;
      padding: 0;
      border: 2px solid #ffffff;
      animation: badge-pulse 2s infinite;
    }

    @keyframes badge-pop { from { transform: scale(0); } to { transform: scale(1); } }

    @keyframes badge-pulse {
      0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.6); }
      70% { box-shadow: 0 0 0 6px rgba(220, 53, 69, 0); }
      100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
    }

    /* ════════════════════════════════════════════════
       AVATAR / PROFILE BUTTON
    ════════════════════════════════════════════════ */
    .nb-avatar-wrap { position: relative; }

    .nb-avatar-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 10px 4px 6px;
      border-radius: 10px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: rgba(0, 0, 0, 0.02);
      cursor: pointer;
      transition: all 220ms ease;
      flex-shrink: 0;
    }

    .nb-avatar-btn:hover {
      border-color: rgba(27, 43, 110, 0.2);
      background: rgba(27, 43, 110, 0.04);
    }

    .nb-avatar-btn--compact {
      padding: 4px 8px 4px 4px;
    }

    .nb-user-info {
      display: flex;
      flex-direction: column;
      text-align: right;
      flex-shrink: 0;
      min-width: max-content;
    }

    .nb-user-name {
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      font-weight: 800;
      color: #1E293B;
      white-space: nowrap;
      line-height: 1.2;
    }

    .nb-user-role {
      font-family: 'Cairo', sans-serif;
      font-size: 10px;
      font-weight: 700;
      color: #B99343;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      line-height: 1;
    }

    .nb-chevron {
      color: #64748b;
      transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
    }

    .nb-chevron--open { transform: rotate(180deg); }

    /* ════════════════════════════════════════════════
       DROPDOWNS (PROFILE & CHAT PREVIEW)
    ════════════════════════════════════════════════ */
    .nb-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      left: 0;
      min-width: 260px;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 14px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      z-index: 9999;
      animation: drop-in 220ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes drop-in {
      from { opacity: 0; transform: translateY(8px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .nb-profile-drop {
      visibility: hidden;
      opacity: 0;
      transform: translateY(10px) scale(0.96);
      pointer-events: none;
      transition: opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
                  transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
                  visibility 220ms;
    }

    .nb-profile-drop.nb-dropdown--open {
      visibility: visible;
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    /* Chat dropdown */
    .nb-chat-drop {
      min-width: 300px;
    }

    .nb-drop-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      font-weight: 800;
      color: #1E293B;
    }

    .nb-drop-view-all {
      font-size: 11.5px;
      font-weight: 700;
      color: #1B2B6E !important;
      text-decoration: none !important;
      transition: opacity 180ms ease;
    }

    .nb-drop-view-all:hover { opacity: 0.8; }

    .nb-chat-list {
      max-height: 240px;
      overflow-y: auto;
      padding: 6px;
    }

    .nb-chat-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 10px;
      border-radius: 10px;
      cursor: pointer;
      transition: background 180ms ease;
    }

    .nb-chat-row:hover { background: #f8fafc; }

    .nb-chat-info { flex: 1; min-width: 0; }

    .nb-chat-name {
      font-family: 'Cairo', sans-serif;
      font-size: 12.5px;
      font-weight: 800;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nb-chat-preview {
      font-family: 'Cairo', sans-serif;
      font-size: 11.5px;
      color: #64748b;
      margin: 2px 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nb-chat-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #dc3545;
      flex-shrink: 0;
    }

    .nb-empty-state {
      padding: 24px 16px;
      text-align: center;
      font-family: 'Cairo', sans-serif;
      font-size: 12px;
      color: #94a3b8;
    }

    /* Profile dropdown interior */
    .nb-drop-user-header {
      padding: 16px 18px 14px;
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      text-align: right;
      direction: rtl;
    }

    .nb-drop-user-label {
      font-family: 'Cairo', sans-serif;
      font-size: 10px;
      font-weight: 700;
      color: #B99343;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 4px;
    }

    .nb-drop-user-name {
      font-family: 'Cairo', sans-serif;
      font-size: 14px;
      font-weight: 800;
      color: #1E293B;
    }

    .nb-drop-user-email {
      font-family: 'Cairo', sans-serif;
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .nb-drop-items { padding: 6px; }

    .nb-drop-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #334155 !important;
      text-decoration: none !important;
      background: none;
      border: none;
      width: 100%;
      text-align: right;
      cursor: pointer;
      transition: background 180ms ease, color 180ms ease;
      direction: rtl;
    }

    .nb-drop-item:hover {
      background: #f1f5f9;
      color: #1B2B6E !important;
    }

    .nb-drop-item svg { color: #64748b; flex-shrink: 0; transition: transform 180ms ease, color 180ms ease; }
    .nb-drop-item:hover svg { color: #1B2B6E; transform: scale(1.1); }

    .nb-drop-item--danger { color: #dc3545 !important; }
    .nb-drop-item--danger:hover { background: #fef2f2 !important; color: #b91c1c !important; }
    .nb-drop-item--danger svg { color: #dc3545; }

    .nb-drop-sep {
      height: 1px;
      background: rgba(0, 0, 0, 0.06);
      margin: 4px 0;
    }

    /* ════════════════════════════════════════════════
       HAMBURGER BUTTON (MOSTAQL STYLE)
    ════════════════════════════════════════════════ */
    .nb-hamburger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      padding: 9px;
      background: #f8fafc;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      cursor: pointer;
      transition: all 200ms ease;
    }

    @media (min-width: 1024px) {
      .nb-hamburger {
        display: none;
      }
    }

    .nb-hamburger:hover {
      background: #f1f5f9;
      border-color: rgba(27, 43, 110, 0.2);
    }

    .nb-bar {
      display: block;
      width: 20px;
      height: 2px;
      background: #1E293B;
      border-radius: 2px;
      transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
                  opacity 300ms ease,
                  width 300ms ease;
    }

    .nb-hamburger--open .nb-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); background: #1B2B6E; }
    .nb-hamburger--open .nb-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .nb-hamburger--open .nb-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: #1B2B6E; width: 20px; }

    /* ════════════════════════════════════════════════
       MOSTAQL STYLE SIDE DRAWER (SLIDING SIDEBAR)
    ════════════════════════════════════════════════ */
    .nb-sidebar-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 320px;
      max-width: 85vw;
      background: #ffffff;
      z-index: 1000;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.12);
      transform: translateX(100%);
      transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .nb-sidebar-drawer--open { transform: translateX(0); }

    /* Sidebar Header */
    .nb-sd-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid #f1f5f9;
    }

    .nb-sd-logo { display: flex; flex-direction: column; }

    .nb-sd-title {
      font-family: 'Cairo', sans-serif;
      font-size: 1.25rem;
      font-weight: 900;
      color: #1B2B6E;
      line-height: 1;
    }

    .nb-sd-sub {
      font-family: 'Cairo', sans-serif;
      font-size: 10px;
      font-weight: 700;
      color: #B99343;
      margin-top: 3px;
    }

    .nb-sd-close {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 200ms ease;
    }

    .nb-sd-close:hover {
      background: #fee2e2;
      color: #dc3545;
      border-color: #fca5a5;
    }

    /* Sidebar Content */
    .nb-sd-content {
      padding: 20px 24px 40px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Search inside Sidebar */
    .nb-sd-search {
      position: relative;
      display: flex;
      align-items: center;
    }

    .nb-sd-search svg {
      position: absolute;
      right: 14px;
      color: #94a3b8;
      pointer-events: none;
    }

    .nb-sd-search input {
      width: 100%;
      padding: 10px 40px 10px 14px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      font-family: 'Cairo', sans-serif;
      font-size: 13px;
      color: #1e293b;
      outline: none;
      transition: all 200ms ease;
    }

    .nb-sd-search input:focus {
      background: #ffffff;
      border-color: #1B2B6E;
      box-shadow: 0 0 0 3px rgba(27, 43, 110, 0.08);
    }

    /* Sidebar User Card */
    .nb-sd-user {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
    }

    .nb-sd-user-info { display: flex; flex-direction: column; }

    .nb-sd-user-name {
      font-family: 'Cairo', sans-serif;
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
    }

    .nb-sd-user-role {
      font-family: 'Cairo', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #B99343;
      margin-top: 2px;
    }

    /* Sidebar Sections & Items */
    .nb-sd-section { display: flex; flex-direction: column; gap: 4px; }

    .nb-sd-section-title {
      font-family: 'Cairo', sans-serif;
      font-size: 11px;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
      padding-right: 4px;
    }

    .nb-sd-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: 10px;
      font-family: 'Cairo', sans-serif;
      font-size: 13.5px;
      font-weight: 700;
      color: #334155 !important;
      text-decoration: none !important;
      background: transparent;
      border: none;
      width: 100%;
      text-align: right;
      cursor: pointer;
      transition: all 200ms ease;
    }

    .nb-sd-item:hover {
      background: #f1f5f9;
      color: #1B2B6E !important;
      transform: translateX(-3px);
    }

    .nb-sd-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 200ms ease;
    }

    .nb-sd-item:hover .nb-sd-icon {
      background: rgba(27, 43, 110, 0.08);
      border-color: rgba(27, 43, 110, 0.15);
      color: #1B2B6E;
    }

    .nb-sd-item--danger { color: #dc3545 !important; }
    .nb-sd-item--danger .nb-sd-icon { color: #dc3545; background: #fef2f2; border-color: #fee2e2; }
    .nb-sd-item--danger:hover { background: #fef2f2; color: #b91c1c !important; }

    .nb-sd-badge {
      margin-right: auto;
      background: #dc3545;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 100px;
      font-family: 'Onest', sans-serif;
    }

    .nb-sd-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 13px;
      font-family: 'Cairo', sans-serif;
      font-size: 14px;
      font-weight: 800;
      color: #0d153a !important;
      text-decoration: none !important;
      background: linear-gradient(135deg, #FFB400 0%, #FFC72C 100%);
      border-radius: 10px;
      margin-top: 8px;
      transition: all 220ms ease;
      box-shadow: 0 4px 14px rgba(255, 180, 0, 0.3);
    }

    .nb-sd-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 180, 0, 0.45);
    }

    /* ════════════════════════════════════════════════
       BACKDROP
    ════════════════════════════════════════════════ */
    .nb-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 999;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      opacity: 0;
      transition: opacity 300ms ease;
    }

    .nb-backdrop--show {
      display: block;
      opacity: 1;
    }

    /* ════════════════════════════════════════════════
       RESPONSIVE — hide user name when space is tight
    ════════════════════════════════════════════════ */
    @media (max-width: 1300px) {
      .nb-user-info {
        display: none;
      }
      .nb-avatar-btn {
        padding: 4px 8px 4px 4px;
      }
    }

    /* ════════════════════════════════════════════════
       GLOBAL OVERRIDES
    ════════════════════════════════════════════════ */
    ::ng-deep body {
      background-color: var(--bg-page) !important;
    }

    ::ng-deep .main-content {
      background-color: var(--bg-page) !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      overflow: hidden !important;
      position: relative;
      z-index: 10;
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly userContext = inject(UserContextService);
  private readonly store = inject(Store);
  private readonly chatService = inject(ChatService);
  private readonly pusherService = inject(PusherService);
  private readonly router = inject(Router);
  private readonly ecommerceService = inject(EcommerceService, { optional: true });
  private userSub?: Subscription;
  private pusherSub?: Subscription;
  private notificationsSub?: Subscription;
  private cartSub?: Subscription;

  cartCount = 0;

  currentUser: any = null;
  isMenuOpen     = false;
  isDropdownOpen = false;
  isScrolled     = false;
  isNotificationOpen = false;
  isChatOpen     = false;
  unreadChatCount = 0;
  unreadNotificationsCount = 0;
  previewConversations: any[] = [];
  isDesktop = true;

  @HostListener('window:scroll')
  onScroll(): void { this.isScrolled = window.scrollY > 20; }

  @HostListener('window:resize')
  onResize(): void { this.checkViewport(); }

  private checkViewport(): void {
    this.isDesktop = window.innerWidth >= 1024;
  }

  ngOnInit(): void {
    this.checkViewport();
    
    // Subscribe to cart count if EcommerceService is available
    if (this.ecommerceService) {
      this.cartSub = this.ecommerceService.cartCount$.subscribe(count => {
        this.cartCount = count;
      });
    }
    // Subscribe to unread notification count
    this.notificationsSub = this.store.select(selectUnreadCount).subscribe(count => {
      this.unreadNotificationsCount = count;
    });

    this.userSub = this.userContext.currentUser$.subscribe(user => {
      this.currentUser = user;

      if (user?._id) {
        console.log(`[Navbar] Connecting Pusher for user ID: ${user._id}`);
        this.pusherService.connect(user._id);
        this.loadUnreadChatCount();
        
        console.log('[Navbar] Listening to Pusher notification$ stream...');
        this.pusherSub = this.pusherService.notification$.subscribe(evt => {
          console.log('[Navbar] Received incoming Pusher event:', evt);
          
          if (evt.event === 'new-notification') {
            // Extract the real-time notification payload directly to save an HTTP request
            const rawNotif = evt.data?.notification || evt.data;
            if (rawNotif) {
              const mappedNotif: any = {
                id: rawNotif._id || `notif-${Date.now()}`,
                userId: rawNotif.recipient || 'me',
                type: rawNotif.type || 'SYSTEM',
                title: rawNotif.title || 'إشعار جديد',
                body: rawNotif.message || '',
                referenceId: rawNotif.data?.projectId || rawNotif.data?.conversationId || null,
                referenceType: null,
                isRead: rawNotif.isRead || false,
                createdAt: rawNotif.createdAt || new Date().toISOString()
              };
              this.store.dispatch(NotificationsActions.receiveNotification({ notification: mappedNotif }));
            }
            
            // If the notification happens to be about a chat message, also refresh chat counts
            if (evt.data?.notification?.type === 'new_message') {
              this.loadUnreadChatCount();
            }
          } else if (evt.event === 'new-message') {
            const msg = evt.data?.message || evt.data;
            const senderId = msg?.sender?._id || msg?.sender;
            
            // Only increment badge if someone ELSE sent the message
            if (senderId !== this.currentUser?._id) {
              this.unreadChatCount++;
              this.loadUnreadChatCount();
            }
          }
        });
      } else {
        console.log('[Navbar] User logged out, disconnecting Pusher.');
        this.pusherService.disconnect();
        this.unreadChatCount = 0;
        this.previewConversations = [];
        this.pusherSub?.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.pusherSub?.unsubscribe();
    this.notificationsSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  /** Load total unread message count and latest conversations for preview dropdown */
  loadUnreadChatCount(): void {
    this.chatService.getConversations().subscribe({
      next: (res: any) => {
        const convs: any[] = res?.data?.conversations || res?.data || res || [];
        
        // Listen to all conversations instantly to get global live badges
        convs.forEach(c => this.pusherService.subscribeToConversation(c._id));

        const role = this.currentUser?.role;
        this.unreadChatCount = convs.reduce((total: number, c: any) => {
          const unread = role === 'user' ? c.unreadCount?.client : c.unreadCount?.worker;
          return total + (unread || 0);
        }, 0);
        this.previewConversations = convs.slice(0, 5);
      },
      error: () => {
        this.unreadChatCount = 0;
        this.previewConversations = [];
      }
    });
  }

  toggleChatDropdown(): void {
    this.isNotificationOpen = false;
    this.isDropdownOpen = false;
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.loadUnreadChatCount();
    }
  }

  navigateToConversation(conv: any): void {
    this.isChatOpen = false;
    this.router.navigate(['/chat'], {
      queryParams: {
        conversationId: conv._id
      }
    });
  }

  getParticipantName(conv: any): string {
    const role = this.currentUser?.role;
    if (role === 'user') {
      return conv.worker?.name || 'حرفي معلّم';
    } else {
      return conv.client?.name || 'عميل معلّم';
    }
  }

  getUnreadCount(conv: any): number {
    if (!conv.unreadCount) return 0;
    const role = this.currentUser?.role;
    return role === 'user' ? conv.unreadCount.client : conv.unreadCount.worker;
  }

  /** Call when user opens the chat page to clear the badge */
  clearUnreadChat(): void {
    this.unreadChatCount = 0;
  }

  get isGuest(): boolean { return !this.currentUser; }
  get isUser(): boolean { return this.currentUser?.role === 'user'; }
  get isWorker(): boolean {
    return ['individual_worker', 'company_worker', 'worker'].includes(this.currentUser?.role);
  }

  get currentUserRoleLabel(): string {
    if (!this.currentUser?.role) {
      return '';
    }

    switch (this.currentUser.role) {
      case 'user':
        return 'عميل';
      case 'worker':
      case 'individual_worker':
        return 'عامل';
      case 'company':
      case 'company_worker':
        return 'شركة';
      default:
        return this.currentUser.role;
    }
  }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }

  toggleDropdown(): void {
    this.isNotificationOpen = false;
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void { this.isDropdownOpen = false; }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.isDropdownOpen = false;
  }

  toggleNotifications(): void {
    this.isDropdownOpen = false;
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  get showCartButton(): boolean {
    return !!this.ecommerceService && this.router.url.includes('/store');
  }

  openStoreCart(): void {
    if (this.ecommerceService) {
      this.ecommerceService.isCartDrawerOpen$.next(true);
    }
  }
}
