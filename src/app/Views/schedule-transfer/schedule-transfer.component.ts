 import {Component, OnInit} from '@angular/core';
import {AppHelper, AppState, printer} from "../../Bloc/AppHelper";
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
  get scheduledTime(): Date {
    let current = new Date();
    current.setMinutes(current.getMinutes() + this.scheduledTimeValue);
    return this.RoundTime(current);
  }

  timeSelected: boolean = false;
  AppState = AppState;

  appHelper:AppHelper = new class extends AppHelper {};
  scheduledTimeValue: number = 0;

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
    console.debug(this.appSession.appTransferParams);
    this.appSession.appState = AppState.MAIL_VERIFY;
  }

  ScheduleTransfer(value: string) {
    let minute = Number(value);
    this.scheduledTimeValue = minute;
    this.appSession.appTransferParams.scheduledAt = minute!=0?this.appHelper.ConvertToEpochInSeconds(this.scheduledTime.getTime()):0;
    this.appSession.appTransferParams.scheduleTransfer = minute != 0;
    this.timeSelected = minute != 0;
  }

  RoundTime(currentTime:Date){
    let hour = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    currentTime.setSeconds(0);
    currentTime.setMinutes(this.RoundValue(currentTime.getMinutes()));
    return currentTime;
  }

  /**
   * Returns Round Off Value between 5 and 10
   * @param value
   * @constructor
   */
  RoundValue(value:number){
    if(value%5==0){
      return value;
    }
    let dec = value % 10;
    value = Math.floor(value / 10);
    if(dec<5){
      value*=10;
      value+=5;
    }
    else{
      value+=1;
      value*=10;
    }
    return value;
  }

  CancelTransferAndProceed() {

  }

  ScheduleTransferAndProceed() {
    this.ProceedToNext();
  }
}
