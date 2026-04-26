import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      role: string;
    }
  }
}

const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  // Read Bearer token first
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // fallback cookie token
    token = req.cookies["session_id"];
  }

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized - No token",
    });
  }

  try {
    console.log("Received Token:", token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.log("JWT Verify Error:", error);

    return res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
  }
};

export default verifyToken;