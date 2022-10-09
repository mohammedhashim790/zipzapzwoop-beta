import {FormControl, Validators} from "@angular/forms";
import {AppHelper, AppState, printer} from "../AppHelper";
import {v4 as uuidv4} from 'uuid';
import {DeliveryTransferEmailParams, EmailEpitome, EmailParams, SesData} from "../Emailer/Emailer";
import {Injectable} from "@angular/core";
import {AppTransferParams} from "./AppTransferParams";
import {AppFilesHelper} from "../AppFilesHelper";


export class PasswordHelper{
  passwordEnabled:boolean = false;


  password:FormControl = new FormControl('',[Validators.required]);

  constructor() {
  }

  togglePassword() {
    this.passwordEnabled = !this.passwordEnabled;
  }

  isValid(){
    if(this.passwordEnabled){
      return this.password.valid;
    }
    return true;
  }
}

@Injectable()
export class AppSession{

  AppState = AppState;

  appHelper:AppHelper = new class extends AppHelper {};

  sessionLink:string = "";

  sessionId:string;

  public appState: AppState;

  public appTransferParams:AppTransferParams;
  public appFileTransfer: AppFilesHelper;
  formSubmitted: boolean = false;


  constructor() {
    this.sessionId = this.UUIDV4();
    this.appState = AppState.MAIL_SELECT;
    this.appTransferParams = new AppTransferParams();
    this.appFileTransfer = new AppFilesHelper();
  }


  CreateNewSession(){
    this.sessionId = this.UUIDV4();
    this.appTransferParams = new AppTransferParams();
    this.appFileTransfer = new AppFilesHelper();
  }

  UUIDV4(){
    return uuidv4();
  }


  getEmailParams():EmailParams{
    if(this.appTransferParams.passwordHelper.password.value!=""){
      this.appTransferParams.passwordHelper.passwordEnabled = true;
    }
    let params:EmailParams = {
      fromAddress:this.appTransferParams.fromAddress.value,
      recipients:this.appTransferParams.recipients,
      SessionId:this.sessionId,
      body:this.appTransferParams.body,
      passwordEnabled:this.appTransferParams.passwordHelper.passwordEnabled,
      password:this.appTransferParams.passwordHelper.password.value,
      title:this.appTransferParams.title,
      DownloadUrl:this.appHelper!.getDownloadUrl(this.sessionId),
    }

    return params;
  }

  isValid(){
    printer.print("Form Submitted");
    this.formSubmitted = true;
    setTimeout(()=>{
      this.formSubmitted = false;
    },5000)
    return this.appTransferParams.isValid(this.appState) && this.appFileTransfer.isValid();
  }

  CreateTransferEmailBody(emailParams:EmailParams){
    let expiryDate = new Date();
    expiryDate.setDate(new Date().getDate() + this.appHelper.expiryDay);

    let deliveryEmailParams:DeliveryTransferEmailParams = {
      SessionId: emailParams.SessionId,
      MailInfo: {
        FromEmail: emailParams.fromAddress,
        Recipients: emailParams.recipients,
        Cc: [],
        Bcc: [],
        Subject: `${emailParams.fromAddress} has shared files with you`,
        Title: emailParams.title,
        Message: emailParams.body
      },
      passwordEnabled: emailParams.passwordEnabled,
      DownloadUrl:emailParams.DownloadUrl,
      password: emailParams.password,
      FileParams:{
        Password: emailParams.password,
        PasswordEnabled: emailParams.passwordEnabled,
        FilesLength:this.appFileTransfer.files.flat().length,
        Expiry: expiryDate,
        FilesSize:this.appHelper.getSizeInWords(this.appHelper.getTotalSize(this.appFileTransfer.files))
      }
    };

    let params:SesData;

    // if(this.appTransferParams.scheduleTransfer && this.appTransferParams.scheduledAt!=0){
    //   params = {
    //     SesData:{
    //       EmailEpitome:EmailEpitome.SCHEDULE,
    //       ScheduleDeliveryTransferEmailParams: {
    //         ScheduledAt: this.appTransferParams.scheduledAt,
    //         TransferSent:false,
    //         EmailParams:deliveryEmailParams
    //       },
    //       RequestTime:new Date(Date.now()).toISOString()
    //     }
    //   }
    // }else{
      params = {
        SesData:{
          EmailEpitome:EmailEpitome.DELIVERY,
          DeliveryTransferEmailParams: deliveryEmailParams,
          RequestTime:new Date(Date.now()).toISOString()
        }
      }
    // }

    return params;
  }

}
