import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {StorageHelper} from "../../Bloc/Storage/Storage";
import {aws_exports} from "../../aws-exports";
import {HttpClient} from "@angular/common/http";
import {AppAnimations, AppHelper, AppState, printer} from "../../Bloc/AppHelper";
import {AppFilesHelper} from "../../Bloc/AppFilesHelper";
import {AppSession} from "../../Bloc/Session/Session";
import {AppError, AppErrorCode, ErrorParams} from "../../Bloc/AppErrors/AppError";
import {FormControl} from "@angular/forms";
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: AppAnimations
})
export class HomeComponent implements OnInit {




  AppState = AppState;

  appHelper:AppHelper = new class extends AppHelper {};

  dropReadyToRead:boolean = false;

  errorInfo:FormControl = new FormControl('',[]);

  errorInfoParams:ErrorParams = {};
  private errorTimeout: NodeJS.Timeout = setTimeout(()=>{
    return;
  },0);


  constructor(public storageHelper:StorageHelper,
              public appSession:AppSession,
              private cdRef:ChangeDetectorRef,
              private http:HttpClient) {
    printer.print(aws_exports);
  }

  ngOnInit(): void {
    this.appSession.CreateNewSession();
  }


  onClickInputEnter() {
  }

  removeRecipients(index:number) {
  }

  onFileSelected(event: Event) {
    const target = event.target as any;
    printer.print(typeof target.files);
  }

  removeFile(index:number) {
    this.appSession.appFileTransfer.files.splice(index,1);
  }

  async ProceedNext() {
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
    printer.print("Entered");
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
          // printer.print("Removing Directory " + parentFolder);
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
      // printer.print("Reading Files From " + item.name);
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
      // printer.print("Reading Files From " + item.name + " Finished");
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
    printer.print("Folder Upload");
    if(files.length>this.appHelper.SeqFilesLimit)
      throw new AppError(AppErrorCode.MAXIMUM_FILES_EXCEEDED, "Maximum File in a folder exceeded. " +
        `Please zip \"${folderName}\" and upload.`)
    this.appSession.appFileTransfer.CreateDirectory(folderName);
    for(let iter = 0;iter<files.length;iter++){
      this.appSession.appFileTransfer.AddToDirectory(folderName,files[iter]);
    }
    this.cdRef.detectChanges()
  }

  ClearErrors() {
    this.errorInfo.setErrors({});
    printer.print("Cleared Errors");
    printer.print(this.appSession.appFileTransfer.files);
    this.cdRef.detectChanges();
  }

  SetNewError(errorParams:ErrorParams){
    this.errorInfo.setErrors({});
    let key = errorParams.errorCode;

    printer.print("Error Console");

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
      printer.print("Cleared State");
    },10000);
    this.cdRef.detectChanges();
  }
  onFileChange(event: any) {
    printer.print("Change");
    printer.print(event);
  }


}
