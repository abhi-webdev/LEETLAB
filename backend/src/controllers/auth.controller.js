import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/index.js";

export const register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name)
            return res.status(400).json({ msg: "Please fill all fields" });
        const existingUser = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER,
            },
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.status(200).json({
            success: true,
            msg: "User created successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                image: newUser?.image,
            },
        });
    } catch (error) {
        console.log("Error creating user", error);

        res.status(400).json({
            error: "Error creating user",
            msg: error.message,
        });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password)
            return res.status(400).json({ msg: "Please fill all fields" });

        const user = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(400).json({ error: "user not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.status(200).json({
            success: true,
            msg: "User logged in successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user?.image,
            },
        });
    } catch (error) {
        console.log("Error logging user", error);

        res.status(400).json({
            error: "Error logging user",
            msg: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });

        res.status(203).json({
            success: true,
            msg: "logout successfully",
        });
    } catch (error) {
        console.log("Error logout user", error);

        res.status(400).json({
            error: "Error logout user",
            msg: error.message,
        });
    }
};
export const check = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User authenticate successfully",
            user: req.user,
        });
    } catch (error) {
        console.error("Error check user", error);

        res.status(400).json({ error: "Error check user", msg: error.message });
    }
};
