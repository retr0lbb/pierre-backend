// src/types/auth.types.ts

import { LoginProvider, Roles } from "../generated/prisma/enums";

export interface JwtUserPayload {
  userId: string;
  username: string;
}

export interface JwtRefreshUserPayload {
  userId: string;
}

export interface GoogleUserPayload {
  id: string;
  username: string;
  email: string;
  loginProvider: LoginProvider;
  role: Roles;
  passwordHash: string | null;
}

// União geral para o Express.User
export type AuthUser = JwtUserPayload | JwtRefreshUserPayload | GoogleUserPayload;