 import {z} from 'zod';

 export const createResourceSchema = z.object({
    title: z.string().min(2),
    type : z.enum(["BOOK" , "PDF" , "LINK", "NOTE_MATERIAL"]),
    fileUrl : z.string().url().optional(),
    subject: z.string().optional(),

 });

 export const UpdateResourceSchema  = createResourceSchema.partial();