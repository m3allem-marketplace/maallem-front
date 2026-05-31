import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type AvatarSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styles: [`
    .avatar {
      display:         inline-flex;
      align-items:     center;
      justify-content: center;
      border-radius:   var(--radius-full);
      overflow:        hidden;
      flex-shrink:     0;
      font-weight:     var(--font-semibold);
      background:      var(--color-primary-subtle);
      color:           var(--color-primary);
      user-select:     none;
    }

    .avatar--sm { width: var(--avatar-sm); height: var(--avatar-sm); font-size: var(--text-xs); }
    .avatar--md { width: var(--avatar-md); height: var(--avatar-md); font-size: var(--text-sm); }
    .avatar--lg { width: var(--avatar-lg); height: var(--avatar-lg); font-size: var(--text-xl); }

    .avatar__img {
      width:      100%;
      height:     100%;
      object-fit: cover;
    }
  `]
})
export class AvatarComponent {
  @Input() imageUrl: string | null = null;
  @Input() name:     string        = '';
  @Input() size:     AvatarSize    = 'md';

  get initials(): string {
    return this.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() ?? '')
      .join('');
  }

  get classes(): string {
    return `avatar avatar--${this.size}`;
  }
}