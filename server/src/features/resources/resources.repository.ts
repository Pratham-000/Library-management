import {prisma} from "../../config/prisma";

export const createResource = (data: any, uploadedBy: string) => {
  return prisma.resource.create({
    data: { ...data, uploadedById: uploadedBy },
  });
};

export const getAllResources = () => {
  return prisma.resource.findMany();
};

export const getResourceById = (id: string) => {
  return prisma.resource.findUnique({ where: { id } });
};

export const updateResource = (id: string, data: any) => {
  return prisma.resource.update({ where: { id }, data });
};

export const deleteResource = (id: string) => {
  return prisma.resource.delete({ where: { id } });
};