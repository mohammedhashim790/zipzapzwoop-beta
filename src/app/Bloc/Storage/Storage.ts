import {Injectable} from "@angular/core";
import {Storage} from "aws-amplify";
import { v4 as uuidv4 } from 'uuid';
import {AppHelper, AppState, printer} from "../AppHelper";
import {aws_exports} from "../../aws-exports";
import {environment} from "../../../environments/environment";
import * as JSZip from "jszip";
import {saveAs} from "@progress/kendo-file-saver";



// export enum StorageProcess{
//   QUEUED,
//   READY_TO_SYNC,
//   SYNCED,
//   AVAILABLE_TO_QUEUE,
//   COMPRESSING_OBJECTS,
//   SYNCING
// }

@Injectable()
export class StorageHelper {
  totalSize: number = -1;
  get transferName(): string {
    return this._transferName + new Date(Date.now()).toDateString();
  }

  set transferName(value: string) {
    this._transferName = value;
  }


  totalInBytes:number = 0;
  current:number = 0;

  currentInBytes:number = 0;

  iterProgress:number = 0;
  filesCompressed = -1;
  totalFiles = -1;

  get TotalProgress(){
    return this.current;
    // return this.fileProgress.reduce((num,value)=>num + value,0);
  }

  private fileProgress: Array<number> = [];
  onCompleteCallback: any;


  private _transferName = "zipzapzwoop_transfer_";

  get api(): string {
    return environment.apiKey;
  }



  public getCurrentProgress(){
    return this.current;
    // let sum = this.getSumProgress();
    // return sum;
  }

  public getSumProgress(){
    return this.fileProgress.reduce((sum,value)=>sum+value,0);
  }




  public getKey(sessionID:string,key:string) {
    /**
     * private :
     *    res/private/username/{key}
     *
     *  public
     *    res/public/{key}
     */
    // return "res/" + "public/" + uuidv4();

    return "res/" + "public/" + sessionID + "/"+key;
  }

  public getEmbeddedURL(sessionID:string,key:string){
    return this.api + this.getKey(sessionID,key);
  }


  public async UploadObject(
    key: string,
    file: File | string | null | ArrayBuffer,
    iter: number) {
    try {
      let res = await Storage.put(key, file, {
        completeCallback:(event)=>{
          printer.print("Uploaded" + key);
        },
        progressCallback : (progress: any) =>{
          // this.current=((this.iterProgress) + (progress.loaded/progress.total));
          // this.current=((this.iterProgress) + progress.loaded);

          if((this.current - this.iterProgress)<progress.loaded){
            this.current=((this.iterProgress) + progress.loaded);
          }

          this.fileProgress[iter] = progress.loaded;
          // printer.print(this.current);
        },
      });
      this.iterProgress = this.current;
      printer.print("Uploaded File " + key + "Progress " + this.iterProgress);
    } catch (e) {
      console.error(e);
      throw new Error(e as string);
    }

  }

  public DownloadObject(key:string){

    // key = this.getKey("fca4f9a6-df61-4ed2-88e7-44f46606fe8b/154-1542390_software-application-icon-png.png","");
    return Storage.get("");
  }

  /**
   * 1. Get Files
   * 2. If Single Zip, Proceed to step 4
   * 3. Compress Object
   * 4. Upload Object
   * @param files
   * @param sessionId
   * @constructor
   */
  public async UploadObjects(files: Array<File>,
                              sessionId:string) {
    // this.storageState = StorageProcess.QUEUED;
    this.reset();
    this.totalInBytes = files.reduce((value, file) => value + file?.size, 0);
    printer.print(this.totalInBytes);
    this.fileProgress = Array(files.length).fill(0);

    this.totalSize = files.reduce((num:number,file:File)=> num + file.size,0);

    printer.print("Files " + files.length );
    printer.print("Total Size " + this.totalSize);

    files = files.flat();
    if(files.length == 1){
      let file = files[0];
      let key = this.getKey(sessionId,file.name);
      // let key = this.filePathKey(file);
      await this.UploadObject(key, file, 0);
      return sessionId;
    }
    this.iterProgress = 0;
    for (let iter = 0; iter < files.length; iter++) {
      let file = files[iter];
      let key = this.getKey(sessionId,file.name);
      // let key = this.filePathKey(file);
      await this.UploadObject(key, file,iter);

      throw new Error("Error Uploading !!!!. Please try again.")
    }
    return sessionId;
  }


  public async ZipObjects(files: Array<File>): Promise<JSZip> {
    let zipper = new JSZip();
    this.totalFiles = files.length;
    printer.print("Compressing Objects");
    for (this.filesCompressed = 0; this.filesCompressed< this.totalFiles; this.filesCompressed++) {
      let file = files[this.filesCompressed];
      printer.print("Compressing Objects " + this.filesCompressed + "/" + files.length);
      let compressedFile = await this.ReadFileAsync(file);
      compressedFile = compressedFile as ArrayBuffer;
      zipper.file(this.filePathKey(file),compressedFile)
      printer.print("Compressed Objects " + this.filesCompressed+1 + "/" + files.length)
    }
    return zipper;
  }

  ReadFileAsync(src:File ):Promise<string | ArrayBuffer | null>{
    return new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.onprogress = (data)=> {
        if (data.lengthComputable) {
          // resolve(fileReader);
          var progress = parseInt( String(((data.loaded / data.total) * 100)), 10 );
          printer.print(progress);
        }
      }
      fileReader.readAsArrayBuffer(src);
    });
  }


  downloadUrlAsPromise(url:string):Promise<ArrayBuffer> {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onreadystatechange = function (evt) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(new Error("Error for " + url + ": " + xhr.status));
          }
        }
      };
      xhr.send();
    });
  }


  reset(){
    this.totalInBytes = 0;
    this.totalSize = 0;
    this.current = 0;
    this.currentInBytes = 0;
    this.fileProgress = [];
    this.onCompleteCallback = () => {}
  }

  private filePathKey(file: File) {
    return (
      file.webkitRelativePath == "")?file.name:file.webkitRelativePath;
  }
}
