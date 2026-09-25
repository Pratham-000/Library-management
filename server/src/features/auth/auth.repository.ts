import {prisma} from "../../config/prisma"

export const createUser = (data : {
    name: string,
    email: string,
    password: string
}) => {
    return prisma.user.create({data})
};

export const findUserByEmail = (email: string) => {
    return prisma.user.findUnique({
        where: {
            email
        }
    })
}

export const updateUserName = (id: string, name: string) => {
    return prisma.user.update({ where: { id }, data: { name } });
};

export const findUserById = (id: string) => {
    return prisma.user.findUnique({
        where: {
            id
        }
    })
}

export const fibdUerById = (id: string) => {
    return prisma.user.findUnique({
        where: {
            id
        }
    })
};
