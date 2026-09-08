import * as notebooksRepository from './notebooks.repository';
import {AppError} from "../../utils/appError";


type createNotebookData = {
    content : string,
    resourceId? : string,
    sessionId? : string,
};

type updateNotebookData = {
    content : string,
};
// ````````````````````````````````````````````````````````
export const createNotebook = (
    data: createNotebookData,
    userId: string
) => {
    if (!data.content) {
        throw new AppError('Content is required', 400);
    }

    return notebooksRepository.createNotebook(data, userId);
}
// ````````````````````````````````````````````````````````
export const getMyNotebooks = (userId: string) => {
    return notebooksRepository.getNotebookByuserId(userId);
}
// ````````````````````````````````````````````````````````

export const getNotebookById = async (
    id : string,
    userId : string,
    role : string
) => {
    const notebook = await notebooksRepository.getNotebookById(id);

    if (!notebook) {
        throw new AppError('Notebook with id ${id} not found', 404);
    }

    if (notebook.userId !== userId && role !== 'ADMIN') {
        throw new AppError('You do not have permission to access this notebook', 403);
    };

    return notebook;
}

// ``````````````````````````````````````````````````````

export const updateNotebook = async (
    id : string,
    data : updateNotebookData,
    userId : String,
    role : String
) => {
    const notebook = await notebooksRepository.getNotebookById(id);

    if (!notebook) {
        throw new AppError('Notebook with id ${id} not found', 404);
    }

    if (notebook.userId !== userId && role !== 'ADMIN') {
        throw new AppError('You do not have permission to update this notebook', 403);
    }

    return notebooksRepository.updateNotebook(id, data);
};

// ``````````````````````````````````````````````````````

export const deleteNotebook = async (
    id : string,
    userId : String,
    role : String
) => {
    const notebook = await notebooksRepository.getNotebookById(id);

    if (!notebook) {
        throw new AppError('Notebook with id ${id} not found', 404);
    }

    if (notebook.userId !== userId && role !== 'ADMIN') {
        throw new AppError('You do not have permission to delete this notebook', 403);
    }

    return notebooksRepository.deleteNotebook(id);
};
// `````````````````````````````````````````````````````````
