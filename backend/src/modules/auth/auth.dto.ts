export interface LoginDto {
  email?: string;
  password?: string;
  code?: string;
}

export interface AuthResponseDto {
  token: string;
  user: any;
}
