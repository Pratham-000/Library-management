import {prisma} from '../../config/prisma';

type CreateNotebookData = {
    content : string;
    resourceId? : string;
    sessionId? : string;
}

type UpdateNotebookData = {
    content : string;
}

export const createNotebook = (
  data: CreateNotebookData,
  userId: string
) => {
  return prisma.note.create({
    data: {
      content: data.content,
      userId,
      resourceId: data.resourceId,
      sessionId: data.sessionId,
    },
    include: {
      resource: {
        select: {
          id: true,
          title: true,
          type: true,
        },
      },
      session: true,
    },
  });
};

export const getNotebookByuserId = (userId : string) => {
    return prisma.note.findMany({
        where : {
            userId,
        },
        include : {
            resource : {
                select : {
                    id : true,
                    title : true,
                    type : true,
                }
            },
            session : true,
        },
        orderBy : {
            createdAt : 'desc',
        },
    });
};



export const getNotebookById = (id : string) => {
    return prisma.note.findUnique({
        where : {
            id,
        },
        include : {
            resource : {
                select : {
                    id : true,
                    title : true,
                    type : true,
                },
            },
            session : true,
        },
    });
};

export const updateNotebook = (
  id: string,
  data: UpdateNotebookData
) => {
  return prisma.note.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteNotebook = (id: string) => {
  return prisma.note.delete({
    where: {
      id,
    },
  });
};