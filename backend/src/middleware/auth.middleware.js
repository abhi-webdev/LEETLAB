import jwt from "jsonwebtoken";
import {db} from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ msg: "Unauthorized - No token found" });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            return res.status(401).json({ msg: "Unauthorized - Invalid token" });
        }

        const user = await db.user.findUnique({
            where: {
                id: decoded.id,
            },
            select : {
                id : true,
                name : true,
                email : true,
                image : true,
                role : true
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "Unauthorized - User not found" });
        }
        req.user = user;

        next();
    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).json({ msg: "Error authenticating user" });
    }
}

