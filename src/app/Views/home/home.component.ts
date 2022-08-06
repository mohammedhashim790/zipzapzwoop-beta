import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {StorageHelper} from "../../Bloc/Storage/Storage";
import {aws_exports} from "../../aws-exports";
import {HttpClient} from "@angular/common/http";
import {AppAnimations, AppHelper, AppState} from "../../Bloc/AppHelper";
import {AppFilesHelper} from "../../Bloc/AppFilesHelper";
import {AppSession} from "../../Bloc/Session/Session";
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: AppAnimations
})
export class HomeComponent implements OnInit {




  AppState = AppState;

  appHelper:AppHelper = new class extends AppHelper {};

  constructor(public storageHelper:StorageHelper,
              public appSession:AppSession,
              private cdRef:ChangeDetectorRef,
              private http:HttpClient) {
    console.log(aws_exports);
  }

  ngOnInit(): void {
    this.appSession.CreateNewSession();
  }


  onClickInputEnter() {
    // console.log(this.appSession.recipient.errors?.['email']);
    // if(!this.appSession.recipient.errors?.['email'] && this.appSession.recipient.valid){
    //   this.appSession.recipients.unshift(this.appSession.recipient.value);
    //   this.appSession.recipient.reset();
    // }
  }

  removeRecipients(index:number) {
    // this.appSession.recipients.splice(index,1);
  }

  onFileSelected(event: Event) {
    const target = event.target as any;
    console.log(typeof target.files);
    // this.addFiles(target.files);
  }

  removeFile(index:number) {
    this.appSession.appFileTransfer.files.splice(index,1);
  }

  async ProceedNext() {

    // if(this.appHelper.appState == AppState.MAIL_SELECT) {
    //   this.appHelper.appState = AppState.MAIL_SCHEDULE;
    // }else if(this.appHelper.appState == AppState.LINK_SELECT){
      this.appSession.appState = AppState.LINK_UPLOADING;
    // }
  }

  onChangeState() {
    if(this.appSession.appState == AppState.LINK_SELECT)
      this.appSession.appState = AppState.MAIL_SELECT;
    else
      this.appSession.appState = AppState.LINK_SELECT;
  }

  onDragEnter(event: DragEvent) {
    event!.dataTransfer!.effectAllowed = "all"; event!.dataTransfer!.dropEffect = "move"
    console.log("Drag enter");
    event.preventDefault();
    let element = (document.getElementById("drop-zoned") as HTMLDivElement);
    element.style.visibility = "visible";
  }

  onDropOver(event: DragEvent){
    event.preventDefault();
  }

  onDropLeave(event:DragEvent){
    event.preventDefault();
    let element = (document.getElementById("drop-zoned") as HTMLDivElement);
    element.style.visibility = "hidden";
  }

  onDropFile(event: DragEvent) {
    console.log("Dropped");
    console.log(event.dataTransfer!.items);
    var items = event.dataTransfer!.items;
    for (var i=0; i<items.length; i++) {
      var item = items[i].webkitGetAsEntry();  //Might be renamed to GetAsEntry() in 2020
      if (item) {
        // console.log(item);
        // this.GetFileTree(item,'');
      }
    }
    event.preventDefault();
    let element = (document.getElementById("drop-zoned") as HTMLDivElement);
    element.style.visibility = "hidden";
    this.cdRef.detectChanges();
  }

  // private async  GetFileTree(item: any, path: any) {
  //   path = path || "";
  //   if (item.isFile) {
  //     // console.log("File");
  //     // console.log(item);
  //     item.file((file: any) => {
  //       if(path == ""){
  //         path = file.name;
  //         this.appFileHelper.setIfAbsent(file);
  //         this.cdRef.detectChanges();
  //       }else {
  //         this.appFileHelper.setIfAbsentDirectory(file, path);
  //         this.cdRef.detectChanges();
  //       }
  //     });
  //
  //   } else if (item.isDirectory) {
  //     if(path == ""){
  //       this.appFileHelper.CreateDirectory(item.name);
  //     }
  //     // Get folder contents
  //     var dirReader = item.createReader();
  //     dirReader.readEntries((entries: any) => {
  //       for (var i = 0; i < entries.length; i++) {
  //         this.GetFileTree(entries[i], path + item.name + "/");
  //       }
  //     });
  //   }
  // }
  //
  //
  //
  // private addFiles(files: FileList) {
  //   if(files==null)
  //     return;
  //   for(let i = 0;i<files.length;i++){
  //     // this.inputFiles.push(files[i]);
  //     this.appFileHelper.setIfAbsent(files[i]);
  //   }
  //   console.log(this.appFileHelper.files);
  // }
  //
  // onFolderUpload(event: any) {
  //   let files = event.target.files;
  //   let folderName = files[0].webkitRelativePath.split("/")[0];
  //   this.appFileHelper.CreateDirectory(folderName);
  //   for(let iter = 0;iter<files.length;iter++){
  //     this.appFileHelper.setIfAbsentDirectory(files[iter],"");
  //   }
  //   event.preventDefault();
  // }

  onFileChange(event: any) {
    console.log("Change");
    console.log(event);
  }


}
