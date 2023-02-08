import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {

  @Output() clickOutside = new EventEmitter<void>();

  wasInside: boolean = false;

  constructor(private elementRef: ElementRef) { 
  }
  
  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }
  
  @HostListener('document:click')
  clickout(e: MouseEvent) {
    if (!this.wasInside) {
      this.clickOutside.emit();
    }
    this.wasInside = false;
  }
}