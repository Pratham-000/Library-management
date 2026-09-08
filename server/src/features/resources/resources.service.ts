import * as resourcesRepository from "./resources.repository";
import { AppError } from "../../utils/appError";

export const createResource = (data: any, uploadedBy: string) => {
  return resourcesRepository.createResource(data, uploadedBy);
};

export const getAllResources = () => {
  return resourcesRepository.getAllResources();
};

export const getResourceById = async (id: string) => {
  const resource = await resourcesRepository.getResourceById(id);

  if (!resource) {
    throw new AppError(`Resource with id ${id} not found`, 404);
  }

  return resource;
};

export const updateResource = async (
  id: string,
  data: any,
  userId: string,
  role: string
) => {
  const existing = await resourcesRepository.getResourceById(id);

  if (!existing) {
    throw new AppError(`Resource with id ${id} not found`, 404);
  }

  const isOwner = existing.uploadedById === userId;
  const isAdmin = role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new AppError(
      "You are not authorized to update this resource",
      403
    );
  }

  return resourcesRepository.updateResource(id, data);
};

export const deleteResource = async (
  id: string,
  userId: string,
  role: string
) => {
  const existing = await resourcesRepository.getResourceById(id);

  if (!existing) {
    throw new AppError(`Resource with id ${id} not found`, 404);
  }

  const isOwner = existing.uploadedById === userId;
  const isAdmin = role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new AppError(
      "You are not authorized to delete this resource",
      403
    );
  }

  return resourcesRepository.deleteResource(id);
};