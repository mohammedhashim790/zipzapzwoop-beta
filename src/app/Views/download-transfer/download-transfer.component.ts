import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppAnimations, AppHelper} from "../../Bloc/AppHelper";
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
    console.log(this.redirect);
    console.log(this.router.url);
    if(this.redirect){
      //TODO
      // MAIL REDIRECT
      this.id = this.routerParams.snapshot.queryParamMap.get("id")
      this.readInfoFromMail();
    }else {
      this.id = this.router.url.replace("/","");
      // this.id = this.routerParams.snapshot.queryParamMap.get("source");
      this.readInfoFromLink();
    }
  }

  ngOnInit(): void {

  }

  private async readInfoFromLink(){
    this.downloadState = DownloadTransferUIState.LOADING;
    if(this.id == null) {
      console.log("File Not found")
      this.downloadState = DownloadTransferUIState.NOT_FOUND;
      return;
    }
    try{
      console.log(this.id);
      console.debug("Reading from Link");
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
      console.log(res);
      let result = ((res.data as any).listSessions) as ListSessionsQuery;
      console.log("result");
      console.log(result);
      this.transfer = result.items[0] as GetSessionQuery;
      console.log(this.transfer);
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
      console.log("File Not found")
      this.downloadState = DownloadTransferUIState.NOT_FOUND;
      return;
    }
    try{
      console.log(this.id);
      console.debug("Reading from Link");
      let res = await (API.graphql({
        query: queries.getSession,
        variables: {
            id:this.id
        },
        authMode: "API_KEY"
      }) as Promise<GraphQLResult>);
      console.log(res);
      let result = ((res.data as any).getSession) as GetSessionQuery;
      console.log("result");
      console.log(result);
      this.transfer = result;
      console.log(this.transfer);
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
    console.log(this.transfer != undefined);
    if (this.transfer != undefined) {
      console.log(this.transfer);


      var filesToZip =
        // ["https://zip-zap-zwoop-beta-storage214657-dev.s3.ap-south-1.amazonaws.com/public/res/public/33fc9a38-7d95-4f58-948c-1bbf4ae0030a/CARS.zip"]
        this.transfer!.files;
      if(this.transfer.files!.length == 0)
        return;
      var id = this.transfer!.id;
      if(this.transfer.files!.length>1){
        const files = filesToZip?.map(async (file) => {
          console.log(this.storageHelper.getEmbeddedURL(id, (file!.relativePath == "") ? file!.key : file!.relativePath))
          return {
            'name': file!.relativePath,
            'input': await fetch(this.storageHelper.getEmbeddedURL(id, (file!.relativePath == "") ? file!.key : file!.relativePath))
          }
        }) as any;
        console.log(files);

        downloadZip(files).body!
          .pipeTo(streamSaver.createWriteStream(this.appHelper.getShortUUID() + '.zip'))
          .then((res) => {
            console.log("Finished Download");
          }).catch((err) => {
          console.error("Error");
          console.log(err);
        });
      }else{
        let element = document.createElement("a");
        let file = this.transfer!.files![0];
        console.log(this.storageHelper.getEmbeddedURL(id, file!.key));
        element.href = this.storageHelper.getEmbeddedURL(id, file!.key);
        element.download = file!.key;
        element.target = "_self";
        element.click();
      }

    }
  }

  async loadImage(src:string) {
    // let res = await fetch(src);
    // return res.blob();

    return fetch(src).then((res)=>{
      return res.blob();
    });
  }


  VerifyPassword() {
    console.log(this.password.value);
    console.log(this.transfer?.password);
    if(this.password.value == this.transfer?.password){
      this.passwordVerified = true;
      console.log("verified");
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

  urlToPromise(url:string) {
    // return new Promise(function(resolve, reject) {
    //   JSZipUtils.getBinaryContent(url, function (err:any, data:any) {
    //     if(err) {
    //       reject(err);
    //     } else {
    //       resolve(data);
    //     }
    //   });
    // });
  }

}

