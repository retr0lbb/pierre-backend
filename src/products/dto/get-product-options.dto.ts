import z from "zod/v4"

export const getProductsOptionsSchema = z.object({
    page: z.coerce.number().min(1).positive().optional(),
    query: z.string().optional(),
    pageSize: z.coerce.number().max(50).min(5).optional()
})

export type GetProductOptions = z.infer<typeof getProductsOptionsSchema>