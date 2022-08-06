 import {Component, OnInit} from '@angular/core';
import {AppHelper, AppState} from "../../Bloc/AppHelper";
import {animate, style, transition, trigger} from "@angular/animations";
 import {AppSession} from "../../Bloc/Session/Session";

const duration = '500ms ease-in';

@Component({
  selector: 'schedule-transfer',
  templateUrl: './schedule-transfer.component.html',
  styleUrls: ['./schedule-transfer.component.css'],
  animations:[
    trigger('SlideLeftRight',[
      transition(':leave',[
        style({
          opacity:'1',
          transform :'translateX(*)'
        }),
        animate(duration,style({
          opacity:'0',
          transform :'translateX(-200%)'
        }))
      ]),
      transition(':enter',[
        style({
          opacity:'0',
          transform :'translateX(200%)'
        }),
        animate(duration,style({
          opacity:'1',
          transform :'translateX(*)'
        }))
      ]),
      transition('void => *',[
        style({
          height:'*',
          opacity:'0',
          transform :'translateX(70%)'
        }),
        animate(duration,style({
          opacity:'1',
          transform :'translateX(0%)'
        }))
      ]),
      transition('* => void',[
        style({
          height:'*',
          opacity:'1',
          transform :'translateY(0)'
        }),
        animate(duration,style({
          opacity:'0',
          'max-height':'0',
          transform :'translateY(-70%)'
        }))
      ]),

    ]),
    trigger('SlideUpDown',[
      transition(':leave',[
        style({
          height:'*',
          opacity:'1',
          'max-height':'70px',
        }),
        animate(duration,style({
          opacity:'0',
          'max-height':'0',
        }))
      ]),
      transition(':enter',[
        style({
          height:'*',
          opacity:'0',
          'max-height':'0',
        }),
        animate(duration,style({
          opacity:'1',
          'max-height':'70px',
        }))
      ]),

    ]),
  ]
})
export class ScheduleTransferComponent implements OnInit {
  timeSelected: boolean = false;
  AppState = AppState;

  appHelper:AppHelper = new class extends AppHelper {};

  constructor(public appSession:AppSession) { }

  ngOnInit(): void {
  }

  range(n: number) {
    return this.appHelper.range(n);
  }

  hrsRange() {
    return this.range(24).map(value => {
      if(value<10)
        return `0${value}`;
      return `${value}`;
    });
  }
  minRange(){
    return this.range(5).map((value, index) => {
      if(index == 0)
        return '00';
      return (index*15);
    })
  }

  ProceedToNext() {
    this.appSession.appState = AppState.MAIL_VERIFY;
  }
}
