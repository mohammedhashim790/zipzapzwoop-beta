import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {AppState, printer} from "../../Bloc/AppHelper";
import {AcknowledgeEmailParams, Emailer, ErrorCode, VerifyEmailParams} from "../../Bloc/Emailer/Emailer";
import {AppSession} from "../../Bloc/Session/Session";


enum VerificationState{
  UNVERIFIED,
  VERIFICATION_IN_PROGRESS,
  VERIFIED
}

@Component({
  selector: 'verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  code: FormControl = new FormControl('',
    [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),Validators.pattern("[0-9]")
    ]);

  counter:number = 60;
  private timer: NodeJS.Timeout | any;


  private emailHelper = Emailer.getInstance();
  // appSession = AppSession.getInstance();

  verificationState:VerificationState = VerificationState.UNVERIFIED;
  VerificationState = VerificationState;
  private verifyEmailParams!: VerifyEmailParams;


  constructor(public appSession:AppSession) {
    this.startResendOtpInterval();
  }

  ngOnInit(): void {
    this.sendOtp();
  }

  onlyNumberKey(event: KeyboardEvent) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  validateOtp() {
    // this.code.setErrors({'invalid':true});
    //TODO
    // CHECK FOR ERRORS IN CODE
    // VERIFIED
    // MOVE TO MAIL UPLOAD
    // this.appHelper.appState = AppState.MAIL_UPLOADING;
    this.verificationState = this.VerificationState.VERIFICATION_IN_PROGRESS;
    this.verifyEmailParams = {
      ...this.verifyEmailParams,
      code:this.code.value
    }
    let params = (this.emailHelper.CreateVerifyEmailBody(this.verifyEmailParams));
    this.emailHelper.sendFileEmail(params).toPromise().then((response)=>{
      if(response!=undefined){
        printer.print(response);
        let result = response as any;
        let statusCode = result["message"]["response"]["statusCode"];
        printer.print(statusCode);
        if(result["message"]["success"] == true && statusCode == 200){
          this.verificationState = this.VerificationState.VERIFIED;
          this.appSession.appState = AppState.MAIL_UPLOADING;
          printer.print("User Verified");
        }else{
          this.verificationState = this.VerificationState.UNVERIFIED;
          if(statusCode == ErrorCode.INVALID_CODE){
            this.code.setErrors({'invalid':true});
          }else if(statusCode == ErrorCode.INVALID_ACCESS || statusCode == ErrorCode.SESSION_EXPIRED){
            this.code.setErrors({'expired':true});
          }
          // setTimeout(())
          // this.code.setErrors({'invalid':true});
        }
      }
    })
  }

  resendOtp(){
    if(this.counter <= 0){
      this.sendOtp();
      this.counter = 60;
      this.startResendOtpInterval();
    }
  }

  private startResendOtpInterval() {
    this.timer = setInterval(()=> {
      if(this.counter<=0){
        clearInterval(this.timer);
      }
      this.counter--;
    },1000);
  }

  async sendOtp() {
    let params: AcknowledgeEmailParams = {
      emailId: this.appSession.appTransferParams.fromAddress.value,
      // emailId: "mohammedhashim790@gmail.com",
      sessionId: this.appSession.sessionId
    }
    let emailParams = this.emailHelper.CreateAcknowledgementEmailBody(params);
    printer.print(emailParams);
    this.emailHelper.sendFileEmail(emailParams).toPromise().then((res)=>{
      if(res!=undefined){
        printer.print(res);
        let result = res as any;
        printer.print(result);
        if(result["result"] == true)
          this.verifyEmailParams = result["message"]["response"] as VerifyEmailParams;
          printer.print(this.verifyEmailParams);
      }
    }).catch((error)=>{
      console.error("error");
      console.error(error);
    })
  }
}
