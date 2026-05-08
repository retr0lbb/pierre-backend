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

    describe("Get All Products", () => {
        it("should return all products in the correct format", async () => {

            prismaMock.product.findMany.mockResolvedValue([
                {
                    name: "Product A",
                    description: "Description A",
                    id: "1",
                    slug: "product-a"
                }
            ]);

            prismaMock.product.count.mockResolvedValue(100)

            const result = await productService.getProducts({page: 1, pageSize: 10});

            expect(result).toEqual({
                data: [
                    {
                        id: "1",
                        name: "Product A",
                        description: "Description A",
                        slug: "product-a"
                    },
                ],
                meta: {
                    total: 100,
                    perPage: 10,
                    currentPage: 1,
                    lastPage: 10
                }
            });


        });

        it("should return an empty array if no products are found", async () => {
            prismaMock.product.findMany.mockResolvedValue([]);
            prismaMock.product.count.mockResolvedValue(0);

            const result = await productService.getProducts({page: 1, pageSize: 10});

            expect(result).toEqual({data: [], meta: {currentPage: 1, lastPage: 0, perPage: 10, total: 0}});

        });
    });

    describe("get product variants", () => {
        it("should get all products variants if the product exists", async () => {
            prismaMock.product.findUnique.mockResolvedValue({id: "someId", name: "product name", slug: "product-name", description: "some desc", variants: []})
            
            const result = await productService.getProductVariants("someId")

            expect(result).toEqual({product: {
                id: "someId", 
                name: "product name", 
                slug: "product-name", 
                description: "some desc",
                variants: []
            }})
        })

        it("shoud throw not found error if product doesnot exists", async() => {
            prismaMock.product.findUnique.mockResolvedValue(null)

            await expect(productService.getProductVariants("null")).rejects.toThrow("Product Not found")
        })
    })
})