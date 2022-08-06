import {Injectable} from "@angular/core";
import {Storage} from "aws-amplify";
import { v4 as uuidv4 } from 'uuid';
import {AppHelper, AppState} from "../AppHelper";
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
  get transferName(): string {
    return this._transferName + new Date(Date.now()).toDateString();
  }

  set transferName(value: string) {
    this._transferName = value;
  }


  totalInBytes:number = 0;
  current:number = 0;

  currentInBytes:number = 0;

  iter:number = 0;
  filesCompressed = -1;
  totalFiles = -1;


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
      await Storage.put(key, file, {
        completeCallback:(event)=>{
          console.log("Uploaded" + key);
        },
        progressCallback : (progress: any) =>{
          this.current=((this.iter) + (progress.loaded/progress.total));
          this.fileProgress[iter] = (progress.loaded/progress.total);
          console.log(this.current);
        },
      })
    } catch (e) {
      console.error(e);
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
    console.log(this.totalInBytes);
    this.fileProgress = Array(files.length).fill(0);
    files = files.flat();
    if(files.length == 1){
      let file = files[0];
      let key = this.getKey(sessionId,this.filePathKey(file));
      // let key = this.filePathKey(file);
      await this.UploadObject(key, file, this.iter);
      return sessionId;
    }

    for (this.iter = 0; this.iter < files.length; this.iter++) {
      let file = files[this.iter];
      let key = this.getKey(sessionId,this.filePathKey(file));
      // let key = this.filePathKey(file);
      await this.UploadObject(key, file,this.iter);
    }
    return sessionId;
  }


  public async ZipObjects(files: Array<File>): Promise<JSZip> {
    let zipper = new JSZip();
    this.totalFiles = files.length;
    console.log("Compressing Objects");
    for (this.filesCompressed = 0; this.filesCompressed< this.totalFiles; this.filesCompressed++) {
      let file = files[this.filesCompressed];
      console.log("Compressing Objects " + this.filesCompressed + "/" + files.length);
      let compressedFile = await this.ReadFileAsync(file);
      compressedFile = compressedFile as ArrayBuffer;
      zipper.file(this.filePathKey(file),compressedFile)
      console.log("Compressed Objects " + this.filesCompressed+1 + "/" + files.length)
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
          console.log(progress);
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
