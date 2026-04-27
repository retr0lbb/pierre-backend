import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateProductDTO } from "./dto/create-product-dto";

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
}