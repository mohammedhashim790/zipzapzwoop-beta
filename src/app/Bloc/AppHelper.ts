import {Injectable} from "@angular/core";
import {v4 as uuidv4} from "uuid";
import {v5 as uuidv5} from "uuid";
import {v3 as uuidv3} from "uuid";
import {AppFilesHelper, IMap} from "./AppFilesHelper";
import {animate, group, query, state, style, transition, trigger} from "@angular/animations";
import ShortUniqueId from "short-unique-id";
import {Router} from "@angular/router";



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
]

export abstract class AppHelper{
  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  // public appState: AppState;

  private _url:string = 'https://qqydelt4mb.execute-api.us-east-1.amazonaws.com/default/SampleEmailSendUsingCloudWatch';

  private readonly translator = short();
  private readonly shortUuid = new ShortUniqueId({length:10});

  constructor() {
    // this.appState = AppState.MAIL_SELECT;
    // this.appState = AppState.MAIL_VERIFY;
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

  private bytesInGigaBytes:number = 5368709120;


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

  public getTotalSize(nums:Array<IMap>){
    let diff =  this.bytesInGigaBytes- nums.reduce((sum,value)=>sum+value.getSize(),0);
    return this.getSizeInWords(diff);
  }


  public EmbedTextToWebTemplate(body:string,
                                fromAddress:string,
                                sessionId:string):string{
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title></title>
      <style type="text/css">
        .body{
          width: 100%;
          height: 100%;
          padding: 2%;
          justify-content: center;
          align-items: center;
        }

        .container{
          width: 50%;
          height: 100%;
          border-radius: 5px;
          border: none;
          justify-content: center;
          margin: auto;
          display: grid;
        }

        .container > *{
          padding: 2%;
          margin: auto;
          justify-content: center;
        }
        .title{
          font-size: 1.0rem;
          font-weight: bold;
        }
        .content{
          font-size: 1.2rem;
          background-color: wheat;
        }
        .download-button{
          padding: 2%;
          border-radius: 2em;
          background-color: darkred;
          border: none;
          color: white;
          font-size: 1.5rem;
        }

      </style>
    </head>
    <body>
      <div class="body">
        <div class="container">
          <span class="title">${fromAddress} has shared files with you</span>
          <span class="content">
            ${body}
          </span>
          <span>
            <button class="download-button">
              Download
            </button>
          </span>
          <span>
            <a href="">${sessionId}</a>
          </span>
        </div>
      </div>

    </body>
    </html>`.toString();
  }

  getDownloadUrl(SessionId: string) {
    return `${window.location.href.split("http://")[1]}/download?id=${SessionId}&redirect=true&notify=true`;
  }
}
