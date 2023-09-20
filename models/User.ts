export interface User {
  id: number;
  username: string;
  role: string;
  email: string;
  password: string; //dokud to nezahashuju a neodstraním z tohohle interfacu tak nemám klidný spaní
}

export interface AdminCredentialsType {
  username: string;
  password: string;
}
