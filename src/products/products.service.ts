import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateProductDTO } from "./dto/create-product-dto";
import { CreateVariantDTO, CreateVariantParamsDTO } from "./dto/create-variant.dto";
import { GetProductOptions } from "./dto/get-product-options.dto";


@Injectable()
export class ProductsService{
    constructor (private prismaService: PrismaService){}

    async createProduct(payload: CreateProductDTO){
        const slugProductName = payload.name.toLowerCase().replace(" ", "-")
        
        const foundProduct = await this.prismaService.product.findUnique({
            where: {
                slug: slugProductName
            }
        })

        if(foundProduct){
            throw new BadRequestException("Product Already exists")
        }

        await this.prismaService.product.create({
            data: {
                description: payload.description,
                name: payload.name,
                slug: slugProductName
            }
        })
    }


    async createProductVariant(payload: CreateVariantDTO, {productId}: CreateVariantParamsDTO){

        const product = await this.prismaService.product.findUnique({
            where: {
                id: productId
            }
        })

        if(!product) {
            throw new NotFoundException("Product not found in database")
        }

        function skulify(data: {productName: string, color?: string, size?: string}){
            const skuString = `
                ${data.productName.slice(0, 3).toUpperCase()}
                ${data.size && `-${data.size.toUpperCase()}`}
                ${data.color && `-${data.color.slice(0, 3).toUpperCase()}`}
            `

            return skuString
        }

        await this.prismaService.productVariant.create({
            data: {
                productId: product.id,
                color: payload.color,
                price_in_cents: payload.price_in_cents,
                size: payload.size,
                sku: payload.sku || skulify({productName: "", color: payload.color, size: payload.size}),
                stock: payload.stock,
            }
        })

    }

    async getProducts(options: GetProductOptions){

        const page = Math.max(1, options.page)
        const pageSize = Math.min(50, options.pageSize)

        const numberOfSkip = (page -1) * pageSize

        const [products, numberOfProducts]  = await Promise.all([
            this.prismaService.product.findMany({
                where: {
                    name: {
                        contains: options.query,
                        mode: "insensitive"
                    }
                },
                take: pageSize,
                skip: numberOfSkip,
                orderBy: {
                    name: "asc"
                }
            }),
            this.prismaService.product.count({
                where: {
                    name: {
                        contains: options.query,
                        mode: "insensitive"
                    }
                }
            })
        ])

    
        return {
            data: products,
            meta: {
                total: numberOfProducts,
                perPage: pageSize,
                currentPage: page,
                lastPage: Math.ceil(numberOfProducts / pageSize)
            }
        }

    }

    async getProductsVariants(productId: string){
        throw new Error("Not implemented")
    }
}
