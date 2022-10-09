import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[ScrollOnView]'
})
export class ScrollOnViewDirective {

  @HostListener("window:scroll",["$event"])
  OnScroll(){
    var bounding = this.elementRef.nativeElement.getBoundingClientRect();
    if (bounding.top >= 0 && bounding.left >= 0 &&
      bounding.right <= window.innerWidth &&
      bounding.bottom <= window.innerHeight) {
      console.log('Element is in the viewport!');
      if(!this.viewIn)
        this.OnViewAvailable();
    }else{
      if(this.viewIn)
        this.OnViewAway();
    }
  }

  private viewIn:boolean = false;

  @Input() animatorName:string='';
  @Input() duration:number=0;

  @Input() animationClassName:string = '';

  @Output() onViewAvailable:EventEmitter<any> = new EventEmitter<any>();
  @Output() onViewAway:EventEmitter<any> = new EventEmitter<any>();


  constructor(private elementRef:ElementRef) {
    console.log(this.elementRef)
  }

  private OnViewAvailable() {
    this.viewIn = true;
    this.elementRef.nativeElement.classList.add(this.animationClassName);
    this.onViewAvailable.emit()
  }

  private OnViewAway() {
    this.viewIn = false;
    this.elementRef.nativeElement.classList.remove(this.animationClassName);
    this.onViewAway.emit()

  }
}
