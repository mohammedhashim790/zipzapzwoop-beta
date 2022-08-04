import {EmailEpitome} from "./Emailer/EmailParams";
import {MailInfo} from "../../models";

const sesSyntax = {
  Destination: {
    CcAddresses: [
    ],
    ToAddresses: [
    ],
  },
  Message: {
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: "",
      },
      Text: {
        Charset: "",
        Data: "",
      },
    },
    Subject: {
      Charset: "UTF-8",
      Data: "",
    },
  },
  Source: "", // SENDER_ADDRESS
  ReplyToAddresses: [
  ],
};


export const apiParams = {
  "SesData": {
    "EmailEpitome": "",
    "AcknowledgeEmailParams": {
      "sessionId": "",
      "emailId": "",
    },
    "VerifyEmailParams":{
      "Id": "",
      "emailId": "",
      "expiryDate": -1,
      "sessionId": "",
      "code": "",
      "checkSum": ""
    },
    "NotifyEmailParams": {
      "ToAddress": ""
    },
    "DeliveryTransferEmailParams": {
      "SessionId": "",
      "MailInfo": {
        "FromEmail": "",
        "Recipients": [],
        "Cc": [],
        "Bcc": [],
        "Subject": "",
        "Title": "",
        "Message": ""
      },
      "DownloadUrl":"",
      "passwordEnabled": true,
      "password": ""
    },
    "RequestTime": "Date.now()"
  }
}


// https://qqydelt4mb.execute-api.us-east-1.amazonaws.com/default/SampleEmailSendUsingCloudWatch
const backUp = {
  "SesData": {
    "EmailEpitome": "DELIVERY",
    "DeliveryTransferEmailParams": {
      "SessionId": "123456789",
      "MailInfo": {
        "FromEmail": "mohammedhashim790@gmail.com",
        "Recipients": ["mohammedhashim790@gmail.com","agathachristie025@gmail.com"],
        "Cc": [],
        "Bcc": [],
        "Subject": "Test Message",
        "Title": "Test Message",
        "Message": "Hello, this is a test message from lambda email service"
      },
      "passwordEnabled": true,
      "password": ""
    },
    "RequestTime": "Date.now()"
  }
}

// export const apiParams = {
//   SesData: {
//     EmailEpitome:EmailEpitome,
//     AcknowledgeEmailParams:{
//       SessionId:"",
//       EmailAddress:"",
//     },
//     VerifyEmailParams:{
//       EmailAddress:"",
//       CheckSumHash:"",
//       Code:""
//     },
//     NotifyEmailParams:{
//       ToAddress:"",
//     },
//     DeliveryTransferEmailParams:{
//       SessionId:"",
//       MailInfo: {
//         FromEmail:"",
//         Recipients:new Array<string>(),
//         Cc:new Array<string>(),
//         Bcc:new Array<string>(),
//         Subject: "",
//         Title: "",
//         Message: ""
//       },
//       passwordEnabled:true || false,
//       password:""
//     },
//     RequestTime:Date.now()
//   }
// }
