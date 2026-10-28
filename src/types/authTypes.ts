import { UrlWithStringQuery } from "url";

export interface IAuthCredentials {
  email: string;
  password: string;
}

export interface IAuthResponse {
  message: string;
}

export interface IRegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
}
