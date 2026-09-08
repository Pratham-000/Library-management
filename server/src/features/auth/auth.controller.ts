import {Request , Response} from "express";
import {registerSchema , loginSchema} from "./auth.schema"
import * as authService from "./auth.service"


export const register = async (req:Request , res:Response) =>
{
    const parsed = registerSchema.safeParse(req.body);
    if(!parsed.success)
    {
        return res.status(400).json({success: false , error : parsed.error.flatten() });
    }
    try{
    
        const {name , email , password} = parsed.data;
    const user = await authService.registerUser(name , email, password);
    res.status(201).json({success: true , data : user})

}   catch(err : any)
    {

        res.status(500).json({success: false , error : err.message});
    }
}

export const login = async (req:Request , res:Response) =>
{
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
    {
        return res.status(400).json({success: false , error : parsed.error.flatten() });
    }

    try {
        const {email , password} = parsed.data;
        const result = await authService.loginUser(email , password)
        res.status(200).json({success : true , data : result})


    } catch (err : any) {
        return res.status(400).json({success : false , error : err.message})
    }
};

export const getUser = async (req:Request , res:Response) =>
{
     res.status(200).json({ success: true, data: (req as any).user });
};

