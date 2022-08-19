import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {printer} from "../../Bloc/AppHelper";


const animatedTimingFunction = "500ms ease-in-out"

@Component({
  selector: 'floating-widget',
  templateUrl: './floating-widget.component.html',
  styleUrls: ['./floating-widget.component.css'],
  animations:[
    trigger('onOpen',[
      transition(':enter',[
        style({
          opacity: 0,
          transform:'translateY(-10px)'
        }),
        animate(animatedTimingFunction,style({
          opacity: 1,
          transform:'translateY(0px)'
        }),)
      ]),
      transition(':leave',[
        style({
          opacity: 1,
          transform:'translateY(0px)'
        }),
        animate(animatedTimingFunction,style({
            opacity: 0,
            transform:'translateY(-10px)'
          })
        )
      ]),
    ])
  ]
})
export class FloatingWidgetComponent implements OnInit {

  showing:boolean = false;

  @Input() widgetTitle:string = 'Widget Title';

  @Input() showOnStart:boolean = false;

  @Output() onClose:EventEmitter<any> = new EventEmitter<any>();
  @Output() onShow:EventEmitter<any> = new EventEmitter<any>();
  @Output() onHide:EventEmitter<any> = new EventEmitter<any>();


  disabled = false;

  constructor() { }

  ngOnInit(): void {
    this.showing = this.showOnStart;
  }

  trigger(){
    if(!this.showing)
      this.Show()
    else
      this.Hide();
  }

  Show(){
    printer.print("Show");
    this.showing = true;
    this.onShow.emit();
  }

  Hide(){
    printer.print("Destroyed");
    this.showing = false;
    this.onHide.emit();
  }

  Disable(){
    this.disabled = true;
  }
  Enable(){
    this.disabled = false;
  }

  CloseWindow(){
    this.onClose.emit();
    this.Hide();
  }

}
