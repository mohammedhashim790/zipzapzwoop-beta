import { Component, OnInit } from '@angular/core';
import {AppHelper, AppState} from "../../Bloc/AppHelper";
import {AppSession} from "../../Bloc/Session/Session";
import {Router} from "@angular/router";


@Component({
  selector: 'transfer-sent',
  templateUrl: './transfer-sent.component.html',
  styleUrls: ['./transfer-sent.component.css']
})
export class TransferSentComponent implements OnInit {
  AppState = AppState;


  public get sessionLink(){
    return `${window.location.href.split("http://")[1]}${this.appSession.sessionLink}`;
  }

  constructor(public appSession:AppSession,private router:Router) {

  }

  ngOnInit(): void {
  }

  ChangeState() {
    this.appSession.CreateNewSession();
    this.appSession.appState = AppState.MAIL_SELECT;
  }

  CopyToClipBoard(event: any) {
    console.log(event);
    console.log("Copied");
  }
}
