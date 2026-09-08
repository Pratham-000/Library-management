import 
{
    Request,
    Response,
    NextFunction
}
from "express"

import {
    createNotebookSchema,
    updateNotebookSchema,
}
from './notebooks.schema'

import * as notebooksService from './notebooks.service';

type notebookParams = {
    id : string,
};

export const create = async (
    req : Request,
    res : Response,
    next : NextFunction
) => {
    try {
        const parsed = createNotebookSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                error : parsed.error.format(),
            });
        }
        if(!req.user) {
            return res.status(401).json({
                success: false,
                error : 'Unauthorized',
            });
        }

        const notebook = await notebooksService.createNotebook(parsed.data, req.user.id);

        return res.status(201).json({
            success: true,
            data : notebook,
        });
    }
    catch (error) {
        next(error);
    }
};
// ``````````````````````````````````````````````````````

export const getAll = async (
    req : Request,
    res : Response,
    next : NextFunction
) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                error : 'Unauthorized',
            });
        }
        
        const notebooks = await notebooksService.getMyNotebooks(req.user.id); 

        return res.status(200).json({
            success: true,
            data : notebooks,
        });
    }
    catch (error) {
        next(error);
    }
}

// ``````````````````````````````````````````````````````

export const getById = async (
    req : Request<notebookParams>,
    res : Response,
    next : NextFunction
) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                error : 'Unauthorized',
            });
        }

        const notebook = await notebooksService.getNotebookById(req.params.id, req.user.id, req.user.role);

        return res.status(200).json({
            success: true,
            data : notebook,
        });
    }
    catch (error) {
        next(error);
    }
}

// ``````````````````````````````````````````````````````

export const update = async (
    req : Request<notebookParams>,
    res : Response,
    next : NextFunction
) => {
    try {
        const parsed = updateNotebookSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                error : parsed.error.format(),
            });
        }

        if(!req.user) {
            return res.status(401).json({
                success: false,
                error : 'Unauthorized',
            });
        }

        const notebook = await notebooksService.updateNotebook(req.params.id, parsed.data, req.user.id, req.user.role);     

        return res.status(200).json({
            status : true,
            data : notebook,
        });
    }
    catch (error) {
        next(error);
    }
};
// `````````````````````````````````````````````````````

export const remove = async (
    req : Request<notebookParams>,
    res : Response,
    next : NextFunction
) => {
    try {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                error : 'Unauthorized',
            });
        }

        await notebooksService.deleteNotebook(req.params.id, req.user.id, req.user.role);

        return res.status(200).json({
            status : true,
            message : 'Notebook deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};

// ```````````````````````````````````````````````````````
