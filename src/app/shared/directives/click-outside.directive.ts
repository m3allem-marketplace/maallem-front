import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({ selector: '[appClickOutside]', standalone: true })
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

 @HostListener('document:click', ['$event.target'])
onClick(target: EventTarget | null): void {

  const clickedElement = target as Node;

  if (
    target &&
    !this.el.nativeElement.contains(clickedElement)
  ) {
    this.clickOutside.emit();
  }

}
}