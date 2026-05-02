// prisma/prisma.mock.ts

const prismaBasics = {
  create: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}
export const prismaMock = {
  user: {...prismaBasics},

  product: {...prismaBasics},

  productVariant: {...prismaBasics},

  sessions: {...prismaBasics}

};
