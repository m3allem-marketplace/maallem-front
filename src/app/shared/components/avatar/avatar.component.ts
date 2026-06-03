import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-xl'
};

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html'
})
export class AvatarComponent {

  @Input() imageUrl: string | null = null;
  @Input() name = '';
  @Input() size: AvatarSize = 'md';

  get initials(): string {
    return this.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word[0]?.toUpperCase() ?? '')
      .join('');
  }

  get classes(): string {
    return `
      inline-flex
      items-center
      justify-center
      rounded-full
      overflow-hidden
      shrink-0
      select-none
      font-semibold
      ${SIZE_CLASSES[this.size]}
    `;
  }
}