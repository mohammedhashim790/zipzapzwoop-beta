import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class S3Object {
  readonly key: string;
  readonly bucket: string;
  readonly region: string;
  readonly relativePath: string;
  readonly size?: string;
  constructor(init: ModelInit<S3Object>);
}

export declare class MailInfo {
  readonly FromEmail: string;
  readonly Recipients: (string | null)[];
  readonly Cc?: (string | null)[];
  readonly Bcc?: (string | null)[];
  readonly Subject: string;
  readonly Title: string;
  readonly Message: string;
  constructor(init: ModelInit<MailInfo>);
}

export declare class LinkInfo {
  readonly Title: string;
  readonly Message: string;
  constructor(init: ModelInit<LinkInfo>);
}

type SessionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type BackdropMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Session {
  readonly id: string;
  readonly files?: (S3Object | null)[];
  readonly fileSize?: string;
  readonly password?: string;
  readonly passwordProtected?: boolean;
  readonly mailInfo?: MailInfo;
  readonly linkInfo?: LinkInfo;
  readonly backdrop?: (Backdrop | null)[];
  readonly shortUrl?: string;
  readonly expiry?: number;
  readonly scheduledAt?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Session, SessionMetaData>);
  static copyOf(source: Session, mutator: (draft: MutableModel<Session, SessionMetaData>) => MutableModel<Session, SessionMetaData> | void): Session;
}

export declare class Backdrop {
  readonly id: string;
  readonly SessionID: string;
  readonly S3Object: S3Object;
  readonly static: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Backdrop, BackdropMetaData>);
  static copyOf(source: Backdrop, mutator: (draft: MutableModel<Backdrop, BackdropMetaData>) => MutableModel<Backdrop, BackdropMetaData> | void): Backdrop;
}