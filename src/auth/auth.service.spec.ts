import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service.js"
import { RegisterUserPayload } from "./dto/register.dto.js";
import { PrismaService } from "../prisma.service.js";
import { prismaMock } from "../../prisma/prisma.mock.js";

describe("AuthService", () => {
    let authService: AuthService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [AuthService, {
                provide: PrismaService,
                useValue: prismaMock
            }],
        }).compile();

        authService = moduleRef.get(AuthService)
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe("create User", () => {
        it("Shoud create an user successfully", async () => {
            const data: RegisterUserPayload = {
                email: "jhonDoe@mail.com",
                password: "123123",
                username: "jhondoe"
            }

            await authService.createUser(data)

            expect(authService.createUser).resolves.toHaveBeenCalledTimes(1)
        })
    })
})