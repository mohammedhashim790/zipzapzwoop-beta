import {Auth} from "aws-amplify";

export enum cognitoAUTH{
  MFA,
  SMS_MFA,
  InvalidCred,
  UserNotFound,
  Success,
  NEW_PASSWORD_REQUIRED,
  Password_Reset_Required,
  FAILED,
  NotAuthorizedException
}

export enum AppSubscription{
  BASIC,
  FREEMIUM,
  STANDARD,
  PRO
}


export enum cognitoSignUpException{
  CodeDeliveryFailureException,
  InternalErrorException,
  InvalidEmailRoleAccessPolicyException,
  InvalidLambdaResponseException,
  InvalidParameterException,
  InvalidPasswordException,
  InvalidSmsRoleAccessPolicyException,
  InvalidSmsRoleTrustRelationshipException,
  NotAuthorizedException,
  ResourceNotFoundException,
  TooManyRequestsException,
  UnexpectedLambdaException,
  UserLambdaValidationException,
  UsernameExistsException,
  SUCCESS,
  FAILED,
}

export enum confirmSignUpException{
  AliasExistsException,
  CodeMismatchException,
  ExpiredCodeException,
  InternalErrorException,
  LimitExceededException,
  NotAuthorizedException,
  ResourceNotFoundException,
  TooManyFailedAttemptsException,
  TooManyRequestsException,
  UserNotFoundException,
  AuthError,
  SUCCESS,
  Failed,

}


export class Authentication{

  private static _instance:Authentication = new Authentication();

  private constructor() {

  }
  public static getInstance(): Authentication {
    if (!Authentication._instance) {
      Authentication._instance = new Authentication();
    }

    return Authentication._instance;
  }


  public AutoSignIn(){
    Auth.currentUserInfo()
  }


  public SignIn(username:string,password:string){

  }

  public ForgotPassword(username:string){

  }

  public ConfirmForgotPassword(username:string,code:string){

  }

  public ConfirmSignIn(username:string,code:string){

  }

  public SignUp(username:string,fullName:string,password:string){

  }

  public SignOut(){

  }

  public ResendCode(username:string){

  }

  public RememberDevice(){

  }

  public CurrentAuthenticatedUser(){

  }

  public UserSubscription():AppSubscription{
    return AppSubscription.BASIC;
  }

}
