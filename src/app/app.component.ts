import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppAnimations, AppHelper, AppState, printer, windowTnCKey} from "./Bloc/AppHelper";
import * as AOS from 'aos';
import {EmailEpitome, Emailer, SesData} from "./Bloc/Emailer/Emailer";
import {environment} from "../environments/environment";
import {AppSession} from "./Bloc/Session/Session";
import {FloatingWidgetComponent} from "./Directives/floating-widget/floating-widget.component";


declare interface Window {
  adsbygoogle: any[];
}

declare var adsbygoogle: any[];


var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e:any) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e:any) {
  // @ts-ignore
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
  return true;
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  (window as any).addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; }
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {

  var element = document.getElementById("ViewPort");

  element!.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  element!.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  element!.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  element!.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  var element = document.getElementById("ViewPort");

  element!.removeEventListener('DOMMouseScroll', preventDefault, false);
  element!.removeEventListener(wheelEvent, preventDefault);
  element!.removeEventListener('touchmove', preventDefault);
  element!.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./app.component.scss'],
  animations:AppAnimations
})
export class AppComponent implements OnInit,AfterViewInit{

  @ViewChild("ReviewBox") reviewBox:FloatingWidgetComponent | any;
  @ViewChild("OkayReview") okayText:HTMLSpanElement | any;

  @ViewChild("ViewPort3") ViewPort3!:ElementRef;
  @ViewChild("ViewPort4") ViewPort4!:ElementRef;




  title = 'ZipZapZwoop';

  tncAccepted:boolean = true;

  scrollViewIndex = 1;

  reviewForm:FormGroup = new FormBuilder().group({
    'name':new FormControl('',[]),
    'message':new FormControl('',[Validators.required])
  });

  private emailer:Emailer = Emailer.getInstance();

  appHelper:AppHelper = new class extends AppHelper {};

  ParitallyInViewPort(bounding:ElementRef,percentVisible:number = 5){
    let
      rect = bounding.nativeElement.getBoundingClientRect(),
      windowHeight = (window.innerHeight || document.documentElement.clientHeight);

    return !(
      Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)) < percentVisible ||
      Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
    )
  }


  constructor(public appSession:AppSession) {
    AOS.init();

    let tnc = window.localStorage.getItem(windowTnCKey);
    if(tnc == null){
      this.tncAccepted = false;
    }



  }

  ngOnInit() {
    setTimeout(()=>{
      try{
        ((window as any)['adsbygoogle'] = (window as any)['adsbygoogle'] || []).push({});
        (adsbygoogle = (window as any)['adsbygoogle'] || []).push({});
      }catch(e){
        console.error("error");
        console.error(e);
      }
    },2000);
  }

  ngAfterViewInit() {
    // disableScroll()

  }


  Accepted() {
    window.localStorage.setItem(windowTnCKey,"accepted");
    this.tncAccepted = true;
  }

  onDragEnter(event: DragEvent) {
    event!.dataTransfer!.effectAllowed = "all";
    event!.dataTransfer!.dropEffect = "move";
    event.preventDefault();
    let element = (document.getElementById("drop-zoned") as HTMLDivElement);
    element.style.visibility = "visible";
    printer.print("Entered");
  }

  SendReview() {
    this.okayText = document.getElementById("OkayReview") as HTMLSpanElement;
    if(this.reviewForm.valid){
      printer.print(this.reviewForm.value);
      let params:SesData = {
        SesData:{
          EmailEpitome:EmailEpitome.REVIEW,
          SendReviewParams:this.reviewForm.value,
          RequestTime:new Date(Date.now()).toISOString()
        },
      }
      this.emailer.sendFileEmail(params).toPromise().then((res)=>{
        printer.print(res);

      });
      this.okayText.style.display = "block";
      setTimeout(()=>{
        this.reviewForm.reset();
        this.reviewBox.CloseWindow();
      },2500);
    }
  }

  TextClick() {
    printer.print("Test CLick");

    document.getElementById("ViewPort2")!.scrollIntoView();

  }

  openWindow(url: string) {
    window.open(environment.we+url);
  }

  LinkView() {
    this.appSession.appState = AppState.LINK_SELECT;
  }

  MailView() {
    this.appSession.appState = AppState.MAIL_SELECT;
  }

  OnScroll(event:any) {

    // console.log(this.ViewPort3.nativeElement)
    // if(this.ParitallyInViewPort(this.ViewPort3)){
    //   this.appSession.appState = AppState.LINK_SELECT;
    // }else{
    //   this.appSession.appState = AppState.MAIL_SELECT;
    // }
    //
    // if(!this.appSession.appTransferParams.passwordHelper.passwordEnabled)
    //   this.appSession.appTransferParams.passwordHelper.passwordEnabled = this.ParitallyInViewPort(this.ViewPort4);

  }

}
