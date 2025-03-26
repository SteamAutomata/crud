import { User } from "@prisma/client";
import { Handler, prisma } from "../globals";

export const userHandler = {
  async list() {
    return await prisma.user.findMany({
      select: {
        avatar: true,
        name: true,
        role: true,
        id: true,
      },
      take: 10,
    });
  },

  async read(id: number) {
    const result = await prisma.user.findUnique({
      where: { id: id },
      omit: { password: true },
    });
    console.log(`READ ${id} => ${JSON.stringify(result)}`);
    return result;
  },

  async create(data: any) {
    return await prisma.user.create({
      data: {
        password: "123456",
        ...data,
      },
    });
  },

  async update(id: number, data: any) {
    console.log(`UPDATE ${id} => ${data}`);
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  },
};
