import { Handler, prisma } from "../globals";

export const postHandler = {
  async list() {
    return await prisma.post.findMany({
      select: {
        id: true,
        author: true,
        content: true,
        replies: true,
      },
      take: 10,
    });
  },

  async getPostFromId(postId: number) {
    return await prisma.post.findFirst({
      select: {
        author: true,
        content: true,
        replies: true,
      },
      where: {
        id: postId,
      },
    });
  },

  async getPage(page: number) {
    const data = await prisma.post.findMany({
      select: {
        id: true,
        author: true,
        content: true,
        replies: true,
        parentId: true,
      },
      where: {
        parentId: null,
      },
      take: 10,
      skip: page * 10,
    });
    console.log(data);
    return data;
  },

  async read(id: number) {
    const result = await prisma.post.findUnique({
      where: { id: id },
      omit: {},
    });
    console.log(`READ ${id} => ${JSON.stringify(result)}`);
    return result;
  },

  async createPost(data: any, userId: number, respondingTo?: number) {
    const respond = respondingTo
      ? { parent: { connect: { id: respondingTo } } }
      : {};

    return await prisma.post.create({
      data: {
        author: { connect: { id: userId } },
        ...respond,
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
