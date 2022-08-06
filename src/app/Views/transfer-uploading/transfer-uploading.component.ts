import {Component, OnInit} from '@angular/core';
import {AppHelper, AppState} from "../../Bloc/AppHelper";
import {StorageHelper} from "../../Bloc/Storage/Storage";
import {AppFilesHelper} from "../../Bloc/AppFilesHelper";
import {CreateSession, S3ObjectParams} from "../../Bloc/API/API";
import {CreateSessionInput, LinkInfoInput, MailInfoInput} from "../../API.service";
import {MailInfo, Session} from "../../../models";
import {AppSession} from "../../Bloc/Session/Session";
import {Router} from "@angular/router";
import {DeliveryTransferEmailParams, Emailer} from "../../Bloc/Emailer/Emailer";


export enum TransferUploadState{
  ENGINE_STARTING,
  ENGINE_STARTED,
  ENGINE_STOPPED,
  COMPRESSING_OBJECTS,
  ENGINE_CORRUPTED,
}

@Component({
  selector: 'transfer-uploading',
  templateUrl: './transfer-uploading.component.html',
  styleUrls: ['./transfer-uploading.component.css']
})
export class TransferUploadingComponent implements OnInit {
  get state(): TransferUploadState {
    return this._state;
  }

  set state(value: TransferUploadState) {
    this._state = value;
  }
  leftPosition: number = 0;

  totalFiles:number = 1;

  private shortUrl:string = "";

  appHelper:AppHelper = new class extends AppHelper {};

  private _state:TransferUploadState = TransferUploadState.ENGINE_STARTING;
  TransferUploadState = TransferUploadState;
  private fileProgress:Array<number> = [];

  private emailer:Emailer = Emailer.getInstance();
  // StorageProcess = StorageProcess;

  constructor(public appSession:AppSession,
              private router:Router,
              public storageHelper:StorageHelper) {

  }

  ngOnInit(): void {
    this.storageHelper.reset();
    this.state = TransferUploadState.ENGINE_STARTING;
    this.OnStart();
  }

  private async OnStart() {
    try{
      let data = this.appSession.appFileTransfer.files.map((file)=>file.files);
      console.log("Files to upload");
      console.log(data.flat().length);
      this.totalFiles = data.flat().length;
      let sessionId = await this.CreateSessionApi(data.flat());
      this._state = TransferUploadState.ENGINE_STARTED;
      let files = data.flat();

      let res = await this.storageHelper.UploadObjects(
        data.flat(),
        sessionId?.id
      );
      console.log("Uploaded and the session ID is : ");
      console.log(sessionId?.id);
      this.ProceedToNext();

    }catch (e){
      console.error(e);
      this._state = TransferUploadState.ENGINE_CORRUPTED;
    }
  }

  getProgress(){
    // console.log(`${value}%`);
    let value = this._getProgress();
    return `${Math.floor(value*100)}%`;
  }

  _getProgress(){
    return this.storageHelper.getCurrentProgress() / this.totalFiles
  }


  getBorderWidth() {
    let value = Math.floor((this._getProgress()));
    if(Math.round(value*100)<25){
      return "4px dashed";
    }else if(Math.round(value*100)<50){
      return "3px dashed";
    }else if(Math.round(value*100)<90){
      return "2px dashed";
    }else{
      return "2px solid"
    }
  }

  private async CreateSessionApi(files: Array<File>) {
    let s3Objects = files.map((file => new S3ObjectParams(file.name,file.webkitRelativePath)));
    // let s3Objects = files.map((file => new S3ObjectParams(file.webkitRelativePath,file.webkitRelativePath)));
    let sessionParams: CreateSessionInput;
    if(this.appSession.appState == AppState.LINK_UPLOADING) {
      this.shortUrl = this.appHelper.getShortUUID();
      this.appSession.sessionLink = this.shortUrl;
      let linkInfo:LinkInfoInput = {
        Title:this.appSession.appTransferParams.title,
        Message:this.appSession.appTransferParams.body
      }
      sessionParams = {
        id:this.appSession.sessionId,
        files: s3Objects,
        password: (this.appSession.appTransferParams.passwordHelper)?this.appSession.appTransferParams.passwordHelper.password.value:"",
        passwordProtected:this.appSession.appTransferParams.passwordHelper.passwordEnabled,
        shortUrl:this.shortUrl,
        linkInfo:linkInfo
      };
    }else{
      let mailInfo:MailInfoInput = {
        FromEmail:this.appSession.appTransferParams.fromAddress.value,
        Recipients:this.appSession.appTransferParams.recipients,
        Subject:this.appSession.appTransferParams.fromAddress.value + " has shared files with you.",
        Title:this.appSession.appTransferParams.title,
        Message:this.appSession.appTransferParams.body
      }
      sessionParams = {
        id:this.appSession.sessionId,
        files:s3Objects,
        password:(this.appSession.appTransferParams.passwordHelper)?this.appSession.appTransferParams.passwordHelper.password.value:"",
        passwordProtected:this.appSession.appTransferParams.passwordHelper.passwordEnabled,
        mailInfo:mailInfo
      }
    }
    let session = (await CreateSession(sessionParams));
    this.appSession.sessionId = session.data.createSession.id;
    return session.data.createSession as Session;
  }

  getProgressCompleted() {
    let current = (this._getProgress());
    let value = this.storageHelper.totalInBytes * current;
    return `${
      this.appHelper.getSizeInWords(value)}
    of ${this.appHelper.getSizeInWords(this.storageHelper.totalInBytes)} completed`
  }

  private async ProceedToNext() {
    setTimeout(async () => {
      if (this.appSession.appState == AppState.MAIL_UPLOADING) {
        console.log(this.appSession.getEmailParams());
        let email = this.emailer.CreateTransferEmailBody(this.appSession.getEmailParams());
        console.log(email);
        await this.emailer.sendFileEmail(email).toPromise().then((res)=>{
          console.debug(res);
          console.log("Mail Sent");
        });
        this.appSession.appState = AppState.MAIL_SENT;
      } else if (this.appSession.appState == AppState.LINK_UPLOADING)
        this.appSession.appState = AppState.LINK_SENT;
    },2500);
  }
}
