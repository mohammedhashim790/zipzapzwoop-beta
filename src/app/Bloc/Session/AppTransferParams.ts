import {FormControl, Validators} from "@angular/forms";
import {PasswordHelper} from "./Session";
import {EmailParams} from "../Emailer/Emailer";
import {AppState, printer} from "../AppHelper";
import {Epoch} from "aws-sdk/clients/ecr";


export class AppTransferParams{
  recipients: Array<string> = [];
  passwordHelper = new PasswordHelper();
  fromAddress:FormControl = new FormControl('',[Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
  content:string = '';
  title: string = '';
  recipient:FormControl = new FormControl('',[Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
  body: string = '';


  scheduleTransfer:boolean = false;
  scheduledAt:Epoch = 0;


  isValid(appState:AppState) {
    printer.print("state");

    if(this.recipients.length == 0 && this.recipient.valid){
      this.recipients.push(this.recipient.value);
      this.recipient.reset()
    }

    if(appState == AppState.LINK_SELECT){
      return (
        this.passwordHelper.isValid()
      );
    }else{
      return (
        this.passwordHelper.isValid() &&
        this.fromAddress.valid &&
        this.recipients.length>0
      );
    }
  }

}
