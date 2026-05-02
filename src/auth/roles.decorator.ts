import { SetMetadata } from "@nestjs/common"

export const ROLE_KEYS = "roles"
export const Roles = (...roles: string[]) => SetMetadata(ROLE_KEYS, roles)