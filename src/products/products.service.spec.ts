import { Test } from "@nestjs/testing";
import { PrismaService } from "../prisma.service";
import { prismaMock } from "../../prisma/prisma.mock";
import { ProductsService } from "./products.service";
import { CreateProductDTO } from "./dto/create-product-dto";
import { CreateVariantDTO } from "./dto/create-variant.dto";

describe("ProductsService", () => {
    let productService: ProductsService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [ProductsService, {
                provide: PrismaService,
                useValue: prismaMock
            }],
        }).compile();

        productService = moduleRef.get(ProductsService)
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe("create product Test", () => {
        it("Should create an product with no problems", async () => {
            const data = { description: "some random description", name: "t-shirt" } as CreateProductDTO

            prismaMock.product.findUnique.mockResolvedValue(null)
            prismaMock.product.create.mockResolvedValue({} as any)

            await productService.createProduct(data)

            expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
                where: { slug: "t-shirt" }
            })
            expect(prismaMock.product.create).toHaveBeenCalledWith({
                data: {
                    description: "some random description",
                    name: "t-shirt",
                    slug: "t-shirt"
                }
            })
        }) 

        it("Should throw if product already exists", async () => {
            const data = { description: "some random description", name: "t-shirt" } as CreateProductDTO

            prismaMock.product.findUnique.mockResolvedValue({ id: "1", slug: "t-shirt" } as any)

            await expect(productService.createProduct(data)).rejects.toThrow("Product Already exists")

            expect(prismaMock.product.create).not.toHaveBeenCalled()
        })

    })

    describe("Create product variants", () => {
        it("Should create an product variant if the product already exists", async () => {

            const data = {color: "BLACK", price_in_cents: 39900, size: "GG", stock: 100, sku: "CAMI-GG-BLU"} as CreateVariantDTO

            prismaMock.product.findUnique.mockResolvedValue({id: "some"})

            await productService.createProductVariant(data, { productId: "some" })

            expect(prismaMock.productVariant.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    color: "BLACK",
                    size: "GG",
                    stock: 100,
                    sku: "CAMI-GG-BLU",
                    price_in_cents: 39900,
                    productId: "some"
                })
            })
            expect(prismaMock.productVariant.create).toHaveBeenCalled()
        })

        it("Should not create and variant if the product does not exists", async() => {
            const data = {color: "BLACK", price_in_cents: 39900, size: "GG", stock: 100, sku: "CAMI-GG-BLU"} as CreateVariantDTO

            prismaMock.product.findUnique.mockResolvedValue(null)

            await expect(
                productService.createProductVariant(data, { productId: "some" })
            ).rejects.toThrow("Product not found in database")
        })
    })
})