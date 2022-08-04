import * as JSZip from "jszip";


export class FileProcess{

  index:number;
  loaded:number;
  total:number;
  file:File;
  filePath:string
  fileBuffer:string | ArrayBuffer | null;
  progress:number = -1;


  constructor(index: number,
              loaded: number,
              total: number,
              filePath:string,
              file: File ,
              fileBuffer: string | ArrayBuffer | null) {
    this.index = index;
    this.loaded = loaded;
    this.total = total;
    this.filePath = filePath;
    this.file = file;
    this.fileBuffer = fileBuffer;
  }
}


export class Zipper {
  private totalFiles: number = -1;
  private filesCompressed: number = -1;

  private files:Array<FileProcess> =[];

  public async ZipObjects(files: Array<File>):Promise<JSZip> {
    let zipper = new JSZip();
    this.totalFiles = files.length;
    this.files = files.map(
      ((file, index) =>
        new FileProcess(
          index,
          0,
          file.size,
          this.filePathKey(file),
          file,
          null)));


    for (this.filesCompressed = 0; this.filesCompressed< this.totalFiles; this.filesCompressed++) {
      let file = this.files[this.filesCompressed];
      // console.log("Compressing Objects " + this.filesCompressed + "/" + files.length);
      zipper.file(file.filePath,await this.ReadFileAsync(file))
      // console.log("Compressed Objects " + this.filesCompressed+1 + "/" + files.length)
    }
    return zipper;
  }

  ReadFileAsync(fileProcess:FileProcess ):any{
    return new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        fileProcess.fileBuffer = fileReader.result;
        resolve(fileReader.result);
        console.log("Completed Reading " + fileProcess.file.name)
      };

      fileReader.onprogress = (data)=> {
        if (data.lengthComputable) {
          var progress = parseInt( String(((data.loaded / data.total) * 100)), 10 );
          // console.log(progress);
          fileProcess.loaded = data.loaded ;
          fileProcess.progress  = progress;
        }
      }
      fileReader.readAsBinaryString(fileProcess.file);
    });
  }

  private filePathKey(file: File) {
    return (
      file.webkitRelativePath == "")?file.name:file.webkitRelativePath;
  }

}
