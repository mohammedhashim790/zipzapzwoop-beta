import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppAnimations, AppHelper, printer} from "../../Bloc/AppHelper";
import {StorageHelper} from "../../Bloc/Storage/Storage";
import {API} from "aws-amplify";

import * as queries from '../../../graphql/queries';
import {APIService, GetSessionQuery, ListSessionsQuery} from "../../API.service";
import {GraphQLResult} from "@aws-amplify/api-graphql";
import {FormControl, Validators} from "@angular/forms";
import * as JSZip from "jszip";

import { downloadZip } from 'client-zip';
import * as streamSaver from 'streamsaver';

import * as expressZip from 'express';




import {saveAs} from "@progress/kendo-file-saver";
import {environment} from "../../../environments/environment";



const fs = require('fs')
const adm = require('adm-zip')

export enum DownloadTransferUIState{
  UNLOADED,
  LOADING,
  LOADED,
  NOT_FOUND,
  DOWNLOAD_PROCESSING,
  DOWNLOAD_PROCESSED
}

@Component({
  selector: 'download-transfer',
  templateUrl: './download-transfer.component.html',
  styleUrls: ['./download-transfer.component.css'],
  animations:AppAnimations
})
export class DownloadTransferComponent implements OnInit {

  id:string|null | undefined;
  redirect:boolean = false;



  transfer: GetSessionQuery | undefined;

  downloadState:DownloadTransferUIState = DownloadTransferUIState.UNLOADED;
  downloadTransferState:DownloadTransferUIState = DownloadTransferUIState.UNLOADED;

  DownloadTransferUIState = DownloadTransferUIState;
  password: FormControl = new FormControl('',[Validators.required]);
  passwordVerified: boolean = false;
  // passwordEnabled:boolean = false;
  private appHelper:AppHelper = new class extends AppHelper {};

  constructor(private routerParams:ActivatedRoute,
              private router:Router,
              private storageHelper:StorageHelper,
              ) {
    this.redirect = this.routerParams.snapshot.queryParamMap.get("redirect") == "true";
    printer.print(this.redirect);
    printer.print(this.router.url);
    if(this.redirect){
      //TODO
      // MAIL REDIRECT
      this.id = this.routerParams.snapshot.queryParamMap.get("id")
      this.readInfo(true);
    }else {
      this.id = this.router.url.replace("/","");
      // this.id = this.routerParams.snapshot.queryParamMap.get("source");
      this.readInfo(false);
    }
  }

  ngOnInit(): void {

  }

  private async readInfo(fromMail:boolean){
    try{
      let result;

      if (fromMail) {
        printer.print("Reading from Mail");
        let res = await (API.graphql({
          query: queries.getSession,
          variables: {
            id:this.id
          },
          authMode: "API_KEY"
        }) as Promise<GraphQLResult>);
        printer.print(res);
        result = ((res.data as any).getSession) as GetSessionQuery;
        this.transfer = result;
      }
      else {
        printer.print("Reading from Link");
        let res = await (API.graphql({
          query: queries.listSessions,
          variables: {
            filter: {
              shortUrl: {
                eq: this.id
              }
            }
          },
          authMode: "API_KEY"
        }) as Promise<GraphQLResult>);
        printer.print(res);
        result = ((res.data as any).listSessions) as ListSessionsQuery;
        this.transfer = result.items[0] as GetSessionQuery;
      }

      if(this.transfer?.expiry!=0 && this.transfer?.expiry!=undefined &&  this.isExpired(this.transfer!.expiry))
        throw new Error("File Expired");

      if (this.transfer!.passwordProtected == false) {
        this.passwordVerified = true;
      } else {
        if ((this.transfer!.password != "" || this.transfer!.password != null)) {
          this.passwordVerified = false;
        }
      }
      this.downloadState = DownloadTransferUIState.LOADED;
    }catch (e){
      this.downloadState = DownloadTransferUIState.NOT_FOUND;
      console.error(e);
    }
  }

  private async readInfoFromLink(){
    this.downloadState = DownloadTransferUIState.LOADING;
    if(this.id == null) {
      printer.print("File Not found")
      this.downloadState = DownloadTransferUIState.NOT_FOUND;
      return;
    }
    try{
      printer.print(this.id);
      printer.print("Reading from Link");
      let res = await (API.graphql({
        query: queries.listSessions,
        variables: {
          filter: {
            shortUrl: {
              eq: this.id
            }
          }
        },
        authMode: "API_KEY"
      }) as Promise<GraphQLResult>);
      printer.print(res);
      let result = ((res.data as any).listSessions) as ListSessionsQuery;
      this.transfer = result.items[0] as GetSessionQuery;
      printer.print(this.transfer);
      if(this.transfer.passwordProtected == false){
        this.passwordVerified = true;
      }
      else{
        if((this.transfer!.password!= "" || this.transfer!.password!=null)){
          this.passwordVerified = false;
        }
      }
      this.downloadState = DownloadTransferUIState.LOADED;
    }catch (e){
      this.downloadState = DownloadTransferUIState.NOT_FOUND;
      console.error(e);
    }
  }

  private async readInfoFromMail(){
    this.downloadState = DownloadTransferUIState.LOADING;
    if(this.id == null) {
      printer.print("File Not found")
      this.downloadState = DownloadTransferUIState.NOT_FOUND;
      return;
    }
    try{
      printer.print(this.id);
      printer.print("Reading from Link");
      let res = await (API.graphql({
        query: queries.getSession,
        variables: {
            id:this.id
        },
        authMode: "API_KEY"
      }) as Promise<GraphQLResult>);
      printer.print(res);
      let result = ((res.data as any).getSession) as GetSessionQuery;
      printer.print("result");
      printer.print(result);
      this.transfer = result;
      printer.print(this.transfer);
      if(this.transfer.passwordProtected == false){
        this.passwordVerified = true;
      }
      else{
        if((this.transfer!.password!= "" || this.transfer!.password!=null)){
          this.passwordVerified = false;
        }
      }
      this.downloadState = DownloadTransferUIState.LOADED;
    }catch (e){
      this.downloadState = DownloadTransferUIState.NOT_FOUND;
      console.error(e);
    }
  }

  async DownloadTransfer() {

    console.log(this.transfer);
    try{
      if (this.transfer != undefined) {
        printer.print(this.transfer);
        console.log(this.transfer);
        var filesToZip =
          // ["https://zip-zap-zwoop-beta-storage214657-dev.s3.ap-south-1.amazonaws.com/public/res/public/33fc9a38-7d95-4f58-948c-1bbf4ae0030a/CARS.zip"]
          this.transfer!.files;
        if (this.transfer.files!.length == 0)
          return;
        var id = this.transfer!.id;
        if (this.transfer.files!.length > 1) {
          printer.print("Now Downloading");
          printer.print(environment.downloadUrl +"/public/" + id);
          console.log(environment.downloadUrl +"/public/" + id  );
          let element = document.createElement("a");
          element.href = environment.downloadUrl +"/" + id;
          element.target = "_self";
          element.click();
          element.remove();
        } else {
          let element = document.createElement("a");
          let file = this.transfer!.files![0];
          printer.print(this.storageHelper.getEmbeddedURL(id, file!.key));
          element.href = this.storageHelper.getEmbeddedURL(id, file!.key);
          element.download = file!.key;
          element.target = "_self";
          element.click();

        }
      }
    }catch (e) {
      console.error(e);
      alert("Some Error Occurred while download files. Please use another browser.")
    }
  }

  async loadImage(src:string) {

    return fetch(src).then((res)=>{
      return res.blob();
    });
  }


  VerifyPassword() {
    printer.print(this.password.value);
    printer.print(this.transfer?.password);
    if(this.password.value == this.transfer?.password){
      this.passwordVerified = true;
      printer.print("verified");
      return;
    }
    this.password.setErrors({'verified':true});
    setTimeout(()=>{
      this.password.setErrors({'verified':false});
    },1500)
  }

  navigateTo(path:string){
    this.router.navigateByUrl(path);
  }


  private isExpired(expiry: number) {
    let currentDate = new Date();
    expiry*=1000;
    let expiryDate = new Date(expiry);
    printer.print(currentDate <= expiryDate);
    return !(currentDate <= expiryDate);
  }

}




// async DownloadTransfer() {
//   try{
//     if (this.transfer != undefined) {
//       printer.print(this.transfer);
//       var filesToZip =
//         // ["https://zip-zap-zwoop-beta-storage214657-dev.s3.ap-south-1.amazonaws.com/public/res/public/33fc9a38-7d95-4f58-948c-1bbf4ae0030a/CARS.zip"]
//         this.transfer!.files;
//       if (this.transfer.files!.length == 0)
//         return;
//       var id = this.transfer!.id;
//       if (this.transfer.files!.length > 1) {
//         const files = filesToZip?.map(async (file) => {
//           // printer.print(this.storageHelper.getEmbeddedURL(id, (file!.relativePath == "") ? file!.key : file!.relativePath))
//           return {
//             'name': ((file!.relativePath == "") ? file!.key : file!.relativePath),
//             'size':(file!.size == null)?0:file!.size,
//             'input': await fetch(this.storageHelper.getEmbeddedURL(id, (file!.relativePath == "") ? file!.key : file!.relativePath))
//           }
//         }) as any;
//
//         downloadZip(files, {}).body!
//           .pipeTo(streamSaver.createWriteStream(
//             this.appHelper.DownloadName() + '.zip'))
//           .then((res) => {
//             printer.print("Finished Download");
//           }).catch((err) => {
//           console.error("Error");
//           printer.print(err);
//           alert("Oops!!! We have experienced some problem. Please try another browser.")
//         });
//       } else {
//         let element = document.createElement("a");
//         let file = this.transfer!.files![0];
//         printer.print(this.storageHelper.getEmbeddedURL(id, file!.key));
//         element.href = this.storageHelper.getEmbeddedURL(id, file!.key);
//         element.download = file!.key;
//         element.target = "_self";
//         element.click();
//       }
//     }
//   }catch (e) {
//     console.error(e);
//     alert("Some Error Occurred while download files. Please use another browser.")
//   }
// }
