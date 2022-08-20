import {Component, OnInit} from '@angular/core';
import {AppHelper, AppState, printer} from "../../Bloc/AppHelper";
import {StorageHelper} from "../../Bloc/Storage/Storage";
import {CreateSession, S3ObjectParams} from "../../Bloc/API/API";
import {CreateSessionInput, LinkInfoInput, MailInfoInput} from "../../API.service";
import {Session} from "../../../models";
import {AppSession} from "../../Bloc/Session/Session";
import {Router} from "@angular/router";
import {Emailer} from "../../Bloc/Emailer/Emailer";
import {AppError, AppErrorCode} from "../../Bloc/AppErrors/AppError";


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
    this.state = TransferUploadState.ENGINE_CORRUPTED;
  }

  ngOnInit(): void {
    this.storageHelper.reset();
    this.state = TransferUploadState.ENGINE_STARTING;
    // this.state = TransferUploadState.ENGINE_STARTED;
    this.OnStart();
  }

  private async OnStart() {
    try{
      let data = this.appSession.appFileTransfer.files.map((file)=>file.files);
      if(data.length == 0)
        throw new AppError(AppErrorCode.NO_FILES_AVAILABLE,"File list is empty")
      printer.print("Files to upload");
      printer.print(data.flat().length);
      this.totalFiles = data.flat().length;

      let files = this.flattenArray(data);


      let sessionId = await this.CreateSessionApi(files);


      this._state = TransferUploadState.ENGINE_STARTED;

      printer.print("Unsorted");
      printer.print(files);

      files = files.sort((file1,file2)=> file1.size - file2.size);

      printer.print("sorted");
      printer.print(files);

      let res = await this.storageHelper.UploadObjects(
        files,
        sessionId?.id
      );
      printer.print("Uploaded and the session ID is : ");
      printer.print(sessionId?.id);
      this.ProceedToNext();

    }catch (e){
      console.error(e);
      this._state = TransferUploadState.ENGINE_CORRUPTED;
    }
  }

  flattenArray(arr:Array<any>):Array<any> {
    return arr.reduce((flat, toFlatten) => {
      return flat.concat(Array.isArray(toFlatten) ? this.flattenArray(toFlatten) : toFlatten);
    }, []);
  }

  getProgress(){
    let value = this._getProgress();
    // let value = 0.5;
    return `${Math.floor(value*100)}`;
  }

  _getProgress(){
    return this.storageHelper.TotalProgress/this.storageHelper.totalSize;
    // return this.storageHelper.getCurrentProgress() / this.totalFiles
  }


  getBorderWidth() {
    let value = (this._getProgress());
    printer.print("Border Width  " + Math.round(value*100)) ;
    if(Math.round(value*100)<25){
      return "4px dashed !important";
    }else if(Math.round(value*100)<50){
      return "3px dashed !important";
    }else if(Math.round(value*100)<90){
      return "2px dashed !important";
    }else{
      return "2px solid !important"
    }
  }

  private async CreateSessionApi(files: Array<File>) {
    let s3Objects = files.map((file =>
      new S3ObjectParams(file.name,file.webkitRelativePath,file.size.toString())));
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
        fileSize:this.appHelper.getTotalSize(this.appSession.appFileTransfer.files).toString(),
        password: (this.appSession.appTransferParams.passwordHelper)?this.appSession.appTransferParams.passwordHelper.password.value:"",
        passwordProtected:this.appSession.appTransferParams.passwordHelper.passwordEnabled,
        shortUrl:this.shortUrl,
        expiry:this.appHelper.getExpiryDate(),
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
        fileSize:this.appHelper.getTotalSize(this.appSession.appFileTransfer.files).toString(),
        password:(this.appSession.appTransferParams.passwordHelper)?this.appSession.appTransferParams.passwordHelper.password.value:"",
        passwordProtected:this.appSession.appTransferParams.passwordHelper.passwordEnabled,
        expiry:this.appHelper.getExpiryDate(),
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
        this.appSession.appTransferParams.scheduleTransfer = false;
        if(this.appSession.appTransferParams.scheduleTransfer){
          printer.print("Sending Instant Mail");
        }else{
          printer.print("Mail Scheduled at " + this.appSession.appTransferParams.scheduledAt);
        }
        let email = this.appSession.CreateTransferEmailBody(this.appSession.getEmailParams());
        printer.print(JSON.stringify(email));
        await this.emailer.sendFileEmail(email).toPromise().then((res)=>{
          printer.print(res);
          printer.print("Transfer Created");
        });
        this.appSession.appState = AppState.MAIL_SENT;
      } else if (this.appSession.appState == AppState.LINK_UPLOADING)
        this.appSession.appState = AppState.LINK_SENT;
    },2500);
  }
}
