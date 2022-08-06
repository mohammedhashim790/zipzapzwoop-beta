import {FormControl, Validators} from "@angular/forms";
import {AppHelper, AppState} from "../AppHelper";
import {v4 as uuidv4} from 'uuid';
import {EmailParams} from "../Emailer/Emailer";
import {Injectable} from "@angular/core";
import {AppTransferParams} from "./AppTransferParams";
import {AppFilesHelper} from "../AppFilesHelper";


export class PasswordHelper{
  passwordEnabled:boolean = true;

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
    this.sessionId = uuidv4();
    this.appState = AppState.MAIL_SELECT;
    this.appTransferParams = new AppTransferParams();
    this.appFileTransfer = new AppFilesHelper();
  }


  CreateNewSession(){
    this.sessionId = uuidv4();
    this.appTransferParams = new AppTransferParams();
    this.appFileTransfer = new AppFilesHelper();
  }


  getEmailParams():EmailParams{
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
    console.log("Form Submitted");
    this.formSubmitted = true;
    setTimeout(()=>{
      this.formSubmitted = false;
    },5000)
    return this.appTransferParams.isValid(this.appState) && this.appFileTransfer.isValid();
  }

}
