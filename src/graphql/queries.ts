/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSession = /* GraphQL */ `
  query GetSession($id: ID!) {
    getSession(id: $id) {
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
export const listSessions = /* GraphQL */ `
  query ListSessions(
    $filter: ModelSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getBackdrop = /* GraphQL */ `
  query GetBackdrop($id: ID!) {
    getBackdrop(id: $id) {
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
export const listBackdrops = /* GraphQL */ `
  query ListBackdrops(
    $filter: ModelBackdropFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBackdrops(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
