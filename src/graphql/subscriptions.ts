/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSession = /* GraphQL */ `
  subscription OnCreateSession($owner: String) {
    onCreateSession(owner: $owner) {
      id
      files {
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
        FromEmail
        Recipients
        Cc
        Bcc
        Subject
        Title
        Message
      }
      linkInfo {
        Title
        Message
      }
      backdrop {
        items {
          id
          SessionID
          S3Object {
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
      shortUrl
      expiry
      scheduledAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateSession = /* GraphQL */ `
  subscription OnUpdateSession($owner: String) {
    onUpdateSession(owner: $owner) {
      id
      files {
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
        FromEmail
        Recipients
        Cc
        Bcc
        Subject
        Title
        Message
      }
      linkInfo {
        Title
        Message
      }
      backdrop {
        items {
          id
          SessionID
          S3Object {
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
      shortUrl
      expiry
      scheduledAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteSession = /* GraphQL */ `
  subscription OnDeleteSession($owner: String) {
    onDeleteSession(owner: $owner) {
      id
      files {
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
        FromEmail
        Recipients
        Cc
        Bcc
        Subject
        Title
        Message
      }
      linkInfo {
        Title
        Message
      }
      backdrop {
        items {
          id
          SessionID
          S3Object {
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
      shortUrl
      expiry
      scheduledAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateBackdrop = /* GraphQL */ `
  subscription OnCreateBackdrop($owner: String) {
    onCreateBackdrop(owner: $owner) {
      id
      SessionID
      S3Object {
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
  }
`;
export const onUpdateBackdrop = /* GraphQL */ `
  subscription OnUpdateBackdrop($owner: String) {
    onUpdateBackdrop(owner: $owner) {
      id
      SessionID
      S3Object {
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
  }
`;
export const onDeleteBackdrop = /* GraphQL */ `
  subscription OnDeleteBackdrop($owner: String) {
    onDeleteBackdrop(owner: $owner) {
      id
      SessionID
      S3Object {
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
  }
`;
