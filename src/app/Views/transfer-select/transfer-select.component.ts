import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppSession} from "../../Bloc/Session/Session";
import {StorageHelper} from "../../Bloc/Storage/Storage";
import {AppAnimations, AppHelper, AppState} from "../../Bloc/AppHelper";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AppError, AppErrorCode, ErrorParams} from "../../Bloc/AppErrors/AppError";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'transfer-select',
  templateUrl: './transfer-select.component.html',
  styleUrls: ['./transfer-select.component.css'],
  animations:AppAnimations
})
export class TransferSelectComponent implements OnInit {
  AppState = AppState;


  appHelper:AppHelper = new class extends AppHelper {}
  testState: boolean = false;

  dropReadyToRead:boolean = false;

  errorInfo:FormControl = new FormControl('',[]);

  errorInfoParams:ErrorParams = {};
  private errorTimeout: NodeJS.Timeout = setTimeout(()=>{
    return;
  },0);

  constructor(public storageHelper:StorageHelper,
              public appSession:AppSession,
              private cdRef:ChangeDetectorRef,
              private router:Router,
              private http:HttpClient) {
    //console.log(this.appSession);
    this.appSession.CreateNewSession();
  }

  ngOnInit(): void {
    //console.log(this.appSession)
    //console.log("Tree");
  }


  onClickInputEnter() {
    if(!this.appSession.appTransferParams.recipient.errors?.['email'] && this.appSession.appTransferParams.recipient.valid){
      this.appSession.appTransferParams.recipients.unshift(this.appSession.appTransferParams.recipient.value);
      this.appSession.appTransferParams.recipient.reset();
    }
  }

  removeRecipients(index:number) {
    this.appSession.appTransferParams.recipients.splice(index,1);
    this.cdRef.detectChanges();
  }

  onFileSelected(event: Event) {
    const target = event.target as any;
    //console.log(typeof target.files);
    this.addFiles(target.files);
    // this.ClearErrors();

  }

  removeFile(index:number) {
    this.appSession.appFileTransfer.files.splice(index,1);
    this.cdRef.detectChanges();
  }

  async ProceedNext() {
    if(!this.appSession.isValid()){
      return ;
    }
    if(this.appSession.appState == AppState.MAIL_SELECT){
      this.appSession.appState = AppState.MAIL_SCHEDULE;
    }else{
      this.appSession.appState = AppState.LINK_UPLOADING;
    }
  }


  onChangeState() {
    if(this.appSession.appState == AppState.LINK_SELECT)
      this.appSession.appState = AppState.MAIL_SELECT;
    else
      this.appSession.appState = AppState.LINK_SELECT;
  }

  onDragEnter(event: DragEvent) {
    event!.dataTransfer!.effectAllowed = "all";
    event!.dataTransfer!.dropEffect = "move";
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
    let files: Array<File> = [];
    this.dropReadyToRead = true;
    var items = event.dataTransfer!.items;
    for (var i = 0; i < items.length; i++) {
      var item = items[i].webkitGetAsEntry() as FileSystemEntry || FileSystemDirectoryEntry;  //Might be renamed to GetAsEntry() in 2020
      if (item) {
        if (item.isDirectory) {
          let folderName = item.name;
          // files.push(folderName);
          this.appSession.appFileTransfer.CreateDirectory(folderName);
          this.GetFileTree(item, folderName, files);
        }
        if (item.isFile) {
          let itemReader = item as any;
          itemReader.file((file: any) => {
            try{
              this.appSession.appFileTransfer.AddFile(file);
              this.cdRef.detectChanges();
            }catch (e:any){
              this.SetNewError({
                errorCode: AppErrorCode.LIMIT_EXCEEDED,
                title: "That's too Heavy, Buddy",
                message: e.message
              });
              console.error(e);
            }
          });
        }
      }
    }
    event.preventDefault();
    let element = (document.getElementById("drop-zoned") as HTMLDivElement);
    element.style.visibility = "hidden";
    this.cdRef.detectChanges();


  }

  private GetFileTree(item: any, parentFolder: string, files: Array<File>) {
    parentFolder = parentFolder || "";
    if(!this.dropReadyToRead)
      return;
    if (item.isFile) {
      item.file((file: any) => {
        if(!this.dropReadyToRead) {
          // console.log("Removing Directory " + parentFolder);
          this.appSession.appFileTransfer.RemoveDirectory(parentFolder);
        }
        else{
          try {
            this.appSession.appFileTransfer.AddToDirectory(parentFolder, file);
          } catch (e:any) {
            if(!this.errorInfo.hasError(e.errorCode)) {
              this.SetNewError({
                errorCode: e.errorCode,
                title: "Oops...",
                message: e.message
              })
            }

            console.error(e);
            this.dropReadyToRead = false;
          }
        }
        this.cdRef.detectChanges();
      });
    } else if (item.isDirectory) {
      // Get folder contents
      var dirReader = item.createReader();
      // console.log("Reading Files From " + item.name);
      dirReader.readEntries((entries: any) => {
        for (var i = 0; i < entries.length; i++) {
          if(!this.dropReadyToRead)
            return;
          this.GetFileTree(entries[i], parentFolder, files);
        }
      },(errorCallback:any)=>{
        console.error("Error CallaBack" + item.name);
        console.error(errorCallback)
      });
      // console.log("Reading Files From " + item.name + " Finished");
    }
  }



  private addFiles(files: FileList) {
    if(files==null)
      return;
    for(let i = 0;i<files.length;i++){
      this.appSession.appFileTransfer.AddFile(files[i]);
    }
  }

  onFolderUpload(event: any) {
    let files = event.target.files;
    try{
      this._Folder(files);
    }catch(e:any){
      if(e.errorCode == AppErrorCode.MAXIMUM_FILES_EXCEEDED){
        this.SetNewError({
          errorCode:AppErrorCode.MAXIMUM_FILES_EXCEEDED,
          title:"That's to heavy Buddy",
          message:e.message
        })
      }
      console.error(e.errorCode);
    }
    event.preventDefault();
  }

  private _Folder(files:Array<File>){
    let folderName = files[0].webkitRelativePath.split("/")[0];
    console.log("Folder Upload");
    if(files.length>this.appHelper.SeqFilesLimit)
      throw new AppError(AppErrorCode.MAXIMUM_FILES_EXCEEDED, "Maximum File in a folder exceeded. " +
        `Please zip \"${folderName}\" and upload for your ease.`)
    this.appSession.appFileTransfer.CreateDirectory(folderName);
    for(let iter = 0;iter<files.length;iter++){
      this.appSession.appFileTransfer.AddToDirectory(folderName,files[iter]);
    }
  }

  ClearErrors() {
    this.errorInfo.setErrors({});
    console.log("Cleared Errors");
    console.log(this.appSession.appFileTransfer.files);
    this.cdRef.detectChanges();
  }

  SetNewError(errorParams:ErrorParams){
    this.errorInfo.setErrors({});
    let key = errorParams.errorCode;

    console.log("Error Console");

    this.errorInfoParams = errorParams;

    if(key == AppErrorCode.MAXIMUM_FILES_EXCEEDED){
      this.errorInfo.setErrors({
        "MAXIMUM_FILES_EXCEEDED":true
      });
    }else if(key == AppErrorCode.FILE_WITH_SAME_NAME){
      this.errorInfo.setErrors({
        "FILE_WITH_SAME_NAME":true
      });
    }else if(key == AppErrorCode.LIMIT_EXCEEDED){
      this.errorInfo.setErrors({
        "LIMIT_EXCEEDED":true
      });
    }

    this.errorTimeout = setTimeout(()=> {
      this.errorInfo.setErrors({});
      console.log("Cleared State");
    },10000);
    this.cdRef.detectChanges();
  }


}
