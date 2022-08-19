/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type __SubscriptionContainer = {
  onCreateSession: OnCreateSessionSubscription;
  onUpdateSession: OnUpdateSessionSubscription;
  onDeleteSession: OnDeleteSessionSubscription;
  onCreateBackdrop: OnCreateBackdropSubscription;
  onUpdateBackdrop: OnUpdateBackdropSubscription;
  onDeleteBackdrop: OnDeleteBackdropSubscription;
};

export type UpdateSessionInput = {
  id: string;
  files?: Array<S3ObjectInput | null> | null;
  fileSize?: string | null;
  password?: string | null;
  passwordProtected?: boolean | null;
  mailInfo?: MailInfoInput | null;
  linkInfo?: LinkInfoInput | null;
  shortUrl?: string | null;
  expiry?: number | null;
  scheduledAt?: number | null;
};

export type S3ObjectInput = {
  key: string;
  bucket: string;
  region: string;
  relativePath: string;
  size?: string | null;
};

export type MailInfoInput = {
  FromEmail: string;
  Recipients: Array<string | null>;
  Cc?: Array<string | null> | null;
  Bcc?: Array<string | null> | null;
  Subject: string;
  Title: string;
  Message: string;
};

export type LinkInfoInput = {
  Title: string;
  Message: string;
};

export type ModelSessionConditionInput = {
  fileSize?: ModelStringInput | null;
  password?: ModelStringInput | null;
  passwordProtected?: ModelBooleanInput | null;
  shortUrl?: ModelStringInput | null;
  expiry?: ModelIntInput | null;
  scheduledAt?: ModelIntInput | null;
  and?: Array<ModelSessionConditionInput | null> | null;
  or?: Array<ModelSessionConditionInput | null> | null;
  not?: ModelSessionConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null"
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type ModelIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type Session = {
  __typename: "Session";
  id: string;
  files?: Array<S3Object | null> | null;
  fileSize?: string | null;
  password?: string | null;
  passwordProtected?: boolean | null;
  mailInfo?: MailInfo | null;
  linkInfo?: LinkInfo | null;
  backdrop?: ModelBackdropConnection | null;
  shortUrl?: string | null;
  expiry?: number | null;
  scheduledAt?: number | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type S3Object = {
  __typename: "S3Object";
  key: string;
  bucket: string;
  region: string;
  relativePath: string;
  size?: string | null;
};

export type MailInfo = {
  __typename: "MailInfo";
  FromEmail: string;
  Recipients: Array<string | null>;
  Cc?: Array<string | null> | null;
  Bcc?: Array<string | null> | null;
  Subject: string;
  Title: string;
  Message: string;
};

export type LinkInfo = {
  __typename: "LinkInfo";
  Title: string;
  Message: string;
};

export type ModelBackdropConnection = {
  __typename: "ModelBackdropConnection";
  items: Array<Backdrop | null>;
  nextToken?: string | null;
};

export type Backdrop = {
  __typename: "Backdrop";
  id: string;
  SessionID: string;
  S3Object: S3Object;
  static: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type DeleteSessionInput = {
  id: string;
};

export type CreateBackdropInput = {
  id?: string | null;
  SessionID: string;
  S3Object: S3ObjectInput;
  static: boolean;
};

export type ModelBackdropConditionInput = {
  SessionID?: ModelIDInput | null;
  static?: ModelBooleanInput | null;
  and?: Array<ModelBackdropConditionInput | null> | null;
  or?: Array<ModelBackdropConditionInput | null> | null;
  not?: ModelBackdropConditionInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type UpdateBackdropInput = {
  id: string;
  SessionID?: string | null;
  S3Object?: S3ObjectInput | null;
  static?: boolean | null;
};

export type DeleteBackdropInput = {
  id: string;
};

export type CreateSessionInput = {
  id?: string | null;
  files?: Array<S3ObjectInput | null> | null;
  fileSize?: string | null;
  password?: string | null;
  passwordProtected?: boolean | null;
  mailInfo?: MailInfoInput | null;
  linkInfo?: LinkInfoInput | null;
  shortUrl?: string | null;
  expiry?: number | null;
  scheduledAt?: number | null;
};

export type ModelSessionFilterInput = {
  id?: ModelIDInput | null;
  fileSize?: ModelStringInput | null;
  password?: ModelStringInput | null;
  passwordProtected?: ModelBooleanInput | null;
  shortUrl?: ModelStringInput | null;
  expiry?: ModelIntInput | null;
  scheduledAt?: ModelIntInput | null;
  and?: Array<ModelSessionFilterInput | null> | null;
  or?: Array<ModelSessionFilterInput | null> | null;
  not?: ModelSessionFilterInput | null;
};

export type ModelSessionConnection = {
  __typename: "ModelSessionConnection";
  items: Array<Session | null>;
  nextToken?: string | null;
};

export type ModelBackdropFilterInput = {
  id?: ModelIDInput | null;
  SessionID?: ModelIDInput | null;
  static?: ModelBooleanInput | null;
  and?: Array<ModelBackdropFilterInput | null> | null;
  or?: Array<ModelBackdropFilterInput | null> | null;
  not?: ModelBackdropFilterInput | null;
};

export type UpdateSessionMutation = {
  __typename: "Session";
  id: string;
  files?: Array<{
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  } | null> | null;
  fileSize?: string | null;
  password?: string | null;
  passwordProtected?: boolean | null;
  mailInfo?: {
    __typename: "MailInfo";
    FromEmail: string;
    Recipients: Array<string | null>;
    Cc?: Array<string | null> | null;
    Bcc?: Array<string | null> | null;
    Subject: string;
    Title: string;
    Message: string;
  } | null;
  linkInfo?: {
    __typename: "LinkInfo";
    Title: string;
    Message: string;
  } | null;
  backdrop?: {
    __typename: "ModelBackdropConnection";
    items: Array<{
      __typename: "Backdrop";
      id: string;
      SessionID: string;
      static: boolean;
      createdAt: string;
      updatedAt: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
  shortUrl?: string | null;
  expiry?: number | null;
  scheduledAt?: number | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type DeleteSessionMutation = {
  __typename: "Session";
  id: string;
  files?: Array<{
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  } | null> | null;
  fileSize?: string | null;
  password?: string | null;
  passwordProtected?: boolean | null;
  mailInfo?: {
    __typename: "MailInfo";
    FromEmail: string;
    Recipients: Array<string | null>;
    Cc?: Array<string | null> | null;
    Bcc?: Array<string | null> | null;
    Subject: string;
    Title: string;
    Message: string;
  } | null;
  linkInfo?: {
    __typename: "LinkInfo";
    Title: string;
    Message: string;
  } | null;
  backdrop?: {
    __typename: "ModelBackdropConnection";
    items: Array<{
      __typename: "Backdrop";
      id: string;
      SessionID: string;
      static: boolean;
      createdAt: string;
      updatedAt: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
  shortUrl?: string | null;
  expiry?: number | null;
  scheduledAt?: number | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type CreateBackdropMutation = {
  __typename: "Backdrop";
  id: string;
  SessionID: string;
  S3Object: {
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  };
  static: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type UpdateBackdropMutation = {
  __typename: "Backdrop";
  id: string;
  SessionID: string;
  S3Object: {
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  };
  static: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type DeleteBackdropMutation = {
  __typename: "Backdrop";
  id: string;
  SessionID: string;
  S3Object: {
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  };
  static: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type CreateSessionMutation = {
  __typename: "Session";
  id: string;
  files?: Array<{
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  } | null> | null;
  fileSize?: string | null;
  password?: string | null;
  passwordProtected?: boolean | null;
  mailInfo?: {
    __typename: "MailInfo";
    FromEmail: string;
    Recipients: Array<string | null>;
    Cc?: Array<string | null> | null;
    Bcc?: Array<string | null> | null;
    Subject: string;
    Title: string;
    Message: string;
  } | null;
  linkInfo?: {
    __typename: "LinkInfo";
    Title: string;
    Message: string;
  } | null;
  backdrop?: {
    __typename: "ModelBackdropConnection";
    items: Array<{
      __typename: "Backdrop";
      id: string;
      SessionID: string;
      static: boolean;
      createdAt: string;
      updatedAt: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
  shortUrl?: string | null;
  expiry?: number | null;
  scheduledAt?: number | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type GetSessionQuery = {
  __typename: "Session";
  id: string;
  files?: Array<{
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  } | null> | null;
  fileSize?: string | null;
  password?: string | null;
  passwordProtected?: boolean | null;
  mailInfo?: {
    __typename: "MailInfo";
    FromEmail: string;
    Recipients: Array<string | null>;
    Cc?: Array<string | null> | null;
    Bcc?: Array<string | null> | null;
    Subject: string;
    Title: string;
    Message: string;
  } | null;
  linkInfo?: {
    __typename: "LinkInfo";
    Title: string;
    Message: string;
  } | null;
  backdrop?: {
    __typename: "ModelBackdropConnection";
    items: Array<{
      __typename: "Backdrop";
      id: string;
      SessionID: string;
      static: boolean;
      createdAt: string;
      updatedAt: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
  shortUrl?: string | null;
  expiry?: number | null;
  scheduledAt?: number | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type ListSessionsQuery = {
  __typename: "ModelSessionConnection";
  items: Array<{
    __typename: "Session";
    id: string;
    files?: Array<{
      __typename: "S3Object";
      key: string;
      bucket: string;
      region: string;
      relativePath: string;
      size?: string | null;
    } | null> | null;
    fileSize?: string | null;
    password?: string | null;
    passwordProtected?: boolean | null;
    mailInfo?: {
      __typename: "MailInfo";
      FromEmail: string;
      Recipients: Array<string | null>;
      Cc?: Array<string | null> | null;
      Bcc?: Array<string | null> | null;
      Subject: string;
      Title: string;
      Message: string;
    } | null;
    linkInfo?: {
      __typename: "LinkInfo";
      Title: string;
      Message: string;
    } | null;
    backdrop?: {
      __typename: "ModelBackdropConnection";
      nextToken?: string | null;
    } | null;
    shortUrl?: string | null;
    expiry?: number | null;
    scheduledAt?: number | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null>;
  nextToken?: string | null;
};

export type GetBackdropQuery = {
  __typename: "Backdrop";
  id: string;
  SessionID: string;
  S3Object: {
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  };
  static: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type ListBackdropsQuery = {
  __typename: "ModelBackdropConnection";
  items: Array<{
    __typename: "Backdrop";
    id: string;
    SessionID: string;
    S3Object: {
      __typename: "S3Object";
      key: string;
      bucket: string;
      region: string;
      relativePath: string;
      size?: string | null;
    };
    static: boolean;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null>;
  nextToken?: string | null;
};

export type OnCreateSessionSubscription = {
  __typename: "Session";
  id: string;
  files?: Array<{
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  } | null> | null;
  fileSize?: string | null;
  password?: string | null;
  passwordProtected?: boolean | null;
  mailInfo?: {
    __typename: "MailInfo";
    FromEmail: string;
    Recipients: Array<string | null>;
    Cc?: Array<string | null> | null;
    Bcc?: Array<string | null> | null;
    Subject: string;
    Title: string;
    Message: string;
  } | null;
  linkInfo?: {
    __typename: "LinkInfo";
    Title: string;
    Message: string;
  } | null;
  backdrop?: {
    __typename: "ModelBackdropConnection";
    items: Array<{
      __typename: "Backdrop";
      id: string;
      SessionID: string;
      static: boolean;
      createdAt: string;
      updatedAt: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
  shortUrl?: string | null;
  expiry?: number | null;
  scheduledAt?: number | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnUpdateSessionSubscription = {
  __typename: "Session";
  id: string;
  files?: Array<{
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  } | null> | null;
  fileSize?: string | null;
  password?: string | null;
  passwordProtected?: boolean | null;
  mailInfo?: {
    __typename: "MailInfo";
    FromEmail: string;
    Recipients: Array<string | null>;
    Cc?: Array<string | null> | null;
    Bcc?: Array<string | null> | null;
    Subject: string;
    Title: string;
    Message: string;
  } | null;
  linkInfo?: {
    __typename: "LinkInfo";
    Title: string;
    Message: string;
  } | null;
  backdrop?: {
    __typename: "ModelBackdropConnection";
    items: Array<{
      __typename: "Backdrop";
      id: string;
      SessionID: string;
      static: boolean;
      createdAt: string;
      updatedAt: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
  shortUrl?: string | null;
  expiry?: number | null;
  scheduledAt?: number | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnDeleteSessionSubscription = {
  __typename: "Session";
  id: string;
  files?: Array<{
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  } | null> | null;
  fileSize?: string | null;
  password?: string | null;
  passwordProtected?: boolean | null;
  mailInfo?: {
    __typename: "MailInfo";
    FromEmail: string;
    Recipients: Array<string | null>;
    Cc?: Array<string | null> | null;
    Bcc?: Array<string | null> | null;
    Subject: string;
    Title: string;
    Message: string;
  } | null;
  linkInfo?: {
    __typename: "LinkInfo";
    Title: string;
    Message: string;
  } | null;
  backdrop?: {
    __typename: "ModelBackdropConnection";
    items: Array<{
      __typename: "Backdrop";
      id: string;
      SessionID: string;
      static: boolean;
      createdAt: string;
      updatedAt: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
  shortUrl?: string | null;
  expiry?: number | null;
  scheduledAt?: number | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnCreateBackdropSubscription = {
  __typename: "Backdrop";
  id: string;
  SessionID: string;
  S3Object: {
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  };
  static: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnUpdateBackdropSubscription = {
  __typename: "Backdrop";
  id: string;
  SessionID: string;
  S3Object: {
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  };
  static: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnDeleteBackdropSubscription = {
  __typename: "Backdrop";
  id: string;
  SessionID: string;
  S3Object: {
    __typename: "S3Object";
    key: string;
    bucket: string;
    region: string;
    relativePath: string;
    size?: string | null;
  };
  static: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async UpdateSession(
    input: UpdateSessionInput,
    condition?: ModelSessionConditionInput
  ): Promise<UpdateSessionMutation> {
    const statement = `mutation UpdateSession($input: UpdateSessionInput!, $condition: ModelSessionConditionInput) {
        updateSession(input: $input, condition: $condition) {
          __typename
          id
          files {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          fileSize
          password
          passwordProtected
          mailInfo {
            __typename
            FromEmail
            Recipients
            Cc
            Bcc
            Subject
            Title
            Message
          }
          linkInfo {
            __typename
            Title
            Message
          }
          backdrop {
            __typename
            items {
              __typename
              id
              SessionID
              static
              createdAt
              updatedAt
              owner
            }
            nextToken
          }
          shortUrl
          expiry
          scheduledAt
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateSessionMutation>response.data.updateSession;
  }
  async DeleteSession(
    input: DeleteSessionInput,
    condition?: ModelSessionConditionInput
  ): Promise<DeleteSessionMutation> {
    const statement = `mutation DeleteSession($input: DeleteSessionInput!, $condition: ModelSessionConditionInput) {
        deleteSession(input: $input, condition: $condition) {
          __typename
          id
          files {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          fileSize
          password
          passwordProtected
          mailInfo {
            __typename
            FromEmail
            Recipients
            Cc
            Bcc
            Subject
            Title
            Message
          }
          linkInfo {
            __typename
            Title
            Message
          }
          backdrop {
            __typename
            items {
              __typename
              id
              SessionID
              static
              createdAt
              updatedAt
              owner
            }
            nextToken
          }
          shortUrl
          expiry
          scheduledAt
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteSessionMutation>response.data.deleteSession;
  }
  async CreateBackdrop(
    input: CreateBackdropInput,
    condition?: ModelBackdropConditionInput
  ): Promise<CreateBackdropMutation> {
    const statement = `mutation CreateBackdrop($input: CreateBackdropInput!, $condition: ModelBackdropConditionInput) {
        createBackdrop(input: $input, condition: $condition) {
          __typename
          id
          SessionID
          S3Object {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          static
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateBackdropMutation>response.data.createBackdrop;
  }
  async UpdateBackdrop(
    input: UpdateBackdropInput,
    condition?: ModelBackdropConditionInput
  ): Promise<UpdateBackdropMutation> {
    const statement = `mutation UpdateBackdrop($input: UpdateBackdropInput!, $condition: ModelBackdropConditionInput) {
        updateBackdrop(input: $input, condition: $condition) {
          __typename
          id
          SessionID
          S3Object {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          static
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateBackdropMutation>response.data.updateBackdrop;
  }
  async DeleteBackdrop(
    input: DeleteBackdropInput,
    condition?: ModelBackdropConditionInput
  ): Promise<DeleteBackdropMutation> {
    const statement = `mutation DeleteBackdrop($input: DeleteBackdropInput!, $condition: ModelBackdropConditionInput) {
        deleteBackdrop(input: $input, condition: $condition) {
          __typename
          id
          SessionID
          S3Object {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          static
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteBackdropMutation>response.data.deleteBackdrop;
  }
  async CreateSession(
    input: CreateSessionInput,
    condition?: ModelSessionConditionInput
  ): Promise<CreateSessionMutation> {
    const statement = `mutation CreateSession($input: CreateSessionInput!, $condition: ModelSessionConditionInput) {
        createSession(input: $input, condition: $condition) {
          __typename
          id
          files {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          fileSize
          password
          passwordProtected
          mailInfo {
            __typename
            FromEmail
            Recipients
            Cc
            Bcc
            Subject
            Title
            Message
          }
          linkInfo {
            __typename
            Title
            Message
          }
          backdrop {
            __typename
            items {
              __typename
              id
              SessionID
              static
              createdAt
              updatedAt
              owner
            }
            nextToken
          }
          shortUrl
          expiry
          scheduledAt
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateSessionMutation>response.data.createSession;
  }
  async GetSession(id: string): Promise<GetSessionQuery> {
    const statement = `query GetSession($id: ID!) {
        getSession(id: $id) {
          __typename
          id
          files {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          fileSize
          password
          passwordProtected
          mailInfo {
            __typename
            FromEmail
            Recipients
            Cc
            Bcc
            Subject
            Title
            Message
          }
          linkInfo {
            __typename
            Title
            Message
          }
          backdrop {
            __typename
            items {
              __typename
              id
              SessionID
              static
              createdAt
              updatedAt
              owner
            }
            nextToken
          }
          shortUrl
          expiry
          scheduledAt
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetSessionQuery>response.data.getSession;
  }
  async ListSessions(
    filter?: ModelSessionFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListSessionsQuery> {
    const statement = `query ListSessions($filter: ModelSessionFilterInput, $limit: Int, $nextToken: String) {
        listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            files {
              __typename
              key
              bucket
              region
              relativePath
              size
            }
            fileSize
            password
            passwordProtected
            mailInfo {
              __typename
              FromEmail
              Recipients
              Cc
              Bcc
              Subject
              Title
              Message
            }
            linkInfo {
              __typename
              Title
              Message
            }
            backdrop {
              __typename
              nextToken
            }
            shortUrl
            expiry
            scheduledAt
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListSessionsQuery>response.data.listSessions;
  }
  async GetBackdrop(id: string): Promise<GetBackdropQuery> {
    const statement = `query GetBackdrop($id: ID!) {
        getBackdrop(id: $id) {
          __typename
          id
          SessionID
          S3Object {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          static
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetBackdropQuery>response.data.getBackdrop;
  }
  async ListBackdrops(
    filter?: ModelBackdropFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListBackdropsQuery> {
    const statement = `query ListBackdrops($filter: ModelBackdropFilterInput, $limit: Int, $nextToken: String) {
        listBackdrops(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            SessionID
            S3Object {
              __typename
              key
              bucket
              region
              relativePath
              size
            }
            static
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListBackdropsQuery>response.data.listBackdrops;
  }
  OnCreateSessionListener(
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateSession">>
  > {
    const statement = `subscription OnCreateSession($owner: String) {
        onCreateSession(owner: $owner) {
          __typename
          id
          files {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          fileSize
          password
          passwordProtected
          mailInfo {
            __typename
            FromEmail
            Recipients
            Cc
            Bcc
            Subject
            Title
            Message
          }
          linkInfo {
            __typename
            Title
            Message
          }
          backdrop {
            __typename
            items {
              __typename
              id
              SessionID
              static
              createdAt
              updatedAt
              owner
            }
            nextToken
          }
          shortUrl
          expiry
          scheduledAt
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateSession">>
    >;
  }

  OnUpdateSessionListener(
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateSession">>
  > {
    const statement = `subscription OnUpdateSession($owner: String) {
        onUpdateSession(owner: $owner) {
          __typename
          id
          files {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          fileSize
          password
          passwordProtected
          mailInfo {
            __typename
            FromEmail
            Recipients
            Cc
            Bcc
            Subject
            Title
            Message
          }
          linkInfo {
            __typename
            Title
            Message
          }
          backdrop {
            __typename
            items {
              __typename
              id
              SessionID
              static
              createdAt
              updatedAt
              owner
            }
            nextToken
          }
          shortUrl
          expiry
          scheduledAt
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateSession">>
    >;
  }

  OnDeleteSessionListener(
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteSession">>
  > {
    const statement = `subscription OnDeleteSession($owner: String) {
        onDeleteSession(owner: $owner) {
          __typename
          id
          files {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          fileSize
          password
          passwordProtected
          mailInfo {
            __typename
            FromEmail
            Recipients
            Cc
            Bcc
            Subject
            Title
            Message
          }
          linkInfo {
            __typename
            Title
            Message
          }
          backdrop {
            __typename
            items {
              __typename
              id
              SessionID
              static
              createdAt
              updatedAt
              owner
            }
            nextToken
          }
          shortUrl
          expiry
          scheduledAt
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteSession">>
    >;
  }

  OnCreateBackdropListener(
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateBackdrop">>
  > {
    const statement = `subscription OnCreateBackdrop($owner: String) {
        onCreateBackdrop(owner: $owner) {
          __typename
          id
          SessionID
          S3Object {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          static
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateBackdrop">>
    >;
  }

  OnUpdateBackdropListener(
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateBackdrop">>
  > {
    const statement = `subscription OnUpdateBackdrop($owner: String) {
        onUpdateBackdrop(owner: $owner) {
          __typename
          id
          SessionID
          S3Object {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          static
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateBackdrop">>
    >;
  }

  OnDeleteBackdropListener(
    owner?: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteBackdrop">>
  > {
    const statement = `subscription OnDeleteBackdrop($owner: String) {
        onDeleteBackdrop(owner: $owner) {
          __typename
          id
          SessionID
          S3Object {
            __typename
            key
            bucket
            region
            relativePath
            size
          }
          static
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (owner) {
      gqlAPIServiceArguments.owner = owner;
    }
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteBackdrop">>
    >;
  }
}
