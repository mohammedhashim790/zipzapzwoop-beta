import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppAnimations, printer, windowTnCKey} from "./Bloc/AppHelper";
import * as AOS from 'aos';
import {EmailEpitome, Emailer, SesData} from "./Bloc/Emailer/Emailer";
import {FloatingWidgetComponent} from "./Directives/floating-widget/floating-widget.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations:AppAnimations
})
export class AppComponent{

  @ViewChild("ReviewBox") reviewBox:FloatingWidgetComponent | any;
  @ViewChild("OkayReview") okayText:HTMLSpanElement | any;


  title = 'ZipZapZwoop';

  tncAccepted:boolean = true;

  reviewForm:FormGroup = new FormBuilder().group({
    'name':new FormControl('',[]),
    'message':new FormControl('',[Validators.required])
  });

  private emailer:Emailer = Emailer.getInstance();

  constructor() {
    AOS.init();

    let tnc = window.localStorage.getItem(windowTnCKey);
    if(tnc == null){
      this.tncAccepted = false;
    }
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

}
