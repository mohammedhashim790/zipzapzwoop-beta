import {Directive, ElementRef, EventEmitter, HostListener, OnChanges, Output, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[ActivateWhenViewOnTop]'
})
export class ViewOnTopDirective implements OnChanges{


  @Output() OnTop:EventEmitter<any> = new EventEmitter<any>();
  @Output() OnAway:EventEmitter<any> = new EventEmitter<any>();


  @HostListener("mouseenter")
  OnMouseOver(){
    if(this.elementRef.nativeElement!.getBoundingClientRect().top <=100)
      this.OnTop.emit();
    else
      this.OnAway.emit();
  }

  @HostListener("mouseleave")
  OnMouseAway(){
    if(this.elementRef.nativeElement!.getBoundingClientRect().top >=100)
      this.OnAway.emit();
    else
      this.OnTop.emit();
  }


  ngOnChanges(changes: SimpleChanges) {
  }

  constructor(private elementRef:ElementRef) {
    console.log("Available")
    console.log(elementRef);
  }

}
