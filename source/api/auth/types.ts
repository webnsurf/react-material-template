export interface AuthRegisterRequest {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}
