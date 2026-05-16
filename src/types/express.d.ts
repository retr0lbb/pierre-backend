// src/types/express.d.ts
import { AuthUser } from './auth.types';

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}

export {}; // necessário para o TS tratar como módulo