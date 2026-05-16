import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { type CreateProductDTO, createProductDtoSchema } from './dto/create-product-dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { type GetProductOptions, getProductsOptionsSchema } from './dto/get-product-options.dto';

@Controller('products')
export class ProductsController {

    constructor (private readonly productsService: ProductsService){}
    
    @Get("/")
    async getProducts(@Query(new ZodValidationPipe(getProductsOptionsSchema)) body: GetProductOptions){
        const products = await this.productsService.getProducts(body)

        return {products}
    }

    @Post("/")
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard)
    async createProduct(@Body(new ZodValidationPipe(createProductDtoSchema)) body: CreateProductDTO){
        await this.productsService.createProduct(body)

        return { message: "product created with success" }
    }
}
