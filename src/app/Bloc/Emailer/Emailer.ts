import {AppHelper} from "../AppHelper";
import {HttpClient, HttpHeaders, HttpXhrBackend} from "@angular/common/http";

export interface EmailParams{
  DownloadUrl: string;
  title: string;
  recipients:Array<string>;
  SessionId:string;
  fromAddress:string;
  body:string;
  passwordEnabled:boolean;
  password:string
}

export enum ErrorCode {
  OK=200,
  INVALID_CODE=230,
  SESSION_EXPIRED=231,
  INVALID_ACCESS=400
}

export enum EmailEpitome{
  DELIVERY = "DELIVERY",
  NOTIFY = "NOTIFY",
  ACKNOWLEDGE = "ACKNOWLEDGE",
  VERIFY = "VERIFY"
}

export interface SesData{
  SesData:{
    EmailEpitome:EmailEpitome;
    AcknowledgeEmailParams?:AcknowledgeEmailParams;
    VerifyEmailParams?:VerifyEmailParams;
    NotifyEmailParams?:NotifyEmailParams;
    DeliveryTransferEmailParams?:DeliveryTransferEmailParams;
    RequestTime: string
  }
}

export type AcknowledgeEmailParams={
  sessionId: string,
  emailId: string,
}

export type VerifyEmailParams = {
  Id: string,
  emailId: string,
  expiryDate: -1,
  sessionId: string,
  code: string,
  checkSum: string
}

export type NotifyEmailParams={
  ToAddress:string
}

export type DeliveryTransferEmailParams={
  SessionId: string,
  DownloadUrl:string,
  MailInfo: MailInfo,
  passwordEnabled: boolean,
  password: string
}

export type MailInfo={
  FromEmail: string,
  Recipients: Array<string>,
  Cc: Array<string>,
  Bcc: Array<string>,
  Subject: string,
  Title: string,
  Message: string
}

export interface ApiParams{
  "SesData": {
    "EmailEpitome": EmailEpitome,
    "AcknowledgeEmailParams": {
      "sessionId": string,
      "emailId": string,
    },
    "VerifyEmailParams":{
      "Id": string,
      "emailId": string,
      "expiryDate": -1,
      "sessionId": string,
      "code": string,
      "checkSum": string
    },
    "NotifyEmailParams": {
      "ToAddress": string
    },
    "DeliveryTransferEmailParams": {
      "SessionId": string,
      "MailInfo": {
        "FromEmail": string,
        "Recipients": Array<string>,
        "Cc": Array<string>,
        "Bcc": Array<string>,
        "Subject": string,
        "Title": string,
        "Message": string
      },
      "DownloadUrl":string,
      "passwordEnabled": boolean,
      "password": string
    },
    "RequestTime": Date
  }
}





export class Emailer{

  private static _instance:Emailer = this.getInstance();

  private http:HttpClient;
  private appHelper:AppHelper = new class extends AppHelper {};
  private constructor() {
    this.http = new HttpClient(new HttpXhrBackend({
      build: () => new XMLHttpRequest()
    }));
  }

  static getInstance(){
    if(this._instance == null){
      return new Emailer();
    }
    return this._instance;
  }

  CreateTransferEmailBody(emailParams:EmailParams){
    let params:SesData = {
      SesData:{
        EmailEpitome:EmailEpitome.DELIVERY,
        DeliveryTransferEmailParams: {
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
          password: emailParams.password
        },
        RequestTime:new Date(Date.now()).toISOString()
      }
    }

    return params;
  }

  sendFileEmail(params:SesData){
    console.log(JSON.stringify(params));
    let headers  =new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*')
    return this.http!.post(this.appHelper!.url, JSON.stringify(params), {
      headers: headers,
      }).pipe();
  }


  CreateAcknowledgementEmailBody(acknowledgeEmailParams:AcknowledgeEmailParams){
    let params:SesData = {
        SesData:{
          EmailEpitome:EmailEpitome.ACKNOWLEDGE,
          AcknowledgeEmailParams:acknowledgeEmailParams,
          RequestTime:new Date(Date.now()).toISOString()
        }
    }
    return params;
  }

  CreateVerifyEmailBody(verifyEmailParams:VerifyEmailParams){
    let params:SesData = {
      SesData:{
        EmailEpitome:EmailEpitome.VERIFY,
        VerifyEmailParams:verifyEmailParams,
        RequestTime:new Date(Date.now()).toISOString()
      }
    }
    return params;
  }

}
