import { Request, Response, NextFunction } from "express";
import {
  createResourceSchema,
  UpdateResourceSchema,
} from "./resources.schema";
import * as resourcesService from "./resources.service";

type ResourceParams = {
  id: string;
};
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createResourceSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.flatten(),
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const resource = await resourcesService.createResource(
      parsed.data,
      req.user.id
    );

    return res
      .status(201)
      .location(`/api/resources/${resource.id}`)
      .json({
        success: true,
        data: resource,
      });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resources = await resourcesService.getAllResources();

    return res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request<ResourceParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const resource = await resourcesService.getResourceById(req.params.id);

    return res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request<ResourceParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = UpdateResourceSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.flatten(),
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const resource = await resourcesService.updateResource(
      req.params.id,
      parsed.data,
      req.user.id,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request<ResourceParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    await resourcesService.deleteResource(
      req.params.id,
      req.user.id,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};