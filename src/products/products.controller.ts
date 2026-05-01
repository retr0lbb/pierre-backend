import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { type CreateProductDTO, createProductDtoSchema } from './dto/create-product-dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('products')
export class ProductsController {

    constructor (private readonly productsService: ProductsService){}
    
    @Get("/")
    async getProducts(){
        throw new Error("Not implemented Yet")
    }

    @Post("/")
    @UseGuards(JwtAuthGuard)
    async createProduct(@Body(new ZodValidationPipe(createProductDtoSchema)) body: CreateProductDTO){
        await this.productsService.createProduct(body)

        return { message: "product created with success" }
    }
}
