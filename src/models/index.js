// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Session, Backdrop, S3Object, MailInfo, LinkInfo } = initSchema(schema);

export {
  Session,
  Backdrop,
  S3Object,
  MailInfo,
  LinkInfo
};