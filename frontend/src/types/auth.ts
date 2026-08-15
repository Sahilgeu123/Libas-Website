import type { ReactNode } from "react";

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
};

export type AuthContextType = {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
};

export type AuthProviderProps = {
  children: ReactNode;
};

export type RegistrationResponse = {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
  message?: string;
};

export type LoginResponse = {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
  message?: string;
};
