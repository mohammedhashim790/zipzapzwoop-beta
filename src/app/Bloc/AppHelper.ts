import {Injectable} from "@angular/core";
import {v4 as uuidv4} from "uuid";
import {v5 as uuidv5} from "uuid";
import {v3 as uuidv3} from "uuid";
import {AppFilesHelper, IMap} from "./AppFilesHelper";
import {animate, group, query, state, style, transition, trigger} from "@angular/animations";
import ShortUniqueId from "short-unique-id";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";


const short = require('short-uuid');

export enum AppState{
  MAIL_SELECT,
  MAIL_VERIFY,
  MAIL_UPLOADING,
  MAIL_SENDING,
  MAIL_SCHEDULE,
  MAIL_SENT,

  LINK_SELECT,
  LINK_UPLOADING,
  LINK_SENT
}



export const windowTnCKey = "z3session";

export const duration = '250ms ease-in';

const left = [
  query(':enter, :leave', style({ }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))], {
      optional: true,
    }),
  ]),
];

const right = [
  query(':enter, :leave', style({  }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(-100%)' }))], {
      optional: true,
    }),
  ]),
];

export const AppAnimations = [
  trigger('ScaleAndDisappear',[
    transition(':leave',[
      style({
        height:'*',
        opacity:'1',
        transform:'scale(1.0)'
      }),
      animate(duration,style({
        opacity:'0',
        transform:'scale(1.2)'
      }))
    ]),
    transition(':enter',[
      style({
        opacity:'0',
        transform:'scale(1.2)'
      }),
      animate(duration,style({
        opacity:'1',
        transform:'scale(1.0)'
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
  trigger('flyInOut', [
    state('in', style({ transform: 'translateX(0)' })),
    transition('void => *', [
      style({ transform: 'translateX(-100%)' }),
      animate(duration)
    ]),
    transition('* => void', [
      animate(duration, style({ transform: 'translateX(100%)' }))
    ])
  ]),
  trigger('openClose', [
    state("*<=>*",style({
      height:'*',
      width:'*'
    })),
    transition(':increment', right),
    transition(':decrement', left),
  ]),
  trigger("fadeInOut",[
    transition("* => void",[
      style({
        opacity:1
      }),
      animate(duration, style({
        opacity:0
      }))
    ]),
    transition("void => *",[
      style({
        opacity:0
      }),
      animate(duration, style({
        opacity:1
      }))
    ])
  ])
]

export abstract class AppHelper{

  // SEQUENTIAL FILE LIMIT
  // WHEN FOLDER IS DROPPED OR UPLOADED, ITS SUB DIRECTORIES MUST LESS THAN 150 NOS.
  SeqFilesLimit: number = 3500;
  get bytesInGigaBytes(): number {
    return this._bytesInGigaBytes;
  }
  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }


  private _url:string = environment.emailApi;

  private readonly translator = short();
  private readonly shortUuid = new ShortUniqueId({length:10});

  constructor() {
  }


  public getUUIDOf126(){
    let webSession = uuidv4();
    let webSession3 = uuidv4();
    return uuidv5(webSession,webSession3) + "-" + uuidv5(webSession,webSession3);
    // return uuidv4() + "-" + uuidv4();
  }

  public getShortUUID(){
    return this.shortUuid();
  }

  public range(n:number){
    return Array(n).fill(0).map((value, index) => index);
  }

  //2GB
  private readonly _bytesInGigaBytes:number = (2**30) * 3 ;

  //5GB
  // private readonly _bytesInGigaBytes:number = (2**30) * 5 ;
  // private readonly _bytesInGigaBytes:number = 5368709120;


  public readonly expiryDay:number = 7;


  public getSizeInWords(size: number | any) {
    if(size<(1024**2)){
      return `${Math.round((size / (1024))*100) / 100} Kb`
    }
    else if(size<(1024**3)){
      return `${Math.round((size / (1024**2))* 100) / 100} Mb`
    }else{
      return `${Math.round((size / (1024**3))* 100) / 100} Gb`
    }
  }

  public getTotalSizeRemaining(nums:Array<IMap>){
    let diff =  this._bytesInGigaBytes - this.getTotalSize(nums);
    return this.getSizeInWords(diff);
  }

  public getTotalSize(nums:Array<IMap>){
    return nums.reduce((sum, value)=>sum+value.getSize(),0);
  }

  addDate(date1:Date ,date2:Date | number){
    if(date2 instanceof Date){
      date1.setDate(date1.getDate() + date2.getDate());
    }else{
      date1.setDate(date1.getDate() + date2);
    }
    return date1;
  }

  getExpiryDate(){
    return this.ConvertToEpochInSeconds((this.addDate(new Date(),this.expiryDay).getTime()));
  }

  ConvertToEpochInSeconds(value:number){
    return Math.floor(value/1000);
  }

  getDownloadUrl(SessionId: string) {
    if(environment.production)
      return `${window.location.hostname}/download?id=${SessionId}&redirect=true&notify=true`;
    return `${window.location.host}/download?id=${SessionId}&redirect=true&notify=true`;
  }

  DownloadName() {
    return "zipzapzwoop_transfer_" + new Date(Date.now()).toLocaleDateString().replace("/","_");
  }

}


export class printer{
  static print(message:any){
    if(!environment.production){
      console.debug(message);
    }
  }
}
