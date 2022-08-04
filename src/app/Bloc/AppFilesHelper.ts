import {AppHelper} from "./AppHelper";

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



  AddFile(file:File){
    let found = this.FileExists(file.name);
    if(found!=-1)
      throw new Error("File with the same name exists.");
    this.files.push(new IMap(file.name,file,false));
  }

  FileExists(fileName:string){
    let index = this.files.findIndex((value => value.name == fileName));
    return index;
  }

  AddToDirectory(directoryName:string,file:File){
    let index = this.DirectoryExists(directoryName);
    console.log("Directory" + directoryName + " Found at " + index);
    if(index == -1){
      throw new Error("Folder is not found in the list.");
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
    console.log("Created Folder "+ name);
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
      // console.log("SingleSize")
      size = this.appHelper.getSizeInWords(file.size);
    }
    // console.log("Size " + size);
    return size;
  }

  getFiles() {
    return this.files
  }

  isValid() {
    return this.files.length>0;
  }

  ListFiles() {
    console.log(this.files);
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
