export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  status: string;
  code: number;
  message: string;
  success: boolean;
  roleId: string;
  userId: number;
}

export interface CredentialResponse {
  access_token: string;
  authuser: string;
  expires_in: number;
  prompt: string;
  scope: string;
  token_type: string;
}

export interface GoogleUserInfo {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  sub: string;
}
