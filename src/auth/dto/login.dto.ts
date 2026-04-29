import {z} from "zod"

export const loginUserSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(64).nonempty()
})


export type LoginUserDTO = z.infer<typeof loginUserSchema>