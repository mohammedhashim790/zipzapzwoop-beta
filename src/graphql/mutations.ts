/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateSession = /* GraphQL */ `
  mutation UpdateSession(
    $input: UpdateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    updateSession(input: $input, condition: $condition) {
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
export const deleteSession = /* GraphQL */ `
  mutation DeleteSession(
    $input: DeleteSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    deleteSession(input: $input, condition: $condition) {
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
export const createBackdrop = /* GraphQL */ `
  mutation CreateBackdrop(
    $input: CreateBackdropInput!
    $condition: ModelBackdropConditionInput
  ) {
    createBackdrop(input: $input, condition: $condition) {
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
export const updateBackdrop = /* GraphQL */ `
  mutation UpdateBackdrop(
    $input: UpdateBackdropInput!
    $condition: ModelBackdropConditionInput
  ) {
    updateBackdrop(input: $input, condition: $condition) {
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
export const deleteBackdrop = /* GraphQL */ `
  mutation DeleteBackdrop(
    $input: DeleteBackdropInput!
    $condition: ModelBackdropConditionInput
  ) {
    deleteBackdrop(input: $input, condition: $condition) {
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
export const createSession = /* GraphQL */ `
  mutation CreateSession(
    $input: CreateSessionInput!
    $condition: ModelSessionConditionInput
  ) {
    createSession(input: $input, condition: $condition) {
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
