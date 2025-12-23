import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};
