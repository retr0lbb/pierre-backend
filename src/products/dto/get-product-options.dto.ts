import z from "zod/v4"

const getProductsOptionsSchema = z.object({
    page: z.coerce.number(),
    query: z.string().optional(),
    pageSize: z.coerce.number()
})

export type GetProductOptions = z.infer<typeof getProductsOptionsSchema>