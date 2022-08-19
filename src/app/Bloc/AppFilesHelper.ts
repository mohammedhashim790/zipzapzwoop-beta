import {AppHelper, printer} from "./AppHelper";
import {AppError, AppErrorCode} from "./AppErrors/AppError";

export class IMap{
  name:string;
  files:Array<File> | File | any;
  isDirectory:boolean;

  constructor(name: string, files: Array<File> | File | any, isDirectory: boolean) {
    this.name = name;
    this.files = files;
    this.isDirectory = isDirectory;
  }


  getSize() {
    let data = [this.files];
    // if(this.files instanceof Array)
    return data.flat().reduce((s:number,v:File)=>s+v.size,0);
    // else
    //   return this.files.size;
  }
}

export class AppFilesHelper {

  constructor() {
  }

  public files:Array<IMap> = [];

  private appHelper:AppHelper = new class extends AppHelper {};


  inLimitBounds(file:File):boolean{
    let diff = this.LimitRemaining();
    if(file.size<diff)
      return true;
    return false;
  }

  inLimit():boolean{
    let size = this.TotalSize();
    if(size<this.appHelper.bytesInGigaBytes)
      return true;
    return false;
  }

  TotalSize(){
    return this.files.reduce((sum, value)=>sum+value.getSize(),0);
  }

  LimitRemaining(){
    return this.appHelper.bytesInGigaBytes - this.TotalSize();
  }

  FileExists(fileName:string){
    let index = this.files.findIndex((value => value.name == fileName));
    return index;
  }

  AddFile(file:File){
    let found = this.FileExists(file.name);
    if(found!=-1)
      throw new AppError(AppErrorCode.FILE_WITH_SAME_NAME, "File with the same name exists.");

    if(!(this.inLimitBounds(file))){
      throw new AppError(AppErrorCode.LIMIT_EXCEEDED,"File Transfer Limit Exceeded");
    }


    this.files.push(new IMap(file.name,file,false));
  }

  AddToDirectory(directoryName:string,file:File){
    let index = this.DirectoryExists(directoryName);
    printer.print("Directory" + directoryName + " Found at " + index);
    // if(index == -1){
    //   throw new AppError(AppErrorCode.FOLDER_NOT_FOUND, "Folder is not found in the list.");
    // }
    if(!(this.inLimitBounds(file))){
      this.files.splice(index,1)
      throw new AppError(AppErrorCode.LIMIT_EXCEEDED,"File Transfer Limit Exceeded");
    }

    if(this.files[index].files.length>=this.appHelper.SeqFilesLimit){
      this.files.splice(index,1);
      throw new AppError(AppErrorCode.MAXIMUM_FILES_EXCEEDED, "Maximum File in a folder exceeded. " +
        `Please zip ${directoryName} and upload the zip file for your ease.`)
    }


    this.files[index].files.push(file);

  }

  DirectoryExists(directoryName:string){
    let index = this.files.findIndex((value => value.name == directoryName));
    return index;
  }

  CreateDirectory(name:string){
    if(this.files.findIndex((value => value.name == name))!=-1){
      throw new Error("A Folder exists with same Name.")
    }
    printer.print("Created Folder "+ name);
    this.files.push(new IMap(name,[],true));
  }


  getKey(map:IMap){
    return map.name;
  }

  getSize(file:Array<File> | File){
    let size = "0";
    if(file instanceof Array){
      //  COMPUTE SUM OF SIZES AND RETURN
      size = this.appHelper.getSizeInWords(file.reduce((sum,value)=>sum+value.size,0));

    }else{
      // printer.print("SingleSize")
      size = this.appHelper.getSizeInWords(file.size);
    }
    // printer.print("Size " + size);
    return size;
  }

  getFiles() {
    return this.files
  }

  isValid() {
    return this.files.length>0;
  }

  ListFiles() {
    printer.print(this.files);
  }

  RemoveDirectory(directoryName: string) {
    let index = this.DirectoryExists(directoryName);
    printer.print("Directory" + directoryName + " Found at " + index);
    if(index == -1){
      return;
      // throw new Error("Folder is not found in the list.");
    }
    this.files.splice(index,1);
  }
}




// setIfAbsent(file:File){
//   if(this.files.findIndex((imap)=>imap.name == file.name)!=-1){
//     return ;
//   }
//   this.files.push(new IMap(file.name,file,false));
// }
// setIfAbsentDirectory(file:File ,path:string){
//   let folderName = file.webkitRelativePath.split("/")[0];
//   let index = this.files.findIndex((value => value.name == folderName.replace("/","")));
//   if(index!=-1){
//     this.files[index].files.push(file);
//   }else{
//     this.files.push(new IMap(folderName,file,true));
//   }
// }
