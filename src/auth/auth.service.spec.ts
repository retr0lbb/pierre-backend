import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service"
import { RegisterUserPayload } from "./dto/register.dto";
import { PrismaService } from "../prisma.service";
import { prismaMock } from "../../prisma/prisma.mock";
import { EncryptService } from "../common/services/encrypt.service";
import { LoginUserDTO } from "./dto/login.dto";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/Jwt-strategy";
import { JwtService } from "@nestjs/jwt";

describe("AuthService", () => {
    let authService: AuthService;
    let encryptService: EncryptService

    beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [
        AuthService, 
        EncryptService,
        {
            provide: PrismaService,
            useValue: prismaMock
        },
        {
            provide: JwtService,
            useValue: {
            sign: jest.fn().mockReturnValue("fake-token")
            }
        }
        ]
    }).compile();

    authService = moduleRef.get(AuthService)
    encryptService = moduleRef.get(EncryptService)
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


    describe("Login user", () => {
        it("should login user with correct password", async() => {
            const data = {email: "jhonDoe@mail.com", password: "12341234"} as LoginUserDTO

            const hashedPassword = await encryptService.hash(data.password);

            prismaMock.user.findUnique.mockResolvedValue({
                username: "some",
                email: data.email,
                id: "some",
                passwordHash: hashedPassword
            });

            await authService.logUser(data)

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: {
                    email: data.email
                }
            })
        })
        

        it("Should throw not found error if user doesn't exists", async () =>{
            const data = {email: "jhonDoe@mail.com", password: "12341234"} as LoginUserDTO

            prismaMock.user.findUnique.mockResolvedValue(null)

            await expect(authService.logUser(data)).rejects.toThrow("User not found or Password not match")
        })

        it("Should return an error if the passwords dont match", async () => {
            const data = {email: "jhonDoe@mail.com", password: "12341234"} as LoginUserDTO
            const hashedPassword = await encryptService.hash("12312312");

            prismaMock.user.findUnique.mockResolvedValue({
                username: "some",
                email: data.email,
                id: "some",
                passwordHash: hashedPassword
            });

            await expect(authService.logUser(data)).rejects.toThrow("User not found or Password not match")
        })
    })
})