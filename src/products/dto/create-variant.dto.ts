import {z} from "zod/v4"


export const createVariantSchema = z.object({
    sku: z.string().optional(),
    color: z.hex(),
    size: z.string(),
    price_in_cents: z.int().positive().nonnegative(),
    stock: z.int().positive()
})

const createVariantParamsSchema = z.object({
    productId: z.uuid()
})

export type CreateVariantDTO = z.infer<typeof createVariantSchema>

export type CreateVariantParamsDTO = z.infer<typeof createVariantParamsSchema>
