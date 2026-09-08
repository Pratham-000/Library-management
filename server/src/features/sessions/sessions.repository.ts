import {prisma} from "../../config/prisma"

const sessionInclude = {
    resource : {
        select : {
            id : true,
            title : true,
            type : true,
        },
    },
    notes: true,
} as const;

export const sessionsRepository = {
  create(data: {
    userId: string;
    resourceId?: string;
  }) {
    return prisma.studySession.create({
      data: {
        userId: data.userId,
        resourceId: data.resourceId,
      },
      include: sessionInclude,
    });
  },
// `````````````````````````````````````````````````````````
findAllByUserId(userId: string) {
    return prisma.studySession.findMany({
        where: {
            userId,
        },
        orderBy: {
            startTime: "desc",
        },
        include: sessionInclude,
    });
    },
// ````````````````````````````````````````````````````````

findByIdAndUserId(id: string, userId: string) {
    return prisma.studySession.findFirst({
        where: {
                id,
                userId,
        },
        include: sessionInclude,
    });
},
// ````````````````````````````````````````````````````````

update (id : string, data:{
    status : "COMPLETED" | "CANCELLED";
    endTime?: Date;
    durationMinutes?: number;
}) {
    return prisma.studySession.update({
        where: {
            id,
        },
        data,
        include : sessionInclude,
});
},
// ````````````````````````````````````````````````````````

delete (id: string) {
    return prisma.studySession.delete({
        where: {
            id,
        },
    });
}
};

