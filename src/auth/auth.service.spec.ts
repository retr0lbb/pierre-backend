import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service"
import { RegisterUserPayload } from "./dto/register.dto";
import { PrismaService } from "../prisma.service";
import { prismaMock } from "../../prisma/prisma.mock";
import { EncryptService } from "../encrypt/encrypt.service";

describe("AuthService", () => {
    let authService: AuthService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [AuthService, {
                provide: PrismaService,
                useValue: prismaMock
            }, {
                provide: EncryptService,
                useValue: new EncryptService()
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

            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    email: data.email,
                    username: data.username,
                }),
            });
        })

        it("should throw an error if user already exists", async () => {
            const data: RegisterUserPayload = {
                email: "jhonDoe@mail.com",
                password: "123123",
                username: "jhondoe"
            };

            prismaMock.user.findUnique.mockResolvedValue(data);

            await expect(authService.createUser(data))
                .rejects
                .toThrow("an user with this email already exists");
        });
    })
})