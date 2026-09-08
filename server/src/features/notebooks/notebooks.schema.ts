import {z} from "zod";

export const createNotebookSchema = z.object({
    content : z
        .string()
        .trim()
        .min(1, {message : "Notebook content cannot be empty"}) 
        .max(10000, {message : "Notebook content cannot exceed 10000 characters"}),
        
        resourceId : z
        .string()
        .uuid()
        .optional(),

        sessionId : z
        .string()
        .uuid()
        .optional(),
});

export const updateNotebookSchema = z.object({
    content : z
        .string()
        .trim()
        .min(1, {message : "Notebook content cannot be empty"}) 
        .max(10000, {message : "Notebook content cannot exceed 10000 characters"}),
});
