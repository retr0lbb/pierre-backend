import z from "zod"

export const registerUserPayloadSchema = z.object({
    username: z.string().nonempty().min(2),
    email: z.email(),
    password: z.string().min(8).max(64).nullable(),
    loginProvider: z.union([z.literal("LOCAL"), z.literal("GOOGLE")])
})

export type RegisterUserPayload = z.infer<typeof registerUserPayloadSchema>