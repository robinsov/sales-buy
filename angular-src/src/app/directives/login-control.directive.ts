import { Directive, ElementRef, HostListener, Renderer2, HostBinding, ViewChild } from '@angular/core';

@Directive({
  selector: '[appLoginControl]'
})
export class LoginControlDirective {


  constructor(private el: ElementRef, private renderer: Renderer2) { }

  
  @HostListener('mouseover') mouseOver(){
    this.renderer.addClass(this.el.nativeElement, 'focus-mensaje');
  }

  @HostListener('mouseleave') mouseLeave(){
    this.renderer.removeClass(this.el.nativeElement, 'focus-mensaje');
  }
 

}
