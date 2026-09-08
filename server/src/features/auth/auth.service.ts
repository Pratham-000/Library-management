import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authRepor from "./auth.repository";

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key' as string;

export const registerUser = async (name: string, email: string, password: string) => {
    const existingUser = await authRepor.findUserByEmail(email);
    if(existingUser) throw new Error('User already exists');
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await authRepor.createUser({ name, email, password: hashedPassword });
        return {
            id : user.id,
            name: user.name,
            email: user.email
        };
}

export const loginUser = async (email: string, password: string) => {
    const user = await authRepor.findUserByEmail(email);
    if(!user) throw new Error('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) throw new Error('Invalid password');

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}
