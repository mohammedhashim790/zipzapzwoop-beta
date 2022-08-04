import {Backdrop, MailInfo, S3Object, Session} from "../../../models";
import API from "@aws-amplify/api-graphql";
import {APIService, CreateSessionInput} from "../../API.service";
import {aws_exports} from "../../aws-exports";
import * as mutations from '../../../graphql/mutations';
import * as queries from '../../../graphql/queries';
import * as subscriptions from '../../../graphql/subscriptions';
import {GraphQLResult} from "@aws-amplify/api-graphql/lib-esm/types";



const api = new APIService();


export class S3ObjectParams implements S3Object{
  bucket: string = aws_exports["aws_user_files_s3_bucket"];
  key: string;
  region: string = aws_exports["aws_user_files_s3_bucket_region"];
  relativePath: string;
  constructor(key: string,relativePath:string) {
    this.key = key;
    this.relativePath = relativePath;
  }
}

class T {
}

export function CreateSession(createSessionParams:CreateSessionInput){
  return API.graphql({
    query:mutations.createSession,
    variables:{
      input:createSessionParams
    },
    authMode:"API_KEY"
  }) as Promise<GraphQLResult<any>>;
}

export function GetSession(id:string | null){
  if(id==null)
    return null;
  return "";
}
