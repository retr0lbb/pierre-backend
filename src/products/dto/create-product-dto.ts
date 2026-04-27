import z from "zod/v4"


export const createProductDtoSchema = z.object({
    name: z.string().min(3),
    description: z.string().nonempty()
})

export type CreateProductDTO = z.infer<typeof createProductDtoSchema>