import { Test } from "@nestjs/testing";
import { PrismaService } from "../prisma.service";
import { prismaMock } from "../../prisma/prisma.mock";
import { ProductsService } from "./products.service";
import { CreateProductDTO } from "./dto/create-product-dto";

describe("AuthService", () => {
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
        it("Should create an product with no problems", async() => {
            const data = {description: "some random description", name: "t-shirt"} as CreateProductDTO


        })    
    })
})